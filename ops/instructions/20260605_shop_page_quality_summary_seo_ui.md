# AIBOUX Shop Page Quality Summary SEO/UI WIP

Status: `SHOP_5H_PAGE_QUALITY_SUMMARY_SEO_UI_WIP`

This instruction continues the active AIBOUX Shop 5-hour sales-quality sprint.

## Source Of Truth

- `AIBOUX_MASTER_DOCUMENT.md`
- `ops/instructions/current.md`
- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Shop service site: `https://shop.aiboux.com/`
- Admin: `https://shop.aiboux.com/s/aiboux/admin`

## User Request

The user requested that every page structure be made strongest for SEO, that reusable parts be extracted where possible, and that UI quality continue toward Amazon-grade sales quality.

## References Checked

Google Search Central references checked before this continuation:

- SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Ecommerce site structure: `https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure`
- Ecommerce URL structure: `https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites`
- Crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`
- Product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product`
- Merchant listing structured data: `https://developers.google.com/search/docs/appearance/structured-data/merchant-listing`
- Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`

## Required WIP Change

Add a shared page-quality summary component across public tenant storefront pages.

The component must:

- explain the page's purchase/search/support purpose;
- expose crawlable internal links;
- use visible blue link affordance;
- avoid false FAQ rich-result abuse;
- not add duplicate product H1 text above the gallery;
- be rendered on TOP, product detail, and every public storefront subpage;
- be covered by public Playwright checks;
- be reflected in `/g/m68`, `/g/l68`, and `/g/d68`;
- be WIP deployed after build and gates.

## Non-Final Conditions

`FINAL_ACCEPTED` remains prohibited until:

- remote D1 subscription migration is accepted;
- provider-backed recurring billing is verified;
- `gate:shop-subscriptions` passes on public URLs;
- final Bark receipt confirmation is complete if FINAL is claimed.

