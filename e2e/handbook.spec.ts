import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("handbook chapters", () => {
  test("chapter 0 renders title, frontmatter, and content", async ({ page }) => {
    await page.goto("/chapter-00");
    await expect(page.getByRole("heading", { name: "如何使用本手册", level: 1 })).toBeVisible();
    await expect(page.getByText("第 0 章")).toBeVisible();
    await expect(page.getByText("必学").first()).toBeVisible();
    await expect(page.getByText("你是谁").first()).toBeVisible();
    await expect(page.getByText("三种使用方式").first()).toBeVisible();
  });

  test("chapter 1 renders the AI delegation table", async ({ page }) => {
    await page.goto("/chapter-01");
    await expect(
      page.getByRole("heading", { name: "AI 时代前端工程师的能力地图", level: 1 }),
    ).toBeVisible();
    await expect(page.getByText("Tier 1：完全委托")).toBeVisible();
    await expect(page.getByText("Tier 4：AI 辅助")).toBeVisible();
    await expect(page.getByText("永不委托")).toBeVisible();
  });

  test("sidebar lists both chapters and supports navigation", async ({ page }) => {
    await page.goto("/chapter-00");
    const sidebar = page.getByRole("navigation", { name: "章节导航" }).first();
    await expect(sidebar.getByRole("link", { name: /如何使用本手册/ })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: /AI 时代前端工程师的能力地图/ })).toBeVisible();
    await sidebar.getByRole("link", { name: /AI 时代前端工程师的能力地图/ }).click();
    await expect(page).toHaveURL(/chapter-01/);
  });

  test("prev/next navigation works between chapters", async ({ page }) => {
    await page.goto("/chapter-00");
    await page.getByRole("link", { name: /下一节.*AI 时代前端工程师/ }).click();
    await expect(page).toHaveURL(/chapter-01/);
    await page.getByRole("link", { name: /上一节.*如何使用本手册/ }).click();
    await expect(page).toHaveURL(/chapter-00/);
  });

  test("chapter pages have no axe accessibility violations", async ({ page }) => {
    await page.goto("/chapter-00");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
