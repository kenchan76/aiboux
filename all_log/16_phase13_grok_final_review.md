# AIBOUX Shop Phase 13 最終レビュー（修正後）

**実行日時**: 2026-05-28  
**レビューア**: Grok 4.3 (xAI)  
**対象**: Phase 13 実装一式（通知履歴テーブル + Stripe実事業者データ反映 + 関連API/ワーカー/UI修正）  
**前回レビュー**: [16_phase13_grok_review.md](/home/pkkatsu/aiboux/all_log/16_phase13_grok_review.md)  
**検証対象ファイル**（修正後）:
- `/home/pkkatsu/aiboux/src/components/shop/ShopSettingsPanel.tsx` (EmailNotificationHistory, friendlyEmailError, formatDateTime, StripeConnectCard, StatusLine)
- `/home/pkkatsu/aiboux/src/lib/server/shopStripeConnect.ts` (DEFAULT_STRIPE_BUSINESS_DATA, getStripeBusinessData)
- `/home/pkkatsu/aiboux/src/pages/shop/api/stripe/onboard.ts` (dataSourceガード)
- `/home/pkkatsu/aiboux/src/pages/shop/api/stripe/status.ts`
- `/home/pkkatsu/aiboux/src/pages/shop/api/notifications/email-logs.ts`
- `/home/pkkatsu/aiboux/src/workers/shop-email-queue.ts`
- 関連: `shopNotificationEmail.ts`, `productMasterApi.ts` (productError), StatusBadges.tsx

**レビュー観点**:
- 前回指摘の**重大2件**が完全に解消されているか
- ユーザー指定「追加修正」4点が実装・反映されているか
- EC初心者（非エンジニア店舗運営者）が「自分の事業情報が安全に扱われ、通知が信頼できる」と安心できる水準か
- 商用SaaS体裁としてPhase 12反省を正しく引き継いでいるか

---

## 1. 全体サマリー（修正後）

**前回結論**: 重大2件（雪花プレースホルダー露出 + 生エラー文言）により**承認不可**。P0修正を必須と指摘。

**修正後の評価**: 
- 重大2件 **完全解消**。
- 指定された追加修正4点 **すべて実装済み**。
- 通知履歴の操作性・視認性、Stripe未設定時の安全ガード、SNS/LINEのフェイク排除により、**EC初心者向け信頼性**がPhase 12反省レベルまで回復。
- 残る軽微なpolish項目（テーブル横スクロール明示、バッジ共有化、詳細モーダル）は存在するが、**即時ブロッカーではなく次Phase以降で十分対応可能**。

**結論**: **承認可**（本番投入推奨）。

---

## 2. 前回重大問題の検証結果

### 重大1: Stripe事業者情報の「株式会社雪花」プレースホルダー表示（Phase 12反省の不履行）

**検証結果**: **完全解消**。

- `DEFAULT_STRIPE_BUSINESS_DATA`（shopStripeConnect.ts:1-12）がすべて空文字 + `dataSource: "phase13_failsafe_mock"` に変更。実在法人名は一切残存せず。
- `getStripeBusinessData`（同:104-147）: `hasRealData = Boolean(firstText(document_business_name, ...))` で判定し、非実データ時は `dataSource: "phase13_failsafe_mock"` を返す。
- UI（ShopSettingsPanel.tsx:458, 473-475, 490）:
  - `businessLabelSuffix = "（未設定）"`
  - 値未設定時は「帳票・書類設定で入力してください」
  - 専用amber警告: 「事業者情報が未設定のため、Stripe連携はまだ開始しません。先に帳票・書類設定を保存してください。」
- **最重要**: onboard.ts:56-59 で `if (businessData.dataSource !== "shop_settings") { ... 実Stripe API呼び出しを一切行わず、mock account + 警告URLのみ生成 }`。status.ts:56 でも実アカウント照会は `!acct_mock_` の場合のみ。
- 結果: 未設定状態で「自分の事業者名が勝手に使われるのでは」という疑念が完全に排除された。

