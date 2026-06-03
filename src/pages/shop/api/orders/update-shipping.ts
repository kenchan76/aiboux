import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { ProductApiError, productError, productJson, readJsonBody, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

const carriers = new Set(["日本郵便", "ヤマト運輸", "佐川急便"]);

type UpdateShippingBody = {
  orderId?: unknown;
  carrier?: unknown;
  trackingNumber?: unknown;
  actorId?: unknown;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<UpdateShippingBody>(request);
    const orderId = textValue(body.orderId, "orderId", { required: true, maxLength: 120 });
    const normalizedOrderId = orderId.trim().replace(/^#/, "");
    const carrier = textValue(body.carrier, "carrier", { required: true, maxLength: 40 });
    const trackingNumber = normalizeTrackingNumber(textValue(body.trackingNumber, "trackingNumber", { required: true, maxLength: 100 }));
    const actorId = textValue(body.actorId, "actorId", { maxLength: 120 }) || null;
    const now = Date.now();

    if (!carriers.has(carrier)) {
      throw new ProductApiError("配送業者は日本郵便、ヤマト運輸、佐川急便から選択してください。", 400);
    }
    if (!trackingNumber) {
      throw new ProductApiError("出荷伝票番号を入力してください。", 400);
    }

    const update = await env.DB.prepare(
      `
      UPDATE b2b_orders
      SET shipping_carrier = ?,
          tracking_number = ?,
          status = CASE WHEN status IN ('paid', 'confirmed') THEN 'fulfilled' ELSE status END,
          shipped_at = COALESCE(shipped_at, ?),
          updated_at = ?
      WHERE tenant_id = ?
        AND (id = ? OR id = ?)
        AND status <> 'canceled'
      `,
    )
      .bind(carrier, trackingNumber, now, now, tenant.tenantId, orderId, normalizedOrderId)
      .run();

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
      VALUES (?, ?, ?, 'shipping_update', 'not_required', 0, NULL, ?, '[]', ?, ?, ?)
      `,
    )
      .bind(
        `shopop_${crypto.randomUUID()}`,
        tenant.tenantId,
        normalizedOrderId,
        "配送情報を保存",
        JSON.stringify({ orderId, carrier, trackingNumber, orderUpdated: (update.meta.changes ?? 0) > 0 }),
        actorId,
        now,
      )
      .run();

    return productJson({
      success: true,
      orderId,
      normalizedOrderId,
      carrier,
      trackingNumber,
      orderUpdated: (update.meta.changes ?? 0) > 0,
      updatedAt: now,
    });
  } catch (error) {
    return productError(error);
  }
};

function normalizeTrackingNumber(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}_./:-]/gu, "")
    .slice(0, 80);
}
