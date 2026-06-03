import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

const referencePath = "output/reference/core-delivery-detail/reference.png";
const referenceTextContractPath = "output/reference/core-delivery-detail/reference-text-contract.json";
const referenceTextContract = JSON.parse(readFileSync(referenceTextContractPath, "utf8")) as {
  basic: {
    documentNumber: string;
    date: string;
    customer: string;
    contact: string;
  };
  shipping: {
    deliveryDate: string;
    time: string;
  };
  forbiddenTexts: string[];
};
const referenceGeometry = {
  sidebarWidth: 244,
  topSearchY: 13,
  titleRowY: 86,
  topCardsY: 135,
  topCardsHeight: 326,
  linesY: 477,
  memoHistoryY: 734,
  footerY: 885,
};
const referenceGeometryThresholds = {
  sidebarWidth: 4,
  topSearchY: 6,
  titleRowY: 6,
  topCardsY: 8,
  topCardsHeight: 12,
  linesY: 8,
  memoHistoryY: 12,
  footerY: 8,
};
const expectedTexts = [
  referenceTextContract.basic.documentNumber,
  referenceTextContract.basic.date,
  referenceTextContract.basic.customer,
  referenceTextContract.basic.contact,
  referenceTextContract.shipping.deliveryDate,
  referenceTextContract.shipping.time,
  "東京本社 仕入部門",
  "03-1234-5678",
  "備考・メモ",
  "履歴",
];
const forbiddenTexts = referenceTextContract.forbiddenTexts;

function pngSize(path: string) {
  const data = readFileSync(path);
  if (data.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error("reference image is not PNG");
  }
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
  };
}

async function numericFontWeight(locator: Locator) {
  return await locator.evaluate((element) => Number.parseInt(getComputedStyle(element).fontWeight, 10));
}

async function styleOf(locator: Locator) {
  return await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      fontWeight: Number.parseInt(style.fontWeight, 10),
      color: style.color,
      whiteSpace: style.whiteSpace,
      className: element.getAttribute("class") ?? "",
      text: "value" in element ? String((element as HTMLInputElement).value ?? "") : (element.textContent ?? "").trim(),
    };
  });
}

function matchesColor(style: { color: string; className: string }, rgb: string, tokenClass: string) {
  const oklchByToken: Record<string, string> = {
    "text-slate-900": "oklch(0.208 0.042 265.755)",
    "text-slate-800": "oklch(0.279 0.041 260.031)",
    "text-slate-700": "oklch(0.372 0.044 257.287)",
    "text-slate-500": "oklch(0.554 0.046 257.417)",
    "text-blue-600": "oklch(0.546 0.245 262.881)",
  };
  return style.color === rgb || style.color === oklchByToken[tokenClass] || style.className.includes(tokenClass);
}

