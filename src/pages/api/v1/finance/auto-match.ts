import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { requestGeminiStructuredJson } from '../../../../lib/server/gemini';
import { resolveTenantFromRequest, tenantJsonError } from '../../../../lib/server/tenantContext';

export const prerender = false;

type UnpaidInvoiceRow = {
  invoice_id: string;
  invoice_number: string;
  total_amount: number;
  customer_id: string | null;
  customer_name: string;
  bank_account_kana: string | null;
};

type DepositRow = {
  depositedAt: string;
  payerName: string;
  amount: number;
};

type MatchRow = {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  payerName: string;
  matchReason: string;
  confidence: number;
};

type MatchResult = {
  matches: MatchRow[];
};

const matchSchema = {
  type: 'object',
  properties: {
    matches: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          invoiceId: { type: 'string' },
          invoiceNumber: { type: 'string' },
          customerName: { type: 'string' },
          amount: { type: 'integer' },
          payerName: { type: 'string' },
          matchReason: { type: 'string' },
          confidence: { type: 'number' },
        },
        required: ['invoiceId', 'invoiceNumber', 'customerName', 'amount', 'payerName', 'matchReason', 'confidence'],
      },
    },
  },
  required: ['matches'],
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await resolveTenantFromRequest(request);
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return Response.json({ success: false, error: '入金明細ファイルが必要です。' }, { status: 400 });
    }

    const csvText = await file.text();
    const unpaid = await env.DB.prepare(
      `
      SELECT
        i.id AS invoice_id,
        i.invoice_number,
        i.total_amount,
        i.customer_id,
        i.customer_name,
        c.bank_account_kana
      FROM b2b_invoices i
      LEFT JOIN b2b_customers c
        ON c.tenant_id = i.tenant_id
       AND c.id = i.customer_id
      WHERE i.tenant_id = ?
        AND i.billing_status = 'unpaid'
        AND i.status <> 'void'
      ORDER BY i.created_at ASC
      LIMIT 500
      `,
    )
      .bind(tenant.tenantId)
      .all<UnpaidInvoiceRow>();

    const unpaidInvoices = unpaid.results.map(normalizeInvoice).filter((row): row is UnpaidInvoiceRow => row !== null);
    if (unpaidInvoices.length === 0) {
      return Response.json({ success: true, matched: 0, message: '照合が必要な未払い請求書はありません。', details: [] });
    }

    const deposits = parseDeposits(csvText);
    const fallbackMatches = matchDepositsLocally(deposits, unpaidInvoices);
    const aiResult = await requestGeminiStructuredJson<MatchResult>(
      [
        'You are AIBOUX payment reconciliation engine.',
        'Match bank deposit rows to unpaid invoices only within the provided tenant-safe data.',
        'Use payer kana/name normalization for Japanese bank names. Ignore corporate suffix noise such as カ), (カ, ｶ), ユ), and spaces.',
        'Only return a match when amount is exact and payer/customer identity is very likely.',
        `Bank statement text:\n${csvText.slice(0, 60000)}`,
        `Parsed deposits fallback:\n${JSON.stringify(deposits.slice(0, 200))}`,
        `Unpaid invoices:\n${JSON.stringify(unpaidInvoices)}`,
      ].join('\n\n'),
      matchSchema,
      { matches: fallbackMatches },
    );

    const safeMatches = dedupeAndValidateMatches(aiResult.matches, unpaidInvoices, deposits);
    if (safeMatches.length === 0) {
      await logReconciliation(tenant.tenantId, file, [], '名義と金額が一致する入金データが見つかりませんでした。');
      return Response.json({
        success: true,
        matched: 0,
        message: '名義と金額が一致する入金データが見つかりませんでした。',
        details: [],
      });
    }

    const paidAt = Date.now();
    const statements: D1PreparedStatement[] = [];
    for (const match of safeMatches) {
      statements.push(
        env.DB.prepare(
          `
          UPDATE b2b_invoices
          SET billing_status = 'paid',
              updated_at = ?
          WHERE tenant_id = ?
            AND id = ?
            AND billing_status = 'unpaid'
          `,
        ).bind(paidAt, tenant.tenantId, match.invoiceId),
      );
    }
    statements.push(buildReconciliationLogStatement(tenant.tenantId, file, safeMatches, `${safeMatches.length}件の請求書を自動消込しました。`));
    await env.DB.batch(statements);

    return Response.json({
      success: true,
      matched: safeMatches.length,
      message: `${safeMatches.length}件の請求書を自動消込（入金済み処理）しました。`,
      details: safeMatches,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TenantResolutionError') return tenantJsonError(error);
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'Auto match failed.' }, { status: 500 });
  }
};

function normalizeInvoice(value: UnpaidInvoiceRow): UnpaidInvoiceRow | null {
  const amount = Number(value.total_amount);
  if (!value.invoice_id || !Number.isSafeInteger(amount) || amount <= 0) return null;
  return {
    invoice_id: value.invoice_id,
    invoice_number: String(value.invoice_number ?? ''),
    total_amount: amount,
    customer_id: value.customer_id,
    customer_name: String(value.customer_name ?? ''),
    bank_account_kana: value.bank_account_kana,
  };
}

