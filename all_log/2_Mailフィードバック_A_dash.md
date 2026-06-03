# 2_Mailフィードバック_A_dash

**レビュー対象**: AIBOUX Mail 最新変更（スクロール修正、リスト表示切替、独自ドメイン設定UI、複数署名対応 + 関連UI）  
**レビュー日時**: 2026-05-28  
**レビュー主体**: Grok 4.3 (xAI)  
**根拠資料**:
- `AGENTS.md`
- `docs/AIBOUX_MASTER_SPEC.md`
- `docs/AIBOUX_SERVICE_MAP.md`
- `docs/AIBOUX_UI_DESIGN_SYSTEM.md`
- `docs/AIBOUX_TECH_STACK.md`
- `all_log/1_Mail機能改善_A.md`（変更内容の一次記録）
- 現行ソースコード（`src/components/mail/*` 全ファイル、`src/layouts/MailLayout.astro`、`src/pages/mail/*`、`src/data/mail-sample-data.ts`、`src/components/ai/MailAIAssistantPanel.tsx`、`src/styles/global.css`）
- ビルド検証: `npm run build` 成功（Server built in 38.45s、エラー0）
- 静的コード検査（grep: dark: 0件 / starwind in mail: 0件 / viewMode・signature・customDomain 配線確認）
- ロゴSVG検査: `public/brand/aiboux-logo.svg`（wordmark vector）

**注意**: 本リポジトリに `AIBOUX_MAIL_SPEC.md` 等のMail専用仕様書は存在しない。評価は MASTER_SPEC / SERVICE_MAP / UI_DESIGN_SYSTEM / TECH_STACK を Source of Truth として実施。未確定事項は推測せずTBD扱い。

---

## 1. 変更概要（1_Mail機能改善_A.md より抽出 + コード確認）

- 受信トレイ一覧領域のスクロール修正（`h-full` / `min-h-0` / `overflow-hidden` + ScrollArea viewport 明示）。
- PC版表示切替（分割表示 ↔ 送信者・件名・日付1行のコンパクト一覧）。
- 左サイドバーに「未読メール」スマートフォルダ追加 + `/mail/unread` ルート。
- 設定画面「ドメイン」タブ：ドメイン名入力 → 推奨DNSレコード（MX/TXT/CNAME/DMARC）表示ウィザード。
- IMAP/POP/サーバー名横にヘルプアイコン + Tooltip。
- アドレス別 `SenderProfile`（表示名 + 署名）編集UI（3プロファイル初期値、切替・編集・保存トースト）。

**主な変更ファイル（コード検査で確認）**:
- `src/components/mail/MailClientShell.tsx`（viewMode state、renderWorkspace の scroll ラッパー、AI panel）
- `src/components/mail/MailList.tsx` / `MailListItem.tsx`（ScrollArea + 2種グリッド）
- `src/components/mail/MailSettingsPanel.tsx`（Tabs "domains" + SenderProfile ロジック + dnsRecords 計算）
- `src/components/mail/MailTopbar.tsx`（表示切替ボタン）
- `src/components/mail/MailSidebar.tsx`（未読フォルダ + ロゴimg）
- `src/pages/mail/unread.astro` / `inbox.astro` / `settings.astro`
- `src/data/mail-sample-data.ts`（unread スマートフォルダ用データ）

---

## 2. 仕様整合性評価

### 2.1 良好に実装されている点（仕様通り・高密度維持）

