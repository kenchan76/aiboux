# Shop 5H Sales Quality Sprint WIP

Status: `SHOP_5H_SALES_QUALITY_SPRINT_WIP`

## Public URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Worker

- WIP code deploy Worker Version ID: `c9c83766-c725-46fd-86cc-b408fdae4d8e`
- WIP commit before evidence update: `ab2bdc6`

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS, 0 errors
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `npm run gate:shop-public-crawl`: PASS, 4 passed
- `npm run gate:shop-storefront-carousel`: PASS, 2 passed
- `npm run gate:shop-storefront-interaction`: PASS, 2 passed
- `npm run gate:shop-storefront-visual`: PASS, 3 passed
- `npm run gate:shop-product-detail`: PASS, 3 passed
- `npm run gate:shop-cart-checkout`: PASS, 1 passed
- `npm run gate:shop-contact-legal`: PASS, 2 passed
- `npm run gate:shop-admin-ops`: PASS, 2 passed
- `npm run gate:shop-sales-quality`: PASS

## Subscription Lane

- `npm run gate:shop-subscriptions`: FAIL
- Failure: `subscription plan GET should succeed`; received HTTP 503.
- Classification: `D1_PERMISSION_BLOCKED_NOT_FINAL`.
- This is not a storefront/admin quality blocker and remains a separate remote D1 subscription schema blocker.

## Screenshots Published Under `/g/screens`

- `shop-top-1365.png`
- `shop-top-1980.png`
- `shop-top-mobile.png`
- `shop-products-page-1980.png`
- `shop-categories-page-1980.png`
- `shop-cart-page.png`
- `shop-cart-page-1980.png`
- `shop-checkout-page.png`
- `shop-checkout-page-1980.png`
- `shop-contact-page.png`
- `shop-contact-page-1980.png`
- `shop-legal-page.png`
- `shop-legal-page-1980.png`
- `shop-privacy-page.png`
- `shop-privacy-page-1980.png`
- `shop-shipping-page.png`
- `shop-shipping-page-1980.png`
- `shop-returns-page.png`
- `shop-returns-page-1980.png`
- `shop-faq-page.png`
- `shop-faq-page-1980.png`
- `shop-product-detail-1365.png`
- `shop-product-detail-1980.png`
- `shop-product-detail-mobile.png`
- `shop-admin-products.png`
- `shop-admin-orders.png`
- `shop-admin-settings.png`
- `shop-admin-design.png`
- `shop-admin-subscriptions.png`

## Not Final

This is WIP evidence only. `FINAL_ACCEPTED` is prohibited until subscription remote D1 migration and full recurring billing gates are resolved.
