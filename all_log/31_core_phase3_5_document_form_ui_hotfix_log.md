# AIBOUX Core Phase 3.5 帳票フォームUI緊急改修ログ

日時: 2026-05-28 JST

## 修正対象

- `src/components/core/forms/DocumentEntryForm.tsx`

## 修正内容

- Sheet幅を実務入力向けに拡張。
  - `w-full !max-w-[95vw] sm:!max-w-[1200px] overflow-y-auto`
- 明細行をTableからCSS Gridへ変更。
  - `grid grid-cols-[30px_1fr_100px_150px_150px_40px] gap-2 items-center`
  - No / 品名 / 数量 / 単価 / 行小計 / 削除 の順で固定配置
- 数量・単価・行小計が画面外に見切れないよう、数量100px、単価150px、行小計150pxを固定幅化。
- 品名欄は `1fr` とし、残り幅を最大限使う設計へ変更。
- 基本情報と明細を視覚的に分離。
  - セクションヘッダーに薄い背景
  - section border / shadow-sm
  - paddingを少し広げて圧迫感を軽減
- 合計欄を強調。
  - 合計金額を `text-2xl`
  - 右側に寄せた固定フッター内のサマリーとして表示

## 自己確認

- Grid幅確認:
  - 固定列: `30 + 100 + 150 + 150 + 40 = 470px`
  - gap: `5 * 8 = 40px`
  - 固定必要幅: `510px`
  - 1200px Sheetでは品名欄に十分な余白が残る。
  - 95vw SheetでもPC/タブレット幅では数量・単価・小計が見切れない。
- `npm run astro check`
  - 0 errors
  - 既存 hints のみ
- `ESBUILD_WORKER_THREADS=0 npm run build`
  - success

## 補足

- 今回はGrokレビューをスキップし、UI幅とGrid修正に集中。
- 本修正は前回のD1/API仕様に影響しない純UI hotfix。
