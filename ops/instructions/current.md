# AIBOUX Shop Amazon Quality All Pages Cycle 4

Status: WIP

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
