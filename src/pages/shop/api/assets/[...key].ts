import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const key = params.key?.trim();
  if (!key || !isSafeShopAssetKey(key)) {
    return new Response("Not found", { status: 404 });
  }

  const object = await env.SHOP_STORAGE.get(key);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(object.body, {
    status: 200,
    headers: {
      "content-type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "cache-control": object.httpMetadata?.cacheControl ?? "public, max-age=3600",
      "etag": object.httpEtag,
      "x-content-type-options": "nosniff",
    },
  });
};

function isSafeShopAssetKey(key: string): boolean {
  if (key.length > 700 || key.includes("..") || key.includes("\\") || key.startsWith("/")) return false;
  return /^[a-zA-Z0-9_-]+\/shop\/(product|document-logo|misc)\/seo\/\d{4}-\d{2}-\d{2}\/[a-zA-Z0-9._/-]+$/.test(key);
}
