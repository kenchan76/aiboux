# AIBOUX Shop Phase 12 Grok Review

**実行日時**: 2026-05-28  
**対象**: Stripe連携UI/API (`/shop/api/stripe/*`, `ShopOnboardingWizard`, `StripeConnectCard`)、メールキュー (`shop-email-queue.ts`, `shopNotificationEmail.ts`)、関連D1スキーマ・Cloudflare Workers実装  
**レビュー観点**: Stripe連携UI/API、メールキュー、初心者UX、ローディング、状態表示、エラー文言、Cloudflare/D1  
**分類**: 重大 / 要修正 / 軽微

---

## 1. 全体サマリー

Phase 12は「Stripe Connect Expressによる販売者決済受付」と「Cloudflare Emailフォールバック→Resendキュー処理」の2本柱。

- **良い点**: モック/本番のgraceful degradationが明確 (`STRIPE_SECRET_KEY` / `RESEND_API_KEY` 未設定時に安全にフォールバック)。cron scheduled handlerでのタスク分離は良好。D1への状態永続化と `ensureShopSettingsRow` の冪等INSERTは実用的。
- **深刻な問題**: APIレスポンス形状の不整合、テスト用事業者情報の本番露出、Stripe状態同期のWebhook不在、メールキューの再試行・可視性ゼロ、ウィザードと設定カードのStripe UI重複。これらは「初心者ショップ運営者が一人で完走できない」「本番で決済が有効化されない」レベルのブロッカー。

**結論**: Phase 12は「動くデモ」としては成立するが、**重大3件 + 要修正6件**の修正なしに本番投入は推奨しない。特にStripeの状態管理と初心者向け文言/ガイダンスはPhase 9-11の「R2露出」反省を踏襲できていない。

---

## 2. Stripe連携UI/API

### 重大

1. **APIレスポンスキー不整合 (致命的バグ)**  
   - [src/pages/shop/api/stripe/onboard.ts:91-100](/home/pkkatsu/aiboux/src/pages/shop/api/stripe/onboard.ts)  
     返却: `{ success: true, mode, state, accountId, onboardingUrl, ... }` （`mode`）
   - [src/pages/shop/api/stripe/status.ts:82](/home/pkkatsu/aiboux/src/pages/shop/api/stripe/status.ts)  
     返却: `{ ..., apiMode: stripeSecret ? "stripe_api" : "mock" }`
   - 使用側:
     - [src/components/shop/onboarding/ShopOnboardingWizard.tsx:234](/home/pkkatsu/aiboux/src/components/shop/onboarding/ShopOnboardingWizard.tsx) `data.apiMode === "mock"`
     - [src/components/shop/ShopSettingsPanel.tsx:264-266](/home/pkkatsu/aiboux/src/components/shop/ShopSettingsPanel.tsx) `if (data.apiMode === "stripe_api" && data.onboardingUrl) { window.open(...) }`
   - **影響**: 本番Stripeキー設定時でも `apiMode` が未定義のため自動タブオープンせず。ユーザーは「連携を開始」→ 何も起きない → 手動でStripe画面に行けない。オンボーディング完走率が激減。

2. **Stripe Connect状態のWebhook不在 + ポーリング依存**  
   - 状態更新は `GET /shop/api/stripe/status` の手動リフレッシュまたはページロード時のみ ([status.ts:53-69](/home/pkkatsu/aiboux/src/pages/shop/api/stripe/status.ts))。
   - `charges_enabled` / `payouts_enabled` がtrueになるまでStripe側で数時間〜1日かかるケースがあるが、UIに自動同期・通知・再ポーリングの仕組みが一切ない。
   - 結果: 「決済連携を開始」→ pendingのまま放置 → 購入者がカード決済できない状態が長期間継続。

3. **テスト用事業者情報の本番露出 (初心者UX破壊)**  
   - [src/lib/server/shopStripeConnect.ts:1-7](/home/pkkatsu/aiboux/src/lib/server/shopStripeConnect.ts) `DEFAULT_STRIPE_BUSINESS_DATA` が「篠原 千恵 / 株式会社雪花 / 北海道長万部町」。
   - これが [ShopSettingsPanel.tsx:277-281](/home/pkkatsu/aiboux/src/components/shop/ShopSettingsPanel.tsx) のfallbackとウィザードStep4説明文 ([onboarding/ShopOnboardingWizard.tsx:387](/home/pkkatsu/aiboux/src/components/shop/onboarding/ShopOnboardingWizard.tsx)) に直接表示される。
   - 初心者運営者は「自分の情報が勝手に入ってる？」「この会社名で本当にいいの？」と即座に混乱・不信。

### 要修正

1. **ウィザードStep4とStripeConnectCardの完全重複**  
   - `basic` タブに `<StripeConnectCard compact />` + `<ShopOnboardingWizard />` が同居し、ウィザード内部にもStep4で簡易Stripe UIが存在。
   - 状態管理が2系統 (ウィザード内local state vs Cardの `useEffect` + `loadStatus`) で同期されない。ユーザーがどちらを信じればいいのかわからない。

