import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

type PointOperationType = 'earn' | 'use';

export const POST: APIRoute = async ({ request }) => {
  const payload = await readPayload(request);
  const userId = normalizeString(payload.user_id);
  const tenantId = normalizeString(payload.tenant_id);
  const orderId = normalizeString(payload.order_id);
  const operationType = normalizePointOperationType(payload.type);
  const purchaseAmount = normalizeNonNegativeInteger(payload.purchase_amount);
  const requestedPoints = normalizeNonNegativeInteger(payload.points ?? payload.amount);

  if (!userId) return json({ ok: false, error: '`user_id` is required.' }, 400);
  if (!tenantId) return json({ ok: false, error: '`tenant_id` is required.' }, 400);
  if (!orderId) return json({ ok: false, error: '`order_id` is required.' }, 400);
  if (!operationType) return json({ ok: false, error: "`type` must be 'earn' or 'use'." }, 400);
  if (operationType === 'earn' && purchaseAmount === null) {
    return json({ ok: false, error: '`purchase_amount` must be a non-negative integer for earn operations.' }, 400);
  }
  if (operationType === 'use' && requestedPoints === null) {
    return json({ ok: false, error: '`points` or `amount` must be a non-negative integer for use operations.' }, 400);
  }

  const existingLog = await env.DB.prepare('SELECT id, amount FROM point_logs WHERE order_id = ? AND type = ? LIMIT 1')
    .bind(orderId, operationType)
    .first<{ id: number; amount: number }>();

  if (existingLog) {
    return json({
      ok: true,
      user_id: userId,
      tenant_id: tenantId,
      order_id: orderId,
      type: operationType,
      purchase_amount: purchaseAmount ?? null,
      points: existingLog.amount,
      point_log_id: existingLog.id,
      already_processed: true,
    });
  }

  const tenant = await env.DB.prepare("SELECT id, point_rate FROM tenants WHERE id = ? AND status = 'active' AND storefront_status = 'active'")
    .bind(tenantId)
    .first<{ id: string; point_rate: number }>();

  if (!tenant) return json({ ok: false, error: 'Active tenant was not found.' }, 404);

  const pointRate = Number(tenant.point_rate);
  const points = operationType === 'earn'
    ? Math.floor((purchaseAmount ?? 0) * pointRate)
    : requestedPoints ?? 0;

  if (operationType === 'use') {
    const balance = await getUserPointBalance(userId);
    const nextBalance = balance - points;

    if (nextBalance < 0) {
      console.warn('Blocked negative point balance operation.', {
        user_id: userId,
        tenant_id: tenantId,
        order_id: orderId,
        requested_points: points,
        current_balance: balance,
        next_balance: nextBalance,
      });

      return json({
        ok: false,
        error: 'Point balance would become negative.',
        user_id: userId,
        tenant_id: tenantId,
        order_id: orderId,
        requested_points: points,
        current_balance: balance,
        next_balance: balance,
      }, 409);
    }
  }

  try {
    const result = await env.DB.prepare(
      'INSERT INTO point_logs (user_id, tenant_id, order_id, amount, type) VALUES (?, ?, ?, ?, ?) RETURNING id',
    )
      .bind(userId, tenantId, orderId, points, operationType)
      .first<{ id: number }>();

    const balance = await getUserPointBalance(userId);

    return json({
      ok: true,
      user_id: userId,
      tenant_id: tenantId,
      order_id: orderId,
      type: operationType,
      purchase_amount: purchaseAmount ?? null,
      point_rate: pointRate,
      points,
      balance,
      point_log_id: result?.id,
      already_processed: false,
    });
  } catch (error) {
    const concurrentLog = await env.DB.prepare('SELECT id, amount FROM point_logs WHERE order_id = ? AND type = ? LIMIT 1')
      .bind(orderId, operationType)
      .first<{ id: number; amount: number }>();

    if (concurrentLog) {
      return json({
        ok: true,
        user_id: userId,
        tenant_id: tenantId,
        order_id: orderId,
        type: operationType,
        purchase_amount: purchaseAmount ?? null,
        points: concurrentLog.amount,
        point_log_id: concurrentLog.id,
        already_processed: true,
      });
    }

    return json({ ok: false, error: error instanceof Error ? error.message : 'Point log insert failed.' }, 500);
  }
};

async function readPayload(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';
  if (contentType.includes('application/json')) return (await request.json()) as Record<string, unknown>;
  const formData = await request.formData();
  return {
    user_id: formData.get('user_id'),
    tenant_id: formData.get('tenant_id'),
    order_id: formData.get('order_id'),
    purchase_amount: formData.get('purchase_amount'),
    points: formData.get('points'),
    amount: formData.get('amount'),
    type: formData.get('type') ?? 'earn',
  };
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeNonNegativeInteger(value: unknown): number | null {
  const raw = typeof value === 'number' ? String(value) : normalizeString(value);
  if (!/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function normalizePointOperationType(value: unknown): PointOperationType | null {
  const raw = normalizeString(value || 'earn');
  return raw === 'earn' || raw === 'use' ? raw : null;
}

async function getUserPointBalance(userId: string): Promise<number> {
  const row = await env.DB.prepare(
    `
    SELECT COALESCE(SUM(
      CASE
        WHEN type = 'earn' THEN amount
        WHEN type = 'use' THEN -amount
        ELSE 0
      END
    ), 0) AS balance
    FROM point_logs
    WHERE user_id = ?
    `,
  )
    .bind(userId)
    .first<{ balance: number }>();

  return Number(row?.balance ?? 0);
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
