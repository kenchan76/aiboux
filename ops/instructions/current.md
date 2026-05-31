# Current AIBOUX Task

## Task Name

Bark URL Bundle Only Notification Gate Fix

## Status

CODE_READY

## Source Of Truth

- `AIBOUX_MASTER_DOCUMENT.md`
- `ops/instructions/20260531_bark_url_bundle_only_notification_gate_fix.md`

## User Instruction

Fix Bark notification timing so Bark is sent only after the URL Bundle has been output.

## Confirmed Decisions

- Bark is a completion bell.
- The log URL Bundle is the condition for ringing the bell.
- Bark receipt confirmation is not a completion gate.
- Bark notifications are not allowed for work start, running state, watcher start/stop, build/deploy/Playwright pass, review OK/NG, automatic fix completion, intermediate errors, or receipt-confirmation waiting.
- Bark body must include master URL, log URL, screen URL, Worker Version ID, and final status.
- Service URL routing gate must be separated from unrelated Core delivery-detail checks.

## Required Verification

- `rg "api.day.app|BARK|bark\\("`
- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run astro check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `npm run gate:aiboux`

## Reporting

- Do not send Bark before the URL Bundle is output.
- Do not make Bark delivery or receipt confirmation a `FINAL_ACCEPTED` blocker.
- Report changed files, verification, unresolved items, and URL Bundle evidence.
