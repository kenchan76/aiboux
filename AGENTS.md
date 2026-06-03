# AIBOUX Agent Instructions

The active single source of truth is `AIBOUX_MASTER_DOCUMENT.md`.

Before implementation, Codex / Claude / development AI must read `AIBOUX_MASTER_DOCUMENT.md`, inspect the current code, and only then begin work. Do not rely on archived files under `docs/archive/` as active specifications.

## Minimum Rules

- Do not infer TBD items.
- Keep confirmed decisions, assumptions, and TBD separate.
- Do not invent URLs, prices, storage limits, retention periods, free tiers, or implementation status.
- Do not copy competitor UI text, templates, or content.
- Do not auto-send email, publish externally, delete data/files, change prices, push Git, change subscription state, or perform other high-risk actions without human approval. Normal code/UI/API production deployment is allowed after the required checks in `AIBOUX_MASTER_DOCUMENT.md` pass, unless the user explicitly says not to deploy.
- At completion, report changed files, verification, unresolved items, and a 24-hour temporary URL for the final log or requested artifact.

## Current Active Override Rule

`AIBOUX_MASTER_DOCUMENT.md` is the active Source of Truth.
If older preserved source snapshots conflict with the Current Active Operating Overrides in `AIBOUX_MASTER_DOCUMENT.md`, the Current Active Operating Overrides section wins.

## Hermes Agent Minimal Operating Rule

Hermes Agent may be used on the VPS as an instruction-compliance and conflict-audit agent.

Hermes may:
- read AIBOUX specs;
- read all_log;
- read Playwright screenshots and DOM audit JSON;
- read Grok and Cloudflare AI review logs;
- compare user instructions, reference images, screenshots, DOM text, API responses, and completion logs;
- audit whether check/build/Playwright, required screenshots, required Grok/Cloudflare AI reviews, public URL checks, Worker Version ID recording, and all_log evidence exist before a normal deployment is accepted;
- create NG reports;
- create conflict reports;
- create cleanup candidate reports.

Hermes must not:
- edit production code unless explicitly approved;
- run git push;
- run wrangler deploy;
- delete files destructively;
- expose `.env`, `.dev.vars`, tokens, API keys, or auth files;
- execute destructive D1 migrations;
- send email, FAX, SNS, or external messages;
- change prices;
- publish or delete production content;
- send customer data, email bodies, file bodies, personal data, or secrets to external systems.

Codex remains the implementation agent.
Hermes is only a verifier and conflict auditor; Hermes is not a deployment executor.

Normal implementation completion is primarily proven by:
- check/build pass;
- required Playwright pass;
- 1980x1080 screenshots for UI changes;
- public URL verification;
- Worker Version ID recording after deploy;
- all_log update;
- 24-hour URL and `/g/...` short URL.

Grok and Cloudflare AI are reference reviewers. They can provide UX, wording, visual mismatch, D1/API/tenant_id, and Cloudflare configuration support, but they are not the primary completion gate. A Grok or Cloudflare AI `PASS` must not replace Playwright, public URL checks, Worker Version ID recording, or Bark receipt confirmation.

If Hermes reports a concrete mismatch against primary evidence, Codex / Claude / development AI must address or explicitly log it. Hermes readiness smoke alone is not completion approval.

After normal implementation completion is fully verified and reported, Codex / development AI should send a Bark implementation-complete notification when Bark is enabled. When the user explicitly requires Bark notification, `BARK_DISABLED`, `skipped=true`, `delivered=false`, missing Bark secrets, or a failed Bark API response are blocking NG conditions. Bark device keys, tokens, and full endpoint URLs are secrets and must not be written to chat, docs, or all_log. Hermes audits Bark evidence only; Hermes is not the Bark sender.

## Bark Completion Notification Rule

When a task requires Bark notification, Codex must not report `COMPLETED` until Bark delivery succeeds and user receipt is confirmed.

Bark success requires:
- required smoke/auth check passed;
- `delivered=true`;
- `skipped=false`;
- `secretLogged=false`;
- `userReceiptConfirmed=true`.