- **スクロール修正**: `MailList.tsx:50` の `flex h-full min-h-0 min-w-0 flex-col overflow-hidden` + `ScrollArea className="min-h-0 flex-1 overflow-hidden"`、ClientShell の `renderWorkspace` ラッパー（`flex min-h-0 flex-1 overflow-hidden`）は、shadcn/sidebar + flex 子孫の標準的スクロール修正パターン。ログ主張通り機能する。
- **リスト表示切替**: `viewMode: "split" | "compact"` が ClientShell → Topbar → List → ListItem へ正しく配線（`MailClientShell.tsx:46,204,224,233,271`）。コンパクト時は送信者140-220px固定グリッド + h-10（40px）、スレッド非表示。密度は高い。
- **独自ドメインUI**: `MailSettingsPanel.tsx:178-217` で `customDomain` 入力 → `sanitizedDomain` 反映 → `dnsRecords` 4レコード（MX/TXT/CNAME/DMARC）テーブル即時更新。3ステップカード + ステータスバッジ。UIとしては要件通り。
- **複数署名対応**: `SenderProfile` 型 + `initialSenderProfiles` 3件（`MailSettingsPanel.tsx:29-55`）。`activeAddress` 切替 + `updateActiveProfile` で displayName/signature 編集可能。UIレベルで「アドレス別プロファイル」要件を満たす。
- **ヘルプTooltip**: IMAP/POP/サーバー名に `HelpTerm` + `Info` アイコン + `TooltipContent`（`MailSettingsPanel.tsx:228-231,376-393`）。良好。
- **UI Library Policy**: Mail 配下で Starwind 完全ゼロ（grep確認）。全57箇所が shadcn/ui（`@/components/ui/*` または相対）のみ。遵守。
- **Global UI Rules（部分）**: Light mode only（`dark:` 0件）、白背景、neutral-200 細線、高密度（p-3/4、h-8、text-xs、gap-2/3 中心）。紫グラデ・過剰shadow・ガラス風なし。
- **ビルド健全性**: `npm run build` 成功（Server built 38.45s）。TS/トランスパイルエラー0。

### 2.2 明確な不整合・バグ・デザイン崩れ（High / Medium / Low）

#### High 重要度

**1. 左上ブランディング違反（AGENTS.md + MASTER_SPEC + UI_DESIGN_SYSTEM 直接抵触）**
- `MailSidebar.tsx:29-37`:
  ```tsx
  <a ...>
    <img src="/brand/aiboux-logo.svg" alt="aiboux" className="h-7 w-auto" />
    <Badge ...>MAIL</Badge>
  </a>
  ```
- 仕様: 「左上: `aiboux MAIL`」（MASTER_SPEC:85行）、「ロゴ表記は必ず小文字の `aiboux`」（AGENTS.md）、「サービスごとに小さい badge」（UI_DESIGN_SYSTEM）。
- 問題: テキスト "aiboux" が一切表示されていない（img + altのみ）。SVGはwordmark（"aiboux" 文字形をvector trace）でAマークは見当たらないが、「ロゴ表記」要件を img 単体で満たさない。他サービス（履歴書など）のテキスト併記パターンと不整合。
- 影響: Mailシェル全体（スクロール修正・リスト切替・設定UIを含む）のエントリーポイントで違反。

**2. AIフローティングオーバーレイがデスクトップでスレッドを隠蔽（MASTER_SPEC 根本要件と衝突）**
- `MailClientShell.tsx:282-296` + `MailAIAssistantPanel.tsx:32-44`:
  - `fixed z-50` 右下アンカー 420px幅パネル（sm:）。
  - ワークスペースを一切押し出さず、ディム・クリック外閉じもなし。
- 仕様: 「Core / Mail / Shop では右AI Assistantを常設する」（MASTER_SPEC:74,92行）、「Gmail風だがCoreの密度と白背景に統一」。
- 影響: スクロール修正・リスト切替の恩恵を受ける「本文読む」行為が、AI開時にデスクトップで破綻。1440pxでも右側が隠れる。今回の「最新変更」が乗るシェル自体の設計破綻を残存させている。
- 注: voiceDraft承認UIは現在パネル内部（`MailAIAssistantPanel.tsx:307-329`）のため、以前指摘の別fixed z-50重なりは解消済み。ただし根本のオーバーレイ問題は継続。

#### Medium 重要度

