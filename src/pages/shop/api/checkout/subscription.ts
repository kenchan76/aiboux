import type { APIRoute } from "astro";
import { productError, productJson, readJsonBody, textValue, withTenant } from "@/lib/server/productMasterApi";
import {
  createPendingSubscription,
  isSubscriptionSchemaPendingError,
  subscriptionSchemaPendingJson,
} from "@/lib/server/shopSubscriptions";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<{
      productId?: unknown;
      planId?: unknown;
      quantity?: unknown;
      customerName?: unknown;
      customerEmail?: unknown;
    }>(request);
    const result = await createPendingSubscription({
      tenantId: tenant.tenantId,
      productId: textValue(body.productId, "productId", { required: true, maxLength: 160 }),
      planId: textValue(body.planId, "planId", { required: true, maxLength: 160 }),
      quantity: Math.max(Math.trunc(Number(body.quantity ?? 1) || 1), 1),
      customerName: textValue(body.customerName, "customerName", { maxLength: 160 }),
      customerEmail: textValue(body.customerEmail, "customerEmail", { maxLength: 240 }),
    });
    return productJson({
      success: result.paymentReady,
      subscription: result.subscription,
      paymentReady: result.paymentReady,
      error: result.paymentReady ? undefined : result.paymentReason,
    }, { status: result.paymentReady ? 201 : 409 });
  } catch (error) {
    if (isSubscriptionSchemaPendingError(error)) {
      return productJson(subscriptionSchemaPendingJson(), { status: 503 });
    }
    return productError(error);
  }
};
