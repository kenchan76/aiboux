# Current AIBOUX Task

## Task Name

Dirty Tree Cleanup Approval Plan After Bark Fix Completion

## Status

USER_ACTION_REQUIRED

## Source Of Truth

- `AIBOUX_MASTER_DOCUMENT.md`
- `ops/instructions/current.md`
- `all_log/77_codex_dirty_tree_triage_after_push.md`
- `all_log/78_codex_public_url_recheck_after_push.md`

## Confirmed Completed Previous Task

- Bark notification timing fix task is complete.
- Pushed commit: `88a0577e78d4dd42fb88f6e99af202074ccaa254`.
- `origin/main == HEAD` was confirmed at `88a0577e78d4dd42fb88f6e99af202074ccaa254`.
- `npm run gate:aiboux` passed with `AIBOUX_GATE_PASS`.
- Worker Version ID: `f8867df3-aab9-439b-bf8d-634ada05191d`.
- URL Bundle:
  - Master: `https://mail.aiboux.com/g/m68`
  - Log: `https://mail.aiboux.com/g/l68`
  - Screen: `https://mail.aiboux.com/g/d68`

## Current User Instruction

Prepare a dirty tree cleanup plan only. Do not change implementation, deployment, Bark behavior, or URL migration.

## Required Work

1. Read `all_log/77_codex_dirty_tree_triage_after_push.md`.
2. Read `all_log/78_codex_public_url_recheck_after_push.md`.
3. Re-run `git status --short`.
4. Reclassify dirty tree items:
   - A: required for the next task;
   - B: evidence to preserve;
   - C: deletion candidates requiring user approval.
5. Save only the classification result to `all_log/80_dirty_tree_cleanup_plan.md`.
6. Update this file to indicate that the next step is waiting for dirty tree cleanup approval.
7. If only `all_log` and `ops/instructions/current.md` are changed, a commit may be created.

## Prohibited Actions

- Do not delete files.
- Do not run `git reset --hard`.
- Do not run `git clean -fd`.
- Do not send Bark.
- Do not force push.
- Do not print secrets, PATs, API tokens, `.env`, `.dev.vars`, or Bark endpoint URLs containing secrets.
- Do not modify source/config files.

## Current Next State

- Next step: dirty tree cleanup approval is required before any deletion or archival action.
- Classification C deletion remains unapproved and must not be performed.
- Cleanup plan saved: `all_log/80_dirty_tree_cleanup_plan.md`.
- Current classification status: `USER_ACTION_REQUIRED`.
- Approved deletion list: none.
