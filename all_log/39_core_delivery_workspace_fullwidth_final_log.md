# AIBOUX Core 納品書作成ワークスペース全幅化 追い修正 最終ログ

実行日時: 2026-05-29T22:14:00+09:00  
担当AI: Codex  
対象URL: `https://core.aiboux.com/core/deliveries`  
対象UI: `/core/deliveries` の `納品書を作成` で開く納品書作成ワークスペース

## 実装概要

- A4プレビュー削除後も右側に背景が見えていた納品書作成ワークスペースを、左サイドバー直後からviewport右端まで使い切るように再修正した。
- delivery mode の `SheetContent` を幅計算依存から `left + right-0 + !w-auto` の固定配置へ変更した。
- `max-w` / `mx-auto` / `container` / 中央寄せは納品書作成画面に追加していない。
- `SheetContent` へ以下の方針を適用した。
  - `left-[var(--core-sidebar-width,240px)]`
  - `right-0`
  - `!w-auto`
  - `!max-w-none`
  - `p-0`
  - `m-0`
- delivery mode のカード余白をさらに圧縮した。
  - CardHeader相当: `px-2.5 py-2`
  - CardContent相当: `px-2.5 pb-2.5 pt-0`
  - フォーム外側: `px-3 py-2 pb-[10px]`
  - 主要gap: `gap-2` / `space-y-2` / `space-y-[10px]`
- 明細一覧と金額サマリーを上に詰め、1980x1080のファーストビューで以下が見える状態にした。
  - 明細一覧
  - 金額サマリー
  - メール送信
  - FAX送信
  - コピー
  - 保存

## 変更ファイル一覧

- `src/components/core/forms/DocumentEntryForm.tsx`
- `tests/core-full-ui-redesign.spec.ts`
- `tests/core-phase5-layout.spec.ts`
- `AIBOUX_MASTER_DOCUMENT.md`
- `all_log/39_core_delivery_workspace_fullwidth_final_log.md`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`

## 左サイドバー非変更確認

- 左サイドバー本体の構造・メニュー・幅指定は変更していない。
- 作成ワークスペース側だけで `--core-sidebar-width: 216px` を参照し、サイドバー右端から開始するようにした。

## Playwright確認

- 左端検証:
  - `SheetContent.left` と `aside.right` の差が12px以内。
- 右端検証:
  - `viewport.right` と `SheetContent.right` の差が8px以内。
- A4プレビュー非表示:
  - `A4プレビュー` count = 0
  - `ライブプレビュー` count = 0
- 1980x1080スクリーンショット:
  - `/home/pkkatsu/aiboux/output/playwright/core-ui-redesign/20_delivery_create_no_a4.png`

## 検証結果

- `ESBUILD_WORKER_THREADS=0 npm run build`
  - 成功
  - 既存のVite chunk-size warningは残存
- Playwright:
  - `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-phase5-layout.spec.ts tests/core-document-entry.spec.ts tests/core-full-ui-redesign.spec.ts --grep "納品書作成|納品書をワンクリック|納品書詳細" --reporter=line`
  - 4 passed
- 最終の `npm run astro check` と `ESBUILD_WORKER_THREADS=0 npm run build` はデプロイ直前に再実行する。

## 未完了 / TBD

- 配送業者、配送状況、お問い合わせ番号、配送時間帯などの配送フィールドは現時点ではUI状態中心。専用D1カラム/APIでの永続化はTBD。
- メール送信 / FAX送信は表示ラベルとして実装済みだが、クリック時は送信準備・通知に留める。外部送信の実行は人間承認後。

## デプロイ

- 今回のユーザー依頼を前回から続く同一差し戻し対応の本番デプロイ承認として扱う。
- check/build/Playwright 成功後に `npx wrangler deploy --keep-vars` を実行する。
- Worker Version ID はデプロイ後のチャット報告に記載する。

## 一時公開URL

- 最終ログ: `https://mail.aiboux.com/g/cdeliv4?token=0e282990d79ab2a7eab18aa90700fd9c457409d746ad91fb`
- 引継書: `https://mail.aiboux.com/g/mcdeliv4?token=27f1c057de8ab57e76848a75ec4f3943ba4a75e4a029a0b8`
- 有効期限: `2026-05-30T13:14:00Z`

