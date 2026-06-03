# AIBOUX Shop Phase 12 修正後再レビュー (Grok Final Review)

**実行日時**: 2026-05-28  
**対象**: 修正適用後コード (`/tmp/grok-aiboux-phase12-final` および `/home/pkkatsu/aiboux/src` 同期版)  
  - Stripe: `onboard.ts`, `status.ts`, `webhook.ts`, `ShopOnboardingWizard.tsx`, `ShopSettingsPanel.tsx`, `shopStripeConnect.ts`  
  - メール: `shop-email-queue.ts`, `shopNotificationEmail.ts`, `worker.ts`, migration `0008_shop_phase12_stripe_email.sql`  
**レビュー観点**: 前回指摘の **apiMode不整合**、**Stripe導線**、**テスト事業者情報の明示**、**Webhook**、**メールキュー再試行/timeout/provider更新** の5点が本当に修正済みか。Cloudflare AI Audit結果およびAIBOUX_MASTER_DOCUMENT.mdとの整合性も確認。  
**分類**: 修正確認 / 残存事項 / 承認可否

---

## 1. 全体サマリー

前回レビュー（`15_phase12_grok_review.md`）で **重大3件 + 要修正6件** とされ「本番投入非推奨」としたPhase 12に対し、指定5項目を中心に修正が適用された。

**良い点（修正確認済み）**:
- apiModeキーの完全統一とStripeオンボーディング導線の明確化（URL自動オープン + ガイダンス + 手動更新ボタン + 有効期限表示）。
- テスト事業者情報のUI上「（テスト用）」明示化。
- `account.updated` Webhookの完全実装（署名検証含む）。
- メールキューの再試行（最大5回・5分バックオフ）、12秒timeout、provider列書き込みの全経路実装。
- Cloudflare AI Audit: `approved_after_fixes`、ローカルsmoke成功（email retry含む）。
- AIBOUX_MASTER_DOCUMENT.md でも「fixes applied」として記録され、ビルド/型チェック通過。

**残存リスク**:
- 実Stripeアカウント作成時に依然としてハードコードのテスト事業者データ（篠原千恵/株式会社雪花）がprefillされる（ユーザーがStripe画面で上書きする必要あり）。
- 事業者情報の実データ反映がUIにない（Stripeから会社名などを再取得しない）。
- メールキューは全テナント横断スキャンのまま、通知履歴の運営者向け可視化UIなし。
- 重複概念（初期ウィザードStep4 vs 決済タブの管理カード）はタブ分離で緩和されたが完全解消ではない。

**結論**: 指定された5項目のブロッカーは**すべて修正済み**。Phase 12の技術的目標（Stripe Connect安全フォールバック + 信頼できるメールキュー）は達成。**承認可**（ただし実運用時はSTRIPE_WEBHOOK_SECRET登録とテスト事業者prefillの注意喚起を必須とする）。

---

## 2. 修正確認項目（ユーザ指定5点）

### 2.1 apiMode不整合（致命的バグ） → **修正済み**

- `onboard.ts:97`: `apiMode: mode` を明示的に返却（従来の `mode` と併記で互換性維持）。
- `status.ts:84`: 従来通り `apiMode: stripeSecret ? "stripe_api" : "mock"`。
- 使用側:
  - `ShopOnboardingWizard.tsx:236-238`: `data.apiMode === "stripe_api" && data.onboardingUrl` で正しくタブオープン。
  - `ShopSettingsPanel.tsx:265-266, 328`: 同一条件でオープン + 「Stripeで入力」リンク表示。
- 影響: 前回の「本番キー設定時でも自動オープンしない」問題は完全解消。両エンドポイントのレスポンス形状が統一された。

### 2.2 Stripe導線（オンボーディング完走率） → **大幅改善・実用レベル到達**

- 両導線でURLオープン実装:
  - ウィザードStep4 `connectStripe()`: 成功時即 `window.open` + `toast.info("Stripeで入力を完了したら...")`。
  - `StripeConnectCard` `startOnboarding()`: 同等処理 + 「状態を更新」ボタン常設。
