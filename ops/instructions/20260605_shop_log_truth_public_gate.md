# CYCLE 0C: SHOP_LOG_TRUTH_PUBLIC_GATE

Status: `WIP_NOT_FINAL`

## Objective

`gate:shop-log-truth` をローカルファイル検査だけで終わらせず、必ず公開URLを取得して検査する。

対象公開URL:

- `https://mail.aiboux.com/g/m68`
- `https://mail.aiboux.com/g/l68`
- `https://mail.aiboux.com/g/d68`
- `https://mail.aiboux.com/g/sha68`

## Do Not

- Do not touch storefront UI.
- Do not add SEO panels.
- Do not add trust matrix, support rail, action map, buying guide, page quality summary, or visible SEO explanation components.
- Do not claim `FINAL_ACCEPTED`.
- Do not proceed to buyer-surface UI changes in this cycle.

## Do

1. Make `gate:shop-log-truth` read local `public/g/*.md`.
2. Make `gate:shop-log-truth` fetch public `/g/m68`, `/g/l68`, and `/g/d68`.
3. Run the same truth-log top-section checks against public `/g/l68` and `/g/d68`.
4. Verify public `/g/m68` contains the Truth Log Repair override.
5. Fetch public `/g/sha68`.
6. Require public `/g/sha68` to return HTTP 200, `text/markdown`, `Status: PASS`, and normalized match `PASS` for `/g/m68`, `/g/l68`, and `/g/d68`.
7. If public fetch fails, content-type is wrong, or normalized sha fails, `gate:shop-log-truth` must fail.

## STOP_LOCK

- If the user says `止まれ`, `動くな`, `一旦停止`, or `一旦やめろ`, stop immediately.
- Do not treat automatic continuation context as a resume instruction.

## Verification

- `npm run gate:shop-log-truth`
- `npm run check:control-chars`
- `npm run check:mojibake`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `npx wrangler deploy`
- Public curl checks for `/g/m68`, `/g/l68`, `/g/d68`, and `/g/sha68`

## Result Status

Use `DEPLOYED_WIP_NOT_FINAL` only after public URL verification succeeds.
Do not claim `FINAL_ACCEPTED`.