**判定**: 重大問題 **解決**。

---

### 重大2: `friendlyEmailError` のフォールバックで生の技術エラー文言が露出

**検証結果**: **完全解消**。

- 旧コード: `return value;`（生エラー漏洩）
- 新コード（ShopSettingsPanel.tsx:384-391）:
  ```ts
  function friendlyEmailError(value: string): string {
    if (value.includes("mock_send_without_resend_api_key")) return "...";
    if (value.includes("internal server error")) return "...";
    if (value.includes("timeout") || value.includes("aborted")) return "...";
    if (value.includes("Invalid") || value.includes("email address")) return "...";
    if (value.includes("rate") || value.includes("limit") || value.includes("429")) return "...";
    return "通知送信で確認が必要です。設定内容を確認し、解決しない場合はサポートへお問い合わせください。";
  }
  ```
- 未知エラー・Resend 4xx/5xx詳細・Cloudflare bindingエラーなどは**すべて日本語の安全文言に隠蔽**。
- 保存側（shop-email-queue.ts:87, shopNotificationEmail.ts:61）は `message.slice(0,500)` のまま（ログ用途のため許容）だが、**表示経路はUIのfriendlyEmailError一択**。
- 呼び出し元（documents.ts / products/save.ts）の `notification` オブジェクトにraw warningが含まれる場合もあるが、フロントエンド（saveDocuments, saveProduct）は `success/error` のみ参照し、rawをtoastや画面に露出しない。

**判定**: 重大問題 **解決**（Phase 12の「生英語エラー露出」反省を正しく反映）。

---

## 3. 追加修正4点の確認結果

| 項目 | 実装場所 | 内容 | 状態 |
|------|----------|------|------|
| 未設定時はStripe実連携を開始せず未設定表示 | onboard.ts:56-59, status.ts:56, ShopSettingsPanel.tsx:489-490 | dataSource !== "shop_settings" ガード + 専用amber文言 + mock遷移 | ✅ |
| friendlyEmailErrorは未知エラーを隠蔽 | ShopSettingsPanel.tsx:390 | 末尾returnで常に日本語フォールバック | ✅ |
| 通知履歴フィルタ | ShopSettingsPanel.tsx:265,288-293,311-327 | 4ボタン（すべて/対応中/送信済み/要確認） + 状態別フィルタロジック | ✅ |
| 年付き日時表示 | ShopSettingsPanel.tsx:393-401 | `toLocaleString` に `year: "numeric"` 追加 | ✅ |
| 5回中表示 | ShopSettingsPanel.tsx:366 | `{attempts || 0}/5回` | ✅ |
| SNS/LINEは準備中disabled | ShopSettingsPanel.tsx:166-198 | 「準備中」Badge + 説明文 + `disabled` Button + 「本接続後に有効化」 | ✅ |

すべてユーザー指定通り実装済み。

---

## 4. 要修正・軽微項目の再評価（Phase 13スコープ内）

### 改善済み（前回要修正のうち解消）
- SNS/LINEフェイク混在 → 明確な「準備中」disabled表示で混乱防止。
- 日時曖昧・試行回数視認性 → 年付き + N/5回 で解決。
- 通知履歴フィルタ・操作性 → 4種フィルタ追加で最低限の絞り込み可能。

