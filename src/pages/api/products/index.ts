import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import {
  auditLog,
  booleanValue,
  id,
  numberValue,
  productError,
  productJson,
  readJsonBody,
  safeLimit,
  safeOffset,
  textValue,
  toSqlLike,
  withTenant,
} from "@/lib/server/productMasterApi";

export const prerender = false;

const sortMap: Record<string, string> = {
  sales: "sales_amount",
  stock: "stock_quantity",
  name: "product_name",
  jan: "jan_code",
  updated: "updated_at",
  price: "standard_price",
  margin: "gross_margin_rate",
  listing: "mall_publish_enabled",
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.trim() ?? "";
    const divisionId = url.searchParams.get("division_id")?.trim() ?? "";
    const favoriteListId = url.searchParams.get("favorite_list_id")?.trim() ?? "";
    const sort = sortMap[url.searchParams.get("sort") ?? "updated"] ?? "updated_at";
    const dir = url.searchParams.get("direction") === "asc" ? "ASC" : "DESC";
    const limit = safeLimit(url.searchParams.get("limit"));
    const offset = safeOffset(url.searchParams.get("offset"));
    const clauses = ["p.tenant_id = ?", "p.deleted_at IS NULL"];
    const binds: unknown[] = [tenant.tenantId];

    if (query) {
      clauses.push("(p.product_name LIKE ? ESCAPE '\\' OR p.jan_code LIKE ? ESCAPE '\\' OR p.itf_code LIKE ? ESCAPE '\\' OR p.specification LIKE ? ESCAPE '\\')");
      const like = toSqlLike(query);
      binds.push(like, like, like, like);
    }

    if (divisionId) {
      clauses.push("p.division_id = ?");
      binds.push(divisionId);
    }

    if (favoriteListId) {
      clauses.push("EXISTS (SELECT 1 FROM product_favorites pf WHERE pf.tenant_id = p.tenant_id AND pf.product_id = p.id AND pf.favorite_list_id = ?)");
      binds.push(favoriteListId);
    }

    if (url.searchParams.get("has_customer_price") === "yes") {
      clauses.push("EXISTS (SELECT 1 FROM customer_discount_rates r WHERE r.tenant_id = p.tenant_id AND r.product_id = p.id AND r.deleted_at IS NULL)");
    }

    if (url.searchParams.get("has_price_schedule") === "yes") {
      clauses.push("EXISTS (SELECT 1 FROM product_price_schedules s WHERE s.tenant_id = p.tenant_id AND s.product_id = p.id AND s.deleted_at IS NULL AND s.effective_from > date('now'))");
    }

    const sql = `
      SELECT p.*, d.name AS division_name,
        EXISTS (SELECT 1 FROM product_price_schedules s WHERE s.tenant_id = p.tenant_id AND s.product_id = p.id AND s.deleted_at IS NULL AND s.effective_from > date('now')) AS has_future_price,
        EXISTS (SELECT 1 FROM customer_discount_rates r WHERE r.tenant_id = p.tenant_id AND r.product_id = p.id AND r.deleted_at IS NULL) AS has_customer_price,
        (SELECT COUNT(*) FROM shop_sku_variants v WHERE v.tenant_id = p.tenant_id AND v.core_product_id = p.id AND v.deleted_at IS NULL) AS sku_variant_count
      FROM core_products p
      LEFT JOIN product_divisions d ON d.id = p.division_id AND d.tenant_id = p.tenant_id
      WHERE ${clauses.join(" AND ")}
      ORDER BY p.${sort} ${dir}
      LIMIT ? OFFSET ?
    `;
    binds.push(limit, offset);
    const rows = await env.DB.prepare(sql).bind(...binds).all();
    return productJson({ success: true, tenant, products: rows.results, paging: { limit, offset } });
  } catch (error) {
    return productError(error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody(request);
    const productId = id("prod");
    const productName = textValue(body.productName ?? body.product_name, "productName", { required: true, maxLength: 180 });
    const janCode = textValue(body.janCode ?? body.jan_code, "janCode", { maxLength: 32 });
    const standardPrice = numberValue(body.standardPrice ?? body.standard_price, "standardPrice", { min: 0, defaultValue: 0 });
    const caseQuantity = numberValue(body.caseQuantity ?? body.case_quantity, "caseQuantity", { min: 1, defaultValue: 1 });

    await env.DB.prepare(
      `INSERT INTO core_products (
        id, tenant_id, division_id, jan_code, itf_code, product_name, case_quantity, specification, unit,
        standard_price, tax_type, status, inventory_managed, shop_sync_enabled, mall_publish_enabled,
        description, stock_quantity, gross_margin_rate, tags_json, memo, created_by, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        productId,
        tenant.tenantId,
        textValue(body.divisionId ?? body.division_id, "divisionId") || null,
        janCode || null,
        textValue(body.itfCode ?? body.itf_code, "itfCode") || null,
        productName,
        caseQuantity,
        textValue(body.specification, "specification", { maxLength: 240 }),
        textValue(body.unit, "unit", { maxLength: 24 }) || "個",
        standardPrice,
        textValue(body.taxType ?? body.tax_type, "taxType") || "taxable_10",
        booleanValue(body.inventoryManaged ?? body.inventory_managed, true) ? 1 : 0,
        booleanValue(body.shopSyncEnabled ?? body.shop_sync_enabled) ? 1 : 0,
        booleanValue(body.mallPublishEnabled ?? body.mall_publish_enabled) ? 1 : 0,
        textValue(body.description, "description", { maxLength: 2000 }),
        numberValue(body.stockQuantity ?? body.stock_quantity, "stockQuantity", { min: 0, defaultValue: 0 }),
        numberValue(body.grossMarginRate ?? body.gross_margin_rate, "grossMarginRate", { min: 0, defaultValue: 0 }),
        JSON.stringify(Array.isArray(body.tags) ? body.tags : []),
        textValue(body.memo, "memo", { maxLength: 1000 }),
        textValue(body.actorId ?? body.actor_id, "actorId") || null,
        textValue(body.actorId ?? body.actor_id, "actorId") || null,
      )
      .run();

    await auditLog({
      tenantId: tenant.tenantId,
      actorId: textValue(body.actorId ?? body.actor_id, "actorId") || undefined,
      action: "product.create_draft",
      entityType: "core_product",
      entityId: productId,
      after: { productName, janCode, standardPrice },
    });

    return productJson({ success: true, productId, status: "draft" }, { status: 201 });
  } catch (error) {
    return productError(error);
  }
};
