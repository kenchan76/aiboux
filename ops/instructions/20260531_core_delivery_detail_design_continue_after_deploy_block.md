# Core Delivery Detail Design Continue After Deploy Block

## Status

ACTIVE_DESIGN_FIX

## Target

- AIBOUX Core
- `/core/deliveries`
- 納品書詳細画面

## Current Problem

Wrangler authentication failure blocked production deploy only. It must not block design fixes, local verification, TEMP_PREVIEW creation, comparison HTML updates, or Bark progress notifications.

## Current Evidence

Rejected c77 evidence:
- マスター: https://mainly-fighters-cruise-screens.trycloudflare.com/m77.html
- ログ: https://mainly-fighters-cruise-screens.trycloudflare.com/l77.html
- 画面: https://mainly-fighters-cruise-screens.trycloudflare.com/d77.html
- 比較: https://mainly-fighters-cruise-screens.trycloudflare.com/c77.html

## Deploy Status

DEPLOY_BLOCKED_AUTH

User approved deployment, but Wrangler authentication failed. This blocks production deployment only. Design fixes and TEMP_PREVIEW work continue.

## Required c78 Work

- Keep Typography Contract enforced.
- Keep line-height, font-size, font-color, font-weight audits.
- Keep product name/spec one-line display.
- Generate `delivery-detail-typography-audit-v78.json`.
- Generate c78 comparison HTML including deploy status and review status.
- Publish m78/l78/d78/c78 short URLs.
- Send Bark progress notification.

## Required Status

PREVIEW_READY_PENDING_USER after preview and checks pass.

## Forbidden

- Stop design fixes because deploy auth failed.
- Treat deploy auth failure as user deploy rejection.
- Use USER_ACTION_REQUIRED to stop fixable design work.
- Claim CODE_READY, DEPLOYED, FINAL_ACCEPTED, or COMPLETED for c78.
