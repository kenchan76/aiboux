import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1980, height: 1080 } });

test("public preview has CSS and shadcn layout applied", async ({ page }) => {
  const failedRequests: string[] = [];
  const badAssetResponses: string[] = [];

  page.on("requestfailed", (request) => {
    const url = request.url();
    if (url.includes("_astro") || url.endsWith(".css") || url.endsWith(".js")) {
      failedRequests.push(url);
    }
  });

  page.on("response", (response) => {
    const url = response.url();
    if (
      (url.includes("_astro") || url.endsWith(".css") || url.endsWith(".js")) &&
      response.status() >= 400
    ) {
      badAssetResponses.push(`${response.status()} ${url}`);
    }
  });

  await page.goto("/core/deliveries?preview=delivery-detail&document=N20260530-01", { waitUntil: "networkidle" });

  expect(failedRequests, `failed asset requests: ${failedRequests.join("\n")}`).toEqual([]);
  expect(badAssetResponses, `bad asset responses: ${badAssetResponses.join("\n")}`).toEqual([]);

  const styleState = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const links = Array.from(document.querySelectorAll("a")).slice(0, 20).map((anchor) => {
      const style = getComputedStyle(anchor);
      return {
        text: anchor.textContent?.trim(),
        color: style.color,
        textDecoration: style.textDecorationLine,
      };
    });

    const buttons = Array.from(document.querySelectorAll("button")).slice(0, 20).map((button) => {
      const style = getComputedStyle(button);
      return {
        text: button.textContent?.trim(),
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        height: button.getBoundingClientRect().height,
      };
    });

    const sidebar = document.querySelector("aside")?.getBoundingClientRect();
    const hasPlainBlueLinks = links.some(
      (link) => link.color === "rgb(0, 0, 238)" || link.textDecoration.includes("underline"),
    );
    const hasStyledButton = buttons.some((button) => {
      const radius = Number.parseFloat(button.borderRadius);
      return Number.isFinite(radius) && radius >= 4 && button.height >= 24;
    });

    return {
      fontFamily: body.fontFamily,
      stylesheets: Array.from(document.styleSheets).length,
      hasPlainBlueLinks,
      hasStyledButton,
      sidebarWidth: sidebar?.width ?? 0,
    };
  });

  expect(styleState.stylesheets).toBeGreaterThan(0);
  expect(styleState.hasPlainBlueLinks).toBeFalsy();
  expect(styleState.hasStyledButton).toBeTruthy();
  expect(styleState.sidebarWidth).toBeGreaterThan(180);

  await expect(page.getByRole("heading", { name: "納品書詳細" })).toBeVisible();
  await expect(page.getByTestId("delivery-detail-workspace")).toBeVisible();
});
