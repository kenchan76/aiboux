import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

type LineWebhookPayload = {
  events?: LineEvent[];
};

type LineEvent = {
  type: string;
  replyToken?: string;
  source?: {
    userId?: string;
  };
  message?: {
    type: string;
    text?: string;
  };
};

type LineTenantMapping = {
  line_user_id: string;
  tenant_id: string;
  is_admin: number;
  tenant_name: string;
};

type CustomerMaster = {
  id: string;
  customer_name: string;
  bank_account_kana: string | null;
};

type ProductMaster = {
  id: string;
  name: string;
  selling_price: number;
  current_stock: number;
};

type IntentResult = {
  intent: 'audit_sales' | 'stock_status' | 'create_draft' | 'unknown';
  period: 'current_month' | 'last_month' | 'latest';
  customerHint: string;
  productHint: string;
  quantity: number;
};

type SalesSummary = {
  total_orders: number | null;
  total_sales: number | null;
};

type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

type DraftOrder = {
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  items: OrderItem[];
};

const intentSchema = {
  type: 'OBJECT',
  properties: {
    intent: { type: 'STRING', enum: ['audit_sales', 'stock_status', 'create_draft', 'unknown'] },
    period: { type: 'STRING', enum: ['current_month', 'last_month', 'latest'] },
    customerHint: { type: 'STRING' },
    productHint: { type: 'STRING' },
    quantity: { type: 'INTEGER' },
  },
  required: ['intent', 'period', 'customerHint', 'productHint', 'quantity'],
};

export const POST: APIRoute = async ({ request }) => {
  const rawBody = await request.text();

  try {
    const lineToken = getEnvString('LINE_CHANNEL_ACCESS_TOKEN');
    const lineSecret = getEnvString('LINE_CHANNEL_SECRET');
    const geminiKey = getEnvString('GEMINI_API_KEY');

    if (!env.DB || !lineToken || !lineSecret) {
      return new Response('Missing configuration bindings', { status: 500 });
    }

    const signature = request.headers.get('x-line-signature') ?? '';
    const verified = await verifyLineSignature(rawBody, signature, lineSecret);
    if (!verified) {
      return new Response('Invalid LINE signature', { status: 401 });
    }

    const payload = JSON.parse(rawBody) as LineWebhookPayload;
    const events = Array.isArray(payload.events) ? payload.events : [];
    await Promise.all(events.map((event) => handleLineEvent(event, lineToken, geminiKey)));

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('LINE webhook failed.', {
      message: error instanceof Error ? error.message : String(error),
    });
    return new Response('Internal Server Error', { status: 500 });
  }
};

async function handleLineEvent(event: LineEvent, lineToken: string, geminiKey: string): Promise<void> {
  if (event.type !== 'message' || event.message?.type !== 'text') return;

  const lineUserId = event.source?.userId ?? '';
  const replyToken = event.replyToken ?? '';
  const userText = event.message.text?.trim() ?? '';
  if (!lineUserId || !replyToken || !userText) return;

  const mapping = await env.DB.prepare(
    `
    SELECT
      mapping.line_user_id,
      mapping.tenant_id,
      mapping.is_admin,
      tenant.name AS tenant_name
    FROM b2b_line_tenant_mappings mapping
    JOIN tenants tenant
      ON tenant.id = mapping.tenant_id
    WHERE mapping.line_user_id = ?
      AND mapping.is_admin = 1
      AND tenant.status = 'active'
      AND tenant.is_active = 1
    LIMIT 1
    `,
  )
    .bind(lineUserId)
    .first<LineTenantMapping>();

  if (!mapping) {
    await sendLineReply(
      lineToken,
      replyToken,
      `AIBOUXシステムへの登録が確認できません。管理画面の「LINE連携設定」から、このアカウントを紐付けてください。\n\nあなたのLINE ID: ${lineUserId}`,
    );
    return;
  }

  const [customersResult, productsResult] = await Promise.all([
    env.DB.prepare(
      'SELECT id, customer_name, bank_account_kana FROM b2b_customers WHERE tenant_id = ? ORDER BY updated_at DESC LIMIT 200',
    )
      .bind(mapping.tenant_id)
      .all<CustomerMaster>(),
    env.DB.prepare(
      'SELECT id, name, selling_price, current_stock FROM b2b_products WHERE tenant_id = ? AND is_active = 1 ORDER BY updated_at DESC LIMIT 200',
    )
      .bind(mapping.tenant_id)
      .all<ProductMaster>(),
  ]);

  const customers = customersResult.results;
  const products = productsResult.results;
  const intent = await analyzeIntent(geminiKey, userText, mapping.tenant_id, customers, products);

  if (intent.intent === 'audit_sales') {
    const reply = await handleAuditSales(geminiKey, mapping.tenant_id, intent.period);
    await sendLineReply(lineToken, replyToken, reply);
    return;
  }

  if (intent.intent === 'stock_status') {
    const reply = buildStockStatusReply(products, intent.productHint);
    await sendLineReply(lineToken, replyToken, reply);
    return;
  }

  if (intent.intent === 'create_draft') {
    const draft = await createDraftInvoice(mapping.tenant_id, lineUserId, userText, intent, customers, products);
    if (!draft) {
      await sendLineReply(lineToken, replyToken, '取引先または商品を特定できませんでした。例:「山田さんに塩ラーメン10個作って」のように送ってください。');
      return;
    }

    await sendLineReply(lineToken, replyToken, buildDraftReply(draft));
    return;
  }

  await sendLineReply(lineToken, replyToken, 'AIBOUX LINEコンソールです。「今月の売上教えて」または「山田さんに塩ラーメン10個作って」と話しかけてください。');
}

