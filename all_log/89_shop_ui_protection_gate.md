# Shop UI Protection Gate

## Status

BLOCKED_METHOD

## Purpose

Prevent another deployment that changes or degrades the Shop UI by accident.

## Implemented Protection

Added:

- `scripts/check-shop-ui-protection.mjs`

Updated:

- `package.json`
- `scripts/aiboux-gate-check.mjs`
- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `ops/instructions/current.md`

## Protected Paths

- `src/pages/shop`
- `src/components/shop`
- `src/data/shop-sample-data.ts`
- `src/styles`
- `src/assets`

## Deploy Guard

The following npm scripts now run Shop UI protection before deploy:

- `npm run deploy`
- `npm run deploy:preview`
- `npm run deploy:prod`

The deploy gate also runs Shop UI protection:

- `npm run gate:deploy`
- `npm run gate:aiboux`

## Current Expected Result

The current local tree contains dirty/untracked Shop UI paths.
Therefore the guard must fail.

Observed result:

```text
npm run check:shop-ui-protection
SHOP_UI_PROTECTION_NG: protected Shop UI paths are dirty. Deploy is blocked until UI risk is reviewed.
```

Observed deploy gate result:

```text
npm run gate:deploy
FAIL: Shop UI deploy protection - exit=1
AIBOUX_GATE_BLOCKED stage=deploy failures=1
```

This is intentional.

## Approval Override

The protection can only be bypassed with both values:

```bash
AIBOUX_SHOP_UI_CHANGE_APPROVED=1
AIBOUX_SHOP_UI_CHANGE_LOG=all_log/<evidence>.md
```

This override must only be used after explicit user approval and after visual/public/operation evidence exists.

## Risk Reduction

This does not make direct `wrangler deploy` impossible at the operating-system level.
It does block the project npm deploy scripts and AIBOUX deploy gate.
Codex must not use direct `wrangler deploy` to bypass this protection.

## Verification

- `package.json` parsed successfully.
- `npm run check:shop-ui-protection` failed as expected.
- `npm run gate:deploy` failed as expected because Shop UI protection failed.

## Prohibited Actions Confirmation

- No design change.
- No CSS change.
- No layout change.
- No DB write.
- No migration apply.
- No deploy.
- No Bark send.
- No reset.
- No clean.
- No force push.
- No secret display.
