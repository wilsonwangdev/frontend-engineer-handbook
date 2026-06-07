/**
 * PageTOC E2E 测试
 *
 * 验证跨页面导航时 TOC 正确更新（不残留旧页标题）。
 * 桌面端视口才显示 TOC（xl:block），移动端隐藏。
 */
import { test, expect } from "@playwright/test";

test.describe("PageTOC", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("shows correct headings on initial page load", async ({ page }) => {
    await page.goto("/chapter-02/http");
    const toc = page.locator('nav[aria-label="页面目录"]');
    await expect(toc).toBeVisible();

    const links = toc.locator("a");
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // All headings should be from the HTTP page
    const texts = await links.allTextContents();
    expect(texts.some((t) => t.includes("请求"))).toBe(true);
  });

  test("updates correctly after SPA navigation", async ({ page }) => {
    await page.goto("/chapter-03/semantic-html");

    // Wait for TOC to appear
    const toc = page.locator('nav[aria-label="页面目录"]');
    await expect(toc).toBeVisible();

    // Get headings from page 1
    const page1Texts = await toc.locator("a").allTextContents();
    expect(page1Texts.length).toBeGreaterThan(0);

    // Navigate to a different page via sidebar
    await page.locator('.handbook-aside a[href="/chapter-02/storage"]').click();
    await page.waitForURL("/chapter-02/storage");

    // Wait for TOC to update
    await expect(toc).toBeVisible();
    const page2Texts = await toc.locator("a").allTextContents();

    // Should have headings from the storage page, not semantic-html
    expect(page2Texts.length).toBeGreaterThan(0);
    expect(page2Texts).not.toEqual(page1Texts);

    // Verify at least one unique heading from the target page
    const hasStorageHeading = page2Texts.some(
      (t) => t.includes("Storage") || t.includes("存储") || t.includes("Cookie"),
    );
    expect(hasStorageHeading).toBe(true);
  });

  test("clicking TOC link scrolls to target heading", async ({ page }) => {
    await page.goto("/chapter-02/http");

    const toc = page.locator('nav[aria-label="页面目录"]');
    await expect(toc).toBeVisible();

    // Get a link to a heading mid-page
    const links = toc.locator("a");
    const count = await links.count();
    if (count < 3) return; // skip if too few headings

    // Click the 3rd link
    const thirdLink = links.nth(2);
    const href = await thirdLink.getAttribute("href");
    expect(href).toBeTruthy();

    await thirdLink.click();

    // Wait for smooth scroll to finish
    await page.waitForTimeout(500);
    const afterScroll = await page.evaluate(() => window.scrollY);

    // Should have scrolled down (unless already at the bottom)
    expect(afterScroll).toBeGreaterThan(0);
  });
});
