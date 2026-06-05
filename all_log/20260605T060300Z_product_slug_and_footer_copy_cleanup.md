# Product Slug Detail And Footer Copy Cleanup

Status: `WIP_DEPLOYED_NOT_FINAL`

## Scope

- Product detail slug consistency for `setsuka-coffee`.
- Visible footer explanation copy cleanup.

## Changed

- `src/pages/shop/[tenant]/[...path].astro`
  - Curated storefront product slugs now take precedence over stale DB fallback rows for matching curated URLs.
- `src/components/shop/storefront/StorefrontFooter.tsx`
  - Removed visible explanatory heading/body copy from the dense footer link directory.
  - Kept crawlable buyer links and structured link data.
- `tests/shop-product-detail-public.spec.ts`
  - Added curated slug consistency coverage.
  - Requires footer directory not to expose explanatory copy.
- `tests/shop-public-crawl.spec.ts`
  - Requires footer directory not to expose explanatory copy.
- `public/g/l68.md`
  - Rewritten as current execution summary.
- `public/g/d68.md`
  - Rewritten as current screen evidence summary.
- `ops/instructions/current.md`
  - Updated with deployed product slug evidence and footer copy cleanup.

## Public Verification

- WIP deploy executed.
- Worker Version ID for the footer-copy publication deploy: `f3b5a184-8d9b-4269-b428-46238f267d11`.
- Public product URL: `https://shop.aiboux.com/s/aiboux/product/setsuka-coffee`
- Public product URL HTTP status: 200.
- Public product URL response header `x-aiboux-worker-version`: `f3b5a184-8d9b-4269-b428-46238f267d11`.
- Public `gate:shop-product-detail`: PASS, 4 tests.
- Public `gate:shop-public-crawl`: PASS, 11 tests.
- Public `/g/l68`: HTTP 200 / markdown / sha256 matched local source after the footer-copy publication deploy.
- Public `/g/d68`: HTTP 200 / markdown / sha256 matched local source after the footer-copy publication deploy.
- Public `/g/m68`: HTTP 200 / markdown / sha256 did not match local source; m68 reconciliation remains separate.

## Product Detail Assertions

- Visible H1: `雪花セレクト ドリップコーヒー 20袋`.
- Visible category: `コーヒー・お茶`.
- Rejected stale visible title: `毎日使えるホームケア洗剤セット`.
- Footer rejected visible phrase: `ストア内リンクをまとめて確認`.
- Footer rejected visible phrase: `必要なページへすぐ移動できます`.

## Not Final

- `FINAL_ACCEPTED` is prohibited.
- Subscription DB lane remains `D1_PERMISSION_BLOCKED_NOT_FINAL`.
- Public `/g/m68` source equality is not claimed in this cycle.
