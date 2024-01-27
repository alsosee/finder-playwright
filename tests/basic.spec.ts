import { test, expect } from "@playwright/test";

test.use({
  ignoreHTTPSErrors: true,
});

test("has title and Games folder", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Also, see/);

  // Body data-view attribute
  const body = expect(page.locator("xpath=//body"));
  await body.toHaveAttribute("data-view", "icons");

  // Games folder link
  const link = expect(page.getByRole("menuitem", { name: "Games" }));
  await link.toBeVisible();
  await link.toHaveAttribute("href", "/Games/");
  await link.toHaveAttribute("class", "folder");

  // Home in breadcrumb
  await expect(
    page
      .getByRole("menubar", { name: "breadcrumbs" })
      .filter({ hasText: "Home" }),
  ).toBeVisible();
});
