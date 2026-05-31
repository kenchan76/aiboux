# Dirty Tree Cleanup Plan

## Captured

- Date: 2026-06-01 JST
- Scope: classification only
- Previous completed commit: `88a0577e78d4dd42fb88f6e99af202074ccaa254`
- `origin/main == HEAD`: yes, `88a0577e78d4dd42fb88f6e99af202074ccaa254`
- `npm run gate:aiboux`: previously `AIBOUX_GATE_PASS`
- Worker Version ID: `f8867df3-aab9-439b-bf8d-634ada05191d`
- Bark notification: not sent
- Destructive operations: not run
- Reset/clean/delete/force push: not run
- Secret/PAT/API key output: not performed

## Source Evidence Read

- `all_log/77_codex_dirty_tree_triage_after_push.md`
- `all_log/78_codex_public_url_recheck_after_push.md`
- `AIBOUX_MASTER_DOCUMENT.md`
- `ops/instructions/current.md`

## Fresh Dirty Tree Snapshot

Commands run:

```text
git status --short
git diff --name-only
git ls-files --others --exclude-standard
git status --short --untracked-files=all
```

Counts:

```text
git status --short lines: 345
git status --short --untracked-files=all lines: 1215
git ls-files --others --exclude-standard lines: 1202
git diff --name-only lines: 13
```

Note: the 13 tracked diff files include `ops/instructions/current.md`, which was modified only for this cleanup-plan task. The pre-existing source/config tracked diff count remains 12.

Tracked changed files:

```text
.gitignore
astro.config.mjs
ops/instructions/current.md
package-lock.json
package.json
public/favicon.ico
public/favicon.svg
src/assets/astro.svg
src/assets/background.svg
src/components/Welcome.astro
src/layouts/Layout.astro
src/pages/index.astro
tsconfig.json
```

Untracked top-level summary:

```text
616 src
210 output
197 all_log
30 quoted all_log paths
27 ops
22 docs
20 tests
19 migrations
13 db
13 quoted output paths
8 scripts
5 public
3 tools
3 .agents
1 wrangler.toml
1 worker-configuration.d.ts
1 test-results
1 starwind.config.json
1 schema.sql
1 playwright.config.ts
1 components.json
1 PRODUCT.md
1 DESIGN.md
1 AIBOUX
1 AGENT_RULES.md
1 AGENTS.md
1 .vscode
1 Japanese zero-byte marker: Mailサービスサイト
1 Japanese zero-byte marker: 対応テナントの
1 Japanese zero-byte marker: 旧
```

## Classification A: Required For Next Task

Keep these until the next implementation decision is made. They are likely required to keep the current AIBOUX app buildable, testable, or deployable.

- Tracked app/config changes:
  - `.gitignore`
  - `astro.config.mjs`
  - `package.json`
  - `package-lock.json`
  - `tsconfig.json`
  - `src/pages/index.astro`
  - `public/favicon.ico`
  - `public/favicon.svg`
  - deleted Astro starter files: `src/assets/astro.svg`, `src/assets/background.svg`, `src/components/Welcome.astro`, `src/layouts/Layout.astro`
- Untracked app/source/config groups:
  - `.agents/`
  - `AGENTS.md`
  - `AGENT_RULES.md`
  - `DESIGN.md`
  - `PRODUCT.md`
  - `components.json`
  - `db/`
  - `migrations/`
  - `playwright.config.ts`
  - `public/brand/`
  - `public/g/`
  - `schema.sql`
  - `scripts/aiboux-design-gate.mjs`
  - `scripts/check-control-chars.mjs`
  - `scripts/check-mojibake.mjs`
  - `scripts/compare-reference-image.mjs`
  - `scripts/prepare-preview-wrangler-config.mjs`
  - `scripts/run-delivery-detail-design-loop.mjs`
  - `scripts/setup-bark-secret.sh`
  - `scripts/setup-cloudflare-secret.sh`
  - `src/components/`
  - `src/data/`
  - `src/env.d.ts`
  - `src/hooks/`
  - `src/layouts/`
  - `src/lib/`
  - `src/middleware.ts`
  - `src/pages/`
  - `src/styles/`
  - `src/worker.ts`
  - `src/workers/`
  - `starwind.config.json`
  - `tests/`
  - `tools/`
  - `worker-configuration.d.ts`
  - `wrangler.toml`

Reason: these items are source, config, tests, gates, Cloudflare Worker configuration, routes, public short URL artifacts, and agent rules. Deleting them before a source-control decision would be destructive.

## Classification B: Evidence To Preserve

Keep or archive these. They are evidence for previous UI, deployment, review, and URL-bundle work.

- `all_log/` evidence files:
  - total files currently under `all_log/`: 235
  - untracked evidence files under `all_log/`: 227
- Important recent evidence already committed:
  - `all_log/77_codex_dirty_tree_triage_after_push.md`
  - `all_log/78_codex_public_url_recheck_after_push.md`
  - `all_log/79_worker_version_id_evidence_after_push.md`
  - `all_log/79_worker_versions_list_aiboux.json`
  - `all_log/79_worker_deployments_list_aiboux.json`
  - `all_log/80_push_user_action_required_after_worker_version_gate.md`
- Other evidence groups:
  - `docs/archive/`
  - `docs/codex_briefs/`
  - `ops/design/`
  - `ops/improvements/`
  - historical task files under `ops/instructions/`
  - `output/playwright/`
  - `output/reference/`
  - `output/reports/`
  - `output/review-packs/`
  - `test-results/`

Reason: AIBOUX acceptance relies on logs, screenshots, review packs, public URL artifacts, and historical instructions. These should be archived or committed intentionally, not deleted ad hoc.

## Classification C: Deletion Candidates Requiring User Approval

No deletion was performed. These are candidates only.

### Immediate Small Candidates

These look like local or accidental artifacts and are the safest candidates to review first:

```text
.vscode/starwind.code-snippets
AIBOUX
Mailサービスサイト
対応テナントの
旧
public/temp/imagegen/.gitkeep
```

Observed file details:

```text
.vscode/starwind.code-snippets: 1455 bytes
AIBOUX: 0 bytes
Mailサービスサイト: 0 bytes
対応テナントの: 0 bytes
旧: 0 bytes
public/temp/imagegen/.gitkeep: 0 bytes
```

### Larger Cleanup Candidates

These may be cleanup candidates only after an explicit archive/keep/delete decision:

```text
output/playwright/       166 untracked normal paths plus 13 quoted Japanese-name paths
output/review-packs/     38 untracked paths
output/reference/        4 untracked paths
output/reports/          1 untracked path
all_log/                 old per-task evidence files not already committed
test-results/            current Playwright last-run metadata
```

Reason: these are generated or historical artifacts, but they may still be required as audit evidence. Delete only after the user approves a specific cleanup list.

## Recommended Cleanup Order

1. Review and approve/deny the immediate small candidates in Classification C.
2. Decide whether generated `output/` artifacts should be archived, committed, or deleted.
3. Decide whether old `all_log/` evidence should be archived into a dated bundle rather than deleted.
4. Decide whether the AIBOUX source/config implementation tree should be committed as a separate source commit, left dirty for the next task, or split into smaller commits.

## Current State

`USER_ACTION_REQUIRED`: dirty tree cleanup approval is required before any deletion, archival move, reset, clean, or source-control restructuring.

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`