async function analyzeIntent(
  apiKey: string,
  text: string,
  tenantId: string,
  customers: CustomerMaster[],
  products: ProductMaster[],
): Promise<IntentResult> {
  if (!apiKey) return fallbackIntent(text);

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{
          text: [
            'You are AIBOUX LINE command intent parser.',
            'Return strict JSON only. Never use data outside the tenant-safe masters.',
            'Supported intents:',
            '- audit_sales: sales audit/report requests such as 売上教えて, 今月いくら, 先月の売上',
            '- stock_status: stock check requests such as 在庫状況, 現在庫確認, ラーメンの在庫',
            '- create_draft: draft invoice/order creation such as 山田さんに塩ラーメン10個作って',
            '- unknown: anything else',
            `Tenant ID: ${tenantId}`,
            `Customer masters: ${JSON.stringify(customers.map((customer) => ({ id: customer.id, name: customer.customer_name, kana: customer.bank_account_kana })))}`,
            `Product masters: ${JSON.stringify(products.map((product) => ({ id: product.id, name: product.name, price: product.selling_price, stock: product.current_stock })))}`,
            `User text: ${text}`,
          ].join('\n'),
        }],
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: intentSchema,
      },
    }),
  });

  if (!response.ok) return fallbackIntent(text);

  const json = await response.json<Record<string, unknown>>();
  const raw = (((json.candidates as Array<Record<string, unknown>> | undefined)?.[0]?.content as Record<string, unknown> | undefined)?.parts as Array<Record<string, unknown>> | undefined)
    ?.map((part) => part.text)
    .find((value): value is string => typeof value === 'string');
  const parsed = parseJsonObject(raw);
  if (!parsed) return fallbackIntent(text);

  const intent = normalizeIntentName(parsed.intent);
  return {
    intent,
    period: normalizePeriod(parsed.period, text),
    customerHint: normalizeString(parsed.customerHint),
    productHint: normalizeString(parsed.productHint),
    quantity: normalizePositiveInteger(parsed.quantity, extractQuantity(text)),
  };
}

async function handleAuditSales(apiKey: string, tenantId: string, period: IntentResult['period']): Promise<string> {
  const range = getSalesRange(period);
  const row = await env.DB.prepare(
    `
    SELECT COUNT(id) AS total_orders, COALESCE(SUM(total_amount), 0) AS total_sales
    FROM b2b_invoices
    WHERE tenant_id = ?
      AND billing_status = 'paid'
      AND status <> 'void'
      AND created_at >= ?
      AND created_at <= ?
    `,
  )
    .bind(tenantId, range.start, range.end)
    .first<SalesSummary>();

  const totalSales = Number(row?.total_sales ?? 0);
  const totalOrders = Number(row?.total_orders ?? 0);
  return generateSalesReply(apiKey, range.label, totalSales, totalOrders);
}

function buildStockStatusReply(products: ProductMaster[], productHint: string): string {
  if (products.length === 0) {
    return '現在、確認できる有効な商品マスタがありません。管理画面から商品を登録してください。';
  }

  const target = findBestProduct(productHint, products);
  const displayProducts = target
    ? [target]
    : [...products]
      .sort((left, right) => Number(left.current_stock) - Number(right.current_stock))
      .slice(0, 10);

  const lines = displayProducts.map((product) => {
    const stock = Number(product.current_stock ?? 0);
    const mark = stock <= 0 ? '在庫切れ' : stock <= 10 ? '少なめ' : '在庫あり';
    return `・${product.name}: ${stock.toLocaleString('ja-JP')}個（${mark}）`;
  });

  return [
    target ? '指定商品の現在庫です。' : '現在庫の少ない順に確認しました。',
    '',
    ...lines,
  ].join('\n');
}

