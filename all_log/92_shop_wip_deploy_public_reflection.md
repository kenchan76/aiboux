# Shop WIP Deploy Public Reflection

## Status

WIP_DEPLOYED

## Deploy Timestamp

- Checkpoint timestamp: `20260603T231418Z`

## WIP Commit

- WIP commit hash: `1d3683bab5ede4bb1c8bb7a035a9500e09bc0692`
- WIP commit evidence: `all_log/checkpoints/20260603T231418Z_wip_commit.txt`

## Worker

- Current Version ID: `48abf844-f3e7-493f-9086-7a21a5a1c345`
- Deploy output log: `all_log/deploys/20260603T231417Z_deploy_shop_wip_command.txt`
- Deployments-before log: `all_log/deploys/20260603T231418Z_deployments_before.txt`

## Checkpoint Evidence

- `all_log/checkpoints/20260603T231418Z_status_before.txt`
- `all_log/checkpoints/20260603T231418Z_head_before.txt`
- `all_log/checkpoints/20260603T231418Z_origin_main_before.txt`
- `all_log/checkpoints/20260603T231418Z_log_before.txt`
- `all_log/patches/20260603T231418Z_before_deploy.patch`
- `all_log/patches/20260603T231418Z_before_deploy_staged.patch`

## Public /g Verification

| URL | HTTP | Content-Type | Local SHA256 | Remote SHA256 | Match |
| --- | --- | --- | --- | --- | --- |
| `https://mail.aiboux.com/g/m68` | 200 | `text/markdown; charset=utf-8` | `c15961469f0b44df0bcfdae02f3bc69072e4a8608c1a460ca51a12f62d917e72` | `df009a014262297b1393b56f916ff12122f7a0af8b3a0fd989865a5f05fdc607` | no |
| `https://mail.aiboux.com/g/l68` | 200 | `text/markdown; charset=utf-8` | `beb22dcb4fa2d04625c3167194a1d4fec6cb211f774a39682518f7e5e87f56d6` | `beb22dcb4fa2d04625c3167194a1d4fec6cb211f774a39682518f7e5e87f56d6` | yes |
| `https://mail.aiboux.com/g/d68` | 200 | `text/markdown; charset=utf-8` | `e91dd5f80b50151ff1ce296123eae2feff3b0ad2e9121c59568394d754bc53e7` | `e91dd5f80b50151ff1ce296123eae2feff3b0ad2e9121c59568394d754bc53e7` | yes |

## Shop Public URL Verification

| URL | HTTP | Worker Version ID | Title |
| --- | --- | --- | --- |
| `https://shop.aiboux.com/` | 200 | `48abf844-f3e7-493f-9086-7a21a5a1c345` | `AIBOUX SHOP | サービスサイト` |
| `https://shop.aiboux.com/s/aiboux/` | 200 | `48abf844-f3e7-493f-9086-7a21a5a1c345` | `AIBOUX Store | AIBOUX Storefront` |
| `https://shop.aiboux.com/s/aiboux/admin` | 200 | `48abf844-f3e7-493f-9086-7a21a5a1c345` | `AIBOUX SHOP Dashboard` |

## Verification Commands

```bash
npm run check:control-chars
npm run check:mojibake
npm run check:shop-ui-protection
ESBUILD_WORKER_THREADS=0 npm run build
npm run deploy:shop:wip
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T231418Z/m68.headers https://mail.aiboux.com/g/m68 -o /tmp/aiboux-shop-wip-20260603T231418Z/m68.body
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T231418Z/l68.headers https://mail.aiboux.com/g/l68 -o /tmp/aiboux-shop-wip-20260603T231418Z/l68.body
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T231418Z/d68.headers https://mail.aiboux.com/g/d68 -o /tmp/aiboux-shop-wip-20260603T231418Z/d68.body
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T231418Z/admin.headers https://shop.aiboux.com/s/aiboux/admin -o /tmp/aiboux-shop-wip-20260603T231418Z/admin.html
curl -sS -L -D /tmp/aiboux-shop-wip-20260603T231418Z/storefront.headers https://shop.aiboux.com/s/aiboux/ -o /tmp/aiboux-shop-wip-20260603T231418Z/storefront.html
```

## Known WIP Issues

- `FINAL_ACCEPTED` is not allowed.
- Strict Shop UI protection remains expected NG until final cleanup and visual evidence are complete.
- `m68` public SHA does not match `public/g/m68.md`; public route uses the temp share mapping for `AIBOUX_MASTER_DOCUMENT.md` content.
- Shop sales tenant feature completion is not verified yet.
- UI visual review by user is still required.

## Rollback Options

Worker rollback:

```bash
npx wrangler deployments list --name aiboux
npx wrangler rollback --name aiboux
```

Git checkpoint redeploy:

```bash
PREV=$(cat all_log/checkpoints/20260603T231418Z_head_before.txt)
git switch -c rollback-shop-wip-20260603T231418Z "$PREV"
ESBUILD_WORKER_THREADS=0 npm run build
npx wrangler deploy
```

## Safety

- This is `WIP_DEPLOYED`, not `FINAL_ACCEPTED`.
- No DB migration was applied.
- Bark was not sent.
- Secrets were not printed.
