# AIBOUX Shop Public Storefront Slider And Interaction WIP

## Status
PUBLIC_STOREFRONT_SLIDER_AND_INTERACTION_FIX_WIP

## Summary
- 公開TOPのヒーローを実際に動くcarouselへ修正しました。
- next、previous、dot click、autoplayでmain slide、side previews、active dotが更新されます。
- 商品カードクリック、カート追加、もっと見るリンクを公開URLで検証しました。
- WIP commitは53c1fee、証跡commitは0af05e7、公開確認commitはc93b4b9です。
- 証跡公開deployのWorker Version IDは07bc9232-ba82-4317-9d0a-9d97001fa1adです。

## Verification
- npm run check:control-chars: PASS
- npm run check:mojibake: PASS
- npm run astro check: PASS, 0 errors
- ESBUILD_WORKER_THREADS=0 npm run build: PASS
- npm run gate:shop-storefront-visual: PASS, 3 passed
- npm run gate:shop-storefront-interaction: PASS, 2 passed
- 公開 /g/m68 /g/l68 /g/d68: HTTP 200 / text/markdown; charset=utf-8
- 公開スクショ6件: HTTP 200 and sha256 matched local files
- 公開TOP DOM: hero-carousel, prev/next buttons, dots, cart count, add-to-cart all present
- 公開TOP dead link audit: href=# 0, javascript:void 0

## Bark
- notification: progress delivered=true skipped=false secretLogged=false
- reason: Bark progress notification after public URL bundle and WIP evidence publication.

## Notes
- FINAL_ACCEPTEDではありません。
- remote D1 subscription migration remains permission-blocked.
- full Shop sales flow and subscription checkout remain WIP.
- Bark progress notification was sent with delivered=true, skipped=false, secretLogged=false.

## URLs
- マスター: https://mail.aiboux.com/g/m68
- ログ: https://mail.aiboux.com/g/l68
- 画面: https://mail.aiboux.com/g/d68
