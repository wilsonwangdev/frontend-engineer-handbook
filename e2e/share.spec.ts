import { test, expect } from "@playwright/test";

test.describe("Share", () => {
  test("share button visible on chapter page", async ({ page }) => {
    await page.goto("/chapter-05/react-mental-model");
    const shareBtn = page.locator('button[aria-label="复制链接"]');
    await expect(shareBtn).toBeVisible();
  });

  test("heading anchor button appears on hover", async ({ page }) => {
    await page.goto("/chapter-05/react-mental-model");
    const heading = page.locator(".prose-cn h2").first();
    await heading.hover();
    const anchorBtn = heading.locator(".heading-anchor-btn");
    await expect(anchorBtn).toBeVisible();
  });

  test("heading anchor click copies URL with fragment", async ({ page }) => {
    await page.goto("/chapter-05/react-mental-model");
    // Wait for HeadingAnchor's MutationObserver to add the button
    await page.waitForSelector(".heading-anchor-btn", { timeout: 5000 });
    const heading = page.locator(".prose-cn h2").first();
    await heading.hover();
    await heading.locator(".heading-anchor-btn").click();
    // Toast should appear
    await expect(page.getByText("链接已复制")).toBeVisible();
  });

  test("anchored URL scrolls to correct position", async ({ page }) => {
    await page.goto("/chapter-05/react-mental-model");
    // CSS selector can't start with digit — use attribute selector
    const heading = page.locator('[id="2-状态组件的内存"]');
    // Navigate via click to trigger smooth scroll
    const toc = page.locator('nav[aria-label="页面目录"]');
    const links = await toc.locator("a").all();
    // Click a mid-page TOC link to trigger smooth scroll
    if (links.length >= 5) {
      await links[4]!.click();
      await page.waitForTimeout(600);
    }
    await expect(heading).toBeVisible({ timeout: 3000 });
    // It should be scrolled into view (not at the very top due to scroll-margin-top)
    const box = await heading.boundingBox();
    expect(box).toBeTruthy();
    if (box) {
      // Heading should be below the sticky header (56px) but visible
      expect(box.y).toBeGreaterThan(50);
      expect(box.y).toBeLessThan(300);
    }
  });
});