2. **オンボーディングURLの有効期限表示・再生成導線なし**  
   - `onboardingExpiresAt` を取得しているがUIどこにも表示されない。期限切れリンクを踏んだ場合の「もう一度連携を開始」体験が悪い。

3. **Wizard内の `connectStripe` がURLオープン未対応**  
   - ウィザードStep4の「決済連携を開始」ボタンはonboard成功しても `onboardingUrl` を開かない (Card側のみ実装)。Step4完走ユーザーは置き去り。

4. **Stripeアカウント作成時のエラーハンドリングが不十分**  
   - `createStripeAccount` / `createStripeAccountLink` で発生したStripeエラー (例: 事業者情報不足、country不整合) が生の英語で `productError` → トーストに露出する可能性大。

### 軽微

- `ensureShopSettingsRow` が `/status` と `/onboard` の両方で無条件に呼ばれる (D1往復2回)。初回のみで十分。
- `stripe_connect_status` 旧列のCHECK制約がPhase 1の `('not_connected','pending','connected')` のまま残存。新stateの `restricted` / `active` と不整合。
- `businessData` は常にデフォルト値で、Stripeから取得した本物の `company.name` や代表者情報を反映しない。

---

## 3. メールキュー (shop-email-queue.ts + 通知フォールバック)

### 要修正

1. **再試行ロジック完全不在**  
   - `delivery_status = 'failed'` に落ちた行は二度と処理されない ([shop-email-queue.ts:69-77](/home/pkkatsu/aiboux/src/workers/shop-email-queue.ts))。
   - `delivery_attempts` 列は存在するが、バックオフ・再キュー・最大試行回数超過時のdead-letter処理が一切実装されていない。
   - 1分cronでBATCH_LIMIT=20件のみ。大量メール (例: セール通知) 時に取りこぼし確定。

2. **全テナント横断スキャン**  
   - `WHERE delivery_status = 'queued' ORDER BY created_at ASC LIMIT 20` に `tenant_id` フィルタなし。
   - 1テナントが大量キューを詰まらせると他テナントの通知遅延が発生。マルチテナントD1としては隔離不足。

3. **キュー内容のエンドユーザー可視性ゼロ**  
   - ショップ運営者は「通知が届いたかどうか」を管理画面で確認できない。`shop_email_notification_logs` は内部テーブル扱い。
   - Phase 11で「Cloudflare Email失敗時にqueued」とログに残る設計にしたが、運営者にその事実を伝えていない。

4. **provider列が死んでいる**  
   - migration 0008で `provider TEXT NOT NULL DEFAULT 'resend'` を追加したが、INSERT/UPDATEのどこにも書き込まれていない。将来Resend以外 (SendGrid等) に拡張する際の足枷。

### 軽微

- `runShopEmailQueue` がcronで毎分呼ばれるが、処理時間・レート制限のログが `scanned/sent/failed/mocked` の数値のみ。Resend 429/5xx時の詳細がconsole.warnにしか残らない。
- キュー処理中にResend APIが一時的障害の場合、即failed落ち。指数バックオフすらなし。

---

## 4. 初心者UX / ローディング / 状態表示

### 要修正

1. **ウィザード内郵便番号入力の即時APIコール (debounceなし)**  
   - [ShopOnboardingWizard.tsx:341](/home/pkkatsu/aiboux/src/components/shop/onboarding/ShopOnboardingWizard.tsx) `onChange={(event) => lookupZipcode(event.target.value)}`
   - 7桁以外はreturnするが、ユーザーが「100-0001」とハイフン入力するたびにnormalize→fetch試行が発生。体感遅延と無駄D1/外部コール。

2. **保存系UIのローディング・成功状態が不統一**  
   - `ShopSettingsPanel` 内の大多数のカード (`LabeledInput`, `SettingCheck`, `LegalEditor`) は `onClick={() => save("xxx")}` で **本物のfetchを一切行わず** ただの `toast.success`。
   - DocumentSettingsCardのみ本当のPOSTを実装。ユーザーは「保存したつもり」が実際には保存されていないカードが多数存在する。

3. **Stripe状態表示の情報不足**  
   - `lastSyncedAt`、`statusNote` (disabled_reason) を取得しているが、UIに一切表示されない。
   - 「確認中」のユーザーは「あとどれくらいで完了するのか」「何を待っているのか」がわからない。

4. **オンボーディングウィザードの途中保存・再開不能**  
   - Step1〜3で入力した内容はlocal stateのみ。ブラウザリロードや離脱で全消失。Phase 1レビューですでに指摘済みの改善点が未反映。

### 軽微

