# Current AIBOUX Task

## Task Name

Full Master State Update For Service URL Migration And Bark Fix

## Status

CODE_READY

## Source Of Truth

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `ops/instructions/current.md`
- `all_log/81_master_document_full_update.md`

## Current Confirmed State

- Pushed baseline: `88a0577e78d4dd42fb88f6e99af202074ccaa254`.
- Remote: `https://github.com/kenchan76/aiboux.git`.
- Local cleanup-plan commit before this task: `d28c4f3ba8ecf01d8fb437424cdc64751dcedf91`.
- `d28c4f3ba8ecf01d8fb437424cdc64751dcedf91` is local-only unless a later report states it was pushed.
- Worker name: `aiboux`.
- Worker Version ID: `f8867df3-aab9-439b-bf8d-634ada05191d`.
- `npm run gate:aiboux` passed after Worker Version ID evidence was recorded.
- Dirty tree cleanup plan exists at `all_log/80_dirty_tree_cleanup_plan.md`.
- Classification C deletion remains unapproved.
- Full master update verification:
  - `npm run check:control-chars`: PASS.
  - `npm run check:mojibake`: PASS.
  - `npm run gate:aiboux`: `AIBOUX_GATE_PASS`.
- Public `/g/m68` curl before this commit/push still returned the previous deployed artifact; local source `public/g/m68.md` is updated and must be rechecked after push/deployment publication.

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## User Instruction

Update the authoritative master state, not implementation code. `AIBOUX_MASTER_DOCUMENT.md` and `/g/m68` must include the full current specification, completed state, remaining dirty tree state, prohibitions, and next task.

## Required Updates

1. Update `AIBOUX_MASTER_DOCUMENT.md`.
2. Update the `/g/m68` source file: `public/g/m68.md`.
3. Update `ops/instructions/current.md`.
4. Create `all_log/81_master_document_full_update.md`.
5. Run `npm run check:control-chars`.
6. Run `npm run check:mojibake`.
7. Run `npm run gate:aiboux`.
8. If possible, curl `https://mail.aiboux.com/g/m68` and record whether the public body reflects the local source.
9. If only the allowed documentation/artifact files changed, commit with message `docs: update master state for service URL migration`.
10. Push only by normal push: `git push origin HEAD:refs/heads/main`.

## Prohibited Actions

- Do not edit `src/` implementation.
- Do not edit `db/`.
- Do not edit `migrations/`.
- Do not edit `wrangler.toml`.
- Do not edit `package.json`.
- Do not edit `tests/`.
- Do not edit secrets or Cloudflare settings.
- Do not delete untracked files.
- Do not revert tracked source/config diffs.
- Do not run `git reset --hard`.
- Do not run `git clean -fd` or `git clean -fdx`.
- Do not run `rm -rf`.
- Do not send Bark.
- Do not print secrets, PATs, API keys, tokens, `.env`, `.dev.vars`, or Bark endpoint URLs containing secrets.
- Do not force push.
- Do not change `shop.aiboux.com/` back to a storefront direct URL.
- Do not change `mail.aiboux.com/` back to a tenant direct URL.
- Do not change `aiboux.com` into a tenant URL.
- Bark receipt confirmation is not a completion gate.

## Required Master Content

The updated master and `/g/m68` must include:

- current final state;
- canonical URL design;
- migrated URL verification results;
- URL Bundle;
- Bark notification policy;
- gate separation policy;
- Worker evidence;
- Git history;
- dirty tree state;
- absolute prohibitions;
- next task.

## Current Next State

- Next task after this master update: dirty tree dry-run inventory and cleanup approval.
- Any deletion remains `USER_ACTION_REQUIRED`.
