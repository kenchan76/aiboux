# Hermes Current State And Bark Notification Log

Date: 2026-05-30

## Purpose

The old Hermes Minimal Audit Setup log recorded the initial blocked state where no inference provider was configured. That was a historical setup-stage state.

The current state is the Hermes Provider And First Audit Log.

## Current Hermes State

- Hermes body: installed
- Provider: Cloudflare Workers AI via local OpenAI-compatible proxy
- `HERMES_READY`: success
- First audit: PASS
- Hermes role: audit-only, not implementation
- Hermes does not deploy, git push, delete, or send externally
- The old `No inference provider configured` wording is historical and is not the current state.

## Snapshot Clarification

The embedded `AGENT_RULES.md` source block in `AIBOUX_MASTER_DOCUMENT.md` is a historical source snapshot. If an older snapshot says deployment may run only after explicit deployment approval, that wording is superseded by the current `Production Deployment Rule`.

Current rule: normal code/UI/API deployment may run after required verification without additional human approval. High-risk operations still require human approval.

## Bark Notification Rule

Codex / development AI sends a Bark notification after normal implementation completion, after:

- check/build
- required Playwright
- required Grok
- required Cloudflare AI
- Hermes audit
- deploy
- public URL verification
- final log URL issuance

Bark is used only for implementation completion notification or NG notification.

Secrets are not logged:

- Bark device key
- Bark token
- full Bark endpoint URL
- `.env` or `.dev.vars` contents

Implementation:

- `scripts/notify-bark.mjs`
- `npm run notify:bark`

Environment variables:

- `BARK_ENABLED`
- `BARK_ENDPOINT`
- `BARK_DEVICE_KEY`
- `BARK_TASK`
- `BARK_VERIFICATION`
- `WORKER_VERSION_ID`
- `TEMP_LOG_URL`
- `SHORT_LOG_URL`
- `BARK_URL`
- `BARK_RESULT`
- `BARK_TITLE`

If `BARK_ENABLED` is not true, the script skips sending and outputs a non-secret skip result.

## Verification

Pending at initial log creation:

- `npm run astro check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- deploy
- public URL verification
- Bark notification result
