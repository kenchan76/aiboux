# AIBOUX Shop Remove Visible Explanation Panels

Status: WIP_DEPLOYED_NOT_FINAL

Timestamp: 2026-06-05T01:02:21Z

## Objective

Remove shopper-facing SEO/explanation panels from public AIBOUX Shop pages while preserving the actual SEO structure through head metadata, JSON-LD, breadcrumbs, footer links, search, and canonical tenant routes.

## URLs

- Master: https://mail.aiboux.com/g/m68
- Log: https://mail.aiboux.com/g/l68
- Screen: https://mail.aiboux.com/g/d68
- Storefront TOP: https://shop.aiboux.com/s/aiboux/
- Product detail: https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4580000232621

## Changed Work

- Removed visible `StorefrontCommerceFacts`, `StorefrontTrustMatrix`, `StorefrontPageQualitySummary`, `StorefrontPageActionMap`, `StorefrontBuyingGuide`, `StorefrontContextLinks`, `StorefrontSeoHub`, and `StorefrontSupportRail` rendering from the TOP shopper flow.
- Removed the same visible explanation panels from tenant subpages and product detail.
- Kept actual customer navigation through header category links, search, breadcrumbs, product cards, page header actions, and the dense storefront footer.
- Updated public Playwright gates so visible explanation panels are now forbidden in the shopper flow.

## Commit And Deployment

- WIP commit: `3b537c1189264aa3e15b1ec2688470180b72ec3a`
- Worker Version ID: `c7c9e23b-fa2e-4b29-adfc-dfd83b92be82`
- Deployment status: WIP deployed
- FINAL_ACCEPTED: no

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro -- check`: PASS with existing warnings only
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`: PASS, 3 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-contact-legal`: PASS, 2 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 9 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS

## Direct Public HTML Grep

Checked with cache-busting public requests:

- TOP: no `storefront-commerce-facts`, `storefront-trust-matrix`, `storefront-page-quality-summary`, `storefront-page-action-map`, `storefront-buying-guide`, `storefront-context-links`, `storefront-seo-hub`, `storefront-support-rail`.
- Product detail: no `storefront-commerce-facts`, `storefront-trust-matrix`, `storefront-page-quality-summary`, `storefront-page-action-map`, `storefront-buying-guide`, `storefront-context-links`, `storefront-seo-hub`, `storefront-support-rail`.

## Screen Evidence

Updated screenshots under `public/g/screens/` include:

- `shop-top-1365.png`
- `shop-top-1980.png`
- `shop-top-mobile.png`
- `shop-product-detail-1365.png`
- `shop-product-detail-1980.png`
- `shop-product-detail-mobile.png`
- `shop-contact-page.png`
- `shop-legal-page.png`
- `shop-privacy-page.png`
- `shop-shipping-page.png`
- `shop-returns-page.png`
- `shop-faq-page.png`

## Not Final

This is not FINAL_ACCEPTED. The broader 5-hour Shop sales-quality sprint remains open. D1 subscription remote migration and final Bark receipt-gated acceptance are not complete.
