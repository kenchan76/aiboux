# AIBOUX Shop Page Buying Guide SEO/UI Commonization

Status: WIP

## Objective

Strengthen every public AIBOUX Shop tenant storefront page with a shared, visible, crawlable purchase guide / FAQ-style decision aid.

This is not a final acceptance task. `FINAL_ACCEPTED` remains prohibited until remote D1 subscription migration and provider-backed recurring billing are verified.

## Fixed URLs

- Shop service site: `https://shop.aiboux.com/`
- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Tenant admin: `https://shop.aiboux.com/s/aiboux/admin`
- Public master: `https://mail.aiboux.com/g/m68`
- Public log: `https://mail.aiboux.com/g/l68`
- Public screen evidence: `https://mail.aiboux.com/g/d68`

## SEO References Checked

- Google Search Central SEO Starter Guide
- Google Search Central ecommerce URL structure
- Google Search Central ecommerce site structure
- Google Search Central crawlable links
- Google Search Central Product / Merchant listing structured data
- Google Search Central Breadcrumb structured data

## Requirements

- Add a shared storefront buying guide model in `src/lib/shopStorefrontShared.ts`.
- Add a reusable `StorefrontBuyingGuide` component.
- Render it on:
  - TOP page
  - product detail
  - products
  - categories
  - cart
  - checkout
  - contact
  - legal
  - privacy
  - shipping
  - returns
  - FAQ
  - mypage
  - account
  - orders
  - favorites
  - login
  - register
  - mypage/subscriptions
- Keep all guide links crawlable real `<a href>` links.
- Use visibly blue link affordance for SEO-relevant links.
- Do not add fake claims, fake payment success, fake subscription success, or unsupported implementation status.
- Keep product detail to a single visible product `h1`.
- Keep `/s/aiboux/` as tenant storefront and do not change `shop.aiboux.com/` into storefront.
- Strengthen public Playwright checks for the shared guide.

## Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run astro check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- Public Playwright gates for public crawl and product detail.
- WIP deploy.
- Publish `/g/m68`, `/g/l68`, `/g/d68`.
- Bark progress notification if configured.

