# AIBOUX Shop Public Storefront Visual Quality WIP

## Status
PUBLIC_STOREFRONT_VISUAL_QUALITY_FIX_WIP

## Summary
- 公開TOP /s/aiboux/ の商品画像と商品名の整合性を上げ、検証商品名と弱い画像URLを公開TOPから除去しました。
- 公開TOPのヒーローは main / prev / next の実画像DOMを持つ構造に修正しました。
- おすすめ商品10件、ランキング5件、タイムセール5件、カテゴリー8件の密度で公開TOPを再構成しました。
- WIP commit は d6403e1f1348032cd3d44200ccb8a17584e5aa1f、コードWIP deploy Worker Version ID は d26b3694-1816-4f3b-8b8b-5a5cbc9ac971、最新証跡deploy Worker Version ID は 27be7cf3-7d1c-4c72-b205-3c95c5494104 です。

## Verification
- npm run check:control-chars: PASS
- npm run check:mojibake: PASS
- npm run astro check: PASS, 0 errors
- ESBUILD_WORKER_THREADS=0 npm run build: PASS
- npm run gate:shop-storefront-visual: PASS, 3 passed against https://shop.aiboux.com
- 公開 /g/m68: HTTP 200, text/markdown, sha256 d791b569349eb2a2ca458737219a98cc04ad7d3f19d96bd78d4a6bb84196150a
- 公開 /g/l68: HTTP 200, text/markdown, sha256 83fdd2ada86833344044760873fcd12ed5738e145d870a91e0514810f8541a00
- 公開 /g/d68: HTTP 200, text/markdown, sha256 0f3192bf2ace8fdd62d259e166a8277ccfef580ed7bef69ae89dcb120fe18a72
- 公開TOP: hero_main_img=true, hero_prev_img=true, hero_next_img=true, product_card_count=10, ranking_card_count=5, time_sale_card_count=5, category_card_count=8, recommended_unique_img_count=10, public_test_product_matches=0, weak_img_src_matches=0

## Bark
- notification: progress delivered=true skipped=false secretLogged=false
- reason: Progress Bark was sent after the public URL Bundle and evidence publication. It is not FINAL_ACCEPTED.

## Notes
- FINAL_ACCEPTEDではありません。
- remote D1 subscription migration はCloudflare D1権限不足のため別件として未完了です。
- 定期購入の本番DB適用とShop販売フロー全体検証は未完了です。
- Shopの見た目はWIP改善段階で、ユーザー目視の追加差し戻しがあれば次WIPで潰します。

## URLs
- マスター: https://mail.aiboux.com/g/m68
- ログ: https://mail.aiboux.com/g/l68
- 画面: https://mail.aiboux.com/g/d68
