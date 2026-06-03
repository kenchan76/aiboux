import type { APIRoute } from 'astro';
import { csvDownloadResponse, toCsv, withUtf8Bom } from '../../../../lib/server/csv';
import { resolveTenantFromRequest, tenantJsonError } from '../../../../lib/server/tenantContext';
import { env } from 'cloudflare:workers';

export const prerender = false;

type ReceiptRow = {
  transaction_date: string;
  partner_name: string;
  amount: number;
  tax_amount: number;
  debit_account: string;
  credit_account: string;
  memo: string;
};

const vendors = new Set(['moneyforward', 'freee', 'yayoi', 'kaikeioh']);

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await resolveTenantFromRequest(request);
    const url = new URL(request.url);
    const vendor = normalizeVendor(url.searchParams.get('vendor'));
    const encoding = url.searchParams.get('encoding') === 'utf8' ? 'utf8' : 'utf8bom';
    const from = normalizeDate(url.searchParams.get('from')) ?? '1900-01-01';
    const to = normalizeDate(url.searchParams.get('to')) ?? '2999-12-31';

    const rows = await env.DB.prepare(
      'SELECT transaction_date, partner_name, amount, tax_amount, debit_account, credit_account, memo FROM b2b_sales_receipts WHERE tenant_id = ? AND transaction_date >= ? AND transaction_date <= ? ORDER BY transaction_date ASC LIMIT 10000',
    )
      .bind(tenant.tenantId, from, to)
      .all<ReceiptRow>();

    const csv = toCsv(mapRows(vendor, rows.results));
    const body = encoding === 'utf8bom' ? withUtf8Bom(csv) : csv;
    return csvDownloadResponse(`${vendor}-journal-${from}-${to}.csv`, body);
  } catch (error) {
    if (error instanceof Error && error.name === 'TenantResolutionError') return tenantJsonError(error);
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'Journal export failed.' }, { status: 500 });
  }
};

function mapRows(vendor: string, rows: ReceiptRow[]): Array<Array<string | number>> {
  if (vendor === 'freee') {
    return [
      ['発生日', '収支区分', '管理番号', '勘定科目', '決済期日', '取引先', '品目', '金額', '税区分', '備考'],
      ...rows.map((row, index) => [
        row.transaction_date,
        inferFreeeIncomeExpense(row),
        `AIBOUX-${String(index + 1).padStart(6, '0')}`,
        inferFreeeAccount(row),
        row.transaction_date,
        row.partner_name,
        row.memo || row.partner_name,
        row.amount,
        inferTaxCategory(row),
        row.memo,
      ]),
    ];
  }

  if (vendor === 'yayoi') {
    return [
      ['識別フラグ', '伝票番号', '決算期', '取引日付', '借方勘定科目', '借方補助科目', '借方税区分', '借方金額', '貸方勘定科目', '貸方補助科目', '貸方税区分', '貸方金額', '摘要', 'タイプ'],
      ...rows.map((row, index) => [
        2000,
        index + 1,
        '',
        row.transaction_date.replaceAll('-', '/'),
        row.debit_account,
        '',
        inferTaxCategory(row),
        row.amount,
        row.credit_account,
        '',
        inferTaxCategory(row),
        row.amount,
        buildMemo(row),
        0,
      ]),
    ];
  }

  if (vendor === 'kaikeioh') {
    return [
      ['日付', '伝票番号', '借方科目コード', '借方科目名', '借方補助名', '借方金額', '貸方科目コード', '貸方科目名', '貸方補助名', '貸方金額', '摘要'],
      ...rows.map((row, index) => [
        row.transaction_date.replaceAll('-', '/'),
        index + 1,
        accountCode(row.debit_account),
        row.debit_account,
        '',
        row.amount,
        accountCode(row.credit_account),
        row.credit_account,
        '',
        row.amount,
        buildMemo(row),
      ]),
    ];
  }

  return [
    ['取引日', '借方勘定科目', '借方補助科目', '借方税区分', '借方金額', '貸方勘定科目', '貸方補助科目', '貸方税区分', '貸方金額', '摘要'],
    ...rows.map((row) => [
      row.transaction_date,
      row.debit_account,
      '',
      inferTaxCategory(row),
      row.amount,
      row.credit_account,
      '',
      inferTaxCategory(row),
      row.amount,
      buildMemo(row),
    ]),
  ];
}

function normalizeVendor(value: string | null): string {
  const vendor = value?.trim().toLowerCase() ?? 'moneyforward';
  const aliases: Record<string, string> = {
    mf: 'moneyforward',
    money_forward: 'moneyforward',
    moneyforward: 'moneyforward',
    マネーフォワード: 'moneyforward',
    freee: 'freee',
    yayoi: 'yayoi',
    弥生: 'yayoi',
    弥生会計: 'yayoi',
    kaikeioh: 'kaikeioh',
    会計王: 'kaikeioh',
  };
  const normalized = aliases[vendor] ?? vendor;
  return vendors.has(normalized) ? normalized : 'moneyforward';
}

function normalizeDate(value: string | null): string | null {
  const text = value?.trim() ?? '';
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null;
}

function inferTaxCategory(row: ReceiptRow): string {
  return Number(row.tax_amount) > 0 ? '課税売上10%' : '対象外';
}

function buildMemo(row: ReceiptRow): string {
  return [row.partner_name, row.memo].map((value) => value?.trim()).filter(Boolean).join(' ');
}

function inferFreeeIncomeExpense(row: ReceiptRow): '収入' | '支出' {
  return row.credit_account.includes('売上') || row.debit_account.includes('売掛') || row.debit_account.includes('現金') ? '収入' : '支出';
}

function inferFreeeAccount(row: ReceiptRow): string {
  return inferFreeeIncomeExpense(row) === '収入' ? row.credit_account : row.debit_account;
}

function accountCode(accountName: string): string {
  const map: Record<string, string> = {
    現金: '100',
    普通預金: '111',
    売掛金: '120',
    買掛金: '331',
    売上高: '500',
    仕入高: '600',
    消耗品費: '754',
    雑費: '899',
  };
  return map[accountName] ?? '999';
}
