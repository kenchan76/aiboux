# Core Delivery Detail Deploy Blocked Auth Log

作成日時: 2026-05-31 17:46 JST

## Status

DEPLOY_BLOCKED_AUTH

## Design State

- Status: PREVIEW_READY_PENDING_USER
- Reference / Actual c82 comparison: PASS
- Geometry: PASS
- Typography: PASS
- Text mismatch: 0
- Forbidden text: 0
- visualBlockers: 0
- productNameSingleLine: PASS

## Deploy Blocker

- command: `npx wrangler whoami`
- result: unauthenticated
- output summary: `You are not authenticated. Please run wrangler login.`

## Required Human Action

- Local VPS: run `npx wrangler login`
- CI/CD: restore `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`

## URLs

- マスター: https://mainly-fighters-cruise-screens.trycloudflare.com/m82.html
- ログ: https://mainly-fighters-cruise-screens.trycloudflare.com/l82.html
- 画面: https://mainly-fighters-cruise-screens.trycloudflare.com/d82.html
- 比較: https://mainly-fighters-cruise-screens.trycloudflare.com/c82.html

## Notes

- Not DEPLOYED
- Not FINAL_ACCEPTED
- Not COMPLETED
- Worker Version ID is not available because deploy did not run.