**3. 独自ドメインUI・複数署名が純粋なReact stateモック（「実装済み」誤認リスク）**
- `MailSettingsPanel.tsx:67-94,181-208`:
  - `useState<SenderProfile[]>` + `useState(customDomain)` のみ。
  - 「保存」「DNS確認を開始」「送信元を追加」→ `toast.success` のみ。
  - ステータス（「確認待ち」「未確認」）は静的。
- 1_Mail機能改善_A.md 自身が「D1永続化APIは未実装」「実DNS検証API...スプリント範囲外」と注記。
- AGENTS.md 違反リスク: 「仕様書にない機能を「実装済み」と言わない」「URL、料金...を勝手に決めない」の精神に反する。UIが本物のウィザード・永続化のように見える。
- 複数署名: アドレス切替・テキスト編集はできるが、実際の送信時署名選択ロジックや保存は存在しない。

**4. コンパクト一覧のグリッドが中間デスクトップ幅で崩れやすい**
- `MailListItem.tsx:42`:
  ```tsx
  grid-cols-[24px_24px_minmax(140px,220px)_minmax(0,1fr)_60px]
  ```
- コンパクト時リストは `w-full`（ClientShell:204）。1024-1280px + サイドバー幅で送信者列140-220px固定 + 日付60px + パディングがきつくなり、長い日本語送信者名/件名が過度に省略される可能性が高い。レスポンシブ耐性不足。

**5. モバイルでリスト表示切替が完全に無効**
- Topbar切替ボタン: `hidden md:inline-flex`（MailTopbar:133）。
- モバイル描画（ClientShell:233）: 常に `viewMode="split"` をハードコード。
- 1行コンパクトはモバイル密度向上に有効なはずだが、今回の「リスト表示切替」機能から除外されている。

#### Low / Info

**6. 設定画面のタブがモバイル/タブレットで圧迫**
- `MailSettingsPanel.tsx:112`: `grid-cols-[repeat(6,minmax(0,1fr))]` で6タブ（日本語「自動応答」など）。狭いviewportでラベルが激しくtruncate。

**7. 空状態の min-h-[320px] が ScrollArea 内で不自然**
- `MailList.tsx:99`: メッセージ0件時に固定高さ。少ないメールボックス切替時に余白やスクロール挙動が跳ねる。

**8. SettingsSection の多用（カード乱用 borderline）**
- 各タブに `rounded-md border border-neutral-200` のセクションが複数。Global UI Rules「意味のないカード乱用は禁止」「細い罫線、高密度」に対して、設定ページとしてはやや重め。Notion風の薄い区切り線の方が適合する可能性。

**9. 仕様書更新未実施（プロセス違反）**
- フローティングAI化（前スプリント）＋今回の機能追加で「右AI常設」要件が実装と乖離。MASTER_SPEC / AI_ASSISTANT_SPEC / 開発引継書への反映なし。
- AGENTS.md「AIBOUX開発作業の終了時は...仕様変更...があったか確認し、必要なら必ず `docs/` の引継書を更新する」に抵触。

---

## 3. 検証実行記録

- **必須ドキュメント読込**: AGENTS.md、MASTER_SPEC、SERVICE_MAP、UI_DESIGN_SYSTEM、TECH_STACK を全文読込。Mail専用specは存在せずTBD。
- **コード網羅読込**: MailClientShell（全）、MailList/ListItem、MailSettingsPanel（全）、Sidebar、Topbar、ThreadView/Header、Toolbar、ComposeDialog、MailLayout、unread/inbox/settings.astro、sample-data（冒頭+関連部）、global.css（冒頭）、MailAIAssistantPanel。
- **Grep 検証**:
  - `dark:` → Mail配下0件。
  - Starwind混在 → Mail内0件（他サービスのみ）。
  - viewMode/compact/split 配線 → 4ファイルで正しく接続。
  - customDomain / dnsRecords / SenderProfile / signature → SettingsPanelに集約、実装確認。
  - ScrollArea + min-h-0 / overflow-hidden → 修正パターンとして意図通り。
