# Design Editor And Product Integration Actions

Status: `LOCAL_WIP_NOT_FINAL`

## Purpose

Continue the AIBOUX Shop sales-quality sprint by replacing inert admin controls with usable operations that directly affect the screen state.

## Changed

- `src/components/shop/StorefrontDesignBuilder.tsx`
  - Added working Undo and Redo stacks for storefront layout edits.
  - Added desktop/mobile preview mode state.
  - Updated preview frame to expose `data-preview-device` and change width by selected mode.

- `src/components/shop/ShopProductIntegrationPanel.tsx`
  - Replaced API-wait disabled controls with usable screen operations.
  - Core sync now marks the product as synchronized.
  - Approval action now marks the workflow as approval pending.
  - SKU add dialog now saves a local SKU row.
  - AI draft buttons now show created state.
  - Draft save records a visible save timestamp.

- `tests/shop-admin-ops-public.spec.ts`
  - Added design editor Undo/Redo and preview-device checks.
  - Added Core product integration operation checks.

## Notes

- This is local WIP evidence only.
- Public deploy and `/g/*` publication remain blocked until Wrangler/Cloudflare authentication is restored.
- No `FINAL_ACCEPTED` is claimed.

## Verification

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with 0 errors.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.
- `npx wrangler whoami`: BLOCKED. Wrangler is not authenticated in the current shell.
- `npm run preview -- --host 127.0.0.1 --port 8894`: BLOCKED by Cloudflare remote proxy startup because `xdg-open` is unavailable in the current shell.
