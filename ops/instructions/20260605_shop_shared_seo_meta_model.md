# AIBOUX Shop Shared SEO Meta Model

Status: WIP

## Objective

Continue the AIBOUX Shop sales-quality sprint by strengthening every public tenant storefront page with a shared SEO metadata model and stricter public verification.

## Fixed URLs

- Shop service site: `https://shop.aiboux.com/`
- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Tenant admin: `https://shop.aiboux.com/s/aiboux/admin`
- Design editor: `https://shop.aiboux.com/s/aiboux/admin/design`

## Current Work Unit

- Centralize public storefront title and meta description generation.
- Keep page-specific search intent, purchase intent, account intent, and policy intent separate.
- Keep product detail using one visible product `h1` and product-specific SEO copy.
- Keep category URLs indexable and search query URLs noindex.
- Add public Playwright checks for:
  - non-thin page titles;
  - useful meta descriptions;
  - self canonical URL;
  - Open Graph URL/image;
  - Twitter Card;
  - robots policy;
  - structured data.

## Non-Final Conditions

- `FINAL_ACCEPTED` remains prohibited.
- Remote D1 subscription migration is still a separate non-final blocker until applied and verified.
- Provider-backed subscription creation remains unverified.

## Evidence Required

- `npm run check:control-chars`
- `npm run check:mojibake`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`
- WIP deploy
- `/g/m68`, `/g/l68`, `/g/d68` public URL verification
- Bark progress notification if Bark is configured
