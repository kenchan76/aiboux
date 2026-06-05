# SHOP_10H_ALL_PAGES_SEO_STRUCTURE_UI_WIP

Timestamp: 2026-06-04T18:30:00Z
Status: WIP_DEPLOYED_NOT_FINAL

## Objective

Strengthen all public AIBOUX Shop tenant pages so the page structure is more SEO-complete, internally linked, reusable, and UI-consistent.

The target tenant URLs remain:

- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Product detail: `https://shop.aiboux.com/s/aiboux/product/{id}`
- Admin design editor: `https://shop.aiboux.com/s/aiboux/admin/design`

`https://shop.aiboux.com/` remains the Shop service site and was not changed into the tenant storefront.

## Implemented

- Added shared contextual internal-link sections for every public storefront page.
- Added `StorefrontContextLinks` as a reusable public storefront SEO/UI component.
- Rendered context links on the TOP storefront route and shared dynamic storefront route.
- Added visible blue link affordance for contextual SEO links.
- Added `SiteNavigationElement` microdata to contextual links.
- Included contextual links in `SiteNavigationElement` JSON-LD.
- Added contextual links as an `ItemList` fallback for pages that do not have product/category item lists.
- Strengthened `tests/shop-public-crawl.spec.ts` to require contextual links, visible blue links, navigation microdata, crawlable anchors, and ItemList JSON-LD across public storefront pages.
- Added `gate:shop-seo-structure`.

## Changed Files

- `src/lib/shopStorefrontShared.ts`
- `src/lib/shopSeo.ts`
- `src/components/shop/storefront/StorefrontContextLinks.tsx`
- `src/components/shop/storefront/ShadcnStorefront.tsx`
- `src/pages/shop/[tenant]/[...path].astro`
- `src/pages/shop/storefront/[tenant].astro`
- `tests/shop-public-crawl.spec.ts`
- `package.json`
- `ops/instructions/20260605_shop_all_pages_seo_structure_ui.md`
- `ops/instructions/current.md`

## Deploy Evidence

First deploy:

- Worker Version ID: `1c6fde84-5225-4469-bdd1-9fd1a0f19ef6`
- Deploy log: `all_log/deploys/20260604T181721Z_shop_all_pages_seo_structure_wip_deploy.txt`
- Result: deployed, but public crawl found the TOP route lacked the new context-link component because TOP uses a separate renderer.

Fix deploy:

- Worker Version ID: `5e4d836d-50f6-41cb-aee2-894a02fbaa94`
- Deploy log: `all_log/deploys/20260604T182202Z_shop_all_pages_seo_structure_top_context_fix_deploy.txt`
- Result: deployed with TOP route context links included.

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 9 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS

`gate:shop-sales-quality` passed:

- `gate:shop-public-crawl`: PASS
- `gate:shop-storefront-carousel`: PASS
- `gate:shop-storefront-interaction`: PASS
- `gate:shop-storefront-visual`: PASS
- `gate:shop-product-detail`: PASS
- `gate:shop-cart-checkout`: PASS
- `gate:shop-contact-legal`: PASS
- `gate:shop-admin-ops`: PASS

## Public SEO/UI Assertions

The public crawl now verifies:

- public storefront pages render styled HTML at 1365px, 1980px, and mobile;
- shared contextual internal links exist on public storefront pages;
- visible blue link affordance exists for SEO/support links;
- contextual link navigation includes `SiteNavigationElement` microdata;
- public storefront pages include `ItemList` structured data;
- public internal links resolve to implemented tenant URLs;
- robots and sitemap expose only intended indexable tenant discovery pages;
- storefront search uses crawlable GET URLs and keeps query pages noindex;
- stable category product URLs are meaningful indexable discovery pages;
- shared category links use stable slug URLs across header and product breadcrumbs.

## Public Screen Evidence

Representative public screen evidence remains available at:

- `https://mail.aiboux.com/g/screens/shop-top-1365.png`
- `https://mail.aiboux.com/g/screens/shop-top-1980.png`
- `https://mail.aiboux.com/g/screens/shop-top-mobile.png`
- `https://mail.aiboux.com/g/screens/shop-product-detail-1365.png`
- `https://mail.aiboux.com/g/screens/shop-product-detail-1980.png`
- `https://mail.aiboux.com/g/screens/shop-product-detail-mobile.png`
- `https://mail.aiboux.com/g/screens/shop-cart-page-1980.png`
- `https://mail.aiboux.com/g/screens/shop-checkout-page-1980.png`
- `https://mail.aiboux.com/g/screens/shop-contact-page-1980.png`
- `https://mail.aiboux.com/g/screens/shop-legal-page-1980.png`
- `https://mail.aiboux.com/g/screens/shop-admin-design.png`
- `https://mail.aiboux.com/g/screens/shop-admin-subscriptions.png`

## Reference SEO Basis

- Google Search Central SEO Starter Guide: page structure should help users and search engines understand content.
- Google Search Central crawlable links guidance: important navigation must use real crawlable anchors.
- Google Search Central ecommerce URL guidance: ecommerce URLs and links should expose stable discovery paths.
- Google Search Central breadcrumb structured data guidance: breadcrumb hierarchy should be represented with structured data.
- Google Search Central product structured data guidance: merchant product pages should expose product facts in initial HTML where eligible.

## Not Final

- This is not `FINAL_ACCEPTED`.
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- Final acceptance still requires subscription D1/provider verification, final public evidence, and final Bark receipt confirmation when required.

## Public Evidence Publication

Public evidence deploy:

- Worker Version ID: `dce27ebd-6fe4-4801-8976-aefee00b14d0`
- Deploy log: `all_log/deploys/20260604T182707Z_publish_all_pages_seo_structure_evidence.txt`

Public `/g/*` verification:

- `https://mail.aiboux.com/g/m68?verify=20260604T182951Z`: HTTP 200 / `text/markdown; charset=utf-8`
- `https://mail.aiboux.com/g/l68?verify=20260604T182951Z`: HTTP 200 / `text/markdown; charset=utf-8`
- `https://mail.aiboux.com/g/d68?verify=20260604T182951Z`: HTTP 200 / `text/markdown; charset=utf-8`
- Marker `SHOP_10H_ALL_PAGES_SEO_STRUCTURE_UI_WIP`: present in public m68/l68/d68.
- Fix Worker Version ID `5e4d836d-50f6-41cb-aee2-894a02fbaa94`: present in public m68/l68/d68.
- Verification file: `all_log/public-g/20260604T182951Z_all_pages_seo_structure_public_g_nocache_verification.txt`

SHA note:

- Public `/g/*` responses include runtime Worker Version ID substitution.
- SHA mismatch between `public/g/*.md` and fetched `/g/*` bodies is expected when runtime substitutions are present.

Progress Bark notification:

- purpose: progress
- delivered: true
- skipped: false
- secretLogged: false
- finalGate: false
- userReceiptConfirmed: false
- Worker Version ID: `dce27ebd-6fe4-4801-8976-aefee00b14d0`
- Evidence file: `all_log/bark/20260604T183003Z_all_pages_seo_structure_progress_bark.json`
