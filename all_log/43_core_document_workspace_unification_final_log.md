# AIBOUX Core 帳票作成/編集/詳細ワークスペース統一 完了ログ

Date: 2026-05-30

## 対象

- `/core/estimates`
- `/core/orders`
- `/core/deliveries`
- `/core/invoices`
- `/core/payments`
- `/core/purchase-orders`

## 修正内容

- `DocumentEntryForm` の納品書専用新UI分岐を帳票共通の `CoreDocumentWorkspace` に統一した。
- 見積書、注文書、納品書、請求書、入金伝票、発注書の作成画面を同じヘッダー、基本情報カード、宛先/納品先カード、支払/配送/管理カード、明細一覧、下部金額フッター構成にした。
- 作成画面から `A4プレビュー`、`ライブプレビュー`、`印刷時の配置を確認できます` を削除した。
- A4印刷/PDFは `/core/documents/print/{id}` の別導線に分離した。
- 発注書の作成ボタンをドロップダウンではなく、帳票系と同じ直接作成ワークスペース起動に変更した。
- 全帳票の書類番号を作成日ベース自動発番へ統一した。
  - 見積書: `Q20260529-01`
  - 注文書: `O20260529-01`
  - 納品書: `N20260529-01`
  - 請求書: `I20260529-01`
  - 入金伝票: `R20260529-01`
  - 発注書: `P20260529-01`
- 保存 schema/API を `quote / order / delivery / invoice / payment / purchase-order` に拡張した。
- 一覧クリック後の詳細/編集ワークスペースも帳票種別に応じたラベルへ寄せ、右詳細パネルではなく同一画面内の詳細/編集ワークスペースを開く状態を維持した。
- メール/FAXは外部送信せず、送信前確認の準備導線のまま維持した。

## 変更ファイル

- `src/components/core/forms/DocumentEntryForm.tsx`
- `src/components/core/CoreShell.tsx`
- `src/components/core/CorePageHeader.tsx`
- `src/components/core/CoreDataTable.tsx`
- `src/data/core-sample-data.ts`
- `src/lib/coreDocumentFormSchema.ts`
- `src/pages/core/api/documents/save.ts`
- `tests/core-full-ui-redesign.spec.ts`
- `tests/core-document-entry.spec.ts`
- `AIBOUX_MASTER_DOCUMENT.md`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`
- `all_log/43_core_document_workspace_unification_final_log.md`

## 検証

- `npm run astro check`
  - Result: 0 errors, 0 warnings, 27 existing hints.
- `ESBUILD_WORKER_THREADS=0 npm run build`
  - Result: success.
  - Note: existing Vite chunk-size warning only.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-full-ui-redesign.spec.ts --reporter=line`
  - Result: 5 passed.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-document-entry.spec.ts --reporter=line`
  - Result: 1 passed.
- `PLAYWRIGHT_BASE_URL=https://core.aiboux.com npx playwright test tests/core-full-ui-redesign.spec.ts --reporter=line`
  - Result: 5 passed.
- Public URL HTTP confirmation:
  - `https://core.aiboux.com/core`: 200
  - `https://core.aiboux.com/core/estimates`: 200
  - `https://core.aiboux.com/core/orders`: 200
  - `https://core.aiboux.com/core/deliveries`: 200
  - `https://core.aiboux.com/core/invoices`: 200
  - `https://core.aiboux.com/core/payments`: 200
  - `https://core.aiboux.com/core/purchase-orders`: 200
- Legacy UI string sweep:
  - `DocumentEntryForm.tsx` and `CoreShell.tsx` no longer contain create-workspace `A4プレビュー` / `ライブプレビュー` / `印刷時の配置を確認できます`.
  - Remaining `DocumentPrintView` references are limited to the separate print/PDF route.

## スクリーンショット

- `output/playwright/core-documents-redesign/estimate-create.png`
- `output/playwright/core-documents-redesign/order-create.png`
- `output/playwright/core-documents-redesign/delivery-create.png`
- `output/playwright/core-documents-redesign/invoice-create.png`
- `output/playwright/core-documents-redesign/payment-create.png`
- `output/playwright/core-documents-redesign/purchase-order-create.png`
- `output/playwright/core-documents-redesign/estimate-list.png`
- `output/playwright/core-documents-redesign/order-list.png`
- `output/playwright/core-documents-redesign/delivery-list.png`
- `output/playwright/core-documents-redesign/invoice-list.png`
- `output/playwright/core-documents-redesign/payment-list.png`
- `output/playwright/core-documents-redesign/purchase-order-list.png`

## デプロイ

- Production deploy command: `npx wrangler deploy --keep-vars`
- Final Worker Version ID is reported in the completion response because each log-only redeploy generates a new immutable version.

## 24時間URL

- Temporary URL: `https://mail.aiboux.com/api/temp/log/core-document-workspace-unification-final-20260530?token=94bb622a40f69cc2715fbb6a404acd834b6563882b00dfb6`
- Short URL: `https://mail.aiboux.com/g/cdocui3?token=94bb622a40f69cc2715fbb6a404acd834b6563882b00dfb6`
- Expires: `2026-05-30T16:14:23Z`
- HTTP confirmation: both URLs returned 200.

## TBD / 未解決

- 納品先、配送情報、支払情報などの追加 UI 項目は既存帳票保存 API との互換を優先し、専用 DB カラム永続化は未実装。
- B2 CSV / 飛伝CSV の実 CSV 仕様と項目マッピングはTBD。
- メール/FAXは準備導線のみで、外部送信は人間承認後の別実装。
