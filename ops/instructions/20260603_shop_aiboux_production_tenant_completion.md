# AIBOUX Shop Aiboux Production Tenant Completion

## Status

CODE_READY_REQUIRED

## Source Of Truth

- `AIBOUX_MASTER_DOCUMENT.md`
- User instruction on 2026-06-03: make `https://shop.aiboux.com/s/aiboux/admin` and storefront function as a sales-ready tenant, not demo/sample UI.

## Target

- Repository: `/home/pkkatsu/aiboux`
- Service site: `https://shop.aiboux.com/`
- Storefront: `https://shop.aiboux.com/s/aiboux/`
- Admin: `https://shop.aiboux.com/s/aiboux/admin`

## Objective

Make AIBOUX Shop `aiboux` tenant usable as a sales tenant:

- no fake completion;
- no sample figures in production admin;
- no broken buttons;
- no tenant route drift;
- no `shop.aboux.com`;
- admin and storefront pages open under the correct `/s/aiboux` routes;
- product creation/editing/settings/cart/checkout/contact/legal policy flows have real stateful behavior or honest not-configured states.

## Absolute URL Rules

- `shop.aiboux.com` is correct.
- `shop.aboux.com` is incorrect and must not be introduced.
- `shop.aiboux.com/` is the Shop service site.
- `shop.aiboux.com/s/aiboux/` is the storefront.
- `shop.aiboux.com/s/aiboux/admin` is the Shop admin.
- Do not make `shop.aiboux.com/` the storefront direct URL.
- Do not route admin to `shop.aiboux.com/admin`.

## Prohibited

- `git reset --hard`
- `git clean -fd`
- `git clean -fdx`
- force push
- secret display
- Bark early send
- false completion report
- marking unverified behavior as verified
- leaving known `href="#"` or `javascript:void(0)` in production Shop UI
- leaving admin production UI dependent on demo values such as `山田`, `2024/05`, `#10085`, `TSH-001`

## Required Initial Audit

Run and record:

- repo state
- `src/pages/shop`
- `src/components/shop`
- `src/data`
- `src/pages/shop/api`
- `migrations`, `db`
- public URL curl for Shop root, storefront, admin
- static grep for sample/mock/demo/dummy and stale tenant routes

## Required Implementation Direction

1. Remove production admin dependency on `src/data/shop-sample-data.ts`.
2. Use D1-backed or tenant-local persistent state APIs for Shop admin and storefront.
3. If there is no production data, show honest empty states with real action links.
4. Ensure admin navigation uses `/s/aiboux/admin/...` tenant routes.
5. Ensure storefront routes use `/s/aiboux/...`.
6. Implement or repair:
   - dashboard metrics from real orders/products/inventory;
   - product list/create/edit;
   - order list/detail empty or real DB-backed state;
   - inventory list/edit;
   - categories list/create/edit;
   - customer list/detail empty or real DB-backed state;
   - content/settings persistence;
   - storefront products/product detail/cart/checkout/contact/legal/privacy/shipping/returns;
   - honest payment not-configured state if payment is not fully connected.

## Required Verification

Run:

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run gate:aiboux`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- Playwright or equivalent public URL checks for admin/storefront.

## Required Public URL Checks

Check:

- `https://shop.aiboux.com/`
- `https://shop.aiboux.com/s/aiboux/`
- `https://shop.aiboux.com/s/aiboux/admin`
- admin pages:
  - `/s/aiboux/admin/orders`
  - `/s/aiboux/admin/products`
  - `/s/aiboux/admin/inventory`
  - `/s/aiboux/admin/categories`
  - `/s/aiboux/admin/customers`
  - `/s/aiboux/admin/content`
  - `/s/aiboux/admin/analytics`
  - `/s/aiboux/admin/apps`
  - `/s/aiboux/admin/design`
  - `/s/aiboux/admin/settings`
- storefront pages:
  - `/s/aiboux/products`
  - `/s/aiboux/categories`
  - `/s/aiboux/cart`
  - `/s/aiboux/checkout`
  - `/s/aiboux/contact`
  - `/s/aiboux/legal`
  - `/s/aiboux/privacy`
  - `/s/aiboux/shipping`
  - `/s/aiboux/returns`

## Required Evidence

Write all evidence to `all_log/87_shop_aiboux_production_tenant_completion.md`.

Update public log `public/g/l68.md` only after the implementation evidence is real.

## Completion Report Must Include

- changed files;
- migration list;
- Worker Version ID if deployed;
- all URL status table;
- admin link verification;
- storefront link verification;
- product create/list/storefront evidence;
- settings to public page evidence;
- cart to checkout evidence;
- known unresolved items or explicit zero unresolved items;
- Bark not sent unless final acceptance requires it.
