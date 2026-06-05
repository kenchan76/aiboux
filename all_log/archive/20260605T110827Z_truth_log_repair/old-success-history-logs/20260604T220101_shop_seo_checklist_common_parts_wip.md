# AIBOUX Shop Shared SEO/UI Checklist Commonization WIP

Status: `SHOP_5H_SEO_CHECKLIST_COMMON_PARTS_WIP`

This is not `FINAL_ACCEPTED`.

## Purpose

The user required every storefront page structure to be SEO-strong and UI-strong, and asked whether more shared parts can be extracted.

This work unit adds a shared page-specific SEO/UI checklist so every public page visibly declares:

- H1 and breadcrumb expectations;
- crawlable internal-link expectations;
- purchase-condition expectations;
- structured-data expectations;
- honest payment/subscription state expectations.

## Changed Files

- `ops/instructions/20260605_shop_page_action_map_seo_ui.md`
- `ops/instructions/current.md`
- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `public/g/l68.md`
- `public/g/d68.md`
- `src/lib/shopStorefrontShared.ts`
- `src/components/shop/storefront/StorefrontSeoChecklist.tsx`
- `src/components/shop/storefront/ShadcnStorefront.tsx`
- `src/pages/shop/[tenant]/[...path].astro`
- `tests/shop-public-crawl.spec.ts`
- `tests/shop-product-detail-public.spec.ts`

## Implementation

- Added `ShopStorefrontSeoChecklist` and `ShopStorefrontSeoChecklistItem`.
- Added `buildShopSeoChecklist(page, tenantRoot)`.
- Added `StorefrontSeoChecklist`.
- Rendered the checklist on TOP, product detail, and all public storefront subpages.
- Added checklist links into subpage `SiteNavigationElement` JSON-LD source links.
- Strengthened public crawl and product-detail gates to check:
  - `data-testid="storefront-seo-checklist"`;
  - visible `ItemList` microdata;
  - visible `ListItem` microdata;
  - `numberOfItems`;
  - crawlable links;
  - visible blue/underlined link affordance;
  - product detail single-H1 expectations.

## Verification Before Deploy

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS, 0 errors, existing warnings only
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS

## Public Verification

- WIP checkpoint commit: `1fce168e109b6530e21a0e72c257aff22dd11e49`
- WIP deploy Worker Version ID: `e73cd20f-4416-4cea-bef7-020396cd9649`
- `https://shop.aiboux.com/s/aiboux/`: HTTP 200 / `text/html` / `x-aiboux-worker-version: e73cd20f-4416-4cea-bef7-020396cd9649`
- `https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4580000232621`: HTTP 200 / `text/html` / `x-aiboux-worker-version: e73cd20f-4416-4cea-bef7-020396cd9649`
- Public TOP HTML markers:
  - `data-testid="storefront-seo-checklist"`
  - `SEO / UI checklist`
  - `TOPページSEO/UIチェック`
  - `共通SEO部品`
- Public product detail HTML markers:
  - `data-testid="storefront-seo-checklist"`
  - `商品詳細SEO/UIチェック`
  - `商品名H1は1つ`
  - `Product/Offer`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/shop-public-crawl.spec.ts tests/shop-product-detail-public.spec.ts`: PASS, 12 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-subscriptions`: BLOCKED / not final.
- Secret-safe subscription failure artifacts: `all_log/test-results/20260604T220900_subscription_gate_blocked_after_seo_checklist/`
- Public check artifacts: `all_log/public-checks/20260604T221600Z/`
- Progress Bark notification: `delivered=true`, `skipped=false`, `secretLogged=false`, `finalGate=false`, evidence file `all_log/bark/20260604T221650Z_seo_checklist_progress_bark.json`.

## Non-Final Conditions

- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring subscription creation remains unverified.
- `gate:shop-subscriptions` remains final-only/blocking for final acceptance.
- `FINAL_ACCEPTED` remains prohibited.
