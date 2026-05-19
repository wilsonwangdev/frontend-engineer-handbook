import Link from "next/link";
import type { ChapterMeta } from "@/lib/content";

export function Sidebar({ tree }: { tree: ChapterMeta[] }) {
  return (
    <nav aria-label="章节导航" className="text-sm">
      <ol className="space-y-1">
        {tree.map((ch) => (
          <li key={ch.url}>
            <Link
              href={ch.url}
              className="block rounded px-2 py-1.5 text-fg-muted transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]"
            >
              <span className="font-mono text-xs tabular-nums text-fg-muted">
                {String(ch.chapter).padStart(2, "0")}
              </span>{" "}
              {ch.title}
            </Link>
            {ch.sections && ch.sections.length > 0 && (
              <ol className="ml-4 mt-0.5 space-y-0.5 border-l border-[var(--color-border)] pl-3">
                {ch.sections.map((s) => (
                  <li key={s.url}>
                    <Link
                      href={s.url}
                      className="block rounded px-2 py-1 text-xs text-fg-muted transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
