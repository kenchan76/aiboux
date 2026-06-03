# AIBOUX Mail モバイルUI改善完了ログ G2

作業日時: 2026-05-27

## 完了内容

- `AIBOUX_MASTER_DOCUMENT.md` を全文確認し、統合済みの `docs/AIBOUX_UI_DESIGN_SYSTEM.md` 内容とアーカイブ元文書を照合した。
- 受信トレイの `重要優先` セレクターを `MailToolbar` から完全削除した。
- `新規作成` をトップバーの検索窓右側へ移動し、未読件数を `未読 15 / 24` 形式で近接表示した。
- 検索窓フォーカスで直下に軽量フィルターパネルを開くようにした。
- クイックフィルターを `未読のみ` / `新着順` / `未読順` / `添付あり` / `添付なし` / `重要` / `返信待ち` に拡張した。
- トップバー右側のサービス切替アイコンを削除し、左上 `aiboux MAIL` ロゴをサービスメニュー化した。
- サービスメニューに `CORE` / `SHOP` / `FILE` / `BIZ` / `OFFICE` / `履歴書` / `Docs` を追加した。
- モバイルのサイドバーリンク押下時にサイドバーを自動で閉じるようにした。
- モバイルのメール詳細画面で左スワイプにより一覧へ戻れるようにした。
- モバイルではトップバーを高密度2段構成にして、ロゴ、件数、新規作成、検索が潰れないようにした。
- タブレット幅で詳細ペインが潰れすぎないよう、デスクトップ分割表示の一覧幅を段階調整した。

## 変更ファイル

- `src/components/mail/MailTopbar.tsx`
- `src/components/mail/MailClientShell.tsx`
- `src/components/mail/MailSidebar.tsx`
- `src/components/mail/MailList.tsx`
- `src/components/mail/MailToolbar.tsx`
- `src/components/mail/MailThreadView.tsx`
- `src/lib/server/tempLogShares.ts`
- `all_log/3_MailモバイルUI改善完了ログ_G2_dash.md`

## 検証

- `npm run build`: 成功。最終ログは `11:12:22 [build] Complete!`。
- Playwright CLIでスクリーンショット取得:
  - `output/playwright/mail-ui-desktop.png`
  - `output/playwright/mail-ui-tablet.png`
  - `output/playwright/mail-ui-mobile.png`
- コード検索でMail関連の `重要優先` / `AppWindow` / `アプリ切替` が残っていないことを確認した。

## 注意

- `docs/AIBOUX_UI_DESIGN_SYSTEM.md` はアクティブな `docs/` 直下には存在せず、`AIBOUX_MASTER_DOCUMENT.md` に統合済み。元文書は `docs/archive/2026-05-27-pre-master/AIBOUX_UI_DESIGN_SYSTEM.md` に存在する。
- 仕様変更、URL変更、Cloudflare設定変更、データ/API/AI方針変更は行っていない。
