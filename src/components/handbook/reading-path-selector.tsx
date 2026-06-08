"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { BookOpen } from "lucide-react";
import { TourTooltip } from "@/components/ui/tour-tooltip";
import { getPathMeta, type ReadingPathId } from "@/lib/reading-path-meta";

const STORAGE_KEY = "handbook:reading-path";

const ALL_OPTIONS: { id: ReadingPathId | null; label: string; desc: string }[] = [
  { id: null, label: "完整目录", desc: "所有章节自由浏览" },
  { id: "beginner", label: "A 系统学习", desc: "从头到尾建立知识体系" },
  { id: "intermediate", label: "B 按需查阅", desc: "查漏补缺，快速复习" },
  { id: "senior", label: "C 实践驱动", desc: "聚焦 AI 不可替代的判断力" },
];

/** All localStorage keys used by handbook features. Centralized for reset. */
const ALL_KEYS = [
  STORAGE_KEY,
  "handbook:reading-path-tour-seen",
  "handbook:reading-width",
  "handbook:chapter-progress",
];

export function resetAllHandbookState() {
  for (const key of ALL_KEYS) {
    localStorage.removeItem(key);
  }
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: null }));
}

export function useReadingPath(): ReadingPathId | null {
  const [path, setPath] = useState<ReadingPathId | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "beginner" || stored === "intermediate" || stored === "senior") {
      setPath(stored);
    }
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        const v = e.newValue;
        if (v === "beginner" || v === "intermediate" || v === "senior") setPath(v);
        else setPath(null);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return path;
}

export function setReadingPath(id: ReadingPathId | null) {
  if (id) localStorage.setItem(STORAGE_KEY, id);
  else localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: id }));
}

export function ReadingPathSelector() {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [active, setActive] = useState<ReadingPathId | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ReadingPathId | null;
    if (stored === "beginner" || stored === "intermediate" || stored === "senior") {
      setActive(stored);
    }
    setHydrated(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    }
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close();
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClickOutside, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClickOutside, true);
    };
  }, [open, close]);

  function pick(id: ReadingPathId | null) {
    setActive(id);
    setReadingPath(id);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function handleReset() {
    resetAllHandbookState();
    setActive(null);
    setOpen(false);
    buttonRef.current?.focus();
  }

  if (!hydrated) return null;

  const meta = active ? getPathMeta(active) : null;

  return (
    <div ref={menuRef} className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={active ? `阅读路径（当前：${meta?.label}）` : "选择阅读路径"}
        aria-expanded={open}
        aria-haspopup="true"
        title={active ? `阅读路径 — ${meta?.label}` : "阅读路径"}
        className={`inline-flex h-[30px] w-[30px] items-center justify-center rounded-md transition-colors ${
          active
            ? "text-[var(--color-accent)]"
            : "text-fg-muted hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]"
        }`}
      >
        <BookOpen size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>

      {active && (
        <TourTooltip
          storageKey="handbook:reading-path-tour-seen"
          className="absolute right-0 top-full mt-1.5 z-40 w-56"
        >
          <p className="text-xs leading-relaxed text-[var(--color-fg)]">
            已激活<strong>{meta?.label}</strong>路径。点击此按钮可随时切换或恢复完整目录。
          </p>
        </TourTooltip>
      )}

      {open && (
        <div
          role="menu"
          aria-label="阅读路径"
          className="absolute right-0 top-full mt-1.5 z-30 min-w-[240px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] py-1 shadow-lg"
        >
          {ALL_OPTIONS.map(({ id, label, desc }) => {
            const isActive = active === id;
            return (
              <button
                key={id ?? "none"}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => pick(id)}
                className={
                  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors " +
                  (isActive
                    ? "bg-[var(--color-bg-elevated)] text-[var(--color-accent)] font-medium"
                    : "text-fg-muted hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]")
                }
              >
                <span className="flex-1 whitespace-nowrap">{label}</span>
                <span className="shrink-0 whitespace-nowrap text-[11px] text-fg-muted/70">
                  {desc}
                </span>
              </button>
            );
          })}
          <div className="my-1 border-t border-[var(--color-border)]" />
          {active && (
            <button
              type="button"
              role="menuitem"
              onClick={() => pick(null)}
              className="flex w-full items-center px-3 py-2 text-left text-xs text-fg-muted/60 transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]"
            >
              清除路径，恢复完整目录
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={handleReset}
            className="flex w-full items-center px-3 py-2 text-left text-xs text-fg-muted/60 transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]"
          >
            重置所有本地状态（引导、偏好等）
          </button>
        </div>
      )}
    </div>
  );
}
