import { describe, it, expect } from "vitest";
import { NAV_ITEMS } from "./public-nav";

describe("NAV_ITEMS", () => {
  it("contains all expected public pages", () => {
    const labels = NAV_ITEMS.map((item) => item.label);
    expect(labels).toContain("术语");
    expect(labels).toContain("示例");
    expect(labels).toContain("资源");
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

  it("all labels have consistent length", () => {
    const lengths = new Set(NAV_ITEMS.map((item) => item.label.length));
    // All labels should be the same length for visual rhythm
    expect(lengths.size).toBe(1);
  });

  it("has no more than 4 items (SPEC-0015 limit)", () => {
    expect(NAV_ITEMS.length).toBeLessThanOrEqual(4);
  });

  it("no duplicate hrefs", () => {
    const hrefs = NAV_ITEMS.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
