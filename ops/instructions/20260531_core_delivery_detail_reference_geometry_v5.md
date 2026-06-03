# Core Delivery Detail Reference Geometry v5

## Status

BLOCKED_DESIGN

## Target

- AIBOUX Core
- `/core/deliveries`
- 納品書詳細画面

## Problem

c72 only confirmed structure presence. It did not compare actual geometry against the saved reference image.

## Reference

- Source URL: `https://tadaup.jp/5kC9aM31.png`
- Local image: `output/reference/core-delivery-detail/reference.png`
- Reference viewport: `1672x941`

## Required Geometry

- topCardsY: 135
- topCardsHeight: 320
- linesY: 471
- memoHistoryY: 720
- footerY: 862

## Required Fix

- Restore top card height to the reference image range.
- Move the lines card down to the reference image y position.
- Keep memo/history visible above the fixed footer.
- Create v2 comparison HTML with reference, actual, geometry table, deltas, thresholds, and verdict.

## Done When

- `tests/core-delivery-detail-reference.spec.ts` validates geometry at 1672x941.
- `output/playwright/core-documents-redesign/delivery-detail-reference-match-v2-1672.png` exists.
- `output/playwright/core-documents-redesign/delivery-detail-reference-geometry-v2.json` exists.
- `output/playwright/core-documents-redesign/delivery-detail-reference-compare-v2.html` exists.
- 4URL Bundle exists.
- Bark progress notification is sent.

## Forbidden

- Passing by structure-only checks.
- Shrinking top cards to increase line count.
- Reporting DEPLOYED, FINAL_ACCEPTED, or COMPLETED.
