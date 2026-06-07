import { describe, it, expect } from "vitest";
import { tokenize, search, type IndexEntry } from "./search";

describe("tokenize", () => {
  it("splits English words by non-word characters", () => {
    expect(tokenize("hello world")).toEqual(["hello", "world"]);
  });

  it("lowercases English words", () => {
    expect(tokenize("React NextJS")).toEqual(["react", "nextjs"]);
  });

  it("handles CJK single characters + bigrams", () => {
    const result = tokenize("动画");
    expect(result).toContain("动");
    expect(result).toContain("画");
    expect(result).toContain("动画"); // bigram
  });

  it("handles mixed CJK and English", () => {
    const result = tokenize("CSS 动画");
    expect(result).toEqual(["css", "动", "动画", "画"]);
  });

  it("skips punctuation and spaces", () => {
    const result = tokenize("hello, world!");
    expect(result).toEqual(["hello", "world"]);
  });

  it("handles empty string", () => {
    expect(tokenize("")).toEqual([]);
  });

  it("handles Chinese-only", () => {
    const result = tokenize("前端工程师手册");
    expect(result.length).toBeGreaterThan(3); // characters + bigrams
    expect(result).toContain("前端");
    expect(result).toContain("工程");
  });
});

describe("search", () => {
  const entries: IndexEntry[] = [
    {
      title: "动画与 View Transitions",
      description: "CSS 动画、transition、View Transitions API",
      url: "/chapter-03/animations",
      type: "section",
      text: "动画 transition animation View Transitions 浏览器原生跨状态过渡",
    },
    {
      title: "JavaScript 语言核心",
      description: "作用域、闭包、原型链",
      url: "/chapter-04/js-core",
      type: "section",
      text: "闭包 closure 作用域 this 绑定",
    },
    {
      title: "CJK",
      description: "中日韩统一表意文字",
      url: "/glossary#cjk",
      type: "term",
      text: "Chinese Japanese Korean CJK",
    },
    {
      title: "私有条目",
      description: "private 字段与 TypeScript",
      url: "/glossary#private-field",
      type: "term",
      text: "private field private #field",
    },
  ];

  it("returns empty array for empty query", () => {
    expect(search("", entries)).toEqual([]);
    expect(search("   ", entries)).toEqual([]);
  });

  it("finds exact title match with highest priority", () => {
    const result = search("CJK", entries);
    expect(result[0]!.url).toBe("/glossary#cjk");
  });

  it("finds Chinese query across title and text", () => {
    const result = search("动画", entries);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]!.url).toBe("/chapter-03/animations");
  });

  it("finds English query in description and text", () => {
    const result = search("transition", entries);
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((r) => r.url === "/chapter-03/animations")).toBe(true);
  });

  it("ranks exact title match above content match", () => {
    // Add a second entry that mentions "CJK" in text but not title
    const extended = [
      ...entries,
      {
        title: "其他页面",
        description: "something about CJK somewhere",
        url: "/other",
        type: "section",
        text: "CJK appears here too but not in title",
      } as IndexEntry,
    ];
    const result = search("CJK", extended);
    expect(result[0]!.url).toBe("/glossary#cjk"); // exact title match wins
  });

  it("handles no matches gracefully", () => {
    expect(search("xyznonexistent", entries)).toEqual([]);
  });

  it("finds Chinese bigram in text", () => {
    const result = search("闭包", entries);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]!.url).toBe("/chapter-04/js-core");
  });
});
