import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

type Payload = {
  order_id?: unknown;
  tenant_slug?: unknown;
  tracking_code?: unknown;
};

type OrderRow = {
  id: string;
  tenant_id: string;
  status: string;
};

export const POST: APIRoute = async ({ request }) => {
  const authError = authorizeAdminRequest(request);
  if (authError) return authError;

  const payload = await readPayload(request);
  const orderId = normalizeString(payload.order_id);
  const tenantSlug = normalizeString(payload.tenant_slug);
  const trackingCode = normalizeTrackingCode(payload.tracking_code);

  if (!orderId) return json({ success: false, error: '`order_id` is required.' }, 400);
  if (!tenantSlug) return json({ success: false, error: '`tenant_slug` is required.' }, 400);
  if (!trackingCode) return json({ success: false, error: '`tracking_code` is required.' }, 400);

  const order = await env.DB.prepare(
    `
    SELECT ec_orders.id, ec_orders.tenant_id, ec_orders.status
    FROM ec_orders
    INNER JOIN tenants ON tenants.id = ec_orders.tenant_id
    WHERE ec_orders.id = ?
      AND tenants.slug = ?
      AND tenants.status = 'active'
      AND tenants.storefront_status = 'active'
      AND COALESCE(tenants.is_active, 1) = 1
      AND ec_orders.status IN ('paid', 'shipped')
    LIMIT 1
    `,
  )
    .bind(orderId, tenantSlug)
    .first<OrderRow>();

  if (!order) {
    return json({ success: false, error: 'Fulfillable order was not found.' }, 404);
  }

  if (order.status === 'shipped') {
    return json({ success: true, already_shipped: true, order_id: orderId });
  }

  const result = await env.DB.prepare(
    `
    UPDATE ec_orders
    SET status = 'shipped',
        tracking_code = ?,
        shipped_at = CURRENT_TIMESTAMP
    WHERE id = ?
      AND tenant_id = ?
      AND status = 'paid'
    RETURNING id, tracking_code, shipped_at
    `,
  )
    .bind(trackingCode, orderId, order.tenant_id)
    .first<{ id: string; tracking_code: string; shipped_at: string }>();

  if (!result) {
    return json({ success: false, error: 'Order could not be transitioned to shipped.' }, 409);
  }

  console.info('Order marked as shipped.', {
    order_id: result.id,
    tenant_slug: tenantSlug,
    tracking_code: result.tracking_code,
    shipped_at: result.shipped_at,
  });

  return json({
    success: true,
    order_id: result.id,
    tracking_code: result.tracking_code,
    shipped_at: result.shipped_at,
  });
};

async function readPayload(request: Request): Promise<Payload> {
  const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';
  if (contentType.includes('application/json')) return (await request.json()) as Payload;

  const formData = await request.formData();
  return {
    order_id: formData.get('order_id'),
    tenant_slug: formData.get('tenant_slug'),
    tracking_code: formData.get('tracking_code'),
  };
}

function authorizeAdminRequest(request: Request): Response | null {
  const configuredToken = getEnvString('ADMIN_API_TOKEN');
  if (!configuredToken) return json({ success: false, error: 'Admin API token is not configured.' }, 503);

  const authorization = request.headers.get('authorization') ?? '';
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() ?? '';

  if (token && constantTimeEqual(token, configuredToken)) {
    return null;
  }

  return json({ success: false, error: 'Unauthorized.' }, 401);
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

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeTrackingCode(value: unknown): string {
  return normalizeString(value)
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}_./:-]/gu, '')
    .slice(0, 80);
}

function getEnvString(key: string): string {
  const value = (env as unknown as Record<string, unknown>)[key];
  return typeof value === 'string' ? value.trim() : '';
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
