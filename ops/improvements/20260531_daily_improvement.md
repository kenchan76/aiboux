# AIBOUX Daily Improvement 2026-05-31

## Yesterday's Failures

- 納品書詳細画面でCODE_READYログを出した後も、公開プレビューではCSS/JS未読込やデザイン不十分が残った。
- 3URL Bundleに制御文字が混入し、報告とBark通知の証跡として不合格になった。
- BarkはAPI成功相当でも `userReceiptConfirmed=false` のままで、FINAL_ACCEPTED条件を満たしていない。
- `/g/cdeliv9` は古いCOMPLETEDログを返しており、最新証跡として扱えなかった。

## What Changed In Tools / Docs

- Codex運用では `AGENTS.md` とSkillに継続ルールを置く方針をAIBOUX側の実行契約に固定した。
- Playwright visual comparisons と Trace Viewer をUI検査の標準証跡にした。
- Chrome DevTools / MCP系の調査項目を、CSS/JS asset、computed style、grid/flex、overflow確認に落とし込んだ。

参照:
- https://developers.openai.com/codex/guides/agents-md
- https://developers.openai.com/codex/skills
- https://playwright.dev/docs/test-snapshots
- https://playwright.dev/docs/trace-viewer
- https://developer.chrome.com/docs/devtools/agents/get-started

## Improvement To Apply Today

- Three-Strike Method Improvement Ruleを追加する。
- 同じユーザー可視成果で3回差し戻された場合、同じ方法を続けず `BLOCKED_METHOD` として方法を変える。
- `ops/improvements` を制御文字検査対象に追加する。
- 日次改善ログを必須化する。
- `aiboux-design-review` skillを追加する。
- `gate:design` を追加し、公開プレビューの見た目崩れを機械的に落とす。
- 2026-05-31夜の追加確認: Astro公式Middleware docsで `context.rewrite()` はURLバーを変えず別ページ内容を表示する用途と確認したため、サービスサブドメイン直下から内部mountへはredirectではなくmiddleware rewriteを使う。
- 2026-05-31夜の追加確認: Cloudflare公式Wrangler docsで `--keep-vars` / `keep_vars` の扱いを確認したため、通常デプロイ時は既存Dashboard変数を壊さないよう `wrangler deploy --keep-vars` を維持する。
- 追加プロセス改善: サービスサブドメイン移行タスクでは、root、`/s/{tenant}/`、`/s/{tenant}/admin`、custom-domain相当の4種をmiddleware単体で検査するPlaywrightまたはcurl証跡を必須にする。

追加参照:
- https://docs.astro.build/en/reference/modules/astro-middleware/
- https://developers.cloudflare.com/workers/wrangler/commands/workers/
- https://developers.cloudflare.com/workers/wrangler/configuration/

## Files To Update

- `ops/instructions/20260531_codex_execution_contract_and_delivery_v5.md`
- `ops/instructions/current.md`
- `.agents/skills/aiboux-instruction-compliance/SKILL.md`
- `AIBOUX_MASTER_DOCUMENT.md`
- `AGENTS.md`
- `AGENT_RULES.md`
- `scripts/check-control-chars.mjs`
- `.agents/skills/aiboux-design-review/SKILL.md`
- `scripts/aiboux-design-gate.mjs`
- `PRODUCT.md`
- `DESIGN.md`

## Gate To Add Or Strengthen

- `check:control-chars` に `ops/improvements` を追加。
- Three-strike運用をMaster/AGENTS/Skillへ追加。
- `BLOCKED_METHOD` と `BLOCKED_AGENT_COMPLIANCE` を正式ステータスに追加。
- `gate:design` を追加し、`gate:code` と `gate:preview` から呼び出す。
