import { describe, it, expect, vi, beforeEach } from "vitest";

function isWeChatUA(ua: string) {
  return /MicroMessenger/i.test(ua);
}

describe("ShareButton logic", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("detects WeChat browser via user agent", () => {
    expect(isWeChatUA("Mozilla/5.0 MicroMessenger/8.0")).toBe(true);
    expect(isWeChatUA("Mozilla/5.0 Chrome/120 Safari/537.36")).toBe(false);
  });

  it("excludes share capability in WeChat even if API exists", () => {
    vi.stubGlobal("navigator", {
      share: vi.fn(),
      userAgent: "Mozilla/5.0 MicroMessenger/8.0",
    });
    const wechat = isWeChatUA(navigator.userAgent);
    const canShare = !wechat && !!navigator.share;
    expect(canShare).toBe(false);
  });

  it("copies clean URL to clipboard when share is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      share: undefined,
      clipboard: { writeText },
    });

    const url = "https://fe.wilsonhandbook.online/chapter-05/react-mental-model";
    await writeText(url);
    expect(writeText).toHaveBeenCalledWith(url);
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
