# AIBOUX Core Phase 2 Final Log

実行日: 2026-05-28

## 実装概要

AIBOUX Coreの商品マスタを、一覧画面の上からSheetで高速登録・編集できる入力UIへ拡張した。商品本体、複数SKU、初期在庫、販売価格、Shop公開ON/OFFを1画面で扱える。

## 追加・変更ファイル

- `src/lib/coreProductMasterFormSchema.ts`
  - React Hook FormとAPIで共有するZodスキーマ。
  - 必須項目、価格/在庫の非負チェック、JAN 8〜14桁、SKU重複を検証。
- `src/components/core/forms/ProductMasterForm.tsx`
  - shadcn Sheet上のマスタ入力フォーム。
  - `useFieldArray` によるSKU行の追加/削除。
  - リアルタイムエラー表示、Ctrl/Command + Enter保存、保存プレビュー。
- `src/pages/core/api/products/save.ts`
  - `GET ?id=...`: 編集用データ取得。
  - `POST`: 商品、SKU、Shop商品、Shopチャネル配信、Shop SKU variantsをD1 batchで保存。
- `src/components/core/CorePimHubDashboard.tsx`
  - 「商品マスタを追加」ボタンと行単位の「編集」を追加。
  - 保存後にSheetを閉じ、一覧を再取得。
- `AIBOUX_MASTER_DOCUMENT.md`
  - Core Phase 2の実装内容と検証結果を追記。
- `package.json` / `package-lock.json`
  - `react-hook-form`, `@hookform/resolvers`, `zod` を追加。

## CLI / UI Component Notes

- `npm install react-hook-form @hookform/resolvers zod`: success.
- `npx shadcn-ui@latest add form sheet scroll-area toast`: deprecated notice only.
- `npx shadcn@latest add form --yes`: registry check completed.
- `toast` componentはshadcn CLI上でdeprecatedのため、既存のSonner Toastを使用。
- `sheet` / `scroll-area` / `sonner` は既存コンポーネントを使用。

## 動作確認

- `npm run astro check`
  - 0 errors
  - 既存のunused/deprecated系ヒントのみ
- `ESBUILD_WORKER_THREADS=0 npm run build`
  - success
- Local Worker smoke:
  - `POST /core/api/products/save`
    - 2 SKU登録
    - 総在庫10
    - Shop公開SKU 1件
    - 200 OK
  - `GET /core/api/products/save?id=...`
    - 登録済み商品と2SKUを取得
    - 200 OK

## Cloudflare AI Architecture Audit

- `/api/ai/health?run=1` でWorkers AI bindingを確認。
- 監査ログ: `all_log/29_core_phase2_cloudflare_ai_audit.json`
- 監査観点:
  - Product -> SKUs -> Listings の親子保存
  - tenant isolation
  - SKU conflict
  - D1 batch atomicity

## Codex UX Self Audit

- 監査ログ: `all_log/29_core_phase2_ux_self_audit.md`
- 主な確認点:
  - 一覧から文脈を失わずSheetで登録/編集できる。
  - 商品名autoFocusとCtrl/Command + Enter保存でキーボード操作を短縮。
  - SKU行はExcelライクに横並びで入力できる。
  - エラーはフィールド直下に即時表示。
  - 保存成功時はToast、Sheet close、一覧再フェッチまで自動。

## 未完了・次の改善候補

- JANチェックデジット検証。
- SKU行コピー/複製。
- CSV貼り付けによる大量SKU登録。
- 保存前差分プレビュー。
