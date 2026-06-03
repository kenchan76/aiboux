export type ShopProductCacheRevalidation = {
  requested: boolean;
  targetUrl: string | null;
  mode: "cloudflare_purge" | "deferred";
  ok: boolean;
  reason?: string;
};

type TenantUrlRow = {
  slug: string;
  host_name: string | null;
};

export async function requestShopProductCacheRevalidation(
  env: Pick<Cloudflare.Env, "DB"> & Partial<Pick<Cloudflare.Env, "CLOUDFLARE_ZONE_ID" | "CLOUDFLARE_API_TOKEN">>,
  input: { tenantId: string; productId: string },
): Promise<ShopProductCacheRevalidation> {
  const tenant = await env.DB.prepare("SELECT slug, host_name FROM tenants WHERE id = ? LIMIT 1")
    .bind(input.tenantId)
    .first<TenantUrlRow>();
  const host = tenant?.host_name || "shop.aiboux.com";
  const slug = tenant?.slug || input.tenantId;
  const targetUrl = `https://${host}/shop/${encodeURIComponent(slug)}/product/${encodeURIComponent(input.productId)}`;

  if (!env.CLOUDFLARE_ZONE_ID || !env.CLOUDFLARE_API_TOKEN) {
    return {
      requested: true,
      targetUrl,
      mode: "deferred",
      ok: true,
      reason: "cloudflare_purge_secret_not_configured",
    };
  }

  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files: [targetUrl] }),
    });
    return {
      requested: true,
      targetUrl,
      mode: "cloudflare_purge",
      ok: response.ok,
      reason: response.ok ? undefined : `cloudflare_purge_failed_${response.status}`,
    };
  } catch (error) {
    return {
      requested: true,
      targetUrl,
      mode: "cloudflare_purge",
      ok: false,
      reason: error instanceof Error ? error.message : "cloudflare_purge_failed",
    };
  }
}
