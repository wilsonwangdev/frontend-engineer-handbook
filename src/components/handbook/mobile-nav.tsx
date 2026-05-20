"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import type { ChapterMeta } from "@/lib/content";

export function MobileNav({ tree }: { tree: ChapterMeta[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm transition-colors hover:bg-[var(--color-bg-elevated)]"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2 4h12M2 8h12M2 12h12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        目录
      </button>
      {open && (
        <div
          id="mobile-nav-drawer"
          className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 shadow-lg"
        >
          <Sidebar tree={tree} />
        </div>
      )}
    </div>
  );
}