- Progressバーとステップクリックジャンプは可能だが、Step間バリデーション (郵便番号7桁必須など) がない。
- 法人候補検索で0件時「手入力で続行できます」とtoastが出るが、視覚的に候補エリアが消えるだけでガイダンス弱い。
- `StatusPanel` の行が `truncate` されていて長い住所が切れる。

---

## 5. エラー文言

### 要修正

1. **Stripeエラーの生英語露出リスク**  
   - `createStripeAccount` 失敗時 `throw new Error(data.error?.message || "Stripe account creation failed.")`  
   - これが `productError` → `{ success: false, error: "..." }` としてトーストに直撃する ([productMasterApi.ts:33](/home/pkkatsu/aiboux/src/lib/server/productMasterApi.ts))。
   - 日本語ネイティブ初心者には「Stripe account creation failed.」がそのまま表示される。

2. **汎用すぎるエラートースト**  
   - 「Stripe連携を開始できませんでした」「Shop初期設定を保存できませんでした」など原因不明のメッセージばかり。
   - 具体的な原因 (ネットワーク、validation、Stripe側制限、D1書き込み失敗) をユーザーに伝えていない。

3. **productErrorのフォールバック文言が英語**  
   - 未捕捉エラー → "Product master API failed." (英)

### 軽微

- メールキュー側のエラーは `message.slice(0, 500)` で保存されるが、Resendの `error.message` が英語のままD1に残る。

---

## 6. Cloudflare / D1 特有の問題

### 要修正

1. **D1クエリのトランザクション不在**  
   - onboard.ts: SELECT → (Stripe API) → UPDATE の一連が非アトミック。稀に二重アカウント作成リスク。
   - status.tsのremote fetch成功後のUPDATEも同様。

2. **cron全体の耐障害性は良いが、個別処理のタイムアウト制御なし**  
   - `scheduled` 内の各 `runShopEmailQueue` はtry/catchされているが、fetch (Stripe/Resend) にAbortController/timeoutがない。1回のcronが30秒以上かかるとWorkersのCPU制限に抵触する可能性。

3. **shop_email_notification_logs の成長に上限・パージなし**  
   - `sent` / `failed` の古い行が永遠に残る。Phase 11のR2 retentionポリシーの思想がメールログに適用されていない。

### 軽微

- `PRAGMA table_info` で列存在確認する一時監査ページが存在するが、本番で不要。
- メールキューindex `idx_shop_email_notification_logs_queue` が `(delivery_status, created_at)` で `tenant_id` を含まない。テナント別統計クエリ時にフルスキャン誘発の可能性。
- `ensureShopSettingsRow` の `ON CONFLICT DO NOTHING` は良いが、毎リクエスト呼ばれるコストを考慮すると「初回ログイン時のみ」トリガーに移行すべき。

---

## 7. その他の観察 (参考)

- **セキュリティ**: `idempotency-key: row.id` をResendに渡しているのは正しい。Stripe側もConnectアカウント作成はテナント1:1で保持されている。
- **Phase 11反省の反映度**: R2キー露出は今回の新コードではほぼ発生していない (DocumentSettingsCardの成功表示は適切)。ただしStripeの「テスト会社名」露出は同等の初心者UX破壊。
- **テスト容易性**: `runShopEmailQueue` は純粋関数に近く、単体テストしやすい。Stripe側はfetchモックが必要。
- **未使用コード**: ウィザード内の `stripeConnected` stateと保存時の送信値はonboarding APIで完全に無視されている。

---

## 8. 推奨修正優先順位

**即時 (P0)**:
1. onboard/statusのレスポンスキーを `apiMode` に統一 (statusに合わせる)。
2. DEFAULT_STRIPE_BUSINESS_DATAを「未設定」またはユーザー入力値に置き換え。ハードコード完全排除。
3. StripeConnectCardのオンボーディング開始後に「Stripeタブで入力を完了したら、この画面に戻って「状態を更新」を押してください」の明確ガイダンスを追加。

**次点 (P1)**:
4. メールキューの再試行 (最大5回 + 指数バックオフ) + `failed` → `queued` 再投入ロジック。
5. ウィザードのStripeセクションを廃止 or Cardと完全統合。
6. キュー内容の簡易一覧 (管理者のみ) を `/shop/settings` の通知タブに追加。

**長期**:
- Stripe Connect webhook (`account.updated`) を受けて即時状態更新。
- ウィザード途中保存 (draft API)。
- メールログのretention + 運営者向け通知履歴画面。

---

**最終判断**:  
Phase 12の技術的骨子は正しい方向だが、**「実店舗の非エンジニアが迷わず完走できるか」**というAIBOUXの最重要UX基準に照らすと、重大問題が3件残っており現時点では承認できません。

修正後に再レビューを推奨します。

---
*本レビューは静的コード解析と過去Phaseの文脈に基づく。実際の動作検証 (wrangler dev + 本番D1 + Stripe test mode) は別途人間による手動スモークを必須とする。*