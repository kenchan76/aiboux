# AIBOUX Shop Shared Category Link Parts WIP

Timestamp: 2026-06-04T18:03:00Z

Status: `SHOP_10H_SHARED_CATEGORY_LINK_PARTS_WIP`

This log records the category link commonization cycle. It is not `FINAL_ACCEPTED`.

## Scope

- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Product detail example: `https://shop.aiboux.com/s/aiboux/product/setsuka-coffee`
- Shop service site remains: `https://shop.aiboux.com/`

## Changed Files

- `src/lib/shopStorefrontShared.ts`
- `src/lib/shopSeo.ts`
- `src/components/shop/storefront/ShadcnStorefront.tsx`
- `src/pages/shop/[tenant]/[...path].astro`
- `tests/shop-public-crawl.spec.ts`
- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `public/g/l68.md`
- `public/g/d68.md`

## Implementation

- Centralized category link generation into shared helpers.
- Header category navigation now uses stable category URLs.
- Footer sale/ranking links now use stable category URLs.
- Product detail breadcrumb category link now resolves to a stable slug URL.
- Sitemap category URLs now use the same curated category source.

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- WIP commit: `9728617 WIP centralize shop category SEO links`
- WIP deploy: PASS
- Implementation Worker Version ID: `3b551bcd-da16-4307-9a36-0d6189e26e37`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 9 tests
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS
- Public evidence deploy: PASS
- Public evidence publication Worker Version ID: `2509548b-b345-49a6-aa39-514703740f97`
- Public evidence deploy log: `all_log/deploys/20260604T180900Z_publish_shared_category_link_parts_evidence.txt`
- Public `/g/*` verification: `all_log/public-g/20260604T181033Z_shared_category_link_parts_public_g_verification.txt`
- Public `/g/m68`: HTTP 200, `text/markdown; charset=utf-8`
- Public `/g/l68`: HTTP 200, `text/markdown; charset=utf-8`
- Public `/g/d68`: HTTP 200, `text/markdown; charset=utf-8`
- Bark progress notification: PASS
- Bark evidence: `all_log/bark/20260604T181103Z_shared_category_link_parts_progress_bark.json`
- Bark result: `delivered=true`, `skipped=false`, `secretLogged=false`

## Public SHA Notes

- `public/g/*.md` and the public bodies intentionally differ in sha256 when runtime placeholders are replaced by the Worker Version Metadata binding.
- The public bodies include `2509548b-b345-49a6-aa39-514703740f97`.
- The public `/g/*` URLs are no-store markdown responses.

## Verified Link Assertions

- Header `日用品`: `/s/aiboux/products?category=daily-goods`
- Header `セール`: `/s/aiboux/products?category=sale`
- Header `ランキング`: `/s/aiboux/products?category=ranking`
- Footer `タイムセール`: `/s/aiboux/products?category=sale`
- Footer `売れ筋ランキング`: `/s/aiboux/products?category=ranking`
- Product breadcrumb `コーヒー・お茶`: `/s/aiboux/products?category=coffee-tea`

## Non-Final Items

- Remote D1 subscription migration is still blocked by Cloudflare permission.
- Provider-backed recurring subscription creation is not accepted.
- `FINAL_ACCEPTED` is prohibited.
