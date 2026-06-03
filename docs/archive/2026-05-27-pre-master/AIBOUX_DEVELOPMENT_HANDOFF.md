# AIBOUX Development Handoff

> Archive note: This file is retained for historical traceability only. The active Source of Truth is `/home/pkkatsu/aiboux/AIBOUX_MASTER_DOCUMENT.md`.
> Any old deployment-approval wording in this archived snapshot is superseded by the current Production Deployment Rule: normal code/UI/API production deployment may run after required verification passes; `git push`, destructive operations, secret exposure/transfer, real external sending, pricing/billing changes, marketplace publication, customer/personal-data external transfer, and high-risk legal/pricing/contract/refund decisions still require human approval.

この文書は、将来の Codex / Claude / 開発AIが10分でAIBOUX全体を把握するための引継ぎ要約です。実装前には必ず詳細仕様も読むこと。

## Confirmed Decisions

- AIBOUXは「1人でも会社業務を回せる、高密度・高速・実務特化の統合業務OS」。
- `https://aiboux.com` はシリーズ紹介・入口・ポータル。
- Core URLは `https://core.aiboux.com/`。
- Mail URLは `https://mail.aiboux.com`。
- Docs URLは `https://docs.aiboux.com`。
- Mall URLは `https://mall.aiboux.com`。
- File / Biz / Office / 履歴書はStarwind UI。
- Core / Mail / Shopはshadcn/ui。
- Mailは音声要約、音声返信メモ補正、公私判定、右下FABから開くフローティングAI Assistantを持つ。AIは下書きまで。
- Cloudflare Workers AI binding `AI` は `aiboux` Workerへ接続済み。診断APIは `GET /api/ai/health`、実推論テストは `GET /api/ai/health?run=1`。
- 本番のAI実推論診断は `ADMIN_API_TOKEN` 必須。Codex MCPはローカル秘密ファイルからトークンを読み、`https://mail.aiboux.com` の診断APIを呼ぶ。
- Dev MonitorはCloudflare Workersのエラー要約をXServer VPSへ渡し、開発AIが修正案と検証を起草する。デプロイは人間承認必須。
- Officeはファイル本体を原則サーバーへ送信しない。
- 履歴書は英字 `RIREKISHO` badge禁止。

## Assumptions

- Coreを正本として周辺サービスが連携する。
- 無料系サービスはSEO・広告・会員登録・送客導線として機能する。
- Cloudflare Pages/Workers/D1/R2/KV/Queues/Cron/Turnstileを使う。

## TBD

- Docs UIライブラリ。
- Mall UIライブラリ。
- Public Site UIライブラリ最終決定。
- Biz CTA最終色。
- Workers AI商用APIフォールバック条件、Dev Monitor管理者承認URL。

## Do Not Invent

- 未確定URLを勝手に決めない。
- 未確定料金を勝手に決めない。
- Office/PDF完全互換を謳わない。
- 競合サイトの文言・テンプレート本文をコピーしない。
- AIに本番反映を自動実行させない。
- AIにメール外部送信を自動実行させない。
- プライベート判定メールをCore販売管理・取引先候補・AI横断参照へ混ぜない。
- VPS常駐エージェントに本番デプロイや秘密情報転送を自動実行させない。

## Latest URL Map

| Service | URL |
|---|---|
| AIBOUX Series Site | `https://aiboux.com` |
| Core | `https://core.aiboux.com/` |
| Mail | `https://mail.aiboux.com` |
| Shop | `https://shop.aiboux.com` |
| Mall | `https://mall.aiboux.com` |
| File | `https://file.aiboux.com` |
| Biz | `https://biz.aiboux.com` |
| Office | `https://office.aiboux.com` |
| 履歴書 | `https://rirekisho.aiboux.com` |
| Docs | `https://docs.aiboux.com` |

## 10-Minute Summary

AIBOUXはCoreを中心とした統合業務プラットフォームです。Coreが商品、得意先、納品先、価格、在庫、帳票の正本になります。ShopはCore商品をEC商品/SKU/モール出品へ展開します。Mailは業務メール処理をCore文脈に接続します。Mallは一般顧客向け集客モールです。File/Biz/Office/履歴書は無料入口としてSEO、広告、会員登録、送客を担います。Docsは全体ヘルプです。

## Service Summaries

### Public Site

- URL: `https://aiboux.com`
- アプリではなく、シリーズ紹介・入口・サービスカード・料金・ユースケース・関連導線。

### Core

