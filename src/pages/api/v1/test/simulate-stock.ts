import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { runTripleSyncSimulation } from '../../../../lib/server/testStockConcurrency';
import { resolveTenantFromRequest, tenantJsonError } from '../../../../lib/server/tenantContext';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await resolveTenantFromRequest(request);
    const body = await request.json<Record<string, unknown>>();
    const productId = normalizeString(body.productId || body.product_id);

    if (!productId) {
      return Response.json({ success: false, error: '`productId` is required.' }, { status: 400 });
    }

    const result = await runTripleSyncSimulation(env.DB, tenant.tenantId, productId);
    return Response.json(result, {
      headers: { 'cache-control': 'no-store' },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TenantResolutionError') return tenantJsonError(error);
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'Stock simulation failed.' }, { status: 500 });
  }
};

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}
