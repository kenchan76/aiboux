# Current AIBOUX Task

## Task Name

Deepen Public Master M68 As Japanese Source Of Truth

## Status

DEPLOYED

## Source Of Truth

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `ops/instructions/current.md`
- `all_log/83_master_japanese_rewrite_and_public_reflection.md`

## Current Confirmed State

- Current `HEAD`: `d7f36ac98eb8b8523b7391ac73b784a1ed3f531c` before this deepening task.
- `origin/main`: `d7f36ac98eb8b8523b7391ac73b784a1ed3f531c` before this deepening task.
- Remote: `https://github.com/kenchan76/aiboux.git`.
- Worker name: `aiboux`.
- Latest pushed baseline before this deepening task: `d7f36ac98eb8b8523b7391ac73b784a1ed3f531c`.
- Latest deployed Worker Version ID for deep Japanese m68: `d5e4f2de-0f98-4404-a7a1-05b2a1b00dd1`.
- Public `https://mail.aiboux.com/g/m68` returns the deeper Japanese master body.
- Public m68 HTTP status: `200`.
- Public m68 content-type: `text/markdown; charset=utf-8`.
- Public m68 cache-control: `no-store, max-age=0`.
- Public/source normalized sha256: `e860fe6616b70101ba936e3a481a1b1c1dd45e5f47991e389f74643225e96344`.
- `npm run gate:aiboux`: `AIBOUX_GATE_PASS`.
- GitHub repo is `https://github.com/kenchan76/aiboux.git`. ChatGPT-side connector Not Found must not be treated as repo absence; XSERVER/Codex git CLI is authoritative.

## User Instruction

Deepen `AIBOUX_MASTER_DOCUMENT.md` and public `public/g/m68.md` as a thick Japanese master. Deploy it and verify that public `https://mail.aiboux.com/g/m68` returns the deeper Japanese master body with required sections, migration rationale, data/ID protection policy, and evidence.

## Required Public M68 Sections

- `現在の確定状態`
- `今回の結論`
- `URL設計の正仕様`
- `旧URLから新URLへの移行判定表`
- `Mail移行の判断根拠`
- `Shop移行の判断根拠`
- `独自ドメイン方針`
- `データ移行方針`
- `既存ID保護方針`
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

- Deeper Japanese public master m68 has been rebuilt, deployed, fetched, and mechanically verified.
- Commit and normal push are pending for the documentation/evidence changes only.
- Next task after this commit/push remains dirty tree cleanup approval and dry-run inventory.