- URL: `https://core.aiboux.com/`
- shadcn/ui。
- 基幹業務、帳票、商品マスタ、在庫、得意先、納品先、卸価格の正本。

### Mail

- URL: `https://mail.aiboux.com`
- shadcn/ui。
- Gmail風の業務メールUI。
- Coreメニューは表示しない。
- 音声要約、音声返信メモ補正、公私判定、返信下書き承認UIを持つ。
- 実装入口: `src/lib/mail/ai.ts`、`src/pages/mail/api/ai/classify.ts`、`src/pages/mail/api/ai/voice-draft.ts`。
- 2026-05-25 VPS開発環境でMail実務送受信テスト用fixtureを追加。`info@aiboux.com` と `admin@aiboux.com` 間の36通を `src/data/mail-sample-data.ts` でシミュレートし、長文プレーン、HTML複合、返信ネスト、添付ファイルの4系統を各9通保持する。実Cloudflare Email Send/Email Routingでの大量送信は管理者承認なしに行わない。
- 2026-05-25 Mail UIは白背景、細い罫線、高密度リスト、デスクトップ3ペイン、引用折り畳み、構造化HTMLプレビュー、PDF/CSV/TXT添付カード、NFKC正規化+制御文字/置換文字除去の本文サニタイズを採用。
- 2026-05-25 全サービスLayoutへ共通 `GlobalAIAssistant` を追加。旧固定右カラムAIは廃止し、右下フローティングUI + FAB復帰に統一。会話履歴、入力中テキスト、最後のIntentは `localStorage` でページ遷移をまたいで維持する。
- 2026-05-25 `POST /api/ai/intent` を追加。Cloudflare Workers AI接続を使いつつ、遅延や失敗時は `src/lib/ai/intent-router.ts` の決定的ルーターで即時補完する。音声メール下書き、署名変更、フィルタ/サイロ、自動応答、ナビゲーションIntentに対応。
- 2026-05-25 Mail設定画面をアカウント、転送/POP/IMAP、フィルタ/ブロック/サイロ、自動応答、UI設定の5カテゴリへ拡張。
- 2026-05-26 Mail共通AIチャットにFrictionless Speech-to-Textを実装。`SpeechRecognition` / `webkitSpeechRecognition` を機能検出し、日本語の途中結果・最終結果・権限/未対応エラーを扱う。認識テキストはAI入力欄へ反映し、外部送信は行わない。
- 2026-05-26 MailのモバイルAIチャットは初期表示を閉じた状態に変更。展開時は `dvh` / `svh` と `safe-area-inset-*` を使い、iPhone系のセーフエリア内に収まるよう調整。
- 2026-05-27 MailのAI AssistantをDesktop/Tablet/Mobile共通のフローティングウィンドウへ刷新。右固定カラム/Bottom Sheetを廃止し、右下FABで開閉する。AIはメイン本文領域を押しつぶさないオーバーレイとして表示する。
- 2026-05-27 Mailに `未読メール` スマートフォルダ、`/mail/unread`、PC向け分割表示/1行リスト表示切替を追加。Mail一覧はScrollArea viewportで下端までスクロールできるよう `h-full` / `min-h-0` / `overflow-hidden` を明示する。
- 2026-05-27 Mail設定画面をアカウント、独自ドメイン、転送/POP/IMAP、フィルタ/ブロック/サイロ、自動応答、UI設定の6カテゴリへ拡張。独自ドメインDNS候補、IMAP/POP Tooltip、アドレス別表示名/署名UIを持つ。現時点の設定保存はbrowser localStorageで、D1永続化/API接続はTBD。
- 2026-05-27 MailのPC向け1行リスト表示に件名右側の本文プレビューを追加し、日時右側に約6pxの余白を付与。AI FABは `size-14` へ拡大しつつ白背景 + restrained blue border/icon + `shadow-md` に抑え、AIパネルは白背景/neutral borderへ戻して入力欄だけblue focus ringで強調する。
- 2026-05-27 Mail AIウィンドウ未来化リベンジを実装。ユーザー明示指示により、AI Assistant外装のみコズミック・ティール/アメジスト系グラデーション、薄いbackdrop blur、極細glow edgeを許可する例外状態へ変更。Grokは方針違反を厳しく指摘したが、今回は方向性を維持し、実用性指摘のみ反映して内部カードを `border-neutral-200`、白95%背景、背景アニメーション36秒へ調整した。入力欄は白背景 + cyan focus ring + focus補助ステータスを維持する。
- 2026-05-27 Mail AIウィンドウ外装をAIBOUXブランドカラーのPurple to Cyanへ最終調整。背景は深いパープル左上から鮮やかなシアン右下へ変化し、`backdrop-filter: blur(20px) saturate(145%)`、44秒の低速背景シフト、1px glow edgeを持つ。Grok Dレビュー後、グラデーション直上の白文字を廃止し、ヘッダーと「よく使う依頼」ラベルを白高不透明度面 + neutral文字へ変更して視認性を確保した。
- 2026-05-27 Mail AIウィンドウ内のバランス調整を実装。ユーザー明示指示により、最下部のAI依頼入力エリアは白ベタ面から暗めの半透明グラス面へ変更し、textareaは白系テキスト、白系placeholder、cyan focus ringで入力箇所を明確化した。「よく使う依頼」ボタンは明るい半透明ピル、濃いviolet文字、hover時の浮き上がり・cyan背景・shadowで静的ラベルと区別する。Grok Eは白基調回帰を推奨したが、今回の方針を優先しつつ、低コントラスト指摘に対して入力面を暗く、ボタン面を高不透明度に調整した。
- 2026-05-27 Mailの1行リスト操作性を改善。PC compact modeでメール行をクリックすると、既存の選択/既読化処理に加えて `viewMode` を `split` へ戻し、対象メールの本文詳細を即座に読めるようにした。Mail専用AI FABは `size-14` から `size-16`、Botアイコンは `size-6` から `size-7` へ拡大し、右下起動ボタンの視認性とクリックしやすさを強化した。Grok FはCLIが無出力停止したため、失敗ログを残しCodexの追加Playwright検証で補完した。

