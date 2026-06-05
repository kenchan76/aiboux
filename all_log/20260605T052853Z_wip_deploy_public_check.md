# WIP Deploy Public Check

Status: `WIP_DEPLOYED_NOT_FINAL`

This is not `FINAL_ACCEPTED`.

## Deploy

- Worker Version ID: `0f865b57-1e7c-4786-823e-24ec36c2a477`.
- Deploy command: `npm run deploy:shop:wip`.
- Checkpoint timestamp: `20260605T052701Z`.

## Public URL Check

- `/g/m68`: HTTP 200 / `text/markdown; charset=utf-8`.
- `/g/l68`: HTTP 200 / `text/markdown; charset=utf-8`.
- `/g/d68`: HTTP 200 / `text/markdown; charset=utf-8`.
- `https://shop.aiboux.com/s/aiboux/`: HTTP 200.
- `https://shop.aiboux.com/s/aiboux/admin`: HTTP 200.

## SHA256

- `public/g/l68.md` matched the public `/g/l68` body.
- `public/g/d68.md` matched the public `/g/d68` body.
- `public/g/m68.md` did not match the public `/g/m68` body. This cycle did not intentionally change m68, so m68 reconciliation remains a separate item.

## Remaining Work

- Run focused public Playwright gates against the deployed Worker.
- Reconcile m68 source/public body before claiming full URL bundle source equality.
- Continue direct Shop sales-quality improvements.
