# Core Delivery Detail Design v5

## Status

PREVIEW_READY

## Target

- `/core/deliveries`
- 納品書詳細画面

## Current Problem

- v4 still fails user visual inspection.
- Header actions are clipped or remain risky.
- Save button is not reliably visible at practical widths.
- Right edge layout is broken or too tight.
- Summary strip width calculation ignores actual content width.
- Footer and table right edge remain risky.
- Existing Playwright tests were insufficient because 1440px was missing.

## Goal

Fix right-edge layout and visual density.

## Required Fixes

### Header Actions

- Always show: B2 CSV, 商品CSV, メール, FAX, コピー, 印刷, 保存.
- Move low-priority actions to その他 menu.
- 保存 must never be clipped.
- 1650px and 1440px viewports must pass.

### Summary Strip

- Use actual content width, not naive viewport width.
- Avoid fixed wide shipping section.
- Collapse to 1 column below safe threshold.
- No right-edge clipping.

### Delivery Lines

- Page must not horizontally scroll.
- Table can internally scroll only if needed.
- Operation column must remain visible.
- 商品名列 stays widest.

### Footer

- Footer must not clip 内消費税.
- Footer must not overlap rows.
- AI FAB hidden on delivery detail.

## Required Viewports

- `1980x1080`
- `1650x900`
- `1440x900`
- `1366x768`

## Required URL Bundle

- Master update preview URL
- Execution log preview URL
- Screen preview URL

## Required Bark

Send CODE_READY Bark notification after URL Bundle.
Do not say COMPLETED.

## Done When

- `check:control-chars` PASS
- `check:mojibake` PASS
- `astro check` PASS
- build PASS
- Playwright visual checks PASS
- `gate:code` PASS
- `gate:preview` PASS
- screen preview URL directly opens the delivery detail workspace without an intermediate page or list click
- 3URL Bundle exists
- Bark notification sent after the direct delivery detail preview URL is verified

## Result

- Previous screen preview URLs were invalid because they did not directly display the delivery detail workspace.
- `d66.html` and `d67.html` were intermediate pages.
- `/core/deliveries` opened the delivery list and required a row click.
- `/core/deliveries?preview=delivery-detail&document=N20260530-01` now directly displays `納品書詳細`.
- Direct detail URL Playwright checks pass locally and on the public preview.
- This is `PREVIEW_READY`, not `DEPLOYED`, `FINAL_ACCEPTED`, or `COMPLETED`.
