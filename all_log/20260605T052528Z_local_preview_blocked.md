# Local Preview Blocked

Status: `LOCAL_PREVIEW_BLOCKED_NOT_FINAL`

This is not `FINAL_ACCEPTED`.

## Attempted Command

`npm run preview -- --host 127.0.0.1 --port 8894`

## Result

- `astro preview` did not start.
- Cloudflare remote proxy startup failed because `xdg-open` is unavailable in this shell.
- No local Playwright result is claimed from this attempt.

## Current Valid Verification

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with 0 errors.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.

## Public State

- WIP deploy remains blocked because Wrangler is not authenticated.
- Public `/g/*` reflection remains pending until deployment succeeds.
