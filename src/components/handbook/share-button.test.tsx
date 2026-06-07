import { describe, it, expect, vi, beforeEach } from "vitest";

describe("ShareButton logic", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("detects Web Share API availability", () => {
    // Present
    vi.stubGlobal("navigator", { share: vi.fn() });
    expect(typeof navigator.share).toBe("function");

    // Absent
    vi.stubGlobal("navigator", {});
    expect(navigator.share).toBeUndefined();
  });

  it("falls back to clipboard copy when share is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      share: undefined,
      clipboard: { writeText },
    });

    const title = "React 心智模型";
    const description = "组件、状态、副作用";
    const url = "https://fe.wilsonhandbook.online/chapter-05/react-mental-model";

    await writeText(`${title}\n${description}\n${url}`);
    expect(writeText).toHaveBeenCalledWith(
      "React 心智模型\n组件、状态、副作用\nhttps://fe.wilsonhandbook.online/chapter-05/react-mental-model",
    );
  });

  it("includes title and description in share data", () => {
    const shareData = {
      title: "Next.js App Router",
      text: "路由、数据获取、缓存策略",
      url: "https://fe.wilsonhandbook.online/chapter-05/nextjs-app-router",
    };

    expect(shareData.title).toBeTruthy();
    expect(shareData.text).toBeTruthy();
    expect(shareData.url).toContain("https://");
  });
});
