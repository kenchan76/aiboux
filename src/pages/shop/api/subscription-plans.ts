import type { APIRoute } from "astro";
import {
  ProductApiError,
  productError,
  productJson,
  readJsonBody,
  textValue,
  withTenant,
} from "@/lib/server/productMasterApi";
import {
  isSubscriptionSchemaPendingError,
  listShopSubscriptionPlans,
  replaceShopSubscriptionPlans,
  subscriptionSchemaPendingJson,
} from "@/lib/server/shopSubscriptions";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId")?.trim() || undefined;
    const plans = await listShopSubscriptionPlans({
      tenantId: tenant.tenantId,
      productId,
      activeOnly: url.searchParams.get("activeOnly") === "1",
    });
    return productJson({ success: true, plans });
  } catch (error) {
    if (isSubscriptionSchemaPendingError(error)) {
      return productJson(subscriptionSchemaPendingJson(), { status: 503 });
    }
    return productError(error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<{ productId?: unknown; plans?: unknown; actorId?: unknown }>(request);
    const productId = textValue(body.productId, "productId", { required: true, maxLength: 160 });
    if (!Array.isArray(body.plans)) throw new ProductApiError("plans must be an array.", 400);
    const plans = await replaceShopSubscriptionPlans({
      tenantId: tenant.tenantId,
      productId,
      plans: body.plans,
      actorId: textValue(body.actorId, "actorId", { maxLength: 120 }) || null,
    });
    return productJson({ success: true, plans });
  } catch (error) {
    if (isSubscriptionSchemaPendingError(error)) {
      return productJson(subscriptionSchemaPendingJson(), { status: 503 });
    }
    return productError(error);
  }
};
