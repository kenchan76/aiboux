import type { ShopFeedSyncMessage } from "@/lib/server/shopFeedSyncQueue";

type ProductFeedRow = {
  product_id: string;
  tenant_id: string;
  display_name: string;
  description: string;
  sale_price: number;
  publish_state: string;
  image_r2_keys: string | null;
  google_category_id: string | null;
  jan_code: string | null;
  stock_quantity: number | null;
  core_status: string | null;
  google_enabled: number | null;
  bing_enabled: number | null;
};

type Channel = "google" | "bing";

type ChannelResult = {
  channel: Channel;
  status: "succeeded" | "failed" | "skipped";
  mode: "mock" | "api";
  message: string;
  syncedAt?: string;
};

export async function processShopFeedSyncMessage(
  env: Cloudflare.Env,
  message: ShopFeedSyncMessage,
): Promise<{ status: "succeeded" | "failed"; availability: "InStock" | "OutOfStock"; results: ChannelResult[] }> {
  const attemptAt = new Date().toISOString();
  await env.DB.prepare(
    `
    UPDATE shop_feed_sync_jobs
    SET status = 'received',
        attempts = attempts + 1,
        received_at = COALESCE(received_at, ?),
        last_attempt_at = ?,
        updated_at = ?
    WHERE id = ?
      AND tenant_id = ?
    `,
  )
    .bind(attemptAt, attemptAt, attemptAt, message.jobId, message.tenantId)
    .run();

  const row = await env.DB.prepare(
    `
    SELECT
      sp.id AS product_id,
      sp.tenant_id,
      sp.display_name,
      sp.description,
      sp.sale_price,
      sp.publish_state,
      sp.image_r2_keys,
      sp.google_category_id,
      cp.jan_code,
      cp.stock_quantity,
      cp.status AS core_status,
      COALESCE(ss.google_shopping_auto_sync_enabled, 1) AS google_enabled,
      COALESCE(ss.bing_shopping_auto_sync_enabled, 1) AS bing_enabled
    FROM shop_products sp
    LEFT JOIN core_products cp
      ON cp.tenant_id = sp.tenant_id
     AND cp.id = sp.core_product_id
     AND cp.deleted_at IS NULL
    LEFT JOIN shop_settings ss
      ON ss.tenant_id = sp.tenant_id
     AND ss.deleted_at IS NULL
    WHERE sp.tenant_id = ?
      AND sp.id = ?
      AND sp.deleted_at IS NULL
    LIMIT 1
    `,
  )
    .bind(message.tenantId, message.productId)
    .first<ProductFeedRow>();

  if (!row) {
    const failedAt = new Date().toISOString();
    const results: ChannelResult[] = message.channels.map((channel) => ({
      channel,
      status: "failed",
      mode: "mock",
      message: "product_not_found",
      syncedAt: failedAt,
    }));
    await finishJob(env, message, "failed", "OutOfStock", results, "Product was not found for feed sync.");
    return { status: "failed", availability: "OutOfStock", results };
  }

  const availability = deriveAvailability(row);
  const channels = message.channels.filter((channel) => isChannelEnabled(row, channel));
  const skippedChannels = message.channels
    .filter((channel) => !isChannelEnabled(row, channel))
    .map<ChannelResult>((channel) => ({
      channel,
      status: "skipped",
      mode: "mock",
      message: "auto_sync_disabled",
      syncedAt: new Date().toISOString(),
    }));

  const payload = buildMerchantPayload(row, availability);
  const results: ChannelResult[] = [...skippedChannels];

  for (const channel of channels) {
    results.push(await sendChannel(env, channel, payload));
  }

  const finalStatus = results.some((result) => result.status === "failed") || !results.some((result) => result.status === "succeeded") ? "failed" : "succeeded";
  await finishJob(
    env,
    message,
    finalStatus,
    availability,
    results,
    finalStatus === "failed" ? "One or more feed channels failed." : "",
  );

  return { status: finalStatus, availability, results };
}

function deriveAvailability(row: ProductFeedRow): "InStock" | "OutOfStock" {
  if (row.publish_state !== "published") return "OutOfStock";
  if (row.core_status && row.core_status !== "active") return "OutOfStock";
  return Number(row.stock_quantity ?? 0) > 0 ? "InStock" : "OutOfStock";
}

function isChannelEnabled(row: ProductFeedRow, channel: Channel): boolean {
  if (channel === "google") return row.google_enabled !== 0;
  return row.bing_enabled !== 0;
}

function buildMerchantPayload(row: ProductFeedRow, availability: "InStock" | "OutOfStock") {
  const imageKeys = parseStringArray(row.image_r2_keys);
  return {
    id: row.product_id,
    title: row.display_name,
    description: row.description,
    price: {
      value: row.sale_price,
      currency: "JPY",
    },
    availability,
    stockQuantity: Number(row.stock_quantity ?? 0),
    gtin: row.jan_code || undefined,
    googleCategory: row.google_category_id || undefined,
    images: imageKeys,
  };
}

async function sendChannel(env: Cloudflare.Env, channel: Channel, payload: unknown): Promise<ChannelResult> {
  const apiKey = channel === "google" ? env.GOOGLE_CONTENT_API_KEY : env.BING_MERCHANT_API_KEY;
  const syncedAt = new Date().toISOString();

  if (!apiKey) {
    return {
      channel,
      status: "skipped",
      mode: "mock",
      message: `${channel}_api_key_missing_not_sent`,
      syncedAt,
    };
  }

  try {
    const endpoint =
      channel === "google"
        ? "https://shoppingcontent.googleapis.com/content/v2.1/products/custombatch"
        : "https://merchant.bingads.microsoft.com/api/feed-sync/mock";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return {
      channel,
      status: response.ok ? "succeeded" : "failed",
      mode: "api",
      message: response.ok ? `${channel}_api_sync_completed` : `${channel}_api_sync_failed_${response.status}`,
      syncedAt,
    };
  } catch (error) {
    return {
      channel,
      status: "failed",
      mode: "api",
      message: error instanceof Error ? error.message : `${channel}_api_sync_failed`,
      syncedAt,
    };
  }
}

async function finishJob(
  env: Cloudflare.Env,
  message: ShopFeedSyncMessage,
  status: "succeeded" | "failed",
  availability: "InStock" | "OutOfStock",
  results: ChannelResult[],
  errorMessage: string,
) {
  const completedAt = new Date().toISOString();
  await env.DB.prepare(
    `
    UPDATE shop_feed_sync_jobs
    SET status = ?,
        availability = ?,
        provider_results_json = ?,
        final_synced_at = ?,
        last_error = ?,
        updated_at = ?
    WHERE id = ?
      AND tenant_id = ?
    `,
  )
    .bind(status, availability, JSON.stringify(results), completedAt, errorMessage, completedAt, message.jobId, message.tenantId)
    .run();
}

function parseStringArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
