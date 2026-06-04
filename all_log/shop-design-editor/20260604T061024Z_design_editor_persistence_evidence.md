# AIBOUX Shop Design Editor Persistence Evidence

Status: `WIP_DESIGN_EDITOR_PERSISTENCE_VERIFIED_NOT_FINAL`

## Public URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Target

Verify that the store design editor is not only visually correct, but also persists TOP page edits and reflects them on the public storefront.

## Implemented Test Coverage

Added a public Playwright test:

`store design editor saves top hero changes and restores original layout`

The test:

1. Reads the current layout from `GET /shop/api/storefront/layout`.
2. Opens public design editor URL `/s/aiboux/admin/design`.
3. Waits for the editor loading state to finish.
4. Edits the first hero slide title through the visible editor input.
5. Clicks the exact `保存` button.
6. Waits for `POST /shop/api/storefront/layout`.
7. Reads the layout again and confirms the temporary title was saved.
8. Opens `/s/aiboux/?layoutVerify=<marker>` and confirms the public storefront displays the temporary title.
9. Reloads and confirms the temporary title persists.
10. Restores the original layout in `finally`.
11. Reopens the public storefront and confirms the temporary marker is not left behind.

## Failure Found And Fixed

Initial persistence test failures:

- The test filled the title before the async layout load fully settled, so the loaded layout could overwrite the filled value.
- The save button locator was not exact, and became ambiguous when the live preview contained the marker text.

Fix:

- Wait for `読み込み中` to disappear.
- Verify the input already has a loaded value before filling.
- Verify the filled value before saving.
- Use `getByRole("button", { name: "保存", exact: true })`.

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/shop-functional-public.spec.ts -g "saves top hero" --reporter=line`: PASS, 1 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/shop-functional-public.spec.ts --reporter=line`: PASS, 6 passed
- Public layout title after restore: `雪花セレクトを、わかりやすく。`

## Safety

- No destructive cleanup was run.
- No reset was run.
- No force push was run.
- No secret was printed.
- The temporary public hero title was restored.
- This is not `FINAL_ACCEPTED`.
