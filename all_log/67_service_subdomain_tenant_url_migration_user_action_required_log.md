# Service Subdomain Tenant URL Migration Log

## Status

USER_ACTION_REQUIRED

## Task

Fix the AIBOUX URL design so service subdomain roots are service sites and tenant screens live under `/s/{tenant}`. The deployment tenant slug for this task is `aiboux`.

## Implemented Scope

- Added service-domain URL routing for `mail.aiboux.com` and `shop.aiboux.com` in middleware.
- Moved Mail tenant work screen resolution from subdomain root to `/s/aiboux/` while keeping the existing Mail app routes as the backing implementation.
- Changed Mail service root content to a Mail service site.
- Changed Shop service root content to a Shop service site/service entrance.
- Routed `shop.aiboux.com/s/aiboux/` to storefront backing routes.
- Routed `shop.aiboux.com/s/aiboux/admin` to Shop admin backing routes.
- Updated tenant path parsing from `/t/{tenant}` assumptions toward `/s/{tenant}` for the touched server/client surfaces.
- Updated internal Shop/Mail navigation links for the new `/s/aiboux` tenant URLs.
- Preserved data IDs and did not delete, duplicate, or recreate tenant/shop/mailbox/user data.

## Verification

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro check`: PASS, 0 errors and 0 warnings reported.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS, with existing chunk-size warning only.
- Bark progress notification for USER_ACTION_REQUIRED: delivered, skipped=false, secretLogged=false.

## Public Verification Blocker

- `/home/pkkatsu/.aiboux-secrets/cloudflare.env` is missing.
- `npx wrangler whoami` reports unauthenticated.
- Public URL verification, short URL bundle creation, Worker Version ID recording, and deployment are blocked until valid Cloudflare authentication/secrets are provided.

## Required Human Action

Provide valid Cloudflare authentication/secrets, then say `secret入力完了`.

## URL Bundle

Not issued. Public preview/deployment URLs cannot be created or verified until Cloudflare authentication is available.
