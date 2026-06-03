# Core Delivery Detail Reference Text Visual Fix v6

## Status

BLOCKED_DESIGN

## Problem

c73 is invalid because it judged only five geometry values and did not check text, truncation, date format, right-top actions, or visual blockers.

Invalid evidence:
- `https://mainly-fighters-cruise-screens.trycloudflare.com/m73.html`
- `https://mainly-fighters-cruise-screens.trycloudflare.com/l73.html`
- `https://mainly-fighters-cruise-screens.trycloudflare.com/d73.html`
- `https://mainly-fighters-cruise-screens.trycloudflare.com/c73.html`

## Required Fixes

- Use the saved reference image as the baseline.
- Match sample text values to the reference image.
- Display delivery date as `2026/05/29`; do not use native date input locale display.
- Do not truncate destination values or phone number.
- Remove the right-top More button.
- Do not show right-top delete button.
- Keep Global AI FAB hidden.
- Add text-diff and visual-blocker checks.
- Generate compare v3 with Reference, Actual, Diff, Geometry, Text diff, and Visual blockers.

## Done When

- c73 log is corrected to `BLOCKED_DESIGN`.
- Playwright reference test checks text and visual blockers.
- `output/playwright/core-documents-redesign/delivery-detail-reference-compare-v3.html` exists.
- `output/playwright/core-documents-redesign/delivery-detail-reference-visual-report-v3.json` exists.
- 4URL Bundle for m74/l74/d74/c74 exists.
- Bark progress notification is sent.

## Notes

- This is not DEPLOYED.
- This is not FINAL_ACCEPTED.
- This is not COMPLETED.
