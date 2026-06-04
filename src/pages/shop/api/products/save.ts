import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import {
  ProductApiError,
  booleanValue,
  numberValue,
  productError,
  productJson,
  readJsonBody,
  textValue,
  withTenant,
} from "@/lib/server/productMasterApi";
import { enqueueShopFeedSync } from "@/lib/server/shopFeedSyncQueue";
import { sendShopAdminNotification } from "@/lib/server/shopNotificationEmail";
import { requestShopProductCacheRevalidation } from "@/lib/server/shopProductCache";
import {
  SUBSCRIPTION_SCHEMA_PENDING_CODE,
  SUBSCRIPTION_SCHEMA_PENDING_MESSAGE,
  isSubscriptionSchemaPendingError,
  replaceShopSubscriptionPlans,
} from "@/lib/server/shopSubscriptions";

export const prerender = false;

type SaveProductBody = {
  id?: unknown;
  janCode?: unknown;
  title?: unknown;
  description?: unknown;
  keywords?: unknown;
  categoryId?: unknown;
  googleShoppingCategory?: unknown;
  costPrice?: unknown;
  salePrice?: unknown;
  shippingCost?: unknown;
  platformFeeRate?: unknown;
  stripeFeeRate?: unknown;
  imageR2Keys?: unknown;
  aiAltTexts?: unknown;
  publishState?: unknown;
  shopName?: unknown;
  actorId?: unknown;
  subscriptionPlans?: unknown;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<SaveProductBody>(request);
    const janCode = textValue(body.janCode, "janCode", { required: true, maxLength: 14 }).replace(/\D/g, "");
    if (janCode.length < 8 || janCode.length > 14) {
      throw new ProductApiError("janCode must be 8 to 14 digits.", 400);
    }

    const title = textValue(body.title, "title", { required: true, maxLength: 180 });
    const description = textValue(body.description, "description", { maxLength: 3000 });
    const salePrice = Math.trunc(numberValue(body.salePrice, "salePrice", { min: 0, defaultValue: 0 }));
    const costPrice = Math.trunc(numberValue(body.costPrice, "costPrice", { min: 0, defaultValue: 0 }));
    const shippingCost = Math.trunc(numberValue(body.shippingCost, "shippingCost", { min: 0, defaultValue: 0 }));
    const platformFeeRate = numberValue(body.platformFeeRate, "platformFeeRate", { min: 0, defaultValue: 0 });
    const stripeFeeRate = numberValue(body.stripeFeeRate, "stripeFeeRate", { min: 0, defaultValue: 3.6 });
    const platformFee = Math.round(salePrice * (platformFeeRate / 100));
    const stripeFee = Math.round(salePrice * (stripeFeeRate / 100));
    const grossProfit = salePrice - costPrice - shippingCost;
    const grossMarginRate = salePrice > 0 ? Math.max(grossProfit / salePrice, 0) : 0;
    const netProfit = grossProfit - platformFee - stripeFee;
    const netMarginRate = salePrice > 0 ? netProfit / salePrice : 0;
    const publishState = normalizePublishState(textValue(body.publishState, "publishState"));
    const shopName = textValue(body.shopName, "shopName", { maxLength: 120 }) || "AIBOUX STORE";
    const categoryId = textValue(body.categoryId, "categoryId", { maxLength: 120 });
    const googleShoppingCategory = textValue(body.googleShoppingCategory, "googleShoppingCategory", { maxLength: 300 });
    const keywords = normalizeKeywords(body.keywords);
    const imageR2Keys = normalizeStringArray(body.imageR2Keys);
    const aiAltTexts = normalizeStringArray(body.aiAltTexts);
    const actorId = textValue(body.actorId, "actorId", { maxLength: 120 }) || null;
    const now = Date.now();
    const coreProductId = await upsertCoreProduct({
      tenantId: tenant.tenantId,
      janCode,
      title,
      description,
      salePrice,
      grossMarginRate,
      keywords,
      actorId,
      now,
    });
    const productId = textValue(body.id, "id", { maxLength: 120 }) || `shopprod_${tenant.tenantId}_${janCode}`;

    await env.DB.prepare(
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
        cost_price,
        shipping_cost,
        platform_fee_rate,
        stripe_fee_rate,
        ai_keywords_json,
        google_category_id,
        image_r2_keys,
        ai_alt_texts_json,
        mall_enabled,
        approval_required,
        created_by,
        updated_by,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(tenant_id, core_product_id, shop_name) DO UPDATE SET
        display_name = excluded.display_name,
        description = excluded.description,
        publish_state = excluded.publish_state,
        seo_title = excluded.seo_title,
        seo_description = excluded.seo_description,
        sale_price = excluded.sale_price,
        cost_price = excluded.cost_price,
        shipping_cost = excluded.shipping_cost,
        platform_fee_rate = excluded.platform_fee_rate,
        stripe_fee_rate = excluded.stripe_fee_rate,
        ai_keywords_json = excluded.ai_keywords_json,
        google_category_id = excluded.google_category_id,
        image_r2_keys = excluded.image_r2_keys,
        ai_alt_texts_json = excluded.ai_alt_texts_json,
        mall_enabled = excluded.mall_enabled,
        approval_required = excluded.approval_required,
        updated_by = excluded.updated_by,
        updated_at = excluded.updated_at,
        deleted_at = NULL
      `,
    )
      .bind(
        productId,
        tenant.tenantId,
        coreProductId,
        shopName,
        title,
        description,
        publishState,
        title,
        buildSeoDescription({ description, keywords, googleShoppingCategory, categoryId }),
        salePrice,
        costPrice,
        shippingCost,
        platformFeeRate,
        stripeFeeRate,
        JSON.stringify(keywords),
        googleShoppingCategory || categoryId,
        JSON.stringify(imageR2Keys),
        JSON.stringify(aiAltTexts),
        booleanValue(body.publishState === "published") ? 1 : 0,
        publishState === "published" ? 0 : 1,
        actorId,
        actorId,
        now,
        now,
      )
      .run();

    let subscriptionPlans: Awaited<ReturnType<typeof replaceShopSubscriptionPlans>> = [];
    let subscriptionSchemaPending: Record<string, unknown> | null = null;
    try {
      subscriptionPlans = await replaceShopSubscriptionPlans({
        tenantId: tenant.tenantId,
        productId,
        plans: body.subscriptionPlans,
        actorId,
      });
    } catch (error) {
      if (!isSubscriptionSchemaPendingError(error)) throw error;
      subscriptionSchemaPending = {
        ok: false,
        code: SUBSCRIPTION_SCHEMA_PENDING_CODE,
        message: SUBSCRIPTION_SCHEMA_PENDING_MESSAGE,
      };
    }

    const notification =
      publishState === "published"
        ? await sendShopAdminNotification(env, {
            subject: "【AIBOUX Shop】商品が公開されました",
            text: [
              "AIBOUX Shopで商品が公開されました。",
              "",
              `tenantId: ${tenant.tenantId}`,
              `productId: ${productId}`,
              `商品名: ${title}`,
              `販売価格: ${salePrice}`,
              `純利益: ${netProfit}`,
              `公開日時: ${new Date(now).toISOString()}`,
            ].join("\n"),
            tenantId: tenant.tenantId,
          })
        : { attempted: false, ok: false, error: "Notification is sent only when publishState is published." };
    const feedSyncJobId = `feed_${crypto.randomUUID()}`;
    const feedSyncMessage = {
      type: "shop.product.feed_sync.requested" as const,
      jobId: feedSyncJobId,
      tenantId: tenant.tenantId,
      productId,
      coreProductId,
      publishState,
      channels: ["google", "bing"] as const,
      reason: publishState === "published" ? ("product_published" as const) : ("product_saved" as const),
      requestedAt: new Date(now).toISOString(),
    };
    await env.DB.prepare(
      `
      INSERT INTO shop_feed_sync_jobs (
        id,
        tenant_id,
        product_id,
        core_product_id,
        channels_json,
        publish_state,
        reason,
        status,
        queued_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'queued', ?, ?)
      `,
    )
      .bind(
        feedSyncJobId,
        tenant.tenantId,
        productId,
        coreProductId,
        JSON.stringify(feedSyncMessage.channels),
        publishState,
        feedSyncMessage.reason,
        feedSyncMessage.requestedAt,
        feedSyncMessage.requestedAt,
      )
      .run();
    const feedSync = await enqueueShopFeedSync(env, {
      ...feedSyncMessage,
    });
    if (!feedSync.queued) {
      await env.DB.prepare(
        "UPDATE shop_feed_sync_jobs SET status = 'failed', last_error = ?, updated_at = ? WHERE id = ? AND tenant_id = ?",
      )
        .bind(feedSync.error ?? "Queue send failed.", new Date().toISOString(), feedSyncJobId, tenant.tenantId)
        .run();
    }
    const cacheRevalidation = await requestShopProductCacheRevalidation(env, {
      tenantId: tenant.tenantId,
      productId,
    });

    return productJson({
      success: true,
      productId,
      coreProductId,
      publishState,
      grossProfit,
      grossMarginRate,
      netProfit,
      netMarginRate,
      platformFee,
      stripeFee,
      notification,
      feedSync: {
        ...feedSync,
        jobId: feedSyncJobId,
      },
      cacheRevalidation,
      subscriptionPlans,
      subscriptionSchemaPending,
    });
  } catch (error) {
    return productError(error);
  }
};

async function upsertCoreProduct(input: {
  tenantId: string;
  janCode: string;
  title: string;
  description: string;
  salePrice: number;
  grossMarginRate: number;
  keywords: string[];
  actorId: string | null;
  now: number;
}): Promise<string> {
  const existing = await env.DB.prepare(
    "SELECT id FROM core_products WHERE tenant_id = ? AND jan_code = ? AND deleted_at IS NULL LIMIT 1",
  )
    .bind(input.tenantId, input.janCode)
    .first<{ id: string }>();
  const coreProductId = existing?.id ?? `coreprod_${input.tenantId}_${input.janCode}`;

  if (existing) {
    await env.DB.prepare(
      `
      UPDATE core_products
      SET product_name = ?,
          standard_price = ?,
          description = ?,
          tags_json = ?,
          gross_margin_rate = ?,
          shop_sync_enabled = 1,
          mall_publish_enabled = 1,
          updated_by = ?,
          updated_at = ?
      WHERE tenant_id = ? AND id = ?
      `,
    )
      .bind(
        input.title,
        input.salePrice,
        input.description,
        JSON.stringify(input.keywords),
        input.grossMarginRate,
        input.actorId,
        input.now,
        input.tenantId,
        coreProductId,
      )
      .run();
    return coreProductId;
  }

  await env.DB.prepare(
    `
    INSERT INTO core_products (
      id,
      tenant_id,
      jan_code,
      product_name,
      standard_price,
      status,
      shop_sync_enabled,
      mall_publish_enabled,
      description,
      tags_json,
      gross_margin_rate,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, 'active', 1, 1, ?, ?, ?, ?, ?, ?, ?)
    `,
  )
    .bind(
      coreProductId,
      input.tenantId,
      input.janCode,
      input.title,
      input.salePrice,
      input.description,
      JSON.stringify(input.keywords),
      input.grossMarginRate,
      input.actorId,
      input.actorId,
      input.now,
      input.now,
    )
    .run();

  return coreProductId;
}

function normalizePublishState(value: string): "draft" | "published" {
  if (!value || value === "draft") return "draft";
  if (value === "published") return "published";
  throw new ProductApiError("publishState must be draft or published.", 400);
}

function normalizeKeywords(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean)
      .slice(0, 12);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 12);
  }

  return [];
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, 12);
}

function buildSeoDescription(input: { description: string; keywords: string[]; googleShoppingCategory: string; categoryId: string }): string {
  const parts = [
    input.description.slice(0, 180),
    input.keywords.length ? `Keywords: ${input.keywords.join(", ")}` : "",
    input.googleShoppingCategory ? `Google: ${input.googleShoppingCategory}` : "",
    input.categoryId ? `Category: ${input.categoryId}` : "",
  ].filter(Boolean);

  return parts.join(" / ").slice(0, 500);
}
