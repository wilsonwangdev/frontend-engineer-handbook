"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { NAV_ITEMS } from "./public-nav";
import type { ChapterMeta } from "@/lib/content";
import type { ReadingPath, ReadingPathId } from "@/lib/reading-path";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNav({
  tree,
  paths,
}: {
  tree: ChapterMeta[];
  paths?: Record<ReadingPathId, ReadingPath>;
}) {
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
              <MobilePublicNav />
              <hr className="my-3 border-[var(--color-border)]" />
              <Sidebar tree={tree} paths={paths} />
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

function MobilePublicNav() {
  const pathname = usePathname();

  return (
    <div>
      <p className="px-1 pb-1.5 text-[11px] font-medium tracking-widest text-fg-muted/60 uppercase">
        公共页面
      </p>
      <nav aria-label="公共页面">
        <ol className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");

            if (item.disabled) {
              return (
                <li key={item.href}>
                  <span className="block rounded px-2 py-1.5 text-sm text-fg-muted/50 cursor-not-allowed select-none">
                    {item.label}
                  </span>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    "block rounded px-2 py-1.5 text-sm transition-colors " +
                    (active
                      ? "bg-[var(--color-bg-elevated)] font-medium text-[var(--color-accent)]"
                      : "text-fg-muted hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]")
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
