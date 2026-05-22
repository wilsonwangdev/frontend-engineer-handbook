"use client";

import { useEffect, useState } from "react";
import { Columns3, Columns2, Square } from "lucide-react";

type Mode = "comfortable" | "wide" | "focus";

const STORAGE_KEY = "handbook:reading-width";

/**
 * 视口分档驱动的可见选项集合。
 * 设计原则（参考 Apple HIG「响应式布局」）：
 * - phone（< 768px）：内容已全宽 + 侧栏改 drawer，三档无意义 → 隐藏整个控件
 * - tablet（768-1279px）：comfortable 与 wide 视觉无差（视口本身 < 96rem），
 *   只暴露 comfortable + focus 两档
 * - desktop（≥ 1280px）：三档全开，差异肉眼可见
 *
 * 命名取舍：comfortable / wide / focus 是内部 mode key（不展示）；
 * 用户可见的 label 是「默认 / 宽屏 / 专注」——「默认」比「舒适」中性，
 * 后者带主观倾向（不同读者 / 不同场景下默认未必最舒适）。
 *
 * 关键：mode 数据本身只有 3 档（持久化），不同视口只是隐藏不该看到的选项。
 * 用户在桌面选了 wide 后切到平板，存储仍是 wide，但 UI 不显示——回到桌面
 * 继续生效。这是「状态保持」原则。
 */
type Device = "phone" | "tablet" | "desktop";

type Option = { mode: Mode; label: string; hint: string; Icon: typeof Square };

const ALL_OPTIONS: Record<Mode, Option> = {
  comfortable: {
    mode: "comfortable",
    label: "默认",
    hint: "侧栏 + 72ch 正文",
    Icon: Columns3,
  },
  wide: { mode: "wide", label: "宽屏", hint: "侧栏 + 96ch 正文", Icon: Columns2 },
  focus: { mode: "focus", label: "专注", hint: "隐藏侧栏 + 全宽阅读", Icon: Square },
};

function visibleOptions(device: Device): Option[] {
  if (device === "phone") return [];
  if (device === "tablet") {
    return [ALL_OPTIONS.comfortable, ALL_OPTIONS.focus];
  }
  return [ALL_OPTIONS.comfortable, ALL_OPTIONS.wide, ALL_OPTIONS.focus];
}

function applyMode(mode: Mode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.readingWidth = mode;
}

function detectDevice(): Device {
  if (typeof window === "undefined") return "desktop";
  if (window.matchMedia("(min-width: 1280px)").matches) return "desktop";
  if (window.matchMedia("(min-width: 768px)").matches) return "tablet";
  return "phone";
}

export function ReadingWidthToggle() {
  const [mode, setMode] = useState<Mode>("comfortable");
  const [device, setDevice] = useState<Device>("desktop");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Mode | null) ?? "comfortable";
    setMode(saved);
    applyMode(saved);
    setDevice(detectDevice());
    setHydrated(true);

    const phoneMql = window.matchMedia("(max-width: 767.98px)");
    const tabletMql = window.matchMedia("(min-width: 768px) and (max-width: 1279.98px)");
    const onChange = () => setDevice(detectDevice());
    phoneMql.addEventListener("change", onChange);
    tabletMql.addEventListener("change", onChange);
    return () => {
      phoneMql.removeEventListener("change", onChange);
      tabletMql.removeEventListener("change", onChange);
    };
  }, []);

  function pick(next: Mode) {
    setMode(next);
    applyMode(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  // SSR 占位 + phone 视口都不渲染。SSR 占位防止水合后突然出现导致布局跳。
  if (!hydrated || device === "phone") return null;

  const opts = visibleOptions(device);

  return (
    <div
      role="radiogroup"
      aria-label="阅读宽度"
      className="inline-flex items-center gap-0.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-0.5"
    >
      {opts.map(({ mode: m, label, hint, Icon }) => {
        const active = mode === m;
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
            <span className="hidden lg:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
