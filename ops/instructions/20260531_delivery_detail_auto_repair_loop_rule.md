# AIBOUX Delivery Detail Auto Repair Loop Rule

## Status

ACTIVE_DESIGN_FIX_INTERNAL

## Problem

c79 was externally reported even though the reference-image comparison was known to be failing:

- diffRatio: 0.13038150394825823
- threshold: 0.04
- verdict: NG

`ACTIVE_DESIGN_FIX` is not a user-reportable completed work unit. It is an internal repair state.

## Required Behavior

When a reference-image comparison fails, Codex must continue the repair loop internally until one of these is true:

- all design gates pass and status becomes `PREVIEW_READY_PENDING_USER`;
- a hard blocker requiring human action or external service recovery occurs.

## User-Reportable States

### PREVIEW_READY_PENDING_USER

All must pass:

- reference image loaded;
- actual screenshot captured;
- textMismatch is empty;
- visualBlockers is empty;
- typography violations are empty;
- productNameSingleLine is true;
- geometryPass is true;
- diffRatio <= 0.04;
- public preview HTTP 200;
- CSS/JS assets HTTP 200;
- public style check PASS;
- comparison HTML generated;
- 4URL Bundle generated;
- Bark progress notification sent.

### HARD_BLOCKED

Only for conditions Codex cannot fix internally:

- secret or authentication input required;
- reference image unavailable after retry;
- build system broken;
- filesystem permission denied;
- external service unavailable after retry;
- user decision required.

## Forbidden

- Report `ACTIVE_DESIGN_FIX` to the user.
- Return a known-failing preview for review.
- Send Bark for known-failing internal iterations.
- Stop after a single small fix when diffRatio remains above threshold.
- Report `PREVIEW_READY_PENDING_USER` while any design gate is failing.

## Current Loop Target

Continue from c79 into internal c80+ iterations.

Known c79 failures:

- diffRatio above threshold.
- topbar, sidebar, title row, card, table, and footer pixels still differ from the reference.

## Required Internal Log

Append every internal iteration to:

`all_log/internal/core_delivery_detail_design_loop_iterations.md`

