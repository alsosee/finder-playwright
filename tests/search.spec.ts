import { test, expect } from "@playwright/test";

test.use({
  ignoreHTTPSErrors: true,
});

test("search", async ({ page }) => {
  await page.goto("/");

  const search = page.getByRole("searchbox");
  const breadcrumbs = page.getByRole("menubar", { name: "breadcrumbs" });
  const home = breadcrumbs.getByRole("menuitem").filter({ hasText: "Home" });
  const first = page.getByRole("menu").getByRole("menuitem").first();

  await expect(search).toBeVisible();
  await search.focus();
  await page.keyboard.insertText("Dungeon");

  await expect(page).toHaveURL("/search?q=Dungeon");
  await expect(page).toHaveTitle(/Search: Dungeon/);

  // Search query in breadcrumb
  await expect(home).toBeVisible();
  await expect(home).toHaveAttribute("href", "/");
  await expect(breadcrumbs).toContainText("Search: Dungeon");

  // Search results
  await expect(first).toContainText("Dungeons & Dragons");
  await expect(first).toHaveAttribute(
    "href",
    "/Games/Tabletop/Dungeons & Dragons",
  );
  await expect(first).toHaveAttribute("class", "has-image");
});

test("search go back to root", async ({ page }) => {
  await page.goto("/");

  const search = page.getByRole("searchbox");
  await search.focus();
  await page.keyboard.insertText("Dungeon");

  await expect(page).toHaveURL("/search?q=Dungeon");

  await page.goBack();

  await expect(page).toHaveURL("/");
  await expect(page).toHaveTitle(/Also, see/);
  await expect(
    page.getByRole("menubar", { name: "breadcrumbs" }),
  ).not.toContainText("Search: Dungeon");
  await expect(page.getByRole("menu")).not.toContainText("Dungeons & Dragons");
});

test("search load, then erase", async ({ page }) => {
  await page.goto("/search?q=Dungeon");

  const search = page.getByRole("searchbox");
  const breadcrumbs = page.getByRole("menubar", { name: "breadcrumbs" });
  const first = page.getByRole("menu").getByRole("menuitem").first();

  await expect(search).toHaveValue("Dungeon");
  await expect(page).toHaveTitle(/Search: Dungeon/);
  await expect(breadcrumbs).toContainText("Search: Dungeon");
  await expect(first).toContainText("Dungeons & Dragons");

  await search.focus();
  await search.fill("");

  await expect(page).toHaveURL("/");
  await expect(page).toHaveTitle(/Also, see/);
  await expect(breadcrumbs).not.toContainText("Search: Dungeon");
  await expect(first).not.toContainText("Dungeons & Dragons");
});

test("search, search again, then go back", async ({ page }) => {
  await page.goto("/search?q=Dungeon");

  const search = page.getByRole("searchbox");
  const breadcrumbs = page.getByRole("menubar", { name: "breadcrumbs" });
  const first = page.getByRole("menu").getByRole("menuitem").first();

  await expect(page).toHaveTitle(/Search: Dungeon/);
  await expect(breadcrumbs).toContainText("Search: Dungeon");

  await search.focus();
  await search.fill("John Wick");

  await expect(page).toHaveURL("/search?q=John%20Wick");
  await expect(page).toHaveTitle(/Search: John Wick/);
  await expect(breadcrumbs).toContainText("Search: John Wick");
  await expect(first).toContainText("John Wick");

  await page.goBack();

  await expect(page).toHaveURL("/search?q=Dungeon");
  await expect(page).toHaveTitle(/Search: Dungeon/);
  await expect(breadcrumbs).toContainText("Search: Dungeon");
  await expect(first).toContainText("Dungeons & Dragons");
});
