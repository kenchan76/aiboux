# AIBOUX Current Task

## Task Name

Shop Aiboux Production Tenant Implementation With UI Protection

## Status

BLOCKED_METHOD

## Instruction Source

- `AIBOUX_MASTER_DOCUMENT.md`
- Public URL Bundle verified by curl on 2026-06-04
- User instruction: treat `m68/l68/d68` as the source evidence bundle for AIBOUX Shop販売用テナント改善作業
- Previous failure: Shop UI was degraded by broad visual/layout changes

## Fixed URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Bundle Verification

- `https://mail.aiboux.com/g/m68`: HTTP 200, `text/markdown; charset=utf-8`
- `https://mail.aiboux.com/g/l68`: HTTP 200, `text/markdown; charset=utf-8`
- `https://mail.aiboux.com/g/d68`: HTTP 200, `text/markdown; charset=utf-8`

## Target URLs

- Service site: `https://shop.aiboux.com/`
- Storefront: `https://shop.aiboux.com/s/aiboux/`
- Admin: `https://shop.aiboux.com/s/aiboux/admin`

## Goal

Make the `aiboux` Shop tenant a verified sales tenant only after all required evidence exists.

The goal is not complete while sample data, fixed dates, fixed customers, fixed order numbers, fixed SKUs, disabled primary actions, `href="#"`, old routes, missing pages, or unverified persistence remain.

## Non-Negotiable UI Protection

Do not degrade the current public UI.

Before any implementation:

- Keep `scripts/check-shop-ui-protection.mjs` active.
- `check:shop-ui-protection` is warn-only for WIP deploy.
- `check:shop-ui-protection:strict` is final-acceptance only.
- WIP deploy must create rollback checkpoint first.
- WIP deploy is allowed when build passes, even if UI protection warns.
- Do not report FINAL_ACCEPTED until strict checks pass.

Protected paths:

- `src/pages/shop`
- `src/components/shop`
- `src/data/shop-sample-data.ts`
- `src/styles`
- `src/assets`

## Required Work

1. Complete `shop.aiboux.com/s/aiboux/admin` as a sales-tenant admin only without visual regression.
2. Complete `shop.aiboux.com/s/aiboux/` as DB-backed storefront only without visual regression.
3. Verify all admin pages, buttons, forms, links, and settings.
4. Remove or replace sample dependency with real D1 data or honest empty states.
5. Remove fixed dates, fixed customers, fixed order numbers, fixed SKUs from production UI.
6. Remove disabled primary actions or mark them as honest unavailable states.
7. Remove `href="#"`, old `/shop/...` route leakage, and `shop.aboux.com` mistakes.
8. Add D1 migrations only if required and after dry-run review.
9. Use Playwright to verify admin, storefront, product create/edit/list/storefront reflection, settings persistence, cart, checkout, contact, and legal/privacy/shipping/returns.
10. Run build, gates, deploy, public curl verification, Worker Version ID recording.
11. Update `m68/l68/d68` only after accurate evidence exists.

## WIP Deploy Flow

1. Create checkpoint.
2. Save HEAD, origin/main, git status, unstaged diff, staged diff, git log, Wrangler deployment list.
3. Create WIP commit.
4. Build.
5. Run warn-only Shop UI protection.
6. Deploy.
7. Verify public URL visually and with curl.
8. Update `m68/l68/d68` as `WIP_DEPLOYED`, not `FINAL_ACCEPTED`.
9. If the WIP is bad, rollback Worker or redeploy the saved git checkpoint.

## Completion Evidence Required

- commit hash
- Worker Version ID
- deploy timestamp
- migration names and results
- changed file list
- all admin URLs HTTP 200
- all storefront URLs HTTP 200
- Playwright result
- product create -> edit -> list -> storefront reflection
- settings save -> public page reflection
- cart add -> quantity change -> delete -> checkout transition
- contact form verification
- legal/privacy/shipping/returns settings reflection
- dead link zero
- `href="#"` zero
- old route leakage zero
- `shop.aboux.com` zero
- sample fixed values zero
- unresolved items zero

## Prohibited

- UI degradation.
- Broad design rewrite.
- Unapproved CSS/layout changes.
- `shop.aiboux.com/` as storefront direct URL.
- `shop.aboux.com`.
- direct `wrangler deploy` bypassing gates.
- `git reset --hard`.
- `git clean -fd`.
- `git clean -fdx`.
- `rm -rf`.
- force push.
- secret display.
- Bark send before final evidence.
- false completion.

## Current Status

The fixed URL Bundle is reachable.
The task is not complete.
The local Shop UI protection warns because protected Shop paths are dirty.
This warning no longer blocks WIP deploy.
Final acceptance remains blocked until strict check and all completion evidence pass.

## Fix Cycle 01: Remove Visible Shop Demo Values And Repair Tenant Links

Status: WIP_FIXING

This cycle starts after WIP deploy `5f64b20a-d4ef-42e5-95e9-6f262c4e5dd8`.

Cycle 01 goals:

1. Remove visible fixed demo values from the public Shop admin dashboard.
2. Stop production UI from showing fake sales, fake order counts, fake CVR, fake AOV, fake repeat rate, fake customers, fake order numbers, and fake sample SKUs as if they were real tenant data.
3. Use honest empty states when real D1-backed values are unavailable.
4. Repair Shop admin links to `/s/aiboux/admin/...` tenant routes.
5. Repair storefront links to `/s/aiboux/...` tenant routes.
6. Remove `href="#"`, `javascript:void(0)`, old `/shop/...` links, and `shop.aboux.com` from Shop production UI.
7. Keep UI shape conservative and avoid broad redesign.
8. WIP deploy is allowed after build passes; strict final check remains final-only.

Cycle 01 fixed demo values to remove from production Shop UI:

- `2024/05/13 - 2024/05/19`
- `山田 太郎`
- `¥2,340,000`
- `245件`
- `2.35%`
- `¥9,551`
- `28.7%`
- `#10085`
- `#10084`
- `#10083`
- `#10082`
- `#10081`
- `TSH-001-WHT`
- `BAG-001-BLK`
- `BTL-500-SLV`
- `PKR-002-GRY`
- `CAP-001-NVY`
- `佐藤 花子`
- `鈴木 一郎`
- `田中 美咲`
- `高橋 大輔`
- `伊藤 優子`

Cycle 01 evidence target:

- `all_log/shop-ui/${TS}_shop_fix_01.md`
- `all_log/shop-ui/${TS}_public_url_status_before_fix_01.txt`
- `all_log/shop-ui/${TS}_public_url_status_after_fix_01.txt`
