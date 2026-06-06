"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Columns3, Columns2, Square } from "lucide-react";

type Mode = "comfortable" | "wide" | "focus";

const STORAGE_KEY = "handbook:reading-width";

function applyMode(mode: Mode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.readingWidth = mode;
}

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
  focus: { mode: "focus", label: "全宽", hint: "隐藏侧栏 + 正文撑满", Icon: Square },
};

function visibleOptions(device: Device): Option[] {
  if (device === "phone") return [];
  if (device === "tablet") {
    return [ALL_OPTIONS.comfortable, ALL_OPTIONS.focus];
  }
  return [ALL_OPTIONS.comfortable, ALL_OPTIONS.wide, ALL_OPTIONS.focus];
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
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
        return;
      }
    }
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClickOutside, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClickOutside, true);
    };
  }, [open, close]);

  function pick(next: Mode) {
    setMode(next);
    applyMode(next);
    localStorage.setItem(STORAGE_KEY, next);
    setOpen(false);
    buttonRef.current?.focus();
  }

  if (!hydrated || device === "phone") return null;

  const opts = visibleOptions(device);
  const current = ALL_OPTIONS[mode];
  const Icon = current.Icon;

  return (
    <div ref={menuRef} className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`阅读宽度（当前：${current.label}）`}
        aria-expanded={open}
        aria-haspopup="true"
        title={`阅读宽度 — ${current.label}`}
        className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]"
      >
        <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="阅读宽度"
          className="absolute right-0 top-full mt-1.5 z-30 min-w-[220px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] py-1 shadow-lg"
        >
          {opts.map(({ mode: m, label, hint, Icon: OptIcon }) => {
            const active = mode === m;
            return (
              <button
                key={m}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => pick(m)}
                className={
                  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors " +
                  (active
                    ? "bg-[var(--color-bg-elevated)] text-[var(--color-accent)] font-medium"
                    : "text-fg-muted hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]")
                }
              >
                <OptIcon size={15} strokeWidth={1.75} aria-hidden="true" />
                <span className="flex-1">{label}</span>
                <span className="text-[11px] text-fg-muted/70">{hint}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
