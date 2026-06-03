# AIBOUX Codex Execution Contract + Delivery Detail Design v5

作成日: 2026-05-31

対象:
- AIBOUX VPS / Codex
- Core `/core/deliveries`
- 納品書詳細画面

## 0. 目的

この指示書は、Codexが同じ失敗を繰り返さないための実行契約である。

Codexはチャットの口頭指示だけで作業してはいけない。必ずMarkdown指示書を作り、その指示書に対して実装・検証・報告を行う。

主要目的:
1. Markdown指示書、自動ゲート、公開URL、視覚検証でAIBOUX運用を強制改善する。
2. 納品書詳細画面のデザイン修正を、公開プレビュー、スクリーンショット、視覚差分、複数viewportで検証する。
3. 3回成果が出なければ同じ方法を続けず、Codex自身の進め方を変える。
4. 成果が出ていても毎日改善する。
5. Grok / Cloudflare AI は補助レビューへ格下げし、主判定はPlaywright、公開プレビュー、curl、スクリーンショット、ゲートスクリプトで行う。

## 1. 現行ブロッカー

- 公開プレビューが素HTML表示になり、Tailwind/shadcn/uiが未適用だった。
- CSS assetが404になっていた。
- 公開プレビューURLのHTTP 200だけで合格扱いしていた。
- Bark通知はAPI成功相当でも `userReceiptConfirmed=false` のままだった。
- CODE_READYを繰り返しながら、ユーザー実画面ではデザインが直っていなかった。
- 3URL提示にNUL/制御文字が混入した。
- `/g/cdeliv9` が古いCOMPLETEDログのまま残り、最新証跡と矛盾した。
- Wrangler認証が未復旧で本番反映できないのに、ログやtrycloudflare URLを増やして前進しているように見せた。

## 2. 最重要ルール

### 2.1 Markdown指示書なしで実装禁止

Codexはユーザー指示を受けたら、必ず以下を作成・更新してから作業する。

- `ops/instructions/current.md`
- `ops/instructions/YYYYMMDD_task_name.md`

今回の個別指示書:

- `ops/instructions/20260531_codex_execution_contract_and_delivery_v5.md`
- `ops/instructions/20260531_core_delivery_detail_design_v5.md`

CodexはMarkdown指示書に書かれていないことを「実装済み」「完了」「合格」と報告してはいけない。

### 2.2 Three-Strike Method Improvement Rule

同じタスクでユーザーから3回以上「直っていない」「見えない」「反映されていない」「おかしい」と言われたら、Codexは作業を続ける前に方法を変える。

1回目の差し戻し:
- 指摘内容を `ops/instructions/current.md` に追記する。
- 実画面スクリーンショットを確認する。
- 対象を1から3個の問題に絞る。

2回目の差し戻し:
- 既存の修正方針を疑う。
- レイアウト構造、データフロー、公開URL、テスト観点のどれが間違っているかを特定する。
- `all_log` に原因仮説と変更する検証方法を書く。

3回目の差し戻し:
- 同じ方法を続けることは禁止。
- `Status: BLOCKED_METHOD` または `BLOCKED_DESIGN` にする。
- 実装を一旦止める。
- 画面構造または検証方法を変更する。
- Playwright screenshot comparison、Trace Viewer、Chrome DevTools、public preview visual checkを導入する。
- 必要なら指示書を新規に作り直す。
- Bark、AIレビュー、ログ更新に逃げない。
- ユーザーへ「方法を変更した」と明記してから再開する。

### 2.3 Daily Improvement Rule

Codexは良い結果が出ている日でも、AIBOUX運用を毎日改善する。

毎日1回、以下を確認する。
- Codex / AGENTS.md / Skills の公式ドキュメント
- Playwright の公式ドキュメント
- Chrome DevTools / MCP / frontend debugging の公式ドキュメント
- Cloudflare Workers / Wrangler / preview / deploy の公式ドキュメント
- Visual regression testing の有効な方法
- AIBOUXで前日に失敗した原因

