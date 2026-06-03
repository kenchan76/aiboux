# Service Subdomain Tenant URL Migration Deployment Log

## Status

DEPLOYED

## Worker Version

- Cloudflare Worker: `aiboux`
- Current Version ID: `__WORKER_VERSION_ID__`
- Previous user-reported Version ID: `df180613-45c5-4fce-adaa-eaa7bb357210`

## Cause Investigation

- `/home/pkkatsu/.aiboux-secrets/cloudflare.env` was sourced successfully.
- `npx wrangler whoami` authenticated with the configured Cloudflare API token.
- `npx wrangler tail aiboux --format json` was run while requesting the acceptance URLs.
- Tail evidence for the investigated deployment showed `outcome: ok`, empty `exceptions`, and HTTP 200 for the requested service URLs.
- The Internal Error state reported by the user was not reproducible during the follow-up verification window after deployment propagation.

## Implemented URL Design

- `mail.aiboux.com/` resolves to the Mail service site.
- `mail.aiboux.com/s/aiboux/` resolves to the existing Mail tenant inbox/work screen.
- `shop.aiboux.com/` resolves to the AIBOUX SHOP service site.
- `shop.aiboux.com/s/aiboux/` resolves to the Shop storefront.
- `shop.aiboux.com/s/aiboux/admin` resolves to the Shop admin screen.

## Public URL Verification

- `https://mail.aiboux.com/`: PASS, HTTP 200, title `AIBOUX Mail | サービスサイト`, no `Internal Error`.
- `https://mail.aiboux.com/s/aiboux/`: PASS, HTTP 200, title `AIBOUX Mail - 受信トレイ`, no `Internal Error`.
- `https://shop.aiboux.com/`: PASS, HTTP 200, title `AIBOUX SHOP | サービスサイト`, no `Internal Error`.
- `https://shop.aiboux.com/s/aiboux/`: PASS, HTTP 200, title `株式会社雪花 公式ストア | AIBOUX Storefront`, no `Internal Error`.
- `https://shop.aiboux.com/s/aiboux/admin`: PASS, HTTP 200, title `AIBOUX SHOP Dashboard`, no `Internal Error`.

## Verification Commands

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro check`: PASS, 0 errors, 0 warnings, 34 hints.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS, existing Vite chunk-size warning only.
- `npx wrangler deploy`: PASS.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/service-url-routing-public.spec.ts --reporter=line`: PASS, 20/20.

## Changed Files

- `AIBOUX_MASTER_DOCUMENT.md`
- `ops/instructions/current.md`
- `ops/instructions/20260531_service_subdomain_tenant_slug_url_migration.md`
- `src/middleware.ts`
- `src/lib/server/tenantContext.ts`
- `src/pages/mail/index.astro`
- `src/pages/shop/index.astro`
- `src/components/mail/MailClientShell.tsx`
- `src/components/shop/ShopClientShell.tsx`
- `src/components/shop/ShopSidebar.tsx`
- `src/components/shop/StorefrontDesignBuilder.tsx`
- `src/components/shop/storefront/ShopStorefrontHome.tsx`
- `src/pages/shop/storefront/[tenant].astro`
- `src/pages/shop/[tenant]/product/[id].astro`
- `src/pages/api/v1/checkout/create-session.ts`
- `tests/service-url-routing-public.spec.ts`
- `all_log/68_service_subdomain_tenant_url_migration_deployed_log.md`
- `all_log/68_service_subdomain_tenant_url_migration_screen_artifact.md`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`

## Unresolved Items

- FINAL_ACCEPTED is not claimed in this log.
- Grok and Cloudflare AI reference reviews were not used as completion gates for this routing/deployment correction.
