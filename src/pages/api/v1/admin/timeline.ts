import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { resolveTenantFromRequest, tenantJsonError } from '../../../../lib/server/tenantContext';

export const prerender = false;

type InventoryTimelineRow = {
  id: string;
  source: string;
  reason: string;
  delta: number;
  before_stock: number;
  after_stock: number;
  reference_id: string | null;
  created_at: number;
  product_name: string;
  current_stock: number;
};

type AiTimelineRow = {
  id: string;
  function_name: string;
  command_text: string;
  created_at: number;
};

type InvoiceTimelineRow = {
  id: string;
  invoice_number: string;
  status: string;
  customer_name: string;
  total_amount: number;
  created_at: number;
};

type DraftOrderTimelineRow = {
  id: string;
  invoice_id: string;
  invoice_number: string;
  status: string;
  customer_name: string;
  product_name: string;
  quantity: number;
  current_stock: number | null;
  created_at: number;
};

type TimelineItem = {
  id: string;
  type: 'inventory' | 'ai' | 'invoice' | 'draft_order';
  channel: string;
  title: string;
  detail: string;
  product_name?: string;
  quantity_change?: number;
  before_stock?: number;
  after_stock?: number;
  current_stock?: number;
  reference_id?: string | null;
  created_at: number;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await resolveTenantFromRequest(request);
    const url = new URL(request.url);
    const limit = normalizeLimit(url.searchParams.get('limit'));

    const [inventory, aiLogs, invoices, draftOrders] = await Promise.all([
      env.DB.prepare(
        `
        SELECT
          t.id,
          t.source,
          t.reason,
          t.delta,
          t.before_stock,
          t.after_stock,
          t.reference_id,
          t.created_at,
          p.name AS product_name,
          p.current_stock
        FROM inventory_transactions t
        JOIN b2b_products p
          ON p.tenant_id = t.tenant_id
         AND p.id = t.product_id
        WHERE t.tenant_id = ?
        ORDER BY t.created_at DESC
        LIMIT ?
        `,
      )
        .bind(tenant.tenantId, limit)
        .all<InventoryTimelineRow>(),
      env.DB.prepare(
        `
        SELECT id, function_name, command_text, created_at
        FROM b2b_ai_command_logs
        WHERE tenant_id = ?
        ORDER BY created_at DESC
        LIMIT ?
        `,
      )
        .bind(tenant.tenantId, Math.min(limit, 10))
        .all<AiTimelineRow>(),
      env.DB.prepare(
        `
        SELECT id, invoice_number, status, customer_name, total_amount, created_at
        FROM b2b_invoices
        WHERE tenant_id = ?
        ORDER BY created_at DESC
        LIMIT ?
        `,
      )
        .bind(tenant.tenantId, Math.min(limit, 10))
        .all<InvoiceTimelineRow>(),
      env.DB.prepare(
        `
        SELECT
          item.id,
          invoice.id AS invoice_id,
          invoice.invoice_number,
          invoice.status,
          invoice.customer_name,
          item.product_name,
          item.quantity,
          product.current_stock,
          item.created_at
        FROM b2b_invoice_items item
        JOIN b2b_invoices invoice
          ON invoice.tenant_id = item.tenant_id
         AND invoice.id = item.invoice_id
        LEFT JOIN b2b_products product
          ON product.tenant_id = item.tenant_id
         AND product.id = item.product_id
        WHERE item.tenant_id = ?
          AND invoice.invoice_type = 'provisional'
          AND invoice.status = 'provisional'
        ORDER BY item.created_at DESC
        LIMIT ?
        `,
      )
        .bind(tenant.tenantId, Math.min(limit, 10))
        .all<DraftOrderTimelineRow>(),
    ]);

    const data: TimelineItem[] = [
      ...inventory.results.map((row) => ({
        id: row.id,
        type: 'inventory' as const,
        channel: row.reason || row.source,
        title: row.product_name,
        detail: `${row.reference_id ?? 'no-ref'} / ${row.before_stock} -> ${row.after_stock}`,
        product_name: row.product_name,
        quantity_change: row.delta,
        before_stock: row.before_stock,
        after_stock: row.after_stock,
        current_stock: row.current_stock,
        reference_id: row.reference_id,
        created_at: row.created_at,
      })),
      ...aiLogs.results.map((row) => ({
        id: row.id,
        type: 'ai' as const,
        channel: 'ai_command',
        title: row.function_name,
        detail: row.command_text,
        created_at: row.created_at,
      })),
      ...draftOrders.results.map((row) => ({
        id: `draft_${row.id}`,
        type: 'draft_order' as const,
        channel: 'b2b_order',
        title: row.product_name,
        detail: `${row.customer_name} / ${row.status} / ${row.invoice_number}`,
        product_name: row.product_name,
        quantity_change: row.quantity,
        current_stock: row.current_stock ?? undefined,
        reference_id: row.invoice_id,
        created_at: row.created_at,
      })),
      ...invoices.results.map((row) => ({
        id: row.id,
        type: 'invoice' as const,
        channel: 'invoice',
        title: `${row.customer_name} / ${row.invoice_number}`,
        detail: `${row.status} / ${row.total_amount.toLocaleString('ja-JP')}円`,
        created_at: row.created_at,
      })),
    ]
      .sort((left, right) => right.created_at - left.created_at)
      .slice(0, limit);

    return Response.json(
      {
        success: true,
        tenant_id: tenant.tenantId,
        data,
        server_time: Date.now(),
      },
      {
        headers: {
          'cache-control': 'no-store',
        },
      },
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'TenantResolutionError') return tenantJsonError(error);
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'Timeline fetch failed.' }, { status: 500 });
  }
};

function normalizeLimit(value: string | null): number {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isSafeInteger(parsed)) return 20;
  return Math.min(50, Math.max(1, parsed));
}
