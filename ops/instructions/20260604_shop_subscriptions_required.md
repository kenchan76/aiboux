# AIBOUX Shop Subscriptions Required

## Status

ACTIVE_WIP

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Target URLs

- Storefront: `https://shop.aiboux.com/s/aiboux/`
- Product detail: `https://shop.aiboux.com/s/aiboux/product/{id}`
- Cart: `https://shop.aiboux.com/s/aiboux/cart`
- Checkout: `https://shop.aiboux.com/s/aiboux/checkout`
- Admin products: `https://shop.aiboux.com/s/aiboux/admin/products`
- Admin subscriptions: `https://shop.aiboux.com/s/aiboux/admin/subscriptions`

## New Required Specification

AIBOUX Shop must support subscriptions. Subscriptions are not optional for Shop final acceptance.

Shop `FINAL_ACCEPTED` is prohibited until subscription behavior is verified on public URLs.

## Purchase Modes

Each product may support:

- normal purchase only;
- subscription only;
- normal purchase and subscription.

## Subscription Plan Fields

Each subscription plan must support:

- plan name;
- interval unit;
- interval count;
- subscription price;
- discount rate;
- first order price;
- minimum cycles;
- skip allowed;
- pause allowed;
- cancel allowed;
- status;
- subscription notice;
- cancellation policy.

## Product Admin Requirements

Product editing must allow:

- enabling/disabling subscription;
- choosing normal purchase and subscription combination;
- adding/editing/removing subscription plans;
- saving plans to DB;
- reflecting plans on public product detail.

## Product Detail Requirements

The Amazon-like product detail purchase box must show:

- normal purchase;
- subscription purchase;
- subscription price;
- discount rate;
- delivery frequency;
- first delivery estimate;
- quantity;
- add to cart;
- subscribe now.

## Cart Requirements

Cart must distinguish:

- normal purchase item;
- subscription purchase item;
- subscription frequency;
- subscription price;
- first cycle total;
- next cycle total;
- quantity update;
- remove.

## Checkout Requirements

Checkout must show subscription terms and must not fake success.

If payment is not connected, checkout must show:

`定期決済設定が未完了です`

When payment is connected, a real provider subscription contract is required in a later final acceptance cycle. Do not claim provider subscription creation until verified.

## Admin Subscription Management

Add a subscriptions admin view at:

`/s/aiboux/admin/subscriptions`

It must show:

- subscription list;
- customer;
- product;
- plan;
- amount;
- next billing date;
- next delivery date;
- status;
- pause/resume/skip/cancel action availability.

## DB Requirements

Add non-destructive migrations and rollback SQL for:

- `shop_subscription_plans`
- `shop_subscriptions`
- `shop_subscription_events`

Do not delete existing data.

## API Requirements

Add or update:

- `GET /shop/api/subscription-plans?productId=...`
- `POST /shop/api/subscription-plans`
- `POST /shop/api/checkout/subscription`
- `GET /shop/api/subscriptions`
- `PATCH /shop/api/subscriptions/{id}/pause`
- `PATCH /shop/api/subscriptions/{id}/resume`
- `PATCH /shop/api/subscriptions/{id}/skip`
- `PATCH /shop/api/subscriptions/{id}/cancel`

## Gate Requirements

Add:

`npm run gate:shop-subscriptions`

This gate must verify public subscription behavior. It is WIP evidence during implementation and required for final acceptance.

## WIP Acceptance For This Work Unit

WIP deploy may proceed when:

- check/control chars pass;
- mojibake check passes;
- astro check passes;
- build passes;
- public URL Bundle is updated;
- subscription gate either passes or records exact WIP blockers.

## Final Acceptance Prohibition

Do not report `FINAL_ACCEPTED` until:

- `gate:shop-design` passes;
- `gate:shop-subscriptions` passes;
- public product detail subscription UI works;
- cart subscription state works;
- checkout blocks honestly when payment is unconfigured;
- admin subscription list works;
- `/g/l68` and `/g/d68` include public evidence.