Bark failure states:
- `BARK_DISABLED`;
- missing Bark env;
- skipped notification;
- `delivered=false`;
- `userReceiptConfirmed=false`;
- secret logged;
- user says the Bark notification did not arrive;
- required receipt confirmation is missing.

If Bark fails, report `BLOCKED`. Do not claim completion.

Bark keys, endpoint URLs containing keys, tokens, `.env`, `.dev.vars`, and `/home/pkkatsu/.aiboux-secrets/bark.env` contents must never be printed or written to logs.

## AI Review Non-Response Rule

If a required AI reviewer does not respond, Codex must not treat it as approval.

Codex must:
- investigate the cause;
- run a smoke test;
- reduce the prompt scope;
- retry with focused prompts;
- save a secret-safe stdout/stderr summary;
- write an `all_log` `BLOCKED` entry if approval is still unavailable.

Timeout, no output, empty output, auth error, network error, rate limit, model unavailable, tool unavailable, ambiguous text, and fallback self-review only are `NG`, not `PASS`.

Completion must not claim AI review `PASS` unless the reviewer returned explicit approval such as `PASS`, `APPROVED`, `承認`, or `no blockers found`.

Grok and Cloudflare AI non-response does not by itself block `CODE_READY`, `PREVIEW_READY`, or `DEPLOYED`, but it does block any claim that those specific AI reviews passed.

## AI Reference Review Rule

Grok and Cloudflare AI are reference reviewers, not primary completion gates.

Grok is for UX review, wording review, and visual-discomfort notes.

Cloudflare AI is for D1/API/tenant_id and Cloudflare configuration support audits.

Forbidden:
- claiming completion based on Grok `PASS` alone;
- claiming completion based on Cloudflare AI `PASS` alone;
- skipping real public URL verification because AI review passed;
- treating `GROK_READY`, `HERMES_READY`, model list responses, timeout, no output, or Codex self-review as approval.

`FINAL_ACCEPTED` requires implementation, public URL visibility, Playwright real-behavior verification, `/g/...` latest log evidence, UTF-8 public evidence, actual Worker Version ID, Bark `userReceiptConfirmed=true` when Bark is required, and `npm run gate:aiboux` PASS.

## Reference UI Review Pack Rule

After Codex finishes a reference-image UI task, create a review pack and run Grok and Cloudflare AI review against the same instruction and artifacts.

The review pack must include the exact instruction, reference image, actual screenshots, comparison HTML, DOM audit JSON, Playwright result, changed files, and execution log.

Do not report CODE_READY if the reviewers did not load the instruction and reference/actual images.

## Core Delivery Detail Typography Rule

Typography audit is required for Core delivery detail reference-image UI tasks.

Font-weight alone is insufficient. The audit must check:
- font-size;
- line-height;
- font color;
- font-weight.

Values and product names must remain normal weight, 13px, 20px line-height, and use the approved slate/blue color tokens.

## Reference Design Auto-Repair Rule

If a reference-image comparison fails, Codex must keep fixing internally.

Do not return `ACTIVE_DESIGN_FIX` to the user.

Do not send Bark for known-failing internal iterations.

Only report when the preview passes all reference gates as `PREVIEW_READY_PENDING_USER`, or when a real hard blocker prevents further progress.

## USER_ACTION_REQUIRED Secret Gate Rule

When a required gate needs missing or invalid secrets, Codex must stop and report `USER_ACTION_REQUIRED`.

Stop conditions include:
- missing `/home/pkkatsu/.aiboux-secrets/cloudflare.env`;
- missing `CLOUDFLARE_API_TOKEN`;
- missing `CLOUDFLARE_ACCOUNT_ID`;
- failing `npx wrangler whoami`;
- Bark notification not received by the user;
- `userReceiptConfirmed=false`;
- Hermes failing because Cloudflare auth/provider readiness is missing;
- any required secret input.

Codex must not infer secrets, print secrets, retry deploy without valid authentication, retry Bark as if API success equals receipt, retry Hermes as if provider failure is approval, or create repeated temporary URLs to simulate progress.

After the user says `secret入力完了`, Codex may resume verification and deployment.

## Progressive Completion Rule

