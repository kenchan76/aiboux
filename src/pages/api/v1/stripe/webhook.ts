import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import Stripe from 'stripe';

export const prerender = false;

type PurchaseType = 'aiboux_core' | 'shop_site' | 'staff_premium';

type SubscriptionMetadata = {
  tenant_id?: string;
  purchase_type?: string;
  staff_id?: string;
};

type TenantRow = {
  id: string;
  status: string;
  is_active: number;
};

type StaffRow = {
  id: string;
  tenant_id: string;
  is_active: number;
};

type ExistingEventRow = {
  session_id: string;
  stripe_event_id: string;
  processing_status: string;
};

export const POST: APIRoute = async ({ request }) => {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return json({ ok: false, error: 'Missing stripe-signature header.' }, 400);
  }

  const stripeSecret = getEnvString('STRIPE_SECRET_KEY');
  const webhookSecret = getEnvString('STRIPE_WEBHOOK_SECRET');
  if (!stripeSecret || !webhookSecret) {
    return json({ ok: false, error: 'Stripe secrets are not configured.' }, 500);
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
    console.warn('Stripe subscription webhook signature verification failed.', {
      message: error instanceof Error ? error.message : String(error),
    });
    return json({ ok: false, error: 'Invalid Stripe webhook signature.' }, 400);
  }

  if (event.type !== 'checkout.session.completed') {
    return json({ ok: true, ignored: true, event_type: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const metadata = normalizeMetadata(session.metadata);
  const tenantId = normalizeString(metadata.tenant_id);
  const staffId = normalizeString(metadata.staff_id);
  const purchaseType = normalizePurchaseType(metadata.purchase_type);
  const sessionId = normalizeString(session.id);
  const eventId = normalizeString(event.id);
  const paymentStatus = normalizeString(session.payment_status) || 'unknown';
  const currency = normalizeString(session.currency).toLowerCase() || 'jpy';
  const amountTotal = normalizeNonNegativeInteger(session.amount_total) ?? 0;

  if (!sessionId || !eventId) {
    return json({ ok: false, error: 'Stripe event is missing session or event id.' }, 400);
  }

  if (!tenantId || !purchaseType) {
    return json({ ok: false, error: 'Stripe checkout metadata must include tenant_id and purchase_type.' }, 400);
  }

  if (paymentStatus !== 'paid' && paymentStatus !== 'no_payment_required') {
    return json({
      ok: true,
      skipped: true,
      reason: 'checkout.session.completed was received before a successful payment status.',
      session_id: sessionId,
      payment_status: paymentStatus,
    });
  }

  const tenant = await env.DB.prepare(
    `
    SELECT id, status, is_active
    FROM tenants
    WHERE id = ?
      AND status = 'active'
      AND is_active = 1
    LIMIT 1
    `,
  )
    .bind(tenantId)
    .first<TenantRow>();

  if (!tenant) {
    return json({ ok: false, error: 'Active tenant was not found for this Stripe checkout session.' }, 404);
  }

  if (purchaseType === 'staff_premium') {
    if (!staffId) {
      return json({ ok: false, error: 'staff_id is required for staff_premium purchases.' }, 400);
    }

    const staff = await env.DB.prepare(
      `
      SELECT id, tenant_id, is_active
      FROM b2b_staff_accounts
      WHERE id = ?
        AND tenant_id = ?
        AND is_active = 1
      LIMIT 1
      `,
    )
      .bind(staffId, tenantId)
      .first<StaffRow>();

    if (!staff) {
      return json({ ok: false, error: 'Active staff account was not found for this tenant.' }, 404);
    }
  }

  const inserted = await env.DB.prepare(
    `
    INSERT OR IGNORE INTO b2b_stripe_subscription_events (
      session_id,
      stripe_event_id,
      tenant_id,
      staff_id,
      purchase_type,
      amount_total,
      currency,
      payment_status,
      processing_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'processing')
    `,
  )
    .bind(sessionId, eventId, tenantId, staffId || null, purchaseType, amountTotal, currency, paymentStatus)
    .run();

  if (getD1Changes(inserted) === 0) {
    const existing = await env.DB.prepare(
      `
      SELECT session_id, stripe_event_id, processing_status
      FROM b2b_stripe_subscription_events
      WHERE session_id = ? OR stripe_event_id = ?
      LIMIT 1
      `,
    )
      .bind(sessionId, eventId)
      .first<ExistingEventRow>();

    return json({
      ok: true,
      already_processed: true,
      session_id: existing?.session_id ?? sessionId,
      stripe_event_id: existing?.stripe_event_id ?? eventId,
      processing_status: existing?.processing_status ?? 'unknown',
    });
  }

  try {
    await env.DB.batch([
      buildSubscriptionStatement(purchaseType, tenantId, staffId),
      env.DB.prepare(
        `
        UPDATE b2b_stripe_subscription_events
        SET processing_status = 'applied',
            error_message = NULL,
            applied_at = unixepoch() * 1000
        WHERE session_id = ?
        `,
      ).bind(sessionId),
    ]);

    return json({
      ok: true,
      applied: true,
      session_id: sessionId,
      stripe_event_id: eventId,
      tenant_id: tenantId,
      staff_id: staffId || null,
      purchase_type: purchaseType,
      amount_total: amountTotal,
      currency,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await env.DB.prepare(
      `
      UPDATE b2b_stripe_subscription_events
      SET processing_status = 'failed',
          error_message = ?,
          applied_at = NULL
      WHERE session_id = ?
      `,
    )
      .bind(message.slice(0, 900), sessionId)
      .run();

    console.error('Stripe subscription fulfillment failed.', {
      sessionId,
      eventId,
      tenantId,
      purchaseType,
      message,
    });

    return json({ ok: false, error: 'Stripe subscription fulfillment failed.' }, 500);
  }
};

function buildSubscriptionStatement(purchaseType: PurchaseType, tenantId: string, staffId: string): D1PreparedStatement {
  if (purchaseType === 'aiboux_core') {
    return env.DB.prepare(
      `
      INSERT INTO b2b_tenant_subscriptions (
        tenant_id,
        is_aiboux_active,
        active_shop_count,
        mail_plan_type,
        updated_at
      )
      VALUES (?, 1, 0, 'free_ad', unixepoch() * 1000)
      ON CONFLICT(tenant_id) DO UPDATE SET
        is_aiboux_active = 1,
        updated_at = unixepoch() * 1000
      `,
    ).bind(tenantId);
  }

  if (purchaseType === 'shop_site') {
    return env.DB.prepare(
      `
      INSERT INTO b2b_tenant_subscriptions (
        tenant_id,
        is_aiboux_active,
        active_shop_count,
        mail_plan_type,
        updated_at
      )
      VALUES (?, 1, 1, 'free_ad', unixepoch() * 1000)
      ON CONFLICT(tenant_id) DO UPDATE SET
        active_shop_count = active_shop_count + 1,
        updated_at = unixepoch() * 1000
      `,
    ).bind(tenantId);
  }

  return env.DB.prepare(
    `
    UPDATE b2b_staff_accounts
    SET staff_plan_type = 'premium_980',
        updated_at = unixepoch() * 1000
    WHERE id = ?
      AND tenant_id = ?
      AND is_active = 1
    `,
  ).bind(staffId, tenantId);
}

function normalizeMetadata(metadata: Stripe.Metadata | null): SubscriptionMetadata {
  if (!metadata) return {};
  return {
    tenant_id: metadata.tenant_id,
    purchase_type: metadata.purchase_type,
    staff_id: metadata.staff_id,
  };
}

function normalizePurchaseType(value: unknown): PurchaseType | null {
  const normalized = normalizeString(value).toLowerCase();
  if (['aiboux_core', 'core', 'basic', 'base', 'core_5980'].includes(normalized)) return 'aiboux_core';
  if (['shop_site', 'shop', 'aiboux_shop', 'ec_site', 'shop_2980'].includes(normalized)) return 'shop_site';
  if (['staff_premium', 'premium_staff', 'employee_premium', 'staff_980', 'premium_980'].includes(normalized)) return 'staff_premium';
  return null;
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

function getD1Changes(result: D1Result): number {
  const changes = (result.meta as { changes?: unknown } | undefined)?.changes;
  return typeof changes === 'number' ? changes : 0;
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
