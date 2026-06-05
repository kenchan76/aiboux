# Product And Customer Row Menu Actions

Status: `LOCAL_WIP_NOT_FINAL`

## Purpose

Continue the AIBOUX Shop sales-quality sprint by removing dead row-menu operations from visible admin product and customer lists.

## Changed

- `src/components/shop/ProductsTable.tsx`
  - Replaced disabled duplicate and sales-status menu items with real actions.
  - Duplicate now opens the product creation route with a duplicate source query.
  - Sales-status editing now opens the existing product editor.

- `src/components/shop/CustomersTable.tsx`
  - Replaced disabled detail, segment, and memo menu items with real screen actions.
  - Detail opens an inline customer detail panel.
  - Segment toggles a visible confirmation badge.
  - Memo editing opens an enabled inline input and save button.

- `src/components/shop/ShopTopbar.tsx`
  - Replaced the disabled logout item with a real admin settings menu action.

- `tests/shop-admin-ops-public.spec.ts`
  - Added product row-menu assertions.
  - Added customer row-menu assertions.
  - Added admin account-menu assertions.

## Verification

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with 0 errors.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.

## Notes

- This is local WIP evidence only.
- Public deploy and `/g/*` publication remain blocked until Wrangler/Cloudflare authentication is restored.
- No `FINAL_ACCEPTED` is claimed.
