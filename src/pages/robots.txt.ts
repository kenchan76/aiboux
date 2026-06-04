import type { APIRoute } from "astro";

const shopRobots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /s/aiboux/cart",
  "Disallow: /s/aiboux/checkout",
  "Disallow: /s/aiboux/mypage",
  "Disallow: /s/aiboux/account",
  "Disallow: /s/aiboux/orders",
  "Disallow: /s/aiboux/favorites",
  "Disallow: /s/aiboux/login",
  "Disallow: /s/aiboux/register",
  "Disallow: /s/aiboux/admin",
  "",
  "Sitemap: https://shop.aiboux.com/sitemap.xml",
  "",
].join("\n");

const defaultRobots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /api/",
  "Disallow: /g/",
  "",
].join("\n");

export const GET: APIRoute = ({ request }) => {
  const host = new URL(request.url).host;
  const body = host === "shop.aiboux.com" ? shopRobots : defaultRobots;
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
