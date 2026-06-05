# Inventory CSV Actions WIP

Status: `CODE_READY_PUBLIC_DEPLOY_BLOCKED`

## Scope

- Replaced disabled inventory CSV import/export buttons with real controls.
- CSV export downloads the current inventory rows as a BOM-prefixed CSV file.
- CSV import accepts `.csv` files and updates stock drafts by `productId` or SKU/product number.
- Existing row-level save remains the persistence action.
- Added Playwright coverage that inventory CSV controls are enabled and old API-wait wording is absent.

## Local Verification

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with 0 errors.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.
- Built assets contain enabled `CSV取り込み` and `CSV書き出し` controls.
- Built assets contain `aiboux-inventory-YYYY-MM-DD.csv` export behavior.
- Built assets no longer contain `CSV取り込みAPI接続後` or `CSV書き出しAPI接続後` disabled-placeholder wording.

## Public Verification

- Not run for this WIP because Wrangler is not authenticated.
- Public deployment and `/g/*` reflection remain blocked until Cloudflare/Wrangler authentication is restored.

## Not Final

- `FINAL_ACCEPTED` is not claimed.
- This is a local code-ready WIP only.
