# AIBOUX Shop Phase 17 最終完了ログ

作業日: 2026-05-28

## 実装概要

- Shop全域の用語を `カテゴリ` に統一しました。
- 商品、注文、在庫、顧客、カテゴリ、設定のテーブル表示で横方向のはみ出しをクリップせず、横スクロールできるように調整しました。
- ストアURLのサブドメイン競合チェックを実装しました。
- 注文詳細にキャンセル・返金処理フローを追加しました。
- SNS/LINEの投稿タイミング・テンプレート設定と投稿履歴を設定画面に追加しました。
- SNS公開後の `posted_url` 保存に対応しました。

## D1 / マイグレーション

追加ファイル:

- `migrations/0012_shop_phase17_operations_social.sql`

追加・変更内容:

- `shop_settings.mall_subdomain` のアクティブ・非空値にユニークインデックスを追加。
- `shop_social_post_drafts.posted_url` を追加。
- `shop_social_settings` を追加。
- `shop_order_operation_logs` を追加。
- SNS投稿履歴と注文操作ログ用のインデックスを追加。

適用状況:

- local D1: 適用済み
- remote D1 `aiboux-b2b-db`: 適用済み

## API

### ストアURL競合

- `POST /shop/api/settings/profile`
- 他テナントが同じ `mall_subdomain` を使用している場合、`409` と明確な日本語エラーを返します。

### 注文キャンセル・返金

- `POST /shop/api/orders/cancel-refund`
- 実装内容:
  - 注文ID、返金額、理由、注文商品を受け取る。
  - D1に対象注文があれば `b2b_orders.status = canceled` へ更新。
  - 対象商品がD1に存在すれば `core_products.stock_quantity` を戻す。
  - 操作内容を `shop_order_operation_logs` に記録。
  - Stripe決済IDが未保存の場合は、外部返金を実行せず安全なモック返金として記録。

### SNS/LINE

- `GET/POST /shop/api/settings/social`
- `GET /shop/api/social/history`
- `shop-social-cron` は投稿完了時に `posted_url` を保存します。

## UI

- `ShopOrderDetailPage.tsx`
  - キャンセル・返金ダイアログを追加。
  - 返金予定額、在庫戻し対象、処理後ステータス、理由入力、実行中ローディングを表示。
- `ShopRecentOrders.tsx`
  - 死にボタンだった `キャンセルする` を廃止。
  - `キャンセル・返金処理` として注文詳細へ遷移する導線に修正。
- `ShopSettingsPanel.tsx`
  - SNS/LINE連携カードを追加。
  - 投稿タイミングトグル、X/Instagram/LINEテンプレート、投稿履歴、投稿URLリンクを表示。
- 各一覧テーブル
  - 横スクロール対応を明示。
  - `カテゴリ` 表記へ統一。

## Tripartite AI Workflow

### Cloudflare AI

- ログ: `all_log/20_phase17_cloudflare_ai_audit.json`
- 確認観点:
  - D1ユニークインデックス
  - 注文キャンセル時の在庫戻し
  - Stripe返金の安全性
  - SNS履歴と `posted_url`
- 結果:
  - 概ね妥当。
  - 外部返金は決済IDが揃うまで安全なモック扱いにする方針を維持。

### Grok Build

- 初回ログ: `all_log/20_phase17_grok_review.md`
- 最終ログ: `all_log/20_phase17_grok_final_review.md`
- 初回指摘:
  - テーブルのoverflowリスク。
  - 注文一覧のキャンセルメニューが未接続。
  - `分類` と `カテゴリ` の用語揺れ。
  - SNS/LINE UIのレビュー範囲不足。
- 反映:
  - テーブル外枠を横スクロール可能に修正。
  - 注文一覧のメニューを注文詳細のキャンセル・返金へ接続。
  - Shopカテゴリ関連表記を `カテゴリ` に統一。
  - SNS/LINEカードの完全な範囲で再レビュー。
- 最終結果:
  - `承認`

## 検証

- `npm run astro check`
  - 0 errors
  - 0 warnings
  - 既存の31 hintsのみ
- `npm run build`
  - 成功
- ローカルAPI smoke:
  - SNS/LINE設定保存: 成功
  - SNS投稿履歴取得: 成功
  - 注文キャンセル・返金API: 成功
  - ストアURL競合: `409` を確認
- `rg`
  - Shop source内に `カテゴリー` が残っていないことを確認

## 残タスク

- Stripeの実返金は、Shop注文に `payment_intent` または `charge` IDを保存してから有効化する。
- `shop_order_operation_logs` の管理画面を追加する。
- X/Instagram/LINE本番API接続後、実投稿URLを各プロバイダから保存する。
