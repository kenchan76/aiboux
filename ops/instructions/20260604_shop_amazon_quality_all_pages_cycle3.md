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
