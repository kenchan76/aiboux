# AIBOUX Shop Phase 13 Grok UX/UI レビュー

**実行日時**: 2026-05-28  
**対象**: `ShopSettingsPanel.tsx` のメール通知履歴テーブル (`EmailNotificationHistory`)、ステータスバッジ (`EmailStatusBadge` / `stripeStateBadge`)、エラー文言 (`friendlyEmailError` ほか)、Stripe実事業者情報表示 (`StripeConnectCard` + `getStripeBusinessData`)  
**レビュー観点**: 
- EC初心者（実店舗運営者・非エンジニア）が一人で迷わず理解・操作できるか
- 商用SaaS/ECサービスとして「信頼できる」「違和感がない」水準か
- Phase 12の反省（テスト事業者情報露出・エラー生英語・通知可視性ゼロ）を正しく引き継いでいるか
**分類**: 重大 / 要修正 / 軽微 / 承認可否（厳格判定）

---

## 1. 全体サマリー

Phase 13は「Phase 12最終レビューで次Phase推奨された2点（メール通知履歴の運営者向け可視化 + 事業者情報の実データ反映）」の実装。

**良い点**:
- `shop_document_settings` + `shop_settings` から実事業者情報を引き、dataSourceで「shop_settings」/「phase13_failsafe_mock」を明示的に分岐する設計思想は正しい方向。
- 通知履歴テーブル自体は存在し、loading/empty/refreshの基本状態管理はできている。
- 日本語エラーマッピング（`friendlyEmailError`）の試み、状態別バッジ色分け（emerald/amber/red/blue）は意図が明確。
- Stripe側も「先に帳票・書類設定を保存してください」というガイダンス文言をamberで表示しており、Phase 12の完全ハードコードよりは改善。

**深刻な問題**:
Phase 13は「通知履歴テーブルを追加した」「実データ連携の土台を作った」という**実装事実**は満たすが、**EC初心者が「これで本当に自分の事業が安全に動く」と安心できる体験**には程遠い。生エラー露出、プレースホルダー会社名の残存、テーブル操作性の欠如、同一タブ内フェイク設定の混在により、**商用サービスとしての体を成していない**。

**結論**: 現時点で **重大2件 + 要修正6件** を抱え、**承認不可**。Phase 12の「テスト事業者情報誤解リスク」と「エラー可視性」の反省が不十分にしか反映されていない。修正後に再レビューを強く推奨。

---

## 2. 重大（即時ブロッカー・信頼失墜レベル）

### 1. Stripe事業者情報のプレースホルダー会社名が依然として表示され、初心者誤解を誘発（Phase 12反省の不十分な引き継ぎ）

**ファイル**:
- [src/lib/server/shopStripeConnect.ts:1-12, 128-146](/home/pkkatsu/aiboux/src/lib/server/shopStripeConnect.ts)
- [src/components/shop/ShopSettingsPanel.tsx:418-456](/home/pkkatsu/aiboux/src/components/shop/ShopSettingsPanel.tsx)

**問題**:
- `DEFAULT_STRIPE_BUSINESS_DATA` が依然として「代表者: 篠原 千恵 / 会社: 株式会社雪花 / 所在地: 北海道長万部町」を保持。
- `getStripeBusinessData` 内で `hasRealData = false` の場合でも `firstText(...) || DEFAULT...` で「株式会社雪花」が `companyName` として返却され、UIに表示される。
- UIでは `businessLabelSuffix = "（未設定時の安全値）"` と `dataSource === "phase13_failsafe_mock"` 時のamber警告文「事業者情報が未設定のため、安全な仮情報で準備します。先に帳票・書類設定を保存してください。」は出る。
- **しかし値そのものが「実在しそうな法人名」であるため、EC初心者が「自分のショップがこの会社名でStripeに登録されるのか？」と即座に不安・不信を抱く**。Phase 12で「テスト用」と明示した反省が、**値の置き換え**ではなく「警告ラベル追加」のみに留まっている。

**影響**:
- ストア公開前設定で最初に目にする「決済」タブで「自分の情報が勝手に使われるのでは」という疑念が生まれる。
- 商用サービスとして「自分の事業者情報を正しくコントロールできている」という安心感がゼロ。

**判定**: **重大**（Phase 12最終レビューで「次Phaseでユーザー入力値反映を推奨」と明記された事項の不履行に相当）。

---

### 2. `friendlyEmailError` のフォールバックで生の技術エラー文言がテーブルに直接露出

**ファイル**:
- [src/components/shop/ShopSettingsPanel.tsx:353-358](/home/pkkatsu/aiboux/src/components/shop/ShopSettingsPanel.tsx)
- [src/workers/shop-email-queue.ts:75-88](/home/pkkatsu/aiboux/src/workers/shop-email-queue.ts)
- [src/lib/server/shopNotificationEmail.ts:61](/home/pkkatsu/aiboux/src/lib/server/shopNotificationEmail.ts)

