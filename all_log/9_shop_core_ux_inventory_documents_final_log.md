# AIBOUX Shop 実務UX・在庫・帳票改善 最終ログ

生成日時: 2026-05-27 22:47 JST  
対象: AIBOUX Shop

## 実装内容

- ヘッダー検索を修正し、検索語が注文・商品・在庫一覧の表示結果に反映されるようにした。
- コマンドパレットで注文・商品を選択した際、該当一覧へ遷移して検索状態を反映するようにした。
- Noto Sans JPの厳格適用として、旧フォント依存 `@fontsource-variable/inter` / `@fontsource-variable/geist` を削除し、CSS内の `@apply font-sans` を除去した。
- カレンダーUIを `date-fns/locale/ja` により日本語ローカライズした。
- 在庫管理を実務向けに整理し、在庫ステータスを `受注中` に一本化した。
- 在庫一覧から `予約済み`、`入荷予定`、`販売可能` を削除し、`未出荷の注文数` を追加した。
- 在庫数量を一覧上で直接編集・保存できるインライン編集UIを追加した。
- 在庫一覧の商品名から商品編集画面へ直接遷移できるリンクを追加した。
- 商品編集画面を `基本情報`、`価格・在庫`、`画像・SEO`、`カテゴリー` のタブ構成に整理した。
- 注文一覧に `出荷伝票番号` の入力・保存UIを追加した。
- 注文一覧から `納品書`、`請求書`、`領収書` をブラウザ印刷/PDF保存できる帳票生成機能を追加した。
- 帳票には適格請求書等保存方式に必要な主要項目として、発行事業者、登録番号、取引日、明細、税率、税率ごとの税込対価、消費税額、合計を表示するようにした。
- Shop初期設定ウィザードの特定商取引法に基づく表記とプライバシーポリシーの自動生成文面を、EC運用向けに大幅強化した。
- Google Shopping Category IDの候補検索APIを追加し、カテゴリー管理UIから候補を検索・反映できるようにした。
- `shop_social_post_drafts` に `approved_by` と `approved_at` を追加するD1マイグレーションを作成・適用した。
- SNS投稿承認APIで承認者と承認日時を記録するようにした。
- `AIBOUX_MASTER_DOCUMENT.md` に今回の実装内容、HappyDeersDOCSからの転用方針、スキーマ変更を追記した。

## HappyDeersDOCS 参照内容

VPS内で展開済みの `HappyDeersDOCS` ディレクトリは見つからなかったため、関連アーカイブ `/tmp/happydeers-docs-seo.tgz` を参照した。

参照した主なファイル:

- `lib/pdf/shared/tax-calc.ts`
- `lib/pdf/templates/qualified-invoice.ts`
- `lib/pdf/templates/delivery-note.ts`
- `lib/pdf/templates/receipt.ts`
- `app/routes/privacy.tsx`
- `app/routes/terms.tsx`

転用した考え方:

- 税計算を帳票ごとに分散させず、税率別サマリーとして集約する。
- 適格請求書では登録番号、交付先、取引日、税率別対価、消費税額を明確に表示する。
- 納品書は配送・納品文脈を優先する。
- 領収書は受領事実と但し書きを明確にする。
- 法務文書は取得情報、利用目的、第三者提供、委託、安全管理、保存期間、開示等請求、問い合わせ窓口を網羅する。

## 公式情報の確認

- 消費者庁 特定商取引法ガイド: 通信販売の広告表示事項、最終確認画面、返品特約等を確認。
- 国税庁 インボイス制度: 登録番号、適格請求書の記載事項、税率別合計・消費税額表示を確認。
- 個人情報保護委員会: 利用目的の公表、安全管理措置、第三者提供・委託に関する考え方を確認。

## D1適用結果

- ローカルD1: `migrations/0005_shop_phase6.sql` を適用済み。
- リモートD1: `aiboux-b2b-db` に同マイグレーションを適用済み。
- 追加カラム:
  - `shop_social_post_drafts.approved_by`
  - `shop_social_post_drafts.approved_at`
- 追加インデックス:
  - `idx_shop_social_post_drafts_approval`

## 検証結果

- `npm run astro check`
  - 結果: 0 errors
  - 備考: 既存の未使用import等のhintは残存。完了後にesbuildのwatcher終了時deadlockログが出るが、Astro check自体は0 errorsで終了。
- `npm run build`
  - 結果: `22:50:15 [build] Complete!`
- `npx wrangler deploy --keep-vars`
  - 結果: 成功
  - Version ID: `f764cd58-72e1-4ec6-98f6-f8213ade3522`
- HTTP確認
  - `https://shop.aiboux.com/shop/inventory`: 200
  - `https://shop.aiboux.com/shop/products/prod-bag-001`: 200
  - `https://shop.aiboux.com/shop/api/categories/google-suggest?q=バッグ`: 200 / Googleカテゴリー候補JSONを返却
  - `https://mail.aiboux.com/g/scu`: 200 / 本ログをMarkdownとして返却

## AIからの自発的改善提案

- 注文テーブルの出荷伝票番号は現在クライアント状態の保存UIなので、次にD1永続化APIを追加する。
- 帳票生成はブラウザ印刷ベースなので、R2へPDF保存するサーバーサイド生成キューを追加すると監査性が上がる。
- 税率は現在10%の標準税率想定。軽減税率・非課税・送料課税区分を注文明細データへ正式追加する。
- Google Shopping Category候補は静的モックなので、正式カテゴリ辞書テーブルと定期更新処理を追加する。
- 特商法・プライバシーポリシーは高品質テンプレート化したが、業種・商品カテゴリ別の差分質問ウィザードを追加すると公開前確認がさらに安全になる。