### Dev Monitor

- 仕様: `docs/AIBOUX_VOICE_AND_DEV_MONITOR_SPEC.md`。
- Cloudflare Workersでエラー・遅延・例外を検知し、Workers AIで安全な要約に変換する。
- Cloudflare Tunnel経由でXServer VPS上の開発AIへ署名付きWebhookを送る。
- VPS側は修正パッチとテスト結果を提案するだけで、管理者承認なしに本番へデプロイしない。

### Cloudflare AI / Codex

- Worker binding: `env.AI`。
- Default text model: `@cf/meta/llama-3.1-8b-instruct-fp8` via `WORKERS_AI_TEXT_MODEL`。
- Shared helper: `src/lib/server/cloudflareAi.ts`。
- Diagnostic endpoint: `src/pages/api/ai/health.ts`。
- Codex MCP server: `tools/codex-aiboux-mcp/server.mjs`。
- Codex config entry: `C:\Users\info\.codex\config.toml` `[mcp_servers.aiboux]`。
- Token storage: Cloudflare secret `ADMIN_API_TOKEN` and local file `C:\Users\info\.codex\.sandbox-secrets\aiboux_admin_api_token.txt`。
- Verified production response on 2026-05-25: `bindings.ai = true`, inference `ok = true`。

### Shop

- URL: `https://shop.aiboux.com`
- shadcn/ui。
- Shopify風店舗運営バックオフィス。

### Mall

- URL: `https://mall.aiboux.com`
- 一般顧客向け集客モール。
- Amazon検索 + Yahoo CTA色の方向。

### File

- URL: `https://file.aiboux.com`
- Starwind UI。
- ファイル転送、PDF、画像、背景切り抜き、バーコード/QR。
- File MVPではAI補完なし。

### Biz

- URL: `https://biz.aiboux.com`
- Starwind UI。
- ビジネス文書、テンプレート、Webエディタ、履歴。
- 競合テンプレート本文コピー禁止。

### Office

- URL: `https://office.aiboux.com`
- Starwind UI + React Islands。
- ブラウザ内Office/PDF/CSV編集。
- ファイル本体をサーバーへ送信しない。
- 黄色CTA、黒文字。

### 履歴書

- URL: `https://rirekisho.aiboux.com`
- Starwind UI。
- 履歴書、職務経歴書、退職届、送付状、求人票解析、AI自己PR、証明写真。
- 薄めグリーンCTA。

### Docs

- URL: `https://docs.aiboux.com`
- 全体ヘルプ・操作ガイド。

## Required Workflow

User trigger rule: if the user says AIBOUX development is starting/continuing (`AIBOUXの開発をやる`, `AIBOUXを進める`, `AIBOUX実装`, or similar), first read the handoff/spec documents. Do not start from memory alone.

