# SHOP_5H_SCHEMA_GRAPH_SEO_UI_WIP

Timestamp: 2026-06-04T19:39:29Z
Status: `WIP_DEPLOYED_NOT_FINAL`

## Objective

Continue the AIBOUX Shop 5-hour sales-quality sprint by strengthening every public storefront page's SEO entity structure.

The implemented WIP change converts public storefront JSON-LD output from a loose array of separate entities into one connected Schema.org `@graph`.

## Changed Files

- `ops/instructions/20260605_shop_schema_graph_seo_ui.md`
- `ops/instructions/current.md`
- `src/lib/shopSeo.ts`
- `src/pages/shop/storefront/[tenant].astro`
- `src/pages/shop/[tenant]/[...path].astro`
- `tests/shop-public-crawl.spec.ts`
- `tests/shop-product-detail-public.spec.ts`

## Implementation

- Added `buildShopStructuredDataGraph()` to `src/lib/shopSeo.ts`.
- The helper emits one top-level `@context: https://schema.org`.
- The helper emits a top-level `@graph` array.
- The helper strips repeated top-level `@context` from graph nodes.
- The helper deduplicates graph nodes by `@id` where possible.
- TOP and subpage storefront routes now use the shared graph helper.
- Public Playwright checks now parse JSON-LD and verify graph structure.

## Public Deploy

- WIP implementation commit: `414690b`
- WIP deploy checkpoint commit: `304e0a5`
- Worker Version ID: `2c4c61f2-3be5-4901-8c35-d519ce451737`

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS, existing hints only
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 9 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`: PASS, 3 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS

## Direct Public HTML Evidence

- TOP URL: `https://shop.aiboux.com/s/aiboux/`
- Product URL: `https://shop.aiboux.com/s/aiboux/product/setsuka-coffee`
- Both returned HTTP 200.
- Both returned `x-aiboux-worker-version: 2c4c61f2-3be5-4901-8c35-d519ce451737`.
- TOP JSON-LD `@graph` count: 1
- TOP JSON-LD `@context` count: 1
- Product JSON-LD `@graph` count: 1
- Product JSON-LD `@context` count: 1
- TOP JSON-LD includes `WebSite`, `OnlineStore`, `BreadcrumbList`, `SiteNavigationElement`, `Product`, and `ItemList`.

Evidence files:

- `all_log/public-checks/20260604T193929Z_shop_top_graph.headers`
- `all_log/public-checks/20260604T193929Z_shop_top_graph.html`
- `all_log/public-checks/20260604T193929Z_shop_product_graph.headers`
- `all_log/public-checks/20260604T193929Z_shop_product_graph.html`

## Not Final

- This is not `FINAL_ACCEPTED`.
- Remote D1 subscription migration remains blocked by Cloudflare permissions.
- Provider-backed recurring subscription creation remains unverified.

