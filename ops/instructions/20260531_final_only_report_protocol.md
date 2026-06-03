# AIBOUX Final-Only Report Protocol

作成日: 2026-05-31

## Status

PREVIEW_READY

## Purpose

Codex must not show URLs or send Bark during intermediate AIBOUX statuses.

## Rules

- Do not show URLs in intermediate reports.
- Do not send Bark in intermediate reports.
- Show URLs only in the final `FINAL_ACCEPTED` / `COMPLETED` report.
- When URLs are shown, use short URLs only.
- The final `## URLs` section must be the last section.
- No text may follow the final `## URLs` section.

## Intermediate Statuses That Must Not Show URLs

- CODE_READY
- PREVIEW_READY
- DEPLOYED
- BLOCKED
- BLOCKED_DESIGN
- BLOCKED_PREVIEW
- BLOCKED_METHOD
- BLOCKED_REPORT_FORMAT
- BLOCKED_AGENT_COMPLIANCE
- USER_ACTION_REQUIRED

## Final URL Requirements

URLs may be shown only when `Status = FINAL_ACCEPTED` or `Status = COMPLETED`.

Required final gates:

- production deploy completed;
- actual Worker Version ID recorded;
- production URL HTTP 200;
- short URLs mNN / lNN / dNN HTTP 200;
- dNN directly displays the target screen or artifact;
- `check:control-chars` PASS;
- `check:mojibake` PASS;
- `check:bark-policy` PASS;
- final report policy PASS;
- Bark final notification is ready to send or sent as required.

## Bark

- notification: not sent for PREVIEW_READY
- reason: Bark notifications are final-only by policy.

## Renderer

Use `scripts/render-aiboux-final-report.mjs`.

The renderer must:

- hide URLs unless status is `FINAL_ACCEPTED` or `COMPLETED`;
- place URLs only in the last section for final reports;
- sanitize NUL, control characters, and replacement characters;
- write `/tmp/aiboux-final-user-report.md`;
- write `/tmp/aiboux-final-user-report.html`;
- allow `/tmp/aiboux-final-user-report.stdout.md` to be compared with the Markdown output.

## Done When

- `scripts/render-aiboux-final-report.mjs` exists.
- `scripts/check-report-policy.mjs` exists.
- `package.json` has `check:report-policy`.
- `gate:code`, `gate:preview`, `gate:deploy`, and `gate:final` run `check:report-policy`.
- Intermediate final report output has no URLs.
- Bark is not sent.
