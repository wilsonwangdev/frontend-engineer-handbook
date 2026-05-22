import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  chapterPlan,
  getAppendixCount,
  getChapterCount,
  getPartialCount,
  getPublishedCount,
  type PlannedChapter,
} from "@/lib/chapter-plan";

export function ChapterPlan() {
  const chapters = chapterPlan.filter((c) => c.type === "chapter");
  const appendices = chapterPlan.filter((c) => c.type === "appendix");
  const published = getPublishedCount();
  const partial = getPartialCount();

  return (
    <section className="mt-16">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-widest text-fg-muted uppercase">章节规划</p>
        <p className="mt-2 text-sm text-fg-muted">
          已上线 <span className="font-semibold text-[var(--color-fg)]">{published}</span> 章
          {partial > 0 && (
            <>
              {" "}
              · 进行中 <span className="font-semibold text-[var(--color-fg)]">{partial}</span> 章
            </>
          )}{" "}
          · 规划 {getChapterCount()} 章 + {getAppendixCount()} 个附录 · 持续更新中
        </p>
      </header>
      <ol className="overflow-hidden rounded-lg border border-[var(--color-border)]">
        {chapters.map((c, i) => (
          <ChapterRow key={c.id} chapter={c} isLast={i === chapters.length - 1} />
        ))}
      </ol>
      <ol className="mt-4 overflow-hidden rounded-lg border border-[var(--color-border)]">
        <li className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2 text-xs font-medium tracking-widest text-fg-muted uppercase">
          附录
        </li>
        {appendices.map((c, i) => (
          <ChapterRow key={c.id} chapter={c} isLast={i === appendices.length - 1} />
        ))}
      </ol>
    </section>
  );
}

function ChapterRow({ chapter, isLast }: { chapter: PlannedChapter; isLast: boolean }) {
  const inner = (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="flex min-w-0 items-center gap-4">
        <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-fg-muted">
          {chapter.id}
        </span>
        <span className={cn("truncate text-sm", !chapter.published && "text-fg-muted")}>
          {chapter.title}
        </span>
        {chapter.partial && (
          <span className="shrink-0 rounded-md bg-[var(--color-bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-fg-muted">
            {chapter.partial.released}/{chapter.partial.total}
          </span>
        )}
      </div>
      {chapter.published ? (
        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-[var(--color-accent)]">
          {chapter.partial ? "进行中" : "阅读"}
          <ArrowRight size={12} strokeWidth={2} aria-hidden="true" />
        </span>
      ) : (
        <span className="shrink-0 text-xs text-fg-muted">即将推出</span>
      )}
    </div>
  );

  const className = cn(
    !isLast && "border-b border-[var(--color-border)]",
    chapter.published && "transition-colors hover:bg-[var(--color-bg-elevated)]",
  );

  return (
    <li className={className}>
      {chapter.published && chapter.url ? (
        <Link href={chapter.url} className="block">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </li>
  );
}
