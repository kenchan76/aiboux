import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import {
  auditLog,
  booleanValue,
  numberValue,
  productError,
  productJson,
  readJsonBody,
  requireConfirmation,
  textValue,
  withTenant,
} from "@/lib/server/productMasterApi";

export const prerender = false;

export const GET: APIRoute = async ({ request, params }) => {
  try {
    const tenant = await withTenant(request);
    const productId = textValue(params.id, "id", { required: true });
    const product = await env.DB.prepare(
      `SELECT p.*, d.name AS division_name
       FROM core_products p
       LEFT JOIN product_divisions d ON d.id = p.division_id AND d.tenant_id = p.tenant_id
       WHERE p.tenant_id = ? AND p.id = ? AND p.deleted_at IS NULL
       LIMIT 1`,
    )
      .bind(tenant.tenantId, productId)
      .first();
    if (!product) return productJson({ success: false, error: "Product not found." }, { status: 404 });

    const [prices, assets, shopProducts, suggestions] = await Promise.all([
      env.DB.prepare("SELECT * FROM product_price_schedules WHERE tenant_id = ? AND product_id = ? AND deleted_at IS NULL ORDER BY effective_from DESC").bind(tenant.tenantId, productId).all(),
      env.DB.prepare("SELECT * FROM product_assets WHERE tenant_id = ? AND product_id = ? AND deleted_at IS NULL ORDER BY sort_order ASC").bind(tenant.tenantId, productId).all(),
      env.DB.prepare("SELECT * FROM shop_products WHERE tenant_id = ? AND core_product_id = ? AND deleted_at IS NULL ORDER BY updated_at DESC").bind(tenant.tenantId, productId).all(),
      env.DB.prepare(
        `SELECT s.* FROM ai_suggestions s
         JOIN ai_enrichment_jobs j ON j.id = s.job_id AND j.tenant_id = s.tenant_id
         WHERE s.tenant_id = ? AND (s.product_id = ? OR j.product_id = ?) AND s.review_status = 'pending'
         ORDER BY s.created_at DESC`,
      ).bind(tenant.tenantId, productId, productId).all(),
    ]);

    return productJson({ success: true, product, prices: prices.results, assets: assets.results, shopProducts: shopProducts.results, suggestions: suggestions.results });
  } catch (error) {
    return productError(error);
  }
};

export const PATCH: APIRoute = async ({ request, params }) => {
  try {
    const tenant = await withTenant(request);
    const productId = textValue(params.id, "id", { required: true });
    const body = await readJsonBody(request);
    const current = await env.DB.prepare("SELECT * FROM core_products WHERE tenant_id = ? AND id = ? AND deleted_at IS NULL LIMIT 1")
      .bind(tenant.tenantId, productId)
      .first();
    if (!current) return productJson({ success: false, error: "Product not found." }, { status: 404 });

    const status = textValue(body.status, "status");
    if (["archived", "discontinued"].includes(status)) {
      requireConfirmation(body, "Archiving or discontinuing a product requires confirm=true.");
    }

    const fields = {
      division_id: textValue(body.divisionId ?? body.division_id, "divisionId") || (current as Record<string, unknown>).division_id,
      jan_code: textValue(body.janCode ?? body.jan_code, "janCode") || (current as Record<string, unknown>).jan_code,
      itf_code: textValue(body.itfCode ?? body.itf_code, "itfCode") || (current as Record<string, unknown>).itf_code,
      product_name: textValue(body.productName ?? body.product_name, "productName") || (current as Record<string, unknown>).product_name,
      case_quantity: numberValue(body.caseQuantity ?? body.case_quantity, "caseQuantity", { min: 1, defaultValue: Number((current as Record<string, unknown>).case_quantity ?? 1) }),
      specification: textValue(body.specification, "specification") || (current as Record<string, unknown>).specification,
      unit: textValue(body.unit, "unit") || (current as Record<string, unknown>).unit,
      standard_price: numberValue(body.standardPrice ?? body.standard_price, "standardPrice", { min: 0, defaultValue: Number((current as Record<string, unknown>).standard_price ?? 0) }),
      tax_type: textValue(body.taxType ?? body.tax_type, "taxType") || (current as Record<string, unknown>).tax_type,
      status: status || (current as Record<string, unknown>).status,
      inventory_managed: booleanValue(body.inventoryManaged ?? body.inventory_managed, Boolean((current as Record<string, unknown>).inventory_managed)) ? 1 : 0,
      shop_sync_enabled: booleanValue(body.shopSyncEnabled ?? body.shop_sync_enabled, Boolean((current as Record<string, unknown>).shop_sync_enabled)) ? 1 : 0,
      mall_publish_enabled: booleanValue(body.mallPublishEnabled ?? body.mall_publish_enabled, Boolean((current as Record<string, unknown>).mall_publish_enabled)) ? 1 : 0,
      description: textValue(body.description, "description") || (current as Record<string, unknown>).description,
      memo: textValue(body.memo, "memo") || (current as Record<string, unknown>).memo,
      tags_json: Array.isArray(body.tags) ? JSON.stringify(body.tags) : (current as Record<string, unknown>).tags_json,
      updated_by: textValue(body.actorId ?? body.actor_id, "actorId") || (current as Record<string, unknown>).updated_by,
    };

    await env.DB.prepare(
      `UPDATE core_products
       SET division_id = ?, jan_code = ?, itf_code = ?, product_name = ?, case_quantity = ?, specification = ?, unit = ?,
           standard_price = ?, tax_type = ?, status = ?, inventory_managed = ?, shop_sync_enabled = ?, mall_publish_enabled = ?,
           description = ?, memo = ?, tags_json = ?, updated_by = ?, updated_at = unixepoch() * 1000
       WHERE tenant_id = ? AND id = ? AND deleted_at IS NULL`,
    )
      .bind(
        fields.division_id,
        fields.jan_code,
        fields.itf_code,
        fields.product_name,
        fields.case_quantity,
        fields.specification,
        fields.unit,
        fields.standard_price,
        fields.tax_type,
        fields.status,
        fields.inventory_managed,
        fields.shop_sync_enabled,
        fields.mall_publish_enabled,
        fields.description,
        fields.memo,
        fields.tags_json,
        fields.updated_by,
        tenant.tenantId,
        productId,
      )
      .run();

    await auditLog({
      tenantId: tenant.tenantId,
      actorId: String(fields.updated_by ?? ""),
      action: "product.update",
      entityType: "core_product",
      entityId: productId,
      before: current,
      after: fields,
    });

    return productJson({ success: true, productId });
  } catch (error) {
    return productError(error);
  }
};
