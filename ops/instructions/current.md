# AIBOUX Shop Amazon Quality All Pages Cycle 5

Status: WIP

Active instruction file:

- `ops/instructions/20260605_shop_shared_seo_meta_model.md`
- `ops/instructions/20260605_shop_all_pages_seo_structure_ui.md`
- `ops/instructions/20260605_shop_schema_graph_seo_ui.md`

## 2026-06-05 Continuation: Schema Graph SEO/UI Hardening

Continue the active sales-quality sprint. The next concrete work unit is converting public storefront structured data to a single connected Schema.org `@graph` so every page exposes a coherent WebSite, OnlineStore, BreadcrumbList, SiteNavigationElement, page entity, ItemList, and Product/FAQ where applicable.

Google Search Central references checked for this continuation:

- SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Ecommerce URL structure: `https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites`
- Ecommerce site structure: `https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure`
- Crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`
- Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product-snippet`

Current additions required:

- Add `buildShopStructuredDataGraph` in `src/lib/shopSeo.ts`.
- Use the graph helper from TOP and subpage storefront routes.
- Remove repeated top-level `@context` inside graph nodes.
- Deduplicate graph nodes by `@id` where possible.
- Strengthen public Playwright checks for top-level `@graph`, entity IDs, and page graph connectivity.
- Keep `FINAL_ACCEPTED` prohibited until remote D1 subscription migration and provider-backed recurring billing are verified.

## 2026-06-05 Continuation: Shared SEO Meta Model

Continue the active sales-quality sprint. The next concrete work unit is centralizing SEO title and meta description generation so every public tenant storefront page has a non-thin title, useful description, canonical URL, social metadata, robots policy, and structured data from one shared model.

Google Search Central references already checked for this sprint:

- SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Ecommerce URL structure: `https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites`
- Ecommerce site structure: `https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure`
- Crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`
- Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product-snippet`

Current additions required:

- Add a shared storefront SEO meta builder in `shopSeo.ts`.
- Use the shared builder from TOP and subpage routes.
- Replace thin descriptions such as "公開中の商品を表示します" with purchase/search/support intent descriptions.
- Keep search query pages noindex and canonicalized to `/products`.
- Keep category URLs indexable and self-canonical.
- Add public Playwright checks for title/description length and canonical/social metadata consistency.
- Keep `FINAL_ACCEPTED` prohibited until remote D1 subscription migration and provider-backed recurring billing are verified.

## 2026-06-05 Continuation: All Pages SEO Structure And UI Commonization

Continue the active sales-quality sprint. The next concrete work unit is auditing every public tenant storefront page for shared SEO structure, visible link affordance, and reusable storefront parts.

Google Search Central references checked for this continuation:

- SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Ecommerce URL structure: `https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites`
- Ecommerce site structure: `https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure`
- Crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`
- Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product-snippet`

Current additions required:

- Add a shared contextual internal-link component for every public storefront page.
- Generate contextual links from `shopStorefrontShared.ts` rather than hardcoding per page.
- Include contextual links in shared navigation JSON-LD.
- Use contextual links as `ItemList` fallback for pages that do not have products/categories/accounts/policy cards.
- Add public Playwright checks for contextual link component, visible blue link affordance, `SiteNavigationElement` microdata, and `ItemList` on every public storefront page.
- Keep `FINAL_ACCEPTED` prohibited until remote D1 subscription migration and provider-backed recurring billing are verified.

- `ops/instructions/20260605_shop_category_url_seo_ui.md`
- `ops/instructions/20260605_shop_shared_product_card_seo_ui.md`

## 2026-06-05 Continuation: Shared Product Card SEO/UI Hardening

Continue the active sales-quality sprint. The next concrete work unit is replacing duplicated public storefront product-card markup with one shared SEO/UI component.

Google Search Central references checked for this continuation:

- SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`
- Product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product-snippet`
- Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Ecommerce structured data: `https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce`

Current additions required:

- Add a shared storefront product card component.
- Use crawlable product and category links with visible link colors.
- Add Product and Offer microdata to shared product cards.
- Standardize image ratio, title height, rating, review count, price, tax label, CTA placement, and cart data attributes.
- Replace duplicated product-card markup on public subpages where safe.
- Add public Playwright coverage for shared product cards.
- Keep `FINAL_ACCEPTED` prohibited until remote D1 subscription migration and provider-backed recurring billing are verified.

