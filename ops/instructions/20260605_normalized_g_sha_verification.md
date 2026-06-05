# CYCLE 0B: NORMALIZED_G_SHA_VERIFICATION

Status: `WIP_NOT_FINAL`

## Objective

`/g/m68`、`/g/l68`、`/g/d68` で runtime Worker Version ID 置換がある場合に、sha不一致を雑に許可しない。

## Required Records

For each of `/g/m68`, `/g/l68`, and `/g/d68`, record:

1. local raw sha256
2. public raw sha256
3. local normalized sha256 after normalizing Worker Version ID to `__WORKER_VERSION_ID__`
4. public normalized sha256 after normalizing Worker Version ID to `__WORKER_VERSION_ID__`
5. whether normalized sha256 matches

If normalized sha256 does not match, report FAIL.

## Scope

- Do not touch storefront UI.
- Do not add visible SEO components.
- Do not claim `FINAL_ACCEPTED`.

## Public Evidence

Use:

- `https://mail.aiboux.com/g/sha68`
- `https://mail.aiboux.com/g/l68`
- `https://mail.aiboux.com/g/d68`
- `https://mail.aiboux.com/g/m68`
