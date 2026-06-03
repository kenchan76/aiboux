# Core Delivery Detail Direct Preview Report Format Fix

作成日時: 2026-05-31 09:24 JST

## Status

PREVIEW_READY

このログは `DEPLOYED`、`FINAL_ACCEPTED`、`COMPLETED` ではありません。

## Instruction File

- `ops/instructions/20260531_m69_direct_preview_control_char_final_fix.md`

## Fixed

- m70 URL Bundle本文へのNUL制御文字混入を根本修正。
- ユーザー向けURLをm70/l70/d70の短縮URLだけに統一。
- `d70.html` は納品書詳細画面のHTMLを直接返す短縮画面URLとして作成。
- ユーザーへ貼る最終報告文を `scripts/render-aiboux-report.mjs` から生成するようにした。
- `/tmp/aiboux-final-user-report.md` をcontrol-char検査対象に追加。
- `/tmp/aiboux-final-user-report.html` をcontrol-char検査対象に追加。
- `/tmp/aiboux-final-user-report.stdout.md` をcontrol-char検査対象に追加。
- stdout出力もcontrol-char検査対象に追加。
- m69/l69/direct previewを再確認。
- Bark final-only policyを維持し、中間通知を送らない。

## 3 Required URLs

- マスター更新プレビューURL: https://mainly-fighters-cruise-screens.trycloudflare.com/m70.html
- 実行ログプレビューURL: https://mainly-fighters-cruise-screens.trycloudflare.com/l70.html
- 画面プレビューURL: https://mainly-fighters-cruise-screens.trycloudflare.com/d70.html

## Verification

- direct detail URL: PASS
- short screen URL direct detail content: PASS
- public direct detail URL: PASS
- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- final user report control char check: PASS
- stdout report control char check: PASS
- `npm run check:bark-policy`: PASS
- public style check: PASS
- Playwright 1980/1650/1440/1366: PASS

## Bark

- notification: not sent
- reason: Bark notifications are final-only by policy.
- secretLogged: false

## Notes

- m69/l69 are superseded for user-facing reporting by m70/l70 because the previous pasted URL Bundle text was rejected for control character contamination.
- Not DEPLOYED
- Not FINAL_ACCEPTED
- Not COMPLETED
