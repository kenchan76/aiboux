# Core Delivery Detail Deploy Blocked Auth

作成日: 2026-05-31

## Status

DEPLOY_BLOCKED_AUTH

## User Instruction

納品書詳細画面の比較はPASS済み。本番デプロイだけがWrangler / Cloudflare認証で止まっている。

## Confirmed

- Reference / Actual c82 comparison: PASS
- Geometry: PASS
- Typography: PASS
- Text mismatch: 0
- Forbidden text: 0
- Design status: PREVIEW_READY_PENDING_USER
- Production deploy status: DEPLOY_BLOCKED_AUTH

## Required Human Action

- Local VPS: run `npx wrangler login`
- CI/CD: restore `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`

## Forbidden

- Do not claim DEPLOYED.
- Do not claim FINAL_ACCEPTED.
- Do not claim COMPLETED.
- Do not invent Worker Version ID.
- Do not retry production deploy while Wrangler is unauthenticated.

## Current URLs

- マスター: https://mainly-fighters-cruise-screens.trycloudflare.com/m82.html
- ログ: https://mainly-fighters-cruise-screens.trycloudflare.com/l82.html
- 画面: https://mainly-fighters-cruise-screens.trycloudflare.com/d82.html
- 比較: https://mainly-fighters-cruise-screens.trycloudflare.com/c82.html
