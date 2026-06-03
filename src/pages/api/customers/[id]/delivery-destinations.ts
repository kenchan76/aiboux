import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { productError, productJson, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

export const GET: APIRoute = async ({ request, params }) => {
  try {
    const tenant = await withTenant(request);
    const customerId = textValue(params.id, "id", { required: true });
    const rows = await env.DB.prepare(
      "SELECT * FROM delivery_destinations WHERE tenant_id = ? AND customer_id = ? AND deleted_at IS NULL ORDER BY is_default DESC, destination_code ASC",
    )
      .bind(tenant.tenantId, customerId)
      .all();
    return productJson({ success: true, customerId, deliveryDestinations: rows.results });
  } catch (error) {
    return productError(error);
  }
};
