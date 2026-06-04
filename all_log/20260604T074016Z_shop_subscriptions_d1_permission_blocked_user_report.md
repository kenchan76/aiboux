# AIBOUX Shop Subscriptions WIP

## Status
D1_PERMISSION_BLOCKED_NOT_FINAL

## Summary
- 定期購入のWIP実装を公開しました。
- remote D1 migrationだけがCloudflare権限不足で未適用です。
- remote schema未適用時、subscription APIは汎用500ではなくSUBSCRIPTION_SCHEMA_PENDINGを返します。
- 商品詳細と管理画面の定期購入ページは公開URLでHTTP 200を返します。
- FINAL_ACCEPTEDではありません。

## Verification
- npm run check:control-chars: PASS
- npm run check:mojibake: PASS
- npm run astro check: PASS with existing hints only
- ESBUILD_WORKER_THREADS=0 npm run build: PASS
- WIP deploy: PASS
- Worker Version ID: 872ae388-9c39-4e55-a25b-9ae2ea6cb991
- GET /shop/api/subscription-plans: HTTP 503 JSON SUBSCRIPTION_SCHEMA_PENDING
- GET /shop/api/subscriptions: HTTP 503 JSON SUBSCRIPTION_SCHEMA_PENDING
- GET /s/aiboux/product/shopprod_tenant_001_4580000232621: HTTP 200
- GET /s/aiboux/admin/subscriptions: HTTP 200
- GET /g/m68, /g/l68, /g/d68: HTTP 200 text/markdown

## Bark
- notification: delivered=true skipped=false secretLogged=false purpose=progress finalGate=false
- reason: Progress Bark was sent after the public URL bundle was verified. This is not a FINAL_ACCEPTED notification.

## Notes
- Remote D1 migration apply remains blocked by Cloudflare D1 authorization error 7403.
- After D1 Edit permission is restored, run npx wrangler d1 migrations apply aiboux-b2b-db --remote.
- Then run WIP deploy and npm run gate:shop-subscriptions.
- Bark is a progress notification here, not FINAL_ACCEPTED.

## URLs
- マスター: https://mail.aiboux.com/g/m68
- ログ: https://mail.aiboux.com/g/l68
- 画面: https://mail.aiboux.com/g/d68
