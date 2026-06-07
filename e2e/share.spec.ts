import { test, expect } from "@playwright/test";

test.describe("Share", () => {
  test("share button visible on chapter page", async ({ page }) => {
    await page.goto("/chapter-05/styling-solutions");
    await expect(page.getByRole("button", { name: /分享|复制链接/ })).toBeVisible();
  });

  test("heading anchor buttons exist on page", async ({ page }) => {
    await page.goto("/chapter-05/styling-solutions");
    await expect(page.locator('[data-testid="heading-anchor"]').first()).toBeVisible();
  });
});
