# Core Delivery Detail Reference Image Match

## Status

CODE_READY target

## Target

- AIBOUX Core
- `/core/deliveries`
- 納品書詳細画面

## Reference

- Source URL: `https://tadaup.jp/5kC9aM31.png`
- Local path: `output/reference/core-delivery-detail/reference.png`
- Metadata path: `output/reference/core-delivery-detail/reference.meta.json`

## Required Fixes

- Load and persist the reference image before implementation.
- Use the reference structure: sidebar, search bar, toolbar, top three cards, lines card, memo/history cards, fixed footer.
- Keep top cards independent: 基本情報, 納品先, 配送情報.
- Remove the horizontal summary strip approach.
- Keep 備考・メモ and 履歴 as two bottom cards.
- Hide Global AI FAB on the delivery detail screen.
- Keep 削除 out of the always-visible top actions.

## Required Evidence

- Reference image metadata with width, height, and SHA-256.
- Playwright screenshots for 1672x941, 1980x1080, 1650x900, and 1366x768.
- Reference comparison HTML.
- Local and public Playwright PASS.
- 4URL Bundle.
- Bark progress notification after the URL bundle is ready.

## Forbidden

- Reporting CSS/JS recovery as design acceptance.
- Reporting public style check as reference-image match.
- Restoring 配送状況, 通貨, or 配送備考.
- Reporting DEPLOYED, FINAL_ACCEPTED, or COMPLETED.
