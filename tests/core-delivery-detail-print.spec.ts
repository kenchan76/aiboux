import { existsSync, statSync, writeFileSync } from "node:fs";

import { expect, type Page, test } from "@playwright/test";

test.use({ viewport: { width: 1980, height: 1080 } });

async function openDeliveryDetail(page: Page) {
  const workspace = page.getByTestId("delivery-detail-workspace");
  if (await workspace.isVisible().catch(() => false)) return;
  await page.getByRole("button", { name: "N20260530-01", exact: true }).click();
  await expect(workspace).toBeVisible();
  await expect(page.getByRole("heading", { name: "納品書詳細" })).toBeVisible();
}

async function validateDeliveryDetailVisual(page: Page, size: { width: number; height: number; name: string }) {
  await page.setViewportSize({ width: size.width, height: size.height });
  await page.goto("/core/deliveries?preview=delivery-detail&document=N20260530-01", { waitUntil: "networkidle" });
  await openDeliveryDetail(page);

  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();

  const actions = page.getByTestId("delivery-detail-actions");
  const save = page.getByRole("button", { name: "保存" });
  await expect(save).toBeVisible();

  const actionsBox = await actions.boundingBox();
  const saveBox = await save.boundingBox();
  expect(actionsBox).not.toBeNull();
  expect(saveBox).not.toBeNull();
  expect(actionsBox!.x + actionsBox!.width).toBeLessThanOrEqual(viewport!.width - 8);
  expect(saveBox!.x + saveBox!.width).toBeLessThanOrEqual(viewport!.width - 8);

  const topCards = page.getByTestId("delivery-detail-top-cards");
  const topCardsBox = await topCards.boundingBox();
  expect(topCardsBox).not.toBeNull();
  expect(topCardsBox!.height).toBeLessThanOrEqual(size.width >= 1360 ? 350 : 760);
  await expect(page.getByTestId("delivery-detail-summary-strip")).toHaveCount(0);
  await expect(page.getByTestId("delivery-detail-basic-card")).toBeVisible();
  await expect(page.getByTestId("delivery-detail-destination-card")).toBeVisible();
  await expect(page.getByTestId("delivery-detail-shipping-card")).toBeVisible();

  const shipping = page.getByTestId("delivery-detail-shipping-card");
  const timeSelect = shipping.getByTestId("delivery-detail-time-select");
  const timeBox = await timeSelect.boundingBox();
  expect(timeBox).not.toBeNull();
  expect(timeBox!.x + timeBox!.width).toBeLessThanOrEqual(viewport!.width - 8);

  const lines = page.getByTestId("delivery-detail-lines-card");
  const linesBox = await lines.boundingBox();
  expect(linesBox).not.toBeNull();
  expect(linesBox!.y).toBeLessThanOrEqual(size.width >= 1600 ? 495 : 520);
  expect(linesBox!.y - (topCardsBox!.y + topCardsBox!.height)).toBeLessThanOrEqual(16);

  const rows = page.getByTestId("delivery-line-row");
  const visibleRows = await rows.evaluateAll((els) =>
    els.filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight - 72;
    }).length,
  );
  expect(visibleRows).toBeGreaterThanOrEqual(size.width >= 1600 ? 5 : 2);

  const unit = page.getByTestId("delivery-header-unit");
  const unitBox = await unit.boundingBox();
  expect(unitBox).not.toBeNull();
  expect(unitBox!.height).toBeLessThanOrEqual(32);
  expect(unitBox!.width).toBeGreaterThanOrEqual(34);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);

  const lastActions = page.getByTestId("delivery-line-actions").last();
  const lastActionsBox = await lastActions.boundingBox();
  expect(lastActionsBox).not.toBeNull();
  expect(lastActionsBox!.x + lastActionsBox!.width).toBeLessThanOrEqual(viewport!.width - 8);

  const footer = page.getByTestId("delivery-detail-footer");
  await expect(footer).toBeVisible();
  const footerBox = await footer.boundingBox();
  expect(footerBox).not.toBeNull();
  expect(footerBox!.height).toBeLessThanOrEqual(72);

  const includedTax = footer.getByTestId("delivery-detail-included-tax");
  const includedTaxBox = await includedTax.boundingBox();
  expect(includedTaxBox).not.toBeNull();
  expect(includedTaxBox!.x + includedTaxBox!.width).toBeLessThanOrEqual(viewport!.width - 8);

  const lastRow = page.getByTestId("delivery-line-row").last();
  await lastRow.scrollIntoViewIfNeeded();
  const lastRowBox = await lastRow.boundingBox();
  expect(lastRowBox).not.toBeNull();
  expect(lastRowBox!.y + lastRowBox!.height).toBeLessThanOrEqual(footerBox!.y - 8);

  await expect(page.locator('[aria-label="AIBOUX Global AI Assistant"]')).toHaveCount(0);
  await expect(page).toHaveScreenshot(`delivery-detail-reference-${size.name}.png`, {
    maxDiffPixelRatio: 0.02,
    animations: "disabled",
  });
  await page.screenshot({
    path: `output/playwright/core-documents-redesign/delivery-detail-reference-match-${size.name}.png`,
    fullPage: false,
  });
}