- 追加導線:
  - `onboardingExpiresAt` / `lastSyncedAt` / `statusNote` をUIに表示（`ShopSettingsPanel.tsx:315-317`）。
  - 「連携情報を更新」ボタンで手動ポーリング可能。
  - `webhook.ts` 実装により `charges_enabled` 変更が非同期即時反映される土台完成。
- ガイダンス文言: 「Stripe画面で入力を完了したら、この画面に戻って状態を更新してください」が複数箇所に明記。
- 残: 完全自動ポーリング/通知は未実装（手動更新 + Webhook依存）。実運用でWebhook URLをStripeダッシュボードに登録する必要あり。

### 2.3 テスト事業者情報の明示 → **修正済み（意図的テストデータとしてラベル付け）**

- `shopStripeConnect.ts:1-8`: `DEFAULT_STRIPE_BUSINESS_DATA` はPhase12 mandatedテストデータとして維持（代表者: 篠原千恵、会社: 株式会社雪花、所在地: 北海道長万部町、dataSource: "phase12_test_mock"）。
- UI明示:
  - `ShopSettingsPanel.tsx:298-300`: ラベルを「代表者（テスト用）」「法人名（テスト用）」「所在地（テスト用）」に変更。フォールバック値も同値。
  - `ShopOnboardingWizard.tsx:393`: Step4説明文で「...を**テスト用事業者情報として**連携準備します。」と明記。
- 影響: 前回の「初心者運営者が自分の情報と勘違いする」リスクは大幅低減。AIBOUX_MASTER_DOCUMENT.mdでも「explicitly presented as test data」と位置づけ。
- 残: 実`STRIPE_SECRET_KEY`使用時もアカウント作成APIでこのデータがprefillされる（`onboard.ts:113-121`）。Stripeオンボーディング画面でユーザーが修正する運用になるため、Phase12としては許容（次Phaseでユーザー入力値反映を推奨）。

### 2.4 Webhook → **新規完全実装・修正済み**

- `src/pages/shop/api/stripe/webhook.ts` 新規追加:
  - `STRIPE_WEBHOOK_SECRET` 未設定時は即503で安全拒否。
  - 手動HMAC-SHA256 + timing-safe比較による署名検証（`verifyStripeSignature`）。
  - `account.updated` のみ処理。`charges_enabled`/`payouts_enabled`/`disabled_reason` から `active`/`restricted`/`pending` を導出してD1更新。
  - テナント横断更新（`WHERE stripe_account_id = ?`）で正しいアカウントのみ反映。
- 関連:
  - `status.ts` のポーリングは残存するが、Webhook到着で即時更新される設計。
  - Cloudflare Audit: "Webhook route refuses mutation unless ... signature validation succeeds." でpass。
- 運用注意: Stripeダッシュボードで「Connect」webhookとして本番URL（`https://.../shop/api/stripe/webhook`）を登録し、secretをenvに設定する必要あり（コード側は準備完了）。

### 2.5 メールキュー再試行/timeout/provider更新 → **全要件実装済み**

- `shop-email-queue.ts` 主要変更:
  - **再試行**: `WHERE ... OR (delivery_status = 'failed' AND COALESCE(delivery_attempts,0) < 5 AND COALESCE(last_attempt_at,0) <= ?)` で5分バックオフ再キュー（`RETRY_DELAY_MS = 5*60*1000`, `MAX_ATTEMPTS=5`）。
  - **timeout**: `deliverEmail` 内で `AbortController` + `RESEND_TIMEOUT_MS=12000` をfetchに適用（`.finally(clearTimeout)` で確実解放）。
  - **provider更新**: 成功/失敗両UPDATEで `provider = 'resend'` を明示書き込み。
  - 初回キュー（`shopNotificationEmail.ts` の `queueFallbackNotification`）はmigration DEFAULTに依存するが、worker処理時に全項目が設定される。
