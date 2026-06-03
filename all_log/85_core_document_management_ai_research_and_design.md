# Core Document Management AI Research And Design

## Status

CODE_READY

## Task

AIBOUX Coreに「書類管理AI構想」を正本マスターへ追記した。
今回は実装ではなく、仕様設計の記録である。

## Updated Files

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `ops/instructions/current.md`
- `ops/instructions/20260601_core_document_management_ai_master_spec.md`
- `all_log/85_core_document_management_ai_research_and_design.md`

## Design Fixed

- 書類管理と帳票管理を分離する。
- 書類管理は外部から来る紙、PDF、画像、LINE文面、AIBOUX Mail文面を扱う。
- 帳票管理はCore内部で見積書、注文書、納品書、請求書を作成、一覧、詳細、編集する場所として扱う。
- 第一採用AIはGemini Flash系。
- 初期実装はGemini Flash一本で開始する。
- 低信頼度、失敗、特殊帳票のときだけ補助AIを比較検討する。
- Document AI、Mistral OCR、Azure Document Intelligence、AWS Textractは補助候補、比較候補として記録した。
- OpenAI系は今回の本命ではなく、比較候補止まりとして記録した。
- モデルIDはコードに固定しない。
- `AIBOUX_AI_PROVIDER`、`AIBOUX_AI_MODEL_FAST`、`AIBOUX_AI_MODEL_STRONG`、`AIBOUX_AI_MODEL_FALLBACK` で差し替え可能にする。
- Gemini Flashは分類、OCR/視覚理解、明細抽出、金額抽出、LINE文面理解、Mail文面理解、JSON生成を担当する。
- AIBOUX Coreはマスター照合、人間レビュー、突合、納品書作成、月末請求、仕訳候補、CSV/API連携を担当する。
- AI結果は自動確定しない。

## Official Sources Checked

2026-06-01に一次情報を確認した。

- Gemini API document processing: PDF入力を確認。
- Gemini API structured output: JSON Schema structured output対応、対応モデル、Schema subset、アプリ側検証の必要性を確認。
- Gemini API pricing: Gemini 2.5 Flash、Gemini 3.5 Flashの価格を参考情報として確認。
- Google Document AI processor list: Expense Parserの日本語対応、Invoice Parserの対応言語リストを確認。
- Mistral pricing: Mistral OCRのページ課金を確認。
- Azure Document Intelligence overview: prebuilt invoice、prebuilt receiptを確認。
- AWS Textract AnalyzeExpense: 明細とサマリーを返すAnalyzeExpense APIを確認。
- Astro endpoints: API Routesとしてendpointを使えることを確認。
- Cloudflare R2 docs: Workers binding、S3互換API、REST API、オブジェクトストレージ用途を確認。
- Cloudflare Images Transformations: 変換済み画像のエッジキャッシュを確認。
- LINE Messaging API: Webhook、messageIdによる画像/動画/音声/ファイル取得を確認。
- PDF.js: HTML5ベースのPDFビューア、Web標準ベースのPDFパース/レンダリング方針を確認。

## Pricing Note

価格は変動するため、実装値として固定しない。
マスターには2026-06-01時点の公式確認メモとして記録した。

確認した参考値:

- Gemini 2.5 Flash standard: input $0.30 / 1M tokens, output $2.50 / 1M tokens。
- Gemini 2.5 Flash batch: input $0.15 / 1M tokens, output $1.25 / 1M tokens。
- Gemini 3.5 Flash standard: input $0.75 / 1M tokens, output $4.50 / 1M tokens。

## Master Additions

追加した主な節:

- 28. AIBOUX Core 書類管理AI構想
- 28.1 位置づけ
- 28.2 採用AI方針
- 28.3 Gemini Flashを第一採用にする理由
- 28.4 モデルID固定禁止
- 28.5 価格の扱い
- 28.6 補助AIの扱い
- 28.7 AIBOUX CoreでのAIとCoreの責務分離
- 28.8 取り込み経路
- 28.9 LINE取り込み
- 28.10 スマホ写真撮影
- 28.11 PCアップロード / AIワークスペース
- 28.12 UI最重要方針
- 28.13 プレビュー技術方針
- 28.14 Coreサイドバー設計
- 28.15 書類管理の画面一覧
- 28.16 対象書類種別
- 28.17 データ構造
- 28.18 JSON Schema構造化出力
- 28.19 注文書から納品書、月末請求への中核フロー
- 28.20 AIBOUX Mailからの業務アラート
- 28.21 仕訳候補
- 28.22 Astro API Routes設計
- 28.23 R2保存方針
- 28.24 人間レビュー方針
- 28.25 Phase計画
- 28.26 設計確定
- 28.27 設計候補
- 28.28 TBD
- 28.29 音声入力誤変換の補正
- 28.30 禁止事項
- 28.31 公式確認メモ
- 28.32 次タスク

## Data Model Recorded

初期設計の4テーブルを記録した。

- `document_intakes`
- `document_extractions`
- `document_matches`
- `accounting_entry_candidates`

`raw_json` と `normalized_json` を分ける方針を記録した。

## Intake Routes Recorded

取り込み経路は3つで固定した。

1. LINE
2. スマホ写真撮影
3. PCアップロード / AIワークスペースアップロード

## Document Types Recorded

- `receipt`
- `payment_receipt`
- `delivery_note`
- `invoice_received`
- `invoice_issued_internal`
- `order`
- `estimate`
- `line_order_request`
- `mail_order_request`
- `mail_estimate_request`
- `mail_invoice_request`
- `unknown`

## Critical Invoice Rule

- 相手から来た請求書は `invoice_received` として支払、仕訳、突合対象にする。
- 自分たちが発行した請求書は `invoice_issued_internal` として既存請求書との照合対象にする。
- 自分たちが発行した請求書を外部請求書として取り込まない。

## Prohibited Actions Observed

- Bark送信なし。
- deployなし。
- pushなし。
- resetなし。
- cleanなし。
- force pushなし。
- secret表示なし。
- 既存マスターの履歴書、Docs、Mall、File、Biz、Office仕様は削除していない。

## Verification

- `npm run check:control-chars`: CONTROL_CHAR_CHECK_OK
- `npm run check:mojibake`: MOJIBAKE_CHECK_OK files=280
- `npm run astro check`: PASS, 0 errors, 34 hints
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `npm run gate:aiboux`: AIBOUX_GATE_PASS
- `cmp -s AIBOUX_MASTER_DOCUMENT.md public/g/m68.md`: MASTER_AND_PUBLIC_M68_IDENTICAL

## Worker Version Evidence

- Deployment action in this task: not deployed.
- Actual current Worker Version ID checked with `npx wrangler versions list --name aiboux --json`: `756a7286-5335-42d7-b54b-d5d320d8bb9f`
- This Worker Version ID is recorded only to satisfy the AIBOUX gate evidence requirement. It is not a claim that this master document change was deployed.
