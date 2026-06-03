# Shop WIP Deploy Public Reflection

## Status

WIP_DEPLOYED

FINAL_ACCEPTED ではない。

## Deploy Timestamp

- Latest checkpoint timestamp: `20260603T232211Z`

## WIP Commit

- Latest WIP commit hash: `3fea25cee2769c5e0f42d148f4596586bfb51972`
- WIP commit evidence: `all_log/checkpoints/20260603T232211Z_wip_commit.txt`

## Worker

- Current Version ID: `ed81108e-549c-4f02-8f32-bd70fc3e4efe`
- Deploy output log: `all_log/deploys/20260603T232211Z_deploy_shop_wip_short_route_fix_command.txt`
- Deployments-before log: `all_log/deploys/20260603T232211Z_deployments_before.txt`

## Checkpoint Evidence

- `all_log/checkpoints/20260603T232211Z_status_before.txt`
- `all_log/checkpoints/20260603T232211Z_head_before.txt`
- `all_log/checkpoints/20260603T232211Z_origin_main_before.txt`
- `all_log/checkpoints/20260603T232211Z_log_before.txt`
- `all_log/checkpoints/20260603T232211Z_wip_commit.txt`
- `all_log/patches/20260603T232211Z_before_deploy.patch`
- `all_log/patches/20260603T232211Z_before_deploy_staged.patch`

## Public /g Verification

Verification output directory:

- `/tmp/aiboux-shop-wip-20260603T232211Z`

| URL | HTTP | Content-Type | Local SHA256 | Remote SHA256 | Match |
| --- | --- | --- | --- | --- | --- |
| `https://mail.aiboux.com/g/m68` | 200 | `text/markdown; charset=utf-8` | `c15961469f0b44df0bcfdae02f3bc69072e4a8608c1a460ca51a12f62d917e72` | `c67c44fce776881b4ddffe51942ea98abdd3b957f7b1a1df838421f4145ba939` | no |
| `https://mail.aiboux.com/g/l68` | 200 | `text/markdown; charset=utf-8` | `c0319e74cf59f99eded51156509f2c719c4aea4c3c14bdac66596add30187483` | `2ab82b664777aac8c179c70eb66d2ec3b1b959b1014718f344be5a0925f8d527` | no |
| `https://mail.aiboux.com/g/d68` | 200 | `text/markdown; charset=utf-8` | `0c50a6dc221cd384591a060e308548ecac6c67cf6288486fd615b3272d1ba7b0` | `e9598f11b69485f967f72300fc3b81fb6e8e2c7c68e9219b6025ebe42e6e9e4a` | no |

The SHA mismatch is expected for files containing `__WORKER_VERSION_ID__`.
The `/g/*` route replaces that placeholder at runtime, so public body hashes differ from source markdown hashes while the content remains the intended WIP evidence document.

## Shop Public URL Verification

| URL | HTTP | Worker Version ID | Title |
| --- | --- | --- | --- |
| `https://shop.aiboux.com/` | 200 | `ed81108e-549c-4f02-8f32-bd70fc3e4efe` | `AIBOUX SHOP | サービスサイト` |
| `https://shop.aiboux.com/s/aiboux/` | 200 | `ed81108e-549c-4f02-8f32-bd70fc3e4efe` | `AIBOUX Store | AIBOUX Storefront` |
| `https://shop.aiboux.com/s/aiboux/admin` | 200 | `ed81108e-549c-4f02-8f32-bd70fc3e4efe` | `AIBOUX SHOP Dashboard` |

## Verification Commands

```bash
npm run check:control-chars
npm run check:mojibake
npm run check:shop-ui-protection
ESBUILD_WORKER_THREADS=0 npm run build
npm run deploy:shop:wip
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T232211Z/m68.headers https://mail.aiboux.com/g/m68 -o /tmp/aiboux-shop-wip-20260603T232211Z/m68.body
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T232211Z/l68.headers https://mail.aiboux.com/g/l68 -o /tmp/aiboux-shop-wip-20260603T232211Z/l68.body
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T232211Z/d68.headers https://mail.aiboux.com/g/d68 -o /tmp/aiboux-shop-wip-20260603T232211Z/d68.body
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T232211Z/shoproot.headers https://shop.aiboux.com/ -o /tmp/aiboux-shop-wip-20260603T232211Z/shoproot.html
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T232211Z/storefront.headers https://shop.aiboux.com/s/aiboux/ -o /tmp/aiboux-shop-wip-20260603T232211Z/storefront.html
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T232211Z/admin.headers https://shop.aiboux.com/s/aiboux/admin -o /tmp/aiboux-shop-wip-20260603T232211Z/admin.html
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
PREV=$(cat all_log/checkpoints/20260603T232211Z_head_before.txt)
git switch -c rollback-shop-wip-20260603T232211Z "$PREV"
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
