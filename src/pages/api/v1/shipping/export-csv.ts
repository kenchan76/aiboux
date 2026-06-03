import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import {
  normalizeShippingCarrier,
  shippingCsvResponse,
  type ShippingInvoiceRow,
} from '../../../../lib/server/shippingCsv';
import { resolveTenantFromRequest, tenantJsonError } from '../../../../lib/server/tenantContext';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await resolveTenantFromRequest(request);
    const body = await request.json<Record<string, unknown>>();
    const carrier = normalizeShippingCarrier(body.carrier);
    const invoiceIds = normalizeInvoiceIds(body.invoiceIds);

    if (!carrier) {
      return json({ success: false, error: '未対応の配送会社です。carrier は yamato または sagawa を指定してください。' }, 400);
    }

    if (invoiceIds.length === 0) {
      return json({ success: false, error: '対象の伝票が選択されていません。' }, 400);
    }

    const placeholders = invoiceIds.map(() => '?').join(',');
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
        AND i.id IN (${placeholders})
      ORDER BY i.created_at ASC
      `,
    )
      .bind(tenant.tenantId, ...invoiceIds)
      .all<ShippingInvoiceRow>();

    if (rows.results.length === 0) {
      return json({ success: false, error: '出力可能な伝票が見つかりません。' }, 404);
    }

    return shippingCsvResponse(carrier, rows.results);
  } catch (error) {
    if (error instanceof Error && error.name === 'TenantResolutionError') return tenantJsonError(error);
    return json({ success: false, error: error instanceof Error ? error.message : '送り状CSV出力に失敗しました。' }, 500);
  }
};

function normalizeInvoiceIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(
    value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => /^[A-Za-z0-9_-]{3,120}$/.test(item)),
  )].slice(0, 500);
}

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
