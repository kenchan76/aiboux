# AIBOUX Final-Only Report Protocol

作成日時: 2026-05-31 10:27 JST

## Status

PREVIEW_READY

このログは `DEPLOYED`、`FINAL_ACCEPTED`、`COMPLETED` ではありません。

## Instruction File

- `ops/instructions/20260531_final_only_report_protocol.md`

## Fixed

- 中間報告でURLを表示しないルールを追加。
- 中間報告でBark通知を送らないルールを維持。
- `scripts/render-aiboux-final-report.mjs` を追加。
- `scripts/check-report-policy.mjs` を追加。
- `check:report-policy` をpackage scriptへ追加。
- `gate:code`、`gate:preview`、`gate:deploy`、`gate:final` にreport policy checkを追加。
- 最終ユーザー報告文はPREVIEW_READYのためURLなしで生成。

## Verification

- direct detail preview: PASS
- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run check:bark-policy`: PASS
- `npm run check:report-policy`: PASS
- final user report control char check: PASS
- stdout report control char check: PASS

## Bark

- notification: not sent
- reason: Bark notifications are final-only by policy.
- secretLogged: false

## Notes

- User-facing URLs are not shown for PREVIEW_READY.
- Not DEPLOYED
- Not FINAL_ACCEPTED
- Not COMPLETED