## 2026-06-05 Continuation: Category URL SEO/UI Hardening

Continue the active 5-hour sales-quality sprint. The next concrete work unit is making stable category discovery links real SEO surfaces instead of unhandled query parameters.

Google Search Central references checked for this continuation:

- SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Ecommerce URL structure: `https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites`
- Ecommerce site structure: `https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure`
- Crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`

Current additions required:

- Treat curated `category` URLs as stable category discovery pages.
- Filter `/s/aiboux/products?category={slug}` by category.
- Show visible category context and crawlable reset/support links.
- Keep category URLs indexable with self canonical URLs.
- Keep arbitrary `q` search URLs noindex.
- Reflect visible category products in `ItemList` JSON-LD.
- Add category URLs to sitemap.
- Add public Playwright coverage for category URLs.
- Keep `FINAL_ACCEPTED` prohibited until remote D1 subscription migration and provider-backed recurring billing are verified.

## 2026-06-05 Continuation: SEO/UI Common SEO Hub

Continue the active 5-hour sales-quality sprint. The next concrete work unit is a shared storefront SEO hub that strengthens crawlable internal links, visible link affordance, and page-to-page topical structure across every public tenant page.

Google Search Central references checked for this continuation:

- SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product`
- Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`
- Ecommerce structured data: `https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce`

Current additions required:

- Add a reusable storefront SEO hub component.
- Expose crawlable internal links to popular categories, product discovery, purchase support, account pages, and policy pages.
- Keep blue link affordance and hover underline for SEO-relevant links.
- Add visible Schema.org `SiteNavigationElement` microdata in the SEO hub.
- Add public Playwright coverage so every public storefront page must render the shared SEO hub.
- Keep `FINAL_ACCEPTED` prohibited until remote D1 subscription migration and provider-backed recurring billing are verified.

## 2026-06-05 Continuation: Breadcrumb And Product Detail SEO Cleanup

Continue the active 5-hour sales-quality sprint. The next concrete work unit is the common breadcrumb and product detail SEO cleanup.

Google Search Central references checked for this continuation:

- SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Ecommerce site structure: `https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure`
- Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product`

Current additions required:

- Keep one shared `StorefrontBreadcrumb` component for all public tenant storefront pages.
- Keep visible breadcrumb links blue and crawlable with real `<a href>`.
- Preserve `BreadcrumbList` structured data from the same breadcrumb model.
- On product detail, do not show the product title twice above the gallery. The full product name must appear as the single visible product `h1`.
- Use a short visible current breadcrumb label on product detail while preserving the full product name in structured breadcrumb data.
- Add public Playwright coverage for the visible breadcrumb, current crumb label, full product H1 uniqueness, and product structured data.
- Keep `FINAL_ACCEPTED` prohibited until remote D1 subscription migration and provider-backed recurring billing are verified.

## 2026-06-05 Continuation: SEO/UI Common Support Rail

Continue the active 5-hour sales-quality sprint. The next concrete work unit is a shared storefront support rail that strengthens SEO-critical internal links and purchase-support density across all public tenant pages.

Google Search Central references checked for this continuation:

- SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Ecommerce structured data: `https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce`
- Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product`
- Crawlable link best practices: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`

Current additions required:

- Add a reusable storefront support rail component.
- Expose crawlable internal links to products, categories, cart, checkout, contact, shipping, returns, FAQ, account, orders, favorites, login/register, and subscription pages.
- Keep blue link affordance and hover underline for SEO-relevant links.
- Add public Playwright coverage so every public storefront page must render the shared support rail.
- Keep `FINAL_ACCEPTED` prohibited until remote D1 subscription migration and provider-backed recurring billing are verified.

## Objective
AIBOUX Shop must be improved toward Amazon-quality sales experience across all public storefront and relevant admin pages, not only passing gates.

## Fixed URLs
- Shop service site: https://shop.aiboux.com/
- Tenant storefront: https://shop.aiboux.com/s/aiboux/
- Tenant admin: https://shop.aiboux.com/s/aiboux/admin
- Design editor: https://shop.aiboux.com/s/aiboux/admin/design

## Scope
Improve sales quality and interaction quality for:
- TOP
- products
- categories
- product detail
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
- admin operational shells

