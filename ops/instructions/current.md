# Current AIBOUX Task

## Task Name

Deploy Updated Public Master M68

## Status

DEPLOYED

## Source Of Truth

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `ops/instructions/current.md`
- `all_log/82_m68_public_master_deploy_evidence.md`

## Current Confirmed State

- Current `HEAD`: `0ddedfd7dc54896939580b20997fbb0a01820914` before this deployment task.
- `origin/main`: `0ddedfd7dc54896939580b20997fbb0a01820914` before this deployment task.
- Remote: `https://github.com/kenchan76/aiboux.git`.
- Worker name: `aiboux`.
- Previous Worker Version ID evidence: `f8867df3-aab9-439b-bf8d-634ada05191d`.
- `public/g/m68.md` source was updated and pushed in `0ddedfd7dc54896939580b20997fbb0a01820914`.
- Public `https://mail.aiboux.com/g/m68` still returned the old m68 body after GitHub push, so the prior report is not a complete public master update.
- Deploy completed with Worker Version ID `e7b7d3a1-9224-4fd6-8009-698431b70f49`.
- Public `https://mail.aiboux.com/g/m68` now returns the updated full master body.
- Public m68 required phrase machine check passed.
- 8 URL verification after deploy passed.

## User Instruction

Deploy the updated `public/g/m68.md` to Cloudflare so the public URL `https://mail.aiboux.com/g/m68` returns the new full master body. Completion requires public URL body verification, not just source update and GitHub push.

## Required Commands

1. Confirm Git state.
2. Confirm `public/g/m68.md` contains required master keywords.
3. Source `/home/pkkatsu/.aiboux-secrets/cloudflare.env` without printing its contents.
4. Run:
   - `npm run check:control-chars`
   - `npm run check:mojibake`
   - `npm run gate:aiboux`
   - `ESBUILD_WORKER_THREADS=0 npm run build`
   - `npx wrangler deploy`
5. Record new Worker Version ID evidence with:
   - `npx wrangler versions list --name aiboux --json`
   - `npx wrangler deployments list --name aiboux --json`
6. Verify public `https://mail.aiboux.com/g/m68` body contains required new master phrases.
7. Verify `/g/l68`, `/g/d68`, and the 8 public URLs.
8. Save evidence to `all_log/82_m68_public_master_deploy_evidence.md`.
9. If only evidence and current instruction changed after deployment, commit with message `chore: deploy updated public master m68 evidence`.
10. Push only by normal push: `git push origin HEAD:refs/heads/main`.

## Required Public M68 Phrases

- `AIBOUX_MASTER_DOCUMENT`
- `Service Subdomain Tenant URL Migration`
- `Bark notification policy`
- `Worker Version ID`
- `f8867df3-aab9-439b-bf8d-634ada05191d`
- `dirty tree`
- `URL Bundle`
- `絶対禁止事項`

## Prohibited Actions

- Do not run `git reset --hard`.
- Do not run `git clean -fd` or `git clean -fdx`.
- Do not run `rm -rf`.
- Do not force push.
- Do not print secrets, PATs, API keys, tokens, `.env`, `.dev.vars`, or Bark endpoint URLs containing secrets.
- Do not revert source/config diffs.
- Do not delete Classification C files.
- Do not send Bark before URL Bundle output.
- Do not report completion while public `/g/m68` still returns the old body.
- Bark receipt confirmation is not a completion gate.

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Current Next State

- Public `/g/m68` deployment and body verification completed.
- Next task remains dirty tree dry-run inventory and cleanup approval.
- Classification C deletion remains unapproved and must not be performed.
