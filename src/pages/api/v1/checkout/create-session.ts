import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

type PaymentMethod = 'stripe' | 'komoju';

type CheckoutPayload = {
  product_id?: unknown;
  tenant_id?: unknown;
  user_id?: unknown;
  payment_method?: unknown;
};

type ProductForCheckout = {
  id: number;
  tenant_id: string;
  tenant_slug: string;
  tenant_name: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
};

export const POST: APIRoute = async ({ request }) => {
  const payload = await readPayload(request);
  const productId = normalizePositiveInteger(payload.product_id);
  const tenantId = normalizeString(payload.tenant_id);
  const userId = normalizeString(payload.user_id);
  const paymentMethod = normalizePaymentMethod(payload.payment_method);

  if (productId === null) {
    return json({ success: false, error: '`product_id` must be a positive integer.' }, 400);
  }

  if (!tenantId) {
    return json({ success: false, error: '`tenant_id` is required.' }, 400);
  }

  if (!userId) {
    return json({ success: false, error: '`user_id` is required.' }, 400);
  }

  if (!paymentMethod) {
    return json({ success: false, error: "`payment_method` must be 'stripe' or 'komoju'." }, 400);
  }

  const product = await env.DB.prepare(
    `
    SELECT
      products.id,
      products.tenant_id,
      tenants.slug AS tenant_slug,
      tenants.name AS tenant_name,
      products.name,
      products.price,
      products.description,
      products.image_url
    FROM products
    INNER JOIN tenants ON tenants.id = products.tenant_id
    WHERE products.id = ?
      AND products.tenant_id = ?
      AND tenants.status = 'active'
      AND tenants.storefront_status = 'active'
    LIMIT 1
    `,
  )
    .bind(productId, tenantId)
    .first<ProductForCheckout>();

  if (!product) {
    return json({ success: false, error: 'Active product was not found for this tenant.' }, 404);
  }

  const orderId = `ord_${crypto.randomUUID()}`;

  await env.DB.prepare(
    `
    INSERT INTO ec_orders (id, tenant_id, product_id, user_id, amount, currency, status, payment_method)
    VALUES (?, ?, ?, ?, ?, 'JPY', 'pending', ?)
    `,
  )
    .bind(orderId, tenantId, productId, userId, product.price, paymentMethod)
    .run();

  try {
    const session = paymentMethod === 'stripe'
      ? await createStripeCheckoutSession({ orderId, product, userId })
      : await createKomojuPaymentLink({ orderId, product, userId });

    await env.DB.prepare(
      `
      UPDATE ec_orders
      SET provider_session_id = ?,
          checkout_url = ?
      WHERE id = ? AND status = 'pending'
      `,
    )
      .bind(session.sessionId, session.paymentUrl, orderId)
      .run();

    return json({
      success: true,
      order_id: orderId,
      payment_method: paymentMethod,
      payment_url: session.paymentUrl,
      session_id: session.sessionId,
      amount: product.price,
      currency: 'JPY',
    });
  } catch (error) {
    await env.DB.prepare("UPDATE ec_orders SET status = 'failed' WHERE id = ? AND status = 'pending'")
      .bind(orderId)
      .run();

    return json({
      success: false,
      order_id: orderId,
      error: error instanceof Error ? error.message : 'Checkout session creation failed.',
    }, 502);
  }
};

async function createStripeCheckoutSession(input: {
  orderId: string;
  product: ProductForCheckout;
  userId: string;
}): Promise<{ paymentUrl: string; sessionId: string }> {
  const secret = getEnvString('STRIPE_SECRET_KEY');
  if (!secret) {
    throw new Error('STRIPE_SECRET_KEY is not configured.');
  }

  const origin = getEnvString('AIBOUX_SHOP_PUBLIC_URL') || 'https://shop.aiboux.com';
  const productUrl = `${origin}/s/${encodeURIComponent(input.product.tenant_slug)}/product/${input.product.id}`;
  const body = new URLSearchParams();
  body.set('mode', 'payment');
  body.set('success_url', `${productUrl}?checkout=success&order_id=${encodeURIComponent(input.orderId)}`);
  body.set('cancel_url', `${productUrl}?checkout=cancel&order_id=${encodeURIComponent(input.orderId)}`);
  body.set('client_reference_id', input.orderId);
  body.set('metadata[order_id]', input.orderId);
  body.set('metadata[tenant_id]', input.product.tenant_id);
  body.set('metadata[user_id]', input.userId);
  body.set('metadata[amount]', String(input.product.price));
  body.set('line_items[0][quantity]', '1');
  body.set('line_items[0][price_data][currency]', 'jpy');
  body.set('line_items[0][price_data][unit_amount]', String(input.product.price));
  body.set('line_items[0][price_data][product_data][name]', input.product.name);
  if (input.product.image_url) {
    body.set('line_items[0][price_data][product_data][images][0]', input.product.image_url);
  }

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${secret}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const result = (await response.json()) as { id?: string; url?: string | null; error?: { message?: string } };

  if (!response.ok || !result.id || !result.url) {
    throw new Error(result.error?.message || 'Stripe checkout session creation failed.');
  }

  return { sessionId: result.id, paymentUrl: result.url };
}

async function createKomojuPaymentLink(input: {
  orderId: string;
  product: ProductForCheckout;
  userId: string;
}): Promise<{ paymentUrl: string; sessionId: string }> {
  const secret = getEnvString('KOMOJU_SECRET_KEY');
  if (!secret) {
    throw new Error('KOMOJU_SECRET_KEY is not configured.');
  }

  const body = {
    amount: input.product.price,
    currency: 'JPY',
    title: input.product.name,
    external_reference: input.orderId,
    metadata: {
      order_id: input.orderId,
      tenant_id: input.product.tenant_id,
      user_id: input.userId,
      amount: String(input.product.price),
      product_id: String(input.product.id),
    },
  };

  const response = await fetch('https://api.komoju.com/v1/payment_links', {
    method: 'POST',
    headers: {
      authorization: `Basic ${btoa(`${secret}:`)}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const result = (await response.json()) as { id?: string; payment_url?: string; url?: string; error?: { message?: string } };
  const paymentUrl = result.payment_url || result.url;

  if (!response.ok || !result.id || !paymentUrl) {
    throw new Error(result.error?.message || 'KOMOJU payment link creation failed.');
  }

  return { sessionId: result.id, paymentUrl };
}

async function readPayload(request: Request): Promise<CheckoutPayload> {
  const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';
  if (contentType.includes('application/json')) return (await request.json()) as CheckoutPayload;
  const formData = await request.formData();
  return {
    product_id: formData.get('product_id'),
    tenant_id: formData.get('tenant_id'),
    user_id: formData.get('user_id'),
    payment_method: formData.get('payment_method'),
  };
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizePositiveInteger(value: unknown): number | null {
  const raw = typeof value === 'number' ? String(value) : normalizeString(value);
  if (!/^[1-9]\d*$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function normalizePaymentMethod(value: unknown): PaymentMethod | null {
  const method = normalizeString(value);
  return method === 'stripe' || method === 'komoju' ? method : null;
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
