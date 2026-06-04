# AIBOUX Shop SEO/UI Common Support Rail Sprint

Status: WIP

## Objective

Continue the AIBOUX Shop sales-quality sprint by strengthening all public storefront pages with reusable SEO/UI parts, crawlable internal links, and Amazon-like purchase-support density.

## Fixed URLs

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`
- Shop service site: `https://shop.aiboux.com/`
- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Tenant admin: `https://shop.aiboux.com/s/aiboux/admin`

## Current Work Unit

Implement a shared storefront support rail that can be reused on TOP, product detail, cart, checkout, contact, legal, privacy, shipping, returns, FAQ, account, orders, favorites, login, register, and subscription pages.

## Requirements

- Keep `shop.aiboux.com/` as the Shop service site.
- Keep tenant storefront pages under `/s/aiboux/`.
- Do not expose `shop.aboux.com`.
- Use crawlable `<a href>` links with descriptive anchor text.
- Keep link color visually recognizable and hover-underlined.
- Do not copy Amazon text or templates.
- Use Google Search Central guidance for ecommerce structure, crawlable links, breadcrumbs, product data, and structured data.
- Add reusable UI instead of duplicating support cards on every page.
- Do not claim `FINAL_ACCEPTED` while remote D1 subscription migration and provider-backed recurring billing remain unverified.

## Evidence Required

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run astro check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- Public `gate:shop-public-crawl`
- Public `gate:shop-sales-quality`
- WIP deploy
- Public `/g/m68`, `/g/l68`, `/g/d68` HTTP 200 and text/markdown verification
- Bark progress notification if available, without logging secrets

## Not Final

This work unit improves shared SEO/UI structure only. It is not `FINAL_ACCEPTED`.
