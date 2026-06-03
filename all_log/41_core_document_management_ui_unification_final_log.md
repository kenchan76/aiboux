# AIBOUX Core 帳票管理UI統一リデザイン 最終ログ

日時: 2026-05-30 00:06 JST

## 対象

- 見積書、注文書、納品書、請求書、入金伝票の帳票一覧
- 納品書の作成、詳細/編集ワークスペース

## 実装内容

- Core トップバーから `Core / 納品書` 形式のパンくず表示を削除した。
- 帳票一覧のタイトル下説明文を非表示にし、一覧内の重複検索バーを削除した。
- 帳票一覧を当月表示に寄せ、表示期間を明示した。
- KPI を `今月の件数`、`今月の下書き`、`今月の発行済`、`今月の対象金額` に統一した。
- 納品書番号を `N20260529-01` 形式の作成日ベース自動発番に変更した。
- 納品書一覧の列から発行日、作成日、件名相当の列を外し、行クリックで詳細/編集ワークスペースを開く導線にした。
- 納品書作成画面で作成日、発行日、件名、基本情報内の状態表示を削除した。
- 状態は納品書作成タイトル行だけで操作する形に変更した。
- B2 CSV、飛伝CSV、メール送信、FAX送信、コピー、キャンセル、保存をタイトル右側へ集約した。
- メール送信とコピーは青系アウトライン、FAX送信は緑系アウトライン、保存は青塗りにした。
- メール/FAXは外部送信を実行せず、送信前確認の準備導線に留めた。
- 納品先を会社名、部署名、担当者名、郵便番号、都道府県、市区町村、番地・建物名、電話番号に分割した。
- 配送情報を配送業者、サービス種別、お問い合わせ番号、納品日、配送希望時間帯、配送備考に整理した。
- 金額サマリーを右側カードから下部フッターへ移動した。
- 明細一覧を横幅いっぱいに広げ、ドラッグハンドル、No.、商品コード / 商品名 / 規格、単位、入数、数量、単価、金額、備考、操作の列構成に変更した。
- 商品名列を広く、単位/入数/数量/単価/操作列を狭くした。
- 備考を任意文字入力にし、明細行のドラッグ&ドロップ並べ替えを追加した。
- DnD 後は表示 No. が配列順に振り直され、保存 API では既存の `line_no` に配列順が保存される。
- 納品書詳細/編集画面も作成画面と同じヘッダー操作、明細列、下部金額サマリーに寄せた。

## 変更ファイル

- `src/components/core/CoreShell.tsx`
- `src/components/core/CoreTopbar.tsx`
- `src/components/core/CorePageHeader.tsx`
- `src/components/core/CoreDataTable.tsx`
- `src/components/core/forms/DocumentEntryForm.tsx`
- `src/data/core-sample-data.ts`
- `src/lib/coreDocumentFormSchema.ts`
- `src/pages/core/api/documents/save.ts`
- `AIBOUX_MASTER_DOCUMENT.md`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`
- `all_log/41_core_document_management_ui_unification_final_log.md`

## 検証

- `npm run astro check`: success, 0 errors, 0 warnings, existing hints only.
- `ESBUILD_WORKER_THREADS=0 npm run build`: success, dist output completed. Existing Vite chunk-size warning and esbuild post-build deadlock trace appeared after completion, command exit code was 0.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-full-ui-redesign.spec.ts --grep "Core全主要ページ|納品書作成UI|納品書詳細画面" --reporter=line`: 3 passed.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-document-entry.spec.ts --reporter=line`: 1 passed.

## スクリーンショット

- 納品書一覧: `output/playwright/core-ui-redesign/05_deliveries.png`
- 納品書作成: `output/playwright/core-ui-redesign/20_delivery_create_no_a4.png`
- 納品書詳細/編集: `output/playwright/core-ui-redesign/19_delivery_detail.png`
- 見積書一覧: `output/playwright/core-ui-redesign/02_estimates.png`
- 注文書一覧: `output/playwright/core-ui-redesign/04_orders.png`
- 請求書一覧: `output/playwright/core-ui-redesign/06_invoices.png`
- 入金伝票一覧: `output/playwright/core-ui-redesign/07_payments.png`

## 未解決・TBD

- 納品先、配送情報、明細の追加 UI 項目は既存帳票保存 API との互換を優先し、専用 DB カラム永続化は未実装。
- B2 CSV / 飛伝CSV は準備導線のみ。実 CSV 仕様、出力項目、配送会社ごとのマッピングはTBD。
- メール/FAXは送信前確認導線のみ。外部送信の実行は人間承認後の別実装。
- Production deploy はユーザー承認後に実行済み。最終 Worker Version ID は完了報告で報告する。

