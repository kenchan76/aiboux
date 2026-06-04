# AIBOUX Shop Trust Matrix SEO/UI Public Verification

Status: `SHOP_5H_TRUST_MATRIX_SEO_UI_WIP_DEPLOYED_NOT_FINAL`

This is not `FINAL_ACCEPTED`.

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Implementation State

- WIP commit before this log update: `56b73b50f6b341e8bfe7a1bd88ddb09ecaffea2e`
- Latest WIP Worker Version ID before this log update: `b496e1a2-0bde-4cbd-9d07-8ff86e9e156b`

## Verified Public Gates

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 9 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-storefront-carousel`: PASS, 2 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-storefront-interaction`: PASS, 2 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-storefront-visual`: PASS, 3 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`: PASS, 3 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-cart-checkout`: PASS, 1 test.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-contact-legal`: PASS, 2 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-admin-ops`: PASS, 2 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS across the public sales-quality lane.

## Subscription Lane

- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-subscriptions`: BLOCKED / not final.
- Reason: subscription plan POST returned HTTP 200, but the public gate did not observe the active test plan persisted in the response.
- Secret-safe failure artifacts were moved to `all_log/test-results/20260604T225051Z_subscription_gate_blocked_trust_matrix/`.

## SEO/UI Commonization

- `StorefrontTrustMatrix` renders on TOP and product detail.
- Trust matrix links are crawlable `<a href>` anchors.
- Trust matrix links use visible blue/underlined affordance.
- Trust matrix exposes visible `ItemList` / `ListItem` microdata and `numberOfItems`.
- Product detail keeps one visible product `h1`.
- Duplicate product title above the image gallery remains prohibited.
- Related product fallback links now point to implemented product IDs instead of non-existent `-related` paths.

## Screen Evidence

Updated public screen artifacts were refreshed under `public/g/screens/`.

Key files:

- `/g/screens/shop-top-1365.png`
- `/g/screens/public-storefront-after-quality-fix-1980.png`
- `/g/screens/public-storefront-after-quality-fix-mobile.png`
- `/g/screens/shop-admin-design.png`
- `/g/screens/shop-cart-page.png`
- `/g/screens/shop-checkout-page.png`
- `/g/screens/shop-contact-page.png`
- `/g/screens/shop-legal-page.png`
- `/g/screens/shop-privacy-page.png`
- `/g/screens/shop-shipping-page.png`
- `/g/screens/shop-returns-page.png`
- `/g/screens/shop-faq-page.png`
- `/g/screens/shop-hero-before-click-1365.png`
- `/g/screens/shop-hero-during-animation-1365.png`
- `/g/screens/shop-hero-after-next-smooth-1365.png`
- `/g/screens/shop-hero-after-dot-smooth-1365.png`
- `/g/screens/shop-hero-after-autoplay-smooth-1365.png`

## Non-Final Conditions

- Remote D1 subscription migration and provider-backed recurring billing are not accepted.
- `gate:shop-subscriptions` remains BLOCKED / not final.
- `FINAL_ACCEPTED` remains prohibited.
