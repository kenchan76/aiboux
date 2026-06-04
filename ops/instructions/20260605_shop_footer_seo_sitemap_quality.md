# AIBOUX Shop Footer SEO Sitemap Quality

Status: WIP

## Objective

Continue the AIBOUX Shop 5-hour sales-quality sprint by strengthening the shared storefront footer as an Amazon-quality, SEO-strong, all-page internal-link component.

The tenant storefront remains:

- `https://shop.aiboux.com/s/aiboux/`

The Shop service site remains:

- `https://shop.aiboux.com/`

## User Requirements Covered

- All pages must move toward Amazon-level UI quality.
- No unimplemented public pages.
- Links must be visibly recognizable.
- SEO must be faithful to current best practices.
- Shared parts should be commonized instead of duplicated.
- Breadcrumb, canonical, robots, structured data, internal links, and page experience must remain strong.

## Current Work Unit

Strengthen `StorefrontFooter` as a shared footer SEO sitemap component:

- Keep the Amazon-like "back to top" affordance.
- Add a visible footer SEO sitemap area with dense category, account, policy, support, cart, checkout, and subscription links.
- Keep links crawlable with real `<a href>`.
- Make links visibly recognizable with blue/sky link color and underline on hover/focus.
- Expose visible `ItemList` / `ListItem` microdata for the footer sitemap.
- Keep existing `SiteNavigationElement` footer columns.
- Add tests for the shared footer SEO sitemap across all public storefront pages.
- Include the footer links in existing `SiteNavigationElement` JSON-LD sources.

## Official SEO References Checked

- Google Search Central SEO Starter Guide.
- Google Search Central Breadcrumb structured data.
- Google Search Central Product structured data.
- Google Search Central Merchant Listing structured data.
- Google Search Central Page Experience.

## Non-Final Conditions

- `FINAL_ACCEPTED` remains prohibited.
- `gate:shop-subscriptions` remains BLOCKED_NOT_FINAL until subscription plan persistence, remote D1 migration, and provider-backed recurring billing are accepted.
- This work may deploy as WIP and must update public `/g/m68`, `/g/l68`, and `/g/d68`.