async function createDraftInvoice(
  tenantId: string,
  lineUserId: string,
  rawText: string,
  intent: IntentResult,
  customers: CustomerMaster[],
  products: ProductMaster[],
): Promise<DraftOrder | null> {
  const customer = findBestCustomer(intent.customerHint || rawText, customers) ?? customers[0] ?? null;
  const product = findBestProduct(intent.productHint || rawText, products);
  if (!customer || !product) return null;

  const quantity = Math.min(999, Math.max(1, intent.quantity || extractQuantity(rawText)));
  const totalAmount = Number(product.selling_price) * quantity;
  const invoiceId = `inv_line_${crypto.randomUUID()}`;
  const invoiceNumber = `LINE-${Date.now()}`;
  const item: OrderItem = {
    productId: product.id,
    productName: product.name,
    quantity,
    unitPrice: Number(product.selling_price),
  };
  const invoiceJson = JSON.stringify({
    source: 'line',
    line_user_id: lineUserId,
    raw_text: rawText,
    intent,
    items: [item],
  });

  await env.DB.batch([
    env.DB.prepare(
      `
      INSERT INTO b2b_invoices (
        id, tenant_id, customer_id, invoice_number, invoice_type, billing_status, status,
        title, customer_name, total_amount, invoice_json
      )
      VALUES (?, ?, ?, ?, 'provisional', 'unpaid', 'provisional', '仮納品書', ?, ?, ?)
      `,
    ).bind(invoiceId, tenantId, customer.id, invoiceNumber, customer.customer_name, totalAmount, invoiceJson),
    env.DB.prepare(
      `
      INSERT INTO b2b_invoice_items (
        id, tenant_id, invoice_id, product_id, product_name, quantity, unit_price, line_total
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).bind(`line_item_${crypto.randomUUID()}`, tenantId, invoiceId, product.id, product.name, quantity, product.selling_price, totalAmount),
  ]);

  return {
    invoiceId,
    invoiceNumber,
    customerId: customer.id,
    customerName: customer.customer_name,
    totalAmount,
    items: [item],
  };
}

async function generateSalesReply(apiKey: string, label: string, totalSales: number, totalOrders: number): Promise<string> {
  const fallback = `${label}の確定売上は ${totalSales.toLocaleString('ja-JP')}円（${totalOrders}件）です。数字が積み上がっています。今日もこの調子でいきましょう。`;
  if (!apiKey) return fallback;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{
          text: `対象: ${label}\n確定売上: ${totalSales}円\n件数: ${totalOrders}件\n経営者がスマホで一瞬で把握でき、少し前向きになれる日本語の報告文を2行以内で作成してください。`,
        }],
      }],
    }),
  });

  if (!response.ok) return fallback;
  const json = await response.json<Record<string, unknown>>();
  const text = (((json.candidates as Array<Record<string, unknown>> | undefined)?.[0]?.content as Record<string, unknown> | undefined)?.parts as Array<Record<string, unknown>> | undefined)
    ?.map((part) => part.text)
    .find((value): value is string => typeof value === 'string' && value.trim().length > 0);
  return text?.trim().slice(0, 900) || fallback;
}

function buildDraftReply(draft: DraftOrder): string {
  const detail = draft.items.map((item) => `・${item.productName} × ${item.quantity}個 = ${(item.quantity * item.unitPrice).toLocaleString('ja-JP')}円`).join('\n');
  return [
    `${draft.customerName}様への下書き伝票を起票しました。`,
    '',
    detail,
    '',
    `合計 ${draft.totalAmount.toLocaleString('ja-JP')}円`,
    `伝票番号: ${draft.invoiceNumber}`,
    'PC管理画面の中カラムにも反映されます。',
  ].join('\n');
}

async function sendLineReply(token: string, replyToken: string, text: string): Promise<void> {
  const response = await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: 'text', text: text.slice(0, 4900) }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('LINE reply failed.', { status: response.status, body: errorText.slice(0, 500) });
  }
}

async function verifyLineSignature(rawBody: string, signature: string, secret: string): Promise<boolean> {
  if (!signature || !secret) return false;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody));
  const expected = arrayBufferToBase64(signed);
  return constantTimeEqual(signature.trim(), expected);
}

function fallbackIntent(text: string): IntentResult {
  if (/売上|うりあげ|月商|集計|いくら|監査/.test(text)) {
    return {
      intent: 'audit_sales',
      period: normalizePeriod('', text),
      customerHint: '',
      productHint: '',
      quantity: 1,
    };
  }
  if (/在庫|ざいこ|ストック|stock|棚卸|残数|何個/.test(text)) {
    return {
      intent: 'stock_status',
      period: 'latest',
      customerHint: '',
      productHint: extractProductHint(text),
      quantity: 1,
    };
  }
  if (/作って|おいて|発注|注文|用意|起票|伝票/.test(text)) {
    return {
      intent: 'create_draft',
      period: 'latest',
      customerHint: extractCustomerHint(text),
      productHint: extractProductHint(text),
      quantity: extractQuantity(text),
    };
  }
  return { intent: 'unknown', period: 'latest', customerHint: '', productHint: '', quantity: 1 };
}

function findBestCustomer(hint: string, customers: CustomerMaster[]): CustomerMaster | null {
  const normalizedHint = normalizeSearchText(hint);
  if (!normalizedHint) return null;
  return customers
    .map((customer) => ({ customer, score: scoreCandidate(normalizedHint, normalizeSearchText(customer.customer_name), normalizeSearchText(customer.bank_account_kana ?? '')) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)[0]?.customer ?? null;
}

function findBestProduct(hint: string, products: ProductMaster[]): ProductMaster | null {
  const normalizedHint = normalizeSearchText(hint);
  if (!normalizedHint) return products[0] ?? null;
  return products
    .map((product) => ({ product, score: scoreCandidate(normalizedHint, normalizeSearchText(product.name)) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)[0]?.product ?? products.find((product) => /塩|ラーメン/.test(hint) && /塩|ラーメン/.test(product.name)) ?? null;
}

function scoreCandidate(hint: string, ...candidates: string[]): number {
  let best = 0;
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (candidate === hint) best = Math.max(best, 100);
    if (candidate.includes(hint) || hint.includes(candidate)) best = Math.max(best, 80 + Math.min(candidate.length, hint.length));
    for (const token of splitSearchTokens(hint)) {
      if (token.length >= 2 && candidate.includes(token)) best = Math.max(best, 20 + token.length);
    }
  }
  return best;
}

function splitSearchTokens(value: string): string[] {
  return value.split(/[、,.\s　]+/).flatMap((part) => {
    const tokens = [part];
    if (part.includes('塩')) tokens.push('塩');
    if (part.includes('ラーメン')) tokens.push('ラーメン');
    if (part.includes('山田')) tokens.push('山田');
    return tokens;
  }).filter(Boolean);
}

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/さん|様|さま|御中|いつもの|あれ|これ|それ|作って|おいて|発注|注文|用意|個|箱|点|本|枚|食/g, '')
    .replace(/株式会社|有限会社|合同会社|商店|フーズ|公司|㈱|㈲/g, '')
    .replace(/[^\p{Letter}\p{Number}ー一-龠ぁ-んァ-ヶ]/gu, '')
    .trim();
}

function getSalesRange(period: IntentResult['period']): { start: number; end: number; label: string } {
  const now = new Date();
  const firstDay = period === 'last_month'
    ? new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0)
    : new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const lastDay = period === 'last_month'
    ? new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
    : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return {
    start: firstDay.getTime(),
    end: lastDay.getTime(),
    label: `${firstDay.getFullYear()}年${firstDay.getMonth() + 1}月`,
  };
}

function normalizeIntentName(value: unknown): IntentResult['intent'] {
  if (value === 'audit_sales' || value === 'stock_status' || value === 'create_draft' || value === 'unknown') return value;
  return 'unknown';
}

function normalizePeriod(value: unknown, text: string): IntentResult['period'] {
  if (value === 'current_month' || value === 'last_month' || value === 'latest') return value;
  if (/先月|前月/.test(text)) return 'last_month';
  if (/今月|当月|売上/.test(text)) return 'current_month';
  return 'latest';
}

function extractCustomerHint(text: string): string {
  const matched = text.match(/(.+?)(さん|様|さま|商店|フーズ|会社)/);
  return matched?.[0] ?? '';
}

function extractProductHint(text: string): string {
  const withoutCustomer = text.replace(/^.+?(さん|様|さま)に/, '');
  return withoutCustomer.replace(/\d+\s*(個|箱|点|本|枚|食)?.*$/, '').trim();
}

function extractQuantity(value: string): number {
  const matched = value.match(/(\d+)\s*(個|箱|点|本|枚|食|ケース)?/);
  if (!matched) return 1;
  return normalizePositiveInteger(matched[1], 1);
}

function normalizePositiveInteger(value: unknown, fallback: number): number {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseJsonObject(value: string | undefined): Record<string, unknown> | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getEnvString(key: keyof Cloudflare.Env): string {
  const value = env[key];
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function constantTimeEqual(left: string, right: string): boolean {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let diff = leftBytes.length ^ rightBytes.length;
  for (let index = 0; index < length; index += 1) {
    diff |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return diff === 0;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
