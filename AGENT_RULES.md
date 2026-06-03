# AIBOUX Agent Rules

The active operating rules are consolidated into `AIBOUX_MASTER_DOCUMENT.md`.

## Current Rule Priority

`AIBOUX_MASTER_DOCUMENT.md` Current Active Operating Overrides supersede old preserved source snapshots.

For completion reports, use the temporary URL workflow documented in `AIBOUX_MASTER_DOCUMENT.md`: register a specific file in `src/lib/server/tempLogShares.ts`, use a hard-to-guess token, set `expiresAt` within 24 hours, return `404` for token mismatch, `410` after expiry, and share the resulting URL with the user.

## Bark Notification Completion Gate

If a task requires Bark notification, the completion report must include:
- Bark `delivered=true`.
- `skipped=false`.
- `secretLogged=false`.
- `userReceiptConfirmed=true`.

If Bark notification is not confirmed, the completion report must not say `COMPLETED`. Use `BLOCKED` instead.

Bark keys, endpoint URLs containing keys, tokens, `.env`, `.dev.vars`, and `/home/pkkatsu/.aiboux-secrets/bark.env` contents must never be printed or written to logs.

## AI Reference Review Rule

Grok and Cloudflare AI are reference reviewers, not primary completion gates.

Grok may be used for UX, wording, and visual mismatch notes.

Cloudflare AI may be used for D1/API/tenant_id and Cloudflare configuration support audits.

When a report claims Grok, Cloudflare AI, Hermes, or any other AI review passed, explicit approval is required.

Timeout, no output, empty output, process killed, authentication error, network error, rate limit, model unavailable, tool unavailable, ambiguous response, partial response without verdict, or fallback self-review only must be reported as `BLOCKED` or `NG`.

The completion report must not claim an AI review `PASS` unless the reviewer returned explicit approval such as `PASS`, `APPROVED`, `承認`, or `no blockers found`.

Grok or Cloudflare AI `PASS` alone never proves completion. AI review must not replace Playwright, public URL checks, actual Worker Version ID, `/g/...` latest log evidence, Bark receipt confirmation when required, or `npm run gate:aiboux`.

## Post-Codex Review Evidence Rule

For image-based UI implementation, reports must include:
- review pack path;
- Grok review result;
- Cloudflare AI review result;
- whether each reviewer loaded the instruction;
- whether each reviewer loaded reference and actual images.

If a reviewer cannot load the required instruction and images, that reviewer must not be counted as PASS.

## USER_ACTION_REQUIRED Secret Gate

If a task requires secret input, the completion report must not say `COMPLETED`.

Use `USER_ACTION_REQUIRED` when:
- Cloudflare API Token or Account ID is missing;
- Wrangler authentication fails;
- Bark user receipt is not confirmed;
- Hermes is blocked by Cloudflare auth/provider readiness;
- any required secret must be entered by a human.

Codex must update the log with `BLOCKED` or `USER_ACTION_REQUIRED`, then stop retrying until the user confirms `secret入力完了`.

## Progressive Completion Report Rule

Completion reports must state the exact current status:
- `CODE_READY`;
- `PREVIEW_READY`;
- `DEPLOYED`;
- `FINAL_ACCEPTED`;
- `USER_ACTION_REQUIRED`;
- `BLOCKED`.

Do not use `COMPLETED` unless the status is `FINAL_ACCEPTED`.

Temporary URL generation is required for final accepted completion logs, but lack of a deployed temporary URL must not prevent writing local `all_log` evidence.

## Completion URL Rule

For visual, UI, document, print, PDF, log, or image work, user verification evidence must include a user-visible URL.

Local-only evidence can support `CODE_READY` but not `PREVIEW_READY`, `DEPLOYED`, `FINAL_ACCEPTED`, or `COMPLETED`.

Use a stable preview environment URL when possible. A temporary Cloudflare Tunnel URL is allowed only as `TEMP_PREVIEW` fallback evidence and must not be repeatedly regenerated or treated as final completion proof.

