export type ShopFeedSyncMessage = {
  type: "shop.product.feed_sync.requested";
  jobId: string;
  tenantId: string;
  productId: string;
  coreProductId: string;
  publishState: "draft" | "published";
  channels: ReadonlyArray<"google" | "bing">;
  reason: "product_saved" | "product_published";
  requestedAt: string;
};

export async function enqueueShopFeedSync(
  env: Pick<Cloudflare.Env, "SHOP_FEED_SYNC_QUEUE">,
  message: ShopFeedSyncMessage,
): Promise<{ queued: boolean; error?: string }> {
  try {
    await env.SHOP_FEED_SYNC_QUEUE.send(message, {
      contentType: "json",
    });
    return { queued: true };
  } catch (error) {
    return {
      queued: false,
      error: error instanceof Error ? error.message : "Feed sync queue failed.",
    };
  }
}
