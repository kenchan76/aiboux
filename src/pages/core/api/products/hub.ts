import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { productError, productJson, safeLimit, textValue, toSqlLike, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

type HubProductRow = {
  id: string;
  product_name: string;
  jan_code: string | null;
  status: string;
  stock_quantity: number | null;
  standard_price: number | null;
  shop_sync_enabled: number | null;
  updated_at: number | null;
  sku_count: number | null;
  shop_listing_count: number | null;
  shop_published_count: number | null;
  shop_error_count: number | null;
  last_inventory_at: number | null;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const url = new URL(request.url);
    const query = textValue(url.searchParams.get("q"), "q", { maxLength: 120 });
    const status = textValue(url.searchParams.get("status"), "status", { maxLength: 40 });
    const limit = safeLimit(url.searchParams.get("limit"), 100, 200);
    const params: unknown[] = [tenant.tenantId];
    const filters = ["cp.tenant_id = ?", "cp.deleted_at IS NULL"];

    if (query) {
      filters.push("(cp.product_name LIKE ? ESCAPE '\\' OR cp.jan_code LIKE ? ESCAPE '\\')");
      params.push(toSqlLike(query), toSqlLike(query));
    }

    if (status && status !== "all") {
      filters.push("cp.status = ?");
      params.push(status);
    }

    params.push(limit);

    const rows = await env.DB.prepare(
      `
      SELECT
        cp.id,
        cp.product_name,
        cp.jan_code,
        cp.status,
        cp.stock_quantity,
        cp.standard_price,
        cp.shop_sync_enabled,
        cp.updated_at,
        COUNT(DISTINCT sku.id) AS sku_count,
        COUNT(DISTINCT CASE WHEN ccl.channel = 'shop' THEN ccl.id END) AS shop_listing_count,
        COUNT(DISTINCT CASE WHEN ccl.channel = 'shop' AND ccl.listing_status = 'published' THEN ccl.id END) AS shop_published_count,
        COUNT(DISTINCT CASE WHEN ccl.channel = 'shop' AND ccl.listing_status = 'error' THEN ccl.id END) AS shop_error_count,
        MAX(log.created_at) AS last_inventory_at
      FROM core_products cp
      LEFT JOIN core_product_skus sku
        ON sku.tenant_id = cp.tenant_id
       AND sku.core_product_id = cp.id
       AND sku.deleted_at IS NULL
      LEFT JOIN core_channel_listings ccl
        ON ccl.tenant_id = cp.tenant_id
       AND ccl.core_product_id = cp.id
       AND ccl.deleted_at IS NULL
      LEFT JOIN core_inventory_logs log
        ON log.tenant_id = cp.tenant_id
       AND log.core_product_id = cp.id
      WHERE ${filters.join(" AND ")}
      GROUP BY cp.id
      ORDER BY cp.updated_at DESC
      LIMIT ?
      `,
    )
      .bind(...params)
      .all<HubProductRow>();

    const products = (rows.results ?? []).map((row) => ({
      id: row.id,
      name: row.product_name,
      janCode: row.jan_code || "",
      status: row.status,
      stockQuantity: Number(row.stock_quantity ?? 0),
      standardPrice: Number(row.standard_price ?? 0),
      shopSyncEnabled: row.shop_sync_enabled === 1,
      skuCount: Number(row.sku_count ?? 0),
      shopListingCount: Number(row.shop_listing_count ?? 0),
      shopPublishedCount: Number(row.shop_published_count ?? 0),
      shopErrorCount: Number(row.shop_error_count ?? 0),
      lastInventoryAt: row.last_inventory_at ? Number(row.last_inventory_at) : null,
      updatedAt: row.updated_at ? Number(row.updated_at) : null,
    }));

    return productJson({
      success: true,
      tenantId: tenant.tenantId,
      products,
      summary: {
        productCount: products.length,
        totalStock: products.reduce((sum, product) => sum + product.stockQuantity, 0),
        shopPublishedCount: products.reduce((sum, product) => sum + product.shopPublishedCount, 0),
        shopErrorCount: products.reduce((sum, product) => sum + product.shopErrorCount, 0),
      },
    });
  } catch (error) {
    return productError(error);
  }
};
