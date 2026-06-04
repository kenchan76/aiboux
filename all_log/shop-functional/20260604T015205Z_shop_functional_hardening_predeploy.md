# Shop Fix Cycle 04: Functional Hardening Predeploy Log

Status: `WIP_FUNCTIONAL_HARDENING_PENDING_DEPLOY`

Started at:

- `2026-06-04T01:52:05Z`

Scope:

- product list/detail
- settings/profile legal reflection
- cart add/quantity/remove/subtotal
- checkout transition with honest payment-not-connected state
- contact validation without fake send success
- public URL Playwright coverage

Changed implementation:

- Added `src/lib/server/shopStorefront.ts` for D1-backed storefront profile, products, categories, legal/privacy/shipping/returns text.
- Updated admin product loading in `src/components/shop/ShopClientShell.tsx`.
- Expanded `src/pages/api/shop/products/index.ts` product query columns for admin display.
- Added product refresh events in `src/components/shop/ProductEditor.tsx` and `src/components/shop/products/ShopProductWizard.tsx`.
- Added missing-image placeholder in `src/components/shop/ProductsTable.tsx`.
- Updated `src/pages/shop/storefront/[tenant].astro` to read published D1 products.
- Updated `src/pages/shop/[tenant]/[...path].astro` to read published D1 products, render D1 profile legal pages, and add minimal cart/contact/checkout client behavior.
- Added `tests/shop-functional-public.spec.ts`.

Predeploy verification:

- `npm run check:control-chars`: `CONTROL_CHAR_CHECK_OK`
- `npm run check:mojibake`: `MOJIBAKE_CHECK_OK files=426`
- `npm run astro check`: 0 errors, existing repository hints only
- `npm run check:shop-ui-protection`: warn-only as expected for protected Shop UI dirty paths
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS

Not final:

- Public WIP deploy has not yet been run for this cycle.
- Public Playwright has not yet been run against the deployed cycle.
- `/g/*` public sha256 evidence has not yet been refreshed after this cycle.
