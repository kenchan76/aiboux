# Core Delivery Detail Print Bark Secret Setup Blocked

Date: 2026-05-30

## Status

BLOCKED

Core Delivery Detail Print Preview remains incomplete because Bark delivery is still not available.

## Changes Made

- `scripts/notify-bark.mjs`
  - Added safe fallback loading from `/home/pkkatsu/.aiboux-secrets/bark.env`.
  - Existing `process.env.BARK_ENABLED`, `BARK_ENDPOINT`, and `BARK_DEVICE_KEY` take priority.
  - Secret values are not logged.
  - Required mode continues to fail on disabled, skipped, missing config, not delivered, HTTP error, or Bark API error.
- `scripts/setup-bark-secret.sh`
  - Added TTY helper for creating `/home/pkkatsu/.aiboux-secrets/bark.env`.
  - Creates `/home/pkkatsu/.aiboux-secrets` with mode `700`.
  - Saves `bark.env` with mode `600`.
  - Reads `BARK_DEVICE_KEY` with `read -s`.
  - Does not print secret values.

## Current Bark Check

```json
{"provider":"bark","secretLogged":false,"ok":false,"delivered":false,"skipped":true,"reason":"BARK_DISABLED"}
```

Exit code: `1`

`/home/pkkatsu/.aiboux-secrets/bark.env` is still missing.

## Verification

- `bash -n scripts/setup-bark-secret.sh`: PASS
- `node --check scripts/notify-bark.mjs`: PASS
- `npm run astro check`: PASS
  - 0 errors
  - 0 warnings
  - 28 hints
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS

## Decision

Do not complete. A TTY operator must run:

```bash
bash scripts/setup-bark-secret.sh
```

Then rerun:

```bash
node scripts/notify-bark.mjs \
  --title "AIBOUX Bark Test" \
  --body "Bark通知テストです" \
  --url "https://core.aiboux.com/core/deliveries" \
  --required
```

Completion remains blocked until Bark returns `delivered=true`, `skipped=false`, and `secretLogged=false`.
