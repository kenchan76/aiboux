import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { toCsv, withUtf8Bom } from '../../../../lib/server/csv';
import { requestGeminiFunctionCall } from '../../../../lib/server/gemini';
import { createShippingCsv, type ShippingInvoiceRow } from '../../../../lib/server/shippingCsv';
import { runTripleSyncSimulation } from '../../../../lib/server/testStockConcurrency';
import { resolveTenantFromRequest, tenantJsonError } from '../../../../lib/server/tenantContext';

export const prerender = false;

type SalesRow = { orders: number; total: number };
type InvoiceRow = { id: string; invoice_number: string; customer_name: string; total_amount: number; status: string };
type CustomerRow = { id: string; customer_name: string; ai_confidence_threshold: number };
type ProductRow = { id: string; name: string; selling_price: number };

const functionDeclarations = [
  {
    name: 'simulate_stock_concurrency',
    description: 'EC、POS、B2B出荷が同時に走る在庫一元化の整合性テストを実行する',
    parameters: {
      type: 'object',
      properties: {
        product_hint: { type: 'string' },
      },
      required: ['product_hint'],
    },
  },
  {
    name: 'create_provisional_invoice',
    description: '曖昧な口頭指示から得意先と商品をマスタ照合し、下書き伝票を作成する',
    parameters: {
      type: 'object',
      properties: {
        customer_hint: { type: 'string' },
        product_hint: { type: 'string' },
        quantity: { type: 'integer' },
      },
      required: ['customer_hint', 'product_hint', 'quantity'],
    },
  },
  {
    name: 'get_sales_report',
    description: '指定月の売上件数と売上合計をD1から集計する',
    parameters: {
      type: 'object',
      properties: { month: { type: 'string', description: 'YYYY-MM' } },
      required: ['month'],
    },
  },
  {
    name: 'convert_to_delivery_invoice',
    description: '下書き伝票を正式な納品書へ変換する',
    parameters: {
      type: 'object',
      properties: { invoice_id: { type: 'string' } },
      required: ['invoice_id'],
    },
  },
  {
    name: 'export_shipping_csv',
    description: 'ヤマトまたは佐川向けの送り状CSVを生成する',
    parameters: {
      type: 'object',
      properties: { carrier: { type: 'string', enum: ['yamato', 'sagawa'] } },
      required: ['carrier'],
    },
  },
];

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await resolveTenantFromRequest(request);
    const body = await request.json<Record<string, unknown>>();
    const commandText = normalizeString(body.commandText || body.text);

    if (!commandText) {
      return Response.json({ success: false, error: '`commandText` is required.' }, { status: 400 });
    }

    const functionCall = await requestGeminiFunctionCall(commandText, { tenant_id: tenant.tenantId, tenant_slug: tenant.slug }, functionDeclarations);
    if (!functionCall) {
      return Response.json({ success: false, error: 'No executable function was selected.' }, { status: 422 });
    }

    const result = await executeFunction(tenant.tenantId, functionCall.name, functionCall.args);

    await env.DB.prepare(
      'INSERT INTO b2b_ai_command_logs (id, tenant_id, command_text, function_name, arguments_json, result_json) VALUES (?, ?, ?, ?, ?, ?)',
    )
      .bind(`cmd_${crypto.randomUUID()}`, tenant.tenantId, commandText, functionCall.name, JSON.stringify(functionCall.args), JSON.stringify(result))
      .run();

    if (functionCall.name === 'export_shipping_csv' && typeof result.csvBase64 === 'string' && typeof result.fileName === 'string') {
      return Response.json({
        success: true,
        function_name: functionCall.name,
        csvBase64: result.csvBase64,
        fileName: result.fileName,
        count: result.count ?? 0,
        result,
      });
    }

    return Response.json({ success: true, function_name: functionCall.name, result });
  } catch (error) {
    if (error instanceof Error && error.name === 'TenantResolutionError') return tenantJsonError(error);
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'Voice command failed.' }, { status: 500 });
  }
};