## Non-negotiable Rules
- Do not change shop.aiboux.com/ into a tenant storefront.
- Do not expose shop.aboux.com.
- Do not fake successful payment or subscription creation.
- D1 subscription migration permission blocker is subscription-lane only and must not stop storefront polish.
- FINAL_ACCEPTED is prohibited until subscription D1 migration and provider-backed subscription behavior are verified.
- Public logs must be published to /g/l68 and screen evidence to /g/d68 before user-facing report.

## Amazon Quality Targets
- Dense but clean sales layout.
- Image-backed product/category/legal/contact/cart/checkout pages.
- Product imagery must match product names and categories.
- Product cards must have consistent image ratio, title height, rating, review count, price, tax label, CTA, and hover/click affordance.
- Checkout and cart must look like real order flow while honestly blocking payment if not configured.
- Legal/contact pages must not look like thin placeholder cards.
- Mobile must remain usable and not sparse.
- No user-facing link destination may remain 404 or thin placeholder.
- Mypage, order history, favorites, account, login/register, and subscription self-service pages are included in the storefront quality scope.

## Current Evidence Baseline
- Worker Version ID: 50b53609-d572-4f93-9ce6-0558d4b5022b
- gate:shop-sales-quality: PASS
- gate:shop-subscriptions: BLOCKED with SUBSCRIPTION_SCHEMA_PENDING, expected non-final blocker.

## Next Work Unit
1. Publish the latest /g evidence for cycle 2.
2. Inspect public screenshots and source structure.
3. Polish products/categories/cart/checkout/contact/legal/shared templates toward Amazon-quality.
4. Rebuild, WIP deploy, rerun public gates.
5. Update /g evidence and continue.

## 2026-06-04 User Escalation: All Pages Must Reach Amazon-Like Sales Quality

User explicitly expanded the target to every public and admin-linked page. No user-facing page may remain missing, thin, footerless, link-broken, or obviously unfinished.

Additional active requirements:
- Every public storefront page must include a dense Amazon-like footer with shopping, account, support, and store/legal links.
- Header account and order links must route to implemented tenant pages, not contact/checkout shortcuts.
- TOP curated product cards must link to implemented product detail pages.
- Product detail fallback must exist for curated sales products used on TOP/products/favorites.
- Products page must be a sales grid with images, ratings, prices, tax labels, and cart CTA, not a thin DB table/card list.
- Categories page must be image-backed and dense, not a thin text list.
- Checkout, mypage, auth, and subscription pages may honestly block unconnected auth/payment/subscription actions, but must still look like finished storefront pages.
- `tests/shop-public-crawl.spec.ts` must require `storefront-footer` on all public pages.

## 2026-06-04 User Escalation: Still Not Amazon Quality

The latest public screenshots still fail visual quality because product names and images do not match on multiple storefront surfaces.

Immediate fixes:

- Do not trust old DB/sample product images for the public sales storefront when they produce mismatched product/name pairs.
- Normalize public product images from the display name and sales category.
- Pet products must classify as pet before generic "care" or beauty matching.
- Towels must show towels, bottles must show bottles, cleaning products must show cleaning products, pet products must show pet products, and coffee/tea must show coffee/tea.
- TOP, products, mypage recently viewed, favorites, ranking, time sale, related products, and product detail thumbnails must use the same sales-ready image mapping.
- Re-run public screenshots after deploy and inspect the visual result before reporting.
- FINAL_ACCEPTED remains prohibited while remote D1 subscription migration and provider-backed recurring billing are not verified.

## 2026-06-04 User Escalation: Footer, Links, My Page, All Pages

User explicitly rejected the current quality again. Amazon-quality now means every reachable tenant storefront page must feel like a complete retail surface, including footer and account flows.

Immediate fixes:

- Footer must be dense and present on all tenant storefront pages.
- Cart must not be a thin list. It needs item rows, delivery/return notes, order summary, checkout CTA, and recommendation continuation.
- Checkout must look like a real order review flow while honestly blocking unconnected payment/subscription actions.
- My page, account, orders, favorites, login/register, and subscription pages must look finished even when auth/payment/subscription backends are pending.
- Legal/privacy/shipping/returns/FAQ must not be a single thin card; they need support cards, update/status information, and store navigation.
- No user-facing page may remain missing, footerless, link-broken, or visibly placeholder-like.

## 2026-06-04 User Escalation: 10 Hour Amazon-Beating SEO And Smoothness Sprint

