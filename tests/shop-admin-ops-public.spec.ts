import { expect, test, type Page } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const outputDir = "output/playwright/shop-admin-ops";
const publicDir = "public/g/screens";

async function saveScreenshot(page: Page, filename: string) {
  const outputPath = path.join(outputDir, filename);
  const publicPath = path.join(publicDir, filename);
  await page.screenshot({ path: outputPath, fullPage: true });
  copyFileSync(outputPath, publicPath);
}

test.describe("AIBOUX Shop admin operations public quality", () => {
  test.beforeAll(() => {
    mkdirSync(outputDir, { recursive: true });
    mkdirSync(publicDir, { recursive: true });
  });

  test("admin product, order, settings, design, and subscription pages are operational shells", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    const pages = [
      { path: "/s/aiboux/admin/products", text: /商品|Product/i, file: "shop-admin-products.png" },
      { path: "/s/aiboux/admin/orders", text: /注文|Order/i, file: "shop-admin-orders.png" },
      { path: "/s/aiboux/admin/inventory", text: "在庫", file: "shop-admin-inventory.png" },
      { path: "/s/aiboux/admin/settings", text: /設定|Settings/i, file: "shop-admin-settings.png" },
      { path: "/s/aiboux/admin/design", text: "AIBOUX SHOP ストアデザインエディタ", file: "shop-admin-design.png" },
      { path: "/s/aiboux/admin/subscriptions", text: "定期購入", file: "shop-admin-subscriptions.png" },
    ];

    for (const target of pages) {
      await page.goto(`${target.path}?adminOps=${Date.now()}`, { waitUntil: "networkidle" });
      await expect(page.locator("body")).toContainText(target.text);
      await expect(page.locator("body")).not.toContainText("2024/05");
      await expect(page.locator("body")).not.toContainText("山田 太郎");
      await expect(page.locator("body")).not.toContainText("#10085");
      await expect(page.locator("body")).not.toContainText("SUBSCRIPTION_SCHEMA_PENDING");
      await expect(page.locator("body")).not.toContainText("D1 migration");
      await expect(page.locator("body")).not.toContainText("DB migration");
      await expect(page.locator("body")).not.toContainText("Provider subscription");
      await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
      await saveScreenshot(page, target.file);
    }
  });

  test("admin subscriptions page exposes operational guidance without backend wording", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/admin/subscriptions", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: "定期購入" })).toBeVisible();
    await expect(page.locator('[data-testid="admin-subscription-operation-cards"]')).toBeVisible();
    const hasEmptyState = await page.locator('[data-testid="admin-subscription-empty-state"]').isVisible().catch(() => false);
    const hasTable = await page.getByRole("table").isVisible().catch(() => false);
    expect(hasEmptyState || hasTable, "subscriptions page should show either an empty state or a real table").toBe(true);
    if (hasEmptyState) {
      await expect(page.getByRole("link", { name: "商品設定を開く" })).toHaveAttribute("href", "/s/aiboux/admin/products");
      await expect(page.getByRole("link", { name: "支払い設定を確認" })).toHaveAttribute("href", "/s/aiboux/admin/settings");
    }

    await expect(page.locator("body")).not.toContainText("SUBSCRIPTION_SCHEMA_PENDING");
    await expect(page.locator("body")).not.toContainText("D1 migration");
    await expect(page.locator("body")).not.toContainText("DB migration");
    await expect(page.locator("body")).not.toContainText("schema");
    await expect(page.locator("body")).not.toContainText("Provider subscription");

    await saveScreenshot(page, "shop-admin-subscriptions-operational.png");
  });

  test("admin product editor exposes a real back link", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/admin/products/new", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: "商品を追加" })).toBeVisible();
    await expect(page.getByRole("link", { name: "商品一覧へ戻る" })).toHaveAttribute("href", "/s/aiboux/admin/products");
    await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  });

  test("admin content page links to editable store wording settings", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/admin/content", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: "コンテンツ" })).toBeVisible();
    await expect(page.getByRole("link", { name: "ストア文言を編集" })).toHaveAttribute("href", "/s/aiboux/admin/settings");
    await expect(page.locator("body")).not.toContainText("コンテンツ保存API接続後");
    await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  });

  test("admin inventory CSV actions are usable controls", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/admin/inventory", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: "在庫" })).toBeVisible();
    await expect(page.getByRole("button", { name: "CSV取り込み" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "CSV書き出し" })).toBeEnabled();
    await expect(page.locator("body")).not.toContainText("CSV取り込みAPI接続後");
    await expect(page.locator("body")).not.toContainText("CSV書き出しAPI接続後");
  });

  test("admin settings wording stays operational and avoids raw integration setup terms", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/admin/settings", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: "設定" })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("APIキー未設定");
    await expect(page.locator("body")).not.toContainText("Resend APIキー");
    await expect(page.locator("body")).not.toContainText("未設定でも開始できます");
    await expect(page.locator("body")).not.toContainText("mock_send_without");
    await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  });

  test("admin product row menu exposes real edit and duplicate actions", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/admin/products", { waitUntil: "networkidle" });

    await page.getByRole("button", { name: "商品操作" }).first().click();
    await expect(page.getByRole("menuitem", { name: "編集", exact: true })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "複製して編集" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "販売状態を編集" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "複製", exact: true })).toHaveCount(0);
    await expect(page.getByRole("menuitem", { name: "販売状態は編集画面で変更" })).toHaveCount(0);
  });

  test("admin customer row menu opens detail, segment, and memo actions", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/admin/customers", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "顧客" })).toBeVisible();

    const actionButton = page.locator('button[aria-label$="の操作"]').first();
    if ((await actionButton.count()) === 0) {
      await expect(page.getByText("顧客データはまだありません。")).toBeVisible();
      await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
      return;
    }
    await expect(actionButton).toBeVisible();
    await actionButton.click();
    await page.getByRole("menuitem", { name: "詳細を開く" }).click();
    await expect(page.locator('[data-testid="admin-customer-detail-panel"]')).toBeVisible();

    await actionButton.click();
    await page.getByRole("menuitem", { name: "セグメントへ追加" }).click();
    await expect(page.getByText("確認対象").first()).toBeVisible();

    await actionButton.click();
    await page.getByRole("menuitem", { name: "メモを編集" }).click();
    await expect(page.getByLabel(/のメモ/).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "保存" }).first()).toBeEnabled();
  });

  test("admin account menu does not expose a disabled logout item", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/admin", { waitUntil: "networkidle" });

    await page.getByRole("button", { name: /ストア管理者|管理画面/ }).click();
    await expect(page.getByRole("menuitem", { name: "管理者設定" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "ログアウト" })).toHaveCount(0);
  });

  test("design editor remains a focused two-page editor", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/admin/design", { waitUntil: "networkidle" });
    expect(new URL(page.url()).pathname).toBe("/s/aiboux/admin/design");
    await expect(page.locator("[data-shop-design-editor-shell]")).toBeVisible();
    await expect(page.getByText("TOPページ").first()).toBeVisible();
    await expect(page.getByText("商品詳細ページ").first()).toBeVisible();
    await expect(page.getByText("商品一覧ページ")).toHaveCount(0);
    await expect(page.getByText("カートページ")).toHaveCount(0);
    await expect(page.getByText("チェックアウトページ")).toHaveCount(0);
    await expect(page.getByText("編集できるのは「TOPページ」と「商品詳細ページ」のみです。")).toBeVisible();
  });

  test("design editor undo redo and preview device controls are usable", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/admin/design", { waitUntil: "networkidle" });

    const titleInput = page.getByLabel("タイトル").first();
    await expect(titleInput).toBeVisible();
    const before = await titleInput.inputValue();

    await expect(page.getByRole("button", { name: "undo" })).toBeDisabled();
    await titleInput.fill(`${before} 更新`);
    await expect(page.getByRole("button", { name: "undo" })).toBeEnabled();
    await page.getByRole("button", { name: "undo" }).click();
    await expect(titleInput).toHaveValue(before);
    await expect(page.getByRole("button", { name: "redo" })).toBeEnabled();
    await page.getByRole("button", { name: "redo" }).click();
    await expect(titleInput).toHaveValue(`${before} 更新`);

    await page.getByRole("button", { name: "mobile preview" }).click();
    await expect(page.locator('[data-testid="store-preview-frame"]')).toHaveAttribute("data-preview-device", "mobile");
    await page.getByRole("button", { name: "desktop preview" }).click();
    await expect(page.locator('[data-testid="store-preview-frame"]')).toHaveAttribute("data-preview-device", "desktop");
  });

  test("core product integration controls are not dead buttons", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/shop/products/integration", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: "Core商品連携" })).toBeVisible();
    await page.getByRole("button", { name: "正本同期" }).click();
    await expect(page.locator("body")).toContainText("同期済み");

    await page.getByRole("button", { name: "承認へ送る" }).click();
    await expect(page.locator("body")).toContainText("承認待ち");

    await page.getByRole("button", { name: "下書きを保存" }).click();
    await expect(page.locator("body")).toContainText("下書き保存:");

    await page.getByRole("tab", { name: "SKUバリエーション" }).click();
    await page.getByRole("button", { name: "SKU追加" }).click();
    await expect(page.getByRole("dialog", { name: "SKUバリエーションを追加" })).toBeVisible();
    await page.getByRole("button", { name: "保存" }).click();
    await expect(page.getByRole("dialog", { name: "SKUバリエーションを追加" })).toHaveCount(0);

    await expect(page.locator("body")).not.toContainText("API接続後");
  });
});
