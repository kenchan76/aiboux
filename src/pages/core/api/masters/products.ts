import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { masterProducts } from "@/data/product-master-data";
import { productError, productJson, safeLimit, textValue, toSqlLike, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

type ProductSuggestionRow = {
  id: string;
  product_name: string;
  jan_code: string | null;
  standard_price: number | null;
  stock_quantity: number | null;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const url = new URL(request.url);
    const query = textValue(url.searchParams.get("q"), "q", { maxLength: 120 });
    const queryLower = query.toLowerCase();
    const limit = safeLimit(url.searchParams.get("limit"), 20, 50);
    const fromStatic = masterProducts
      .filter((product) => product.tenantId === tenant.tenantId && product.status === "active")
      .filter((product) => {
        if (!queryLower) return true;
        return [product.productName, product.janCode, product.itfCode, product.specification].join(" ").toLowerCase().includes(queryLower);
      })
      .map((product) => ({
        id: product.id,
        productName: product.productName,
        janCode: product.janCode,
        standardPrice: product.standardPrice,
        stockQuantity: product.stockQuantity,
      }));

    let fromDb: Array<{
      id: string;
      productName: string;
      janCode: string;
      standardPrice: number;
      stockQuantity: number;
    }> = [];

    try {
      const params: unknown[] = [tenant.tenantId];
      const filters = ["tenant_id = ?", "deleted_at IS NULL"];
      if (query) {
        filters.push("(product_name LIKE ? ESCAPE '\\' OR jan_code LIKE ? ESCAPE '\\')");
        params.push(toSqlLike(query), toSqlLike(query));
      }
      params.push(limit);
      const rows = await env.DB.prepare(
        `
        SELECT id, product_name, jan_code, standard_price, stock_quantity
        FROM core_products
        WHERE ${filters.join(" AND ")}
        ORDER BY updated_at DESC
        LIMIT ?
        `,
      )
        .bind(...params)
        .all<ProductSuggestionRow>();

      fromDb = (rows.results ?? []).map((product) => ({
        id: product.id,
        productName: product.product_name,
        janCode: product.jan_code ?? "",
        standardPrice: Number(product.standard_price ?? 0),
        stockQuantity: Number(product.stock_quantity ?? 0),
      }));
    } catch {
      fromDb = [];
    }

    const merged = [...fromDb, ...fromStatic].filter((product, index, array) => array.findIndex((item) => item.id === product.id) === index);
    return productJson({ success: true, products: merged.slice(0, limit) });
  } catch (error) {
    return productError(error);
  }
};
