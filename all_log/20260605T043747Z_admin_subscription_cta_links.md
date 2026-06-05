# Admin Subscription CTA Links WIP

Status: `USER_ACTION_REQUIRED_PUBLIC_DEPLOY_BLOCKED`

## Scope

- Changed admin/subscriptions empty-state CTAs from JavaScript-only buttons to real links.
- Product settings CTA now links to `/s/aiboux/admin/products`.
- Payment/settings CTA now links to `/s/aiboux/admin/settings`.
- Updated the public admin operations Playwright assertion to check link hrefs.

## Local Verification

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with 0 errors.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.
- Built assets contain the real `href` links for `商品設定を開く` and `支払い設定を確認`.

## Public Verification

- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/shop-admin-ops-public.spec.ts`: FAIL.
- Reason: the public site still serves the older deployed admin/subscriptions page, so it does not yet contain the latest operation cards/link assertions.
- Failure trace was moved under `all_log/test-results/20260605T043747Z_admin_subscription_public_gate_stale/`.

## Blocker

- `npx wrangler whoami`: not authenticated.
- WIP deploy and public `/g/*` reflection cannot run until Cloudflare/Wrangler authentication is restored.

## Not Final

- `FINAL_ACCEPTED` is not claimed.
- Public `/g/l68` and `/g/d68` remain stale until deployment is possible.
