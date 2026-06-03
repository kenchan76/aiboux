# Core Delivery Detail Typography Rule v77

## Status

BLOCKED_DESIGN

## Target

- AIBOUX Core
- `/core/deliveries`
- 納品書詳細画面

## Rejected Evidence

- `m76/l76/d76/c76`

## Problem

c76 fixed only font-weight. It did not make font-size, line-height, and color part of the design contract.

## Required Fix

- Add a Typography Contract for delivery detail.
- Apply it to labels, values, product names, table headers/cells, inputs/selects, memo/history body, and footer amount values.
- Keep product name/spec one line.
- Keep values and amount values normal weight.
- Add Playwright typography DOM audit for font-size, line-height, color, and font-weight.
- Add Typography Difference to c77 comparison HTML.
- Create Review Pack v77 with typography audit.

## Typography Rule

- Page title: 20px, 28px line-height, semibold, slate-900.
- Section titles: 15px, 22px line-height, semibold, slate-900.
- Labels: 13px, 20px line-height, medium, slate-500.
- Values: 13px, 20px line-height, normal, slate-700.
- Link values: 13px, 20px line-height, normal, blue-600.
- Table headers: 12px, 16px line-height, medium, slate-500.
- Table cells: 13px, 20px line-height, normal, slate-700.
- Product names: 13px, 20px line-height, normal, slate-800, one line.
- Footer amount values: normal weight.

## Done When

- `delivery-detail-typography-audit.json` verdict is PASS.
- reference comparison includes typography PASS.
- local and public Playwright pass.
- 4URL Bundle exists.
- Bark progress notification sent.
- If Grok/Cloudflare AI cannot load images, report BLOCKED_REVIEW, not CODE_READY.

## Forbidden

- CODE_READY with typography violations.
- CODE_READY if Review Pack image review is required and cannot load instruction/reference/actual images.
- DEPLOYED / FINAL_ACCEPTED / COMPLETED.
