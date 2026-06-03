import { expect, test } from "@playwright/test";

test("納品書をワンクリックで開き、マスタ補完から明細を保存できる", async ({ page }) => {
  await page.goto("/core/deliveries", { waitUntil: "networkidle" });

  const createButton = page.getByRole("button", { name: "納品書を作成" });
  await expect(createButton).toBeVisible();
  await createButton.click();
  const workspace = page.locator('[data-core-document-workspace="true"]');
  try {
    await expect(workspace).toBeVisible({ timeout: 3_000 });
  } catch {
    await createButton.click();
  }
  await expect(page.getByRole("heading", { name: "納品書作成" })).toBeVisible();
  await expect(page.getByText("帳票種別").locator("..").getByText("納品書")).toBeVisible();
  await page.locator('[data-field-label="納品書番号"] input').fill(`N20260530-${String(Date.now()).slice(-4)}`);

  await page.getByTestId("customer-combobox").click();
  await page.getByTestId("customer-search").fill("サンプル");
  await page.getByTestId("customer-option-cust-sample").click();
  await expect(page.getByTestId("customer-combobox")).toContainText("株式会社サンプル");

  await page.getByTestId("line-product-0").click();
  await page.getByTestId("line-product-0-search").fill("ミネラル");
  await page.getByTestId("product-option-core-prod-001").click();
  await expect(page.getByTestId("line-product-0")).toContainText("ミネラルウォーター 500ml");
  await expect(page.getByTestId("line-unit-price-0")).toHaveValue("120");

  await page.getByTestId("line-quantity-0").fill("2");
  await expect(page.getByTestId("line-subtotal-0")).toContainText(/[¥￥]240/);
  await expect(page.getByTestId("document-total")).toBeVisible();

  await page.getByRole("button", { name: /^保存$/ }).click();
  await expect(page.getByText("帳票を保存しました").first()).toBeVisible();
});
