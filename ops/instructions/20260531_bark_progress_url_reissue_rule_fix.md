# Bark Progress Notification and URL Reissue Rule Fix

## Status

CODE_READY

## Problem

The previous operating rule incorrectly treated Bark notifications and URL display as final-only.

That was wrong for AIBOUX progress reporting.

## Correct Rule

Bark notifications are split into two types:

1. Progress Bark Notification
2. Final Acceptance Bark Notification

Progress Bark is sent when a Codex work unit finishes or pauses, including CODE_READY, PREVIEW_READY, DEPLOYED, BLOCKED, USER_ACTION_REQUIRED, URL bundle creation, and user-action wait states.

Progress Bark success requires:
- Bark API send success;
- skipped=false;
- secretLogged=false.

Progress Bark does not require userReceiptConfirmed=true and must not be reported as FINAL_ACCEPTED or COMPLETED.

Final Acceptance Bark is only for FINAL_ACCEPTED / COMPLETED and requires userReceiptConfirmed=true when confirmation is required.

## URL Reissue Rule

User-facing URLs are not final-only.

If the user asks for URLs again, reissue the latest available URL bundle immediately, even when the status is CODE_READY, PREVIEW_READY, DEPLOYED, BLOCKED, or USER_ACTION_REQUIRED.

## Immediate URLs

- マスター: `https://mainly-fighters-cruise-screens.trycloudflare.com/m70.html`
- ログ: `https://mainly-fighters-cruise-screens.trycloudflare.com/l70.html`
- 画面: `https://mainly-fighters-cruise-screens.trycloudflare.com/d70.html`

## Done When

- AIBOUX operation docs are corrected.
- `notify-bark.mjs` supports `--purpose progress` and `--purpose final`.
- Bark progress notification is attempted for the m70/l70/d70 URL reissue.
- The correction is recorded in all_log.
