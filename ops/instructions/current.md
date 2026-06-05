# CYCLE 0B: NORMALIZED_G_SHA_VERIFICATION

Active instruction file:

- `ops/instructions/20260605_normalized_g_sha_verification.md`

Status: `WIP_NOT_FINAL`

## Objective

`/g/m68`、`/g/l68`、`/g/d68` のruntime Worker Version ID置換によるsha不一致を、正規化shaで厳密に検証して記録する。

## Do Not

- Do not touch storefront UI.
- Do not add SEO panels.
- Do not add trust matrix, support rail, action map, buying guide, page quality summary, or visible SEO explanation components.
- Do not claim `FINAL_ACCEPTED`.

## Do

1. Add normalized sha verification for `/g/m68`, `/g/l68`, and `/g/d68`.
2. Record local raw sha256.
3. Record public raw sha256.
4. Record local normalized sha256 after Worker Version ID normalization.
5. Record public normalized sha256 after Worker Version ID normalization.
6. Record normalized match result.
7. If normalized sha does not match, fail.
8. Publish the normalized sha record at `/g/sha68`.

## STOP_LOCK

- If the user says `止まれ`, `動くな`, `一旦停止`, or `一旦やめろ`, stop immediately.
- Do not treat automatic continuation context as a resume instruction.
- Resume only after an explicit user instruction to resume or a direct actionable task.

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Execution Log: `https://mail.aiboux.com/g/l68`
- Screen Evidence: `https://mail.aiboux.com/g/d68`
- Normalized SHA Evidence: `https://mail.aiboux.com/g/sha68`

## Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run gate:shop-log-truth`
- `npm run verify:g-normalized-sha`
- `npm run astro check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `npx wrangler deploy`
- Public `/g/m68`, `/g/l68`, `/g/d68`, `/g/sha68` curl checks
