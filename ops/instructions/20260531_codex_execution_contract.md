# AIBOUX Codex Execution Contract

作成日: 2026-05-31

## Purpose

Codexが指示書を守らない問題を、Markdown運用、自動ゲート、公開プレビュー必須化で強制的に直す。

## Bootstrap Instruction

Codexには次の一文だけを渡す。

`ops/instructions/20260531_codex_execution_contract.md を読んで、AIBOUXのCodex運用を修正してください。以後、口頭指示ではなくMarkdown指示書・ゲート・公開プレビューURLを必須にしてください。`

## Most Important Rules

- Codex must not start implementation from chat instructions alone.
- Every AIBOUX task must be converted into `ops/instructions/current.md` before implementation.
- Every implementation task must have a Markdown instruction file under `ops/instructions/`.
- Codex must record Done conditions, forbidden actions, required URLs, required tests, screenshots, Bark requirements, and status in Markdown before reporting.
- Logs alone are not progress.
- Playwright alone is not visual acceptance when the public preview is visually broken.
- Bark API success alone is not final notification acceptance.
- Grok / Cloudflare AI PASS alone is not completion.
- Old URLs must not be presented as current URLs.

## Allowed Statuses

- `CODE_READY`
- `PREVIEW_READY`
- `DEPLOYED`
- `FINAL_ACCEPTED`
- `USER_ACTION_REQUIRED`
- `BLOCKED`
- `BLOCKED_DESIGN`
- `BLOCKED_PREVIEW`

`COMPLETED` is equivalent to `FINAL_ACCEPTED` only.

## Markdown Instruction Files

All implementation instructions live under:

`ops/instructions/`

The active task must be reflected in:

`ops/instructions/current.md`

Required headings:

- Task Name
- User Instruction
- Target URLs
- Target Files
- Status
- Done When
- Forbidden
- Required Public URLs
- Required Tests
- Required Screenshots
- Required Bark Notification
- User Action Required

## Required URL Bundle

Every user-facing implementation report must include:

1. Master update preview URL
2. Execution log preview URL
3. Screen/artifact preview URL

No URL bundle, no report.

Local paths, screenshot-only evidence, localhost URLs, and stale `/g/...` URLs are not valid substitutes.

## Public Preview Rule

Never ask the user to verify localhost or VPS-local output.

User verification requires a public URL.

A public preview is invalid when:

- CSS/JS assets fail;
- Tailwind/shadcn is not applied;
- the page shows raw browser default links/buttons;
- the URL returns stale content;
- the URL has mojibake;
- the URL or report text contains NUL or disallowed control characters.

## Bark Rule

If Bark is requested, send Bark after the URL bundle is ready.

For `CODE_READY` notification:

- `delivered=true` is useful;
- `userReceiptConfirmed` may remain false;
- must not claim `COMPLETED`.

For `FINAL_ACCEPTED`:

- `delivered=true`;
- `skipped=false`;
- `secretLogged=false`;
- `userReceiptConfirmed=true`.

## AI Review Rule

Grok and Cloudflare AI are advisory unless explicitly required.

Timeout, no output, auth error, network error, model unavailable, smoke-only result, or Codex self-review are not approval.

## Control Character And Mojibake Rule

Reports must pass:

- `npm run check:mojibake`
- `npm run check:control-chars`

If mojibake or control characters are detected, status must be `BLOCKED`.

## UI Verification Rule

Required viewports:

- `1980x1080`
- `1650x900`
- `1440x900`
- `1366x768`

Required screenshot pattern:

- `output/playwright/core-documents-redesign/<task>-1980.png`
- `output/playwright/core-documents-redesign/<task>-1650.png`
- `output/playwright/core-documents-redesign/<task>-1440.png`
- `output/playwright/core-documents-redesign/<task>-1366.png`

Required checks:

- page horizontal overflow <= 2px;
- action buttons not clipped;
- save button visible;
- footer not overlapping content;
- table operation column visible;
- CSS/JS assets loaded;
- no raw blue browser links;
- shadcn/Tailwind applied;
- Playwright `toHaveScreenshot()` baseline.

## Gate Split

Required scripts:

- `gate:code`
- `gate:preview`
- `gate:deploy`
- `gate:final`

`gate:code` requires current instruction, control-char check, mojibake check, astro check, build, local Playwright evidence, and screenshots.

`gate:preview` requires public preview URL, HTTP 200, CSS asset 200, JS asset 200, public style check, no raw browser default UI, and 3URL bundle.

`gate:deploy` requires Wrangler auth, deploy, actual Worker Version ID, production URL HTTP 200, latest `/g` URL, and public UTF-8 OK.

`gate:final` requires explicitly required review PASS, Bark final receipt when required, and final log/public URL consistency.

## Stop Conditions

If any of the following occurs, Codex must stop with `BLOCKED_AGENT_COMPLIANCE`:

- `current.md` is missing;
- no 3URL bundle;
- NUL/control character in report;
- stale URL is presented;
- CSS/JS missing public preview is presented;
- Bark notification omits 3 URLs;
- `CODE_READY` is called `COMPLETED`;
- right edge is clipped in the actual screen;
- user says the screen is not visible or not fixed and Codex treats it as PASS.