test("delivery detail preview URL opens detail directly", async ({ page }) => {
  for (const size of [
    { width: 1980, height: 1080, name: "1980" },
    { width: 1650, height: 900, name: "1650" },
    { width: 1440, height: 900, name: "1440" },
    { width: 1366, height: 768, name: "1366" },
  ]) {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.goto("/core/deliveries?preview=delivery-detail&document=N20260530-01", { waitUntil: "networkidle" });

    await expect(page.getByTestId("delivery-detail-workspace")).toBeVisible();
    await expect(page.getByRole("heading", { name: "納品書詳細" })).toBeVisible();
    await expect(page.getByText("N20260530-01").first()).toBeVisible();
    await expect(page.getByTestId("delivery-detail-toolbar")).toBeVisible();
    await expect(page.getByTestId("delivery-detail-summary-strip")).toHaveCount(0);
    await expect(page.getByTestId("delivery-detail-top-cards")).toBeVisible();
    await expect(page.getByTestId("delivery-detail-basic-card")).toBeVisible();
    await expect(page.getByTestId("delivery-detail-destination-card")).toBeVisible();
    await expect(page.getByTestId("delivery-detail-shipping-card")).toBeVisible();
    await expect(page.getByTestId("delivery-detail-lines-card")).toBeVisible();
    await expect(page.getByTestId("delivery-detail-footer")).toBeVisible();

    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    const save = page.getByRole("button", { name: "保存" });
    await expect(save).toBeVisible();
    const saveBox = await save.boundingBox();
    expect(saveBox).not.toBeNull();
    expect(saveBox!.x + saveBox!.width).toBeLessThanOrEqual(viewport!.width - 8);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);

    await page.screenshot({
      path: `output/playwright/core-documents-redesign/delivery-detail-direct-v6-${size.name}.png`,
      fullPage: false,
    });
  }
});

test("納品書詳細画面とフローティング印刷プレビューを確認できる", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/core/deliveries", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "納品書" })).toBeVisible();
  await expect(page.getByRole("button", { name: "納品書を作成" })).toBeEnabled();

  await openDeliveryDetail(page);
  await page.screenshot({ path: "output/playwright/core-documents-redesign/delivery-detail.png" });
  await page.screenshot({ path: "output/playwright/core-documents-redesign/delivery-detail-fixed.png" });
  await page.getByTestId("delivery-detail-print-button").click();

  const previewDialog = page.getByTestId("delivery-print-preview-dialog");
  await expect(previewDialog).toBeVisible();
  await expect(page.getByText("印刷プレビュー")).toBeVisible();
  await expect(page.frameLocator('[data-testid="delivery-print-preview-frame"]').getByRole("heading", { name: "納品書" })).toBeVisible();
  await expect(page.frameLocator('[data-testid="delivery-print-preview-frame"]').getByText("N20260530-01")).toBeVisible();
  await expect(previewDialog.getByRole("button", { name: "PDFダウンロード" })).toBeVisible();
  await expect(previewDialog.getByRole("button", { name: "別ウィンドウで開く" })).toBeVisible();
  await expect(previewDialog.getByRole("button", { name: "閉じる" })).toBeVisible();
  await page.screenshot({ path: "output/playwright/core-documents-redesign/delivery-print-preview-open.png" });
  await page.screenshot({ path: "output/playwright/core-documents-redesign/delivery-print-preview-open-fixed.png" });

  const popupPromise = page.waitForEvent("popup");
  await previewDialog.getByRole("button", { name: "別ウィンドウで開く" }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState("domcontentloaded");
  await expect(popup.getByText("納品書").first()).toBeVisible();
  await expect(popup.getByText("N20260530-01")).toBeVisible();
  await popup.screenshot({ path: "output/playwright/core-documents-redesign/delivery-print-window.png" });
  await popup.screenshot({ path: "output/playwright/core-documents-redesign/delivery-print-window-fixed.png" });
  await popup.pdf({ path: "output/playwright/core-documents-redesign/delivery-note-sample.pdf", format: "A4", printBackground: true });
  await popup.close();

  const downloadPromise = page.waitForEvent("download");
  await previewDialog.getByRole("button", { name: "PDFダウンロード" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain("N20260530-01");
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  const downloadPath = "output/playwright/core-documents-redesign/delivery-note-download.pdf";
  await download.saveAs(downloadPath);
  expect(existsSync(downloadPath)).toBe(true);
  expect(statSync(downloadPath).size).toBeGreaterThan(500);

  await previewDialog.getByRole("button", { name: "閉じる" }).click();
  await expect(page.getByTestId("delivery-print-preview-dialog")).toHaveCount(0);
  await expect(page.getByText("印刷プレビュー")).toHaveCount(0);

  await openDeliveryDetail(page);
  await expect(page).toHaveURL(/\/core\/deliveries$/);
  await expect(page.getByText("配送状況")).toHaveCount(0);
  await expect(page.getByText("通貨")).toHaveCount(0);
  await expect(page.getByText("配送備考")).toHaveCount(0);
  await expect(page.getByTestId("delivery-detail-footer")).toBeVisible();

  const visualSizes = [
    { width: 1980, height: 1080, name: "1980" },
    { width: 1650, height: 900, name: "1650" },
    { width: 1440, height: 900, name: "1440" },
    { width: 1366, height: 768, name: "1366" },
  ];
  for (const size of visualSizes) {
    await validateDeliveryDetailVisual(page, size);
  }

  writeFileSync(
    "output/playwright/core-documents-redesign/delivery-detail-fixed-dom-audit.json",
    JSON.stringify({
      visualSizes,
      checks: {
        forbiddenLabelsAbsent: {
          shippingStatus: await page.getByText("配送状況").count(),
          currency: await page.getByText("通貨").count(),
          deliveryMemoInShipping: await page.getByText("配送備考").count(),
        },
      },
    }, null, 2),
  );

  // The visual evidence is captured immediately after opening the detail workspace.
  // Later bbox checks can trigger scroll adjustments, but should not overwrite the reference screenshot.
});
