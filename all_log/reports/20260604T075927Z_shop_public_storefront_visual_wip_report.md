# AIBOUX Shop Public Storefront Visual Repair WIP

## Status
PUBLIC_STOREFRONT_DESIGN_MISMATCH_FIXED_WIP

## Summary
- 公開テナントフロント /s/aiboux/ のグレー画像プレースホルダーを撤去し、ヒーロー、商品カード、ランキング、タイムセール、カテゴリを実画像ベースへ変更しました。
- エディタプレビューと公開TOPの画像方針を合わせ、公開TOP 1365px/1980px、商品詳細、デザインエディタのスクリーンショットを /g/d68 に載せました。
- これはWIPであり、Shop全体の FINAL_ACCEPTED ではありません。

## Verification
- npm run check:control-chars: PASS
- npm run check:mojibake: PASS
- npm run astro check: PASS
- ESBUILD_WORKER_THREADS=0 npm run build: PASS
- npm run check:shop-ui-protection: PASS in warn mode
- PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/shop-design-editor-public.spec.ts: 5 passed
- https://shop.aiboux.com/s/aiboux/: HTTP 200 / real image URLs detected / weak image src grep returned zero
- https://shop.aiboux.com/s/aiboux/admin/design: HTTP 200
- https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4580000232621: HTTP 200
- m68/l68/d68: HTTP 200 / text/markdown
- screen PNGs under /g/screens/: HTTP 200 / image/png

## Bark
- notification: progress notification attempted after public URL Bundle verification
- reason: Progress Bark is sent after the URL Bundle is public; it is not FINAL_ACCEPTED.

## Notes
- Latest evidence deploy Worker Version ID: e0546c11-1f40-4c66-8b44-c7e48aa3b8a5.
- The visual repair verification log records the code WIP deployment ID fc1a0ea0-f7a4-48db-9309-4a5f11b4dbe5; a later deploy published /g evidence assets.
- Remote D1 subscription migration remains blocked by Cloudflare D1 permission and is not part of this visual WIP acceptance.
- FINAL_ACCEPTED is still prohibited.

## URLs
- マスター: https://mail.aiboux.com/g/m68
- ログ: https://mail.aiboux.com/g/l68
- 画面: https://mail.aiboux.com/g/d68
