import { test, expect } from "@playwright/test";

test.describe("reading path", () => {
  test("landing page PathCard A navigates to chapter-00 with path active", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("系统学习")).toBeVisible();

    // Click PathCard A — it sets localStorage + navigates
    await page.locator("text=系统学习").first().click();
    await expect(page).toHaveURL(/chapter-00/);

    // PathSidebar should be visible (linear sequence, not chapter tree)
    const pathNav = page.getByRole("navigation", { name: /阅读路径/ });
    await expect(pathNav).toBeVisible({ timeout: 5000 });

    // Beginner path includes all ch2 sections
    await expect(pathNav.getByText("HTTP")).toBeVisible();
    await expect(pathNav.getByText("URL")).toBeVisible();

    // Chapter tree sidebar (in aside.handbook-aside) should be hidden
    const sidebar = page.locator(".handbook-aside nav[aria-label='章节导航']");
    await expect(sidebar).not.toBeVisible();
  });

  test("PathSidebar shows progress and numbered sequence", async ({ page }) => {
    await page.goto("/chapter-02/http");
    await page.evaluate(() => localStorage.setItem("handbook:reading-path", "beginner"));
    await page.reload();

    const pathNav = page.getByRole("navigation", { name: /阅读路径/ });
    await expect(pathNav).toBeVisible({ timeout: 5000 });

    // Header shows path label and total count
    await expect(pathNav.getByText("系统学习")).toBeVisible();
    await expect(pathNav.getByText(/\/\d+$/)).toBeVisible();

    // Progress bar visible below breadcrumbs (use nth to skip breadcrumbs' not-prose mb-6)
    const progressBar = page.locator("article .not-prose.mb-6").nth(1);
    await expect(progressBar.getByText("A 系统学习")).toBeVisible({ timeout: 5000 });
    await expect(progressBar.getByText(/第 \d+\/\d+ 节/)).toBeVisible();
  });

  test("ReadingPathSelector dropdown switches paths", async ({ page }) => {
    await page.goto("/chapter-02/http");
    await page.evaluate(() => localStorage.setItem("handbook:reading-path", "beginner"));
    await page.reload();

    // Verify beginner path is active
    const pathNav = page.getByRole("navigation", { name: /阅读路径/ });
    await expect(pathNav).toBeVisible({ timeout: 5000 });

    // Open ReadingPathSelector dropdown (use button role to avoid matching nav)
    const selectorBtn = page.getByRole("button", { name: /阅读路径/ });
    await selectorBtn.click();

    // Switch to B 按需查阅
    const menu = page.getByRole("menu", { name: "阅读路径" });
    await menu.getByText("B 按需查阅").click();

    // Sidebar should update to intermediate path
    await expect(pathNav.getByText("按需查阅")).toBeVisible({ timeout: 3000 });

    // localStorage should be updated
    const stored = await page.evaluate(() => localStorage.getItem("handbook:reading-path"));
    expect(stored).toBe("intermediate");
  });

  test("deselecting path returns to full chapter tree", async ({ page }) => {
    await page.goto("/chapter-02/http");
    await page.evaluate(() => localStorage.setItem("handbook:reading-path", "beginner"));
    await page.reload();

    // PathSidebar visible
    await expect(page.getByRole("navigation", { name: /阅读路径/ })).toBeVisible({ timeout: 5000 });

    // Open selector and choose "完整目录"
    const selectorBtn = page.getByRole("button", { name: /阅读路径/ });
    await selectorBtn.click();
    const menu = page.getByRole("menu", { name: "阅读路径" });
    await menu.getByRole("menuitemradio", { name: /完整目录/ }).click();

    // PathSidebar should disappear
    await expect(page.getByRole("navigation", { name: /阅读路径/ })).not.toBeVisible();

    // Chapter tree sidebar should be visible in the aside
    const sidebar = page.locator(".handbook-aside nav[aria-label='章节导航']");
    await expect(sidebar).toBeVisible();

    // localStorage should be cleared
    const stored = await page.evaluate(() => localStorage.getItem("handbook:reading-path"));
    expect(stored).toBeNull();
  });

  test("reading path persists across page refresh", async ({ page }) => {
    await page.goto("/chapter-02/http");
    await page.evaluate(() => localStorage.setItem("handbook:reading-path", "beginner"));
    await page.reload();

    // Verify path is active after reload
    const pathNav = page.getByRole("navigation", { name: /阅读路径/ });
    await expect(pathNav).toBeVisible({ timeout: 5000 });

    // Navigate to another section in the path
    await pathNav.getByText("URL").click();
    await expect(page).toHaveURL(/chapter-02\/url/);

    // PathSidebar still visible on new page
    await expect(page.getByRole("navigation", { name: /阅读路径/ })).toBeVisible({ timeout: 5000 });
    await expect(pathNav.getByText("系统学习")).toBeVisible();
  });

  test("beginner path includes foundational sections, excludes advanced ones", async ({ page }) => {
    await page.goto("/chapter-02/http");
    await page.evaluate(() => localStorage.setItem("handbook:reading-path", "beginner"));
    await page.reload();

    const pathNav = page.getByRole("navigation", { name: /阅读路径/ });
    await expect(pathNav).toBeVisible({ timeout: 5000 });

    // Beginner path should include basic sections from all chapters
    await expect(pathNav.getByText("HTTP")).toBeVisible();
    await expect(pathNav.getByText("JavaScript 语言核心")).toBeVisible();
    await expect(pathNav.getByText("React 心智模型")).toBeVisible();

    // Beginner path should NOT include advanced-only sections
    await expect(pathNav.getByText("并发渲染与 Suspense")).not.toBeVisible();
    await expect(pathNav.getByText("服务端组件与客户端组件")).not.toBeVisible();
  });

  test("senior path includes all sections", async ({ page }) => {
    await page.goto("/chapter-02/http");
    await page.evaluate(() => localStorage.setItem("handbook:reading-path", "senior"));
    await page.reload();

    const pathNav = page.getByRole("navigation", { name: /阅读路径/ });
    await expect(pathNav).toBeVisible({ timeout: 5000 });

    // Senior path should include advanced sections
    await expect(pathNav.getByText("并发渲染与 Suspense")).toBeVisible();
    await expect(pathNav.getByText("服务端组件与客户端组件")).toBeVisible();
  });

  test("PathProgress shows correct position for current page", async ({ page }) => {
    await page.goto("/chapter-04/js-core");
    await page.evaluate(() => localStorage.setItem("handbook:reading-path", "beginner"));
    await page.reload();

    // Progress bar is the second .not-prose.mb-6 in article (first is breadcrumbs)
    const progressBar = page.locator("article .not-prose.mb-6").nth(1);
    await expect(progressBar).toBeVisible({ timeout: 5000 });

    await expect(progressBar.getByText("A 系统学习")).toBeVisible();

    const progressText = await progressBar.getByText(/第 \d+\/\d+ 节/).textContent();
    const match = progressText?.match(/第 (\d+)\/(\d+) 节/);
    expect(match).not.toBeNull();
    const m = match!;
    const pos = parseInt(m[1]!);
    const total = parseInt(m[2]!);
    expect(pos).toBeGreaterThan(1);
    expect(total).toBeGreaterThan(10);
  });

  // TODO: re-enable after fixing sidebar truncation in narrow viewports
  test.skip("all three path labels fit without wrapping", async ({ page }) => {
    for (const path of ["beginner", "intermediate", "senior"] as const) {
      await page.goto("/chapter-02/http");
      await page.evaluate((p) => localStorage.setItem("handbook:reading-path", p), path);
      await page.reload();

      const pathNav = page.getByRole("navigation", { name: /阅读路径/ });
      await expect(pathNav).toBeVisible({ timeout: 5000 });

      const headerLabel = pathNav.locator("span.whitespace-nowrap").first();
      const headerOverflow = await headerLabel.evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(headerOverflow).toBe(false);

      const items = pathNav.locator("ol li a span.whitespace-nowrap");
      const count = await items.count();
      for (let i = 0; i < count; i++) {
        const wraps = await items.nth(i).evaluate((el) => {
          const range = document.createRange();
          range.selectNodeContents(el);
          const rects = range.getClientRects();
          return rects.length > 1;
        });
        if (wraps) {
          const text = await items.nth(i).textContent();
          throw new Error(`"${text}" wraps in ${path} path sidebar`);
        }
      }
    }
  });
});