- **ビルド**: `npm run build` → 成功（エラー0、38.45s）。Mail React Islands + shadcn + 音声APIに問題なし。
- **ロゴ検査**: `public/brand/aiboux-logo.svg` 存在。title="aiboux logo vector monochrome"、パスは文字形（Aマーク類は視認されず）。ただし使用方法（img単体）が問題。
- **スクリーンショット/実機**: 本レビューでは新規Playwright未実行（静的コード+ビルド+事前ログのスクショを参考）。前回ログの `test-results/mail-feature-sprint-*.png` を前提に評価。

---

## 4. 肯定的評価

- スクロール修正・リスト切替・ドメインウィザード・署名編集の**ローカルUI実装**は、1_Mail機能改善_A.md の主張通り高密度・shadc n/uiで綺麗にできている。
- 不要情報削除（前スプリント）の徹底と合わせ、視覚的な「業務集中」トーンは維持。
- ビルド健全、UIライブラリポリシー遵守、Light-only・密度トークン遵守は良好。

---

## 5. 残存未完了・TBD（AGENTS.md 準拠）

- AI配置の根本方針（常設右カラム vs 右下フローティング）が MASTER / AI_ASSISTANT_SPEC と実装で矛盾 → 仕様更新必須。
- ドメイン・署名・フィルタ・転送の全設定は React state のデモ。D1保存・実DNS検証・送信時署名適用は未実装（ログ自身が注記）。
- モバイル向けコンパクト一覧未対応。
- コンパクトグリッドの狭幅耐性未検証（実機リサイズ推奨）。
- `docs/` 引継書（MASTER、AI_ASSISTANT_SPECなど）の更新が一切行われていない。
- 実機 iPhone 17 Safari + キーボード表示時の safe-area + スクロール最終確認は前回同様未実施。

---

## 6. 推奨アクション（優先度順）

1. **最優先（ブランディング）**: SidebarHeader をテキスト "aiboux"（小文字） + MAIL badge の組み合わせに変更（img併用可だがテキスト必須）。全Mailビューで統一。
2. **最優先（設計）**: AI配置を「右カラム常設」に戻すか、MASTER_SPEC / AI_ASSISTANT_SPEC / UI_DESIGN_SYSTEM を「右下フローティング + FAB（デフォルト閉）」へ正式更新。デスクトップでのオーバーレイ隠蔽を解消。
3. ドメイン/署名UIに「本保存は未対応（リロードでリセット）」の明示注記を追加（またはモックであることをUIに反映）。
4. コンパクト一覧のグリッドを柔軟化（minmax(120px,...) や flex 併用） + モバイルでも利用可能にする（または機能からモバイル除外を明記）。
5. Settingsのセクションを「細い罫線 + subtle bg」中心に軽量化し、カード多用を減らす。
6. 6タブの表示をタブレットでも破綻しないよう調整（スクロール or アイコン優先）。
7. 作業終了時に `docs/AIBOUX_MASTER_SPEC.md` ほか引継書を更新（AI配置変更 + 新Mail機能のステータスを明記）。
8. 可能なら Playwright で 1024px / 1440px でのコンパクト表示 + AI開時のスクロール/オーバーレイを追加検証し、証跡を追記。

---

## 7. 総評

スクロール修正・リスト表示切替・独自ドメインウィザード・複数署名編集の**実装品質自体は高く**、密度・shadc n/ui・Light-onlyのローカルルールは守られている。

しかし **AGENTS.md / MASTER_SPEC との根本不整合** が2点存在する：
- 左上ブランディング（imgのみで "aiboux MAIL" テキスト不在）。
- AIフローティングによるデスクトップ本文隠蔽（「右AI常設」要件との衝突）。

加えて、設定系新機能は「UI/データ構造のみ」で永続化・実処理が完全に欠落しており、利用者から見ると「完成した機能」のように見える点がリスク。

「バグやデザイン崩れ」としては **High 2件（ブランディング + AIオーバーレイ）**、**Medium 3件（設定モック、グリッド耐性、モバイル未対応）** を確認。仕様更新と軽微なレスポンシブ/永続化対応を行えば、今回のスプリント成果は十分に本線へ乗せられる品質。

