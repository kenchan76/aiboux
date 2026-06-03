# Hermes Agent Minimal Audit Setup Final Log

Date: 2026-05-30
Workspace: `/home/pkkatsu/aiboux`

## Purpose

Introduce Hermes Agent on the AIBOUX VPS as an instruction-compliance auditor.

Hermes is not an implementation agent.
Codex remains the implementation agent.

Hermes is not a deployment executor.
Hermes audits whether normal deployments were allowed and evidenced.

## Current Install Status

- Install directory: `/home/pkkatsu/agents/hermes/hermes-agent`
- Hermes home: `/home/pkkatsu/agents/hermes/home`
- Command: `/home/pkkatsu/.local/bin/hermes`
- Version: `Hermes Agent v0.15.1 (2026.5.29)`
- Python: `3.11.15`
- tmux session: `hermes-setup`

The official installer had already completed before this resumed setup.
It was previously saved to `/tmp/hermes-install.sh` and compared with the GitHub raw installer at `/tmp/hermes-install-github.sh`; both files had the same SHA-256 hash.
The installer was inspected before execution.

No Telegram, Slack, Discord, Email, WhatsApp, daily report, cron notification, gateway service, or Codex next-prompt automation was configured.

## Setup Result

Command:

```bash
HERMES_HOME=/home/pkkatsu/agents/hermes/home hermes setup --non-interactive
```

Result:
- The interactive wizard cannot run without a TTY.
- Non-interactive setup completed without adding secrets.
- Hermes requires a configured inference provider for AI one-shot audit execution.

No API key, token, `.env`, `.dev.vars`, or auth file content was displayed or written to logs.

## Doctor Result Summary

`hermes doctor`:

- Python environment: OK
- Required packages: OK
- Config files: OK
- Command installation: OK
- External tools: git, ripgrep, docker, Node.js, agent-browser, Playwright Chromium: OK
- Messaging providers: not configured
- Gateway service: stopped
- Scheduled jobs: 0
- Built-in memory: active

Expected warnings:
- optional Telegram/Discord packages are not installed;
- Nous/OpenAI/Gemini/xAI OAuth providers are not logged in;
- OpenRouter and other API keys are not configured;
- some optional tools are unavailable because their provider keys or system dependencies are absent.

## Vault Files Created

- `/home/pkkatsu/aiboux-vault/refs/hermes-aiboux-role.md`
- `/home/pkkatsu/aiboux-vault/checklists/instruction-compliance.md`
- `/home/pkkatsu/aiboux-vault/checklists/data-reconciliation.md`
- `/home/pkkatsu/aiboux-vault/checklists/conflict-prevention.md`
- `/home/pkkatsu/aiboux-vault/checklists/cleanup-candidates.md`
- `/home/pkkatsu/aiboux-vault/ng/NG_REPORT.md`

## AIBOUX Rules Updated

`AGENTS.md`:
- Added `Hermes Agent Minimal Operating Rule`.
- Clarified Hermes may read specs/logs/screenshots/reviews and create NG/conflict/cleanup reports.
- Clarified Hermes must not edit production code, deploy, git push, delete destructively, expose secrets, send external messages, change prices, publish/delete production content, or exfiltrate customer/personal data.
- Clarified Hermes is only a verifier/conflict auditor and not a deployment executor.

`AIBOUX_MASTER_DOCUMENT.md`:
- Added `2026-05-30: Hermes Agent Minimal Audit Setup`.
- Added `Hermes Agent Operating Policy`.
- Clarified Codex remains implementation agent.
- Clarified Hermes audits check/build/Playwright, screenshots, Grok/Cloudflare AI evidence, public URL checks, Worker Version ID recording, and all_log/screen consistency.
- Clarified Hermes must not deploy or perform high-risk operations.

`AGENT_RULES.md`:
- No change required. It already points to the master document and the temporary log workflow.

## Initial Audit Result

Requested initial audit target:
- `https://core.aiboux.com/core/deliveries`
- Core delivery document create UI

Available evidence was confirmed:
- `output/playwright/core-documents-redesign/delivery-create-final.png`
- `output/playwright/core-documents-redesign/delivery-create-final-dom-audit.json`
- `all_log/core_delivery_create_final_grok_review.md`
- `all_log/core_delivery_create_final_cloudflare_ai_audit.json`
- `all_log/47_core_delivery_create_final_reference_match_log.md`
- Public URL `https://core.aiboux.com/core/deliveries`: HTTP 200

Hermes AI-driven first audit could not complete because no inference provider is configured.

Evidence:

```text
hermes -z 'Return exactly: HERMES_READY'
AuthError: No inference provider configured.
```

Created:
- `/home/pkkatsu/aiboux-vault/ng/NG_REPORT.md`

This NG report records the Hermes runtime audit blocker. It does not assert a delivery UI defect by itself.

## Reports

- `NG_REPORT.md`: present, because Hermes AI audit is blocked by missing inference provider.
- `CONFLICT_REPORT.md`: not created.
- `CLEANUP_CANDIDATES.md`: not created.

## Verification

Final verification is recorded in the completion response:
- `npm run astro check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `npx wrangler deploy --keep-vars`
- public URL checks

## Notes

- `docs/VPS_MIGRATION_SUCCESS.md` is not present at the active path. The historical file exists under `docs/archive/2026-05-27-pre-master/VPS_MIGRATION_SUCCESS.md`.
- Secrets were not logged.
- External notifications were not configured.
- `git push` was not executed.
- Hermes did not run `wrangler deploy`.
