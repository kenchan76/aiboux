# Checkout Empty-State Sales Recovery

Timestamp: 2026-06-05T05:23:00Z

Status: `LOCAL_WIP_PUBLIC_DEPLOY_BLOCKED`

## Scope

- `src/pages/shop/[tenant]/[...path].astro`

## Changes

- Checkout no longer shows only a single text sentence when the cart is empty.
- Empty checkout now renders `storefront-checkout-empty-guide`.
- The guide links back to product listing, cart, and shipping conditions.

## Verification Plan

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with 0 errors.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.

Public verification remains pending until Wrangler authentication is restored and the WIP is deployed.
