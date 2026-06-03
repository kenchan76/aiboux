import { readFileSync } from "node:fs";
import { expect, selectors, test, type Locator, type Page } from "@playwright/test";

declare module "@playwright/test" {
  interface Page {
    getByDisplayValue(value: string | RegExp): Locator;
  }
}

test.use({ viewport: { width: 1980, height: 1080 } });

await selectors.register("displayvalue", () => {
  function decode(selector: string): { value?: string; source?: string; flags?: string } {
    return JSON.parse(decodeURIComponent(selector)) as { value?: string; source?: string; flags?: string };
  }

  function matches(element: Element, selector: string) {
    const expected = decode(selector);
    const value = "value" in element ? String((element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value) : "";
    if (expected.source) return new RegExp(expected.source, expected.flags ?? "").test(value);
    return value === expected.value;
  }

  return {
    query(root: Document | Element | ShadowRoot, selector: string) {
      return this.queryAll(root, selector)[0] ?? null;
    },
    queryAll(root: Document | Element | ShadowRoot, selector: string) {
      return Array.from(root.querySelectorAll("input, textarea, select")).filter((element) => matches(element, selector));
    },
  };
});

test.beforeEach(async ({ page }) => {
  installDisplayValueLocator(page);
});

function installDisplayValueLocator(page: Page) {
  if (typeof page.getByDisplayValue === "function") return;

  page.getByDisplayValue = (value: string | RegExp) => {
    const payload = typeof value === "string" ? { value } : { source: value.source, flags: value.flags };
    return page.locator(`displayvalue=${encodeURIComponent(JSON.stringify(payload))}`);
  };
}

const pages = [
  { path: "/core", title: "ダッシュボード", shot: "01_dashboard.png" },
  { path: "/core/estimates", title: "見積書", shot: "02_estimates.png" },
  { path: "/core/orders", title: "注文書", shot: "04_orders.png" },
  { path: "/core/deliveries", title: "納品書", shot: "05_deliveries.png" },
  { path: "/core/invoices", title: "請求書", shot: "06_invoices.png" },
  { path: "/core/payments", title: "入金伝票", shot: "07_payments.png" },
  { path: "/core/purchase-orders", title: "発注書", shot: "08_purchase_orders.png" },
  { path: "/core/inventory", title: "在庫一覧", shot: "10_inventory.png" },
  { path: "/core/inventory/history", title: "入出庫履歴・調整", shot: "11_inventory_history.png" },
  { path: "/core/inventory/alerts", title: "アラート・適正在庫", shot: "12_inventory_alerts.png" },
  { path: "/core/partners", title: "取引先マスタ", shot: "13_partners.png" },
  { path: "/core/products", title: "商品・SKUマスタ", shot: "14_products.png" },
  { path: "/core/users", title: "従業員・権限マスタ", shot: "15_users.png" },
  { path: "/core/settings", title: "設定", shot: "16_settings.png" },
  { path: "/core/design-management", title: "デザイン管理", shot: "17_design_management.png" },
  { path: "/core/help", title: "ヘルプ・操作ガイド", shot: "18_help.png" },
];

const documentListPages = [
  { path: "/core/estimates", title: "見積書", button: "見積書を作成", listShot: "estimate-list.png", createShot: "estimate-create.png", editShot: "estimate-edit.png", columns: ["書類番号", "取引先", "提出先", "見積日", "金額", "担当", "状態", "アクション"], forbiddenList: ["納品先", "納品日"], createSections: ["提出先", "管理情報"] },
  { path: "/core/orders", title: "注文書", button: "注文書を作成", listShot: "order-list.png", createShot: "order-create.png", editShot: "order-edit.png", columns: ["書類番号", "取引先", "納入先", "注文日", "金額", "担当", "状態", "アクション"], forbiddenList: [], createSections: ["納入先", "注文情報"] },
  { path: "/core/deliveries", title: "納品書", button: "納品書を作成", listShot: "delivery-list.png", createShot: "delivery-create.png", editShot: "delivery-edit.png", columns: ["書類番号", "取引先", "納品先", "納品日", "金額", "担当", "状態", "アクション"], forbiddenList: [], createSections: ["納品先", "配送情報"] },
  { path: "/core/invoices", title: "請求書", button: "請求書を作成", listShot: "invoice-list.png", createShot: "invoice-create.png", editShot: "invoice-edit.png", columns: ["書類番号", "取引先", "請求先", "請求日", "金額", "担当", "状態", "アクション"], forbiddenList: ["納品先", "納品日"], createSections: ["請求先", "支払情報"] },
  { path: "/core/payments", title: "入金伝票", button: "入金を登録", listShot: "payment-list.png", createShot: "payment-create.png", editShot: "payment-edit.png", columns: ["書類番号", "取引先", "対象請求書", "入金日", "金額", "担当", "状態", "アクション"], forbiddenList: ["納品先", "納品日"], createSections: ["入金元", "消込情報"] },
  { path: "/core/purchase-orders", title: "発注書", button: "発注書を作成", listShot: "purchase-order-list.png", createShot: "purchase-order-create.png", editShot: "purchase-order-edit.png", columns: ["書類番号", "仕入先", "納入先", "入荷予定日", "金額", "担当", "状態", "アクション"], forbiddenList: ["納品先", "納品日"], createSections: ["納入先", "発注情報"] },
];

test("Core全主要ページは1980幅で高密度作業台として表示できる", async ({ page }) => {
  for (const target of pages) {
    await page.goto(target.path);
    await expect(page.getByRole("heading", { name: target.title })).toBeVisible();
    await expect(page.getByRole("link", { name: /aiboux Core dashboard/ })).toBeVisible();
    await expect(page.getByText("tenant_001")).toBeVisible();
    await page.screenshot({ path: `output/playwright/core-ui-redesign/${target.shot}`, fullPage: true });
  }
});

test("印刷PDFは作成画面とは別導線で確認できる", async ({ page, request }) => {
  const documentNumber = `QTE-E2E-${Date.now()}`;
  const response = await request.post("/core/api/documents/save", {
    data: {
      id: "",
      type: "quote",
      documentNumber,
      customerName: "株式会社サンプル",
      issueDate: "2026-05-29",
      status: "draft",
      memo: "Playwright印刷プレビュー検証",
      actorId: "playwright",
      lines: [
        {
          id: "",
          productName: "ミネラルウォーター 500ml",
          quantity: 2,
          unitPrice: 120,
        },
      ],
    },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.success).toBeTruthy();

  await page.goto(`/core/documents/print/${body.documentId}`);
  await expect(page.getByText("見積書").first()).toBeVisible();
  await expect(page.getByText("株式会社サンプル").first()).toBeVisible();
  await page.screenshot({ path: "output/playwright/core-ui-redesign/09_print_pdf.png", fullPage: true });
});

test("帳票一覧は右詳細パネルなしで横幅いっぱいの列構成を表示する", async ({ page }) => {
  for (const target of documentListPages) {
    await page.goto(target.path);
    await expect(page.getByRole("heading", { name: target.title })).toBeVisible();
    await expect(page.getByRole("link", { name: /aiboux Core dashboard/ })).toBeVisible();
    await expect(page.getByText("CORE", { exact: true })).toBeVisible();
    await expect(page.getByText("Core /")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "カスタマイズ" })).toHaveCount(0);
    await expect(page.getByText("A4プレビュー")).toHaveCount(0);
    await expect(page.getByText("ライブプレビュー")).toHaveCount(0);
    await expect(page.getByText("行クリックで詳細/編集画面を開く")).toHaveCount(0);
    await expect(page.getByTestId("document-kpi-card")).toHaveCount(4);
    await expect(page.getByRole("button", { name: /表示期間/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "詳細フィルタ" })).toBeVisible();
    await expect(page.getByRole("button", { name: "CSV出力" })).toBeVisible();
    await expect(page.getByRole("button", { name: "一括送付を準備" })).toBeVisible();
    await expect(page.getByText("選択 0件")).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "表示中の帳票を全件選択" })).toBeVisible();
    await expect(page.getByRole("button", { name: target.button })).toBeVisible();
    for (const column of target.columns) {
      await expect(page.getByRole("columnheader", { name: column })).toBeVisible();
    }
    for (const text of target.forbiddenList) {
      await expect(page.getByRole("columnheader", { name: text })).toHaveCount(0);
    }
    await expect(page.getByText("行を選択すると")).toHaveCount(0);
    await page.screenshot({ path: `output/playwright/core-documents-redesign/${target.listShot}`, fullPage: true });
    await page.locator("tbody tr").first().evaluate((row) => {
      row.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
    });
    await expect(page.getByText(`${target.title}詳細`)).toBeVisible();
    await expect(page.getByText("A4プレビュー")).toHaveCount(0);
    await expect(page.getByText("ライブプレビュー")).toHaveCount(0);
    await expect(page.getByText("配送備考")).toHaveCount(0);
    await expect(page.getByText("明細一覧").first()).toBeVisible();
    await expect(page.getByTestId("document-amount-footer")).toHaveCount(0);
    await page.screenshot({ path: `output/playwright/core-documents-redesign/${target.editShot}`, fullPage: true });
    await page.getByRole("button", { name: `${target.title}一覧` }).click();
  }
});

