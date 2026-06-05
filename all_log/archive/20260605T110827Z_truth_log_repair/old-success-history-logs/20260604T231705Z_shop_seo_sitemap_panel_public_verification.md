# AIBOUX Shop SEO Sitemap Panel Public Verification

Status: `SHOP_5H_SEO_SITEMAP_PANEL_WIP_DEPLOYED_NOT_FINAL`

This is not `FINAL_ACCEPTED`.

## Purpose

The user required every AIBOUX Shop page structure to become SEO-strong and UI-strong, and asked to identify shared parts that can be commonized. This work unit adds a shared SEO site map panel to every public tenant storefront page.

The target tenant storefront remains:

- `https://shop.aiboux.com/s/aiboux/`

The Shop service site remains:

- `https://shop.aiboux.com/`

## Official SEO References Checked

- Google Search Central SEO Starter Guide: logical site structure, descriptive URLs, canonicalization, helpful content, crawlable links, title/meta description, and image alt text.
- Google Search Central Breadcrumb structured data: visible user path and `BreadcrumbList` eligibility.
- Google Search Central Product and Merchant Listing structured data: Product/Offer eligibility, price, availability, shipping, returns, and Merchant Center alignment.
- Google Search Central Page Experience: page-specific experience, Core Web Vitals, HTTPS, mobile usability, and avoiding intrusive UI.

## Implementation

- `ops/instructions/20260605_shop_seo_sitemap_panel_commonization.md`
  - Added the active instruction for SEO site map panel commonization.
- `ops/instructions/current.md`
  - Reflected the current SEO site map panel work unit.
- `ops/improvements/20260605_daily_improvement.md`
  - Added a practical daily improvement: every SEO commonization WIP must include a public DOM gate for visible shared SEO parts.
- `src/lib/shopStorefrontShared.ts`
  - Added `ShopStorefrontSeoSiteMapPanel`, `ShopStorefrontSeoSiteMapNode`, and `buildShopSeoSiteMapPanel(page, tenantRoot, input)`.
- `src/components/shop/storefront/StorefrontSeoSiteMapPanel.tsx`
  - Added the shared visible SEO site map panel.
  - Uses crawlable `<a href>` links with visible blue/underlined link affordance.
  - Exposes visible `ItemList` / `ListItem` microdata and `numberOfItems`.
  - Shows page role, canonical URL, robots policy, and sitemap status.
- `src/components/shop/storefront/ShadcnStorefront.tsx`
  - Renders the TOP SEO site map panel after the shared SEO checklist.
- `src/pages/shop/storefront/[tenant].astro`
  - Adds SEO site map links to TOP `SiteNavigationElement` JSON-LD source links.
- `src/pages/shop/[tenant]/[...path].astro`
  - Renders the SEO site map panel on public subpages and product detail.
  - Applies page-specific `robots` policy.
  - Adds SEO site map links into subpage `SiteNavigationElement` JSON-LD source links.
- `tests/shop-public-crawl.spec.ts`
  - Strengthened public crawl tests for the SEO site map panel across public storefront pages.
- `tests/shop-product-detail-public.spec.ts`
  - Strengthened product detail tests for the SEO site map panel while keeping one visible product `h1`.

## Verification Before Deploy

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.

## Deploy Evidence

- WIP implementation commit: `912978c42733e0ed6f88ba811d0f42fb920ee2d5`.
- WIP deploy Worker Version ID: `3b710f35-a295-492c-a303-a8cf2ba3226f`.

## Public Gate Results

- Initial `gate:shop-public-crawl` had a transient public route/cache mismatch on `/s/aiboux/` while checking `storefront-seo-sitemap-panel`.
- Direct public curl confirmed the latest Worker and TOP marker:
  - URL: `https://shop.aiboux.com/s/aiboux/?verify=sitemap-panel`
  - HTTP: 200.
  - `x-aiboux-worker-version`: `3b710f35-a295-492c-a303-a8cf2ba3226f`.
  - Public HTML contained `storefront-seo-sitemap-panel`, `SEO site map`, `canonical`, and `robots`.
- Rerun `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 9 tests.
- Rerun `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`: PASS, 3 tests.
- Rerun `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS across all public sales-quality sub-gates:
  - `gate:shop-public-crawl`: PASS, 9 tests.
  - `gate:shop-storefront-carousel`: PASS, 2 tests.
  - `gate:shop-storefront-interaction`: PASS, 2 tests.
  - `gate:shop-storefront-visual`: PASS, 3 tests.
  - `gate:shop-product-detail`: PASS, 3 tests.
  - `gate:shop-cart-checkout`: PASS, 1 test.
  - `gate:shop-contact-legal`: PASS, 2 tests.
  - `gate:shop-admin-ops`: PASS, 2 tests.

## Subscription Lane

- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-subscriptions`: BLOCKED / not final.
- Reason: subscription plan POST returned HTTP 200, but the public gate did not observe the active test plan persisted in the response.
- Secret-safe failure artifacts were moved to `all_log/test-results/20260604T231705Z_subscription_gate_blocked_seo_sitemap_panel/`.
- `FINAL_ACCEPTED` remains prohibited.

## Public SEO/UI Markers

- Public TOP and public product detail render `data-testid="storefront-seo-sitemap-panel"`.
- The SEO site map panel renders visible `ItemList` / `ListItem` microdata.
- The SEO site map panel exposes crawlable blue/underlined internal links.
- The SEO site map panel displays canonical URL, robots policy, and sitemap status.
- Product detail keeps one visible product `h1`; duplicate product title above the image gallery remains prohibited.

## Non-Final Conditions

- This is a WIP SEO/UI commonization deployment.
- Remote D1 subscription migration and provider-backed recurring billing are not accepted.
- `gate:shop-subscriptions` is still BLOCKED / not final.
- `FINAL_ACCEPTED` remains prohibited.

## Public Log Publication And Bark Progress

- Public log publication Worker Version ID: `__WORKER_VERSION_ID__`.
- Public `m68/l68/d68`: HTTP 200 / `text/markdown; charset=utf-8`.
- Public Shop TOP: HTTP 200 / `x-aiboux-worker-version: fe1e6ec0-4463-48b8-8fed-91e97d78ee2d`.
- Public Shop product detail: HTTP 200 / `x-aiboux-worker-version: fe1e6ec0-4463-48b8-8fed-91e97d78ee2d`.
- TOP and product detail public HTML markers found:
  - `storefront-seo-sitemap-panel`: present.
  - `SEO site map`: present.
  - `canonical`: present.
  - `robots`: present.
- Public `/g/*` SHA note: source markdown SHA and public body SHA differ because the `/g/*` route replaces `__WORKER_VERSION_ID__` at response time. The mismatch is expected and recorded honestly.
- Progress Bark notification:
  - Purpose: progress notification.
  - Stage: `DEPLOYED_NOT_FINAL`.
  - Delivered: `true`.
  - Skipped: `false`.
  - Secret logged: `false`.
  - Final gate: `false`.
  - User receipt confirmed: `false`.
  - Worker Version ID at send time: `fe1e6ec0-4463-48b8-8fed-91e97d78ee2d`.
  - Secret-safe evidence file: `all_log/bark/*_seo_sitemap_panel_progress_bark.json`.
