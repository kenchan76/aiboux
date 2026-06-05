# AIBOUX Shop Footer SEO Sitemap Public Verification

Status: `SHOP_5H_FOOTER_SEO_SITEMAP_WIP_DEPLOYED_NOT_FINAL`

This is not `FINAL_ACCEPTED`.

## Purpose

The user required every AIBOUX Shop page structure to become SEO-strong and UI-strong, asked for common parts, and specifically requested stronger shared SEO across all pages. This work unit strengthens the shared storefront footer as a crawlable internal-link surface.

## Implementation

- WIP implementation commit: `dd23f4d`.
- WIP gate assertion commit: `62e7799`.
- WIP deploy Worker Version ID: `97620c07-b5ce-4267-8174-d4ecc546afc0`.
- Added `buildShopFooterSeoSitemapLinks(tenantRoot)`.
- Added visible footer SEO sitemap to `StorefrontFooter`.
- Added footer SEO sitemap links into TOP and subpage `SiteNavigationElement` JSON-LD source links.
- Strengthened public crawl and product detail gates.

## Verification

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with pre-existing hints only.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.
- `npx wrangler deploy`: PASS.
- Direct public curl TOP: HTTP 200 and markers `storefront-footer-seo-sitemap`, `SEO site map`, `ItemList`, `text-sky-200`.
- Direct public curl product detail: HTTP 200 and markers `storefront-footer-seo-sitemap`, `SEO site map`, `ItemList`, `text-sky-200`.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 9 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`: PASS, 3 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS.

## Subscription Lane

- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-subscriptions`: BLOCKED / not final.
- Reason: subscription plan POST returned HTTP 200, but the public gate did not observe the active test plan persisted in the response.
- Secret-safe failure artifacts: `all_log/test-results/20260604T234439Z_shop_subscription_gate_blocked/`.
- Remote D1 subscription migration and provider-backed recurring billing are not accepted.
- `FINAL_ACCEPTED` remains prohibited.

## Public Evidence

- Public log publication Worker Version ID: `__WORKER_VERSION_ID__`.
- Public URLs:
  - Master: `https://mail.aiboux.com/g/m68`.
  - Log: `https://mail.aiboux.com/g/l68`.
  - Screen: `https://mail.aiboux.com/g/d68`.
- Progress Bark notification:
  - Delivered: `true`.
  - Skipped: `false`.
  - Secret logged: `false`.
  - Final gate: `false`.
  - User receipt confirmed: `false`.
  - Worker Version ID at send time: `01497459-dc46-4d0f-b698-da46e5c2baac`.