作成または更新:

- `ops/improvements/YYYYMMDD_daily_improvement.md`

改善がない場合でも、ゲート、指示書、検証、公開URL、UI検査のいずれかを1つ強化する。

## 3. ステータス定義

Codexは以下のステータスだけを使う。

- `CODE_READY`
- `PREVIEW_READY`
- `DEPLOYED`
- `FINAL_ACCEPTED`
- `USER_ACTION_REQUIRED`
- `BLOCKED`
- `BLOCKED_DESIGN`
- `BLOCKED_PREVIEW`
- `BLOCKED_METHOD`
- `BLOCKED_AGENT_COMPLIANCE`

`COMPLETED` は `FINAL_ACCEPTED` と同義である。それ以外では `COMPLETED` と書いてはいけない。

## 4. 必須運用ファイル

必須:
- `ops/instructions/current.md`
- `.agents/skills/aiboux-instruction-compliance/SKILL.md`
- `AGENTS.md`
- `AGENT_RULES.md`
- `AIBOUX_MASTER_DOCUMENT.md`
- `scripts/check-control-chars.mjs`
- `scripts/aiboux-gate-check.mjs`
- `package.json`

## 5. 自動ゲート

### check:control-chars

`scripts/check-control-chars.mjs` は以下を検査する。

- `all_log`
- `AIBOUX_MASTER_DOCUMENT.md`
- `AGENTS.md`
- `AGENT_RULES.md`
- `docs`
- `ops/instructions`
- `ops/improvements`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`
- `/tmp/aiboux-log-share`

検出対象:
- NUL: `\x00`
- disallowed control chars: `\x01-\x08`, `\x0B`, `\x0C`, `\x0E-\x1F`, `\x7F`

許可:
- `\n`
- `\r`
- `\t`

### gate split

- `gate:code`
- `gate:preview`
- `gate:deploy`
- `gate:final`

`gate:code` はcurrent instruction、control-char、mojibake、astro check、build、local Playwright evidence、required screenshotsを確認する。

`gate:preview` はpublic preview URL、HTTP 200、CSS/JS asset 200、public style check、raw browser default UIなし、3URL Bundleを確認する。

`gate:deploy` はWrangler auth、deploy、Worker Version ID、本番URL、`/g`最新、public UTF-8を確認する。

`gate:final` は必要なレビュー、Hermes、Bark `userReceiptConfirmed=true`、完了ログと公開URLの一致を確認する。

## 6. UI作業ルール

必須viewport:
- `1980x1080`
- `1650x900`
- `1440x900`
- `1366x768`

必須スクリーンショット:
- `output/playwright/core-documents-redesign/<task>-1980.png`
- `output/playwright/core-documents-redesign/<task>-1650.png`
- `output/playwright/core-documents-redesign/<task>-1440.png`
- `output/playwright/core-documents-redesign/<task>-1366.png`

必須検査:
- page horizontal overflow <= 2px
- header actions not clipped
- save button visible
- footer not overlapping content
- table operation column visible
- CSS/JS assets loaded
- no raw blue browser links
- shadcn/Tailwind applied
- no stale preview URL
- 3URL Bundle present
- no control characters
- no mojibake

Playwright `toHaveScreenshot()` を導入し、失敗時はTrace Viewerで原因を確認できるようにする。

## 7. Core Delivery Detail Design v5

対象:
- `/core/deliveries`
- 納品書詳細画面

目的:
- 右端切れを直す。
- 上段情報密度を上げる。
- 明細表示量を増やす。
- 固定フッターと本文の干渉をなくす。
- public previewで見える状態を証跡にする。

Done条件:
- `check:control-chars` PASS
- `check:mojibake` PASS
- `astro check` PASS
- build PASS
- Playwright visual checks PASS
- `gate:code` PASS
- `gate:preview` PASS
- 3URL Bundleあり
- Barkは送らない。v2 final-only policyにより中間通知は禁止。

## 8. 3URL Bundle

ユーザー報告時は必ず以下を出す。

1. マスター更新プレビューURL
2. 実行ログプレビューURL
3. 画面プレビューURL

禁止:
- localhost URL
- 127.0.0.1
- ローカルファイルパス
- スクショパスだけ
- 古いURL
- NUL/制御文字入りURL
- 文字化けURL
- 古い `/g/cdeliv9`

## 9. Bark

Superseded by `ops/instructions/20260531_codex_execution_contract_v2_bark_final_only.md`.

Bark is final-only by policy.

Do not send Bark for CODE_READY, PREVIEW_READY, DEPLOYED, BLOCKED, BLOCKED_DESIGN, BLOCKED_PREVIEW, BLOCKED_METHOD, BLOCKED_AGENT_COMPLIANCE, or USER_ACTION_REQUIRED.

Intermediate logs must state:
- notification: not sent
- reason: Bark notifications are final-only by policy.

## 10. 報告フォーマット

```md
# Core Delivery Detail Design Fix v5

