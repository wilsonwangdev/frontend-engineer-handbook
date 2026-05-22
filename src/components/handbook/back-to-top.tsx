"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * 回到顶部按钮——固定右下，滚过一屏出现，平滑滚回。
 *
 * 设计原则：
 * - 默认隐藏不打扰；只在确实可能"找不到顶"时出现
 * - 固定定位 + safe-area 内边距适配 iOS 主页指示条
 * - 触控目标 ≥ 40×40（WCAG 2.5.5）
 * - 尊重 prefers-reduced-motion：scrollIntoView smooth 由浏览器
 *   自动降级为 instant
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="回到顶部"
      title="回到顶部"
      className={
        "fixed right-4 bottom-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-fg-muted shadow-md backdrop-blur transition-[opacity,transform,color] hover:text-[var(--color-fg)] sm:right-6 sm:bottom-6 " +
        (visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0")
      }
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
    >
      <ArrowUp size={18} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
