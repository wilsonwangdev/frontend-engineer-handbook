import { describe, it, expect } from "vitest";
import { frontmatterSchema, tierSchema } from "./content-schema";

describe("tierSchema", () => {
  it("accepts known tier values", () => {
    expect(tierSchema.parse("essential")).toBe("essential");
    expect(tierSchema.parse("understand")).toBe("understand");
    expect(tierSchema.parse("delegatable")).toBe("delegatable");
  });

  it("rejects unknown tier values", () => {
    expect(() => tierSchema.parse("optional")).toThrow();
  });
});

describe("frontmatterSchema", () => {
  const valid = {
    title: "浏览器渲染管线",
    chapter: 2,
    description: "从 HTML 到像素",
    tier: "essential",
    lastVerified: "2026-05-14",
  } as const;

  it("accepts a minimal valid frontmatter", () => {
    expect(frontmatterSchema.parse(valid)).toMatchObject(valid);
  });

  it("rejects missing title", () => {
    expect(() => frontmatterSchema.parse({ ...valid, title: "" })).toThrow();
  });

  it("rejects out-of-range chapter", () => {
    expect(() => frontmatterSchema.parse({ ...valid, chapter: 11 })).toThrow();
    expect(() => frontmatterSchema.parse({ ...valid, chapter: -1 })).toThrow();
  });

  it("rejects malformed lastVerified date", () => {
    expect(() => frontmatterSchema.parse({ ...valid, lastVerified: "May 14, 2026" })).toThrow();
  });

  it("accepts paths and prerequisites", () => {
    const result = frontmatterSchema.parse({
      ...valid,
      prerequisites: ["/chapter-02/http"],
      paths: {
        sequential: 12,
        practice: [{ project: "mini-framework", context: "对比" }],
      },
    });
    expect(result.prerequisites).toEqual(["/chapter-02/http"]);
    expect(result.paths?.practice?.[0]?.project).toBe("mini-framework");
  });

  it("coerces a Date object (from YAML parsing) to ISO date string", () => {
    const result = frontmatterSchema.parse({
      ...valid,
      lastVerified: new Date("2026-05-19T00:00:00.000Z"),
    });
    expect(result.lastVerified).toBe("2026-05-19");
  });
});
