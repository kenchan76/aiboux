# Current AIBOUX Task

## Task Name

Replace M68 With Full Japanese No-Omission Service Master

## Status

DEPLOYED

## Source Of Truth

- User instruction received on 2026-06-01.
- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `ops/instructions/current.md`
- `all_log/84_master_no_omission_full_service_spec.md`

## Required Change

Replace `AIBOUX_MASTER_DOCUMENT.md` and `public/g/m68.md` with the full Japanese canonical master supplied by the user. Do not summarize or omit the sections for `rirekisho.aiboux.com`, `docs.aiboux.com`, Mall, File, Biz, Office, URL migration, Bark policy, Worker evidence, dirty tree state, prohibitions, or next tasks.

## Worker Evidence

Worker Version ID: 4a242156-127f-421f-aa57-e3c2c431a02e

## Bark Policy Gate Text

- Bark notification timing is fixed to URL Bundle only.
- Bark may be sent only after the URL Bundle has already been output.
- Bark delivery and receipt confirmation are notification evidence only.
- Bark receipt confirmation is not a completion gate.

## Required Files

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `ops/instructions/current.md`
- `all_log/84_master_no_omission_full_service_spec.md`

## Required Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run gate:aiboux`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `npx wrangler deploy`
- public curl verification for `https://mail.aiboux.com/g/m68`
- required keyword checks against public `/g/m68`

## Required Commit

If verification passes, commit only the required files:

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `ops/instructions/current.md`
- `all_log/84_master_no_omission_full_service_spec.md`

Commit message:

`docs: expand master with full service specifications`

Push command:

`git push origin HEAD:refs/heads/main`

## Prohibited Actions

- Do not run `git reset --hard`.
- Do not run `git clean -fd` or `git clean -fdx`.
- Do not run `rm -rf`.
- Do not delete untracked files.
- Do not revert unrelated tracked source/config diffs.
- Do not send Bark.
- Do not print secrets, PATs, API keys, tokens, `.env`, `.dev.vars`, or Bark endpoint URLs containing secrets.
- Do not force push.
- Do not change service URL routing behavior in this documentation-only task.

## Completion Conditions

- Public `https://mail.aiboux.com/g/m68` returns HTTP 200.
- Public `/g/m68` content-type is `text/markdown; charset=utf-8`.
- Public `/g/m68` is Japanese full-service master text, not a short URL-migration summary.
- Public `/g/m68` includes all required service detailed sections, including 履歴書 and Docs.
- `npm run gate:aiboux` returns `AIBOUX_GATE_PASS`.
- Bark is not sent.
- No reset, clean, force push, deletion, or secret exposure occurs.