### 残存するがブロッカーではない軽微項目
- **テーブルレイアウト**: `<Table>` に明示的な `overflow-x-auto` ラッパーなし。`max-w-[520px]` + `whitespace-normal` で内容は折り返すが、極狭画面でヘッダー固定幅（140px/90px）が圧迫する可能性。管理画面想定では許容範囲。
- **バッジ一貫性**: EmailStatusBadgeは専用実装（border + 色トーン）。StatusBadges.tsxの `StatusBadge`（outline, text-[10px]）とは微妙に異なるが、semantic値が異なるため問題小。text-xsは過去指摘より改善。
- **エラー詳細表示**: 失敗行の全文/コピー/再送導線なし。friendlyで十分隠蔽されているため、Phase13としては優先度低。
- **空状態の具体例**: 「帳票設定の保存、商品公開...」と記載はあるが、「例: 公開時に購入者へ送られるメールの件名」など具体例追加が望ましい（将来）。
- **productErrorの一般漏洩**: 未知エラー時に `.message` がJSONで返るケースは存在（lib/server/productMasterApi.ts:33）。ただしPhase13対象のStripe/emailパスは `stripeErrorMessage` / トースト用日本語で防御済み。別途全体ガード強化推奨。

これらは「商用 polish として望ましい」レベルで、**信頼性・初心者安心を損なうものではない**。

---

## 5. 良い点（素直に評価、継続）

- 通知履歴を「integrations」タブ最上部に配置した優先順位は正しい。
- `dataSource` による条件分岐と警告文の出し分けが一貫しており、Phase 12の「安全な仮情報」思想を正しく進化させた。
- Stripe未設定時の「まだ開始しません」という積極的な安全表明は、EC運営者の不安を直接的に取り除く好設計。
- ワーカー側の `MAX_ATTEMPTS=5` とUIの `/5回` 表示の整合が取れており、dead-letter的な「要確認」状態が明確。
- 全体として「形だけ実装」から「信頼できる体験」へ移行した。

---

## 6. 最終判断

**Phase 13は承認可**。

### 理由（優先度順）
1. **前回重大2件が完全に解消**された（雪花完全排除 + 生エラー完全隠蔽）。
2. **指定追加修正4点すべて実装**され、UI/バックエンドの安全ガードが機能している。
3. 通知履歴の可視性向上（フィルタ・年日時・試行回数上限）と、SNS/LINEのフェイク排除により、**同一画面内での信頼性一貫性**が確保された。
4. 未設定時のStripe実連携抑止は、Phase 12で最も問題視された「事業者情報誤解リスク」を根本から塞ぐ好事例。
5. 残存軽微項目は運用上・信頼性上のブロッカーではなく、次Phaseのpolishで対応可能。

**本番投入を推奨**。Phase 12最終レビューで指摘された「EC初心者に優しいAIBOUX Shop」というブランド約束を、Phase 13でようやく具体的に果たせた。

---

## 7. 次Phaseへの推奨（任意・優先度低）

P1（強く推奨）
- 通知履歴テーブルに `overflow-x-auto` ラッパー追加 + 失敗行クリックで簡易モーダル（全文 + サポート連絡ボタン）。
- 空状態に「記録される通知の具体例（公開時/帳票保存時/在庫閾値）」を2-3行追加。
- 一般APIエラーの漏洩防止のため、productErrorに `isProduction ? "システムエラーが発生しました" : message` のような環境別マッピングを検討。

P2（将来）
- StatusBadge共有化 or EmailStatusBadgeをトーン系に寄せる。
- メール履歴のCSVエクスポートや30日 retention 明示。
- 通知失敗時の「この設定で再送を試す」導線（将来的な再送API実装時）。

---

## 8. 補足・検証メモ

- 静的コード解析 + 前回レビューとの差分比較により検証。実際のE2E（RESEND_API_KEY未設定 / STRIPE_SECRET_KEY未設定 / 複数失敗メール投入 / 帳票未保存 → Stripeオンボード抑止）は**手動スモークを強く推奨**。
- Cloudflare AI Audit（16_phase13）はD1/API負荷観点で概ね良好。トランザクション強化の指摘は運用監視でカバー可能。
- 16_phase13_grok_review.md の「このままではブランド約束を果たせていない」という指摘は、今回の修正で**解消**された。

**Phase 13 最終レビュー完了。承認。**

---
*出力先: /home/pkkatsu/aiboux/all_log/16_phase13_grok_final_review.md*
