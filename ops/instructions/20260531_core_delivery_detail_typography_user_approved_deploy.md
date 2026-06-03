# Core Delivery Detail Typography User Approved Deploy

## Status

DEPLOY_PENDING

## User Decision

ユーザーが c77 の状態を確認し、「まずこれで良いのでデプロイしよう」と明示したため、本番反映へ進める。

## Target

- AIBOUX Core
- `/core/deliveries`
- 納品書詳細画面 Typography 修正版 c77

## Source Preview

- マスター: https://mainly-fighters-cruise-screens.trycloudflare.com/m77.html
- ログ: https://mainly-fighters-cruise-screens.trycloudflare.com/l77.html
- 画面: https://mainly-fighters-cruise-screens.trycloudflare.com/d77.html
- 比較: https://mainly-fighters-cruise-screens.trycloudflare.com/c77.html

## Required Pre-Deploy Verification

- `npm run check:mojibake`
- `npm run astro check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- delivery detail Playwright tests
- `npm run gate:code`
- `npx wrangler whoami`

## Deploy Command

- `npx wrangler deploy --keep-vars`

## Required Public Verification

- `https://core.aiboux.com/core/deliveries` HTTP 200
- `https://core.aiboux.com/g/cdeliv9` HTTP 200
- `/g/cdeliv9` is not stale COMPLETED log
- `/g/cdeliv9` is UTF-8 OK

## Required Log

- `all_log/70_core_delivery_detail_typography_user_approved_deploy_log.md`

## Bark

- Send Progress Bark after deploy attempt/result.
- Do not send Final Acceptance Bark.

## Notes

- Target status after successful deploy: DEPLOYED.
- Not FINAL_ACCEPTED.
- Not COMPLETED.
