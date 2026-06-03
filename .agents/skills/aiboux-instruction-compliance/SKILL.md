---
name: aiboux-instruction-compliance
description: Use this skill for every AIBOUX task. It forces Codex to convert the user request into a Markdown instruction file, enforce required URLs, avoid false completion, run gates, and improve the workflow after repeated failure.
---

# AIBOUX Instruction Compliance Skill

## Purpose

Codex must not start implementation from chat instructions alone.

Every AIBOUX task must have a Markdown instruction file under:

`ops/instructions/`

The active task must also be reflected in:

`ops/instructions/current.md`

## Required Statuses

Use only:

- CODE_READY
- PREVIEW_READY
- DEPLOYED
- FINAL_ACCEPTED
- USER_ACTION_REQUIRED
- BLOCKED
- BLOCKED_DESIGN
- BLOCKED_PREVIEW
- BLOCKED_METHOD
- BLOCKED_AGENT_COMPLIANCE

Never use COMPLETED unless the status is FINAL_ACCEPTED.

## Three-Strike Improvement Rule

If the user rejects the same outcome three times, Codex must stop and change method.

Codex must:

- mark `BLOCKED_METHOD` or the relevant blocked status;
- identify why the method failed;
- replace the testing, preview, design, or reporting approach;
- update the Markdown instruction;
- add or strengthen a gate;
- continue only after the method changes.

## Daily Improvement Rule

Every day, Codex must check whether new tool capabilities or better methods exist for:

- Codex instructions;
- Playwright visual testing;
- Chrome DevTools / MCP;
- preview URL validation;
- visual regression testing;
- Cloudflare/Wrangler workflow.

Record daily improvements under:

`ops/improvements/YYYYMMDD_daily_improvement.md`

## Required URL Bundle

Every user-facing implementation report must include:

1. Master update preview URL
2. Execution log preview URL
3. Screen/artifact preview URL

No URL bundle, no report.

## Public Preview Rule

Never ask the user to verify localhost or VPS-local output.

User verification requires a public URL.

A public preview is invalid if:

- CSS/JS assets fail
- Tailwind/shadcn is not applied
- the page shows raw browser default links/buttons
- the URL returns stale content
- the URL has mojibake or control characters
- Playwright public style check was not run

## Bark Final-Only Rule

Bark notification is final-only by default.

Do not send Bark for CODE_READY, PREVIEW_READY, DEPLOYED, BLOCKED, or USER_ACTION_REQUIRED.

The 3URL Bundle is required for reports, but it does not trigger Bark.

For FINAL_ACCEPTED only:

- delivered=true
- skipped=false
- secretLogged=false
- userReceiptConfirmed=true

## AI Review Rule

Grok / Cloudflare AI are advisory unless explicitly required.

Timeout, no output, auth error, network error, model unavailable, smoke-only result, or Codex self-review are not approval.

## Done Means Evidence

Do not trust logs alone.

Evidence must include:

- actual public preview URL
- screenshot
- Playwright result
- URL checks
- no mojibake
- no control characters
- current status is honest