1. `AGENTS.md`
2. `docs/AIBOUX_MASTER_SPEC.md`
3. `docs/AIBOUX_SERVICE_MAP.md`
4. 対象サービス仕様書
5. 公式ドキュメント
6. 実装計画
7. 実装
8. build/check/lint
9. desktop/tablet/mobile確認
10. 報告
11. 作業終了時に仕様変更・URL変更・Cloudflare設定変更・UI方針変更・データ/API/AI方針変更の有無を確認し、必要ならdocs更新

## Completion Report Temporary URL Rule

- 完了報告を行う際は、必ず最終ログの内容を24時間限定で閲覧できる一時公開URLとして発行し、ユーザーへ共有する。
- 標準方式は既存AIBOUX Workerの `GET /api/temp/log/{id}/?token={token}` を使う。
- 公開対象ログは `src/lib/server/tempLogShares.ts` のレジストリに明示登録する。
- URLパラメータで任意ファイルパスを指定して読み込む実装は禁止。
- レスポンスは `no-store` / `noindex` を付与し、トークン不一致は `404`、期限切れは `410` にする。
- 運用詳細は `AGENT_RULES.md` を参照。

### Active Temporary Log Shares

- 2026-05-27: `all_log/3_最終完了ログ_A2_dash.md` を `final-log-a2-20260527` として24時間限定公開。期限: `2026-05-28 00:04 JST`。

## Recent Activity / Review Notes

- 2026-05-26: Grok 4.3 (xAI) による AIBOUX Mail 詳細レビュー完了 (対象: MailAIAssistantPanel.tsx, MailClientShell.tsx, MailTopbar.tsx, MailLayout.astro, AIBOUX_VOICE_AND_DEV_MONITOR_SPEC.md および関連API/データ層)。
  - 検証: AGENTS.md必須仕様書全読了、git (単一initial commitのみ、untracked大量)、`npm run build` 成功 (Mailチャンク含む、40s)、node 22環境確認。
  - 結果詳細・指摘・証拠: `all_log/2_フィードバック_A_dash.md` 参照。
  - 仕様変更: なし (MASTER/AI/VOICE/UIポリシー完全遵守確認)。実装ギャップ (UI→API未接続、Dev Monitorコード皆無、Git履歴欠如) のみ。
  - 作業終了時確認: 仕様/URL/UI/Cloudflare/API方針の変更は一切なし。Handoff更新は本セクションのみ (レビュー記録追加)。

## Next Candidate Work

- Public Site specification-based implementation.
- Office実編集ライブラリ接続。
- 履歴書スマホファースト実装。
- Core商品マスタのDB/API/UI詳細化。
- Docsサイト構造設計。
- Dev Monitor Webhook署名、VPS常駐エージェント、iPhone承認画面の実装。
- Cloudflare AIをMail公私判定/音声要約/Dev Monitor要約の本処理へ段階接続し、決定的ガードレールをfallbackとして残す。
- Mail送受信fixtureをD1/R2実データ投入またはCloudflare Email Routingテストへ昇格する場合は、外部送信・受信ルーティング・添付保存の影響範囲を確認してから管理者承認を取る。

## Latest Operational Handoff 2026-05-26

### Production Deployment

- Last approved production deployment was executed from VPS `/home/pkkatsu/aiboux`.
- Command used: `npx wrangler deploy --keep-vars`.
- Latest deployed Worker version: `eaaa6673-1abb-4aab-925a-df96906dc4f5`.
- Custom domains included in deploy output:
  - `mail.aiboux.com`
  - `core.aiboux.com`
  - `file.aiboux.com`
  - `biz.aiboux.com`
  - `office.aiboux.com`
  - `rirekisho.aiboux.com`
  - `docs.aiboux.com`
  - `shop.aiboux.com`
  - `mall.aiboux.com`
- Post-deploy production checks:
  - `https://mail.aiboux.com/mail/inbox` returned HTTP 200.
  - `https://mail.aiboux.com/mail/settings` returned HTTP 200.
  - Production HTML check confirmed `新規作成` is present.

### Current Mail UI State

- New mail compose entry point is centralized in the middle mail-list header as `新規作成`.
- The old left-sidebar logo-row compose icon and black `作成` button were removed.
- Mail list items are intentionally strict and dense:
  - sender
  - subject
  - snippet
  - time
  - unread/star/attachment affordances
- Colorful labels such as `請求関連`, `要対応`, `添付あり`, `注文関連`, `社内連絡`, `仕入先`, `重要` were removed from each mail item.
- Mail detail no longer shows AI reasoning/process panels, extracted business cards, related badges, confidence/debug wording, or Core connection suggestions.
- Mail detail shows the message body, structured HTML preview when present, and attachments only.
- Attachment cards now use file-type color affordances:
  - PDF red
  - XLSX green
  - CSV teal
  - image violet
  - DOCX blue
  - TXT neutral
