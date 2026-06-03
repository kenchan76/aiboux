# Bark Required Auth Check

## Status
BLOCKED

## Check Time
- 2026-05-30 JST

## Secret Handling
- Bark secret values were not printed to chat, docs, all_log, screenshots, or public URLs.
- `bark.env` content was not displayed.
- Secret file existence and permissions were checked only by path and mode.

## Secret File Check
- `/home/pkkatsu/.aiboux-secrets/bark.env`: exists.
- mode: `600`.

## API-Level Smoke Result
- command: `node scripts/notify-bark.mjs --required --probe-auth`
- delivered: true
- skipped: false
- secretLogged: false
- userReceiptConfirmed: false
- endpointHost: `api.day.app`
- mode: `push-json`
- HTTP status: 200
- Bark API code: 200
- exit code: 0
- latest rerun: same API-level success with userReceiptConfirmed=false.

## Required Receipt Confirmation Result
- command: `node scripts/notify-bark.mjs --required --confirm-received`
- delivered: false
- skipped: false
- secretLogged: false
- userReceiptConfirmed: false
- endpointHost: `api.day.app`
- mode: `push-json`
- HTTP status: 200
- Bark API code: 200
- exit code: 1
- reason: `BARK_RECEIPT_NOT_CONFIRMED`
- latest user report says the Bark notification did not arrive.

## Remaining Blocking Items
- Bark gate is not resolved.
- Overall task completion remains blocked until deployment succeeds, public verification passes, Worker Version ID is recorded as an actual value, and Hermes is rerun against the final evidence.

## Verification
- `npm run astro check`: PASS.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.

## Deploy Attempt
- command: `npx wrangler deploy --keep-vars`
- result: BLOCKED
- reason: Cloudflare API authentication failed with `Authentication error [code: 10000]` and `Invalid access token [code: 9109]`.
