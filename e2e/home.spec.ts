import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("home page", () => {
  test("renders title and learning path cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "前端工程师手册" })).toBeVisible();
    await expect(page.getByText("系统学习")).toBeVisible();
    await expect(page.getByText("按需查阅")).toBeVisible();
    await expect(page.getByText("实践驱动")).toBeVisible();
  });

  test("has no axe accessibility violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
