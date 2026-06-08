"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReadingPath } from "./reading-path-selector";
import type { ReadingPathId } from "@/lib/reading-path-meta";
import type { ReadingPath } from "@/lib/reading-path";

export function PathSidebarClient({ paths }: { paths: Record<ReadingPathId, ReadingPath> }) {
  const pathname = usePathname();
  const active = useReadingPath();

  if (!active) return null;

  const path = paths[active];
  if (!path || path.sections.length === 0) {
    return (
      <div className="text-xs text-fg-muted px-2 py-4">
        该路径下暂无内容。请选择其他路径或返回完整目录。
      </div>
    );
  }

  const currentIdx = path.sections.findIndex((s) => s.url === pathname);
  const total = path.sections.length;

  return (
    <nav aria-label={`阅读路径：${path.label}`} className="text-sm">
      <div className="mb-3 flex items-center gap-2 px-2">
        <span className="whitespace-nowrap text-xs font-semibold text-fg-muted">{path.label}</span>
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-fg-muted/70">
          {currentIdx >= 0 ? currentIdx + 1 : "?"}/{total}
        </span>
      </div>
      <ol className="space-y-0.5 max-h-[calc(100vh-11rem)] overflow-y-auto">
        {path.sections.map((s, i) => {
          const isCurrent = s.url === pathname;
          return (
            <li key={s.url}>
              <Link
                href={s.url}
                aria-current={isCurrent ? "page" : undefined}
                className={
                  "flex items-center gap-2 rounded px-2 py-1 text-xs transition-colors min-w-0 " +
                  (isCurrent
                    ? "bg-[var(--color-bg-elevated)] font-medium text-[var(--color-accent)]"
                    : "text-fg-muted hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]")
                }
              >
                <span className="w-4 shrink-0 text-center font-mono text-[10px] tabular-nums text-fg-muted/60">
                  {i + 1}
                </span>
                <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                  {s.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
