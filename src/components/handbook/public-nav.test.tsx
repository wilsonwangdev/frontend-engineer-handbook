import { describe, it, expect } from "vitest";
import { NAV_ITEMS } from "./public-nav";

describe("NAV_ITEMS", () => {
  it("contains all expected public pages", () => {
    const labels = NAV_ITEMS.map((item) => item.label);
    expect(labels).toContain("术语表");
    expect(labels).toContain("试验场");
    expect(labels).toContain("精选资源");
    expect(labels).toContain("常见问题");
  });

  it("all items have valid hrefs", () => {
    for (const item of NAV_ITEMS) {
      expect(item.href).toBeTruthy();
      expect(item.href.startsWith("/")).toBe(true);
    }
  });

  it("no items are disabled", () => {
    for (const item of NAV_ITEMS) {
      expect(item.disabled).toBeFalsy();
    }
  });

  it("all labels are reasonably short", () => {
    for (const item of NAV_ITEMS) {
      expect(item.label.length).toBeGreaterThanOrEqual(2);
      expect(item.label.length).toBeLessThanOrEqual(6);
    }
  });

  it("has no more than 4 items (SPEC-0015 limit)", () => {
    expect(NAV_ITEMS.length).toBeLessThanOrEqual(4);
  });

  it("no duplicate hrefs", () => {
    const hrefs = NAV_ITEMS.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
