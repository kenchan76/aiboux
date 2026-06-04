import type { APIRoute } from "astro";
import { ProductApiError, productError, productJson, withTenant } from "@/lib/server/productMasterApi";
import {
  changeShopSubscriptionStatus,
  isSubscriptionSchemaPendingError,
  subscriptionSchemaPendingJson,
} from "@/lib/server/shopSubscriptions";

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const tenant = await withTenant(request);
    const subscriptionId = String(params.id ?? "").trim();
    const action = String(params.action ?? "").trim();
    if (!subscriptionId) throw new ProductApiError("subscription id is required.", 400);
    if (action !== "pause" && action !== "resume" && action !== "skip" && action !== "cancel") {
      throw new ProductApiError("Unsupported subscription action.", 400);
    }
    const subscription = await changeShopSubscriptionStatus({ tenantId: tenant.tenantId, subscriptionId, action });
    return productJson({ success: true, subscription });
  } catch (error) {
    if (isSubscriptionSchemaPendingError(error)) {
      return productJson(subscriptionSchemaPendingJson(), { status: 503 });
    }
    return productError(error);
  }
};
