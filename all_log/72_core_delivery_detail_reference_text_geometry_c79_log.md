# Core Delivery Detail c79 Reference Text And Geometry Log

作成日時: 2026-05-31 17:00 JST

## Status

ACTIVE_DESIGN_FIX

## Why c78 Continued

- c78 was close, but the basic customer value did not match the reference image.
- Reference expected `株式会社サンプル`.
- Actual showed `サンプル商事株式会社`.
- c78 did not make the reference text contract strict enough.
- c78 also did not report all requested primary-region geometry deltas.

## Fixed

- Changed delivery sample document `N20260530-01` partner to `株式会社サンプル`.
- Added `output/reference/core-delivery-detail/reference-text-contract.json`.
- Added strict forbidden text checks for:
  - `サンプル商事株式会社`
  - `05/29/2026`
  - `東京本社 1...`
  - `03-1234-5...`
- Added primary-region geometry deltas for:
  - sidebar width
  - top search y
  - title row y
  - top cards y and height
  - detail table y
  - memo/history y
  - footer y
- Updated sidebar width and delivery detail content sizing to match reference coordinates more closely.

## Verification

- check:control-chars: PASS
- check:mojibake: PASS
- astro check: PASS
- build: PASS
- local Playwright delivery detail: PASS
- public d79 style/direct detail check: PASS
- gate:code: PASS
- reference text contract: PASS
- text mismatch: PASS
- visual blockers: PASS
- geometry: PASS
- typography: PASS
- productNameSingleLine: PASS
- fontWeight: PASS
- diffRatio: NG

## Diff Ratio

- diffRatio: 0.13038150394825823
- threshold: 0.04
- result: NG

## Deploy

- Status: DEPLOY_BLOCKED_AUTH
- Reason: Wrangler authentication failed.
- This blocks production deployment only.

## 4 URLs

- マスター: https://mainly-fighters-cruise-screens.trycloudflare.com/m79.html
- ログ: https://mainly-fighters-cruise-screens.trycloudflare.com/l79.html
- 画面: https://mainly-fighters-cruise-screens.trycloudflare.com/d79.html
- 比較: https://mainly-fighters-cruise-screens.trycloudflare.com/c79.html

## Bark

### Progress Notification

- purpose: progress
- sent: true
- delivered: true
- skipped: false
- secretLogged: false
- userReceiptConfirmed: false
- finalGate: false

## Notes

- Not PREVIEW_READY_PENDING_USER because strict diffRatio gate failed.
- Not DEPLOYED.
- Not FINAL_ACCEPTED.
- Not COMPLETED.
