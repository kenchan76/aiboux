# Core Delivery Detail Reference Text Visual Fix v6

## Status

BLOCKED_DESIGN

## 2026-05-31 JST Correction

The prior CODE_READY judgment for `m74/l74/d74/c74` is withdrawn.

Reason:
- c74 did not check that product name/spec cells are rendered in one line.
- The actual screen still rendered product name and spec as two lines.
- c74 did not include product-row DOM evidence such as product-name cell height, row height, `white-space: nowrap`, or subtitle absence.
- c74 did not include post-Codex Grok / Cloudflare AI review using the same instruction, reference image, actual screenshots, comparison HTML, and DOM audit JSON.

`m74/l74/d74/c74` remain available as rejected evidence only. They must not be treated as completion evidence.

## Instruction

- `ops/instructions/20260531_core_delivery_detail_reference_text_visual_v6.md`

## Prior Evidence Rejected

- `m72/l72/d72/c72`: reference comparison was not sufficient.
- `m73/l73/d73/c73`: geometry-only PASS was invalid.

Reason:
- c73 checked only `topCardsY`, `topCardsHeight`, `linesY`, `memoHistoryY`, and `footerY`.
- c73 did not verify destination-card truncation, delivery-date format, More button visibility, right-top delete visibility, text density, table look, or visual blockers.
- User visual review rejected c73.

## Fixed

- Reverted c73 CODE_READY evidence to invalid design evidence.
- Updated the delivery detail destination card so the reference values are visible without truncation:
  - `株式会社サンプル`
  - `東京本社 仕入部門`
  - `03-1234-5678`
  - `1-7-1 東京本社ビル 1F倉庫前`
- Replaced locale-dependent native date display with fixed readonly `2026/05/29`.
- Removed the right-top `...` More button from the reference-match detail toolbar.
- Kept right-top delete hidden; line-item delete icons remain line-level actions only.
- Added text-difference checks to the reference Playwright test.
- Added visual-blocker checks for wrong date format, destination truncation, More button, always-visible delete button, and Global AI FAB.
- Added `scripts/compare-reference-image.mjs` to generate a diff image and merge geometry, text, and visual-blocker verdicts.
- Regenerated 1672/1980/1650/1366 actual screenshots for v3 reference matching.
- Regenerated c74 comparison HTML with Reference, Actual, Diff, Geometry Difference, Text Difference, Visual Blockers, and Verdict JSON.

## Reference

- Source: `https://tadaup.jp/5kC9aM31.png`
- Local path: `output/reference/core-delivery-detail/reference.png`
- SHA-256: `600494072f69a9f0ad9ff03f672573357d730a2770d1e92ab285b4b00a3243e1`

## Visual Comparison

```json
{
  "verdict": "PASS",
  "geometryPass": true,
  "textPass": true,
  "diffPass": true,
  "diffRatio": 0.1284207221270256,
  "diffThreshold": 0.6,
  "textMismatch": {
    "missingExpectedTexts": [],
    "forbiddenTextsFound": []
  },
  "visualBlockers": []
}
```

## Geometry Difference

```json
{
  "reference": {
    "topCardsY": 135,
    "topCardsHeight": 320,
    "linesY": 471,
    "memoHistoryY": 720,
    "footerY": 862
  },
  "actual": {
    "topCardsY": 128,
    "topCardsHeight": 342,
    "linesY": 478,
    "memoHistoryY": 745,
    "footerY": 869,
    "titleActionsRightEdge": 1640
  },
  "delta": {
    "topCardsY": -7,
    "topCardsHeight": 22,
    "linesY": 7,
    "memoHistoryY": 25,
    "footerY": 7
  }
}
```

## Evidence Files

- `output/playwright/core-documents-redesign/delivery-detail-reference-match-v3-1672.png`
- `output/playwright/core-documents-redesign/delivery-detail-reference-match-v3-1980.png`
- `output/playwright/core-documents-redesign/delivery-detail-reference-match-v3-1650.png`
- `output/playwright/core-documents-redesign/delivery-detail-reference-match-v3-1366.png`
- `output/playwright/core-documents-redesign/delivery-detail-reference-diff-v3-1672.png`
- `output/playwright/core-documents-redesign/delivery-detail-reference-visual-report-v3.json`
- `output/playwright/core-documents-redesign/delivery-detail-reference-compare-v3.html`

## 4 Required URLs

- マスター: `https://mainly-fighters-cruise-screens.trycloudflare.com/m74.html`
- ログ: `https://mainly-fighters-cruise-screens.trycloudflare.com/l74.html`
- 画面: `https://mainly-fighters-cruise-screens.trycloudflare.com/d74.html`
- 比較: `https://mainly-fighters-cruise-screens.trycloudflare.com/c74.html`

## Verification

- local reference structure/text/visual checks: PASS
- local delivery detail print checks: PASS
- public style check: PASS
- public reference structure/text/visual checks: PASS
- public delivery detail print checks: PASS
- reference image diff script: PASS
- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run check:bark-policy`: PASS
- `npm run check:report-policy`: PASS
- `npm run astro check`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `npm run gate:code`: PASS

## Bark

### Progress Notification

```json
{
  "provider": "bark",
  "secretLogged": false,
  "ok": true,
  "delivered": true,
  "skipped": false,
  "purpose": "progress",
  "finalGate": false,
  "endpointHost": "api.day.app",
  "mode": "push-json",
  "status": 200,
  "responseCode": 200,
  "responseMessage": "success",
  "responseType": "json",
  "probeAuth": false,
  "userReceiptConfirmed": false
}
```

### Final Acceptance Notification

- required: false
- reason: current status is CODE_READY

## Notes

- Not DEPLOYED.
- Not FINAL_ACCEPTED.
- Not COMPLETED.