- その他:
  - `worker.ts` のscheduledは3タスク完全分離try/catch。
  - スモーク結果（Audit）: `scanned=1, sent=1, failed=0, mocked=1` でリトライ経路確認済み。
- 残: 全テナント横断スキャン継続（`tenant_id` フィルタなし）、古いログのretention/purge未実装、運営者向け「通知履歴」画面未提供。これらはPhase 11からの既知事項で、Phase12の「再試行/timeout/provider」要件自体は満たす。

---

## 3. その他の確認事項（前回レビューとの差分）

| 項目 | 前回状態 | 修正後状態 | 評価 |
|------|----------|------------|------|
| Stripeエラーメッセージ | 生英語露出リスク | `stripeErrorMessage()` で日本語化（timeout/fetch含む） | 改善 |
| ウィザードStep4導線 | URLオープン未対応 | apiMode条件で即オープン + ガイダンス | 修正済み |
| 重複UI | basicタブにCard+Wizard同居 | 基本タブ=Wizard、決済タブ=専用Card（タブ分離） | 緩和 |
| D1トランザクション | 非アトミック | 変更なし（Stripe APIとの整合はbest-effort） | 受容 |
| メールログ可視性 | ゼロ | 変更なし（内部テーブル） | 次Phase推奨 |
| 事業者実データ反映 | 常時テストデータ表示 | 変更なし（status取得で会社名未同期） | 次Phase推奨 |

- ビルド/型: `npm run astro check` 0エラー、`npm run build` 成功（MASTER DOCUMENT記載）。
- セキュリティ: Webhook署名検証、idempotency-key、fetch timeoutは適切。`STRIPE_WEBHOOK_SECRET` 必須化で誤動作防止。
- テスト容易性: メールキューは純粋関数寄りでsmoke容易。Stripeはモックでカバー。

---

## 4. 推奨アクション（優先度順）

**即時 (運用前)**:
1. Stripeダッシュボードで本番Webhook URL登録 + `STRIPE_WEBHOOK_SECRET` 設定。
2. `STRIPE_SECRET_KEY` / `RESEND_API_KEY` 設定時は必ずテストモードでオンボーディング完走確認。
3. テスト事業者prefillの挙動を運営者向けドキュメントに追記（「初回はテスト用データが表示されますが、Stripe画面でご自身の情報に修正してください」）。

**次Phase (P1)**:
- ユーザー入力事業者情報をStripeアカウント作成時に使用（または空で作成してonboardingで入力誘導）。
- Stripe retrieveで実 `company.name` 等を取得し、UIのbusinessDataを更新。
- メール通知履歴簡易一覧（配信状況・再試行回数）をショップ設定 > 通知タブに追加。
- 古い `shop_email_notification_logs` の自動パージ（retention 30日など）。
- ウィザード途中保存（draft）。

**長期**:
- Webhook到着時のServer-Sent Events / ポーリングUI自動更新。
- テナント別キュー処理（D1シャーディングまたはWHERE tenant_id追加 + 並列化）。

---

## 5. 最終判断

**Phase 12は承認可**。

前回ブロッカーであった5項目（apiMode不整合、Stripe導線、テスト事業者明示、Webhook、メールキュー再試行/timeout/provider）はすべてコード上で修正・実装済みである。Cloudflare AI Auditも「approved_after_fixes」、ローカルsmokeも成功、MASTER DOCUMENTに修正記録あり。

実運用投入に際しては「テスト事業者データのprefill挙動」と「Webhook secretのダッシュボード登録」を運用手順として明文化すれば、初心者ショップ運営者でも安全にStripe連携を開始できる水準に到達したと判断する。

**承認**。  
次Phaseで事業者情報実データ同期と通知可視化を強化することを強く推奨する。

---

*本レビューは静的コード解析、AIBOUX_MASTER_DOCUMENT.md、Cloudflare AI Audit結果、および過去Phaseの文脈に基づく。実際の本番D1 + Stripe本番モード + Resend実送信での手動E2Eスモークは別途必須。*