User explicitly expanded the work to a 10-hour quality sprint. Do not stop because one gate passes. Continue improving visual quality, interaction feel, internal links, breadcrumbs, structured data, and SEO evidence.

Immediate active requirements:

- Add a common visible breadcrumb trail to tenant storefront subpages.
- Add JSON-LD `BreadcrumbList` from the same breadcrumb model.
- Add `WebSite` JSON-LD with `SearchAction` for the tenant storefront.
- Add product detail `Product` JSON-LD with `Offer`, availability, image, SKU, brand, and aggregate rating.
- Remove duplicated product detail titles. Product detail must have one primary product H1; the generic page title above the product image must not render.
- Smooth the TOP hero carousel. Do not swap three nodes abruptly. Use a continuous transform-based track with 480-650ms natural easing, side previews, keyboard, swipe/drag, dots, arrows, autoplay, and no visual jump.
- Public tests must verify breadcrumb visibility, JSON-LD presence, carousel transition/transform, active dot, side preview updates, product card links, cart addition, and all public pages with footer.
- FINAL_ACCEPTED remains prohibited while remote D1 subscription migration and provider-backed recurring billing are not verified.

## 2026-06-04 User Escalation: SEO Strongest Structure And Clear Links

User explicitly required web-based SEO study before continuing, visibly understandable link colors, common breadcrumbs, and all pages to be SEO/UI strongest.

Additional active requirements:

- Use Google Search Central guidance as the current SEO baseline.
- Keep visible breadcrumbs on every tenant storefront subpage.
- Generate JSON-LD from the same breadcrumb model.
- Add shared `Organization` structured data with standard store return-policy information.
- Add page-specific `ItemList` JSON-LD for product/category/account/support listing pages where multiple internal targets are shown.
- Keep product detail focused on one product and one product H1.
- Use self-referencing canonical URLs.
- Use real `<a href>` internal links with meaningful text. Do not rely on JavaScript-only navigation for SEO-critical paths.
- Make text links visually identifiable using blue link color and hover underline on public storefront pages.
- Keep footer links and support navigation complete on every public tenant storefront page.
- Do not copy Amazon text, templates, or content. Use Amazon only as a structural benchmark for density, navigability, and purchase readiness.

## 2026-06-04 User Escalation: Social SEO, Robots, And Shared Head Meta

User explicitly required every page structure to be SEO strongest and asked to continue after checking current web guidance.

Google Search Central references checked:
- Ecommerce SEO: share ecommerce data and site structure so Google can find and parse product content.
- Link best practices: use crawlable `<a href>` links with descriptive anchor text.
- Breadcrumb structured data: visible breadcrumb trails help users understand hierarchy and can be paired with `BreadcrumbList`.
- Ecommerce URL structure: indexable pages should use self-referencing canonical URLs and internal links should use direct anchors.

Additional active requirements:
- Add shared helpers for robots, Open Graph, Twitter Card, canonical, and image URL normalization.
- Index public discovery/content pages: TOP, products, categories, product detail, contact, legal, privacy, shipping, returns, FAQ.
- Noindex transactional/private/account pages while keeping crawlable support links: cart, checkout, mypage, account, orders, favorites, login, register, mypage/subscriptions.
- Every public storefront page must expose canonical, robots, Open Graph, Twitter Card, and `ja-JP` alternate metadata.
- Product detail Open Graph must use product image and product title, without a duplicated product title above the gallery.
- Tests must verify meta tags on public URLs, not only JSON-LD.

## 2026-06-04 User Escalation: Robots Txt And Sitemap

SEO strongest structure must include crawler discovery files, not only per-page meta.

Additional active requirements:
- Add `https://shop.aiboux.com/robots.txt`.
- Add `https://shop.aiboux.com/sitemap.xml`.
- `robots.txt` must point to the sitemap and disallow transactional/private/admin paths.
- `sitemap.xml` must include only indexable discovery/content URLs:
  - Shop service site
  - tenant TOP
  - products
  - categories
  - product detail URLs
  - contact
  - legal
  - privacy
  - shipping
  - returns
  - FAQ
- `sitemap.xml` must not include cart, checkout, mypage, orders, favorites, login, register, admin, or subscription self-service pages.
- Public Playwright must verify robots and sitemap behavior.

## 2026-06-04 User Escalation: Sitemap Route Fix