Do not collapse implementation, deployment, AI review, notification, and logging into one gate.

Use:
- `CODE_READY` for verified local implementation;
- `PREVIEW_READY` for user-visible preview URL verification;
- `DEPLOYED` for verified production deployment with an actual Worker Version ID;
- `FINAL_ACCEPTED` for completed external review and notification gates;
- `USER_ACTION_REQUIRED` when human secret input is required;
- `BLOCKED` for unresolved system/tool failures.

Do not use `COMPLETED` unless the status is `FINAL_ACCEPTED`.

If human secret input is required, stop and ask for that input only.

## Public Preview Required Rule

Do not ask the user to verify VPS-local or localhost output.

If user verification is needed for UI, document, print, PDF, image, or log work, provide a public preview URL or production URL.

Local checks are for Codex and automated agents only. Local-only evidence can support `CODE_READY`, but it is not user-verifiable and must not be called `PREVIEW_READY`, `DEPLOYED`, `FINAL_ACCEPTED`, or `COMPLETED`.

Temporary Cloudflare Tunnel URLs are fallback `TEMP_PREVIEW` evidence only. Do not create repeated trycloudflare URLs to simulate progress, and do not treat stale `/g/...` URLs as current evidence.

Public preview evidence must prove the styled app is actually loaded. HTTP 200 for the HTML is not enough: `_astro` CSS/JS assets must return 200, Tailwind/shadcn/ui styles must be applied, and plain browser-default blue links/buttons must be treated as `BLOCKED_PREVIEW`.

## Required Report URL Bundle

When reporting `CODE_READY`, `PREVIEW_READY`, `DEPLOYED`, or `FINAL_ACCEPTED`, Codex must provide:
- master document update preview URL;
- execution log preview URL;
- screen or artifact preview URL.

Do not ask the user to verify localhost, `127.0.0.1`, or VPS-local-only output.

If one of the three URLs cannot be provided, report the exact status and the missing URL reason instead of implying completion.

## AIBOUX Markdown Instruction Rule

Codex must not start AIBOUX implementation from chat text alone.

Every task must be converted into a Markdown instruction file under:

`ops/instructions/`

The active task must be reflected in:

`ops/instructions/current.md`

Codex must follow the Markdown instruction file exactly.

If the instruction file and chat differ, Codex must update the instruction file before implementation or ask for clarification when the conflict cannot be resolved safely.

## AIBOUX Three-Strike Improvement Rule

If the user rejects the same result three times, Codex must stop and change method.

Use `BLOCKED_METHOD` or the relevant blocked status.

Do not continue with the same testing, layout, preview, or reporting approach.

Codex must update the Markdown instruction, identify the failed method, and add or strengthen a gate before continuing.

## AIBOUX Daily Improvement Rule

Codex must improve the AIBOUX workflow daily by checking current official documentation and adding at least one practical process improvement when applicable.

Write the daily improvement note under:

`ops/improvements/YYYYMMDD_daily_improvement.md`

## AIBOUX Design Skill Rule

For every AIBOUX Core/Mail/Shop UI design task, use `.agents/skills/aiboux-design-review/SKILL.md`.

Design assistants such as Impeccable, Taste Skill, image-to-code, Frontend App Builder, Grok, and Cloudflare AI are advisory only.

The main design gate is public preview plus Playwright visual evidence.

Run or satisfy `npm run gate:design` before reporting CODE_READY or PREVIEW_READY for UI work.

## AIBOUX Required URL Bundle Rule

Every user-facing implementation report must include:

1. Master update preview URL
2. Execution log preview URL
3. Screen/artifact preview URL

Local paths, screenshots only, localhost URLs, or stale `/g/...` URLs are not valid substitutes.

## AIBOUX Progressive Status Rule

Use:

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

Do not say COMPLETED unless the status is FINAL_ACCEPTED.

## AIBOUX Public Preview Rule

Do not ask the user to verify VPS-local or localhost output.

If the user needs to check UI, provide a public preview URL.

The public preview must pass:

- HTTP 200
- CSS asset 200
- JS asset 200
- public Playwright style check
- no raw browser default UI
- no stale content
- no mojibake
- no control characters

