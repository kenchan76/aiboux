# Admin Collection / Discount Action Cleanup

Timestamp: 2026-06-05T05:10:20Z

Status: `LOCAL_WIP_PUBLIC_DEPLOY_BLOCKED`

## Scope

- `src/components/shop/CollectionsTable.tsx`
- `src/components/shop/DiscountsTable.tsx`
- `src/components/shop/ShopSettingsPanel.tsx`
- `src/components/shop/onboarding/ShopOnboardingWizard.tsx`

## Changes

- Collection table create/edit/check/open actions no longer render as permanent disabled placeholders.
- Discount table create/edit/duplicate/stop actions now update the admin UI.
- Payment setup status labels were changed from internal connection wording to operator-facing acceptance wording.

## Verification Plan

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with 0 errors.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.

Public verification remains pending until Wrangler authentication is restored and the WIP is deployed.
