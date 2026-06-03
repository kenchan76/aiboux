import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { auditLog, id, numberValue, productError, productJson, readJsonBody, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

const marketplaces = ["yahoo", "rakuten", "amazon"] as const;

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody(request);
    const skuVariantId = textValue(body.skuVariantId ?? body.sku_variant_id, "skuVariantId", { required: true });
    const targets = Array.isArray(body.marketplaces)
      ? body.marketplaces.filter((value): value is (typeof marketplaces)[number] => marketplaces.includes(value as (typeof marketplaces)[number]))
      : marketplaces;
    if (targets.length === 0) return productJson({ success: false, error: "No supported marketplace was selected." }, { status: 400 });

    const variant = await env.DB.prepare(
      `SELECT v.*, cp.product_name, cp.specification
       FROM shop_sku_variants v
       JOIN core_products cp ON cp.id = v.core_product_id AND cp.tenant_id = v.tenant_id
       WHERE v.tenant_id = ? AND v.id = ? AND v.deleted_at IS NULL
       LIMIT 1`,
    )
      .bind(tenant.tenantId, skuVariantId)
      .first<Record<string, unknown>>();
    if (!variant) return productJson({ success: false, error: "SKU variant not found." }, { status: 404 });

    const rows = targets.map((marketplace) => ({
      id: id("listing"),
      marketplace,
      name: buildMarketplaceName(marketplace, String(variant.variant_name ?? variant.product_name)),
      description: `${String(variant.variant_name ?? variant.product_name)}の出品下書きです。Core正本の仕様「${String(variant.specification ?? "")}」をもとに、公開前の人間承認を前提として生成しました。`,
      keywords: buildKeywords(marketplace, String(variant.product_name ?? ""), String(variant.specification ?? "")),
      price: numberValue(body.salePrice ?? body.sale_price, "salePrice", { min: 0, defaultValue: Number(variant.sale_price ?? 0) }),
    }));

    await env.DB.batch(
      rows.map((row) =>
        env.DB.prepare(
          `INSERT INTO marketplace_listings (
            id, tenant_id, sku_variant_id, marketplace, marketplace_product_name, marketplace_description,
            catch_copy, search_keywords, category_code, shipping_setting, sale_price, point_rate,
            publish_state, listing_status, approval_status, created_by, updated_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', ?, ?, ?, 'draft', 'draft', 'pending', ?, ?)
          ON CONFLICT(tenant_id, sku_variant_id, marketplace)
          DO UPDATE SET marketplace_product_name = excluded.marketplace_product_name,
                        marketplace_description = excluded.marketplace_description,
                        search_keywords = excluded.search_keywords,
                        sale_price = excluded.sale_price,
                        approval_status = 'pending',
                        publish_state = 'draft',
                        updated_at = unixepoch() * 1000`,
        ).bind(
          row.id,
          tenant.tenantId,
          skuVariantId,
          row.marketplace,
          row.name,
          row.description,
          "公開前に商品名・法定表示・送料を確認してください",
          row.keywords,
          marketplaceShipping(row.marketplace),
          row.price,
          row.marketplace === "yahoo" ? 5 : row.marketplace === "rakuten" ? 3 : 1,
          textValue(body.actorId ?? body.actor_id, "actorId") || null,
          textValue(body.actorId ?? body.actor_id, "actorId") || null,
        ),
      ),
    );

    await auditLog({ tenantId: tenant.tenantId, action: "marketplace_listing.generate_draft", entityType: "shop_sku_variant", entityId: skuVariantId, after: rows });
    return productJson({ success: true, reviewRequired: true, drafts: rows }, { status: 201 });
  } catch (error) {
    return productError(error);
  }
};

function buildMarketplaceName(marketplace: string, baseName: string): string {
  if (marketplace === "yahoo") return `${baseName} すぐ届く セット販売`;
  if (marketplace === "rakuten") return `${baseName} 送料無料 まとめ買い`;
  return baseName;
}

function buildKeywords(marketplace: string, name: string, specification: string): string {
  return [name, specification, marketplace === "rakuten" ? "送料無料" : "セット", "AIBOUX"].filter(Boolean).join(" ");
}

function marketplaceShipping(marketplace: string): string {
  if (marketplace === "amazon") return "FBAまたは自社出荷";
  if (marketplace === "rakuten") return "通常宅配便";
  return "ヤマト/佐川通常便";
}