## AIBOUX Bark Progress Notification Rule

Bark notification is not final-only.

When the user requests Bark notifications, Codex must send Bark after each Codex work unit finishes or pauses, including CODE_READY, PREVIEW_READY, DEPLOYED, BLOCKED, USER_ACTION_REQUIRED, URL bundle creation, and waiting for user input.

This is a progress notification. It is separate from the final completion Bark gate.

Progress Bark requires:
- Bark API send success;
- skipped=false;
- secretLogged=false.

Progress Bark does not require userReceiptConfirmed=true.

Final Acceptance Bark is still required for FINAL_ACCEPTED / COMPLETED and requires:
- delivered=true;
- skipped=false;
- secretLogged=false;
- userReceiptConfirmed=true.

## Final User Report Sanitization Rule

Do not hand-write URL bundles in chat.

Generate the final user-facing report with `scripts/render-aiboux-report.mjs`.

Before reporting, run:
- `npm run check:control-chars`
- `npm run check:mojibake`
- final user report control-character check

If the final report contains NUL/control characters, replacement characters, mojibake, or broken URL labels, do not report.

## Short URL And Progress Bark Rule

Use only short URLs in user-facing reports.

Do not show long preview URLs directly to the user.

Place URLs in a clear URL bundle section when reporting work status or when the user asks for URLs again.

Send Bark progress notifications when a work unit finishes or pauses, if Bark is requested or configured.

CODE_READY, PREVIEW_READY, DEPLOYED, BLOCKED, and USER_ACTION_REQUIRED may trigger Bark progress notification without being FINAL_ACCEPTED or COMPLETED.

## URL Reissue Rule

If the user asks for the URL again, reissue the latest available URLs immediately.

Do not refuse URL reissue because the status is CODE_READY, PREVIEW_READY, DEPLOYED, BLOCKED, or USER_ACTION_REQUIRED.

When included, URLs should be short URLs where available.

## AIBOUX AI Review Rule

Grok and Cloudflare AI are advisory by default.

Do not treat AI timeout, no output, smoke test, or self-review as approval.

## AIBOUX Stop Loop Rule

If a secret or human action is required, stop with USER_ACTION_REQUIRED.

Do not keep regenerating logs, URLs, tunnels, or Bark notifications.

## Bark Notification Timing Rule

The 3URL Bundle is required for reports and should be included in Bark progress notifications when a work unit finishes or pauses.

For CODE_READY, PREVIEW_READY, DEPLOYED, BLOCKED, and USER_ACTION_REQUIRED logs, classify Bark as:
- Progress Notification
- Final Acceptance Notification

Do not write Bark secrets, endpoint URLs containing secrets, tokens, `.env`, `.dev.vars`, or `/home/pkkatsu/.aiboux-secrets/bark.env` contents to logs or chat.

## Codex Image Generation URL Rule

When Codex generates or edits an image for AIBOUX with image-gen / `$imagegen`, it must provide a user-visible URL.

Generated or edited images must:
- be saved under `output/imagegen/`;
- be published through a temporary 24-hour image URL;
- have a `/g/...` short URL when possible;
- be reported with image name, local path, temporary URL, short URL, expiry, and source instruction.

Local-only image generation is not complete. Generated images are reference artifacts only; they do not prove implementation. Implementation acceptance requires Playwright real-screen screenshots, Grok review when needed, Cloudflare AI audit when needed, and Hermes audit when needed.

The AIBOUX-specific image generation workflow is documented at `.agents/skills/aiboux-imagegen/SKILL.md`.

Completion is not valid if Hermes finds an unresolved mismatch between:
- user instruction;
- reference image;
- actual Playwright screenshot;
- public URL;
- DOM/API/D1 data;
- Grok review;
- Cloudflare AI audit;
- completion log.

## Core Delivery Detail Font Weight Rule

For Core delivery detail screens, only titles, labels, and table headers may be bold.

Values, product names, product codes, numeric values, amount values, memo/history body, and footer amount values must use normal font weight.

Core delivery detail design work must include a font-weight audit.
