"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { setReadingPath } from "@/components/handbook/reading-path-selector";
import { getPathMeta, type ReadingPathId } from "@/lib/reading-path-meta";

export function PathStartButton({
  path,
  href,
  label,
}: {
  path: ReadingPathId;
  href: string;
  label?: string;
}) {
  const router = useRouter();
  const meta = getPathMeta(path);

  return (
    <button
      type="button"
      onClick={() => {
        setReadingPath(path);
        router.push(href);
      }}
      className="not-prose mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-accent)]"
    >
      <span className="font-mono text-xs tabular-nums">{meta.tag}</span>
      {label || `按「${meta.label}」路径阅读本章`}
      <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
