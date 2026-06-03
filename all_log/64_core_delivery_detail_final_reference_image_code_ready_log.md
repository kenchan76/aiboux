# Core Delivery Detail Reference Image Match

作成日時: 2026-05-31 10:45 JST

## Status

CODE_READY

このログは `DEPLOYED`、`FINAL_ACCEPTED`、`COMPLETED` ではありません。

## Reference

- Local reference image: `output/reference/core-delivery-detail-final-reference.png`
- Reference image size: `1672x941`

## Fixed

- 参照画像を保存し、実装前に読み込んだ。
- v3/v4は参照画像を基準にしていなかったため `BLOCKED_DESIGN` へ差し戻した。
- 横長summary stripを廃止。
- 上段を「基本情報」「納品先」「配送情報」の3カード構成へ戻した。
- 右上アクションを参照画像の主要構成へ合わせた。
- 削除を常時表示から外し、More内へ維持した。
- 明細一覧を参照画像のカード構造へ寄せた。
- 備考・メモ / 履歴を明細下の2カードとして維持した。
- 固定フッターを参照画像の高さ感へ戻した。
- 右下Global AI FABは納品書詳細画面で非表示のまま維持した。

## Verification

- reference image loaded: PASS (`1672x941`)
- reference structure check: PASS
- delivery detail print test: PASS
- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `npm run gate:code`: PASS (`AIBOUX_GATE_CODE_READY`)

## Evidence

- reference image: `output/reference/core-delivery-detail-final-reference.png`
- actual screenshot 1672: `output/playwright/core-documents-redesign/delivery-detail-reference-match-1672.png`
- actual screenshot 1980: `output/playwright/core-documents-redesign/delivery-detail-reference-match-1980.png`
- actual screenshot 1650: `output/playwright/core-documents-redesign/delivery-detail-reference-match-1650.png`
- actual screenshot 1440: `output/playwright/core-documents-redesign/delivery-detail-reference-match-1440.png`
- actual screenshot 1366: `output/playwright/core-documents-redesign/delivery-detail-reference-match-1366.png`
- comparison HTML: `output/playwright/core-documents-redesign/delivery-detail-reference-compare.html`
- Playwright snapshot baselines:
  - `tests/core-delivery-detail-print.spec.ts-snapshots/delivery-detail-reference-1980-linux.png`
  - `tests/core-delivery-detail-print.spec.ts-snapshots/delivery-detail-reference-1650-linux.png`
  - `tests/core-delivery-detail-print.spec.ts-snapshots/delivery-detail-reference-1440-linux.png`
  - `tests/core-delivery-detail-print.spec.ts-snapshots/delivery-detail-reference-1366-linux.png`

## Bark

- Previous entry corrected on 2026-05-31 JST.
- The previous `final-only` interpretation was incorrect.
- Progress Bark Notification is required when a Codex work unit finishes or pauses.
- Progress Bark does not require `userReceiptConfirmed=true` and is not FINAL_ACCEPTED or COMPLETED.
- Final Acceptance Bark remains separate and requires receipt confirmation when final completion is claimed.

## User-Facing URLs

- Previous entry corrected on 2026-05-31 JST.
- User-facing URLs are not final-only.
- When the user asks for the latest URL bundle again, Codex must reissue the latest available URLs immediately.

## URL Bundle

- マスター: `https://mainly-fighters-cruise-screens.trycloudflare.com/m70.html`
- ログ: `https://mainly-fighters-cruise-screens.trycloudflare.com/l70.html`
- 画面: `https://mainly-fighters-cruise-screens.trycloudflare.com/d70.html`

## Notes

- Not DEPLOYED
- Not FINAL_ACCEPTED
- Not COMPLETED
