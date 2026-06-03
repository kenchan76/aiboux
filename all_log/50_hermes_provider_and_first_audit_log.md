# Hermes Provider And First Audit Log

Date: 2026-05-30
Workspace: `/home/pkkatsu/aiboux`

## Purpose

Configure a safe Hermes inference provider and run the first AIBOUX Core delivery document UI audit.

Hermes remains an audit agent only.
Hermes did not implement code, deploy, git push, delete files, expose secrets, send messages, configure gateways, or create cron notifications.

## Provider Setup

Provider configured:
- Cloudflare Workers AI through a local OpenAI-compatible proxy bound to `127.0.0.1`.

Model configured:
- `@cf/meta/llama-3.3-70b-instruct-fp8-fast`

Local proxy:
- `/home/pkkatsu/agents/hermes/cloudflare-ai-openai-proxy.mjs`
- tmux session: `hermes-ai-proxy`
- bind address: `http://127.0.0.1:8789/v1`

Security notes:
- No API key, token, `.env`, `.dev.vars`, or auth file content was printed to chat, docs, or logs.
- The proxy reads the existing Wrangler OAuth configuration internally and does not log token values.
- Hermes uses a local placeholder value only for OpenAI-compatible client compatibility.
- Telegram, Slack, Discord, Email, WhatsApp gateway, daily reports, cron notifications, and Codex next-prompt automation were not configured.

## Commands Verified

```bash
which hermes
HERMES_HOME=/home/pkkatsu/agents/hermes/home hermes --version
HERMES_HOME=/home/pkkatsu/agents/hermes/home hermes doctor
HERMES_HOME=/home/pkkatsu/agents/hermes/home hermes -z 'Return exactly: HERMES_READY'
```

Result:
- `which hermes`: `/home/pkkatsu/.local/bin/hermes`
- Hermes version: `Hermes Agent v0.15.1 (2026.5.29)`
- Doctor: Hermes installed and operational; expected optional-provider warnings remain for unused providers/tools.
- Connectivity: `HERMES_READY`

## First Audit Target

- Public URL: `https://core.aiboux.com/core/deliveries`
- Reference image: `https://tadaup.jp/5HYfNaVM.png`
- Screenshot: `output/playwright/core-documents-redesign/delivery-create-final.png`
- DOM audit: `output/playwright/core-documents-redesign/delivery-create-final-dom-audit.json`
- Grok review: `all_log/core_delivery_create_final_grok_review.md`
- Cloudflare AI audit: `all_log/core_delivery_create_final_cloudflare_ai_audit.json`
- Final implementation log: `all_log/47_core_delivery_create_final_reference_match_log.md`

## First Audit Result

Current report files under `/home/pkkatsu/aiboux-vault/ng`:

- `HERMES_AUDIT_PASS.md`: present
- `NG_REPORT.md`: not present
- `CONFLICT_REPORT.md`: not present
- `CLEANUP_CANDIDATES.md`: not present

Hermes audit verdict:
- PASS

Evidence basis:
- saved Playwright screenshot exists;
- DOM audit confirms forbidden labels count 0;
- DOM audit confirms narrow No/tax/action columns and 13-digit product code fit;
- DOM audit confirms `￥12,000` first line subtotal and `￥194,643` document total;
- Grok review result is PASS;
- Cloudflare AI audit result is PASS;
- final implementation log records Playwright, Grok, Cloudflare AI, public URL, screenshot path, and DOM path;
- public URL returned HTTP 200.

Residual limitation:
- Hermes did not perform direct computer-vision comparison itself. The PASS relies on the saved screenshot, DOM audit, Grok visual review, Cloudflare AI audit, final log, and public URL evidence.

## Report File

`/home/pkkatsu/aiboux-vault/ng/HERMES_AUDIT_PASS.md`

## Verification

Final verification is recorded in the completion response:
- `npm run astro check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `npx wrangler deploy --keep-vars`
- public URL checks
