# AIBOUX Shop Breadcrumb And Product Detail SEO Cleanup

Status: WIP

## Objective

Continue the AIBOUX Shop 5-hour sales-quality sprint by strengthening the common breadcrumb implementation and removing the product-detail duplicate title impression above the product image.

## Fixed URLs

- Shop service site: `https://shop.aiboux.com/`
- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Tenant admin: `https://shop.aiboux.com/s/aiboux/admin`
- Product detail: `https://shop.aiboux.com/s/aiboux/product/{id}`

## Requirements

- Use one shared `StorefrontBreadcrumb` component.
- Use crawlable `<a href>` links for breadcrumb links.
- Keep visible breadcrumb links blue with hover underline.
- Keep `BreadcrumbList` structured data.
- Product detail must expose exactly one visible product name heading.
- Do not show the full product title above the product image as a duplicated breadcrumb label.
- Preserve the full product title in structured data for SEO.
- Update public tests to prove the visible breadcrumb does not duplicate the product title and the product detail has exactly one `h1`.
- Update `/g/m68`, `/g/l68`, `/g/d68` before reporting.

## References Checked

- Google SEO Starter Guide
- Google Ecommerce site structure
- Google Breadcrumb structured data
- Google Product structured data

## Non-final Blockers

- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- `FINAL_ACCEPTED` remains prohibited.
