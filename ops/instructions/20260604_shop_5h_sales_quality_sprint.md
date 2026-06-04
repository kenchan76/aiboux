# AIBOUX Shop 5H Sales Quality Sprint

Status: `ACTIVE_WIP`

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Target URLs

- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Product detail: `https://shop.aiboux.com/s/aiboux/product/{id}`
- Design editor: `https://shop.aiboux.com/s/aiboux/admin/design`
- Admin: `https://shop.aiboux.com/s/aiboux/admin`

`https://shop.aiboux.com/` is the Shop service site. Do not convert it into the tenant storefront.

## Sprint Rule

Do not stop after one passing gate. Treat this task as a sales quality sprint across the public storefront, product detail, cart, checkout, contact, legal pages, admin pages, design editor, and subscription lane.

Remote D1 subscription migration permission failures must be logged as a separate blocker and must not stop frontend/storefront quality work.

## Required Pages

Public:

- `/s/aiboux/`
- `/s/aiboux/products`
- `/s/aiboux/categories`
- `/s/aiboux/cart`
- `/s/aiboux/checkout`
- `/s/aiboux/contact`
- `/s/aiboux/legal`
- `/s/aiboux/privacy`
- `/s/aiboux/shipping`
- `/s/aiboux/returns`
- `/s/aiboux/faq`
- `/s/aiboux/product/{id}`

Admin:

- `/s/aiboux/admin`
- `/s/aiboux/admin/products`
- `/s/aiboux/admin/orders`
- `/s/aiboux/admin/inventory`
- `/s/aiboux/admin/categories`
- `/s/aiboux/admin/customers`
- `/s/aiboux/admin/content`
- `/s/aiboux/admin/analytics`
- `/s/aiboux/admin/apps`
- `/s/aiboux/admin/design`
- `/s/aiboux/admin/settings`
- `/s/aiboux/admin/subscriptions`

## Required Improvements

1. Create or strengthen public crawl gates for all pages above.
2. Keep the hero carousel smoothness gates: next, prev, dot, autoplay, side previews, transform transition, keyboard, and swipe.
3. Verify product cards, product detail links, add-to-cart, cart page, checkout page, contact validation, legal/privacy/shipping/returns pages, admin pages, and subscriptions page.
4. Capture screenshots for desktop and mobile pages and publish them under `public/g/screens/`.
5. Update `/g/l68`, `/g/d68`, and `/g/m68` before reporting.
6. Use status `SHOP_5H_SALES_QUALITY_SPRINT_WIP`.

## Gates To Add Or Run

- `gate:shop-public-crawl`
- `gate:shop-product-detail`
- `gate:shop-cart-checkout`
- `gate:shop-contact-legal`
- `gate:shop-admin-ops`
- `gate:shop-sales-quality`

`gate:shop-sales-quality` is a WIP audit gate until all lanes pass. Failure must be logged and used as the next repair list, not hidden.

## Prohibitions

- Do not say `FINAL_ACCEPTED`.
- Do not stop on a single passing test.
- Do not use `shop.aboux.com`.
- Do not turn `shop.aiboux.com/` into the tenant storefront.
- Do not use local-only evidence.
- Do not report before the public URL bundle is updated.
- Do not show secrets.
- Do not run `git reset --hard`, `git clean -fd`, `git clean -fdx`, force push, or destructive deletes.