## Status
CODE_READY / PREVIEW_READY / USER_ACTION_REQUIRED / BLOCKED_DESIGN

## Instruction File
- ops/instructions/20260531_core_delivery_detail_design_v5.md

## Fixed
- ...

## 3 Required URLs
- マスター更新プレビューURL: ...
- 実行ログプレビューURL: ...
- 画面プレビューURL: ...

## Verification
- check:control-chars: PASS
- check:mojibake: PASS
- astro check: PASS
- build: PASS
- local Playwright: PASS
- public Playwright: PASS
- gate:code: PASS
- gate:preview: PASS

## Bark
- notification: not sent
- reason: Bark notifications are final-only by policy.
- secretLogged: false

## Notes
- Not DEPLOYED
- Not FINAL_ACCEPTED
- Not COMPLETED
```

## 11. 絶対禁止

- 指示書なしで実装。
- チャット指示だけで実装。
- CODE_READYをCOMPLETEDと書く。
- Bark `userReceiptConfirmed=false` でFINAL_ACCEPTED。
- Grok smokeを承認扱い。
- Cloudflare AI疎通を承認扱い。
- Hermes HERMES_READY失敗をPASS扱い。
- 旧URLを最新として提示。
- 3URLなしで報告。
- NUL制御文字入りURL。
- 文字化けログ。
- CSS/JS未読込の公開プレビュー。
- local screenshotだけでユーザー確認扱い。
- trycloudflare URL乱発。
- secret未入力でdeploy再試行ループ。
- 3度成果が出ないのに同じやり方を続ける。

## 12. 外部参考資料

- OpenAI Codex AGENTS.md guide: https://developers.openai.com/codex/guides/agents-md
- OpenAI Codex Agent Skills: https://developers.openai.com/codex/skills
- Playwright visual comparisons: https://playwright.dev/docs/test-snapshots
- Playwright Trace Viewer: https://playwright.dev/docs/trace-viewer
- Chrome DevTools for agents: https://developer.chrome.com/docs/devtools/agents/get-started
- Chrome DevTools MCP: https://github.com/ChromeDevTools/chrome-devtools-mcp
- Storybook visual testing: https://storybook.js.org/docs/writing-tests/visual-testing
- Chromatic visual testing: https://www.chromatic.com/docs/visual/
- Percy visual testing: https://percy.io/

## 13. 最終要点

- すべてMarkdown指示書にする。
- 3回失敗したら方法を変える。
- 毎日改善する。
- ユーザーには公開URLで見せる。
- 3URL Bundleなしで報告しない。
- CODE_READYとCOMPLETEDを混同しない。
- デザインはPlaywright視覚検証で落とす。
- Grok / Cloudflare AIは補助にする。
- Barkはステータスに応じて扱いを分ける。
- NUL/文字化け/古いURLは即失格。
