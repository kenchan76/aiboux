# SHOP_SHARED_PRODUCT_CARD_SEO_UI_WIP

Timestamp: 2026-06-04T19:18:00Z
Status: WIP_DEPLOYED_NOT_FINAL

## URL Bundle

- Master: https://mail.aiboux.com/g/m68
- Log: https://mail.aiboux.com/g/l68
- Screen: https://mail.aiboux.com/g/d68

## Objective

Strengthen every public tenant storefront product surface by replacing duplicated product-card markup with one shared SEO/UI component.

## SEO References Checked

- Google Search Central SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Central crawlable links: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google Search Central product structured data: https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- Google Search Central breadcrumb structured data: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- Google Search Central ecommerce structured data: https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce

## Changed Files

- `ops/instructions/20260605_shop_shared_product_card_seo_ui.md`
- `ops/instructions/current.md`
- `src/components/shop/storefront/StorefrontProductCard.astro`
- `src/pages/shop/[tenant]/[...path].astro`
- `tests/shop-public-crawl.spec.ts`
- `tests/shop-product-detail-public.spec.ts`

## Implementation

- Added shared `StorefrontProductCard.astro`.
- Standardized product detail links, category links, image alt text, review count, rating, price, tax label, hover behavior, cart data attributes, and CTA placement.
- Added visible blue product title/category link affordance.
- Added `Product`, `AggregateRating`, and `Offer` microdata to shared product cards.
- Replaced duplicated product card markup on products, product detail related products, cart recommendations, mypage, orders, favorites, subscription, login, and register surfaces.
- Strengthened Playwright checks for shared product-card presence, product/offer microdata, crawlable product/category URLs, and image alt text.

## Public Deploy

- Implementation commit: `6090368`
- Deploy checkpoint commit: `8f43942`
- Worker Version ID: `ec4df0de-75ea-4976-b185-c06e2c7f16d8`

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS with existing warnings/hints only
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-seo-meta`: PASS, 6 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`: PASS, 3 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 9 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS across public crawl, carousel, storefront interaction, storefront visual, product detail, cart/checkout, contact/legal, and admin ops.

## Screen Evidence

- Products 1980: `https://mail.aiboux.com/g/screens/shop-products-page-1980.png`
- Product detail 1980: `https://mail.aiboux.com/g/screens/shop-product-detail-1980.png`
- Cart 1980: `https://mail.aiboux.com/g/screens/shop-cart-page-1980.png`
- Favorites 1980: `https://mail.aiboux.com/g/screens/shop-favorites-1980.png`
- My page 1980: `https://mail.aiboux.com/g/screens/shop-mypage-1980.png`
- Subscriptions 1980: `https://mail.aiboux.com/g/screens/shop-mypage-subscriptions-1980.png`
- Orders 1980: `https://mail.aiboux.com/g/screens/shop-orders-1980.png`
- Login 1980: `https://mail.aiboux.com/g/screens/shop-login-1980.png`
- Register 1980: `https://mail.aiboux.com/g/screens/shop-register-1980.png`

## Not Final

- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- This is not `FINAL_ACCEPTED`.

