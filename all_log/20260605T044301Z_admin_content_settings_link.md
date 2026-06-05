# Admin Content Settings Link WIP

Status: `CODE_READY_PUBLIC_DEPLOY_BLOCKED`

## Scope

- Replaced the disabled `コンテンツを作成` button in admin/content with a real link to `/s/aiboux/admin/settings`.
- Reworded the content panel so it points to editable store wording, legal, shipping, returns, and contact copy.
- Changed per-row content edit actions to real settings links when content rows exist.
- Added Playwright coverage that the admin/content page exposes the settings link and no longer shows the old API-wait wording.

## Local Verification

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with 0 errors.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.
- Built assets contain `ストア文言を編集` as `href="/s/aiboux/admin/settings"`.
- Built assets no longer contain the old `コンテンツ保存API接続後` disabled-button wording for the content panel.

## Public Verification

- Not run for this WIP because Wrangler is not authenticated.
- Public deployment and `/g/*` reflection remain blocked until Cloudflare/Wrangler authentication is restored.

## Not Final

- `FINAL_ACCEPTED` is not claimed.
- This is a local code-ready WIP only.
