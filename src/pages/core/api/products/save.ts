import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { z } from "zod";
import { coreProductMasterFormSchema, type CoreProductMasterFormValues } from "@/lib/coreProductMasterFormSchema";
import { ProductApiError, id, productError, productJson, readJsonBody, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

type ProductDetailRow = {
  id: string;
  product_name: string;
  jan_code: string | null;
  standard_price: number | null;
  status: string;
  unit: string | null;
  description: string | null;
  memo: string | null;
  shop_sync_enabled: number | null;
};

type SkuDetailRow = {
  id: string;
  sku_code: string;
  sku_name: string;
  jan_code: string | null;
  stock_quantity: number | null;
  sale_price: number | null;
  shop_publish_enabled: number | null;
};

type ShopProductRow = {
  id: string;
  shop_name: string;
  publish_state: string;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const url = new URL(request.url);
    const productId = textValue(url.searchParams.get("id"), "id", { required: true, maxLength: 160 });

    const product = await env.DB.prepare(
      `
      SELECT id, product_name, jan_code, standard_price, status, unit, description, memo, shop_sync_enabled
      FROM core_products
      WHERE tenant_id = ?
        AND id = ?
        AND deleted_at IS NULL
      LIMIT 1
      `,
    )
      .bind(tenant.tenantId, productId)
      .first<ProductDetailRow>();
    if (!product) throw new ProductApiError("商品が見つかりません。", 404);

    const [skus, shopProduct] = await Promise.all([
      env.DB.prepare(
        `
        SELECT
          sku.id,
          sku.sku_code,
          sku.sku_name,
          sku.jan_code,
          sku.stock_quantity,
          COALESCE(ssv.sale_price, sp.sale_price, cp.standard_price, 0) AS sale_price,
          CASE WHEN ccl.listing_status = 'published' THEN 1 ELSE 0 END AS shop_publish_enabled
        FROM core_product_skus sku
        INNER JOIN core_products cp
          ON cp.tenant_id = sku.tenant_id
         AND cp.id = sku.core_product_id
        LEFT JOIN core_channel_listings ccl
          ON ccl.tenant_id = sku.tenant_id
         AND ccl.core_product_id = sku.core_product_id
         AND ccl.core_sku_id = sku.id
         AND ccl.channel = 'shop'
         AND ccl.deleted_at IS NULL
        LEFT JOIN shop_products sp
          ON sp.tenant_id = sku.tenant_id
         AND sp.core_product_id = sku.core_product_id
         AND sp.deleted_at IS NULL
        LEFT JOIN shop_sku_variants ssv
          ON ssv.tenant_id = sku.tenant_id
         AND ssv.core_product_id = sku.core_product_id
         AND ssv.sku_code = sku.sku_code
         AND ssv.deleted_at IS NULL
        WHERE sku.tenant_id = ?
          AND sku.core_product_id = ?
          AND sku.deleted_at IS NULL
        ORDER BY sku.created_at ASC
        `,
      )
        .bind(tenant.tenantId, productId)
        .all<SkuDetailRow>(),
      env.DB.prepare(
        `
        SELECT id, shop_name, publish_state
        FROM shop_products
        WHERE tenant_id = ?
          AND core_product_id = ?
          AND deleted_at IS NULL
        ORDER BY updated_at DESC
        LIMIT 1
        `,
      )
        .bind(tenant.tenantId, productId)
        .first<ShopProductRow>(),
    ]);

    return productJson({
      success: true,
      product: {
        id: product.id,
        productName: product.product_name,
        janCode: product.jan_code || "",
        standardPrice: Number(product.standard_price ?? 0),
        status: product.status,
        unit: product.unit || "個",
        description: product.description || "",
        memo: product.memo || "",
        shopName: shopProduct?.shop_name || "AIBOUX STORE",
        shopSyncEnabled: product.shop_sync_enabled === 1,
        skus: (skus.results ?? []).map((sku) => ({
          id: sku.id,
          skuCode: sku.sku_code,
          variantName: sku.sku_name,
          janCode: sku.jan_code || "",
          stockQuantity: Number(sku.stock_quantity ?? 0),
          salePrice: Number(sku.sale_price ?? 0),
          shopPublishEnabled: sku.shop_publish_enabled === 1,
        })),
      },
    });
  } catch (error) {
    return productError(error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<Record<string, unknown>>(request);
    const parsed = coreProductMasterFormSchema.safeParse(body);
    if (!parsed.success) throw new ProductApiError(formatZodError(parsed.error), 400);

    const now = Date.now();
    const input = parsed.data;
    const actorId = input.actorId || null;
    const productId = input.id || id("coreprod");
    await assertProductWritable({ tenantId: tenant.tenantId, productId, input });
    await assertSkuCodesWritable({ tenantId: tenant.tenantId, productId, input });

    const existingShop = await env.DB.prepare(
      `
      SELECT id
      FROM shop_products
      WHERE tenant_id = ?
        AND core_product_id = ?
        AND shop_name = ?
        AND deleted_at IS NULL
      LIMIT 1
      `,
    )
      .bind(tenant.tenantId, productId, input.shopName)
      .first<{ id: string }>();
    const shopProductId = existingShop?.id ?? id("shopprod");
    const skuRows = input.skus.map((sku) => ({ ...sku, id: sku.id || id("csku") }));
    const existingListings = await loadExistingShopListings(tenant.tenantId, productId);
    const totalStock = skuRows.reduce((sum, sku) => sum + sku.stockQuantity, 0);
    const anyShopPublished = input.shopSyncEnabled && skuRows.some((sku) => sku.shopPublishEnabled);
    const statements: D1PreparedStatement[] = [];

    statements.push(
      env.DB.prepare(
        `
        INSERT INTO core_products (
          id,
          tenant_id,
          jan_code,
          product_name,
          case_quantity,
          unit,
          standard_price,
          tax_type,
          status,
          inventory_managed,
          shop_sync_enabled,
          mall_publish_enabled,
          description,
          stock_quantity,
          gross_margin_rate,
          tags_json,
          memo,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, 1, ?, ?, 'taxable_10', ?, 1, ?, 0, ?, ?, 0, '[]', ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          jan_code = excluded.jan_code,
          product_name = excluded.product_name,
          unit = excluded.unit,
          standard_price = excluded.standard_price,
          status = excluded.status,
          shop_sync_enabled = excluded.shop_sync_enabled,
          description = excluded.description,
          stock_quantity = excluded.stock_quantity,
          memo = excluded.memo,
          updated_by = excluded.updated_by,
          updated_at = excluded.updated_at,
          deleted_at = NULL
        `,
      ).bind(
        productId,
        tenant.tenantId,
        input.janCode || null,
        input.productName,
        input.unit,
        input.standardPrice,
        input.status,
        input.shopSyncEnabled ? 1 : 0,
        input.description,
        totalStock,
        input.memo,
        actorId,
        actorId,
        now,
        now,
      ),
    );

    const submittedSkuIds = skuRows.map((sku) => sku.id);
    statements.push(
      env.DB.prepare(
        `
        UPDATE core_product_skus
        SET deleted_at = ?,
            updated_by = ?,
            updated_at = ?
        WHERE tenant_id = ?
          AND core_product_id = ?
          AND deleted_at IS NULL
          ${submittedSkuIds.length ? `AND id NOT IN (${submittedSkuIds.map(() => "?").join(", ")})` : ""}
        `,
      ).bind(now, actorId, now, tenant.tenantId, productId, ...submittedSkuIds),
    );

    for (const sku of skuRows) {
      statements.push(
        env.DB.prepare(
          `
          INSERT INTO core_product_skus (
            id,
            tenant_id,
            core_product_id,
            sku_code,
            sku_name,
            jan_code,
            unit_quantity,
            stock_quantity,
            status,
            source_channel,
            created_by,
            updated_by,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, 1, ?, 'active', 'core_manual', ?, ?, ?, ?)
          ON CONFLICT(tenant_id, sku_code) DO UPDATE SET
            core_product_id = excluded.core_product_id,
            sku_name = excluded.sku_name,
            jan_code = excluded.jan_code,
            stock_quantity = excluded.stock_quantity,
            status = 'active',
            source_channel = 'core_manual',
            updated_by = excluded.updated_by,
            updated_at = excluded.updated_at,
            deleted_at = NULL
          `,
        ).bind(
          sku.id,
          tenant.tenantId,
          productId,
          sku.skuCode,
          sku.variantName,
          sku.janCode || null,
          sku.stockQuantity,
          actorId,
          actorId,
          now,
          now,
        ),
      );
    }

    if (input.shopSyncEnabled) {
      statements.push(
        env.DB.prepare(
          `
          INSERT INTO shop_products (
            id,
            tenant_id,
            core_product_id,
            shop_name,
            display_name,
            description,
            publish_state,
            seo_title,
            seo_description,
            sale_price,
            tax_rate,
            stock_policy,
            mall_enabled,
            approval_required,
            created_by,
            updated_by,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0.1, 'core_linked', ?, ?, ?, ?, ?, ?)
          ON CONFLICT(tenant_id, core_product_id, shop_name) DO UPDATE SET
            display_name = excluded.display_name,
            description = excluded.description,
            publish_state = excluded.publish_state,
            seo_title = excluded.seo_title,
            seo_description = excluded.seo_description,
            sale_price = excluded.sale_price,
            stock_policy = excluded.stock_policy,
            mall_enabled = excluded.mall_enabled,
            approval_required = excluded.approval_required,
            updated_by = excluded.updated_by,
            updated_at = excluded.updated_at,
            deleted_at = NULL
          `,
        ).bind(
          shopProductId,
          tenant.tenantId,
          productId,
          input.shopName,
          input.productName,
          input.description,
          anyShopPublished ? "published" : "draft",
          input.productName,
          input.description.slice(0, 300),
          input.standardPrice,
          anyShopPublished ? 1 : 0,
          anyShopPublished ? 0 : 1,
          actorId,
          actorId,
          now,
          now,
        ),
      );

      const submittedListingSkuIds = skuRows.map((sku) => sku.id);
      statements.push(
        env.DB.prepare(
          `
          UPDATE core_channel_listings
          SET listing_status = 'archived',
              deleted_at = ?,
              updated_by = ?,
              updated_at = ?
          WHERE tenant_id = ?
            AND core_product_id = ?
            AND channel = 'shop'
            AND deleted_at IS NULL
            ${submittedListingSkuIds.length ? `AND core_sku_id NOT IN (${submittedListingSkuIds.map(() => "?").join(", ")})` : ""}
          `,
        ).bind(now, actorId, now, tenant.tenantId, productId, ...submittedListingSkuIds),
      );

      for (const sku of skuRows) {
        const listingId = existingListings.get(sku.id);
        if (listingId) {
          statements.push(
            env.DB.prepare(
              `
              UPDATE core_channel_listings
              SET channel_product_id = ?,
                  channel_sku_id = ?,
                  listing_status = ?,
                  inventory_sync_enabled = 1,
                  last_synced_at = ?,
                  metadata_json = ?,
                  updated_by = ?,
                  updated_at = ?,
                  deleted_at = NULL
              WHERE tenant_id = ?
                AND id = ?
              `,
            ).bind(
              shopProductId,
              sku.id,
              sku.shopPublishEnabled ? "published" : "draft",
              now,
              JSON.stringify({ shopName: input.shopName, salePrice: sku.salePrice, variantName: sku.variantName }),
              actorId,
              now,
              tenant.tenantId,
              listingId,
            ),
          );
        } else {
          statements.push(
            env.DB.prepare(
              `
              INSERT INTO core_channel_listings (
                id,
                tenant_id,
                core_product_id,
                core_sku_id,
                channel,
                channel_product_id,
                channel_sku_id,
                listing_status,
                inventory_sync_enabled,
                last_synced_at,
                metadata_json,
                created_by,
                updated_by,
                created_at,
                updated_at
              )
              VALUES (?, ?, ?, ?, 'shop', ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)
              `,
            ).bind(
              id("ccl"),
              tenant.tenantId,
              productId,
              sku.id,
              shopProductId,
              sku.id,
              sku.shopPublishEnabled ? "published" : "draft",
              now,
              JSON.stringify({ shopName: input.shopName, salePrice: sku.salePrice, variantName: sku.variantName }),
              actorId,
              actorId,
              now,
              now,
            ),
          );
        }

        statements.push(
          env.DB.prepare(
            `
            INSERT INTO shop_sku_variants (
              id,
              tenant_id,
              shop_product_id,
              core_product_id,
              sku_code,
              variant_name,
              set_quantity,
              sale_price,
              jan_code,
              description,
              inventory_linked,
              publish_state,
              marketplace_enabled,
              approval_status,
              created_by,
              updated_by,
              created_at,
              updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, '', 1, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(tenant_id, sku_code) DO UPDATE SET
              shop_product_id = excluded.shop_product_id,
              core_product_id = excluded.core_product_id,
              variant_name = excluded.variant_name,
              sale_price = excluded.sale_price,
              jan_code = excluded.jan_code,
              inventory_linked = 1,
              publish_state = excluded.publish_state,
              marketplace_enabled = excluded.marketplace_enabled,
              approval_status = excluded.approval_status,
              updated_by = excluded.updated_by,
              updated_at = excluded.updated_at,
              deleted_at = NULL
            `,
          ).bind(
            id("svar"),
            tenant.tenantId,
            shopProductId,
            productId,
            sku.skuCode,
            sku.variantName,
            sku.salePrice,
            sku.janCode || null,
            sku.shopPublishEnabled ? "published" : "draft",
            sku.shopPublishEnabled ? 1 : 0,
            sku.shopPublishEnabled ? "approved" : "pending",
            actorId,
            actorId,
            now,
            now,
          ),
        );
      }
    } else {
      statements.push(
        env.DB.prepare(
          `
          UPDATE core_channel_listings
          SET listing_status = 'archived',
              deleted_at = ?,
              updated_by = ?,
              updated_at = ?
          WHERE tenant_id = ?
            AND core_product_id = ?
            AND channel = 'shop'
            AND deleted_at IS NULL
          `,
        ).bind(now, actorId, now, tenant.tenantId, productId),
      );
      statements.push(
        env.DB.prepare(
          `
          UPDATE shop_products
          SET publish_state = 'archived',
              updated_by = ?,
              updated_at = ?,
              deleted_at = ?
          WHERE tenant_id = ?
            AND core_product_id = ?
            AND deleted_at IS NULL
          `,
        ).bind(actorId, now, now, tenant.tenantId, productId),
      );
    }

    await env.DB.batch(statements);

    return productJson({
      success: true,
      productId,
      shopProductId: input.shopSyncEnabled ? shopProductId : null,
      skuCount: skuRows.length,
      totalStock,
      shopPublishedSkuCount: input.shopSyncEnabled ? skuRows.filter((sku) => sku.shopPublishEnabled).length : 0,
    });
  } catch (error) {
    return productError(error);
  }
};

async function assertProductWritable(input: {
  tenantId: string;
  productId: string;
  input: CoreProductMasterFormValues;
}) {
  if (input.input.id) {
    const current = await env.DB.prepare(
      "SELECT id FROM core_products WHERE tenant_id = ? AND id = ? AND deleted_at IS NULL LIMIT 1",
    )
      .bind(input.tenantId, input.productId)
      .first<{ id: string }>();
    if (!current) throw new ProductApiError("更新対象の商品が見つかりません。", 404);
  }

  if (!input.input.janCode) return;
  const conflict = await env.DB.prepare(
    `
    SELECT id
    FROM core_products
    WHERE tenant_id = ?
      AND jan_code = ?
      AND id <> ?
      AND deleted_at IS NULL
    LIMIT 1
    `,
  )
    .bind(input.tenantId, input.input.janCode, input.productId)
    .first<{ id: string }>();
  if (conflict) throw new ProductApiError("同じJANの商品が既に登録されています。", 409);
}

async function assertSkuCodesWritable(input: {
  tenantId: string;
  productId: string;
  input: CoreProductMasterFormValues;
}) {
  const codes = input.input.skus.map((sku) => sku.skuCode);
  if (!codes.length) return;
  const placeholders = codes.map(() => "?").join(", ");
  const conflicts = await env.DB.prepare(
    `
    SELECT sku_code, core_product_id
    FROM core_product_skus
    WHERE tenant_id = ?
      AND sku_code IN (${placeholders})
      AND core_product_id <> ?
      AND deleted_at IS NULL
    `,
  )
    .bind(input.tenantId, ...codes, input.productId)
    .all<{ sku_code: string; core_product_id: string }>();

  const conflict = conflicts.results?.[0];
  if (conflict) throw new ProductApiError(`SKUコード ${conflict.sku_code} は別の商品で使用されています。`, 409);
}

async function loadExistingShopListings(tenantId: string, productId: string): Promise<Map<string, string>> {
  const rows = await env.DB.prepare(
    `
    SELECT id, core_sku_id
    FROM core_channel_listings
    WHERE tenant_id = ?
      AND core_product_id = ?
      AND channel = 'shop'
      AND core_sku_id IS NOT NULL
    `,
  )
    .bind(tenantId, productId)
    .all<{ id: string; core_sku_id: string }>();

  return new Map((rows.results ?? []).map((row) => [row.core_sku_id, row.id]));
}

function formatZodError(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join(" / ");
}
