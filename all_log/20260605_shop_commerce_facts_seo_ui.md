# SHOP_5H_COMMERCE_FACTS_SEO_UI_WIP

Timestamp: 2026-06-05T05:20:00+09:00
Status: WIP_DEPLOYED_NOT_FINAL

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Objective

Strengthen all public AIBOUX Shop tenant pages with shared SEO/UI purchase facts:

- price and tax display;
- stock and shipping context;
- return policy;
- payment state;
- support links;
- subscription readiness.

## References Checked

- Google Search Central SEO Starter Guide.
- Google Search Central ecommerce URL structure.
- Google Search Central Product structured data.
- Google Search Central merchant listing and return policy structured data.
- Google Search Central Breadcrumb structured data.
- Google Search Central crawlable link guidance.

## Changed Files

- `src/lib/shopStorefrontShared.ts`
- `src/components/shop/storefront/StorefrontCommerceFacts.tsx`
- `src/components/shop/storefront/ShadcnStorefront.tsx`
- `src/pages/shop/[tenant]/[...path].astro`
- `tests/shop-public-crawl.spec.ts`
- `tests/shop-product-detail-public.spec.ts`
- `ops/instructions/20260605_shop_commerce_facts_seo_ui.md`
- `ops/instructions/current.md`
- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `public/g/l68.md`
- `public/g/d68.md`

## Public Deploy

- WIP implementation commit: `d2bc86e`
- WIP deploy checkpoint commit: `6b93e7d`
- Implementation Worker Version ID: `d3a99848-acc8-47be-bd09-661e24b1fe85`

## Verification

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro check`: PASS with existing hints only.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 9 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`: PASS, 3 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS across public crawl, smooth carousel, storefront interaction, storefront visual, product detail, cart/checkout, contact/legal, and admin ops.

## Evidence Summary

- Every public storefront page renders `data-testid="storefront-commerce-facts"`.
- Every shared commerce facts block exposes `https://schema.org/SiteNavigationElement` microdata.
- Every shared commerce facts block exposes at least five crawlable internal links.
- Product detail still has one visible product `h1`.
- Visible product detail breadcrumb current label remains `商品詳細`.
- Product title remains in JSON-LD breadcrumb data.
- Checkout and subscription copy remains honest; no fake success state was introduced.

## Not Final

- `FINAL_ACCEPTED` is prohibited.
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- This is a WIP SEO/UI hardening cycle, not full Shop completion.
