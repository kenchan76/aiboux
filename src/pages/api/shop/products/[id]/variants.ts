import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { auditLog, booleanValue, id, numberValue, productError, productJson, readJsonBody, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const tenant = await withTenant(request);
    const shopProductId = textValue(params.id, "id", { required: true });
    const body = await readJsonBody(request);
    const shopProduct = await env.DB.prepare("SELECT core_product_id FROM shop_products WHERE tenant_id = ? AND id = ? AND deleted_at IS NULL LIMIT 1")
      .bind(tenant.tenantId, shopProductId)
      .first<{ core_product_id: string }>();
    if (!shopProduct) return productJson({ success: false, error: "Shop product not found." }, { status: 404 });

    const variantId = id("skuvar");
    const skuCode = textValue(body.skuCode ?? body.sku_code, "skuCode", { required: true, maxLength: 80 });
    const variantName = textValue(body.variantName ?? body.variant_name, "variantName", { required: true, maxLength: 180 });
    await env.DB.prepare(
      `INSERT INTO shop_sku_variants (
        id, tenant_id, shop_product_id, core_product_id, sku_code, variant_name, set_quantity, sale_price,
        jan_code, description, inventory_linked, publish_state, shipping_size, marketplace_enabled, approval_status, created_by, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, 'pending', ?, ?)`,
    )
      .bind(
        variantId,
        tenant.tenantId,
        shopProductId,
        shopProduct.core_product_id,
        skuCode,
        variantName,
        numberValue(body.setQuantity ?? body.set_quantity, "setQuantity", { min: 1, defaultValue: 1 }),
        numberValue(body.salePrice ?? body.sale_price, "salePrice", { min: 0 }),
        textValue(body.janCode ?? body.jan_code, "janCode") || null,
        textValue(body.description, "description", { maxLength: 2500 }),
        booleanValue(body.inventoryLinked ?? body.inventory_linked, true) ? 1 : 0,
        textValue(body.shippingSize ?? body.shipping_size, "shippingSize") || "",
        booleanValue(body.marketplaceEnabled ?? body.marketplace_enabled) ? 1 : 0,
        textValue(body.actorId ?? body.actor_id, "actorId") || null,
        textValue(body.actorId ?? body.actor_id, "actorId") || null,
      )
      .run();
    await auditLog({ tenantId: tenant.tenantId, action: "shop_sku_variant.create_draft", entityType: "shop_sku_variant", entityId: variantId, after: { shopProductId, skuCode, variantName } });
    return productJson({ success: true, variantId, approvalStatus: "pending" }, { status: 201 });
  } catch (error) {
    return productError(error);
  }
};