For UI previews, HTML 200 is insufficient. CSS/JS assets must load, the public preview must show styled Tailwind/shadcn/ui output, and browser-default unstyled pages must be reported as `BLOCKED_PREVIEW`.

## Report URL Bundle Rule

Every user-facing implementation report must include:
1. master update preview URL;
2. execution log preview URL;
3. preview URL for the actual screen, image, PDF, or artifact.

A report that lacks these URLs is incomplete. If one of the URLs cannot be provided, the report must state the current status and the missing URL reason.

## Markdown Instruction Compliance Rule

Every implementation task must have a Markdown instruction file.

The completion report must cite the instruction file path.

## Control Character And Mojibake Rule

Reports must pass:

- `npm run check:mojibake`
- `npm run check:control-chars`

If mojibake or control characters are detected, status must be `BLOCKED`.

## Report Format Gate

A report is invalid if the user-facing final text contains:
- NUL characters;
- control characters except newline, carriage return, and tab;
- replacement characters;
- mojibake;
- broken URL labels.

The final report text itself must be checked, not only source log files.

## URL Reissue Rule

User-facing URLs are not final-only.

When the user asks for URLs again, reissue the latest available URL bundle immediately.

Intermediate reports may include URL bundles when available and must clearly state that the status is not FINAL_ACCEPTED or COMPLETED.

Prefer short URLs for user-facing reports.

## Bark Progress And Final Rule

Bark notifications are split into progress notifications and final acceptance notifications.

For CODE_READY, PREVIEW_READY, DEPLOYED, BLOCKED, and USER_ACTION_REQUIRED, provide the latest URL bundle and send Bark progress notification if Bark is configured or requested.

Progress Bark requires skipped=false and secretLogged=false, but does not require userReceiptConfirmed=true.

For FINAL_ACCEPTED / COMPLETED, final Bark requires delivered=true, skipped=false, secretLogged=false, and userReceiptConfirmed=true.

## Completion Status Rule

`COMPLETED` is forbidden unless status is `FINAL_ACCEPTED`.

`CODE_READY` is not completed.
`PREVIEW_READY` is not completed.
`DEPLOYED` is not completed.
`USER_ACTION_REQUIRED` is not completed.
`BLOCKED` is not completed.

## Progressive Completion Report Rule

Completion reports must state the exact current status:
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

Do not use COMPLETED unless the status is FINAL_ACCEPTED.

## Daily Improvement Rule

If the same task fails three times or if the day starts with unresolved failures, Codex must write a daily improvement note before continuing.

## Design Gate Rule

UI reports must satisfy `npm run gate:design` when the task changes Core/Mail/Shop screens.

External design skills and AI reviews are advisory only. They cannot replace public preview, CSS/JS asset checks, Playwright screenshots, or the 3URL Bundle.

## Progress Report URL And Bark Rule

Intermediate reports must still provide user-visible URLs when available.

For CODE_READY, PREVIEW_READY, BLOCKED, and USER_ACTION_REQUIRED:
- provide the latest URL bundle;
- send Bark progress notification if Bark is configured or requested;
- clearly state that the status is not FINAL_ACCEPTED or COMPLETED.

URL bundle and Bark progress notifications are not final-only.

Bark secrets must never be included in reports, logs, docs, screenshots, or public URLs.

## Core Delivery Detail Font Weight Audit Rule

Core delivery detail reports must verify that only titles, labels, and table headers are bold.

Values, product names, product codes, quantities, prices, amount values, memo/history body, and footer amount values must use normal font weight.

Font-weight audit violations block CODE_READY.

## Core Delivery Detail Typography Audit Rule

Core delivery detail reports must verify typography, not only font-weight.

The audit must check:
- font-size;
- line-height;
- font color;
- font-weight.

Typography audit violations block CODE_READY.

## Known-Failing Preview Rule

A preview with known failed visual gates must not be reported as ready for user review.

`ACTIVE_DESIGN_FIX` is an internal repair state. Continue implementation until all reference-image gates pass or a hard blocker is reached.

Do not send Bark progress notifications for known-failing internal design iterations.
