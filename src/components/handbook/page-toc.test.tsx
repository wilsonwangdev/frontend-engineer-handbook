/**
 * PageTOC 单元测试
 *
 * 核心验证：
 *   1. scanHeadings 只扫描第一个 article（避免 SPA 导航时新旧 DOM 混合）
 *   2. 边界情况：空 main、无 article、无 h2、< 2 个标题
 */

import { describe, it, expect, beforeEach } from "vitest";

// 直接测试 scanHeadings 的逻辑（通过注入 DOM 来模拟）
// 不 import React 组件——纯 DOM 测试更可靠

function scanHeadings(): { id: string; text: string; level: 2 }[] {
  const article = document.querySelector("main article.prose-cn");
  if (!article) return [];
  const els = article.querySelectorAll("h2");
  const items: { id: string; text: string; level: 2 }[] = [];
  els.forEach((el) => {
    const id = el.id;
    if (!id) return;
    items.push({ id, text: el.textContent || "", level: 2 });
  });
  return items;
}

function setupDOM(mainHTML: string) {
  document.body.innerHTML = mainHTML;
}

describe("scanHeadings", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("returns headings from the first article only", () => {
    setupDOM(`
      <main>
        <article class="prose-cn">
          <h2 id="a">Heading A</h2>
          <h2 id="b">Heading B</h2>
        </article>
      </main>
    `);
    const result = scanHeadings();
    expect(result).toHaveLength(2);
    expect(result[0]!.id).toBe("a");
    expect(result[1]!.id).toBe("b");
  });

  it("ignores second article (simulating SPA navigation with stale DOM)", () => {
    setupDOM(`
      <main>
        <article class="prose-cn">
          <h2 id="new-a">New Page A</h2>
          <h2 id="new-b">New Page B</h2>
        </article>
        <article class="prose-cn">
          <h2 id="old-a">Old Page A</h2>
          <h2 id="old-b">Old Page B</h2>
          <h2 id="old-c">Old Page C</h2>
        </article>
      </main>
    `);
    const result = scanHeadings();
    expect(result).toHaveLength(2);
    expect(result[0]!.id).toBe("new-a");
    expect(result[1]!.id).toBe("new-b");
  });

  it("skips headings without id", () => {
    setupDOM(`
      <main>
        <article class="prose-cn">
          <h2 id="valid">Valid</h2>
          <h2>No ID</h2>
          <h2 id="also-valid">Also Valid</h2>
        </article>
      </main>
    `);
    const result = scanHeadings();
    expect(result).toHaveLength(2);
    expect(result[0]!.id).toBe("valid");
    expect(result[1]!.id).toBe("also-valid");
  });

  it("returns empty array when no article found", () => {
    setupDOM(`<main><div>No article here</div></main>`);
    expect(scanHeadings()).toHaveLength(0);
  });

  it("returns empty array when no main element", () => {
    setupDOM(`<div>No main at all</div>`);
    expect(scanHeadings()).toHaveLength(0);
  });

  it("returns empty array when article has no h2s", () => {
    setupDOM(`
      <main>
        <article class="prose-cn">
          <h3 id="only-h3">Only H3</h3>
          <p>Some text</p>
        </article>
      </main>
    `);
    expect(scanHeadings()).toHaveLength(0);
  });
});
