# AIBOUX Core / Shop UI Implementation Log

実行日時: 2026-05-29 JST

## 実装概要

AIBOUX Core 管理画面のメイン領域を、1980x1080 基準の高密度業務 UI へ拡張しました。左サイドバーは幅・文言・階層・選択表示を変更していません。

AIBOUX Shop については、`shop.aiboux.com` ルートに相当する `/shop` を、AIBOUX SHOP ブランドのストアフロントトップへ切り替えました。白ベース、Amazon ライクな情報設計、大型検索、カテゴリナビ、ヒーロー、サービス訴求、商品レールを備えた構成です。

## 実装した画面

- Core 設定画面: `/core/settings`
- Core デザイン管理画面: `/core/design`
- Core デザイン管理互換ルート: `/core/settings/design`
- Core 帳票一覧のページング導線追加: `/core/estimates`, `/core/deliveries`, `/core/invoices`
- Shop ストアフロントトップ: `/shop`

## 変更ファイル

- `src/components/core/CoreShell.tsx`
- `src/components/core/CoreSettingsWorkspace.tsx`
- `src/components/core/CoreDesignWorkspace.tsx`
- `src/data/core-sample-data.ts`
- `src/pages/core/settings.astro`
- `src/pages/core/design.astro`
- `src/pages/core/settings/design.astro`
- `src/components/shop/storefront/ShopStorefrontHome.tsx`
- `src/pages/shop/index.astro`
- `tests/aiboux-core-shop-ui.spec.ts`
- `AIBOUX_MASTER_DOCUMENT.md`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`

## Core UI 詳細

- 設定画面を高密度カード UI 化し、基本設定、会社情報、ユーザー・権限、通知、帳票設定、メール・FAX、税・会計、在庫設定、API・連携、監査ログを整理。
- メール/FAX は外部送信を実行済みと誤認させないよう、`メール・FAX準備` として表示。
- 利用状況、プラン、ストレージ、APIキー状態を KPI strip として上部に配置。
- デザイン管理画面にテーマ一覧、ライブプレビュー、デザイン設定、アセット管理、公開チェックリスト、変更履歴、公開準備導線を追加。
- 帳票一覧に現在件数・ページ表示・前後ページング導線を追加。

## Shop UI 詳細

- `/shop` を公開ストアフロントトップに変更。
- 上部ユーティリティバー、AIBOUX SHOP ヘッダー、大型検索、カテゴリナビを実装。
- 北海道特産品ヒーロー、左右プロモーション、送料無料/最短発送/返品安心/ポイント/定期便/ギフト包装の訴求バーを実装。
- 本日のおすすめ、売れ筋ランキング、タイムセール、あなたへのおすすめ、カテゴリ別特集、新着商品、ギフト特集、人気ブランドを配置。
- 商品カードの導線は管理画面ではなく公開商品ページ `/shop/tenant_001/product/{id}` へ接続。

## 検証結果

- `npm run astro check`: 0 errors, 0 warnings, 27 hints
  - hints は既存の未使用 import / deprecated API 由来で、今回追加分の型エラーはありません。
- `npm run build`: 成功
  - Vite の chunk size warning は既存構成由来の警告として継続。
- Playwright E2E: 7 passed
  - `tests/core-document-entry.spec.ts`
  - `tests/core-phase5-layout.spec.ts`
  - `tests/aiboux-core-shop-ui.spec.ts`
- 1980x1080 スクリーンショット:
  - `test-results/core-settings-1980.png`
  - `test-results/core-design-1980.png`
  - `test-results/shop-storefront-home-1980.png`
  - 既存 Phase 5 検証の `core-phase5-*.png` も再生成済み。

## 未完了 / 今後の改善余地

- Core 設定画面とデザイン管理画面は、今回 UI と安全な操作導線の実装が主対象です。保存値の完全永続化、権限別編集制御、公開ワークフローの本番承認 API は今後の対象です。
- Shop ストアフロントトップの商品データは既存サンプルデータを使っています。D1 の公開商品データとの完全同期、検索・カート・ログインの本番接続は今後の対象です。
- `git push` / `wrangler deploy` はユーザー承認が必要なため未実行です。

## 一時公開URL

以下の短縮URL登録を追加しました。ユーザー指示によりデプロイは未実行のため、本番で有効化するには別途デプロイ承認が必要です。

- 最終ログ: `https://mail.aiboux.com/g/csui`
- 引継書: `https://mail.aiboux.com/g/mcsui`
- 有効期限: `2026-05-29T23:42:42Z`