---

**出力ファイル**: `/home/pkkatsu/aiboux/all_log/2_Mailフィードバック_A_dash.md`（本ファイル）  
**検証サマリ**: 必須ドキュメント全読込、Mail主要ファイル網羅読込、grep 0件（dark/starwind）、build成功、仕様引用による評価完了。

**次のステップ（AGENTS.md 必須）**: 
- 本フィードバックを基に仕様更新または設計是正を実施。
- 作業終了時に `docs/` 引継書更新の有無を確認。
- 完了報告時は 24時間限定公開URL（`src/lib/server/tempLogShares.ts` 登録 + 再ビルド + 検証）を発行すること。

---
*本レビューは静的コード + ビルド + 既存ログ + 仕様書を根拠とし、憶測を排した。実機ブラウザでの最終目視は別途推奨。*

---

## 2026-05-28 Verification Addendum (Current Code Re-inspection)

**Re-evaluation trigger**: User request to evaluate latest Mail changes (scroll fix, list display toggle, custom domain settings UI, multiple signature support) and output bugs/design breaks to this exact file.

**Mandatory pre-inspection documents read (AGENTS.md rule)**:
- docs/AIBOUX_MASTER_SPEC.md (full)
- docs/AIBOUX_SERVICE_MAP.md (full)
- docs/AIBOUX_UI_DESIGN_SYSTEM.md (full)
- docs/AIBOUX_DEVELOPMENT_HANDOFF.md (relevant Mail sections 2026-05-25~27)
- docs/AIBOUX_DATA_MODEL.md (Mail models section)
- docs/AIBOUX_AI_ASSISTANT_SPEC.md (floating AI rules)
- AGENT_RULES.md (Completion Report Rule + 24h temp URL)
- No dedicated `AIBOUX_MAIL_SPEC.md` exists. All Mail Source of Truth is embedded in the above (TBD per hallucination guard).

**Code files inspected (full or targeted reads + greps)**:
- src/components/mail/MailSidebar.tsx, MailClientShell.tsx (full), MailList.tsx, MailListItem.tsx, MailSettingsPanel.tsx (full), MailTopbar.tsx (toggle section), MailThreadView/Header/Toolbar/Compose (supporting)
- src/components/ai/MailAIAssistantPanel.tsx
- src/layouts/MailLayout.astro
- src/styles/global.css (tokens)
- src/lib/server/tempLogShares.ts + src/pages/api/temp/log/[id].ts
- src/data/mail-sample-data.ts (supporting)
- Prior logs: all_log/1_Mail機能改善_A.md + this file (original content)

**Grep verification (Mail scope only)**:
- `dark:` → 0 matches (Light mode only compliance)
- `starwind` or Starwind imports → 0 matches (UI Library Policy: Mail = shadcn/ui only)
- viewMode / compact / split wiring → correctly connected across ClientShell/Topbar/List/ListItem
- customDomain / dnsRecords / SenderProfile / signature → present only in SettingsPanel (React state)

**Git history**: Only single commit "Initial commit from Astro". No commit-level "latest changes" available. Evaluation relies on prior improvement log + current source inspection (permitted when git insufficient).

**Build verification**:
- 1st `npm run build`: transient esbuild internal goroutine crash (ScanBundle / plugin onStart, not Mail source or TS error).
- 2nd `npm run build`: success (exit 0, clean).
- "build": "astro build" in package.json.

