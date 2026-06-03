# AIBOUX Codex Execution Contract v2

作成日: 2026-05-31

## Status

ACTIVE

## Purpose

This contract supersedes earlier AIBOUX Bark timing rules.

Most important rule:

- Bark notifications are final-only by default.
- Do not send Bark for CODE_READY, PREVIEW_READY, DEPLOYED, BLOCKED, BLOCKED_DESIGN, BLOCKED_PREVIEW, BLOCKED_METHOD, BLOCKED_AGENT_COMPLIANCE, or USER_ACTION_REQUIRED.
- Send Bark only when the task is FINAL_ACCEPTED / COMPLETED.

## Markdown Instruction Rule

Every AIBOUX task must start from Markdown instructions.

Required:
- `ops/instructions/current.md`
- a task-specific file under `ops/instructions/`

## Required Report URL Bundle

Every user-facing report must include:
1. Master update preview URL
2. Execution log preview URL
3. Screen/artifact preview URL

The 3URL Bundle is required for reports, but it does not trigger Bark.

## Bark Final-Only Policy

Intermediate logs must use:

```md
## Bark

- notification: not sent
- reason: Bark notifications are final-only by policy.
- secretLogged: false
```

`scripts/notify-bark.mjs` must require `--stage final`.

Without `--stage final`, it must not send and must return:

```json
{
  "provider": "bark",
  "ok": false,
  "delivered": false,
  "skipped": true,
  "secretLogged": false,
  "reason": "BARK_FINAL_ONLY_POLICY"
}
```

## Direct Preview Rule

For delivery detail work, the screen preview URL must directly open the detail workspace.

Valid:
- `/core/deliveries?preview=delivery-detail&document=N20260530-01`

Invalid:
- `/core/deliveries` when it opens the list
- intermediate pages
- asking the user to click a row

## Three-Strike Method Rule

After three user-visible failures, Codex must stop and change method.

## Daily Improvement Rule

Codex must record daily workflow improvements under `ops/improvements/`.

## Completion Rule

`COMPLETED` means `FINAL_ACCEPTED` only.

CODE_READY, PREVIEW_READY, DEPLOYED, BLOCKED, and USER_ACTION_REQUIRED are not completed.