**問題**:
```ts
function friendlyEmailError(value: string): string {
  if (value.includes("mock_send_without_resend_api_key")) return "...";
  if (value.includes("internal server error")) return "...";
  if (value.includes("timeout") || value.includes("aborted")) return "...";
  return value;  // ← ここが致命的
}
```
- Resend実際のエラー（"Invalid `to` email address", "You have exceeded your daily email limit", 4xx/5xx詳細）、Cloudflare EMAIL bindingのエラー、ネットワーク例外などがマッチせず**生の英語/技術文字列が `line-clamp-2` で表示**される。
- `error_message` は `message.slice(0, 500)` で保存されるため、詳細なスタックや英語のバリデーション文言がそのまま履歴に残る。

**影響**:
- 通知が失敗したEC初心者が「何が原因でメールが届かないのか」を自己判断できない。
- 「メール通知がちゃんと動く」という商用サービスの最低限の信頼が、**失敗時に崩壊**する。
- 過去レビュー（Phase 12）で「Stripeエラーの生英語露出リスク」を指摘されたのと同等の問題がメール側で再発。

**判定**: **重大**（EC運営者にとって「通知が届かない」ことは即ビジネスリスク。原因不明の英語は許容外）。

---

## 3. 要修正（UX摩擦・商用体裁を損なうレベル）

### 1. メール通知履歴テーブルの情報設計と操作性が極めて貧弱

- 失敗行のエラーは `line-clamp-2` で2行以内に切り捨てられ、**全文表示・コピー・再送導線が一切存在しない**。
- 5回失敗で `status="failed"` になった後の状態がただの赤バッジ「失敗」。その後の dead-letter 的な扱いや「サポートへ連絡」案内なし。
- 50件固定、フィルタ（成功/失敗/期間/件名検索）、CSVエクスポート、ページネーションなし。実運用でログが溜まれば即座に使い物にならなくなる。
- 行にエラーがある場合の視覚的強調（bg-amber-50など）なし。すべて同等トーン。

**EC初心者視点**: 「履歴を見ても原因がわからないし、直せない」→ 設定画面が「ただのログ置き場」に見える。

---

### 2. テーブルレイアウトの狭さとレスポンシブ完全無視

- `TableCell` の内容セルに `max-w-[360px]` + `whitespace-normal` のみ。長い件名＋エラー文で即3行以上に折り返され視認性激減。
- `<Table>` 全体に `overflow-x-auto` ラッパーや横スクロール考慮が一切ない。狭い管理画面（特にモバイル/タブレット運用）でカラムが圧迫される。
- ヘッダー `w-[140px]` / `w-[90px]` の固定幅が中身に合わず、状態バッジがはみ出す可能性。

**商用サービスとして**: プロダクト品質の低さを即座に露呈する。

---

### 3. ステータスバッジの一貫性・視認性の欠如

- `EmailStatusBadge` と `stripeStateBadge` は独自の `bg-emerald-600 text-white text-[11px]` 固形バッジをハードコード。
- 既存の `StatusBadges.tsx`（outline + 意味別トーン `border-amber-100 bg-amber-50` など）と完全に不整合。
- `text-[11px]` は小さすぎ（特に高齢の店舗運営者想定）。`StatusBadge` が `text-[10px]` ですら「小さい」との過去指摘がある。
- 「再試行中」→「失敗」の切り替わりが attempts < 5 の条件のみで、**進行状況の連続的な視覚フィードバック**が弱い。

---

### 4. 日時表示の曖昧さと「未送信」表示の不自然さ

- `formatDateTime`: `toLocaleString("ja-JP", {month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit"})` で**年が完全に欠落**。
- 履歴が30日以上前（retentionは30日）になると「何年何月のものか」が一目でわからない。
- `sentAt || lastAttemptAt || createdAt` で queued 状態でも「未送信」ではなく日時が出てしまうケースあり。状態と日時の整合が取れていない。

---

### 5. Stripe実事業者表示の説明不足と「未設定」だらけの圧迫感

- 成功時の文言「帳票・基本設定の事業者情報をStripeへ連携します。」は良いが、**「いつ反映されるか」「更新した場合はどうなるか」**（onboard時のスナップショット、既存アカウントへの反映は別途必要）の説明が一切ない。
- 電話番号・メールが未設定の場合、3列すべて「未設定」になる `StatusLine` が並び、視覚的に「この設定は不完全」と強調されてしまう。
- `representativeName` が常に `""` で表示されないのも不自然（Stripe Connectでは代表者情報は重要）。

---

### 6. 通知タブ内に本物とフェイクが混在し、タブ全体の信頼性を毀損

- `EmailNotificationHistory` は実fetch・実D1ログ。
- その直下の「SNS投稿設定」「LINE通知設定」はすべて `onClick={() => save("...")}` または `toast.info` の**完全なダミー**。
- 初心者が「メールは履歴あるけどSNSは動かないの？」「通知設定って全部本物じゃないの？」と混乱するのは必然。

