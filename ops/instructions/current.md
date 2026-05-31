# Current AIBOUX Task

## Task Name

Rewrite Public Master M68 In Japanese And Verify Public Reflection

## Status

DEPLOYED

## Source Of Truth

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `ops/instructions/current.md`
- `all_log/83_master_japanese_rewrite_and_public_reflection.md`

## Current Confirmed State

- Current `HEAD`: `94d05b92b13be63d0334e2909ce00e2a6bd7f6ab` before this Japanese rewrite task.
- `origin/main`: `94d05b92b13be63d0334e2909ce00e2a6bd7f6ab` before this Japanese rewrite task.
- Remote: `https://github.com/kenchan76/aiboux.git`.
- Worker name: `aiboux`.
- Latest deployed Worker Version ID for Japanese m68: `dd94cfa3-b5fa-40a7-8ab1-954b942136f3`.
- Public `https://mail.aiboux.com/g/m68` returns the Japanese master body.
- Public m68 HTTP status: `200`.
- Public m68 content-type: `text/markdown; charset=utf-8`.
- Public m68 cache-control: `no-store, max-age=0`.
- Public/source normalized sha256: `9c230d89b720c5ea64230fcf03796929a8fee11e87fa367dc6c006264c2bd3d9`.
- `npm run gate:aiboux`: `AIBOUX_GATE_PASS`.
- GitHub repo is `https://github.com/kenchan76/aiboux.git`. ChatGPT-side connector Not Found must not be treated as repo absence; XSERVER/Codex git CLI is authoritative.

## User Instruction

Rewrite `AIBOUX_MASTER_DOCUMENT.md` and public `public/g/m68.md` as a thick Japanese master. Deploy it and verify that public `https://mail.aiboux.com/g/m68` returns the Japanese master body with required sections and evidence.

## Required Public M68 Sections

- `現在の確定状態`
- `URL設計の正仕様`
- `移行判定表`
- `Bark通知方針`
- `Worker証跡`
- `dirty tree状態`
- `絶対禁止事項`
- `次タスク`

## Required Public Reflection Evidence

- checked_at timestamp
- curl command
- HTTP status
- content-type
- cache-control
- public m68 sha256
- source `public/g/m68.md` sha256
- source/public match or mismatch with reason
- Worker Version ID after deploy
- `npm run gate:aiboux` result

## Prohibited Actions

- Do not run `git reset --hard`.
- Do not run `git clean -fd` or `git clean -fdx`.
- Do not run `rm -rf`.
- Do not delete untracked files.
- Do not revert tracked source/config diffs.
- Do not make unrelated source/config changes.
- Do not send Bark.
- Do not print secrets, PATs, API keys, tokens, `.env`, `.dev.vars`, or Bark endpoint URLs containing secrets.
- Do not force push.
- Do not change `shop.aiboux.com/` back to a storefront direct URL.
- Do not change `mail.aiboux.com/` back to a tenant direct URL.
- Do not change `aiboux.com` into a tenant URL.
- Do not recreate existing `tenant_id`, `shop_id`, `mailbox_id`, or `user_id`.
- Do not report completion while public `/g/m68` is old or English-centered.
- Bark receipt confirmation is not a completion gate.

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Current Next State

- Japanese public master m68 has been rebuilt, deployed, fetched, and mechanically verified.
- Commit and normal push are pending for the documentation/evidence changes only.
- Next task after this commit/push remains dirty tree cleanup approval and dry-run inventory.
