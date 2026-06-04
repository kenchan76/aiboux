# Shop Public Admin Route And Cache Mismatch

## Status

WIP_FIXING

## Public URL Bundle

- Execution log URL: `https://mail.aiboux.com/g/l68`
- Screen evidence URL: `https://mail.aiboux.com/g/d68`
- Master URL: `https://mail.aiboux.com/g/m68`

## Problem

The public admin result differs by external fetch route.

Codex curl and Playwright against `https://shop.aiboux.com/s/aiboux/admin` returned the updated admin with fixed demo values absent.

The user's external fetch path still sees stale fixed demo values:

- `2024/05/13 - 2024/05/19`
- `山田 太郎 管理者`
- `¥2,340,000`
- `245件`
- `2.35%`
- `¥9,551`
- `28.7%`
- `TSH-001-WHT`
- `BAG-001-BLK`
- `BTL-500-SLV`
- `#10085`
- `#10084`
- `#10083`
- `佐藤 花子`
- `鈴木 一郎`
- `田中 美咲`

## Required Work

Do not proceed to product/settings/cart/checkout/contact/legal work.

Resolve or document the public route/cache mismatch first.

Required checks:

- `npx wrangler deployments list`
- public admin response headers
- `cf-cache-status`
- `cache-control`
- `cdn-cache-control`
- `cloudflare-cdn-cache-control`
- `etag`
- `age`
- `server`
- `x-aiboux-worker-version`
- `x-aiboux-original-path`
- `x-aiboux-rewritten-path`
- `x-aiboux-admin-cache-policy`
- public HTML grep
- public Playwright rendered DOM grep

## Code Direction

- Strengthen no-store headers for service-routed HTML.
- Add admin-specific browser cache clearing headers.
- Keep `/s/aiboux/admin` routed to the current dashboard.
- Do not redesign the Shop UI.

## Cloudflare Cache Purge

Attempt targeted Cloudflare purge for:

- `https://shop.aiboux.com/s/aiboux/admin`
- `https://shop.aiboux.com/s/aiboux/admin/`
- `https://shop.aiboux.com/shop/dashboard`
- `https://shop.aiboux.com/shop/dashboard/`

If purge fails because the token lacks API purge permission, record it without printing secrets.

## Safety

- No DB write.
- No migration apply.
- No Bark.
- No reset.
- No clean.
- No force push.
- No secret output.
