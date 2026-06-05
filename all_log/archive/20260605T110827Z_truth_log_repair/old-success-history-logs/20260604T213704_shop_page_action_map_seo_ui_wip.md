# AIBOUX Shop Page Action Map SEO/UI WIP

Status: `SHOP_5H_PAGE_ACTION_MAP_SEO_UI_WIP`

This is not `FINAL_ACCEPTED`.

## Scope

User requested every storefront page structure to be SEO-strong and UI-strong, and asked to identify reusable common parts. This cycle adds a shared page-specific action map to every public storefront page.

## References Checked

- Google Search Central Breadcrumb structured data
- Google Search Central ecommerce structured data
- Google Search Central URL structure best practices
- Google Search Central Product snippet structured data

## Changed Areas

- `ops/instructions/20260605_shop_page_action_map_seo_ui.md`
- `ops/instructions/current.md`
- `ops/improvements/20260605_daily_improvement.md`
- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `public/g/l68.md`
- `public/g/d68.md`
- `src/lib/shopStorefrontShared.ts`
- `src/components/shop/storefront/StorefrontPageActionMap.tsx`
- `src/components/shop/storefront/ShadcnStorefront.tsx`
- `src/pages/shop/storefront/[tenant].astro`
- `src/pages/shop/[tenant]/[...path].astro`
- `tests/shop-public-crawl.spec.ts`
- `tests/shop-product-detail-public.spec.ts`

## Local Verification Before Deploy

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS

## Public Verification

- WIP implementation commit: `88ab5e4`
- WIP text-collision fix commit: `86773c8`
- WIP deploy Worker Version ID: `0d378f76-d1b9-4f87-afb4-711095743e1c`
- Product action-map text-collision fix Worker Version ID: `ea1005e3-12f6-412c-870f-2872a826e0e5`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/shop-public-crawl.spec.ts tests/shop-product-detail-public.spec.ts`: PASS, 12 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-subscriptions`: BLOCKED / not final.
- Subscription failure artifacts: `all_log/test-results/20260604T215000_subscription_gate_blocked_after_action_map/`

## Non-Final Conditions

- Remote D1 subscription migration is not accepted.
- Provider-backed recurring subscription creation is not accepted.
- `FINAL_ACCEPTED` remains prohibited.
