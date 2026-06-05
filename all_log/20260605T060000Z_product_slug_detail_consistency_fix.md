# Product Slug Detail Consistency Fix

Status: WIP_NOT_FINAL

## Issue

Public screenshot review found a product detail mismatch:

- URL: `https://shop.aiboux.com/s/aiboux/product/setsuka-coffee`
- Expected: `雪花セレクト ドリップコーヒー 20袋`
- Observed before fix: `毎日使えるホームケア洗剤セット`

This is a buyer trust and SEO issue because the URL slug, canonical URL, visible H1, product image, breadcrumb, and structured product entity must describe the same product.

## Fix

- Curated storefront product slugs now take precedence over stale DB fallback rows for matching curated public product URLs.
- Real fetched DB products still remain available for non-curated slugs.
- Product detail public gate now includes a direct check that `/s/aiboux/product/setsuka-coffee` renders the matching coffee product.

## Files

- `src/pages/shop/[tenant]/[...path].astro`
- `tests/shop-product-detail-public.spec.ts`
- `ops/instructions/current.md`
- `public/g/l68.md`
- `public/g/d68.md`

## Local Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro -- check`: PASS with 0 errors and existing hints
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS

## Pending

- WIP deploy.
- Public `gate:shop-product-detail`.
- Public `/g/l68` and `/g/d68` publication.

## Not Final

This is not `FINAL_ACCEPTED`.
