import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { processStockUpdate } from '../../../../lib/server/testStockConcurrency';

export const prerender = false;

type ProductRow = {
  id: string;
  name: string;
  selling_price: number;
};

type TenantRow = {
  id: string;
};

type PaymentProvider = 'stripe' | 'komoju' | 'manual' | null;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json<Record<string, unknown>>();
    const tenantId = normalizeString(body.tenantId || body.tenant_id || request.headers.get('x-tenant-id')) || 'tenant_001';
    const productId = normalizeString(body.productId || body.product_id);
    const quantity = normalizeQuantity(body.quantity);
    const paymentProvider = normalizePaymentProvider(body.paymentProvider || body.payment_provider);
    const providerPaymentId = normalizePaymentIdentifier(body.providerPaymentId || body.provider_payment_id);
    const stripePaymentIntentId = normalizePaymentIdentifier(body.stripePaymentIntentId || body.stripe_payment_intent_id);
    const stripeChargeId = normalizePaymentIdentifier(body.stripeChargeId || body.stripe_charge_id);

    if (!tenantId || !productId || quantity <= 0) {
      return Response.json({ success: false, error: 'tenantId, productId, quantity が必要です。' }, { status: 400 });
    }

    const tenant = await env.DB.prepare(
      "SELECT id FROM tenants WHERE id = ? AND status = 'active' AND is_active = 1 LIMIT 1",
    )
      .bind(tenantId)
      .first<TenantRow>();

    if (!tenant) {
      return Response.json({ success: false, error: '有効な店舗が見つかりません。' }, { status: 404 });
    }

    const product = await env.DB.prepare(
      'SELECT id, name, selling_price FROM b2b_products WHERE tenant_id = ? AND id = ? AND is_active = 1 LIMIT 1',
    )
      .bind(tenantId, productId)
      .first<ProductRow>();

    if (!product) {
      return Response.json({ success: false, error: '商品が見つかりません。' }, { status: 404 });
    }

    const orderId = `ec_order_${crypto.randomUUID()}`;
    const referenceId = `ec_web_${crypto.randomUUID().slice(0, 8)}`;
    const stockResult = await processStockUpdate(env.DB, {
      tenantId,
      productId,
      channel: 'shop_ec',
      referenceId,
      quantityChange: -quantity,
    });

    if (!stockResult.success) {
      return Response.json({ success: false, error: stockResult.error, detail: stockResult });
    }

    const totalAmount = Number(product.selling_price) * quantity;
    await env.DB.batch([
      env.DB.prepare(
        `
        INSERT INTO b2b_orders (
          id,
          tenant_id,
          order_source,
          customer_name,
          customer_phone,
          status,
          total_amount,
          payment_provider,
          provider_payment_id,
          stripe_payment_intent_id,
          stripe_charge_id
        )
        VALUES (?, ?, 'shop', 'ECゲスト購入者', NULL, 'paid', ?, ?, ?, ?, ?)
        `,
      ).bind(
        orderId,
        tenantId,
        totalAmount,
        paymentProvider,
        providerPaymentId || null,
        stripePaymentIntentId || (providerPaymentId.startsWith('pi_') ? providerPaymentId : null),
        stripeChargeId || (providerPaymentId.startsWith('ch_') ? providerPaymentId : null),
      ),
      env.DB.prepare(
        `
        INSERT INTO b2b_order_items (
          id, tenant_id, order_id, product_id, quantity, unit_price, line_total
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
      ).bind(`ec_item_${crypto.randomUUID()}`, tenantId, orderId, productId, quantity, product.selling_price, totalAmount),
    ]);

    return Response.json({
      success: true,
      orderId,
      message: 'EC注文が正常に確定し、在庫を減算しました。',
      detail: stockResult,
    });
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'EC order failed.' }, { status: 500 });
  }
};

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeQuantity(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) return 0;
  return Math.min(99, parsed);
}

function normalizePaymentProvider(value: unknown): PaymentProvider {
  const provider = normalizeString(value);
  if (provider === 'stripe' || provider === 'komoju' || provider === 'manual') return provider;
  return null;
}

function normalizePaymentIdentifier(value: unknown): string {
  const text = normalizeString(value);
  return /^[a-z]{2,5}_[A-Za-z0-9_]+$/.test(text) ? text : '';
}
