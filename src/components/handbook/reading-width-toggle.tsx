"use client";

import { useEffect, useState } from "react";
import { Columns3, Columns2, Square } from "lucide-react";

type Mode = "comfortable" | "wide" | "focus";

const STORAGE_KEY = "handbook:reading-width";

const OPTIONS: ReadonlyArray<{
  mode: Mode;
  label: string;
  hint: string;
  Icon: typeof Square;
}> = [
  { mode: "comfortable", label: "舒适", hint: "默认：侧栏 + 72ch 正文", Icon: Columns3 },
  { mode: "wide", label: "宽屏", hint: "侧栏 + 96ch 正文", Icon: Columns2 },
  { mode: "focus", label: "专注", hint: "隐藏侧栏 + 全宽阅读", Icon: Square },
];

function applyMode(mode: Mode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.readingWidth = mode;
}

export function ReadingWidthToggle() {
  const [mode, setMode] = useState<Mode>("comfortable");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Mode | null) ?? "comfortable";
    setMode(saved);
    applyMode(saved);
    setHydrated(true);
  }, []);

  function pick(next: Mode) {
    setMode(next);
    applyMode(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <div
      role="radiogroup"
      aria-label="阅读宽度"
      className="inline-flex items-center gap-0.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-0.5"
    >
      {OPTIONS.map(({ mode: m, label, hint, Icon }) => {
        const active = hydrated && mode === m;
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${label}（${hint}）`}
            title={`${label} — ${hint}`}
            onClick={() => pick(m)}
            className={
              "inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors " +
              (active
                ? "bg-[var(--color-bg)] text-[var(--color-fg)] shadow-sm ring-1 ring-[var(--color-border)]"
                : "text-fg-muted hover:text-[var(--color-fg)]")
            }
          >
            <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
            <span className="hidden md:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
