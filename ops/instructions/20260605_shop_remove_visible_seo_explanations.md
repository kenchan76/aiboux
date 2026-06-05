# AIBOUX Shop 可視SEO説明削除 WIP指示

## Status

`SHOP_REMOVE_VISIBLE_SEO_EXPLANATIONS_WIP`

## 対象

- `https://shop.aiboux.com/s/aiboux/`
- `https://shop.aiboux.com/s/aiboux/products`
- `https://shop.aiboux.com/s/aiboux/categories`
- `https://shop.aiboux.com/s/aiboux/cart`
- `https://shop.aiboux.com/s/aiboux/checkout`
- `https://shop.aiboux.com/s/aiboux/contact`
- `https://shop.aiboux.com/s/aiboux/legal`
- `https://shop.aiboux.com/s/aiboux/privacy`
- `https://shop.aiboux.com/s/aiboux/shipping`
- `https://shop.aiboux.com/s/aiboux/returns`
- `https://shop.aiboux.com/s/aiboux/faq`
- `https://shop.aiboux.com/s/aiboux/product/{id}`

## 目的

全公開ページから、買い物客に不要なSEO作業説明を削除する。

## 削除する可視表現

- `SEO / UI checklist`
- `SEO site map`
- `Crawl map`
- `SEO構造`
- `共通SEO部品`
- `SEO内部リンク`
- `canonical`
- `robots`
- `sitemap`
- `Product/Offer`
- `可視H1`
- `検索エンジン向け` の説明
- `noindex` などの運用者向け説明

## 残すもの

- `<head>` の canonical
- `<meta name="robots">`
- JSON-LD
- BreadcrumbList
- SearchAction
- Product / Offer structured data
- MerchantReturnPolicy
- OfferShippingDetails
- crawlable な通常リンク
- パンくず
- 検索フォーム
- フッター主要リンク

## UI方針

SEOの説明を画面に出さない。
買い物客に見える文言は、商品探し、購入前確認、配送、返品、問い合わせ、注文、定期購入、アカウント導線として自然に書く。

## ゲート方針

公開ページの本文に可視SEO説明が出ていないことをPlaywrightで確認する。
内部SEOは、meta、canonical、robots、JSON-LD、robots.txt、sitemap.xml の検査で維持する。

## 完了禁止条件

- 可視本文にSEO作業説明が残る
- `/g/l68` が公開更新されていない
- `/g/d68` が公開更新されていない
- build未実行
- public Playwright未実行
- `FINAL_ACCEPTED` と書くこと

