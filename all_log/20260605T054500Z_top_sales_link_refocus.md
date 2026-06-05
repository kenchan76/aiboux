# AIBOUX Shop TOP Sales Link Refocus

Status: WIP_NOT_FINAL

This is not FINAL_ACCEPTED.

## Purpose

Continue the AIBOUX Shop sales-quality sprint by fixing buyer-facing TOP navigation that directly affects shopping behavior.

## Changes

- Renamed the internal footer link source from SEO sitemap wording to shopping directory wording.
- TOP category cards now link to stable category URLs instead of sending every category to `/s/aiboux/products`.
- Bestseller ranking "もっと見る" now links to `/s/aiboux/products?category=ranking`.
- Time sale "もっと見る" now links to `/s/aiboux/products?category=sale`.
- Recommended product count badge now reflects the visible sales-ready product cards instead of the raw DB product count.
- Public interaction gate now asserts TOP category, ranking, and sale links.

## Verification

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS, 0 errors with existing hints.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.

## Public Gate Note

`gate:shop-storefront-interaction` targets the production public URL from package scripts. It was run before the latest code was deployed, so the new link expectations correctly failed against the old public deployment. Re-run after WIP deploy.

## Not Final

- Public WIP deploy is still required for this change.
- Public `/g/l68` and `/g/d68` must be verified after deploy.
- Subscription D1/provider-backed recurring billing remains separate and unfinished.
