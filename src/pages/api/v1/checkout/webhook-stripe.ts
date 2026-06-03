import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import Stripe from 'stripe';

export const prerender = false;

type StripeCheckoutMetadata = {
  order_id?: string;
  tenant_id?: string;
  user_id?: string;
  amount?: string;
};

type PaidOrderRow = {
  id: string;
  tenant_id: string;
  user_id: string;
  amount: number;
  status: string;
  payment_method: string;
  point_rate: number;
};

export const POST: APIRoute = async ({ request }) => {
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = getEnvString('STRIPE_WEBHOOK_SECRET');
  const stripeSecret = getEnvString('STRIPE_SECRET_KEY');

  if (!signature) {
    return json({ ok: false, error: 'Missing stripe-signature header.' }, 400);
  }

  if (!webhookSecret || !stripeSecret) {
    return json({ ok: false, error: 'Stripe webhook secrets are not configured.' }, 500);
  }

  const rawBody = await request.text();
  const stripe = new Stripe(stripeSecret);
  const cryptoProvider = Stripe.createSubtleCryptoProvider();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider,
    );
  } catch (error) {
    console.warn('Stripe webhook signature verification failed.', {
      reason: error instanceof Error ? error.message : 'unknown',
    });
    return json({ ok: false, error: 'Invalid Stripe webhook signature.' }, 400);
  }

  if (event.type !== 'checkout.session.completed') {
    return json({ ok: true, ignored: true, event_type: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const metadata = normalizeMetadata(session.metadata);
  const orderId = normalizeString(metadata.order_id || session.client_reference_id);
  const tenantId = normalizeString(metadata.tenant_id);
  const userId = normalizeString(metadata.user_id);
  const metadataAmount = normalizeNonNegativeInteger(metadata.amount);

  if (!orderId || !tenantId || !userId || metadataAmount === null) {
    return json({ ok: false, error: 'Stripe checkout metadata is incomplete.' }, 400);
  }

  const order = await env.DB.prepare(
    `
    SELECT
      ec_orders.id,
      ec_orders.tenant_id,
      ec_orders.user_id,
      ec_orders.amount,
      ec_orders.status,
      ec_orders.payment_method,
      tenants.point_rate
    FROM ec_orders
    INNER JOIN tenants ON tenants.id = ec_orders.tenant_id
    WHERE ec_orders.id = ?
      AND ec_orders.tenant_id = ?
      AND ec_orders.user_id = ?
      AND ec_orders.payment_method = 'stripe'
      AND tenants.status = 'active'
      AND tenants.storefront_status = 'active'
    LIMIT 1
    `,
  )
    .bind(orderId, tenantId, userId)
    .first<PaidOrderRow>();

  if (!order) {
    return json({ ok: false, error: 'Matching pending Stripe order was not found.' }, 404);
  }

  if (order.amount !== metadataAmount) {
    return json({ ok: false, error: 'Stripe metadata amount does not match the order amount.' }, 400);
  }

  const existingPointLog = await env.DB.prepare("SELECT id, amount FROM point_logs WHERE order_id = ? AND type = 'earn' LIMIT 1")
    .bind(orderId)
    .first<{ id: number; amount: number }>();

  if (order.status === 'paid' && existingPointLog) {
    return json({
      ok: true,
      already_processed: true,
      order_id: orderId,
      point_log_id: existingPointLog.id,
      earned_points: existingPointLog.amount,
    });
  }

  const earnedPoints = Math.floor(order.amount * Number(order.point_rate));
  const paymentId = normalizeString(session.payment_intent) || normalizeString(session.id);

  try {
    const batchResult = await env.DB.batch([
      env.DB.prepare(
        `
        UPDATE ec_orders
        SET status = 'paid',
            provider_payment_id = ?,
            paid_at = COALESCE(paid_at, CURRENT_TIMESTAMP)
        WHERE id = ?
          AND tenant_id = ?
          AND status IN ('pending', 'paid')
        `,
      ).bind(paymentId, orderId, tenantId),
      env.DB.prepare(
        `
        INSERT OR IGNORE INTO point_logs (user_id, tenant_id, order_id, amount, type)
        VALUES (?, ?, ?, ?, 'earn')
        `,
      ).bind(userId, tenantId, orderId, earnedPoints),
    ]);

    return json({
      ok: true,
      order_id: orderId,
      payment_id: paymentId,
      earned_points: earnedPoints,
      batch: batchResult.map((result) => result.success),
    });
  } catch (error) {
    return json({
      ok: false,
      error: error instanceof Error ? error.message : 'Stripe webhook fulfillment failed.',
    }, 500);
  }
};

function normalizeMetadata(metadata: Stripe.Metadata | null): StripeCheckoutMetadata {
  if (!metadata) return {};
  return {
    order_id: metadata.order_id,
    tenant_id: metadata.tenant_id,
    user_id: metadata.user_id,
    amount: metadata.amount,
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
