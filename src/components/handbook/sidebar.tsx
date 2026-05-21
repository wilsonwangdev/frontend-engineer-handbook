"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ChapterMeta } from "@/lib/content";

export function Sidebar({ tree }: { tree: ChapterMeta[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="章节导航" className="text-sm">
      <ol className="space-y-1">
        {tree.map((ch) => {
          const chapterActive = pathname === ch.url;
          const inChapter = pathname === ch.url || pathname.startsWith(ch.url + "/");
          return (
            <li key={ch.url}>
              <Link
                href={ch.url}
                aria-current={chapterActive ? "page" : undefined}
                className={
                  "block rounded px-2 py-1.5 transition-colors " +
                  (chapterActive
                    ? "bg-[var(--color-bg-elevated)] font-medium text-[var(--color-accent)]"
                    : "text-fg-muted hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]")
                }
              >
                <span className="font-mono text-xs tabular-nums text-fg-muted">
                  {String(ch.chapter).padStart(2, "0")}
                </span>{" "}
                {ch.title}
              </Link>
              {ch.sections && ch.sections.length > 0 && (
                <ol
                  className={
                    "ml-4 mt-0.5 space-y-0.5 border-l pl-3 " +
                    (inChapter ? "border-[var(--color-accent)]" : "border-[var(--color-border)]")
                  }
                >
                  {ch.sections.map((s) => {
                    const sectionActive = pathname === s.url;
                    return (
                      <li key={s.url}>
                        <Link
                          href={s.url}
                          aria-current={sectionActive ? "page" : undefined}
                          className={
                            "block rounded px-2 py-1 text-xs transition-colors " +
                            (sectionActive
                              ? "bg-[var(--color-bg-elevated)] font-medium text-[var(--color-accent)]"
                              : "text-fg-muted hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]")
                          }
                        >
                          {s.title}
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
