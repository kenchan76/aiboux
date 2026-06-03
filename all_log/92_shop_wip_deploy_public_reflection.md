# Shop WIP Deploy Public Reflection

## Status

WIP_DEPLOYED

FINAL_ACCEPTED ではない。

## Deploy Timestamp

- Latest checkpoint timestamp: `20260603T232600Z`

## WIP Commit

- Latest WIP commit hash: `38e9566e4bfc7ec0fe63bd77438c9553650dc177`
- WIP commit evidence: `all_log/checkpoints/20260603T232600Z_wip_commit.txt`

## Worker

- Current Version ID: `5f64b20a-d4ef-42e5-95e9-6f262c4e5dd8`
- Deploy output log: `all_log/deploys/20260603T232600Z_deploy_shop_wip_log_refresh_command.txt`
- Deployments-before log: `all_log/deploys/20260603T232600Z_deployments_before.txt`

## Checkpoint Evidence

- `all_log/checkpoints/20260603T232600Z_status_before.txt`
- `all_log/checkpoints/20260603T232600Z_head_before.txt`
- `all_log/checkpoints/20260603T232600Z_origin_main_before.txt`
- `all_log/checkpoints/20260603T232600Z_log_before.txt`
- `all_log/checkpoints/20260603T232600Z_wip_commit.txt`
- `all_log/patches/20260603T232600Z_before_deploy.patch`
- `all_log/patches/20260603T232600Z_before_deploy_staged.patch`

## Public /g Verification

Verification output directory:

- `/tmp/aiboux-shop-wip-20260603T232600Z`

| URL | HTTP | Content-Type | Local SHA256 | Remote SHA256 | Match |
| --- | --- | --- | --- | --- | --- |
| `https://mail.aiboux.com/g/m68` | 200 | `text/markdown; charset=utf-8` | `c15961469f0b44df0bcfdae02f3bc69072e4a8608c1a460ca51a12f62d917e72` | `d5435a08fc8288b692fab6eeb58fdadaf128398009108caea075c3bcb08bd233` | no |
| `https://mail.aiboux.com/g/l68` | 200 | `text/markdown; charset=utf-8` | `cf9076a93dbc80081aa20a8d8348bf090a495d07017c4d4cdb0144fbedf3bf29` | `ea6e65ba686704842a84cfbb1507fecf8510e2f78f05213d982a8ab58c117f5e` | no |
| `https://mail.aiboux.com/g/d68` | 200 | `text/markdown; charset=utf-8` | `0c50a6dc221cd384591a060e308548ecac6c67cf6288486fd615b3272d1ba7b0` | `78796257da90b43c6893cde8ad2689b2aa909524a2cbec093be27d27686b54f2` | no |

The SHA mismatch is expected for files containing `__WORKER_VERSION_ID__`.
The `/g/*` route replaces that placeholder at runtime, so public body hashes differ from source markdown hashes while the content remains the intended WIP evidence document.

## Shop Public URL Verification

| URL | HTTP | Worker Version ID | Title |
| --- | --- | --- | --- |
| `https://shop.aiboux.com/` | 200 | `5f64b20a-d4ef-42e5-95e9-6f262c4e5dd8` | `AIBOUX SHOP | サービスサイト` |
| `https://shop.aiboux.com/s/aiboux/` | 200 | `5f64b20a-d4ef-42e5-95e9-6f262c4e5dd8` | `AIBOUX Store | AIBOUX Storefront` |
| `https://shop.aiboux.com/s/aiboux/admin` | 200 | `5f64b20a-d4ef-42e5-95e9-6f262c4e5dd8` | `AIBOUX SHOP Dashboard` |

## Verification Commands

```bash
npm run check:control-chars
npm run check:mojibake
npm run check:shop-ui-protection
ESBUILD_WORKER_THREADS=0 npm run build
npm run deploy:shop:wip
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T232600Z/m68.headers https://mail.aiboux.com/g/m68 -o /tmp/aiboux-shop-wip-20260603T232600Z/m68.body
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T232600Z/l68.headers https://mail.aiboux.com/g/l68 -o /tmp/aiboux-shop-wip-20260603T232600Z/l68.body
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T232600Z/d68.headers https://mail.aiboux.com/g/d68 -o /tmp/aiboux-shop-wip-20260603T232600Z/d68.body
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T232600Z/shoproot.headers https://shop.aiboux.com/ -o /tmp/aiboux-shop-wip-20260603T232600Z/shoproot.html
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T232600Z/storefront.headers https://shop.aiboux.com/s/aiboux/ -o /tmp/aiboux-shop-wip-20260603T232600Z/storefront.html
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T232600Z/admin.headers https://shop.aiboux.com/s/aiboux/admin -o /tmp/aiboux-shop-wip-20260603T232600Z/admin.html
```

## Known WIP Issues

- `FINAL_ACCEPTED` is not allowed.
- Strict Shop UI protection remains final-only.
- Shop sales tenant feature completion is not verified yet.
- Public screenshots and Playwright full behavior evidence are still required before final acceptance.
- Product create/edit/list/storefront reflection is not yet final-verified.
- Settings save/public page reflection is not yet final-verified.
- Cart/contact/legal/privacy/shipping/returns behavior is not yet final-verified.

## Rollback Options

Worker rollback:

```bash
npx wrangler deployments list --name aiboux
npx wrangler rollback --name aiboux
```

Git checkpoint redeploy:

```bash
PREV=$(cat all_log/checkpoints/20260603T232600Z_head_before.txt)
git switch -c rollback-shop-wip-20260603T232600Z "$PREV"
ESBUILD_WORKER_THREADS=0 npm run build
npx wrangler deploy
```

## Safety

- This is `WIP_DEPLOYED`, not `FINAL_ACCEPTED`.
- No DB migration was applied.
- Bark was not sent.
- Secrets were not printed.
- `git reset --hard` was not run.
- `git clean -fd` was not run.
- Force push was not run.
