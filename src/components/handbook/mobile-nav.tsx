"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import type { ChapterMeta } from "@/lib/content";

export function MobileNav({ tree }: { tree: ChapterMeta[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-md p-1.5 transition-colors hover:bg-[var(--color-bg-elevated)]"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
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
          <div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            role="button"
            tabIndex={-1}
            aria-label="关闭目录"
          />
          <div
            id="mobile-nav-drawer"
            className="fixed left-0 top-14 z-40 h-[calc(100dvh-3.5rem)] w-64 overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-bg)] p-4 shadow-lg"
          >
            <Sidebar tree={tree} />
          </div>
        </>
      )}
    </div>
  );
}