test("delivery detail matches reference image structure", async ({ page }) => {
  expect(existsSync(referencePath)).toBeTruthy();
  const size = pngSize(referencePath);
  expect(size.width).toBeGreaterThanOrEqual(1200);
  expect(size.height).toBeGreaterThanOrEqual(700);
  let actualGeometry: Record<string, number> | null = null;
  let geometryVerdict = "NOT_RUN";
  let textReport = {
    missingExpectedTexts: [] as string[],
    forbiddenTextsFound: [] as string[],
    visualBlockers: [] as string[],
    textPass: false,
    actualTextExtract: {} as Record<string, string>,
  };
  let productRowReport = {
    productNameSingleLine: false,
    productNameSecondLineFound: true,
    productNameCellHeight: 0,
    lineRowHeight: 0,
    productNameWhiteSpace: "",
  };
  let fontWeightReport = {
    verdict: "NOT_RUN",
    rules: {
      titlesCanBeBold: true,
      labelsCanBeBold: true,
      valuesMustBeNormal: true,
      productNamesMustBeNormal: true,
      amountValuesMustBeNormal: true,
    },
    violations: [] as Array<{ selector: string; text: string; fontWeight: number; reason: string }>,
    samples: [] as Array<{ selector: string; text: string; fontWeight: number }>,
  };
  let typographyReport = {
    verdict: "NOT_RUN",
    fontSize: "NOT_RUN",
    lineHeight: "NOT_RUN",
    fontColor: "NOT_RUN",
    fontWeight: "NOT_RUN",
    rules: {
      pageTitle: { fontSize: "20px", lineHeight: "28px", fontWeight: ">=600", color: "slate-900" },
      sectionTitle: { fontSize: "15px", lineHeight: "22px", fontWeight: ">=600", color: "slate-900" },
      label: { fontSize: "13px", lineHeight: "20px", fontWeight: "500-600", color: "slate-500" },
      value: { fontSize: "13px", lineHeight: "20px", fontWeight: "<=400", color: ["slate-700", "blue-600"] },
      tableHeader: { fontSize: "12px", lineHeight: "16px", fontWeight: "500-600", color: "slate-500" },
      productName: { fontSize: "13px", lineHeight: "20px", fontWeight: "<=400", color: "slate-800", whiteSpace: "nowrap" },
      footerTotal: { fontSize: "18px", lineHeight: "24px", fontWeight: "<=400", color: "blue-600" },
    },
    violations: [] as Array<{ selector: string; text: string; actual: Record<string, string | number>; reason: string }>,
    samples: [] as Array<{ selector: string; text: string; actual: Record<string, string | number> }>,
  };

  for (const viewport of [
    { width: 1672, height: 941, name: "1672" },
    { width: 1980, height: 1080, name: "1980" },
    { width: 1650, height: 900, name: "1650" },
    { width: 1366, height: 768, name: "1366" },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/core/deliveries?preview=delivery-detail&document=N20260530-01", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: "納品書詳細" })).toBeVisible();
    await expect(page.getByText("N20260530-01").first()).toBeVisible();
    await expect(page.getByTestId("delivery-detail-toolbar")).toBeVisible();
    await expect(page.getByTestId("delivery-detail-actions")).toBeVisible();
    await expect(page.getByTestId("delivery-detail-top-cards")).toBeVisible();
    await expect(page.getByTestId("delivery-detail-basic-card")).toBeVisible();
    await expect(page.getByTestId("delivery-detail-destination-card")).toBeVisible();
    await expect(page.getByTestId("delivery-detail-shipping-card")).toBeVisible();
    await expect(page.getByTestId("delivery-detail-summary-strip")).toHaveCount(0);
    await expect(page.getByText("明細一覧")).toBeVisible();
    await expect(page.getByText("備考・メモ")).toBeVisible();
    await expect(page.getByText("履歴", { exact: true })).toBeVisible();
    await expect(page.getByTestId("delivery-detail-bottom-grid")).toBeVisible();
    await expect(page.getByTestId("delivery-detail-footer")).toBeVisible();
    await expect(page.getByRole("button", { name: "B2 CSV" })).toBeVisible();
    await expect(page.getByRole("button", { name: "商品CSV" })).toBeVisible();
    await expect(page.getByRole("button", { name: "メール送信" })).toBeVisible();
    await expect(page.getByRole("button", { name: "FAX送信" })).toBeVisible();
    await expect(page.getByRole("button", { name: "コピー" })).toBeVisible();
    await expect(page.getByRole("button", { name: "印刷" })).toBeVisible();
    const bodyText = await page.locator("body").innerText();
    const missingExpectedTexts = expectedTexts.filter((text) => !bodyText.includes(text));
    const forbiddenTextsFound = forbiddenTexts.filter((text) => bodyText.includes(text));
    expect(missingExpectedTexts).toEqual([]);
    expect(forbiddenTextsFound).toEqual([]);
    await expect(page.getByTestId("delivery-basic-customer-value")).toHaveText(referenceTextContract.basic.customer);
    expect(bodyText).not.toContain("サンプル商事株式会社");

    const dateInput = page.getByTestId("delivery-detail-date-input");
    await expect(dateInput).toHaveValue("2026/05/29");
    const topActions = page.getByTestId("delivery-detail-actions");
    await expect(topActions.getByRole("button", { name: "その他の操作" })).toHaveCount(0);
    await expect(topActions.locator("button").filter({ hasText: "..." })).toHaveCount(0);

    const save = page.getByRole("button", { name: "保存" });
    await expect(save).toBeVisible();
    const saveBox = await save.boundingBox();
    expect(saveBox).not.toBeNull();
    expect(saveBox!.x + saveBox!.width).toBeLessThanOrEqual(viewport.width - 8);

    await expect(page.getByRole("button", { name: "削除", exact: true })).toHaveCount(0);
    await expect(page.getByTestId("global-ai-fab")).toHaveCount(0);
    await expect(page.locator('[aria-label="AIBOUX Global AI Assistant"]')).toHaveCount(0);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);

    const productNames = page.getByTestId("delivery-line-product-name");
    const productNameCount = await productNames.count();
    expect(productNameCount).toBeGreaterThan(0);
    for (let index = 0; index < productNameCount; index += 1) {
      const productName = productNames.nth(index);
      const productBox = await productName.boundingBox();
      expect(productBox).not.toBeNull();
      expect(productBox!.height).toBeLessThanOrEqual(24);
      const whiteSpace = await productName.evaluate((element) => getComputedStyle(element).whiteSpace);
      expect(whiteSpace).toBe("nowrap");
      const productWeight = await numericFontWeight(productName);
      expect(productWeight).toBeLessThanOrEqual(400);
    }
    await expect(page.locator("[data-testid='delivery-line-product-cell'] .text-xs")).toHaveCount(0);
    await expect(page.locator("[data-testid='delivery-line-product-name'] + .text-xs")).toHaveCount(0);
    const firstProductBox = await productNames.first().boundingBox();
    const firstLineRowBox = await page.getByTestId("delivery-line-row").first().boundingBox();
    expect(firstProductBox).not.toBeNull();
    expect(firstLineRowBox).not.toBeNull();
    expect(firstLineRowBox!.height).toBeLessThanOrEqual(44);

    if (viewport.name === "1672") {
      const sidebarBox = await page.getByTestId("core-sidebar").boundingBox();
      const topSearchBox = await page.getByTestId("core-top-search").boundingBox();
      const titleRowBox = await page.getByTestId("delivery-detail-toolbar").boundingBox();
      const topBox = await page.getByTestId("delivery-detail-top-cards").boundingBox();
      const linesBox = await page.getByTestId("delivery-detail-lines-card").boundingBox();
      const bottomBox = await page.getByTestId("delivery-detail-bottom-grid").boundingBox();
      const footerBox = await page.getByTestId("delivery-detail-footer").boundingBox();
      const actionsBox = await page.getByTestId("delivery-detail-actions").boundingBox();
      expect(sidebarBox).not.toBeNull();
      expect(topSearchBox).not.toBeNull();
      expect(titleRowBox).not.toBeNull();
      expect(topBox).not.toBeNull();
      expect(linesBox).not.toBeNull();
      expect(bottomBox).not.toBeNull();
      expect(footerBox).not.toBeNull();
      expect(actionsBox).not.toBeNull();

      actualGeometry = {
        sidebarWidth: Math.round(sidebarBox!.width),
        topSearchY: Math.round(topSearchBox!.y),
        titleRowY: Math.round(titleRowBox!.y),
        topCardsY: Math.round(topBox!.y),
        topCardsHeight: Math.round(topBox!.height),
        linesY: Math.round(linesBox!.y),
        memoHistoryY: Math.round(bottomBox!.y),
        footerY: Math.round(footerBox!.y),
        titleActionsRightEdge: Math.round(actionsBox!.x + actionsBox!.width),
      };

      expect(Math.abs(actualGeometry.sidebarWidth - referenceGeometry.sidebarWidth)).toBeLessThanOrEqual(referenceGeometryThresholds.sidebarWidth);
      expect(Math.abs(actualGeometry.topSearchY - referenceGeometry.topSearchY)).toBeLessThanOrEqual(referenceGeometryThresholds.topSearchY);
      expect(Math.abs(actualGeometry.titleRowY - referenceGeometry.titleRowY)).toBeLessThanOrEqual(referenceGeometryThresholds.titleRowY);
      expect(Math.abs(actualGeometry.topCardsY - referenceGeometry.topCardsY)).toBeLessThanOrEqual(referenceGeometryThresholds.topCardsY);
      expect(Math.abs(actualGeometry.topCardsHeight - referenceGeometry.topCardsHeight)).toBeLessThanOrEqual(referenceGeometryThresholds.topCardsHeight);
      expect(Math.abs(actualGeometry.linesY - referenceGeometry.linesY)).toBeLessThanOrEqual(referenceGeometryThresholds.linesY);
      expect(Math.abs(actualGeometry.memoHistoryY - referenceGeometry.memoHistoryY)).toBeLessThanOrEqual(referenceGeometryThresholds.memoHistoryY);
      expect(Math.abs(actualGeometry.footerY - referenceGeometry.footerY)).toBeLessThanOrEqual(referenceGeometryThresholds.footerY);
      geometryVerdict = "PASS";
      const destinationCard = page.getByTestId("delivery-detail-destination-card");
      const destinationText = await destinationCard.innerText();
      const shippingCard = page.getByTestId("delivery-detail-shipping-card");
      const shippingText = await shippingCard.innerText();
      const visualBlockers = [
        destinationText.includes("...") ? "destination values truncated" : "",
        shippingText.includes("05/29/2026") ? "wrong date format 05/29/2026 found" : "",
        (await page.getByTestId("delivery-detail-actions").getByRole("button", { name: "その他の操作" }).count()) > 0 ? "more button visible" : "",
        (await page.getByRole("button", { name: "削除", exact: true }).count()) > 0 ? "always-visible delete button" : "",
        (await page.getByTestId("global-ai-fab").count()) > 0 ? "global AI FAB visible" : "",
      ].filter(Boolean);
      textReport = {
        missingExpectedTexts,
        forbiddenTextsFound,
        visualBlockers,
        textPass: missingExpectedTexts.length === 0 && forbiddenTextsFound.length === 0 && visualBlockers.length === 0,
        actualTextExtract: {
          documentNumber: (await page.getByTestId("delivery-basic-document-number-value").innerText()).trim(),
          date: (await page.getByTestId("delivery-basic-date-value").innerText()).trim(),
          customer: (await page.getByTestId("delivery-basic-customer-value").innerText()).trim(),
          contact: (await page.getByTestId("delivery-basic-contact-value").innerText()).trim(),
          shippingDate: await page.getByTestId("delivery-detail-date-input").inputValue(),
          shippingTime: (await page.getByTestId("delivery-detail-time-select").innerText()).trim(),
        },
      };
      productRowReport = {
        productNameSingleLine: firstProductBox!.height <= 24,
        productNameSecondLineFound: (await page.locator("[data-testid='delivery-line-product-cell'] .text-xs").count()) > 0,
        productNameCellHeight: Math.round(firstProductBox!.height),
        lineRowHeight: Math.round(firstLineRowBox!.height),
        productNameWhiteSpace: await productNames.first().evaluate((element) => getComputedStyle(element).whiteSpace),
      };
      expect(textReport.visualBlockers).toEqual([]);
      expect(textReport.textPass).toBeTruthy();
      expect(productRowReport.productNameSingleLine).toBeTruthy();
      expect(productRowReport.productNameSecondLineFound).toBeFalsy();
      expect(productRowReport.productNameWhiteSpace).toBe("nowrap");

      const fontViolations: Array<{ selector: string; text: string; fontWeight: number; reason: string }> = [];
      const fontSamples: Array<{ selector: string; text: string; fontWeight: number }> = [];
      const typographyViolations: Array<{ selector: string; text: string; actual: Record<string, string | number>; reason: string }> = [];
      const typographySamples: Array<{ selector: string; text: string; actual: Record<string, string | number> }> = [];
      const track = async (selector: string, locator: Locator, rule: "normal" | "label" | "title", reason: string) => {
        const count = await locator.count();
        expect(count, `${selector} must exist`).toBeGreaterThan(0);
        for (let index = 0; index < count; index += 1) {
          const item = locator.nth(index);
          const weight = await numericFontWeight(item);
          const text = (await item.innerText().catch(async () => await item.inputValue().catch(() => ""))).trim();
          fontSamples.push({ selector, text, fontWeight: weight });
          if (rule === "normal" && weight > 400) fontViolations.push({ selector, text, fontWeight: weight, reason });
          if (rule === "label" && weight < 500) fontViolations.push({ selector, text, fontWeight: weight, reason });
          if (rule === "title" && weight < 600) fontViolations.push({ selector, text, fontWeight: weight, reason });
        }
      };

      await track("[data-testid='delivery-section-title']", page.getByTestId("delivery-section-title"), "title", "section titles may be bold and must remain visually strong");
      await track("[data-testid='delivery-detail-label']", page.getByTestId("delivery-detail-label"), "label", "labels may be medium/bold");
      await track("[data-testid='delivery-line-product-name']", productNames, "normal", "product name/spec must not be bold");
      await track("[data-testid='delivery-amount-value']", page.getByTestId("delivery-amount-value"), "normal", "amount values must not be bold");

      const valueTestIds = [
        "delivery-basic-document-number-value",
        "delivery-basic-date-value",
        "delivery-basic-customer-value",
        "delivery-basic-contact-value",
        "delivery-destination-name-value",
        "delivery-destination-address-value",
        "delivery-destination-phone-value",
        "delivery-shipping-carrier-value",
        "delivery-shipping-service-value",
        "delivery-shipping-tracking-value",
        "delivery-detail-date-input",
        "delivery-detail-time-select",
      ];
      for (const id of valueTestIds) {
        const locator = page.getByTestId(id);
        await expect(locator, `${id} must be visible`).toBeVisible();
        await track(`[data-testid='${id}']`, locator, "normal", `${id} must not be bold`);
      }

      fontWeightReport = {
        verdict: fontViolations.length === 0 ? "PASS" : "NG",
        rules: {
          titlesCanBeBold: true,
          labelsCanBeBold: true,
          valuesMustBeNormal: true,
          productNamesMustBeNormal: true,
          amountValuesMustBeNormal: true,
        },
        violations: fontViolations,
        samples: fontSamples,
      };
      expect(fontWeightReport.violations).toEqual([]);

      const trackTypography = async (
        selector: string,
        locator: Locator,
        expected: {
          fontSize: string;
          lineHeight: string;
          minWeight?: number;
          maxWeight?: number;
          color?: { rgb: string; tokenClass: string };
          colors?: Array<{ rgb: string; tokenClass: string }>;
          whiteSpace?: string;
        },
      ) => {
        const count = await locator.count();
        expect(count, `${selector} must exist`).toBeGreaterThan(0);
        for (let index = 0; index < count; index += 1) {
          const item = locator.nth(index);
          const style = await styleOf(item);
          const actual = {
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            fontWeight: style.fontWeight,
            color: style.color,
            whiteSpace: style.whiteSpace,
            className: style.className,
          };
          typographySamples.push({ selector, text: style.text, actual });
          if (style.fontSize !== expected.fontSize) typographyViolations.push({ selector, text: style.text, actual, reason: `font-size must be ${expected.fontSize}` });
          if (style.lineHeight !== expected.lineHeight) typographyViolations.push({ selector, text: style.text, actual, reason: `line-height must be ${expected.lineHeight}` });
          if (expected.minWeight !== undefined && style.fontWeight < expected.minWeight) {
            typographyViolations.push({ selector, text: style.text, actual, reason: `font-weight must be >= ${expected.minWeight}` });
          }
          if (expected.maxWeight !== undefined && style.fontWeight > expected.maxWeight) {
            typographyViolations.push({ selector, text: style.text, actual, reason: `font-weight must be <= ${expected.maxWeight}` });
          }
          if (expected.color && !matchesColor(style, expected.color.rgb, expected.color.tokenClass)) {
            typographyViolations.push({ selector, text: style.text, actual, reason: `color must be ${expected.color.tokenClass}` });
          }
          if (expected.colors && !expected.colors.some((color) => matchesColor(style, color.rgb, color.tokenClass))) {
            typographyViolations.push({ selector, text: style.text, actual, reason: `color must be one of ${expected.colors.map((color) => color.tokenClass).join(", ")}` });
          }
          if (expected.whiteSpace && style.whiteSpace !== expected.whiteSpace) {
            typographyViolations.push({ selector, text: style.text, actual, reason: `white-space must be ${expected.whiteSpace}` });
          }
        }
      };

      await trackTypography("[data-testid='delivery-page-title']", page.getByTestId("delivery-page-title"), {
        fontSize: "20px",
        lineHeight: "28px",
        minWeight: 600,
        color: { rgb: "rgb(15, 23, 42)", tokenClass: "text-slate-900" },
      });
      await trackTypography("[data-testid='delivery-section-title']", page.getByTestId("delivery-section-title"), {
        fontSize: "15px",
        lineHeight: "22px",
        minWeight: 600,
        color: { rgb: "rgb(15, 23, 42)", tokenClass: "text-slate-900" },
      });
      await trackTypography("[data-testid='delivery-detail-label']", page.getByTestId("delivery-detail-label"), {
        fontSize: "13px",
        lineHeight: "20px",
        minWeight: 500,
        maxWeight: 600,
        color: { rgb: "rgb(100, 116, 139)", tokenClass: "text-slate-500" },
      });
      await trackTypography("[data-testid='delivery-detail-value']", page.getByTestId("delivery-detail-value"), {
        fontSize: "13px",
        lineHeight: "20px",
        maxWeight: 400,
        colors: [
          { rgb: "rgb(51, 65, 85)", tokenClass: "text-slate-700" },
          { rgb: "rgb(37, 99, 235)", tokenClass: "text-blue-600" },
        ],
      });
      await trackTypography("[data-typography-role='value']", page.locator("[data-typography-role='value']"), {
        fontSize: "13px",
        lineHeight: "20px",
        maxWeight: 400,
        colors: [
          { rgb: "rgb(51, 65, 85)", tokenClass: "text-slate-700" },
          { rgb: "rgb(37, 99, 235)", tokenClass: "text-blue-600" },
        ],
      });
      await trackTypography("[data-testid='delivery-table-header-text']", page.getByTestId("delivery-table-header-text"), {
        fontSize: "12px",
        lineHeight: "16px",
        minWeight: 500,
        maxWeight: 600,
        color: { rgb: "rgb(100, 116, 139)", tokenClass: "text-slate-500" },
      });
      await trackTypography("[data-testid='delivery-line-product-name']", productNames, {
        fontSize: "13px",
        lineHeight: "20px",
        maxWeight: 400,
        color: { rgb: "rgb(30, 41, 59)", tokenClass: "text-slate-800" },
        whiteSpace: "nowrap",
      });
      await trackTypography("[data-testid='delivery-memo-body']", page.getByTestId("delivery-memo-body"), {
        fontSize: "13px",
        lineHeight: "20px",
        maxWeight: 400,
        color: { rgb: "rgb(51, 65, 85)", tokenClass: "text-slate-700" },
      });
      await trackTypography("[data-testid='delivery-history-body']", page.getByTestId("delivery-history-body"), {
        fontSize: "13px",
        lineHeight: "20px",
        maxWeight: 400,
        color: { rgb: "rgb(51, 65, 85)", tokenClass: "text-slate-700" },
      });
      await trackTypography("[data-testid='delivery-amount-label']", page.getByTestId("delivery-amount-label"), {
        fontSize: "12px",
        lineHeight: "16px",
        minWeight: 500,
        maxWeight: 600,
        color: { rgb: "rgb(100, 116, 139)", tokenClass: "text-slate-500" },
      });
      const amountValues = page.getByTestId("delivery-amount-value");
      const amountCount = await amountValues.count();
      expect(amountCount).toBeGreaterThan(0);
      for (let index = 0; index < amountCount; index += 1) {
        const item = amountValues.nth(index);
        const style = await styleOf(item);
        const actual = {
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          fontWeight: style.fontWeight,
          color: style.color,
          whiteSpace: style.whiteSpace,
          className: style.className,
        };
        typographySamples.push({ selector: "[data-testid='delivery-amount-value']", text: style.text, actual });
        if (style.fontWeight > 400) {
          typographyViolations.push({ selector: "[data-testid='delivery-amount-value']", text: style.text, actual, reason: "font-weight must be <= 400" });
        }
        const allowedSize =
          (style.fontSize === "13px" && style.lineHeight === "20px") ||
          (style.fontSize === "14px" && style.lineHeight === "20px") ||
          (style.fontSize === "18px" && style.lineHeight === "24px");
        if (!allowedSize) {
          typographyViolations.push({ selector: "[data-testid='delivery-amount-value']", text: style.text, actual, reason: "amount value size/line-height must match table or footer contract" });
        }
        const allowedColor = [
          { rgb: "rgb(51, 65, 85)", tokenClass: "text-slate-700" },
          { rgb: "rgb(37, 99, 235)", tokenClass: "text-blue-600" },
          { rgb: "rgb(30, 41, 59)", tokenClass: "text-slate-800" },
        ].some((color) => matchesColor(style, color.rgb, color.tokenClass));
        if (!allowedColor) {
          typographyViolations.push({ selector: "[data-testid='delivery-amount-value']", text: style.text, actual, reason: "amount value color must match table or footer contract" });
        }
      }

      typographyReport = {
        ...typographyReport,
        verdict: typographyViolations.length === 0 ? "PASS" : "NG",
        fontSize: typographyViolations.some((violation) => violation.reason.startsWith("font-size")) ? "NG" : "PASS",
        lineHeight: typographyViolations.some((violation) => violation.reason.startsWith("line-height")) ? "NG" : "PASS",
        fontColor: typographyViolations.some((violation) => violation.reason.startsWith("color")) ? "NG" : "PASS",
        fontWeight: typographyViolations.some((violation) => violation.reason.startsWith("font-weight")) ? "NG" : "PASS",
        violations: typographyViolations,
        samples: typographySamples,
      };
      expect(typographyReport.violations).toEqual([]);

      await page.screenshot({
        path: "output/playwright/core-documents-redesign/delivery-detail-reference-match-v2-1672.png",
        fullPage: false,
      });
      await page.screenshot({
        path: "output/playwright/core-documents-redesign/delivery-detail-reference-match-v3-1672.png",
        fullPage: false,
      });
      await page.screenshot({
        path: "output/playwright/core-documents-redesign/delivery-detail-reference-match-v82-1672.png",
        fullPage: false,
      });
    }

    await page.screenshot({
      path: `output/playwright/core-documents-redesign/delivery-detail-reference-match-${viewport.name}.png`,
      fullPage: false,
    });
    await page.screenshot({
      path: `output/playwright/core-documents-redesign/delivery-detail-reference-match-v3-${viewport.name}.png`,
      fullPage: false,
    });
    await page.screenshot({
      path: `output/playwright/core-documents-redesign/delivery-detail-reference-match-v82-${viewport.name}.png`,
      fullPage: false,
    });
  }

  mkdirSync("output/playwright/core-documents-redesign", { recursive: true });
  expect(actualGeometry).not.toBeNull();
  const deltas = {
    sidebarWidth: actualGeometry!.sidebarWidth - referenceGeometry.sidebarWidth,
    topSearchY: actualGeometry!.topSearchY - referenceGeometry.topSearchY,
    titleRowY: actualGeometry!.titleRowY - referenceGeometry.titleRowY,
    topCardsY: actualGeometry!.topCardsY - referenceGeometry.topCardsY,
    topCardsHeight: actualGeometry!.topCardsHeight - referenceGeometry.topCardsHeight,
    linesY: actualGeometry!.linesY - referenceGeometry.linesY,
    memoHistoryY: actualGeometry!.memoHistoryY - referenceGeometry.memoHistoryY,
    footerY: actualGeometry!.footerY - referenceGeometry.footerY,
  };
  const geometryReport = {
    reference: referenceGeometry,
    actual: actualGeometry,
    delta: deltas,
    thresholds: referenceGeometryThresholds,
    verdict: geometryVerdict,
  };
  const visualReport = {
    verdict:
      geometryVerdict === "PASS" &&
      textReport.textPass &&
      productRowReport.productNameSingleLine &&
      !productRowReport.productNameSecondLineFound &&
      fontWeightReport.verdict === "PASS"
      && typographyReport.verdict === "PASS"
        ? "PASS"
        : "NG",
    geometryPass: geometryVerdict === "PASS",
    textPass: textReport.textPass,
    productRowPass:
      productRowReport.productNameSingleLine &&
      !productRowReport.productNameSecondLineFound &&
      productRowReport.productNameCellHeight <= 24 &&
      productRowReport.lineRowHeight <= 44 &&
      productRowReport.productNameWhiteSpace === "nowrap",
    fontWeightPass: fontWeightReport.verdict === "PASS",
    typographyPass: typographyReport.verdict === "PASS",
    missingExpectedTexts: textReport.missingExpectedTexts,
    forbiddenTextsFound: textReport.forbiddenTextsFound,
    expectedTexts,
    forbiddenTexts,
    referenceTextContract,
    actualTextExtract: textReport.actualTextExtract,
    visualBlockers: textReport.visualBlockers,
    productRow: productRowReport,
    fontWeight: fontWeightReport,
    typography: typographyReport,
    geometry: geometryReport,
  };
  writeFileSync(
    "output/playwright/core-documents-redesign/delivery-detail-typography-audit.json",
    `${JSON.stringify(typographyReport, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    "output/playwright/core-documents-redesign/delivery-detail-font-weight-audit.json",
    `${JSON.stringify(fontWeightReport, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    "output/playwright/core-documents-redesign/delivery-detail-reference-geometry-v2.json",
    `${JSON.stringify(geometryReport, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    "output/playwright/core-documents-redesign/delivery-detail-reference-compare.html",
    `<!doctype html>
<html lang="ja">
<head><meta charset="utf-8"><title>Delivery Detail Reference / Actual</title></head>
<body style="font-family:system-ui;margin:24px">
<h1>Reference / Actual</h1>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
  <section><h2>Reference</h2><img src="../../reference/core-delivery-detail/reference.png" style="max-width:100%;border:1px solid #ddd"></section>
  <section><h2>Actual 1672</h2><img src="delivery-detail-reference-match-1672.png" style="max-width:100%;border:1px solid #ddd"></section>
</div>
<p>判定メモ: 上段3カード、明細一覧、備考・メモ、履歴、固定フッター、右上アクション、Global AI FAB非表示を参照画像構造として確認。</p>
</body>
</html>
`,
    "utf8",
  );
  writeFileSync(
    "output/playwright/core-documents-redesign/delivery-detail-reference-compare-v2.html",
    `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>Delivery Detail Reference / Actual Geometry v2</title>
  <style>
    body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:24px;color:#111827;background:#fff}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .panel{border:1px solid #ddd;border-radius:8px;padding:12px;background:#fff}
    img{max-width:100%;border:1px solid #ddd}
    table{border-collapse:collapse;width:100%;margin-top:16px;font-size:14px}
    th,td{border:1px solid #ddd;padding:8px;text-align:right}
    th:first-child,td:first-child{text-align:left}
    pre{white-space:pre-wrap;border:1px solid #ddd;border-radius:8px;padding:12px;background:#f9fafb}
  </style>
</head>
<body>
  <h1>Reference / Actual Geometry v2</h1>
  <div class="grid">
    <section class="panel"><h2>Reference</h2><img src="../../reference/core-delivery-detail/reference.png" alt="Reference"></section>
    <section class="panel"><h2>Actual 1672</h2><img src="delivery-detail-reference-match-v2-1672.png" alt="Actual"></section>
  </div>
  <h2>Geometry Difference</h2>
  <table>
    <thead><tr><th>Metric</th><th>Reference</th><th>Actual</th><th>Delta</th><th>Threshold</th></tr></thead>
    <tbody>
      <tr><td>topCardsY</td><td>${referenceGeometry.topCardsY}</td><td>${actualGeometry!.topCardsY}</td><td>${deltas.topCardsY}</td><td>16</td></tr>
      <tr><td>topCardsHeight</td><td>${referenceGeometry.topCardsHeight}</td><td>${actualGeometry!.topCardsHeight}</td><td>${deltas.topCardsHeight}</td><td>30</td></tr>
      <tr><td>linesY</td><td>${referenceGeometry.linesY}</td><td>${actualGeometry!.linesY}</td><td>${deltas.linesY}</td><td>24</td></tr>
      <tr><td>memoHistoryY</td><td>${referenceGeometry.memoHistoryY}</td><td>${actualGeometry!.memoHistoryY}</td><td>${deltas.memoHistoryY}</td><td>32</td></tr>
      <tr><td>footerY</td><td>${referenceGeometry.footerY}</td><td>${actualGeometry!.footerY}</td><td>${deltas.footerY}</td><td>24</td></tr>
    </tbody>
  </table>
  <h2>Verdict</h2>
  <pre>${JSON.stringify(geometryReport, null, 2)}</pre>
</body>
</html>
`,
    "utf8",
  );
  writeFileSync(
    "output/playwright/core-documents-redesign/delivery-detail-reference-visual-report-v3.json",
    `${JSON.stringify(visualReport, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    "output/playwright/core-documents-redesign/delivery-detail-reference-compare-v3.html",
    `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>Delivery Detail Reference / Actual Visual v3</title>
  <style>
    body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:24px;color:#111827;background:#fff}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .panel{border:1px solid #ddd;border-radius:8px;padding:12px;background:#fff}
    img{max-width:100%;border:1px solid #ddd}
    table{border-collapse:collapse;width:100%;margin-top:16px;font-size:14px}
    th,td{border:1px solid #ddd;padding:8px;text-align:right}
    th:first-child,td:first-child{text-align:left}
    pre{white-space:pre-wrap;border:1px solid #ddd;border-radius:8px;padding:12px;background:#f9fafb}
  </style>
</head>
<body>
  <h1>Reference / Actual Visual v3</h1>
  <div class="grid">
    <section class="panel"><h2>Reference</h2><img src="../../reference/core-delivery-detail/reference.png" alt="Reference"></section>
    <section class="panel"><h2>Actual 1672</h2><img src="delivery-detail-reference-match-v3-1672.png" alt="Actual"></section>
  </div>
  <section class="panel"><h2>Diff Image</h2><img src="delivery-detail-reference-diff-v3-1672.png" alt="Diff image will be generated after Playwright"></section>
  <h2>Geometry Difference</h2>
  <table>
    <thead><tr><th>Metric</th><th>Reference</th><th>Actual</th><th>Delta</th><th>Threshold</th></tr></thead>
    <tbody>
      <tr><td>topCardsY</td><td>${referenceGeometry.topCardsY}</td><td>${actualGeometry!.topCardsY}</td><td>${deltas.topCardsY}</td><td>16</td></tr>
      <tr><td>topCardsHeight</td><td>${referenceGeometry.topCardsHeight}</td><td>${actualGeometry!.topCardsHeight}</td><td>${deltas.topCardsHeight}</td><td>30</td></tr>
      <tr><td>linesY</td><td>${referenceGeometry.linesY}</td><td>${actualGeometry!.linesY}</td><td>${deltas.linesY}</td><td>24</td></tr>
      <tr><td>memoHistoryY</td><td>${referenceGeometry.memoHistoryY}</td><td>${actualGeometry!.memoHistoryY}</td><td>${deltas.memoHistoryY}</td><td>32</td></tr>
      <tr><td>footerY</td><td>${referenceGeometry.footerY}</td><td>${actualGeometry!.footerY}</td><td>${deltas.footerY}</td><td>24</td></tr>
    </tbody>
  </table>
  <h2>Text Difference</h2>
  <pre>${JSON.stringify({
    missingExpectedTexts: textReport.missingExpectedTexts,
    forbiddenTextsFound: textReport.forbiddenTextsFound,
    expectedTexts,
    forbiddenTexts,
  }, null, 2)}</pre>
  <h2>Visual Blockers</h2>
  <pre>${JSON.stringify(textReport.visualBlockers, null, 2)}</pre>
  <h2>Product Row Difference</h2>
  <pre>${JSON.stringify(productRowReport, null, 2)}</pre>
  <h2>Verdict</h2>
  <pre>${JSON.stringify(visualReport, null, 2)}</pre>
</body>
</html>
`,
    "utf8",
  );
  writeFileSync(
    "output/playwright/core-documents-redesign/delivery-detail-reference-compare-v4.json",
    `${JSON.stringify(visualReport, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    "output/playwright/core-documents-redesign/delivery-detail-reference-compare-v4.html",
    `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>Delivery Detail Reference / Actual Visual v4</title>
  <style>
    body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:24px;color:#111827;background:#fff}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .panel{border:1px solid #ddd;border-radius:8px;padding:12px;background:#fff}
    img{max-width:100%;border:1px solid #ddd}
    table{border-collapse:collapse;width:100%;margin-top:16px;font-size:14px}
    th,td{border:1px solid #ddd;padding:8px;text-align:right}
    th:first-child,td:first-child{text-align:left}
    pre{white-space:pre-wrap;border:1px solid #ddd;border-radius:8px;padding:12px;background:#f9fafb}
  </style>
</head>
<body>
  <h1>Reference / Actual Visual v4</h1>
  <div class="grid">
    <section class="panel"><h2>Reference</h2><img src="../../reference/core-delivery-detail/reference.png" alt="Reference"></section>
    <section class="panel"><h2>Actual 1672</h2><img src="delivery-detail-reference-match-v3-1672.png" alt="Actual"></section>
  </div>
  <section class="panel"><h2>Diff Image</h2><img src="delivery-detail-reference-diff-v4-1672.png" alt="Diff image will be generated after Playwright"></section>
  <h2>Geometry Difference</h2>
  <table>
    <thead><tr><th>Metric</th><th>Reference</th><th>Actual</th><th>Delta</th><th>Threshold</th></tr></thead>
    <tbody>
      <tr><td>topCardsY</td><td>${referenceGeometry.topCardsY}</td><td>${actualGeometry!.topCardsY}</td><td>${deltas.topCardsY}</td><td>16</td></tr>
      <tr><td>topCardsHeight</td><td>${referenceGeometry.topCardsHeight}</td><td>${actualGeometry!.topCardsHeight}</td><td>${deltas.topCardsHeight}</td><td>30</td></tr>
      <tr><td>linesY</td><td>${referenceGeometry.linesY}</td><td>${actualGeometry!.linesY}</td><td>${deltas.linesY}</td><td>24</td></tr>
      <tr><td>memoHistoryY</td><td>${referenceGeometry.memoHistoryY}</td><td>${actualGeometry!.memoHistoryY}</td><td>${deltas.memoHistoryY}</td><td>32</td></tr>
      <tr><td>footerY</td><td>${referenceGeometry.footerY}</td><td>${actualGeometry!.footerY}</td><td>${deltas.footerY}</td><td>24</td></tr>
    </tbody>
  </table>
  <h2>Text Difference</h2>
  <pre>${JSON.stringify({
    missingExpectedTexts: textReport.missingExpectedTexts,
    forbiddenTextsFound: textReport.forbiddenTextsFound,
    expectedTexts,
    forbiddenTexts,
  }, null, 2)}</pre>
  <h2>Product Row Difference</h2>
  <pre>${JSON.stringify(productRowReport, null, 2)}</pre>
  <h2>Visual Blockers</h2>
  <pre>${JSON.stringify(textReport.visualBlockers, null, 2)}</pre>
  <h2>Reviewer Verdict</h2>
  <pre>${JSON.stringify(visualReport, null, 2)}</pre>
</body>
</html>
`,
    "utf8",
  );
  writeFileSync(
    "output/playwright/core-documents-redesign/delivery-detail-reference-compare-v82.json",
    `${JSON.stringify(visualReport, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    "output/playwright/core-documents-redesign/delivery-detail-reference-compare-v82.html",
    `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>Delivery Detail Reference / Actual c82</title>
  <style>
    body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:24px;color:#111827;background:#fff}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .panel{border:1px solid #ddd;border-radius:8px;padding:12px;background:#fff}
    img{max-width:100%;border:1px solid #ddd}
    table{border-collapse:collapse;width:100%;margin-top:16px;font-size:14px}
    th,td{border:1px solid #ddd;padding:8px;text-align:right}
    th:first-child,td:first-child{text-align:left}
    pre{white-space:pre-wrap;border:1px solid #ddd;border-radius:8px;padding:12px;background:#f9fafb}
    .status{display:inline-block;border-radius:999px;padding:2px 8px;background:#eef2ff;color:#3730a3;font-size:12px;font-weight:600}
  </style>
</head>
<body>
  <h1>Reference / Actual c82</h1>
  <p><span class="status">PREVIEW_READY_PENDING_USER candidate</span> Deploy: DEPLOY_BLOCKED_AUTH</p>
  <div class="grid">
    <section class="panel"><h2>Reference</h2><img src="../../reference/core-delivery-detail/reference.png" alt="Reference"></section>
    <section class="panel"><h2>Actual 1672</h2><img src="delivery-detail-reference-match-v82-1672.png" alt="Actual"></section>
  </div>
  <section class="panel"><h2>Diff Image</h2><img src="delivery-detail-reference-diff-v82-1672.png" alt="Diff image will be generated after compare"></section>
  <h2>Reference Text Contract</h2>
  <pre>${JSON.stringify(referenceTextContract, null, 2)}</pre>
  <h2>Actual Text Extract</h2>
  <pre>${JSON.stringify(textReport.actualTextExtract, null, 2)}</pre>
  <h2>Text Mismatch</h2>
  <pre>${JSON.stringify({
    missingExpectedTexts: textReport.missingExpectedTexts,
    forbiddenTextsFound: textReport.forbiddenTextsFound,
    expectedTexts,
    forbiddenTexts,
  }, null, 2)}</pre>
  <h2>Geometry Difference</h2>
  <table>
    <thead><tr><th>Metric</th><th>Reference</th><th>Actual</th><th>Delta</th><th>Threshold</th></tr></thead>
    <tbody>
      ${Object.keys(referenceGeometryThresholds).map((key) => `<tr><td>${key}</td><td>${referenceGeometry[key as keyof typeof referenceGeometry]}</td><td>${actualGeometry![key]}</td><td>${deltas[key as keyof typeof deltas]}</td><td>${referenceGeometryThresholds[key as keyof typeof referenceGeometryThresholds]}</td></tr>`).join("\n      ")}
    </tbody>
  </table>
  <h2>Typography Difference</h2>
  <pre>${JSON.stringify(typographyReport, null, 2)}</pre>
  <h2>Product Row Difference</h2>
  <pre>${JSON.stringify(productRowReport, null, 2)}</pre>
  <h2>Font Weight Difference</h2>
  <pre>${JSON.stringify(fontWeightReport, null, 2)}</pre>
  <h2>Deploy Status</h2>
  <pre>${JSON.stringify({
    status: "DEPLOY_BLOCKED_AUTH",
    reason: "Wrangler authentication failed",
    userApprovedDeploy: true,
    blocksDesignFix: false,
  }, null, 2)}</pre>
  <h2>Review Status</h2>
  <pre>${JSON.stringify({
    status: "USER_REVIEW_PENDING",
    note: "Grok/Cloudflare final review is not FINAL_ACCEPTED evidence for this preview iteration.",
  }, null, 2)}</pre>
  <h2>Reviewer Verdict</h2>
  <pre>${JSON.stringify(visualReport, null, 2)}</pre>
</body>
</html>
`,
    "utf8",
  );
});