- AI Assistant FAB is easier to hit:
  - `size-16`
  - bottom-right
  - white background
  - restrained blue border/icon
  - `shadow-lg`
- PC Mail view modes:
  - `split`: list + detail
  - `compact`: Gmail-like one-line list with sender, subject, body preview, attachment icon, and time. Row click returns to `split` so the selected mail body is immediately readable.
- Mail AI panel uses the approved Purple-to-Cyan branded glass outer surface. Content cards remain white/neutral, while the bottom AI request composer uses a darker translucent glass surface with white text and cyan focus ring. Quick request buttons use bright glass pill styling with explicit hover/focus affordance.
- Mail settings tabs are six categories and use horizontal overflow on narrow screens to avoid text collapse.

### Verification Evidence

- Final build on VPS after the latest Mail UI changes:
  - log file: `/tmp/aiboux-mail-ultimate-noise-final-build.log`
  - result: `05:44:05 [build] Complete!`
- Playwright local artifacts from the last verification pass:
  - `output/playwright/aiboux-mail-ultimate-list-detail.png`
  - `output/playwright/aiboux-mail-ultimate-settings.png`
- Latest automated UI verification results:
  - compose buttons: `1`
  - sidebar compose icon removed: `true`
  - new compose visible: `true`
  - compose dialog opened: `true`
  - mail item label text count: `0`
  - `AI公私判定` count: `0`
  - extracted business UI count: `0`
  - invoice card visible: `true`
  - Core action visible: `true`
  - FAB size: `64 x 64`
  - settings tabs strict aligned: `true`
  - replacement glyph count: `0`

### VPS Codex Migration State

- Correct OpenAI Codex CLI package is `@openai/codex`.
- Do not use `npm install -g codex`; that package is a static documentation generator, not OpenAI Codex CLI.
- Correct install command used on VPS:
  - `npm install -g @openai/codex`
- VPS Codex CLI version:
  - `codex-cli 0.133.0`
- VPS Node.js version:
  - `v22.22.3`
- VPS npm version:
  - `10.9.8`
- VPS tmux version:
  - `tmux 3.4`
- PATH setup added to `~/.bashrc`:
  - `export PATH="$HOME/.local/node-v22.22.3-linux-x64/bin:$HOME/.local/bin:$PATH"`
- Symlink prepared:
  - `~/.local/bin/codex` -> `~/.local/node-v22.22.3-linux-x64/bin/codex`
- VPS Codex config created:
  - `~/.codex/config.toml`
- VPS config trusts the AIBOUX project:
  - `[projects."/home/pkkatsu/aiboux"]`
  - `trust_level = "trusted"`
- Migration proof file exists:
  - `/home/pkkatsu/aiboux/docs/VPS_MIGRATION_SUCCESS.md`

### VPS Codex Authentication State

- `codex doctor` on VPS confirms install/config/PATH are OK.
- `codex doctor` also reports auth is not complete yet:
  - no `~/.codex/auth.json`
  - no supported API key env var found
- A tmux session named `ai-dev` was created for device authentication.
- Inside `ai-dev`, `codex login --device-auth` was started.
- Current expected user action:
  1. Open VS Code Remote SSH to `pkkatsu@85.131.253.64`.
  2. Open folder `/home/pkkatsu/aiboux`.
  3. Open terminal.
  4. Run `tmux attach -t ai-dev`.
  5. Use the URL/code shown in tmux to complete OpenAI device authentication.
  6. After auth completes, run `codex`.
  7. Once Codex is waiting, detach using `Ctrl+B`, then `D`.
- Do not copy local `~/.codex/auth.json` to VPS without explicit user approval. It contains authentication material.
- Do not write API keys into docs or chat.

### VPS Remote Access Notes

- SSH command known to work from Windows:
  - `ssh -i C:\Users\info\.ssh\pkkatsu_vps_ed25519 pkkatsu@85.131.253.64`
- VS Code Remote target folder:
  - `/home/pkkatsu/aiboux`
- Existing remote working tree may be dirty. Do not reset or revert user changes.

### Current Blocker / Next Step

- The only remaining blocker for full VPS-resident Codex operation is user authentication in the `ai-dev` tmux session.
- Once authenticated, run:
  - `codex login status`
  - `codex doctor`
  - `codex`
- After Codex starts successfully, detach from tmux with `Ctrl+B`, then `D`.