test("全帳票の作成画面は共通ワークスペースでA4プレビューを出さない", async ({ page }) => {
  for (const target of documentListPages) {
    await page.goto(target.path, { waitUntil: "networkidle" });
    const createButton = page.getByRole("button", { name: target.button });
    await expect(createButton).toBeVisible();
    await expect(createButton).not.toHaveAttribute("aria-haspopup", "menu");
    await createButton.click();

    const workspace = page.locator('[data-core-document-workspace="true"]');
    try {
      await expect(workspace).toBeVisible({ timeout: 3_000 });
    } catch {
      await createButton.click();
    }

    const headingName = target.title === "入金伝票" ? "入金伝票作成" : `${target.title}作成`;
    await expect(page.getByRole("heading", { name: headingName })).toBeVisible();
    await expect(page.getByText("A4プレビュー")).toHaveCount(0);
    await expect(page.getByText("ライブプレビュー")).toHaveCount(0);
    await expect(page.getByText("印刷時の配置を確認できます")).toHaveCount(0);
    await expect(page.getByText("配送備考")).toHaveCount(0);
    await expect(page.getByText("社外向け文面")).toHaveCount(0);
    await expect(page.getByText("社内メモ")).toHaveCount(0);
    await expect(page.getByText("3件の明細行")).toHaveCount(0);
    await expect(page.getByText("8%軽減")).toHaveCount(0);
    await expect(page.getByText("単位（マスタ）")).toHaveCount(0);
    await expect(page.getByText("入数（マスタ）")).toHaveCount(0);
    await expect(page.getByText("単価（マスタ）")).toHaveCount(0);
    await expect(page.getByTestId("delivery-entry-workspace")).toBeVisible();
    await expect(page.getByText("明細一覧", { exact: true })).toBeVisible();
    for (const section of target.createSections) {
      await expect(page.getByText(section, { exact: true }).first()).toBeVisible();
    }
    for (const text of target.forbiddenList) {
      await expect(page.getByText(text, { exact: true })).toHaveCount(0);
    }
    await expect(page.getByText("小計")).toBeVisible();
    await expect(page.getByText("消費税 10%")).toBeVisible();
    await expect(page.getByText("消費税 8%")).toBeVisible();
    await expect(page.getByTestId("document-amount-footer")).toBeVisible();
    await expect(page.getByRole("button", { name: "保存" })).toBeVisible();
    await expect(page.getByRole("button", { name: "メール送信" })).toBeVisible();
    await expect(page.getByRole("button", { name: "FAX送信" })).toBeVisible();
    await expect(page.getByRole("button", { name: "コピー", exact: true })).toBeVisible();
    if (target.title === "納品書") {
      await expect(page.getByText("備考・メモ")).toBeVisible();
      await expect(page.getByText("納品時メモ")).toHaveCount(0);
      await expect(page.getByDisplayValue(/上記の通り納品いたしました/)).toBeVisible();
      await expect(page.getByDisplayValue(/ドライバーの方へ/)).toBeVisible();
      await expect(page.getByText("備考行を追加")).toBeVisible();
      await expect(page.getByTestId("line-header-code")).toHaveText("商品コード");
      await expect(page.getByTestId("line-header-tax-rate")).toHaveText("税率");
      await expect(page.getByTestId("line-code-0")).toHaveValue("4901234567890");
      await expect(page.getByTestId("line-unit-0")).toContainText("枚");
      await expect(page.getByTestId("line-tax-rate-0")).toContainText("10%");
      await expect(page.getByTestId("line-subtotal-0")).toContainText(/[¥￥]12,000/);
      await expect(page.getByTestId("document-total")).toContainText(/[¥￥]194,643/);
      await expect(page.getByDisplayValue("※午前納品希望 / 荷受担当へ事前連絡")).toBeVisible();
      await expect(page.getByText("B2 CSV")).toBeVisible();
      await expect(page.getByText("飛伝CSV")).toBeVisible();
      const lineMetrics = await page.evaluate(() => {
        const widthOf = (testId: string) => document.querySelector<HTMLElement>(`[data-testid="${testId}"]`)?.getBoundingClientRect().width ?? 0;
        const codeInput = document.querySelector<HTMLInputElement>('[data-testid="line-code-0"]');
        const actionHeader = document.querySelector<HTMLElement>('[data-testid="line-header-actions"]');
        return {
          drag: widthOf("line-header-drag"),
          no: widthOf("line-header-no"),
          code: widthOf("line-header-code"),
          product: widthOf("line-header-product"),
          tax: widthOf("line-header-tax-rate"),
          actions: actionHeader?.getBoundingClientRect().width ?? 0,
          codeFits: codeInput ? codeInput.scrollWidth <= codeInput.clientWidth + 1 : false,
        };
      });
      expect(lineMetrics.drag).toBeLessThanOrEqual(22);
      expect(lineMetrics.no).toBeLessThanOrEqual(22);
      expect(lineMetrics.code).toBeGreaterThanOrEqual(112);
      expect(lineMetrics.product).toBeGreaterThanOrEqual(720);
      expect(lineMetrics.tax).toBeLessThanOrEqual(46);
      expect(lineMetrics.actions).toBeLessThanOrEqual(44);
      expect(lineMetrics.codeFits).toBeTruthy();
    }

    const edgeDistance = await page.evaluate(() => {
      const sidebar = document.querySelector("aside");
      const workspace = document.querySelector('[data-slot="sheet-content"]');
      if (!sidebar || !workspace) return Number.POSITIVE_INFINITY;
      const sidebarRect = sidebar.getBoundingClientRect();
      const workspaceRect = workspace.getBoundingClientRect();
      return Math.abs(workspaceRect.left - sidebarRect.right);
    });
    expect(edgeDistance).toBeLessThanOrEqual(12);
    const rightEdgeDistance = await page.evaluate(() => {
      const workspace = document.querySelector('[data-slot="sheet-content"]');
      if (!workspace) return Number.POSITIVE_INFINITY;
      return Math.abs(window.innerWidth - workspace.getBoundingClientRect().right);
    });
    expect(rightEdgeDistance).toBeLessThanOrEqual(8);

    await page.screenshot({ path: `output/playwright/core-documents-redesign/${target.createShot}`, fullPage: true });
    if (target.title === "納品書") {
      await page.screenshot({ path: "output/playwright/core-documents-redesign/delivery-create-final.png", fullPage: true });
    }
    await page.getByRole("button", { name: "キャンセル" }).click();
  }
});

