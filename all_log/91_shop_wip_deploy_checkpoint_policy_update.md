# Shop WIP Deploy Checkpoint Policy Update

## Status

BLOCKED_METHOD

## Policy Change

The previous protection blocked deployment when Shop UI paths were dirty.
The user corrected the policy:

- Do not stop WIP deploy just because UI is dirty.
- Create rollback checkpoint first.
- Deploy WIP when build passes.
- Verify on public URL.
- Roll back if bad.
- Block only final acceptance until strict checks pass.

## Implemented Changes

Added:

- `scripts/create-shop-wip-checkpoint.mjs`

Updated:

- `scripts/check-shop-ui-protection.mjs`
- `package.json`
- `scripts/aiboux-gate-check.mjs`
- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `ops/instructions/current.md`

## Script Behavior

### Warn mode

```bash
npm run check:shop-ui-protection
```

Runs:

```bash
node scripts/check-shop-ui-protection.mjs --mode=warn
```

Dirty Shop UI paths produce `SHOP_UI_PROTECTION_WARN` but exit 0.

### Strict mode

```bash
npm run check:shop-ui-protection:strict
```

Runs:

```bash
node scripts/check-shop-ui-protection.mjs --mode=strict
```

Dirty Shop UI paths produce `SHOP_UI_PROTECTION_NG` and exit 1.

### WIP checkpoint

```bash
npm run shop:checkpoint
```

Creates:

- `all_log/checkpoints/<TS>_status_before.txt`
- `all_log/checkpoints/<TS>_head_before.txt`
- `all_log/checkpoints/<TS>_origin_main_before.txt`
- `all_log/patches/<TS>_before_deploy.patch`
- `all_log/patches/<TS>_before_deploy_staged.patch`
- `all_log/checkpoints/<TS>_log_before.txt`
- `all_log/checkpoints/<TS>_wip_commit.txt`
- `all_log/deploys/<TS>_deployments_before.txt`

### WIP deploy

```bash
npm run deploy:shop:wip
```

Flow:

1. checkpoint and WIP commit
2. control character check
3. mojibake check
4. build
5. warn-only Shop UI protection
6. Wrangler deploy

### Final verification

```bash
npm run verify:shop:final
```

Flow:

1. control character check
2. mojibake check
3. AIBOUX gate
4. strict Shop UI protection
5. build
6. Playwright

## Verification Required After This Policy Update

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run check:shop-ui-protection`
- `npm run check:shop-ui-protection:strict`
- `npm run gate:deploy`
- `ESBUILD_WORKER_THREADS=0 npm run build`

Expected:

- warn mode exits 0 with warnings.
- strict mode exits 1 while dirty Shop UI paths remain.
- deploy gate is not blocked by Shop UI warning.

Observed:

```text
package.json parse: PASS
npm run check:control-chars: PASS
npm run check:mojibake: PASS
npm run check:shop-ui-protection: WARN, exit 0
npm run check:shop-ui-protection:strict: NG, exit 1
npm run gate:deploy: AIBOUX_GATE_DEPLOYED
ESBUILD_WORKER_THREADS=0 npm run build: PASS
```

## No External Side Effects

This policy update did not deploy, write DB, run migration, send Bark, reset, clean, force push, or expose secrets.
