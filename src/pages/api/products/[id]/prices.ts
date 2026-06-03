import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { productError, productJson, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

export const GET: APIRoute = async ({ request, params }) => {
  try {
    const tenant = await withTenant(request);
    const productId = textValue(params.id, "id", { required: true });
    const product = await env.DB.prepare("SELECT * FROM core_products WHERE tenant_id = ? AND id = ? AND deleted_at IS NULL LIMIT 1")
      .bind(tenant.tenantId, productId)
      .first<Record<string, unknown>>();
    if (!product) return productJson({ success: false, error: "Product not found." }, { status: 404 });

    const [schedules, customerRates] = await Promise.all([
      env.DB.prepare("SELECT * FROM product_price_schedules WHERE tenant_id = ? AND product_id = ? AND deleted_at IS NULL ORDER BY effective_from DESC").bind(tenant.tenantId, productId).all<Record<string, unknown>>(),
      env.DB.prepare(
        `SELECT c.customer_name, c.customer_code, c.base_discount_rate, r.rate, r.exception_price, r.rounding_mode, r.effective_from, r.tax_mode
         FROM core_customers c
         LEFT JOIN customer_discount_rates r
           ON r.tenant_id = c.tenant_id AND r.customer_id = c.id AND (r.product_id = ? OR r.product_id IS NULL) AND r.deleted_at IS NULL
         WHERE c.tenant_id = ? AND c.deleted_at IS NULL
         ORDER BY c.customer_name ASC`,
      ).bind(productId, tenant.tenantId).all<Record<string, unknown>>(),
    ]);

    const standardPrice = Number(product.standard_price ?? 0);
    const previews = customerRates.results.map((row) => {
      const rate = Number(row.rate ?? row.base_discount_rate ?? 1);
      const exceptionPrice = row.exception_price == null ? null : Number(row.exception_price);
      const rawPrice = exceptionPrice ?? standardPrice * rate;
      return {
        customerCode: row.customer_code,
        customerName: row.customer_name,
        basePrice: standardPrice,
        rate,
        exceptionPrice,
        roundingMode: row.rounding_mode ?? "round",
        wholesalePrice: Math.round(rawPrice),
        taxMode: row.tax_mode ?? "tax_excluded",
        effectiveFrom: row.effective_from ?? null,
      };
    });

    return productJson({ success: true, productId, schedules: schedules.results, customerPricePreview: previews });
  } catch (error) {
    return productError(error);
  }
};
