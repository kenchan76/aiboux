# Production Deployment Rule Contradiction Check Log

Date: 2026-05-30
Workspace: `/home/pkkatsu/aiboux`

## Scope

Checked:
- `AIBOUX_MASTER_DOCUMENT.md`
- `AGENTS.md`
- `AGENT_RULES.md`
- `docs/`

Command:

```bash
rg "人間承認|本番反映|デプロイ承認|承認後のみ|wrangler deploy|自動実行させない|Human Approval|deploy" AIBOUX_MASTER_DOCUMENT.md AGENTS.md AGENT_RULES.md docs || true
```

## Result

No unresolved active-rule contradiction remains.

Active rule:
- Normal code/UI/API production deployment may run after required verification passes.
- Normal deploy command: `npx wrangler deploy --keep-vars`.
- Verification is not optional.

Human approval is still required for:
- `git push`
- destructive DB migration
- D1 table or production data deletion
- destructive file deletion such as `rm -rf`
- secret/API key/token/`.env`/`.dev.vars` display or transfer
- real email/FAX/SNS sending
- price changes
- billing or subscription state changes
- external marketplace publication
- customer data, email body, file body, personal data, or secrets sent externally
- legal/pricing/contract/refund policy finalization
- any task where the user explicitly says not to deploy

## Archive Handling

Old deployment-approval wording remains only in archived historical snapshots under:

- `docs/archive/2026-05-27-pre-master/AIBOUX_DEVELOPMENT_HANDOFF.md`
- `docs/archive/2026-05-27-pre-master/AIBOUX_MASTER_SPEC.md`
- `docs/archive/2026-05-27-pre-master/AIBOUX_VOICE_AND_DEV_MONITOR_SPEC.md`
- `docs/archive/2026-05-27-pre-master/AIBOUX_REMOTE_DEV_WORKFLOW.md`
- `docs/archive/2026-05-27-pre-master/AIBOUX_MCP_API_SPEC.md`

Each file now has an archive note at the top stating that it is historical only and that current deployment rules are governed by `AIBOUX_MASTER_DOCUMENT.md` and the Production Deployment Rule.

## Hermes Boundary

Hermes Agent is not a deployment executor.

Hermes audits whether deployment was allowed and evidenced:
- check/build/Playwright passed;
- UI screenshots exist when UI changed;
- Grok Build / Cloudflare AI passed when required;
- public URL verification exists;
- Worker Version ID is recorded;
- `all_log/` claims match actual screens/data.

Hermes must mark NG when:
- deployment was done without verification;
- completion relied only on logs without screen/public evidence;
- high-risk actions were executed without human approval;
- old and new deployment rules remain contradictory.

## Files Updated

- `AIBOUX_MASTER_DOCUMENT.md`
- `docs/archive/2026-05-27-pre-master/AIBOUX_DEVELOPMENT_HANDOFF.md`
- `docs/archive/2026-05-27-pre-master/AIBOUX_MASTER_SPEC.md`
- `docs/archive/2026-05-27-pre-master/AIBOUX_VOICE_AND_DEV_MONITOR_SPEC.md`
- `docs/archive/2026-05-27-pre-master/AIBOUX_REMOTE_DEV_WORKFLOW.md`
- `docs/archive/2026-05-27-pre-master/AIBOUX_MCP_API_SPEC.md`
- `all_log/49_production_deployment_rule_contradiction_check_log.md`

## Notes

- `AGENTS.md` already states that normal code/UI/API production deployment is allowed after required checks pass, unless the user explicitly says not to deploy.
- `AGENT_RULES.md` contains no conflicting deployment approval rule.
- `docs/VPS_MIGRATION_SUCCESS.md` is not present at the active path; the historical file exists at `docs/archive/2026-05-27-pre-master/VPS_MIGRATION_SUCCESS.md`.
- Hermes installation had been started from the prior instruction before this contradiction-check instruction arrived. No Hermes setup wizard, notification gateway, first audit, deployment, or git push was executed as part of this contradiction-check pass.

## Verification

- `npm run astro check`: passed with 0 errors, 0 warnings, 27 existing hints.
- `ESBUILD_WORKER_THREADS=0 npm run build`: passed.
