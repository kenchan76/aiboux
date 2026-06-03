import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1980, height: 1080 } });

test("Core設定画面は高密度カードと監査/運用情報を表示する", async ({ page }) => {
  await page.goto("/core/settings");

  await expect(page.getByRole("heading", { name: "設定" })).toBeVisible();
  await expect(page.getByTestId("core-settings-workspace")).toBeVisible();
  await expect(page.getByText("利用状況")).toBeVisible();
  await expect(page.getByRole("tab", { name: "帳票" })).toBeVisible();
  await expect(page.getByText("メール・FAX準備")).toBeVisible();

  await page.screenshot({ path: "test-results/core-settings-1980.png", fullPage: true });
});

test("Coreデザイン管理はテーマ、ライブプレビュー、公開チェックを表示する", async ({ page }) => {
  await page.goto("/core/design");

  await expect(page.getByRole("heading", { name: "デザイン管理" })).toBeVisible();
  const workspace = page.getByTestId("core-design-workspace");
  await expect(workspace).toBeVisible();
  await expect(workspace.getByText("テーマ一覧")).toBeVisible();
  await expect(workspace.getByText("ライブプレビュー").last()).toBeVisible();
  await expect(workspace.getByText("公開チェックリスト")).toBeVisible();

  await page.screenshot({ path: "test-results/core-design-1980.png", fullPage: true });
});

test("AIBOUX SHOPトップはAmazonライクな高密度ストアフロントとして表示される", async ({ page }) => {
  await page.goto("/shop");

  await expect(page.getByRole("link", { name: /aiboux SHOP/ })).toBeVisible();
  await expect(page.getByPlaceholder("キーワード・商品名・ブランド名で検索")).toBeVisible();
  await expect(page.getByText("北海道特産品特集")).toBeVisible();
  await expect(page.getByRole("heading", { name: "本日のおすすめ" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "売れ筋ランキング" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "タイムセール" })).toBeVisible();
  await expect(page.getByText("出品者向け")).toBeVisible();

  await page.screenshot({ path: "test-results/shop-storefront-home-1980.png", fullPage: true });
});
