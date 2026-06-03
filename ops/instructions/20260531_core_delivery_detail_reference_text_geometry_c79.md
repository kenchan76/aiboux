# Core Delivery Detail c79 Reference Text And Geometry

## Status

ACTIVE_DESIGN_FIX

## Target

- `/core/deliveries`
- 納品書詳細画面

## Problem

c78 is close, but it still differs from the reference image.

- Basic customer value is `サンプル商事株式会社` instead of `株式会社サンプル`.
- The text contract does not catch the wrong basic customer value.
- Geometry reporting does not include all primary regions.
- Typography and product-name checks alone do not prove reference match.

## Required Fix

- Match the basic customer value to `株式会社サンプル`.
- Add `output/reference/core-delivery-detail/reference-text-contract.json`.
- Reject `サンプル商事株式会社` and `05/29/2026`.
- Add stricter geometry reporting for sidebar, top search, title row, top cards, detail table, memo/history, and footer.
- Generate c79 comparison evidence and 4 URLs.
- Send Bark progress notification.

## Deploy

- Status: DEPLOY_BLOCKED_AUTH
- Reason: Wrangler authentication failed.
- This blocks production deployment only.

## Done When

- Reference text contract PASS.
- Text mismatch is empty.
- Visual blockers are empty.
- Geometry deltas for primary regions are reported.
- c79 comparison HTML exists.
- 4 URL bundle exists.
- Bark progress notification sent.
