import { test, expect } from "@playwright/test";

const openSearch = (page: import("@playwright/test").Page) =>
  page.locator('button[aria-label*="搜索"]').click();

test.describe("Search", () => {
  test("opens command palette via button click", async ({ page }) => {
    await page.goto("/chapter-02/http");
    await openSearch(page);
    await expect(page.locator('input[aria-label="搜索"]')).toBeVisible();
  });

  test("finds content with English query", async ({ page }) => {
    await page.goto("/chapter-02/http");
    await openSearch(page);
    const input = page.locator('input[aria-label="搜索"]');
    await expect(input).toBeVisible();
    // Type slowly to allow filtering
    await input.pressSequentially("HTTP", { delay: 50 });
    // Wait for filtered results to appear
    await expect(page.locator('[role="option"]').first()).toBeVisible({ timeout: 10000 });
    const count = await page.locator('[role="option"]').count();
    expect(count).toBeGreaterThan(0);
  });

  test("navigates to result on Enter", async ({ page }) => {
    await page.goto("/chapter-02/url");
    await openSearch(page);
    const input = page.locator('input[aria-label="搜索"]');
    await expect(input).toBeVisible();
    await input.pressSequentially("HTTP", { delay: 50 });
    await expect(page.locator('[role="option"]').first()).toBeVisible({ timeout: 10000 });
    await page.keyboard.press("Enter");
    await page.waitForURL(/\/chapter-02\/http/);
  });

  test("closes with Escape", async ({ page }) => {
    await page.goto("/chapter-02/http");
    await openSearch(page);
    await expect(page.locator('input[aria-label="搜索"]')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator('input[aria-label="搜索"]')).not.toBeVisible();
  });

  test("shows empty state when no results", async ({ page }) => {
    await page.goto("/chapter-02/http");
    await openSearch(page);
    const input = page.locator('input[aria-label="搜索"]');
    await expect(input).toBeVisible();
    // Wait for index to load first
    await page.waitForTimeout(2000);
    await input.fill("xyznonexistent12345");
    await expect(page.getByText("无结果")).toBeVisible({ timeout: 5000 });
  });
});
