import type { APIRoute } from "astro";
import { productError, productJson, withTenant } from "@/lib/server/productMasterApi";
import {
  isSubscriptionSchemaPendingError,
  listShopSubscriptions,
  subscriptionSchemaPendingJson,
} from "@/lib/server/shopSubscriptions";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const subscriptions = await listShopSubscriptions(tenant.tenantId);
    return productJson({ success: true, subscriptions });
  } catch (error) {
    if (isSubscriptionSchemaPendingError(error)) {
      return productJson({ ...subscriptionSchemaPendingJson(), subscriptions: [] }, { status: 503 });
    }
    return productError(error);
  }
};
