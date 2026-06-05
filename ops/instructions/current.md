# CYCLE 0C: SHOP_LOG_TRUTH_PUBLIC_GATE

Active instruction file:

- `ops/instructions/20260605_shop_log_truth_public_gate.md`

Status: `WIP_NOT_FINAL`

## Objective

`gate:shop-log-truth` をローカルファイル検査だけで終わらせず、公開URLをcurl/fetchして検査する。

## Do Not

- Do not touch storefront UI.
- Do not add SEO panels.
- Do not add trust matrix, support rail, action map, buying guide, page quality summary, or visible SEO explanation components.
- Do not claim `FINAL_ACCEPTED`.
- Do not proceed to buyer-surface UI changes in this cycle.

## Do

1. Read local `public/g/m68.md`, `public/g/l68.md`, and `public/g/d68.md`.
2. Fetch public `https://mail.aiboux.com/g/m68`.
3. Fetch public `https://mail.aiboux.com/g/l68`.
4. Fetch public `https://mail.aiboux.com/g/d68`.
5. Fetch public `https://mail.aiboux.com/g/sha68`.
6. Run truth-log format checks against local and public bodies.
7. Require `/g/sha68` normalized SHA verification to be `PASS`.
8. Fail the gate if public URL checks fail.

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
- `npm run astro check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `npx wrangler deploy`
- Public `/g/m68`, `/g/l68`, `/g/d68`, `/g/sha68` curl checks
