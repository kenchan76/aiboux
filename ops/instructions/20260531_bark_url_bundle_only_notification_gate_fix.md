# Bark URL Bundle Only Notification Gate Fix

## Status

CODE_READY

## Source Of Truth

- `AIBOUX_MASTER_DOCUMENT.md`
- User instruction on Bark notification timing, 2026-05-31

## User Instruction

Fix Bark notification timing.

## Confirmed Decisions

- Bark notification is allowed only after the URL Bundle is output to stdout, `all_log`, or final chat report.
- Bark must not fire on work start, watcher start/stop, running state, build PASS, deploy PASS, Playwright PASS, review OK/NG, automatic fix completion, intermediate errors, or Bark receipt wait states.
- Bark body must include:
  - master URL;
  - log URL;
  - screen URL;
  - Worker Version ID;
  - final status.
- Bark delivery is notification evidence only, not a `FINAL_ACCEPTED` completion gate.
- `userReceiptConfirmed=true` must not be required for final acceptance.
- Service URL routing gate must not run unrelated Core delivery-detail checks.

## Investigation Targets

- `scripts/remote-watcher.py`
- `scripts/upload-log.sh`
- `aiboux-review.py`
- `scripts/aiboux-gate-check.mjs`
- Bark sender/API call sites.

## Findings

- `scripts/remote-watcher.py`, `scripts/upload-log.sh`, and `aiboux-review.py` are not present under `/home/pkkatsu/aiboux` or `/home/pkkatsu`.
- Existing Bark sender is `scripts/notify-bark.mjs`.
- Existing gate implementation is `scripts/aiboux-gate-check.mjs`.

## Required Implementation

- Enforce URL Bundle presence in `scripts/notify-bark.mjs`.
- Remove final-stage receipt-confirmation requirement from `scripts/notify-bark.mjs`.
- Ensure Bark body contains the three URLs, Worker Version ID, and final status.
- Update `scripts/aiboux-gate-check.mjs` so `service-url-routing` is task-scoped and not blocked by Core delivery-detail checks.
- Update active Bark policy in `AIBOUX_MASTER_DOCUMENT.md`.
- Save `all_log` evidence stating Bark notification is sent only after URL bundle output.

## Verification Required

- `grep`/`rg` for `api.day.app`, `BARK`, and `bark(`.
- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run astro check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `npm run gate:aiboux`