test("納品書詳細画面で配送情報と主要アクションを確認できる", async ({ page }) => {
  await page.goto("/core/deliveries");
  await expect(page.getByRole("heading", { name: "納品書" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "書類番号" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "取引先" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "納品先" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "納品日" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "アクション" })).toBeVisible();
  await expect(page.getByText("発行日")).toHaveCount(0);
  await page.waitForTimeout(500);
  await page.locator("tbody tr").first().click({ position: { x: 220, y: 18 } });

  await expect(page.getByText("納品書詳細")).toBeVisible();
  await expect(page.getByText("基本情報")).toBeVisible();
  await expect(page.getByText("納品先", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("納品先名")).toBeVisible();
  await expect(page.getByText("配送情報", { exact: true })).toBeVisible();
  await expect(page.getByLabel("配送業者")).toBeVisible();
  await expect(page.getByLabel("お問い合わせ番号")).toBeVisible();
  await expect(page.getByText("配送状況")).toHaveCount(0);
  await expect(page.getByText("通貨")).toHaveCount(0);
  await expect(page.getByText("配送備考")).toHaveCount(0);
  await expect(page.getByText("発行日")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "メール送信" })).toBeVisible();
  await expect(page.getByRole("button", { name: "FAX送信" })).toBeVisible();
  await expect(page.getByRole("button", { name: "コピー" })).toBeVisible();
  await page.screenshot({ path: "output/playwright/core-ui-redesign/19_delivery_detail.png", fullPage: true });
});

test("明細の表示順は保存ペイロードとAPIでline_noに保持する", async () => {
  const formSource = readFileSync("src/components/core/forms/DocumentEntryForm.tsx", "utf8");
  const schemaSource = readFileSync("src/lib/coreDocumentFormSchema.ts", "utf8");
  const apiSource = readFileSync("src/pages/core/api/documents/save.ts", "utf8");

  expect(schemaSource).toContain("line_no");
  expect(formSource).toContain("line_no: index + 1");
  expect(apiSource).toContain("Number(line.line_no ?? index + 1)");
});
