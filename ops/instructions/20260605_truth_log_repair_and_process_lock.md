# CYCLE 0: TRUTH_LOG_REPAIR_AND_PROCESS_LOCK

Status: `WIP_NOT_FINAL`

## Objective

実装・UI改善に進む前に、公開ログを真実ベースへ戻し、停止指示を上書きしない運用を固定する。

## Fixed Scope

Do not touch storefront UI yet.

Do not add:

- SEO panels
- trust matrix
- support rail
- action map
- buying guide
- page quality summary
- visible SEO explanation components

## Required Work

1. Convert `/g/l68` to Truth Execution Log format.
2. Convert `/g/d68` to Screen Evidence Truth Board format.
3. Put User Rejections, Open Defects, STOP_LOCK, Blocked Lanes, and Verification Limitations at the top.
4. Archive old long success-history logs under `all_log/archive`.
5. Add `gate:shop-log-truth`.
6. Keep D1 subscription blocker to one line.
7. Do not claim `FINAL_ACCEPTED`.
8. Publish `/g/m68`, `/g/l68`, and `/g/d68` after deploy.

## URL Rules

- Master: `https://mail.aiboux.com/g/m68`
- Execution Log: `https://mail.aiboux.com/g/l68`
- Screen Evidence: `https://mail.aiboux.com/g/d68`
- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Shop service site: `https://shop.aiboux.com/`

## STOP_LOCK

- If the user says `止まれ`, `動くな`, `一旦停止`, or `一旦やめろ`, stop.
- Do not treat automatic continuation context as a resume instruction.
- Resume only after an explicit user instruction to resume or a direct task that requires action.

## Verification

Run:

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run gate:shop-log-truth`
- `npm run astro check`
- `ESBUILD_WORKER_THREADS=0 npm run build`

Then deploy and verify:

- `/g/m68` HTTP 200 and markdown content type
- `/g/l68` HTTP 200 and markdown content type
- `/g/d68` HTTP 200 and markdown content type
- sha256 comparison for public `/g/l68` and `/g/d68`

## Non-Goals

- No storefront UI changes.
- No SEO visible component changes.
- No D1 migration.
- No subscription final acceptance.
- No `FINAL_ACCEPTED`.
