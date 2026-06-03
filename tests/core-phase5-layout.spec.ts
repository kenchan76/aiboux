import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1980, height: 1080 } });

test("Core帳票一覧は1980幅でKPI、検索、高密度表、右詳細を同時に表示できる", async ({ page }) => {
  await page.goto("/core/estimates");

  await expect(page.getByRole("heading", { name: "見積書" })).toBeVisible();
  await expect(page.getByText("総件数").first()).toBeVisible();
  await expect(page.getByPlaceholder("書類番号・取引先・担当者で検索")).toBeVisible();
  await expect(page.getByText("行クリックで右側に詳細を表示")).toBeVisible();
  await expect(page.getByRole("button", { name: "印刷/PDF" })).toBeVisible();

  await page.screenshot({ path: "test-results/core-phase5-estimates-1980.png", fullPage: true });
});

test("納品書作成はA4プレビューなしの納品書専用ワークスペースを表示する", async ({ page }) => {
  await page.goto("/core/deliveries");
  await page.getByRole("button", { name: "納品書を作成" }).click();

  await expect(page.getByRole("heading", { name: "納品書を作成" })).toBeVisible();
  await expect(page.getByText("A4プレビュー", { exact: true })).toHaveCount(0);
  await expect(page.getByText("ライブプレビュー")).toHaveCount(0);
  await expect(page.getByTestId("delivery-entry-workspace")).toBeVisible();
  await expect(page.getByText("納品先", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("配送業者", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("お問い合わせ番号", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "メール送信" })).toBeVisible();
  await expect(page.getByRole("button", { name: "FAX送信" })).toBeVisible();
  await expect(page.getByRole("button", { name: "コピー" })).toBeVisible();
  await expect(page.getByTestId("line-product-0")).toBeVisible();
  await expect(page.getByText("帳票種別").locator("..").getByText("納品書")).toBeVisible();
  const edgeDistance = await page.evaluate(() => {
    const sidebar = document.querySelector("aside");
    const workspace = document.querySelector('[data-slot="sheet-content"]');
    if (!sidebar || !workspace) return Number.POSITIVE_INFINITY;
    return Math.abs(workspace.getBoundingClientRect().left - sidebar.getBoundingClientRect().right);
  });
  expect(edgeDistance).toBeLessThanOrEqual(12);
  const rightEdgeDistance = await page.evaluate(() => {
    const workspace = document.querySelector('[data-slot="sheet-content"]');
    if (!workspace) return Number.POSITIVE_INFINITY;
    return Math.abs(window.innerWidth - workspace.getBoundingClientRect().right);
  });
  expect(rightEdgeDistance).toBeLessThanOrEqual(8);
  const verticalSpacing = await page.evaluate(() => {
    const content = document.querySelector('[data-testid="delivery-basic-content"]');
    const field = document.querySelector('[data-field-label="納品書番号"]');
    if (!content || !field) return null;
    const label = field.querySelector("span");
    const control = field.querySelector("button, input, [role='combobox']");
    if (!label || !control) return null;
    const contentRect = content.getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();
    const controlRect = control.getBoundingClientRect();
    return {
      contentToLabel: labelRect.top - contentRect.top,
      labelToControl: controlRect.top - labelRect.bottom,
    };
  });
  expect(verticalSpacing).not.toBeNull();
  expect(verticalSpacing!.contentToLabel).toBeGreaterThanOrEqual(8);
  expect(verticalSpacing!.contentToLabel).toBeLessThanOrEqual(14);
  expect(verticalSpacing!.labelToControl).toBeGreaterThanOrEqual(3);
  expect(verticalSpacing!.labelToControl).toBeLessThanOrEqual(8);

  await page.screenshot({ path: "test-results/core-phase5-document-form-1980.png", fullPage: true });
});

test("取引先マスタは一覧と詳細タブを同一画面で確認できる", async ({ page }) => {
  await page.goto("/core/partners");

  await expect(page.getByRole("heading", { name: "取引先マスタ" })).toBeVisible();
  await expect(page.getByPlaceholder("取引先名・コード・名義カナ・メールで検索")).toBeVisible();
  await expect(page.getByRole("tab", { name: "基本" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "納品先" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "価格" })).toBeVisible();

  await page.screenshot({ path: "test-results/core-phase5-partners-1980.png", fullPage: true });
});
