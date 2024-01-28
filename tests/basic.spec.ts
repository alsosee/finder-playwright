import { test, expect } from "@playwright/test";

test.use({
  ignoreHTTPSErrors: true,
});

test("has title and Games folder", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Also, see/);

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

test("remember view choice", async ({ page }) => {
  await page.goto("/");

  // Body data-view attribute
  const body = expect(page.locator("xpath=//body"));
  await body.toHaveAttribute("data-view", "icons");

  // Switch to list view
  const buttonList = page
    .getByRole("menuitem")
    .filter({ has: page.locator("xpath=//input[@value='list']") });
  await expect(buttonList).toBeVisible();
  await buttonList.click();
  await body.toHaveAttribute("data-view", "list");

  await page.reload();
  await body.toHaveAttribute("data-view", "list");

  // Switch to columns view
  const buttonColumns = page
    .getByRole("menuitem")
    .filter({ has: page.locator("xpath=//input[@value='columns']") });
  await expect(buttonColumns).toBeVisible();
  await buttonColumns.click();
  await body.toHaveAttribute("data-view", "columns");

  await page.reload();
  await body.toHaveAttribute("data-view", "columns");
});
