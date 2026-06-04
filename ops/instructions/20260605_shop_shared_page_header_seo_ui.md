# 2026-06-05 AIBOUX Shop Shared Page Header SEO/UI

## Status

`SHOP_10H_SHARED_PAGE_HEADER_SEO_UI_WIP`

## Objective

Continue the AIBOUX Shop sales-quality sprint by strengthening reusable SEO/UI parts across public tenant storefront pages.

## Scope

Target public tenant URLs:

- `https://shop.aiboux.com/s/aiboux/products`
- `https://shop.aiboux.com/s/aiboux/categories`
- `https://shop.aiboux.com/s/aiboux/cart`
- `https://shop.aiboux.com/s/aiboux/checkout`
- `https://shop.aiboux.com/s/aiboux/contact`
- `https://shop.aiboux.com/s/aiboux/legal`
- `https://shop.aiboux.com/s/aiboux/privacy`
- `https://shop.aiboux.com/s/aiboux/shipping`
- `https://shop.aiboux.com/s/aiboux/returns`
- `https://shop.aiboux.com/s/aiboux/faq`
- `https://shop.aiboux.com/s/aiboux/mypage`
- `https://shop.aiboux.com/s/aiboux/orders`
- `https://shop.aiboux.com/s/aiboux/favorites`
- `https://shop.aiboux.com/s/aiboux/login`
- `https://shop.aiboux.com/s/aiboux/register`
- `https://shop.aiboux.com/s/aiboux/mypage/subscriptions`

## Requirements

- Add a shared `StorefrontPageHeader` component for non-product public storefront pages.
- Keep product detail pages with one visible product `h1`; do not add a duplicate product title above the image.
- The shared page header must provide:
  - one page `h1`;
  - page description;
  - store context;
  - two or more crawlable internal links;
  - visible blue link affordance;
  - purchase/support/account context depending on the page.
- Page header actions must come from a shared data builder, not per-page hardcoded links.
- Public Playwright must verify the shared header on `https://shop.aiboux.com` public URLs.
- This is WIP only; do not claim `FINAL_ACCEPTED`.

## Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run astro -- check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`

## Reporting

Update:

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `public/g/l68.md`
- `public/g/d68.md`

Then WIP deploy and verify:

- `https://mail.aiboux.com/g/m68`
- `https://mail.aiboux.com/g/l68`
- `https://mail.aiboux.com/g/d68`

## Not Final

- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- `FINAL_ACCEPTED` remains prohibited.
