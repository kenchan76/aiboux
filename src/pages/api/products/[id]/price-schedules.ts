import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { auditLog, id, numberValue, productError, productJson, readJsonBody, requireConfirmation, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const tenant = await withTenant(request);
    const productId = textValue(params.id, "id", { required: true });
    const body = await readJsonBody(request);
    requireConfirmation(body, "Future price changes require confirm=true.");
    const effectiveFrom = textValue(body.effectiveFrom ?? body.effective_from, "effectiveFrom", { required: true });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveFrom)) {
      return productJson({ success: false, error: "effectiveFrom must be YYYY-MM-DD." }, { status: 400 });
    }
    const scheduleId = id("price");
    await env.DB.prepare(
      `INSERT INTO product_price_schedules (id, tenant_id, product_id, standard_price, tax_type, effective_from, reason, approval_status, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
    )
      .bind(
        scheduleId,
        tenant.tenantId,
        productId,
        numberValue(body.standardPrice ?? body.standard_price, "standardPrice", { min: 0 }),
        textValue(body.taxType ?? body.tax_type, "taxType") || "taxable_10",
        effectiveFrom,
        textValue(body.reason, "reason", { maxLength: 500 }),
        textValue(body.actorId ?? body.actor_id, "actorId") || null,
        textValue(body.actorId ?? body.actor_id, "actorId") || null,
      )
      .run();
    await auditLog({ tenantId: tenant.tenantId, action: "product_price_schedule.create_pending", entityType: "product_price_schedule", entityId: scheduleId, after: { productId, effectiveFrom } });
    return productJson({ success: true, scheduleId, approvalStatus: "pending" }, { status: 201 });
  } catch (error) {
    return productError(error);
  }
};
