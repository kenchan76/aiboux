import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { auditLog, booleanValue, id, productError, productJson, readJsonBody, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody(request);
    const destinationId = id("dest");
    const customerId = textValue(body.customerId ?? body.customer_id, "customerId", { required: true });
    const destinationName = textValue(body.destinationName ?? body.destination_name, "destinationName", { required: true, maxLength: 120 });
    await env.DB.prepare(
      `INSERT INTO delivery_destinations (
        id, tenant_id, customer_id, destination_code, destination_name, postal_code, address_line1, address_line2,
        phone_number, contact_name, delivery_conditions, is_default, memo, created_by, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        destinationId,
        tenant.tenantId,
        customerId,
        textValue(body.destinationCode ?? body.destination_code, "destinationCode") || `D-${crypto.randomUUID().slice(0, 8)}`,
        destinationName,
        textValue(body.postalCode ?? body.postal_code, "postalCode"),
        textValue(body.addressLine1 ?? body.address_line1, "addressLine1"),
        textValue(body.addressLine2 ?? body.address_line2, "addressLine2"),
        textValue(body.phoneNumber ?? body.phone_number, "phoneNumber"),
        textValue(body.contactName ?? body.contact_name, "contactName"),
        textValue(body.deliveryConditions ?? body.delivery_conditions, "deliveryConditions"),
        booleanValue(body.isDefault ?? body.is_default) ? 1 : 0,
        textValue(body.memo, "memo"),
        textValue(body.actorId ?? body.actor_id, "actorId") || null,
        textValue(body.actorId ?? body.actor_id, "actorId") || null,
      )
      .run();
    await auditLog({ tenantId: tenant.tenantId, action: "delivery_destination.create", entityType: "delivery_destination", entityId: destinationId, after: { customerId, destinationName } });
    return productJson({ success: true, destinationId }, { status: 201 });
  } catch (error) {
    return productError(error);
  }
};
