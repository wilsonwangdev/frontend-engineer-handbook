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

  test("CTA「开始阅读」navigates to chapter-00", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "开始阅读" }).click();
    await expect(page).toHaveURL(/chapter-00/);
    await expect(page.getByRole("heading", { name: "如何使用本手册", level: 1 })).toBeVisible();
  });

  test("CTA「AI 时代能力地图」navigates to chapter-01", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "AI 时代能力地图" }).click();
    await expect(page).toHaveURL(/chapter-01/);
    await expect(
      page.getByRole("heading", { name: "AI 时代前端工程师的能力地图", level: 1 }),
    ).toBeVisible();
  });

  test("PathCard A navigates and activates beginner reading path", async ({ page }) => {
    await page.goto("/");
    // Click the PathCard A card
    await page.locator("text=系统学习").first().click();
    await expect(page).toHaveURL(/chapter-00/);

    // PathSidebar should be active showing the linear sequence
    const pathNav = page.getByRole("navigation", { name: /阅读路径/ });
    await expect(pathNav).toBeVisible({ timeout: 5000 });
    await expect(pathNav.getByText("系统学习")).toBeVisible();
  });

  test("PathCard B navigates and activates intermediate reading path", async ({ page }) => {
    await page.goto("/");
    await page.locator("text=按需查阅").first().click();
    await expect(page).toHaveURL(/chapter-00/);

    const pathNav = page.getByRole("navigation", { name: /阅读路径/ });
    await expect(pathNav).toBeVisible({ timeout: 5000 });
    await expect(pathNav.getByText("按需查阅")).toBeVisible();
  });

  test("PathCard C is not clickable (disabled)", async ({ page }) => {
    await page.goto("/");
    // PathCard C should render as a plain div, not a link
    const pathCardC = page.locator("text=实践驱动").first();
    await expect(pathCardC).toBeVisible();
    // It should not be inside an anchor
    const link = page.getByRole("link", { name: /实践驱动/ });
    await expect(link).not.toBeVisible();
  });

  test("feature cards are visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("站内搜索")).toBeVisible();
    await expect(page.getByText("术语浮窗")).toBeVisible();
    await expect(page.getByText("可调试 Playground")).toBeVisible();
    await expect(page.getByText("暗色阅读")).toBeVisible();
  });

  test("chapter plan section lists published chapters", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("章节规划")).toBeVisible();
    // Should show chapter entries
    await expect(page.getByText("如何使用本手册")).toBeVisible();
    await expect(page.getByText("React 与 Next.js")).toBeVisible();
    // Unpublished chapters should show "即将推出"
    await expect(page.getByText("工程化与构建")).toBeVisible();
  });

  test("has no axe accessibility violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
