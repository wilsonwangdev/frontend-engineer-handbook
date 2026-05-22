"use client";

import { useEffect, useState } from "react";
import { Maximize2, AlignJustify, Minimize2 } from "lucide-react";

type Mode = "comfortable" | "wide" | "focus";

const STORAGE_KEY = "handbook:reading-width";
const ORDER: Mode[] = ["comfortable", "wide", "focus"];

const META: Record<Mode, { label: string; hint: string; Icon: typeof Maximize2 }> = {
  comfortable: { label: "舒适", hint: "默认宽度（72ch）", Icon: Minimize2 },
  wide: { label: "宽屏", hint: "更宽内容区（96ch）", Icon: AlignJustify },
  focus: { label: "专注", hint: "隐藏侧栏 / 全宽阅读", Icon: Maximize2 },
};

function applyMode(mode: Mode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.readingWidth = mode;
}

export function ReadingWidthToggle() {
  const [mode, setMode] = useState<Mode>("comfortable");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Mode | null) ?? "comfortable";
    setMode(saved);
    applyMode(saved);
  }, []);

  function cycle() {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length] as Mode;
    setMode(next);
    applyMode(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  const { label, hint, Icon } = META[mode];

  return (
    <button
      type="button"
      onClick={cycle}
      title={`阅读宽度：${label} — ${hint}（点击切换）`}
      aria-label={`阅读宽度：${label}，点击切换到下一档`}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-fg-muted transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]"
    >
      <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
