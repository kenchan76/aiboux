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

Pending after WIP deploy.

## Non-Final Conditions

- Remote D1 subscription migration is not accepted.
- Provider-backed recurring subscription creation is not accepted.
- `FINAL_ACCEPTED` remains prohibited.
