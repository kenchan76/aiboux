# Public Execution Log Required Rule

## Status

WIP_LOG_RULE_READY_TO_DEPLOY

## Rule

Codex must publish execution logs to public `/g/*` URLs before every user-facing report.

Required public URLs:

- Execution log URL: `https://mail.aiboux.com/g/l68`
- Screen evidence URL: `https://mail.aiboux.com/g/d68`
- Master URL: `https://mail.aiboux.com/g/m68`

## Prohibited Reports

The following are prohibited as user-facing reports:

- reporting only `all_log/...`;
- reporting only that `public/g/*.md` was updated locally;
- reporting that the next deploy will publish the log;
- reporting only SHA values;
- reporting PASS results without public URL evidence.

## Required Before Report

Before reporting, Codex must:

1. write execution evidence to `public/g/l68.md`;
2. write screen/artifact evidence to `public/g/d68.md`;
3. update `AIBOUX_MASTER_DOCUMENT.md` and `public/g/m68.md` when the master changes;
4. build;
5. deploy;
6. curl `https://mail.aiboux.com/g/m68`;
7. curl `https://mail.aiboux.com/g/l68`;
8. curl `https://mail.aiboux.com/g/d68`;
9. record HTTP status, content-type, and SHA256;
10. put the three public URLs at the top of the user-facing report.

## Relationship To WIP Deploy

Shop UI protection can remain warn-only for WIP deploys.
Public execution log publication is mandatory and is not warn-only.

## Safety

- No DB migration was applied for this rule update.
- No Bark notification was sent.
- No secrets were printed.
- `git reset --hard` was not run.
- `git clean -fd` was not run.
- Force push was not run.
