# AIBOUX m69 Direct Preview / Control Character Final Fix

作成日: 2026-05-31

## Status

PREVIEW_READY_CANDIDATE_BUT_REPORT_BLOCKED

## Purpose

m69 / l69 / direct preview itself is improved, but the user-facing URL Bundle text was rejected because it contained NUL or other control characters.

This instruction fixes the report-quality gate:

- Remove NUL and control characters from the URL Bundle.
- Check Markdown, public HTML, generated report text, and log-share output.
- Keep Bark final-only. Do not send Bark for PREVIEW_READY.
- Reconfirm that the direct preview URL opens the delivery detail screen.
- Reissue a clean URL Bundle as m70 / l70 / direct screen URL.

## Current URLs To Recheck

- Master update preview URL: https://mainly-fighters-cruise-screens.trycloudflare.com/m69.html
- Execution log preview URL: https://mainly-fighters-cruise-screens.trycloudflare.com/l69.html
- Screen preview URL: https://incentives-scale-uri-clocks.trycloudflare.com/core/deliveries?preview=delivery-detail&document=N20260530-01

The URLs may remain useful as historical evidence, but the user-facing report text that presented them is invalid if it contains control characters.

## Required Direct Preview Check

The screen preview URL must show the delivery detail screen immediately, without a list click or interstitial page.

Required visible evidence:

- 納品書詳細
- N20260530-01
- delivery-detail-toolbar
- delivery-detail-summary-strip
- delivery-detail-lines-card
- 保存

## Required Commands

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run check:bark-policy`
- `PLAYWRIGHT_BASE_URL=https://incentives-scale-uri-clocks.trycloudflare.com npx playwright test tests/core-delivery-detail-print.spec.ts --grep "delivery detail preview URL opens detail directly" --reporter=line`

## Final User Report Check

Before reporting, write the exact user-facing report to `/tmp/aiboux-final-user-report.md` and verify it contains no NUL, other disallowed control characters, or replacement characters.

Required success output:

- `FINAL_REPORT_CONTROL_CHAR_OK`

## Bark

- notification: not sent
- reason: Bark notifications are final-only by policy.
- secretLogged: false

## New URL Bundle

- Master update preview URL: https://mainly-fighters-cruise-screens.trycloudflare.com/m70.html
- Execution log preview URL: https://mainly-fighters-cruise-screens.trycloudflare.com/l70.html
- Screen preview URL: https://incentives-scale-uri-clocks.trycloudflare.com/core/deliveries?preview=delivery-detail&document=N20260530-01

## Done When

- Direct detail URL check passes.
- Public direct Playwright check passes.
- `check:control-chars` passes.
- `check:mojibake` passes.
- `check:bark-policy` passes.
- Final user report control character check passes.
- m70 / l70 are published with UTF-8 HTML and no control characters.
- Bark is not sent.