**Phase 9-11の反省（保存系UIのフェイク問題）** が同一ファイル内で再発している。

---

## 4. 軽微（即時致命ではないが商用 polish として不足）

- バッジの `rounded-md text-[11px]` が他UIと視覚的に浮いている。
- 空状態文言「帳票設定の保存や商品公開後にここへ表示されます」は良いが、**実際にどの操作でどの件名が記録されるのか**の具体例やヘルプが不足。
- 試行回数に「/5回まで」などの上限表示・残り回数表示なし。
- ロード失敗時、toast のみでテーブルが前回データ or 空のままになる挙動が不明瞭。
- `phase13_failsafe_mock` という内部定数名がコードに残存（UI非表示とはいえ、保守時に混乱要因）。
- `StatusLine` 3列が常に同じ高さで、電話が未設定だと特に目立つ「未設定」ラベル。

---

## 5. 良い点（素直に評価）

- 通知履歴を「integrations」タブの最上部に配置したのは正しい優先順位。
- 空状態・ローディング・更新ボタンの基本3状態は揃っている。
- `dataSource` による条件分岐と警告文の出し分けは、Phase 12の反省を「最低限」意識した形跡がある。
- `stripeErrorMessage` / `formatImageUploadError` は日本語化されており、トーストレベルでは比較的親切。
- テーブルに `provider` 表示（resend / 値）があり、将来的な複数プロバイダ対応の土台はある。

---

## 6. 最終判断

**Phase 13は現時点で承認不可**。

### 理由（優先度順）
1. **重大1**: Stripe事業者情報の「株式会社雪花」プレースホルダー表示（Phase 12で最も厳しく指摘された初心者誤解リスクが、警告ラベルだけで解決したと誤判断されている）。
2. **重大2**: メール失敗時の生エラー文言露出（`return value`）。これだけで「通知機能が信頼できない」と判断される。
3. **要修正6件**のうち特にテーブル操作性・レイアウト・タブ内フェイク混在は、**商用EC管理画面として体裁を成さない**レベル。
4. Phase 12最終レビューで「次Phaseで強く推奨」とされた2機能が「形だけ実装」され、**本質的な初心者安心・商用 polish** が欠落している。

**修正後に再レビュー必須**。特に以下のP0を完了しない限り、本番投入は推奨しない。

---

## 7. 推奨修正優先順位（P0 → P2）

### P0（即時・承認前提）
1. `DEFAULT_STRIPE_BUSINESS_DATA` を完全な「未設定」プレースホルダー（例: 「（事業者名未設定）」）に置き換え。**実在の会社名を二度とUIに露出させない**。
2. `friendlyEmailError` を大幅強化（網羅的な英語→日本語マッピング + 未知エラーは「詳細はサポートへお問い合わせください（コード: XXX）」形式に隠蔽）。`return value` を禁止。
3. 通知履歴テーブルに最低限の操作性追加（失敗行クリックでモーダル全文表示 + 「再送を試す」ボタン or サポート連絡導線）。

### P1（UX体裁）
4. テーブルを `overflow-x-auto` ラッパーでレスポンシブ化 + 内容セル幅拡大 or ツールチップ/展開UI。
5. バッジを `StatusBadges.tsx` のトーン系に統一 + `text-xs` 以上に引き上げ。
6. 日時表示に年または「○日前」相対表示を追加。「未送信」表示の整合修正。
7. 通知タブ内のSNS/LINE設定を「今後実装予定」明記ラベルに置き換え、または本実装まで非表示。

### P2（商用 polish）
8. Stripe事業者表示に「反映タイミング」「更新時の注意」ガイダンス追加。
9. 試行回数に「5回中 N 回」の上限視覚化。
10. 空状態に「実際に記録される通知の例（帳票保存時 / 商品公開時）」の具体例を追加。

---

## 8. 補足・検証メモ

- 本レビューは `/tmp/grok-aiboux-phase13` および `/home/pkkatsu/aiboux/src` の静的コード解析 + 過去Phaseログ（特に `15_phase12_grok_final_review.md`）に基づく。
- 実際の動作（実D1 + RESEND_API_KEY未設定/設定時 + STRIPE_SECRET_KEY有無での businessData 遷移 + 複数失敗メールの履歴表示）は**人間による手動E2Eスモークを必須**とする。
- Cloudflare AI Audit（16_phase13）はバックエンド性能・D1負荷観点で概ね良好だったが、UX/文言/初心者誤解リスクは完全にスコープ外であった。

**このままでは「EC初心者に優しいAIBOUX Shop」というブランド約束を果たせていない**。Phase 13の2機能は「正しい方向」だが、「正しい体験」には到達していない。

---

*レビュー完了。修正版の再レビューを待つ。*
