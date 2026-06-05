# Buyer Form Recovery Links

Status: `LOCAL_WIP_PUBLIC_DEPLOY_BLOCKED`

This is not `FINAL_ACCEPTED`.

## Scope

- Updated shopper-side order lookup and auth form confirmed states.
- Updated Playwright coverage for the changed buyer recovery behavior.

## Buyer-Facing Requirement

- Forms must not claim order completion, payment completion, login completion, or registration completion.
- Valid order lookup input should guide the shopper to contact, shipping, and returns.
- Valid login/register input should guide the shopper to mypage, orders, and favorites.

## Changed Files

- `src/pages/shop/[tenant]/[...path].astro`
- `tests/shop-public-crawl.spec.ts`
- `tests/shop-functional-public.spec.ts`

## Verification

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with 0 errors.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.

## Public State

- WIP deploy was not executed because Wrangler is not authenticated in the current shell.
- Public `/g/l68` and `/g/d68` are not claimed as updated until deploy succeeds.
- Subscription D1 lane remains `D1_PERMISSION_BLOCKED_NOT_FINAL`.
