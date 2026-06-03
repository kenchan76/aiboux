# Shop Aiboux Function Audit After Rollback

## Status

BLOCKED_METHOD

## Reason

The previous Shop production-tenant implementation changed too much at once and degraded the public Shop UI and behavior.
The user confirmed the public rollback is visible and ordered that design must not be changed.

## Scope

Verification-only audit of the current public Shop URLs.

## Target URLs

- `https://shop.aiboux.com/`
- `https://shop.aiboux.com/s/aiboux/`
- `https://shop.aiboux.com/s/aiboux/admin`
- `https://mail.aiboux.com/g/m68`
- `https://mail.aiboux.com/g/l68`
- `https://mail.aiboux.com/g/d68`

## Do

- Verify public HTTP status.
- Verify public Worker Version ID.
- Verify public CSS and JS assets.
- Verify visible links and buttons without destructive submissions.
- Verify admin route coverage.
- Verify storefront route coverage.
- Record NG and unverified items honestly.
- Save an all_log entry.

## Do Not

- Do not change design.
- Do not edit CSS.
- Do not edit layout.
- Do not deploy.
- Do not run DB migrations.
- Do not write production data.
- Do not send Bark.
- Do not claim completion.
- Do not expose secrets.

## Completion For This Audit

This audit is complete only when:

- Public status and route results are recorded.
- Asset results are recorded.
- Link/button findings are recorded.
- Demo/sample dependency is recorded honestly.
- The next implementation approach is constrained to preserve the existing visual baseline.

This audit is not `FINAL_ACCEPTED`.
