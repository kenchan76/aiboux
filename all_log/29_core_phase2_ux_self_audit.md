# Core Phase 2 UX Self Audit

## 対象

- `src/components/core/forms/ProductMasterForm.tsx`
- `src/components/core/CorePimHubDashboard.tsx`
- `src/pages/core/api/products/save.ts`

## 監査結果

- 入力導線:
  - `/core/products` の一覧上部に「商品マスタを追加」を配置し、画面遷移せずSheetで登録できる。
  - 各行の「編集」から既存商品を読み込み、同じSheetで更新できる。
- キーボード操作:
  - 商品名にautoFocus。
  - Ctrl/Command + Enterで保存可能。
  - SKU行は横並びの表形式で、Tab移動でExcelライクに入力できる。
- エラー視認性:
  - Zod/RHFのリアルタイム検証を `mode: onChange` で有効化。
  - 必須項目、JAN桁数、価格/在庫の非負チェック、SKUコード重複をフィールド直下に表示。
- コンテキスト維持:
  - Sheetを右側スライドアウトにし、一覧画面の検索/状態を失わずに登録・編集できる。
  - 保存成功後はToast表示、Sheet close、一覧再フェッチまで自動。
- 実務性:
  - 商品本体、複数SKU、Shop公開ON/OFF、Shop名を1画面に集約。
  - 保存プレビューでSKU数、総在庫、標準価格を即時確認できる。

## 改善候補

- SKU行のコピー/複製ボタン。
- JANチェックデジット検証。
- 保存前差分プレビュー。
- 100SKU超の大規模登録向けCSV貼り付けモード。
