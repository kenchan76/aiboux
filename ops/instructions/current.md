# AIBOUX Current Task

## Active Override: Shop Public Storefront Visual Mismatch Fix

Instruction source:

- `ops/instructions/20260604_shop_public_storefront_visual_mismatch_fix.md`

Current status:

- `ACTIVE_WIP`

Current target URLs:

- `https://shop.aiboux.com/s/aiboux/`
- `https://shop.aiboux.com/s/aiboux/admin/design`
- `https://shop.aiboux.com/s/aiboux/product/{id}`

Required work:

1. Fix the public tenant storefront visual mismatch before continuing remote D1 subscription work.
2. Remove gray image placeholders from the public storefront.
3. Use real AIBOUX sales-oriented images for hero, product cards, ranking, time sale, and category cards.
4. Keep hero as center main slide with smaller real previous/next slide previews.
5. Make product cards Amazon-style with image, product name, rating, review count, price, tax label, and CTA.
6. Align editor preview and public storefront visual language.
7. Publish `/g/l68`, `/g/d68`, and `/g/m68` before reporting.

Do not report `FINAL_ACCEPTED`.

## Active Override: Shop Subscriptions Required

Instruction source:

- `ops/instructions/20260604_shop_subscriptions_required.md`

Current status:

- `ACTIVE_WIP`

Current target URLs:

- `https://shop.aiboux.com/s/aiboux/`
- `https://shop.aiboux.com/s/aiboux/product/{id}`
- `https://shop.aiboux.com/s/aiboux/cart`
- `https://shop.aiboux.com/s/aiboux/checkout`
- `https://shop.aiboux.com/s/aiboux/admin/products`
- `https://shop.aiboux.com/s/aiboux/admin/subscriptions`

Required work:

1. Add subscriptions as a required Shop sales feature.
2. Add non-destructive DB migration and rollback SQL for subscription plans, subscriptions, and events.
3. Add product admin subscription settings and DB save.
4. Add public product detail normal/subscription purchase selection.
5. Add cart subscription item display and frequency handling.
6. Add checkout subscription terms and honest payment-unconfigured blocker.
7. Add admin subscriptions list and state action placeholders that do not fake provider success.
8. Add `npm run gate:shop-subscriptions`.
9. Update `/g/m68`, `/g/l68`, and `/g/d68` with public evidence.

Do not report `FINAL_ACCEPTED` until subscription behavior is verified on public URLs.

## Active Override: Shop Design Gate Split And Visual Evidence

Instruction source:

- `ops/instructions/20260604_shop_design_gate_split_visual_evidence.md`

Current status:

- `ACTIVE_WIP`

Current target URLs:

- `https://shop.aiboux.com/s/aiboux/`
- `https://shop.aiboux.com/s/aiboux/admin/design`
- `https://shop.aiboux.com/s/aiboux/product/{id}`

Required work:

1. Do not stop because legacy `npm run gate:design` checks old Core delivery-detail preview.
2. Add `npm run gate:shop-design`.
3. Make `gate:shop-design` check Shop design editor only.
4. Capture 1980px screenshots for editor TOP, editor product detail, public TOP, and public product detail.
5. Publish screenshots under `public/g/screens/`.
6. Update `/g/m68`, `/g/l68`, `/g/d68`.
7. WIP deploy and verify public URLs.
8. Send Bark progress notification when this work unit pauses or reports, if Bark is configured.

Do not report `FINAL_ACCEPTED`.

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

## Public Execution Log Required Rule

Every user-facing report must begin with:

- Execution log URL: `https://mail.aiboux.com/g/l68`
- Screen evidence URL: `https://mail.aiboux.com/g/d68`
- Master URL: `https://mail.aiboux.com/g/m68`

Local-only `all_log/...` reports are prohibited.
Reporting that `public/g/*.md` is updated locally is prohibited.
Reporting that the next deploy will publish logs is prohibited.
Before reporting, update `public/g/l68.md` and `public/g/d68.md`, build, deploy, and curl all three public `/g/*` URLs.

Shop UI quality protection is warn-only for WIP deploys.
Public execution log publication is mandatory and must not be skipped.

## Fix Cycle 05: Focused Store Design Editor For TOP And Product Detail

Status: WIP_REPAIR_AFTER_DESIGN_REJECTION

Instruction file:

- `ops/instructions/20260604_shop_store_design_editor_top_product_only.md`

Confirmed specification:

- Store design editor may edit only TOP page and product detail page.
- All other storefront pages are fixed tenant-wide templates.
- `shop.aiboux.com/` remains the Shop service site.
- Tenant storefront remains `https://shop.aiboux.com/s/aiboux/`.
- Design editor is `https://shop.aiboux.com/s/aiboux/admin/design`.
- Use the user reference image `https://tadaup.jp/6ivZDgjK.png` as the 3-column editor direction.

Implementation constraints:

1. Keep UI changes scoped to the design editor and required public storefront reflection.
2. Do not broadly redesign admin pages.
3. Do not expose products/categories/cart/checkout/contact/legal/privacy/shipping/returns as editable pages.
4. Save only `global.*`, `pages.top`, and `pages.productDetail` under `shop_storefront_layouts.layout_json`.
5. Reflect common logo settings across all tenant storefront pages.
6. Reflect TOP design on `/s/aiboux/`.
7. Reflect product detail design on `/s/aiboux/product/{id}`.
8. WIP deploy is allowed after build passes.
9. Report only after `/g/m68`, `/g/l68`, and `/g/d68` are publicly deployed and curl-verified.

