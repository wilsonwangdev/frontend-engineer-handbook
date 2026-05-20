"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import type { ChapterMeta } from "@/lib/content";

export function MobileNav({ tree }: { tree: ChapterMeta[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md p-1.5 transition-colors hover:bg-[var(--color-bg-elevated)]"
        aria-expanded={open}
        aria-label="打开目录"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M3 5h14M3 10h14M3 15h14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30 bg-black/40" onClick={close} aria-hidden="true" />
          <aside
            id="mobile-nav-drawer"
            className="fixed left-0 top-14 z-40 flex h-[calc(100dvh-3.5rem)] w-72 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)] shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
              <span className="text-sm font-medium">目录</span>
              <button
                type="button"
                onClick={close}
                className="rounded-md p-1 transition-colors hover:bg-[var(--color-bg-elevated)]"
                aria-label="关闭目录"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <Sidebar tree={tree} />
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
