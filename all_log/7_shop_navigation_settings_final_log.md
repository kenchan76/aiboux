# AIBOUX Shop Navigation And Settings Final Log

実行日時: 2026-05-27 21:55 JST

## 実装概要

- 左サイドバーから「コレクション」「割引」の導線を削除しました。
- 左サイドバーへ「カテゴリー管理」を追加し、`/shop/categories` を新設しました。
- カテゴリー管理画面を追加し、AIBOUX内部カテゴリーと `Google Shopping Category ID` の対応を一覧・インライン編集できるようにしました。
- 設定画面を `基本情報`、`決済`、`法務`、`通知・外部連携` の4タブ構成へ再設計しました。
- 設定保存・通知下書き作成時にSonner toastで結果を明示するようにしました。
- SNS自動投稿の下書きキュー用D1テーブル `shop_social_post_drafts` を追加しました。

## 主な変更ファイル

- `src/data/shop-sample-data.ts`
- `src/components/shop/ShopClientShell.tsx`
- `src/components/shop/categories/ShopCategoryManager.tsx`
- `src/components/shop/ShopSettingsPanel.tsx`
- `src/pages/shop/categories.astro`
- `migrations/0003_shop_phase4.sql`
- `AIBOUX_MASTER_DOCUMENT.md`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`

## D1変更

`migrations/0003_shop_phase4.sql` を作成し、ローカル・リモートの `aiboux-b2b-db` に適用しました。

追加テーブル:

- `shop_social_post_drafts`

主なカラム:

- `id`
- `tenant_id`
- `product_id`
- `platform`
- `post_content`
- `image_keys`
- `status`
- `scheduled_for`
- `created_at`

追加インデックス:

- `idx_shop_social_post_drafts_tenant_status`
- `idx_shop_social_post_drafts_product_platform`

## 検証

- `npx wrangler d1 execute aiboux-b2b-db --local --file=migrations/0003_shop_phase4.sql`: 成功
- `npx wrangler d1 execute aiboux-b2b-db --remote --file=migrations/0003_shop_phase4.sql`: 成功
- `npm run astro check`: エラー0
- `npm run build`: 成功
- `npx wrangler deploy --keep-vars`: 成功
- `https://shop.aiboux.com/shop/categories`: `200 OK`
- `https://shop.aiboux.com/shop/settings`: `200 OK`
- `https://mail.aiboux.com/g/ssn`: `200 OK`
- `shop_social_post_drafts` のリモートD1存在確認: 成功
- `/shop/categories` 初期HTML内の旧メニュー文言確認: `コレクション=0`, `割引=0`

## 自己レビュー

- ShopのUI方針であるLight mode only、白背景、高密度、細い罫線を維持しました。
- コレクション・割引は左サイドバーの主要導線から外し、カテゴリー管理を主導線へ移しました。
- SNS投稿は外部送信せず、下書きキュー基盤だけを追加しています。AI Assistant Rulesの「外部送信は人間承認必須」に適合します。
- カテゴリー管理UIは、現時点ではブラウザローカル保存です。D1永続化APIは未確定のためTBDとして扱います。

## AIからの自発的改善提案 (Proactive Proposals)

- `shop_categories` に `google_category_id`、`google_category_name`、`feed_enabled` を追加し、カテゴリー管理画面をD1永続化へ移行する。
- `shop_social_post_drafts` 用の承認APIを追加し、`pending` から `approved` への遷移だけを人間承認ボタンで実行できるようにする。
- Cloudflare Cron Triggerで `approved` かつ `scheduled_for <= now` のSNS下書きを処理するジョブを追加する。
- SNS連携ごとにOAuth状態、投稿失敗理由、再試行回数を保存する `shop_social_integrations` と `shop_social_post_attempts` を追加する。
- 設定画面の各タブをD1保存APIへ接続し、保存済み/未保存の差分表示を追加する。
