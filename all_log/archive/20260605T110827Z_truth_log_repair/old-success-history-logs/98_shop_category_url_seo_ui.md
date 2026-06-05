# AIBOUX Shop Stable Category URL SEO/UI WIP

Timestamp: 2026-06-04T17:48:29Z

Status: `SHOP_10H_CATEGORY_URL_SEO_UI_WIP`

This log records the category URL SEO/UI hardening cycle. It is not `FINAL_ACCEPTED`.

## Scope

- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Category URL example: `https://shop.aiboux.com/s/aiboux/products?category=coffee-tea`
- Shop service site remains: `https://shop.aiboux.com/`

## Changed Files

- `src/lib/shopSeo.ts`
- `src/pages/shop/[tenant]/[...path].astro`
- `tests/shop-public-crawl.spec.ts`
- `ops/instructions/20260605_shop_category_url_seo_ui.md`
- `ops/instructions/current.md`
- `ops/improvements/20260605_daily_improvement.md`
- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `public/g/l68.md`
- `public/g/d68.md`

## Implementation

- Added stable category sitemap entries.
- Added indexable category product URLs under `/s/aiboux/products?category={slug}`.
- Added category filtering for public product grid.
- Added category-specific H1, visible badge, canonical, robots, Open Graph URL, Twitter URL, breadcrumb, `CollectionPage`, and `ItemList`.
- Preserved search result behavior as crawlable GET with `noindex,follow,noarchive`.
- Reused shared storefront header, breadcrumb, product grid, navigation, and JSON-LD infrastructure.

## Public HTML Evidence

- URL: `https://shop.aiboux.com/s/aiboux/products?category=coffee-tea`
- HTTP status: 200
- implementation Worker Version ID: `4fbe75e7-3e56-4bcc-9cd3-f2560427db34`
- title: `コーヒー・お茶の商品一覧 | AIBOUX Store`
- canonical: `https://shop.aiboux.com/s/aiboux/products?category=coffee-tea`
- robots: `index,follow,max-image-preview:large`
- visible badge: `カテゴリ: コーヒー・お茶`
- JSON-LD verified: `BreadcrumbList`, `WebSite`, `OnlineStore`, `CollectionPage`, `SiteNavigationElement`, `ItemList`

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- WIP deploy: PASS
- WIP commit: `a534b5a WIP harden shop category URL SEO`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 8 tests
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS

## Public `/g/*` Publication

- Public log publication Worker Version ID: `607a7eca-0494-4ce6-9538-a11c5174ce83`
- `/g/m68`: HTTP 200 / `text/markdown; charset=utf-8`
- `/g/l68`: HTTP 200 / `text/markdown; charset=utf-8`
- `/g/d68`: HTTP 200 / `text/markdown; charset=utf-8`
- Verification file: `all_log/public-g/20260604T175625Z_category_url_seo_public_g_verification.txt`
- Public body keyword checks found `SHOP_10H_CATEGORY_URL_SEO_UI_WIP`, `coffee-tea`, and `カテゴリ: コーヒー・お茶`.
- Source markdown SHA and public body SHA differ because `/g/*` replaces `__WORKER_VERSION_ID__` with the live Cloudflare Worker Version ID at runtime.

## Bark Progress Notification

- Bark progress notification: delivered
- `skipped=false`
- `secretLogged=false`
- final gate: false
- Evidence file: `all_log/bark/20260604T175649Z_category_url_seo_progress_bark.json`

## Non-Final Items

- Remote D1 subscription migration is still blocked by Cloudflare permission.
- Provider-backed recurring subscription creation is not accepted.
- `FINAL_ACCEPTED` is prohibited.
