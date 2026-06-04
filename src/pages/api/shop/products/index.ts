import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { auditLog, id, productError, productJson, readJsonBody, textValue, withTenant } from "@/lib/server/productMasterApi";
import { isSubscriptionSchemaPendingError, listShopSubscriptionPlans } from "@/lib/server/shopSubscriptions";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const rows = await env.DB.prepare(
      `SELECT
         sp.*,
         cp.product_name,
         cp.jan_code,
         cp.stock_quantity,
         cp.status AS core_status,
         sc.name AS category_name
       FROM shop_products sp
       JOIN core_products cp ON cp.id = sp.core_product_id AND cp.tenant_id = sp.tenant_id
       LEFT JOIN shop_categories sc ON sc.id = sp.category_id AND sc.tenant_id = sp.tenant_id AND sc.deleted_at IS NULL
       WHERE sp.tenant_id = ? AND sp.deleted_at IS NULL
       ORDER BY sp.updated_at DESC`,
    )
      .bind(tenant.tenantId)
      .all();
    const shopProducts = rows.results ?? [];
    let plans: Awaited<ReturnType<typeof listShopSubscriptionPlans>> = [];
    let subscriptionSchemaPending = false;
    try {
      plans = await listShopSubscriptionPlans({ tenantId: tenant.tenantId });
    } catch (error) {
      if (!isSubscriptionSchemaPendingError(error)) throw error;
      subscriptionSchemaPending = true;
    }
    const plansByProduct = new Map<string, typeof plans>();
    for (const plan of plans) {
      const current = plansByProduct.get(plan.productId) ?? [];
      current.push(plan);
      plansByProduct.set(plan.productId, current);
    }
    return productJson({
      success: true,
      shopProducts: shopProducts.map((row) => ({
        ...row,
          subscriptionPlans: plansByProduct.get(String(row.id)) ?? [],
      })),
      subscriptionSchemaPending,
    });
  } catch (error) {
    return productError(error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody(request);
    const shopProductId = id("shopprod");
    const coreProductId = textValue(body.coreProductId ?? body.core_product_id, "coreProductId", { required: true });
    const displayName = textValue(body.displayName ?? body.display_name, "displayName", { required: true, maxLength: 180 });
    await env.DB.prepare(
      `INSERT INTO shop_products (id, tenant_id, core_product_id, shop_name, display_name, description, publish_state, seo_title, seo_description, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?)`,
    )
      .bind(
        shopProductId,
        tenant.tenantId,
        coreProductId,
        textValue(body.shopName ?? body.shop_name, "shopName") || "AIBOUX STORE",
        displayName,
        textValue(body.description, "description", { maxLength: 3000 }),
        textValue(body.seoTitle ?? body.seo_title, "seoTitle"),
        textValue(body.seoDescription ?? body.seo_description, "seoDescription", { maxLength: 500 }),
        textValue(body.actorId ?? body.actor_id, "actorId") || null,
        textValue(body.actorId ?? body.actor_id, "actorId") || null,
      )
      .run();
    await auditLog({ tenantId: tenant.tenantId, action: "shop_product.create_draft", entityType: "shop_product", entityId: shopProductId, after: { coreProductId, displayName } });
    return productJson({ success: true, shopProductId, publishState: "draft" }, { status: 201 });
  } catch (error) {
    return productError(error);
  }
};
