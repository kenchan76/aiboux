# AIBOUX Data Model

この文書は AIBOUX 全体の主要データ責務を整理します。実テーブル名やDDLは実装時に既存DBを確認し、破壊的変更は行わないこと。

## Confirmed Decisions

- Coreの商品マスタはAIBOUX全体の商品情報の正本。
- 全モデルは原則 `tenant_id`、`created_at`、`updated_at`、`created_by`、`updated_by`、`status`、audit log を考慮する。
- Mail AI artifact は `summary`、`voice_summary`、`reply_draft`、`speech_reply_draft`、`extracted_task`、`classification` を扱う。
- Mailのプライベート判定結果はCore参照ループから除外する。
- Officeはファイル本体を保存しない前提で、履歴メタデータ中心。
- 履歴書は個人情報と顔写真を扱うため、同意、削除、保存期間、配信停止を必須設計にする。

## Assumptions

- Cloudflare D1 が主なリレーショナルメタデータDB。
- R2 は明示的なアップロード同意があるファイル保存に使う。
- Officeのローカル履歴はIndexedDB中心で、会員側にはメタデータのみ保存する。

## TBD

- 各テーブルの最終DDL。
- PIIの保存期間。
- 履歴書写真処理成果物の保存有無。
- Officeのクライアント側暗号化保存オプション。

## Do Not Invent

- ファイル本体や履歴書本文を無断でサーバー保存しない。
- 既存DBにないカラムを「存在する」と言わない。
- 外部連携用IDを勝手に公開識別子として使わない。
- プライベート判定メール本文をCore販売管理・取引先候補・AI横断参照へ流さない。

## Global Models

- tenants
- users
- roles
- permissions
- subscriptions
- invoices_for_subscription
- audit_logs
- integration_events
- ai_action_logs
- consent_logs

## Public Site Models

- public_site_pages
- service_cards
- service_announcements
- public_cta_links

用途:

- `https://aiboux.com` のシリーズ紹介、サービスカード、告知、CTA導線を管理する。

## Core Models

- customers
- delivery_destinations
- product_divisions
- products
- product_favorites
- saved_product_views
- product_price_schedules
- customer_discount_rates
- product_assets
- inventory_items
- inventory_movements
- estimates
- orders
- deliveries
- invoices
- payments
- purchase_orders

Core商品マスタ必須概念:

- JANコード
- 商品名
- 入数
- 仕様
- 単位
- 標準価格
- 税区分
- 商品区分
- ステータス
- 在庫管理対象
- Shop連携対象
- Mall公開対象
- 商品サイズ、重量、ケースサイズ、ケース重量
- ITFコード
- 価格改定履歴と未来予約
- 得意先別掛率と例外価格

## Shop Models

- shop_products
- shop_sku_variants
- marketplace_listings
- shop_orders
- shop_customers
- shop_collections
- shop_discounts
- shop_inventory_locations

Shop連携:

- Core商品 = 正本。
- Shop商品 = 販売用表現。
- SKU = EC販売単位。
- Yahoo / 楽天 / Amazon向け商品名・説明・カテゴリ・価格・ポイント・出品状態を別管理。

## Mail Models

- mailboxes
- mail_threads
- mail_messages
- mail_attachments
- mail_labels
- mail_templates
- mail_ai_actions
- mail_ai_artifacts
- mail_audit_events
- mail_sender_profiles (planned)
- mail_custom_domains (planned)
- mail_domain_dns_records (planned)
- mail_user_preferences (planned)

Mail URL は `https://mail.aiboux.com`。データ設計上は業務メール、添付、取引先、請求、注文、商品と紐づく。

2026-05-27時点のMail設定UIは、アドレス別表示名/署名と独自ドメイン設定ウィザードをReact state + browser localStorageで保持する。D1永続化、DNS実確認、送信時署名適用APIはTBD。

Mail AI artifact types:

- `classification`: 業務/プライベート判定、信頼度、根拠、Core連携可否。
- `voice_summary`: 読み上げ用の短い要約。
- `speech_reply_draft`: 音声返信メモから補正した返信下書き。送信承認は含まない。

## File Models

- file_transfers
- file_objects
- share_links
- download_events
- conversion_jobs
- barcode_jobs
- cutout_jobs
- abuse_reports
- file_histories

Fileは明示的にアップロードされたファイルを扱う。広告、履歴、再DL、再共有を考慮する。

## Biz Models

- template_categories
- templates
- template_versions
- user_documents
- document_histories
- document_exports
- company_profiles
- favorites
- folders

Bizはテンプレート本文コピー禁止。自社作成テンプレートと履歴保存を管理する。

## Office Models

- office_local_histories
- office_user_history_metadata
- office_tool_usage_events
- office_user_preferences
- office_ads_events

注意:

- ファイル本体は保存しない前提。
- 保存する場合は将来の暗号化保存オプションとしてTBD。
- 編集内容、PDF本文、Excel本文、Word本文の無断ログ送信は禁止。

## 履歴書 Models

- applicant_profiles
- resumes
- career_documents
- resignation_letters
- cover_letters
- education_histories
- job_scan_results
- self_pr_drafts
- applicant_photos
- photo_processing_jobs
- print_photo_layouts
- checklists
- checklist_items
- newsletter_subscriptions
- consent_logs

注意:

- 生年月日、住所、職歴、顔写真など強い個人情報を扱う。
- 保存・削除・同意・メルマガ配信停止のUIとデータを必ず設計する。

## Docs Models

- docs_pages
- docs_sections
- docs_search_index
- docs_feedback

Docs URL は `https://docs.aiboux.com`。