function parseDeposits(text: string): DepositRow[] {
  const rows: DepositRow[] = [];
  for (const line of text.split(/\r?\n/).slice(0, 2000)) {
    const cells = parseCsvLine(line);
    if (cells.length < 2) continue;
    const amountIndex = cells.findIndex((cell) => parseAmount(cell) > 0);
    if (amountIndex < 0) continue;
    const amount = parseAmount(cells[amountIndex]);
    const payerName = cells
      .filter((_, index) => index !== amountIndex)
      .map((cell) => cell.trim())
      .filter((cell) => cell && !isDateLike(cell))
      .sort((left, right) => right.length - left.length)[0] ?? '';
    if (!payerName) continue;
    rows.push({
      depositedAt: cells.find(isDateLike) ?? '',
      payerName,
      amount,
    });
  }
  return rows;
}

function matchDepositsLocally(deposits: DepositRow[], invoices: UnpaidInvoiceRow[]): MatchRow[] {
  const matches: MatchRow[] = [];
  const usedInvoices = new Set<string>();
  for (const deposit of deposits) {
    const payer = normalizeBankName(deposit.payerName);
    const candidates = invoices.filter((invoice) => invoice.total_amount === deposit.amount && !usedInvoices.has(invoice.invoice_id));
    const matched = candidates.find((invoice) => {
      const kana = normalizeBankName(invoice.bank_account_kana ?? '');
      const name = normalizeBankName(invoice.customer_name);
      return (kana && (payer.includes(kana) || kana.includes(payer))) || (name && (payer.includes(name) || name.includes(payer)));
    });
    if (!matched) continue;
    usedInvoices.add(matched.invoice_id);
    matches.push({
      invoiceId: matched.invoice_id,
      invoiceNumber: matched.invoice_number,
      customerName: matched.customer_name,
      amount: matched.total_amount,
      payerName: deposit.payerName,
      matchReason: '金額一致、および振込人名義と得意先カナの正規化一致',
      confidence: 0.92,
    });
  }
  return matches;
}

function dedupeAndValidateMatches(matches: MatchRow[], invoices: UnpaidInvoiceRow[], deposits: DepositRow[]): MatchRow[] {
  const invoiceMap = new Map(invoices.map((invoice) => [invoice.invoice_id, invoice]));
  const depositAmounts = new Set(deposits.map((deposit) => deposit.amount));
  const used = new Set<string>();
  const safe: MatchRow[] = [];
  for (const match of Array.isArray(matches) ? matches : []) {
    const invoiceId = String(match.invoiceId ?? '').trim();
    if (!invoiceId || used.has(invoiceId)) continue;
    const invoice = invoiceMap.get(invoiceId);
    if (!invoice) continue;
    const amount = Number(match.amount);
    if (amount !== invoice.total_amount || !depositAmounts.has(amount)) continue;
    used.add(invoiceId);
    safe.push({
      invoiceId,
      invoiceNumber: invoice.invoice_number,
      customerName: invoice.customer_name,
      amount,
      payerName: String(match.payerName ?? ''),
      matchReason: String(match.matchReason ?? 'AI照合'),
      confidence: clamp(Number(match.confidence), 0, 1),
    });
  }
  return safe;
}

function buildReconciliationLogStatement(tenantId: string, file: File, matches: MatchRow[], message: string): D1PreparedStatement {
  return env.DB.prepare(
    'INSERT INTO b2b_ai_command_logs (id, tenant_id, command_text, function_name, arguments_json, result_json) VALUES (?, ?, ?, ?, ?, ?)',
  ).bind(
    `cmd_${crypto.randomUUID()}`,
    tenantId,
    `入金消込: ${file.name}`,
    'auto_match_bank_deposits',
    JSON.stringify({ fileName: file.name, fileSize: file.size, fileType: file.type || 'text/csv' }),
    JSON.stringify({ message, matched: matches.length, matches }),
  );
}

async function logReconciliation(tenantId: string, file: File, matches: MatchRow[], message: string): Promise<void> {
  await buildReconciliationLogStatement(tenantId, file, matches, message).run();
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells.map((cell) => cell.replace(/^"|"$/g, '').trim());
}

function parseAmount(value: string): number {
  const normalized = value.replace(/[^\d-]/g, '');
  const parsed = Number.parseInt(normalized, 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 0;
}

function normalizeBankName(value: string): string {
  return value
    .normalize('NFKC')
    .toUpperCase()
    .replace(/[()\[\]（）［］\s　.．・･]/g, '')
    .replace(/ｶﾌﾞｼｷｶﾞｲｼﾔ|カブシキガイシャ|株式会社|ユウゲンガイシャ|有限会社|ゴウドウガイシャ|合同会社/g, '')
    .replace(/^[ｶカ][）)]?/, '')
    .replace(/[（(]?[ｶカ]$/, '')
    .replace(/[（(]?[ﾕユ]$/, '')
    .replace(/[（(]?[ﾄﾞド]$/, '')
    .trim();
}

function isDateLike(value: string): boolean {
  return /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/.test(value.trim()) || /^\d{8}$/.test(value.trim());
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}