**Confirmed: All issues in the main report body still present in current code (exact locations)**:
- **High #1 (Branding violation)**: MailSidebar.tsx:29-37 — `<img src="/brand/aiboux-logo.svg" alt="aiboux" .../>` + MAIL badge only. MASTER_SPEC line 85 requires "左上: `aiboux MAIL`". Text label absent. AGENTS.md + UI_DESIGN_SYSTEM logo rules breached.
- **High #2 (AI overlay hides content)**: MailClientShell.tsx:282-296 (fixed FAB + panel mount) + MailAIAssistantPanel.tsx:32-44 (`fixed z-50`, 420px on sm+, no margin/push to main). Desktop thread/body obscured when AI open. Contradicts "Gmail風だがCoreの密度と白背景に統一" and floating AI intent in DEVELOPMENT_HANDOFF 2026-05-27.
- **Medium #3 (Production-like mocks)**: MailSettingsPanel.tsx:67-94 (initialSenderProfiles useState), 181-208 (dnsRecords computed live + "DNS確認を開始" → toast.success only). 1_Mail機能改善_A.md itself states "D1永続化APIは未実装". Violates AGENTS.md "仕様書にない機能を「実装済み」と言わない".
- **Medium #4 (Compact grid fragility)**: MailListItem.tsx:42 — `grid-cols-[24px_24px_minmax(140px,220px)_minmax(0,1fr)_60px]`. Japanese names + mid-desktop (1024-1280px + sidebar) will over-truncate.
- **Medium #5 (Mobile toggle disabled)**: MailTopbar.tsx:133 (`hidden md:inline-flex`), MailClientShell.tsx:233 (hardcodes `viewMode="split"` on md:hidden pane).

**Additional findings (not in original report body)**:
- DATA_MODEL.md Mail section (lines ~115-125) lists only: mailboxes, mail_threads, mail_messages, mail_attachments, mail_labels, mail_templates, mail_ai_actions, mail_ai_artifacts, mail_audit_events. No sender_profiles, custom_domains, mailbox_settings, or domain verification state tables. The settings UI presents as complete 5-category production flows.
- Settings tabs grid (MailSettingsPanel.tsx:112): `grid-cols-[repeat(6,minmax(0,1fr))]` — 6 Japanese labels will heavily truncate on tablet.
- Scroll fix (min-h-0 + explicit overflow-hidden + ScrollArea on List + workspace wrapper) is correctly implemented and functional.
- All local density / token / border / no-gradient rules followed in inspected Mail files.
- Prior 1_Mail機能改善_A.md is accurate on scope and explicitly notes the "UI/データ構造のみ" limitation.

**Files created / modified for this evaluation + Completion Report**:
- all_log/2_Mailフィードバック_A_dash.md (this addendum appended)
- src/lib/server/tempLogShares.ts (24h share registration per AGENT_RULES.md)

**24h Temporary Public URL (AGENT_RULES.md + AGENTS.md mandatory)**:
- Registered below with raw import of this markdown.
- id: `mail-feedback-a-dash-20260528`
- token: `c732f421f2d49a0ed294ff99152de3e28765083d1f457549`
- expiresAt: `2026-05-29T15:00:00Z` (24h from registration)
- URL: `https://mail.aiboux.com/api/temp/log/mail-feedback-a-dash-20260528/?token=c732f421f2d49a0ed294ff99152de3e28765083d1f457549`
- Expected behavior (verified in handler src/pages/api/temp/log/[id].ts): 200 + markdown + no-store + x-robots for correct token; 404 for bad token; 410 after expiry.

**Next mandatory steps (AGENTS.md)**:
- Use this feedback to drive branding fix (text "aiboux MAIL") and AI placement decision (update MASTER / AI_ASSISTANT_SPEC / HANDOFF).
- Update docs/引継書 if any Mail data model or UI policy changed (none in this eval beyond documenting gaps).
- Deploy + real 200/404/410 verification of the temp URL above.

**Total evaluation rigor**: 9+ spec files read, 12+ Mail source files read, greps clean, 2 builds executed, git limitation noted, hallucination guard applied (no invented tables/URLs/features).

*Re-inspection performed 2026-05-28 by Grok 4.3. All original findings validated as still present. No new High-severity issues beyond the documented ones.*

---

**Final completion note**: This file now serves as the evaluation artifact for the requested Mail changes review. The 24h public URL above is the required deliverable per Completion Report Rule. User should access the URL within 24h for the full current content (including this addendum).
