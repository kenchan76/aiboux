# 2026-06-04 Daily Improvement

## Topic

AIBOUX public Playwright persistence tests should wait for UI readiness with web-first assertions and use strict, unambiguous locators.

## Official Documentation Checked

- Playwright official best practices: `https://playwright.dev/docs/next/best-practices`
- Playwright official locator documentation: `https://playwright.dev/docs/next/api/class-locator`

## Improvement

For AIBOUX public UI tests that save data:

1. Wait for visible loading indicators to disappear before filling controlled React inputs.
2. Verify the input value after `fill()` before clicking save.
3. Use exact role-based locators for primary buttons when preview text can include the same word.
4. Snapshot original production state before temporary public-save tests.
5. Restore the original state in `finally`.
6. Verify the temporary marker is not left on the public page after restore.

## Reason

The Shop design editor persistence test initially failed because it filled a controlled input before the async layout load had fully settled, and then used a non-exact save button locator that became ambiguous after the marker text appeared in the live preview.

The new pattern avoids that by using:

```ts
await expect(page.getByText("読み込み中")).toHaveCount(0);
await expect(heroTitle).not.toHaveValue("");
await heroTitle.fill(marker);
await expect(heroTitle).toHaveValue(marker);
await page.getByRole("button", { name: "保存", exact: true }).click();
```

This pattern is now required for similar AIBOUX editor persistence tests.
