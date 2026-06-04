# Shop Fix Cycle 04: Public Functional Verification

Status: `WIP_FUNCTIONAL_HARDENING_DEPLOYED_NOT_FINAL`

WIP deploy:

- WIP commit: `cf22820d7aaf5c8fe08a005bae1b0caa55eaeb48`
- Worker Version ID: `99725905-9dd6-4263-a7a6-c098f0372ff7`

Public URL status:

- All 22 target Shop URLs returned HTTP 200.
- Evidence file: `all_log/shop-functional/20260604T015759Z_public_url_status_after_functional_route_fix.txt`

Public Playwright:

- Command: `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/shop-functional-public.spec.ts`
- Result: `4 passed`

Verified:

- admin fixed demo values remain absent
- storefront root/products/categories/cart/checkout/contact/legal/privacy/shipping/returns return usable HTML
- cart item render, quantity change, subtotal, remove, and empty state
- checkout honest payment-not-connected state
- contact required-field and email validation
- contact does not fake send success when storage/notification is not connected
- legal/privacy/shipping/returns render configured/generated policy text
- published product add-to-cart works when published products exist; honest empty state is accepted when none exist

Remaining:

- Product creation through production admin UI was not executed in this cycle to avoid unmanaged production product data.
- Payment provider remains not final; checkout intentionally blocks false completion.
- Strict Shop final gate has not been run.

This is not FINAL_ACCEPTED.
