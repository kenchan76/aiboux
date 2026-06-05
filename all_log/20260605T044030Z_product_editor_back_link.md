# Product Editor Back Link WIP

Status: `CODE_READY_PUBLIC_DEPLOY_BLOCKED`

## Scope

- Changed the product editor `商品一覧へ戻る` action from `window.location.assign` to a real anchor link.
- Back-link target: `/s/aiboux/admin/products`.
- Added Playwright coverage for the product creation/editor page back-link href.

## Local Verification

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with 0 errors.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.
- Built assets contain `商品一覧へ戻る` as `href="/s/aiboux/admin/products"`.

## Public Verification

- Not run for this WIP because Wrangler is not authenticated.
- Public deployment and `/g/*` reflection remain blocked until Cloudflare/Wrangler authentication is restored.

## Not Final

- `FINAL_ACCEPTED` is not claimed.
- This is a local code-ready WIP only.
