# Shop App Status Wording Cleanup

Timestamp: 2026-06-05T05:18:30Z

Status: `LOCAL_WIP_PUBLIC_DEPLOY_BLOCKED`

## Scope

- `src/data/shop-sample-data.ts`
- `src/components/shop/StatusBadges.tsx`

## Changes

- Shop app integration status values now use `受付前` instead of `未接続`.
- The status badge tone map was updated for the new label.
- Shop source scan no longer finds `未接続` in `src/components/shop`, `src/pages/shop`, `src/data/shop-sample-data.ts`, or Shop storefront libraries.

## Verification Plan

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with 0 errors.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.

Public verification remains pending until Wrangler authentication is restored and the WIP is deployed.
