# TOP Sales Link Refocus Public Verification

Status: WIP_DEPLOYED_NOT_FINAL

## Public URL Bundle

- Master: https://mail.aiboux.com/g/m68
- Log: https://mail.aiboux.com/g/l68
- Screen: https://mail.aiboux.com/g/d68

## Deploy

- Worker Version ID: `0dbb45dc-ffb2-41fd-9b00-996920d0846f`
- WIP checkpoint commit: `0a1c8e1`
- Source change commit: `ece5930`

## Public Checks

- `https://shop.aiboux.com/s/aiboux/`: HTTP 200
- `https://mail.aiboux.com/g/l68`: HTTP 200 / `text/markdown; charset=utf-8`
- `https://mail.aiboux.com/g/d68`: HTTP 200 / `text/markdown; charset=utf-8`
- `https://mail.aiboux.com/g/m68`: HTTP 200 / `text/markdown; charset=utf-8`

## Public Source Equality

- `/g/l68`: public body matched local `public/g/l68.md` before the post-deploy log update.
- `/g/d68`: public body matched local `public/g/d68.md` before the post-deploy log update.
- `/g/m68`: public body did not match local `public/g/m68.md`; this remains a separate reconciliation item.

## Storefront Link Evidence

Public storefront HTML includes:

- `/s/aiboux/products?category=coffee-tea`
- `/s/aiboux/products?category=kitchen`
- `/s/aiboux/products?category=ranking`
- `/s/aiboux/products?category=sale`

## Public Playwright

Command:

```bash
PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-storefront-interaction
```

Result:

- PASS, 2 tests.
- Hero next, prev, dots, and autoplay behavior passed on public URL.
- Product card, add-to-cart, ranking link, sale link, and category link behavior passed on public URL.

## Blocked

- Subscription DB lane remains `D1_PERMISSION_BLOCKED_NOT_FINAL`.

## Next

- Re-deploy log updates so `/g/l68` and `/g/d68` expose the latest Worker Version ID and public Playwright result.
- Continue direct sales-quality work on TOP/product detail/cart/checkout without adding visible SEO explanation panels.
