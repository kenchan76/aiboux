import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { syncCoreInventory } from "@/lib/server/coreInventorySync";
import {
  ProductApiError,
  numberValue,
  productError,
  productJson,
  readJsonBody,
  textValue,
  withTenant,
} from "@/lib/server/productMasterApi";

export const prerender = false;

type CancelRefundBody = {
  orderId?: unknown;
  refundAmount?: unknown;
  reason?: unknown;
  actorId?: unknown;
  items?: unknown;
};

type RequestItem = {
  productId: string;
  sku: string;
  quantity: number;
};

type ShopProductStockRow = {
  id: string;
  core_product_id: string;
  display_name: string;
  stock_quantity: number | null;
};

type RefundableOrderRow = {
  id: string;
  status: string;
  total_amount: number;
  payment_provider: string | null;
  provider_payment_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_charge_id: string | null;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<CancelRefundBody>(request);
    const orderId = textValue(body.orderId, "orderId", { required: true, maxLength: 120 });
    const normalizedOrderId = normalizeOrderId(orderId);
    const refundAmount = Math.trunc(numberValue(body.refundAmount, "refundAmount", { min: 0, defaultValue: 0 }));
    const reason = textValue(body.reason, "reason", { required: true, maxLength: 500 });
    const actorId = textValue(body.actorId, "actorId", { maxLength: 120 }) || null;
    const items = normalizeItems(body.items);
    const now = Date.now();
    const order = await findRefundableOrder(tenant.tenantId, orderId, normalizedOrderId);

    if (!order) {
      throw new ProductApiError("対象の注文が見つかりません。", 404);
    }

    if (order.status === "canceled") {
      throw new ProductApiError("この注文は既にキャンセル済みです。", 409);
    }

    if (refundAmount > Number(order.total_amount ?? 0)) {
      throw new ProductApiError("返金額が注文金額を超えています。", 400);
    }

    const refund = await issueRefund({
      tenantId: tenant.tenantId,
      orderId: order.id,
      amount: refundAmount,
      reason,
      paymentProvider: order.payment_provider,
      providerPaymentId: order.provider_payment_id,
      stripePaymentIntentId: order.stripe_payment_intent_id,
      stripeChargeId: order.stripe_charge_id,
    });
    const inventoryRestore = await restoreInventory({
      tenantId: tenant.tenantId,
      orderId: order.id,
      items,
      now,
      actorId,
    });

    const b2bUpdate = await env.DB.prepare(
      `
      UPDATE b2b_orders
      SET status = 'canceled',
          refund_status = ?,
          refunded_at = ?,
          updated_at = ?
      WHERE tenant_id = ?
        AND (id = ? OR id = ?)
        AND status <> 'canceled'
      `,
    )
      .bind(refund.status, refund.status === "not_required" ? null : now, now, tenant.tenantId, orderId, normalizedOrderId)
      .run();

    const operationId = `shopop_${crypto.randomUUID()}`;
    await env.DB.prepare(
      `
      INSERT INTO shop_order_operation_logs (
        id,
        tenant_id,
        order_id,
        operation_type,
        refund_status,
        refund_amount,
        stripe_refund_id,
        reason,
        inventory_restore_json,
        request_json,
        created_by,
        created_at
      )
      VALUES (?, ?, ?, 'cancel_refund', ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
      .bind(
        operationId,
        tenant.tenantId,
        order.id,
        refund.status,
        refundAmount,
        refund.refundId,
        reason,
        JSON.stringify(inventoryRestore),
        JSON.stringify({
          orderId,
          refundAmount,
          reason,
          items,
          paymentProvider: order.payment_provider,
          providerPaymentId: redactPaymentId(order.provider_payment_id),
          stripePaymentIntentId: redactPaymentId(order.stripe_payment_intent_id),
          stripeChargeId: redactPaymentId(order.stripe_charge_id),
        }),
        actorId,
        now,
      )
      .run();

    return productJson({
      success: true,
      orderId,
      normalizedOrderId,
      operationId,
      refund,
      orderUpdated: (b2bUpdate.meta.changes ?? 0) > 0,
      inventoryRestore,
    });
  } catch (error) {
    return productError(error);
  }
};

async function findRefundableOrder(tenantId: string, orderId: string, normalizedOrderId: string): Promise<RefundableOrderRow | null> {
  return env.DB.prepare(
    `
    SELECT
      id,
      status,
      total_amount,
      payment_provider,
      provider_payment_id,
      stripe_payment_intent_id,
      stripe_charge_id
    FROM b2b_orders
    WHERE tenant_id = ?
      AND (id = ? OR id = ?)
    LIMIT 1
    `,
  )
    .bind(tenantId, orderId, normalizedOrderId)
    .first<RefundableOrderRow>();
}

function normalizeOrderId(value: string): string {
  return value.trim().replace(/^#/, "");
}

function normalizeItems(value: unknown): RequestItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const productId = textValue(record.productId, "items.productId", { maxLength: 160 });
      const sku = textValue(record.sku, "items.sku", { maxLength: 160 });
      const quantity = Math.trunc(numberValue(record.quantity, "items.quantity", { min: 1, defaultValue: 1 }));
      if (!productId && !sku) return null;
      return { productId, sku, quantity };
    })
    .filter((item): item is RequestItem => Boolean(item))
    .slice(0, 50);
}

async function issueRefund(input: {
  tenantId: string;
  orderId: string;
  amount: number;
  reason: string;
  paymentProvider: string | null;
  providerPaymentId: string | null;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
}): Promise<{
  status: "not_required" | "mock_refunded" | "stripe_refunded" | "failed";
  refundId: string | null;
  mode: "mock" | "stripe";
  message: string;
}> {
  if (input.amount <= 0) {
    return {
      status: "not_required",
      refundId: null,
      mode: "mock",
      message: "返金額が0円のため、キャンセルのみ記録しました。",
    };
  }

  const stripeSecret = getEnvString("STRIPE_SECRET_KEY");
  const stripePayment = resolveStripePaymentIdentifier(input);

  if (!stripeSecret) {
    return {
      status: "mock_refunded",
      refundId: `mock_refund_${crypto.randomUUID()}`,
      mode: "mock",
      message: "支払い方法の確認が必要なため、返金確認待ちとして記録しました。",
    };
  }

  if (!stripePayment) {
    return {
      status: "mock_refunded",
      refundId: `mock_refund_${crypto.randomUUID()}`,
      mode: "mock",
      message: "注文の支払い識別情報を確認できないため、返金確認待ちとして記録しました。",
    };
  }

  const refund = await createStripeRefund({
    secret: stripeSecret,
    amount: input.amount,
    reason: input.reason,
    idempotencyKey: `aiboux-refund-${input.tenantId}-${input.orderId}-${input.amount}`,
    payment: stripePayment,
  });

  return {
    status: "stripe_refunded",
    refundId: refund.id,
    mode: "stripe",
    message: "支払いサービスで返金を実行しました。",
  };
}

function resolveStripePaymentIdentifier(input: {
  paymentProvider: string | null;
  providerPaymentId: string | null;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
}): { type: "payment_intent" | "charge"; id: string } | null {
  const paymentIntent = normalizePaymentId(input.stripePaymentIntentId);
  if (paymentIntent) return { type: "payment_intent", id: paymentIntent };

  const charge = normalizePaymentId(input.stripeChargeId);
  if (charge) return { type: "charge", id: charge };

  const providerPaymentId = normalizePaymentId(input.providerPaymentId);
  if (input.paymentProvider === "stripe" && providerPaymentId) {
    if (providerPaymentId.startsWith("pi_")) return { type: "payment_intent", id: providerPaymentId };
    if (providerPaymentId.startsWith("ch_")) return { type: "charge", id: providerPaymentId };
  }

  return null;
}

async function createStripeRefund(input: {
  secret: string;
  amount: number;
  reason: string;
  idempotencyKey: string;
  payment: { type: "payment_intent" | "charge"; id: string };
}): Promise<{ id: string }> {
  const body = new URLSearchParams();
  body.set("amount", String(input.amount));
  body.set("reason", "requested_by_customer");
  body.set(input.payment.type, input.payment.id);
  if (input.reason) body.set("metadata[aiboux_reason]", input.reason.slice(0, 500));

  const response = await fetch("https://api.stripe.com/v1/refunds", {
    method: "POST",
    headers: {
      authorization: `Bearer ${input.secret}`,
      "content-type": "application/x-www-form-urlencoded",
      "idempotency-key": input.idempotencyKey,
    },
    body,
  });
  const result = (await response.json().catch(() => ({}))) as { id?: string; error?: { message?: string } };

  if (!response.ok || !result.id) {
    throw new ProductApiError(result.error?.message || "支払いサービスで返金に失敗しました。", 502);
  }

  return { id: result.id };
}

function normalizePaymentId(value: string | null): string {
  const text = typeof value === "string" ? value.trim() : "";
  return /^[a-z]{2,5}_[A-Za-z0-9_]+$/.test(text) ? text : "";
}

function redactPaymentId(value: string | null): string | null {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return null;
  return text.length <= 10 ? `${text.slice(0, 3)}...` : `${text.slice(0, 6)}...${text.slice(-4)}`;
}

async function restoreInventory(input: {
  tenantId: string;
  orderId: string;
  items: RequestItem[];
  now: number;
  actorId: string | null;
}): Promise<Array<{
  productId: string;
  sku: string;
  quantity: number;
  restored: boolean;
  beforeStock?: number;
  afterStock?: number;
  reason?: string;
}>> {
  const results = [];

  for (const item of input.items) {
    const product = await findShopProductForRestore(input.tenantId, item);
    if (!product) {
      results.push({
        productId: item.productId,
        sku: item.sku,
        quantity: item.quantity,
        restored: false,
        reason: "商品マスタが見つからないため、在庫戻しをスキップしました。",
      });
      continue;
    }

    const [syncResult] = await syncCoreInventory(env.DB, {
      tenantId: input.tenantId,
      channel: "shop",
      source: "shop.orders.cancel-refund",
      operation: "cancel",
      actorId: input.actorId,
      items: [
        {
          coreProductId: product.core_product_id,
          shopProductId: product.id,
          skuCode: item.sku,
          delta: item.quantity,
          referenceType: "b2b_order",
          referenceId: input.orderId,
          idempotencyKey: `cancel-refund-${input.tenantId}-${input.orderId}-${product.id}-${item.sku || "sku"}-${item.quantity}`,
          payload: { requestedAt: input.now, quantity: item.quantity },
        },
      ],
    });

    if (!syncResult?.success) {
      results.push({
        productId: product.id,
        sku: item.sku,
        quantity: item.quantity,
        restored: false,
        reason: syncResult?.error || "Core在庫同期エンジンで在庫戻しに失敗しました。",
      });
      continue;
    }

    results.push({
      productId: product.id,
      sku: item.sku,
      quantity: item.quantity,
      restored: true,
      beforeStock: syncResult.beforeStock,
      afterStock: syncResult.afterStock,
    });
  }

  return results;
}

async function findShopProductForRestore(tenantId: string, item: RequestItem): Promise<ShopProductStockRow | null> {
  const byId = item.productId
    ? await env.DB.prepare(
        `
        SELECT sp.id, sp.core_product_id, sp.display_name, cp.stock_quantity
        FROM shop_products sp
        LEFT JOIN core_products cp
          ON cp.id = sp.core_product_id
         AND cp.tenant_id = sp.tenant_id
        WHERE sp.tenant_id = ?
          AND sp.id = ?
          AND sp.deleted_at IS NULL
        LIMIT 1
        `,
      )
        .bind(tenantId, item.productId)
        .first<ShopProductStockRow>()
    : null;

  if (byId) return byId;

  if (!item.sku) return null;
  return env.DB.prepare(
    `
    SELECT sp.id, sp.core_product_id, sp.display_name, cp.stock_quantity
    FROM shop_products sp
    LEFT JOIN core_products cp
      ON cp.id = sp.core_product_id
     AND cp.tenant_id = sp.tenant_id
    WHERE sp.tenant_id = ?
      AND sp.deleted_at IS NULL
      AND (
        sp.id = ?
        OR sp.core_product_id = ?
        OR sp.display_name = ?
      )
    LIMIT 1
    `,
  )
    .bind(tenantId, item.sku, item.sku, item.sku)
    .first<ShopProductStockRow>();
}

function getEnvString(key: string): string {
  const value = (env as unknown as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : "";
}
