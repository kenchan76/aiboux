# AIBOUX Shop Amazon Quality All Pages Cycle 3

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
- FINAL_ACCEPTED remains prohibited while remote D1 subscription migration and provider-backed recurring billing are not verified.
