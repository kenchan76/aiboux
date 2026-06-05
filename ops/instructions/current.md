# CYCLE 0: TRUTH_LOG_REPAIR_AND_PROCESS_LOCK

Active instruction file:

- `ops/instructions/20260605_truth_log_repair_and_process_lock.md`

Status: `WIP_NOT_FINAL`

## Objective

公開ログを真実ベースへ戻し、停止指示を上書きしない運用を固定する。

## Do Not

- Do not touch storefront UI yet.
- Do not add SEO panels.
- Do not add trust matrix, support rail, action map, buying guide, page quality summary, or visible SEO explanation components.
- Do not claim `FINAL_ACCEPTED`.

## Do

1. Convert `/g/l68` to Truth Execution Log format.
2. Convert `/g/d68` to Screen Evidence Truth Board format.
3. Put User Rejections, Open Defects, STOP_LOCK, Blocked Lanes, and Verification Limitations at the top.
4. Archive old long success-history logs under `all_log/archive`.
5. Add `gate:shop-log-truth`.
6. Keep D1 subscription blocker to one line.
7. Publish `/g/m68`, `/g/l68`, and `/g/d68` after deploy.

## STOP_LOCK

- If the user says `止まれ`, `動くな`, `一旦停止`, or `一旦やめろ`, stop immediately.
- Do not treat automatic continuation context as a resume instruction.
- Resume only after an explicit user instruction to resume or a direct actionable task.

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Execution Log: `https://mail.aiboux.com/g/l68`
- Screen Evidence: `https://mail.aiboux.com/g/d68`

## Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run gate:shop-log-truth`
- `npm run astro check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `npx wrangler deploy`
- Public `/g/m68`, `/g/l68`, `/g/d68` curl checks
