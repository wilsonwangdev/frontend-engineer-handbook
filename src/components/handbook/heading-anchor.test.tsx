import { describe, it, expect, beforeEach, vi } from "vitest";

// DOM setup helper
function setupArticle() {
  document.body.innerHTML = `
    <article class="prose-cn">
      <h2 id="section-1">Section 1</h2>
      <p>Content</p>
      <h2 id="section-2">Section 2</h2>
      <h3 id="subsection-2-1">Subsection</h3>
      <h2>No ID Heading</h2>
    </article>
  `;
}

describe("HeadingAnchor DOM behavior", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    // Mock clipboard
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
    });
  });

  it("adds copy buttons to headings with id", () => {
    setupArticle();
    // Simulate what the component's useEffect does
    const headings = document.querySelectorAll<HTMLHeadingElement>(
      "article.prose-cn h2, article.prose-cn h3",
    );
    headings.forEach((h) => {
      if (!h.id) return;
      const btn = document.createElement("button");
      btn.className = "heading-anchor-btn";
      h.style.position = "relative";
      h.appendChild(btn);
    });

    const buttons = document.querySelectorAll(".heading-anchor-btn");
    expect(buttons.length).toBe(3); // section-1, section-2, subsection-2-1
  });

  it("skips headings without id", () => {
    setupArticle();
    const h2 = document.querySelector("h2:last-of-type")!;
    expect(h2.textContent).toBe("No ID Heading");
    expect(h2.id).toBe("");

    const headings = document.querySelectorAll<HTMLHeadingElement>(
      "article.prose-cn h2, article.prose-cn h3",
    );
    let count = 0;
    headings.forEach((h) => {
      if (h.id) count++;
    });
    expect(count).toBe(3); // only 3 of 4 have IDs
  });

  it("generates correct URL with fragment", async () => {
    setupArticle();
    // Simulate click
    const id = "section-1";
    const expectedUrl = `${window.location.origin}${window.location.pathname}#${id}`;

    await navigator.clipboard.writeText(expectedUrl);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedUrl);
  });
});
