import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { resolveTenantFromRequest, tenantJsonError } from '../../../../lib/server/tenantContext';

export const prerender = false;

type ProductStockRow = {
  id: string;
  current_stock: number;
};

const allowedSources = new Set(['b2b', 'line', 'shop', 'regi', 'manual', 'migration']);

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await resolveTenantFromRequest(request);
    const body = await request.json<Record<string, unknown>>();
    const productId = normalizeString(body.product_id);
    const delta = normalizeInteger(body.delta);
    const source = normalizeString(body.source);
    const reason = normalizeString(body.reason);
    const referenceId = normalizeString(body.reference_id);

    if (!productId || delta === null || !allowedSources.has(source)) {
      return Response.json({ success: false, error: '`product_id`, integer `delta`, and valid `source` are required.' }, { status: 400 });
    }

    const product = await env.DB.prepare('SELECT id, current_stock FROM b2b_products WHERE tenant_id = ? AND id = ? AND is_active = 1 LIMIT 1')
      .bind(tenant.tenantId, productId)
      .first<ProductStockRow>();

    if (!product) {
      return Response.json({ success: false, error: 'Product was not found in this tenant.' }, { status: 404 });
    }

    const beforeStock = Number(product.current_stock);
    const afterStock = beforeStock + delta;
    if (afterStock < 0) {
      return Response.json({ success: false, error: 'Insufficient stock. Update was rejected to prevent double allocation.', before_stock: beforeStock, requested_delta: delta }, { status: 409 });
    }

    const transactionId = `inv_${crypto.randomUUID()}`;
    const batchResults = await env.DB.batch([
      env.DB.prepare('UPDATE b2b_products SET current_stock = current_stock + ?, updated_at = unixepoch() * 1000 WHERE tenant_id = ? AND id = ? AND current_stock + ? >= 0')
        .bind(delta, tenant.tenantId, productId, delta),
      env.DB.prepare(
        'INSERT INTO inventory_transactions (id, tenant_id, product_id, source, delta, before_stock, after_stock, reason, reference_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      )
        .bind(transactionId, tenant.tenantId, productId, source, delta, beforeStock, afterStock, reason, referenceId || null),
    ]);

    if (!batchResults[0].success) {
      return Response.json({ success: false, error: 'Atomic stock update failed.' }, { status: 409 });
    }

    return Response.json({ success: true, tenant_id: tenant.tenantId, product_id: productId, before_stock: beforeStock, after_stock: afterStock, transaction_id: transactionId });
  } catch (error) {
    if (error instanceof Error && error.name === 'TenantResolutionError') return tenantJsonError(error);
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'Stock update failed.' }, { status: 500 });
  }
};

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeInteger(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  return Number.isSafeInteger(parsed) ? parsed : null;
}
