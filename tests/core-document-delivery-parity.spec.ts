import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1980, height: 1080 } });

const targets = [
  {
    path: "/core/deliveries",
    title: "納品書",
    createTitle: "納品書作成",
    editTitle: "納品書編集",
    shotPrefix: "delivery",
  },
  {
    path: "/core/estimates",
    title: "見積書",
    createTitle: "見積書作成",
    editTitle: "見積書編集",
    shotPrefix: "estimate",
  },
  {
    path: "/core/orders",
    title: "注文書",
    createTitle: "注文書作成",
    editTitle: "注文書編集",
    shotPrefix: "order",
  },
];

for (const target of targets) {
  test(`${target.title}は納品書基準の一覧背景付き作成・詳細・編集ウィンドウで操作できる`, async ({ page }) => {
    await page.goto(target.path, { waitUntil: "networkidle" });
    const initialUrl = page.url();

    await expect(page.getByRole("heading", { name: target.title })).toBeVisible();
    await expect(page.getByRole("button", { name: `${target.title}を作成` })).toBeVisible();
    await expect(page.locator("[data-testid^='document-row-']").first()).toBeVisible();
    await page.screenshot({
      path: `output/playwright/core-document-delivery-parity/${target.shotPrefix}-list-1980.png`,
      fullPage: true,
    });

    await page.getByRole("button", { name: `${target.title}を作成` }).click();
    await expect(page.getByTestId("delivery-entry-workspace")).toBeVisible();
    await expect(page.getByRole("heading", { name: new RegExp(target.createTitle) })).toBeVisible();
    await expect(page.getByText("基本情報", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("明細一覧", { exact: true }).first()).toBeVisible();
    await expect(page.getByTestId("document-amount-footer")).toBeVisible();
    expect(page.url()).toBe(initialUrl);
    await page.screenshot({
      path: `output/playwright/core-document-delivery-parity/${target.shotPrefix}-create-window-1980.png`,
      fullPage: true,
    });

    await page.getByRole("button", { name: "キャンセル" }).click();
    await expect(page.getByTestId("delivery-entry-workspace")).toHaveCount(0);
    expect(page.url()).toBe(initialUrl);

    const firstRow = page.locator("[data-testid^='document-row-']").first();
    const documentNumber = (await firstRow.locator("button").first().innerText()).trim();
    await firstRow.click();
    await expect(page.getByTestId("delivery-detail-workspace")).toBeVisible();
    await expect(page.getByRole("heading", { name: `${target.title}詳細` })).toBeVisible();
    await expect(page.getByRole("heading", { name: target.title })).toBeVisible();
    await expect(page.getByTestId("delivery-detail-lines-card")).toBeVisible();
    await expect(page.getByTestId("delivery-detail-footer")).toBeVisible();
    expect(page.url()).toBe(initialUrl);
    await page.screenshot({
      path: `output/playwright/core-document-delivery-parity/${target.shotPrefix}-detail-window-1980.png`,
      fullPage: true,
    });

    await page.getByRole("button", { name: "編集" }).first().click();
    await expect(page.getByTestId("delivery-entry-workspace")).toBeVisible();
    await expect(page.getByRole("heading", { name: new RegExp(target.editTitle) })).toBeVisible();
    await expect
      .poll(async () => page.locator("input").evaluateAll((inputs, value) => inputs.some((input) => (input as HTMLInputElement).value === value), documentNumber))
      .toBe(true);
    expect(page.url()).toBe(initialUrl);
    await page.screenshot({
      path: `output/playwright/core-document-delivery-parity/${target.shotPrefix}-edit-window-1980.png`,
      fullPage: true,
    });
  });
}

test("請求書ソースとルートは今回の横展開対象外として変更しない", async ({ page }) => {
  await page.goto("/core/invoices", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "請求書" })).toBeVisible();
  await expect(page.getByRole("button", { name: "請求書を作成" })).toBeVisible();
});
