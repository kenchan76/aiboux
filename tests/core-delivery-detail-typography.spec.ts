import { mkdirSync, writeFileSync } from "node:fs";

import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

type StyleSnapshot = {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  color: string;
  whiteSpace: string;
  className: string;
  text: string;
};

async function styleOf(locator: Locator): Promise<StyleSnapshot> {
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

function matchesColor(style: StyleSnapshot, rgb: string, tokenClass: string) {
  const oklchByToken: Record<string, string> = {
    "text-slate-900": "oklch(0.208 0.042 265.755)",
    "text-slate-800": "oklch(0.279 0.041 260.031)",
    "text-slate-700": "oklch(0.372 0.044 257.287)",
    "text-slate-500": "oklch(0.554 0.046 257.417)",
    "text-blue-600": "oklch(0.546 0.245 262.881)",
  };
  return style.color === rgb || style.color === oklchByToken[tokenClass] || style.className.includes(tokenClass);
}

test("delivery detail typography contract", async ({ page }) => {
  await page.setViewportSize({ width: 1672, height: 941 });
  await page.goto("/core/deliveries?preview=delivery-detail&document=N20260530-01", { waitUntil: "networkidle" });

  const violations: Array<{ selector: string; text: string; actual: StyleSnapshot; reason: string }> = [];
  const samples: Array<{ selector: string; text: string; actual: StyleSnapshot }> = [];

  const track = async (
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
      const actual = await styleOf(item);
      samples.push({ selector, text: actual.text, actual });
      if (actual.fontSize !== expected.fontSize) violations.push({ selector, text: actual.text, actual, reason: `font-size must be ${expected.fontSize}` });
      if (actual.lineHeight !== expected.lineHeight) violations.push({ selector, text: actual.text, actual, reason: `line-height must be ${expected.lineHeight}` });
      if (expected.minWeight !== undefined && actual.fontWeight < expected.minWeight) violations.push({ selector, text: actual.text, actual, reason: `font-weight must be >= ${expected.minWeight}` });
      if (expected.maxWeight !== undefined && actual.fontWeight > expected.maxWeight) violations.push({ selector, text: actual.text, actual, reason: `font-weight must be <= ${expected.maxWeight}` });
      if (expected.color && !matchesColor(actual, expected.color.rgb, expected.color.tokenClass)) {
        violations.push({ selector, text: actual.text, actual, reason: `color must be ${expected.color.tokenClass}` });
      }
      if (expected.colors && !expected.colors.some((color) => matchesColor(actual, color.rgb, color.tokenClass))) {
        violations.push({ selector, text: actual.text, actual, reason: `color must be one of ${expected.colors.map((color) => color.tokenClass).join(", ")}` });
      }
      if (expected.whiteSpace && actual.whiteSpace !== expected.whiteSpace) violations.push({ selector, text: actual.text, actual, reason: `white-space must be ${expected.whiteSpace}` });
    }
  };

  await track("[data-testid='delivery-page-title']", page.getByTestId("delivery-page-title"), {
    fontSize: "20px",
    lineHeight: "28px",
    minWeight: 600,
    color: { rgb: "rgb(15, 23, 42)", tokenClass: "text-slate-900" },
  });
  await track("[data-testid='delivery-section-title']", page.getByTestId("delivery-section-title"), {
    fontSize: "15px",
    lineHeight: "22px",
    minWeight: 600,
    color: { rgb: "rgb(15, 23, 42)", tokenClass: "text-slate-900" },
  });
  await track("[data-testid='delivery-detail-label']", page.getByTestId("delivery-detail-label"), {
    fontSize: "13px",
    lineHeight: "20px",
    minWeight: 500,
    maxWeight: 600,
    color: { rgb: "rgb(100, 116, 139)", tokenClass: "text-slate-500" },
  });
  await track("[data-testid='delivery-detail-value']", page.getByTestId("delivery-detail-value"), {
    fontSize: "13px",
    lineHeight: "20px",
    maxWeight: 400,
    colors: [
      { rgb: "rgb(51, 65, 85)", tokenClass: "text-slate-700" },
      { rgb: "rgb(37, 99, 235)", tokenClass: "text-blue-600" },
    ],
  });
  await track("[data-typography-role='value']", page.locator("[data-typography-role='value']"), {
    fontSize: "13px",
    lineHeight: "20px",
    maxWeight: 400,
    colors: [
      { rgb: "rgb(51, 65, 85)", tokenClass: "text-slate-700" },
      { rgb: "rgb(37, 99, 235)", tokenClass: "text-blue-600" },
    ],
  });
  await track("[data-testid='delivery-table-header-text']", page.getByTestId("delivery-table-header-text"), {
    fontSize: "12px",
    lineHeight: "16px",
    minWeight: 500,
    maxWeight: 600,
    color: { rgb: "rgb(100, 116, 139)", tokenClass: "text-slate-500" },
  });
  await track("[data-testid='delivery-line-product-name']", page.getByTestId("delivery-line-product-name"), {
    fontSize: "13px",
    lineHeight: "20px",
    maxWeight: 400,
    color: { rgb: "rgb(30, 41, 59)", tokenClass: "text-slate-800" },
    whiteSpace: "nowrap",
  });
  await track("[data-testid='delivery-memo-body']", page.getByTestId("delivery-memo-body"), {
    fontSize: "13px",
    lineHeight: "20px",
    maxWeight: 400,
    color: { rgb: "rgb(51, 65, 85)", tokenClass: "text-slate-700" },
  });
  await track("[data-testid='delivery-history-body']", page.getByTestId("delivery-history-body"), {
    fontSize: "13px",
    lineHeight: "20px",
    maxWeight: 400,
    color: { rgb: "rgb(51, 65, 85)", tokenClass: "text-slate-700" },
  });
  await track("[data-testid='delivery-amount-label']", page.getByTestId("delivery-amount-label"), {
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
    const actual = await styleOf(amountValues.nth(index));
    samples.push({ selector: "[data-testid='delivery-amount-value']", text: actual.text, actual });
    if (actual.fontWeight > 400) violations.push({ selector: "[data-testid='delivery-amount-value']", text: actual.text, actual, reason: "font-weight must be <= 400" });
    const allowedSize =
      (actual.fontSize === "13px" && actual.lineHeight === "20px") ||
      (actual.fontSize === "14px" && actual.lineHeight === "20px") ||
      (actual.fontSize === "18px" && actual.lineHeight === "24px");
    if (!allowedSize) violations.push({ selector: "[data-testid='delivery-amount-value']", text: actual.text, actual, reason: "amount value size/line-height must match table or footer contract" });
  }

  const audit = {
    verdict: violations.length === 0 ? "PASS" : "NG",
    rules: {
      pageTitle: { fontSize: "20px", lineHeight: "28px", fontWeight: ">=600", color: "slate-900" },
      sectionTitle: { fontSize: "15px", lineHeight: "22px", fontWeight: ">=600", color: "slate-900" },
      label: { fontSize: "13px", lineHeight: "20px", fontWeight: "500-600", color: "slate-500" },
      value: { fontSize: "13px", lineHeight: "20px", fontWeight: "<=400", color: ["slate-700", "blue-600"] },
      tableHeader: { fontSize: "12px", lineHeight: "16px", fontWeight: "500-600", color: "slate-500" },
      productName: { fontSize: "13px", lineHeight: "20px", fontWeight: "<=400", color: "slate-800", whiteSpace: "nowrap" },
      amountValues: { fontWeight: "<=400" },
    },
    violations,
    samples,
  };

  mkdirSync("output/playwright/core-documents-redesign", { recursive: true });
  writeFileSync("output/playwright/core-documents-redesign/delivery-detail-typography-audit.json", `${JSON.stringify(audit, null, 2)}\n`, "utf8");
  expect(violations).toEqual([]);
});
