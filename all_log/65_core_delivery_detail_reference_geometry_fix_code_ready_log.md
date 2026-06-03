# Core Delivery Detail Reference Geometry Fix

## Status

BLOCKED_DESIGN

## 2026-05-31 JST Correction

The previous CODE_READY status for m73/l73/d73/c73 is withdrawn.

Reasons:
- c73 judged only five vertical geometry values and did not judge visual/text conformity against the reference image.
- c73 did not detect truncated destination values.
- c73 did not detect the wrong native date display format `05/29/2026`.
- c73 did not detect the visible right-top More button.
- c73 did not include text-diff or visual-blocker checks.
- User visual inspection rejected c73.

m73/l73/d73/c73 are blocked evidence, not completion evidence.

## Prior Evidence Correction

c72 is blocked evidence, not completion evidence.

Reasons:
- c72 checked only structure presence such as top three cards, lines card, memo/history, footer, actions, and Global AI FAB hidden.
- c72 did not judge visual geometry against the reference image.
- The previous Actual layout was visually rejected by the user because the top cards were too short, the lines card started too high, and the lower cards/footer did not match the reference image.
- m72/l72/d72/c72 must not be used as completion evidence.

## Reference Image

- source URL: `https://tadaup.jp/5kC9aM31.png`
- saved path: `output/reference/core-delivery-detail/reference.png`
- metadata path: `output/reference/core-delivery-detail/reference.meta.json`
- width: `1672`
- height: `941`
- sha256: `600494072f69a9f0ad9ff03f672573357d730a2770d1e92ab285b4b00a3243e1`

## Fixed

- Restored the visual direction from high-density compression to reference-image geometry matching.
- Increased the top three card area to match the reference image height.
- Matched the lines card start position to the reference image instead of pushing it too high.
- Matched memo/history and footer vertical positions against the reference image.
- Kept the top three independent cards and kept the horizontal summary strip absent.
- Kept delete out of the always-visible top action group.
- Kept Global AI FAB hidden on delivery detail.
- Added a geometry-based comparison report, not just structure presence checks.

## Geometry Comparison

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
    "topCardsHeight": 328,
    "linesY": 464,
    "memoHistoryY": 731,
    "footerY": 869,
    "titleActionsRightEdge": 1640
  },
  "delta": {
    "topCardsY": -7,
    "topCardsHeight": 8,
    "linesY": -7,
    "memoHistoryY": 11,
    "footerY": 7
  },
  "thresholds": {
    "topCardsY": 16,
    "topCardsHeight": 30,
    "linesY": 24,
    "memoHistoryY": 32,
    "footerY": 24
  },
  "verdict": "PASS"
}
```

## Evidence

- actual screenshot 1672: `output/playwright/core-documents-redesign/delivery-detail-reference-match-v2-1672.png`
- geometry JSON: `output/playwright/core-documents-redesign/delivery-detail-reference-geometry-v2.json`
- compare v2 HTML: `output/playwright/core-documents-redesign/delivery-detail-reference-compare-v2.html`
- updated snapshots:
  - `tests/core-delivery-detail-print.spec.ts-snapshots/delivery-detail-reference-1440-linux.png`
  - `tests/core-delivery-detail-print.spec.ts-snapshots/delivery-detail-reference-1366-linux.png`

## 4 Required URLs

- Master update preview URL: `https://mainly-fighters-cruise-screens.trycloudflare.com/m73.html`
- Execution log preview URL: `https://mainly-fighters-cruise-screens.trycloudflare.com/l73.html`
- Screen preview URL: `https://mainly-fighters-cruise-screens.trycloudflare.com/d73.html`
- Reference comparison HTML URL: `https://mainly-fighters-cruise-screens.trycloudflare.com/c73.html`

## Verification

- reference geometry Playwright: PASS
- local delivery detail Playwright: PASS
- public preview style check: PASS
- public reference geometry Playwright: PASS
- public delivery detail Playwright: PASS
- check:control-chars: PASS
- check:mojibake: PASS
- check:bark-policy: PASS
- check:report-policy: PASS
- astro check: PASS
- build: PASS
- gate:code: PASS
- 4URL HTTP 200 / charset=utf-8 / no-store: PASS
- screen short URL includes direct detail evidence: PASS
- compare short URL includes geometry deltas: PASS

## Bark

### Progress Notification

- purpose: progress
- sent: true
- delivered: true
- skipped: false
- secretLogged: false
- userReceiptConfirmed: false
- finalGate: false
- result: `{"provider":"bark","secretLogged":false,"ok":true,"delivered":true,"skipped":false,"purpose":"progress","finalGate":false,"endpointHost":"api.day.app","mode":"push-json","status":200,"responseCode":200,"responseMessage":"success","responseType":"json","probeAuth":false,"userReceiptConfirmed":false}`

### Final Acceptance Notification

- required: false
- reason: current status is BLOCKED_DESIGN

## Notes

- Not DEPLOYED.
- Not FINAL_ACCEPTED.
- Not COMPLETED.