- `/sitemap.xml` must be treated as a static/public SEO file by Worker and Astro middleware routing.
- `shop.aiboux.com/sitemap.xml` must not rewrite to `/shop/sitemap.xml`.
- Public sitemap response must be XML with `content-type: application/xml; charset=utf-8`.
- Public sitemap must include `/s/aiboux/`, `/s/aiboux/products`, `/s/aiboux/categories`, `/s/aiboux/product/setsuka-coffee`, and legal/support pages.
- Public sitemap must exclude cart, checkout, and admin paths.

## 2026-06-04 User Escalation: Shared SEO Head And Common Parts Audit

User required every page structure to be checked for strongest SEO and for reusable common parts.

Google Search Central references checked for this cycle:
- Ecommerce SEO: `https://developers.google.com/search/docs/specialty/ecommerce`
- Crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`
- Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product-snippet`
- Merchant listing structured data: `https://developers.google.com/search/docs/appearance/structured-data/merchant-listing`
- Sitemaps: `https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview`
- robots.txt: `https://developers.google.com/search/docs/crawling-indexing/robots/intro`

Implemented common-parts direction:
- Tenant storefront SEO head metadata is centralized in `src/components/shop/ShopSeoHead.astro`.
- TOP and subpage Astro templates must use the shared SEO head rather than duplicating meta tags.
- TOP `/s/aiboux/` must emit `ItemList` JSON-LD for public product discovery.
- Product detail pages must emit `product:price:amount` and `product:price:currency` Open Graph metadata.
- Every public storefront page must keep canonical, robots, Open Graph, Twitter Card, `ja-JP`, and `x-default` metadata.
- Public gates must verify these tags on `https://shop.aiboux.com` URLs.

Current WIP evidence:
- WIP commit: `1be17b0 WIP centralize shop SEO head and top ItemList`
- Worker Version ID: `e9aefc79-e737-4566-ba3e-50e4806a54a1`
- `gate:shop-public-crawl`: PASS on public URLs.
- `gate:shop-product-detail`: PASS on public URLs.
- `gate:shop-sales-quality`: PASS on public URLs.

Not final:
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- FINAL_ACCEPTED remains prohibited.

## 2026-06-05 Continuation: Entity Graph SEO/UI

Active instruction file:

- `ops/instructions/20260605_shop_entity_graph_seo_ui.md`

Additional active requirements:
- Public storefront structured data must connect the store entity, website entity, page entity, product entity, shipping details, and return policy.
- Organization markup should use the ecommerce-appropriate `OnlineStore` subtype.
- WebPage markup must include `isPartOf`, `publisher`, and `about` references.
- Product Offer must keep `OfferShippingDetails` and `MerchantReturnPolicy`, and link seller/brand to the store entity.
- Public gates must verify the entity graph on `https://shop.aiboux.com` URLs.

Not final:
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- FINAL_ACCEPTED remains prohibited.

## 2026-06-05 Continuation: Page-Type SEO/UI

Active instruction file:

- `ops/instructions/20260605_shop_page_type_seo_ui.md`

Additional active requirements:
- Products and categories discovery pages must use `CollectionPage` page JSON-LD.
- Contact must remain `ContactPage`, FAQ must remain `FAQPage`, and product detail must remain `ItemPage` plus `Product`.
- `ItemList` JSON-LD must include stable `@id`, `numberOfItems`, and `mainEntityOfPage`.
- Product listing `ItemList` entries should point at product entity IDs where possible.
- Public gates must verify page-type SEO markers on `https://shop.aiboux.com`.

Not final:
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- FINAL_ACCEPTED remains prohibited.

## 2026-06-04 User Escalation: Shared Breadcrumb SEO/UI Parts

User required all pages to be made SEO strongest and UI strongest, including common reusable parts.

Additional active requirements:
- Visible storefront breadcrumbs must be a shared component, not hand-written separately on TOP and subpages.
- The shared breadcrumb must expose Schema.org `BreadcrumbList` and `ListItem` microdata in the visible DOM.
- Breadcrumb links must be obviously clickable with blue link color, underline hover state, and keyboard focus affordance.
- JSON-LD breadcrumbs and visible breadcrumbs must use the same `ShopBreadcrumbItem` data source.
- Public gates must verify visible breadcrumb microdata and link affordance on `https://shop.aiboux.com` URLs.

Implementation direction:
- Add `src/components/shop/storefront/StorefrontBreadcrumb.tsx`.
- Use the shared breadcrumb on `/s/aiboux/` and all `/s/aiboux/...` subpages.
- Strengthen public crawl and product detail Playwright gates to verify BreadcrumbList microdata and link color.

