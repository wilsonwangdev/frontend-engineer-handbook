import { test, expect } from "@playwright/test";

test.describe("Search", () => {
  test("opens command palette via button click", async ({ page }) => {
    await page.goto("/chapter-02/http");
    await page.locator('[data-testid="search-trigger"]').click();
    await expect(page.locator('[aria-label="搜索"]')).toBeVisible();
  });

  test("closes with Escape", async ({ page }) => {
    await page.goto("/chapter-02/http");
    await page.locator('[data-testid="search-trigger"]').click();
    await expect(page.locator('[aria-label="搜索"]')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator('[aria-label="搜索"]')).not.toBeVisible();
  });
});
