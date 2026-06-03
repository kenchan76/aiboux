# Core Delivery Detail Typography Rule v77 Review Instruction

Review whether Codex followed the user instruction for AIBOUX Core `/core/deliveries` delivery detail.

Reference image: `reference.png` from https://tadaup.jp/5kC9aM31.png
Actual screenshots: `actual-1672.png`, `actual-1980.png`, `actual-1650.png`, `actual-1366.png`
Comparison: `compare.html`
DOM audit: `dom-audit.json`
Font weight audit: `font-weight-audit.json`
Typography audit: `typography-audit.json`

## Typography Rule
The delivery detail screen must match the reference typography.
Allowed:
- titles: larger, semibold, slate-900
- labels: 13px, line-height 20px, medium, slate-500
- values: 13px, line-height 20px, normal, slate-700
- table headers: 12px, line-height 16px, medium, slate-500
- product names: 13px, line-height 20px, normal, slate-800, one line
- amount values: normal weight
Reject if:
- values are bold
- product names are bold
- line-height differs
- font-size differs
- colors are too dark or too light

## Existing Required Rules
- Product name/spec must be one line.
- No product-name second line exists.
- Date format must be yyyy/MM/dd, not MM/dd/yyyy.
- No visible top action More "..." button.
- No always-visible top delete button.
- No right-bottom Global AI FAB.
- 3 top cards, memo/history cards, and fixed footer must exist.

Return JSON or Markdown with:
- loadedInstruction: true/false
- loadedReferenceImage: true/false
- loadedActualImage: true/false
- checkedProductNameSingleLine: true/false
- checkedReferenceMatch: true/false
- checkedTypography: true/false
- typographyVerdict: PASS/NG
- verdict: PASS/NG
- blockers: []

If any required file or image is not loaded, verdict must be NG.