Not final:
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- FINAL_ACCEPTED remains prohibited.

## 2026-06-04 User Escalation: Shared Page Entity And FAQ SEO Parts

User required all pages to be inspected for strongest SEO and reusable common parts.

Additional active requirements:
- Public storefront pages must expose a shared page entity JSON-LD, not only breadcrumb/product/list JSON-LD.
- Public storefront pages must expose `SiteNavigationElement` JSON-LD from the same shared footer/navigation link model.
- FAQ visible content and `FAQPage` JSON-LD must come from the same shared FAQ data model.
- Contact page must expose `ContactPage` JSON-LD.
- Tests must verify these public SEO structures on `https://shop.aiboux.com` URLs.

Implementation direction:
- Add shared FAQ data to `src/lib/shopStorefrontShared.ts`.
- Add `buildShopWebPageJsonLd`, `buildShopSiteNavigationJsonLd`, and `buildShopFaqPageJsonLd` to `src/lib/shopSeo.ts`.
- Use the new shared JSON-LD helpers on TOP and subpage/product routes.
- Strengthen `tests/shop-public-crawl.spec.ts` to verify `SiteNavigationElement`, page entity JSON-LD, FAQPage questions/answers, and ContactPage.

## 2026-06-04 User Escalation: Shared Footer SEO/UI Parts

User required all pages to be audited for strongest SEO/UI structure and reusable common parts.

Additional active requirements:
- Tenant storefront footer must be a shared component, not duplicated between TOP and Astro subpages.
- All public tenant pages must expose the same dense shopping/account/support/store-info link network.
- Footer visible DOM must expose `SiteNavigationElement` microdata for the shared navigation link groups.
- Footer must include purchase assurance cards, including honest payment/subscription status.
- Public crawl gates must verify the shared footer link density, `SiteNavigationElement` microdata, and payment-not-configured honesty text on `https://shop.aiboux.com` URLs.

Implementation direction:
- Add `src/components/shop/storefront/StorefrontFooter.tsx`.
- Use the shared footer on `/s/aiboux/` and all `/s/aiboux/...` subpages.
- Strengthen `tests/shop-public-crawl.spec.ts` for shared footer SEO/UI checks.

Not final:
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- FINAL_ACCEPTED remains prohibited.

## 2026-06-04 User Escalation: Shared Storefront Navigation And Support Parts

User required all pages to be audited for reusable parts and made SEO/UI strongest.

Additional common-parts implementation:
- Shared footer link groups, footer assurances, account cards, policy support cards, purchase guide cards, and curated category seeds are centralized in `src/lib/shopStorefrontShared.ts`.
- TOP React storefront and Astro subpage route both use shared footer link groups.
- Astro subpages use shared account/support/category data for ItemList JSON-LD and visible page cards.
- This keeps SEO-critical anchors, footer links, and support/account discovery paths consistent across tenant public pages.

Verification before WIP deploy:
- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 6 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS

Not final:
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- FINAL_ACCEPTED remains prohibited.

## 2026-06-05 Continuation: Shared Page Header SEO/UI

Active instruction file:

- `ops/instructions/20260605_shop_shared_page_header_seo_ui.md`

Additional active requirements:
- Public storefront non-product pages must use a shared `StorefrontPageHeader` component.
- The shared page header must provide one page `h1`, page description, store context, and two or more crawlable internal links.
- Page header links must be visibly clickable, using blue link affordance and hover/focus treatment.
- Product detail must keep only one visible product `h1`; do not reintroduce the duplicate title above the image.
- Public crawl gates must verify the shared page header on `https://shop.aiboux.com` URLs.

Not final:
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- FINAL_ACCEPTED remains prohibited.

## 2026-06-05 Continuation: Search SEO/UI

Active instruction file:

- `ops/instructions/20260605_shop_search_seo_ui.md`

Additional active requirements:
- Header search must be a real GET form targeting `/s/{tenant}/products` with `q`.
- Search must work without client-side JavaScript.
- Products page must show query context for `?q=` and retain SEO-safe canonical/robots metadata.
- `WebSite` SearchAction must match the actual public query URL.
- Public gates must verify the real search flow on `https://shop.aiboux.com`.

Not final:
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- FINAL_ACCEPTED remains prohibited.
