# AIBOUX Shop Category URL SEO/UI Hardening

Status: WIP

## Objective

Continue the AIBOUX Shop sales-quality sprint by making category discovery URLs real, meaningful, and SEO-consistent.

## Fixed URLs

- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Category discovery pattern: `https://shop.aiboux.com/s/aiboux/products?category={categorySlug}`
- Free-text search pattern: `https://shop.aiboux.com/s/aiboux/products?q={query}`

## SEO References Checked

- Google Search Central ecommerce URL structure guidance.
- Google Search Central crawlable links guidance.
- Google Search Central SEO starter guide.
- Google Search Central ecommerce structured data guidance.

## Required Behavior

- Category links emitted by SEO hub, category cards, and internal navigation must lead to meaningful category product discovery pages.
- `category` pages must filter the visible product grid.
- `category` pages must show a visible category context and crawlable links back to all products and categories.
- `category` pages must use a self-referencing canonical URL that includes the stable category parameter.
- `category` pages must remain indexable because they are stable curated discovery pages.
- Free-text `q` pages must remain `noindex,follow,noarchive`.
- Search `q` takes precedence over category when both are present, to avoid accidental indexable arbitrary query pages.
- `ItemList` JSON-LD must reflect the visible filtered product set.
- Sitemap must include curated stable category URLs when they are indexable.

## Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`
- Public `curl` for `/s/aiboux/products?category=coffee-tea`
- Public `/g/m68`, `/g/l68`, `/g/d68` update and verification

## Non-Final Conditions

- `FINAL_ACCEPTED` remains prohibited.
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
