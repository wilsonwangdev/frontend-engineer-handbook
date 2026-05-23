"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./sidebar";
import type { ChapterMeta } from "@/lib/content";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNav({ tree }: { tree: ChapterMeta[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus();
      return;
    }
    closeButtonRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
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
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md p-1.5 transition-colors hover:bg-[var(--color-bg-elevated)]"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label="打开目录"
      >
        <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30 bg-black/40" onClick={close} aria-hidden="true" />
          <aside
            ref={drawerRef}
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="目录"
            className="fixed left-0 top-14 z-40 flex h-[calc(100dvh-3.5rem)] w-72 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)] shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
              <span className="text-sm font-medium">目录</span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                className="rounded-md p-1 transition-colors hover:bg-[var(--color-bg-elevated)]"
                aria-label="关闭目录"
              >
                <X size={16} strokeWidth={1.75} aria-hidden="true" />
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
