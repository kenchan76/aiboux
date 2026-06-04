# Shop Admin Route Cache Mismatch Summary

Status: WIP_ROUTE_CACHE_MISMATCH_FIXED_FOR_VERIFIED_PATHS

Public URL bundle:

- Execution log URL: https://mail.aiboux.com/g/l68
- Screen evidence URL: https://mail.aiboux.com/g/d68
- Master URL: https://mail.aiboux.com/g/m68

Problem:

- Codex curl and Playwright saw fixed demo values absent.
- The user's external fetch path still saw stale fixed demo values.
- A web fetch path reproduced the stale old content before the cache-header deploy.

Fix:

- Strengthened service-routed HTML cache headers in `src/worker.ts`.
- Added admin-specific `clear-site-data: "cache"` and `x-aiboux-admin-cache-policy: no-store-clear-cache`.
- Added middleware no-store protection for Shop admin pass-through paths.
- Attempted targeted Cloudflare purge. It failed with API authentication error; no secret was printed.

Verified Worker Version ID:

- 9f28a3bb-99e5-4655-9caf-999263b016f4

Public admin target:

- https://shop.aiboux.com/s/aiboux/admin?verify=20260604T012024Z

Verified headers:

- cache-control: no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0
- cdn-cache-control: no-store
- cloudflare-cdn-cache-control: no-store
- pragma: no-cache
- expires: 0
- clear-site-data: "cache"
- x-aiboux-admin-cache-policy: no-store-clear-cache
- x-aiboux-worker-version: 9f28a3bb-99e5-4655-9caf-999263b016f4
- x-aiboux-original-path: /s/aiboux/admin
- x-aiboux-rewritten-path: /shop/dashboard

Fixed demo value checks:

- 2024/05: absent
- 山田: absent
- ¥2,340,000: absent
- 245件: absent
- 2.35%: absent
- ¥9,551: absent
- 28.7%: absent
- TSH-001: absent
- BAG-001: absent
- BTL-500: absent
- #10085: absent
- #10084: absent
- #10083: absent
- 佐藤: absent
- 鈴木: absent
- 田中: absent

External web fetch:

- The external web fetch path returned updated admin content after the cache-header deploy.
- It showed ¥0, 0件, 未集計, and ストア管理者.

Safety:

- No DB write.
- No migration apply.
- No Bark.
- No reset.
- No clean.
- No force push.
- No secret output.

This is WIP evidence and not FINAL_ACCEPTED for the whole Shop tenant.
