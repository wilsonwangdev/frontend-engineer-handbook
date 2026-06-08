"use client";

import { usePathname } from "next/navigation";
import { useReadingPath } from "./reading-path-selector";
import { getPathMeta, type ReadingPathId } from "@/lib/reading-path-meta";
import type { ReadingPath } from "@/lib/reading-path";

export function PathProgressClient({ paths }: { paths: Record<ReadingPathId, ReadingPath> }) {
  const pathname = usePathname();
  const active = useReadingPath();

  if (!active) return null;

  const path = paths[active];
  if (!path || path.sections.length === 0) return null;

  const idx = path.sections.findIndex((s) => s.url === pathname);
  if (idx < 0) return null;

  const meta = getPathMeta(active);
  const pct = Math.round(((idx + 1) / path.sections.length) * 100);

  return (
    <div className="not-prose mb-6">
      <div className="flex items-center justify-between text-xs text-fg-muted">
        <span>
          <span className="font-medium text-[var(--color-accent)]">
            {meta.tag} {meta.label}
          </span>
          <span className="mx-1.5">·</span>第 {idx + 1}/{path.sections.length} 节
        </span>
        <span className="font-mono tabular-nums">{pct}%</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
