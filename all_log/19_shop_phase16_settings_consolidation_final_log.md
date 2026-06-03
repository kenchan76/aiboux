# AIBOUX Shop Phase 16 最終完了ログ

作業日: 2026-05-28

## 実装概要

- `/shop/settings` を3タブ構成へ統合しました。
  - `一般・ストア情報`
  - `決済・集客の自動化`
  - `通知・運用履歴`
- 会社名、住所、電話番号、メール、インボイス番号、帳票ロゴを1つのマスター情報として編集するUIへ整理しました。
- 特商法表示、プライバシーポリシー、納品書、請求書、領収書、Stripe連携へ同じマスター情報を自動反映する設計にしました。
- 旧 `/shop/api/settings/documents` は削除し、設定保存の書き込み経路を `/shop/api/settings/profile` に一本化しました。

## ストアURL修正

ユーザー指摘「ストアURLは自動生成やめれよ。おかしいだろ」を受け、以下を修正しました。

- ストアURLは店名から自動生成しません。
- `storeName` をURL生成のフォールバックに使う処理を削除しました。
- ストアURLは必須入力です。
- 未入力保存時は `400 storeUrl is required.` を返します。
- `custom-shop.mall.aiboux.com` または `custom-shop` のような入力から、明示入力された値だけを正規化して `mall_subdomain` に保存します。
- UIに `保存後のURL` プレビューを追加しました。

## データ/API

- `GET /shop/api/settings/profile`
  - `shop_settings` と `shop_document_settings` を読み取り、UI用の統合プロフィールを返します。
- `POST /shop/api/settings/profile`
  - `shop_settings` と `shop_document_settings` をD1 batchで同時更新します。
  - `tokushoho_text` と `privacy_policy_text` はマスター情報から固定テンプレートで再生成します。
  - 通知送信は非ブロッキング化し、通知失敗で設定保存を失敗させないようにしました。
- `storeDescription`
  - UIにもDBにも保存されないノイズだったため、型、state、APIレスポンスから削除しました。

## AI監査

### Cloudflare AI

- 実行済みログ: `all_log/19_phase16_cloudflare_ai_audit.json`
- 主な指摘:
  - tenant IDの検証を追加すること。
  - 通知送信失敗で設定保存をロールバックしないこと。
  - `shop_settings` と `shop_document_settings` の同時更新を明確に保つこと。
- 反映:
  - tenant ID validationを追加。
  - `safeSendProfileNotification()` を追加。
  - 旧documents書き込みルートを削除。

### Grok Build

- 実行済みログ:
  - `all_log/19_phase16_grok_review.md`
  - `all_log/19_phase16_grok_final_review.md`
- 主な指摘:
  - ストアURLを店名から勝手に生成してはいけない。
  - 保存後URLのプレビューが必要。
  - 法務表示が固定テンプレートであることをUIに明記すること。
  - 未永続の `storeDescription` を消すこと。
- 反映:
  - ストアURL必須化。
  - `storeName` fallback削除。
  - URLプレビュー追加。
  - 法務固定テンプレート文言追加。
  - `storeDescription` 完全削除。
- 最終結果:
  - Grok最終確認は `承認`。

## 検証

- `npm run astro check`
  - 0 errors
  - 0 warnings
  - 既存の31 hintsのみ
- ローカルAPI smoke:
  - 空の `storeUrl` で `POST /shop/api/settings/profile` → `400 storeUrl is required.`
  - `custom-shop.mall.aiboux.com` で保存 → success
  - `GET /shop/api/settings/profile?tenant_id=tenant_001` → `storeUrl: custom-shop.mall.aiboux.com`
  - local D1 `shop_settings.mall_subdomain` → `custom-shop`

## 引継ぎ

- `AIBOUX_MASTER_DOCUMENT.md` にPhase 16の内容を追記済み。
- 今後、法務テンプレートの自由編集を許可する場合は、現在の固定テンプレート方針を変更する明示仕様が必要です。
- 本番では同一 `mall_subdomain` の競合チェックを追加してください。