async function executeFunction(tenantId: string, name: string, args: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (name === 'simulate_stock_concurrency') {
    const productHint = normalizeString(args.product_hint) || 'ラーメン';
    const product = await env.DB.prepare(
      'SELECT id, name, current_stock FROM b2b_products WHERE tenant_id = ? AND name LIKE ? AND is_active = 1 ORDER BY updated_at DESC LIMIT 1',
    )
      .bind(tenantId, `%${productHint}%`)
      .first<{ id: string; name: string; current_stock: number }>();

    if (!product) {
      return { simulated: false, message: `「${productHint}」に一致する商品が見つかりませんでした。` };
    }

    const beforeStock = Number(product.current_stock);
    const simulation = await runTripleSyncSimulation(env.DB, tenantId, product.id);
    return {
      simulated: true,
      product_id: product.id,
      product_name: product.name,
      before_stock: beforeStock,
      expected_delta: -9,
      expected_stock: beforeStock - 9,
      ...simulation,
      message: `${product.name} の在庫一元化テストを実行しました。開始 ${beforeStock}、期待値 ${beforeStock - 9}、DB最終値 ${simulation.finalStockInDatabase} です。`,
    };
  }

  if (name === 'create_provisional_invoice') {
    const customerHint = normalizeString(args.customer_hint);
    const productHint = normalizeString(args.product_hint);
    const quantity = normalizePositiveInteger(args.quantity, 1);

    const customer = await env.DB.prepare(
      'SELECT id, customer_name, ai_confidence_threshold FROM b2b_customers WHERE tenant_id = ? AND customer_name LIKE ? ORDER BY ai_confidence_threshold DESC LIMIT 1',
    )
      .bind(tenantId, `%${customerHint || '山田'}%`)
      .first<CustomerRow>();
    const product = await env.DB.prepare(
      'SELECT id, name, selling_price FROM b2b_products WHERE tenant_id = ? AND name LIKE ? AND is_active = 1 ORDER BY updated_at DESC LIMIT 1',
    )
      .bind(tenantId, `%${productHint || '塩ラーメン'}%`)
      .first<ProductRow>();

    if (!customer || !product) {
      return { created: false, message: '得意先または商品をマスタから特定できませんでした。', customer_found: Boolean(customer), product_found: Boolean(product) };
    }

    const invoiceId = `inv_${crypto.randomUUID()}`;
    const invoiceNumber = `PV-${Date.now()}`;
    const totalAmount = Number(product.selling_price) * quantity;
    const invoiceJson = {
      customer_id: customer.id,
      customer_name: customer.customer_name,
      items: [{ product_id: product.id, product_name: product.name, quantity, unit_price: product.selling_price, line_total: totalAmount }],
      ai_resolution: {
        customer_hint: customerHint,
        product_hint: productHint,
        confidence_threshold: customer.ai_confidence_threshold,
      },
    };

    await env.DB.prepare(
      "INSERT INTO b2b_invoices (id, tenant_id, invoice_number, status, title, customer_name, total_amount, invoice_json) VALUES (?, ?, ?, 'provisional', '仮納品書', ?, ?, ?)",
    )
      .bind(invoiceId, tenantId, invoiceNumber, customer.customer_name, totalAmount, JSON.stringify(invoiceJson))
      .run();

    return {
      created: true,
      invoice_id: invoiceId,
      invoice_number: invoiceNumber,
      status: 'provisional',
      customer_name: customer.customer_name,
      product_name: product.name,
      quantity,
      total_amount: totalAmount,
      message: `${customer.customer_name}向けに${product.name}を${quantity}個、仮伝票として起票しました。`,
    };
  }

  if (name === 'get_sales_report') {
    const month = normalizeMonth(args.month);
    const start = `${month}-01`;
    const next = nextMonth(month);
    const row = await env.DB.prepare(
      `
      SELECT COUNT(*) AS orders, COALESCE(SUM(total_amount), 0) AS total
      FROM b2b_orders
      WHERE tenant_id = ? AND status IN ('confirmed', 'paid', 'fulfilled') AND date(created_at / 1000, 'unixepoch') >= ? AND date(created_at / 1000, 'unixepoch') < ?
      `,
    )
      .bind(tenantId, start, `${next}-01`)
      .first<SalesRow>();

    const orders = Number(row?.orders ?? 0);
    const total = Number(row?.total ?? 0);
    return { month, orders, total, message: `${month}の売上は${orders}件、合計${total.toLocaleString('ja-JP')}円です。` };
  }

  if (name === 'convert_to_delivery_invoice') {
    const invoiceId = normalizeString(args.invoice_id);
    if (!invoiceId) throw new Error('invoice_id is required.');
    const invoice = await env.DB.prepare(
      "UPDATE b2b_invoices SET status = 'issued', title = '納品書', issued_at = unixepoch() * 1000, updated_at = unixepoch() * 1000 WHERE tenant_id = ? AND id = ? AND status = 'draft' RETURNING id, invoice_number, customer_name, total_amount, status",
    )
      .bind(tenantId, invoiceId)
      .first<InvoiceRow>();

    if (!invoice) return { converted: false, message: '対象の下書き伝票が見つからないか、すでに発行済みです。' };
    return { converted: true, invoice, message: `伝票 ${invoice.invoice_number} を正式な納品書に変換しました。` };
  }

  if (name === 'export_shipping_csv') {
    const carrier = normalizeCarrier(args.carrier);
    const rows = await env.DB.prepare(
      `
      SELECT
        i.id AS invoice_id,
        i.total_amount AS total_amount,
        c.customer_name AS customer_name,
        COALESCE(c.postal_code, '000-0000') AS postal_code,
        COALESCE(c.address_line1, 'お届け先住所サンプルフラット文字列') AS address_line1,
        COALESCE(c.address_line2, '') AS address_line2,
        COALESCE(c.phone_number, '090-0000-0000') AS phone_number
      FROM b2b_invoices i
      JOIN b2b_customers c
        ON c.tenant_id = i.tenant_id
       AND c.id = i.customer_id
      WHERE i.tenant_id = ?
        AND (
          i.billing_status = 'unpaid'
          OR i.invoice_type = 'delivery'
        )
        AND i.status IN ('provisional', 'draft', 'issued')
      ORDER BY i.created_at ASC
      LIMIT 500
      `,
    )
      .bind(tenantId)
      .all<ShippingInvoiceRow>();
    const csv = createShippingCsv(carrier, rows.results);

    const fileName = `${carrier}_delivery_${Date.now()}.csv`;
    return {
      carrier,
      fileName,
      csvBase64: bytesToBase64(withUtf8Bom(csv)),
      count: rows.results.length,
      message: `${carrier === 'yamato' ? 'ヤマト' : '佐川'}向け送り状CSVを${rows.results.length}件生成しました。`,
    };
  }

  throw new Error(`Unsupported function: ${name}`);
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeMonth(value: unknown): string {
  const text = normalizeString(value);
  return /^\d{4}-\d{2}$/.test(text) ? text : new Date().toISOString().slice(0, 7);
}

function normalizeCarrier(value: unknown): 'yamato' | 'sagawa' {
  return normalizeString(value).toLowerCase() === 'sagawa' ? 'sagawa' : 'yamato';
}

function normalizePositiveInteger(value: unknown, fallback: number): number {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function nextMonth(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year, monthNumber, 1));
  return date.toISOString().slice(0, 7);
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
