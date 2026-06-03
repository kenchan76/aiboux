# AIBOUX Core 帳票管理UI Grok / Cloudflare AI 二重監査 最終ログ

作成日: 2026-05-30
対象: `/core/estimates`, `/core/orders`, `/core/deliveries`, `/core/invoices`, `/core/payments`, `/core/purchase-orders`

## 実装概要

- 帳票一覧はチェック選択と一括処理を前提にした。
  - 表示中全件選択チェックボックス
  - 行チェックボックス
  - `選択 n件`
  - `一括送付を準備`
  - 外部送信は実送信せず、人間承認前の準備導線に限定
- 一覧UIを参考画像に寄せ、タイトル行右側に表示期間、状態、担当者、詳細フィルタ、CSV出力、一括送付準備、作成ボタンを集約した。
- KPIカードをアイコン付き4枚に統一した。
  - 今月の件数
  - 今月の下書き
  - 今月の発行済
  - 今月の対象金額
- `カスタマイズ`、パンくず、タイトル下説明文、一覧内重複検索、右詳細パネルを帳票一覧から除去した。
- 帳票種別ごとの列名と作成カード名を `coreDocumentUiConfig` で制御した。
- 全帳票の作成/編集/詳細ワークスペースを共通レイアウトに統一した。
- 作成画面から A4プレビュー、ライブプレビュー、印刷時の配置説明、右側プレビュー、右下アクションエリアを除去した。
- 納品書作成の配送情報カードから `配送備考` を削除し、下部 `備考・メモ` の `納品時メモ` に統合した。
- 明細テーブルは商品列を主役にし、単位/入数/数量/単価/操作列を狭くした。
- 明細D&D後の保存順を `line_no` に保持する契約を schema/form/API/test で固定した。
- Playwright `getByDisplayValue` が使えるよう、テスト側で selector engine と page locator polyfill を有効化した。

## 画像と違っていた箇所と修正

- KPIカードがテキストカード寄りだったため、丸背景アイコン付きの高密度カードに変更した。
- タイトル下にフィルター行が残っていたため、タイトル右側の操作列へ集約した。
- `カスタマイズ` ボタンが帳票一覧に残る可能性を排除した。
- 納品書用の列名が他帳票へ漏れる問題を、帳票別設定オブジェクトで制御した。
- 作成ワークスペース上段カードが間延びしていたため、`items-start` と自然高さに変更し、固定 height / `h-full` / `items-stretch` を使わない構造にした。
- 配送情報カード内の `配送備考` を削除し、`備考・メモ` の `納品時メモ` へ統合した。
- 明細テーブルの商品列を `minmax(600px, 1fr)` に広げ、数値列と操作列を指定幅で狭くした。
- 発注書作成はドロップダウンではなく、1クリックで作成ワークスペースを開く導線にした。
- 最新指示に合わせ、一覧はチェック選択と一括送付準備を前提に戻した。

## 変更ファイル

- `src/components/core/CoreShell.tsx`
- `src/components/core/CoreDataTable.tsx`
- `src/components/core/forms/DocumentEntryForm.tsx`
- `src/lib/coreDocumentUiConfig.ts`
- `src/lib/coreDocumentFormSchema.ts`
- `src/pages/core/api/documents/save.ts`
- `tests/core-full-ui-redesign.spec.ts`
- `tests/core-document-entry.spec.ts`
- `all_log/core_documents_grok_list_review.md`
- `all_log/core_documents_grok_create_review.md`
- `all_log/core_documents_grok_delivery_review.md`
- `all_log/core_documents_grok_line_table_review.md`
- `all_log/core_documents_cloudflare_ai_dom_audit.json`
- `all_log/core_documents_cloudflare_ai_spec_audit.json`
- `all_log/46_core_document_ui_grok_cloudflare_final_log.md`

## Grok Buildレビュー結果

- `all_log/core_documents_grok_list_review.md`: PASS
- `all_log/core_documents_grok_create_review.md`: PASS
- `all_log/core_documents_grok_delivery_review.md`: PASS
- `all_log/core_documents_grok_line_table_review.md`: PASS

## Cloudflare AI監査結果

- `all_log/core_documents_cloudflare_ai_dom_audit.json`: PASS
- `all_log/core_documents_cloudflare_ai_spec_audit.json`: PASS

Cloudflare AIの最終判定は両方とも `{"verdict":"PASS","findings":[]}`。

## 検証結果

- `npm run astro check`: 0 errors, 0 warnings, 27 hints
- `ESBUILD_WORKER_THREADS=0 npm run build`: success
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-full-ui-redesign.spec.ts --reporter=line`: 6 passed
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-document-entry.spec.ts --reporter=line`: 1 passed
- `PLAYWRIGHT_BASE_URL=https://core.aiboux.com npx playwright test tests/core-full-ui-redesign.spec.ts tests/core-document-entry.spec.ts --reporter=line`: 7 passed

## 公開URL確認

- `https://core.aiboux.com/core/estimates`
- `https://core.aiboux.com/core/orders`
- `https://core.aiboux.com/core/deliveries`
- `https://core.aiboux.com/core/invoices`
- `https://core.aiboux.com/core/payments`
- `https://core.aiboux.com/core/purchase-orders`

公開URLのPlaywright監査で、全帳票の一覧、作成、編集スクリーンショットを取得し、禁止語と必須要素を確認済み。

## スクリーンショット保存先

- `output/playwright/core-documents-redesign/estimate-list.png`
- `output/playwright/core-documents-redesign/estimate-create.png`
- `output/playwright/core-documents-redesign/estimate-edit.png`
- `output/playwright/core-documents-redesign/order-list.png`
- `output/playwright/core-documents-redesign/order-create.png`
- `output/playwright/core-documents-redesign/order-edit.png`
- `output/playwright/core-documents-redesign/delivery-list.png`
- `output/playwright/core-documents-redesign/delivery-create.png`
- `output/playwright/core-documents-redesign/delivery-edit.png`
- `output/playwright/core-documents-redesign/invoice-list.png`
- `output/playwright/core-documents-redesign/invoice-create.png`
- `output/playwright/core-documents-redesign/invoice-edit.png`
- `output/playwright/core-documents-redesign/payment-list.png`
- `output/playwright/core-documents-redesign/payment-create.png`
- `output/playwright/core-documents-redesign/payment-edit.png`
- `output/playwright/core-documents-redesign/purchase-order-list.png`
- `output/playwright/core-documents-redesign/purchase-order-create.png`
- `output/playwright/core-documents-redesign/purchase-order-edit.png`
- `output/playwright/core-documents-redesign/public-dom-audit.json`
- `output/playwright/core-documents-redesign/reference-list.png`
- `output/playwright/core-documents-redesign/reference-create.png`

## 引継ぎ

- 今後のAIBOUX Core UI修正では、完了報告前に Grok Build と Cloudflare AI の二重レビューを必須にする。
- Grok BuildのタイムアウトはPASS扱いしない。
- Cloudflare AIはDOM/文言/仕様差分監査に使う。
- 一覧はチェック選択と一括処理を前提にする。
- メール/FAX/一括送付は準備導線のみで、外部送信は人間承認後に限定する。
- A4印刷/PDFは作成画面ではなく別導線にする。

## 未解決 / TBD

- B2 CSV / 飛伝CSV の実フォーマットと項目マッピングはTBD。
- 配送先・支払情報・消込情報などの追加UI項目は、現時点では既存API互換を優先している。専用DBカラム永続化の詳細設計はTBD。
- 実メール/FAX送信、外部配送API連携は未実装。人間承認前提の準備導線のみ実装済み。