Rejection repair requirements:

1. `/s/aiboux/admin/design` must not use the normal Shop admin sidebar or normal admin header.
2. `/s/aiboux/admin/design` must be a dedicated full-screen editor.
3. The editor layout must be top editor bar plus left pane, center preview, and right pane.
4. At 1980px viewport, the center preview column must be at least 1100px wide.
5. Category navigation must not wrap into vertical Japanese text.
6. Hero side previews must show previous and next slide images, not gray placeholder panels.
7. Playwright must check these visual/layout conditions, not only HTTP 200 and text presence.

## Fix Cycle 06: Design Editor Persistence And Stop Notification

Status: WIP_CONTINUING_AFTER_USER_RESTART

Instruction file:

- `ops/instructions/20260604_shop_design_editor_persistence_and_stop_notification.md`

User instruction:

- Continue without stopping after fullscreen WIP repair.
- If Codex work pauses or stops, publish `/g/*` and attempt progress notification when configured.

Current target:

1. Verify the design editor save path with a public Playwright test.
2. Snapshot the current layout before test changes.
3. Save a temporary TOP hero title through `/s/aiboux/admin/design`.
4. Verify the saved title appears on `https://shop.aiboux.com/s/aiboux/`.
5. Verify the saved title survives reload/revisit.
6. Restore the original layout after the test.
7. Verify the temporary marker is not left on the public storefront.
8. Publish updated execution log and screen evidence before reporting.

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

## Fix Cycle 02: Public Admin Demo Value Recheck

Status: WIP_FIXING

Instruction file:

- `ops/instructions/20260604_shop_public_admin_demo_value_recheck.md`

Reason:

The user reports that public `https://shop.aiboux.com/s/aiboux/admin` still shows fixed demo values even after the previous WIP report.

Cycle 02 blocks product/settings/cart work until public admin fixed demo value checks pass against the actual production URL.

Required direct public checks:

- curl public admin HTML
- Playwright public rendered DOM
- source search for Shop-related fixed demo values

Do not use localhost, preview-only URLs, or alternate routes as proof.

## Fix Cycle 04: Shop Functional Hardening

Status: WIP_FUNCTIONAL_HARDENING

Instruction file:

- `ops/instructions/20260604_shop_functional_hardening_cycle.md`

Reason:

The public admin fixed demo value zero gate is accepted by the user.
The next scope is product/settings/cart/checkout/contact/legal functional hardening.

Cycle 04 goals:

1. Keep existing Shop UI layout stable and avoid broad visual changes.
2. Connect public storefront product list and product detail to D1 published shop products.
3. Connect public legal/privacy/shipping/returns pages to saved or generated shop profile text.
4. Make cart add, quantity change, remove, subtotal, and checkout transition usable without fake payment completion.
5. Make contact validation explicit and avoid fake send success when storage/notification is not connected.
6. Make admin product list read product API data and refresh after product save.
7. Add public Playwright coverage for all target URLs, demo-value absence, cart, checkout, contact, and legal pages.
8. Publish `/g/l68` and `/g/d68` before reporting.

Completion remains WIP only until public deployment, public URL checks, public Playwright, and `/g/*` sha256 evidence are recorded.

Cycle 02 fixed values to remove or prove absent from Shop public admin:

- `2024/05/13 - 2024/05/19`
- `山田 太郎`
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

Cycle 02 scope:

- Remove Shop-related fixed values from production-visible and delayed UI code.
- Do not redesign the Shop UI.
- Do not modify Core/Mail sample data unless it is rendered inside Shop public admin.

Cycle 02 report must be published to:

- `https://mail.aiboux.com/g/l68`
- `https://mail.aiboux.com/g/d68`
- `https://mail.aiboux.com/g/m68`

## Fix Cycle 03: Public Admin Route And Cache Mismatch

Status: WIP_FIXING

Instruction file:

- `ops/instructions/20260604_shop_public_admin_route_cache_mismatch.md`

Reason:

The user reports that an external fetch route still sees the old fixed demo values even though Codex curl and Playwright see them absent.

Do not proceed to product/settings/cart/checkout/contact/legal work until this route/cache mismatch is handled.

Cycle 03 scope:

- Strengthen no-store headers for service-routed HTML.
- Add admin-specific browser cache clearing headers.
- Attempt targeted Cloudflare cache purge.
- Record purge failure honestly if API authentication or permission fails.
- Verify public admin headers, Worker Version ID, route rewrite headers, HTML grep, and Playwright rendered DOM.

Cycle 03 must not redesign the Shop UI.

## Fix Cycle 04: Shop Functional Hardening

Status: WIP_FIXING

Instruction file:

- `ops/instructions/20260604_shop_functional_hardening_cycle.md`

Accepted prior gate:

- Public admin fixed demo value zero is accepted by the user.
- Route/cache mismatch is resolved for verified paths.

Scope:

- Product create/edit/save/public storefront reflection.
- Settings save and legal/privacy/shipping/returns reflection.
- Cart add, quantity update, delete.
- Checkout transition and honest payment-not-configured state.
- Contact validation and honest submit state.
- Public URL status checks.
- Dead link and old route checks.

Do not redesign the Shop UI.
Do not report FINAL_ACCEPTED for the whole Shop tenant unless all final gates pass.
