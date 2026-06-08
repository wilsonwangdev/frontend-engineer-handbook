import { describe, it, expect } from "vitest";
import { getPathAdjacent, getPathMeta } from "./reading-path";
import type { SectionMeta } from "./content";

const sections: SectionMeta[] = [
  { url: "/a", title: "A", description: "", tier: "essential" },
  { url: "/b", title: "B", description: "", tier: "essential" },
  { url: "/c", title: "C", description: "", tier: "understand" },
];

describe("getPathMeta", () => {
  it("returns correct labels", () => {
    expect(getPathMeta("beginner").label).toBe("系统学习");
    expect(getPathMeta("intermediate").tag).toBe("B");
    expect(getPathMeta("senior").desc).toContain("判断");
  });
});

describe("getPathAdjacent", () => {
  it("returns prev/next for middle item", () => {
    const result = getPathAdjacent(sections, "/b");
    expect(result.prev?.url).toBe("/a");
    expect(result.next?.url).toBe("/c");
    expect(result.index).toBe(2);
    expect(result.total).toBe(3);
  });

  it("returns null prev for first item", () => {
    const result = getPathAdjacent(sections, "/a");
    expect(result.prev).toBeNull();
    expect(result.next?.url).toBe("/b");
    expect(result.index).toBe(1);
  });

  it("returns null next for last item", () => {
    const result = getPathAdjacent(sections, "/c");
    expect(result.prev?.url).toBe("/b");
    expect(result.next).toBeNull();
    expect(result.index).toBe(3);
  });

  it("returns -1 index for unknown url", () => {
    const result = getPathAdjacent(sections, "/unknown");
    expect(result.index).toBe(-1);
    expect(result.prev).toBeNull();
    expect(result.next).toBeNull();
  });
});
