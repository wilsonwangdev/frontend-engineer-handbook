import type { Metadata } from "next";
import Link from "next/link";
import { topics, getDemoCount } from "@/components/playground/registry";

export const metadata: Metadata = {
  title: "示例",
  description: "动画、布局等前端 demo 集中页，全部可调试，可查看源码复制修改",
};

export default function PlaygroundPage() {
  return (
    <article className="prose-cn">
      <header className="not-prose mb-8 border-b border-[var(--color-border)] pb-6 sm:mb-10">
        <p className="font-mono text-xs tabular-nums text-fg-muted uppercase tracking-widest">
          示例
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">示例</h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted sm:mt-3 sm:text-base">
          所有 demo 集中在此——按主题浏览。每个 demo 都可以查看源码、复制、修改。
        </p>
      </header>

      <div className="not-prose grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => {
          const count = getDemoCount(topic.id);
          return (
            <Link
              key={topic.id}
              href={`/playground/${topic.id}`}
              className="group rounded-lg border border-[var(--color-border)] p-5 no-underline transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-elevated)]"
            >
              <h2 className="text-lg font-semibold text-[var(--color-fg)] group-hover:text-[var(--color-accent)]">
                {topic.title}
              </h2>
              <p className="mt-1.5 text-sm text-fg-muted">{topic.description}</p>
              <p className="mt-3 text-xs font-medium text-[var(--color-accent)]">
                {count} 个 demo →
              </p>
            </Link>
          );
        })}
      </div>

      <footer className="not-prose mt-12 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-sm text-fg-muted sm:p-6">
        <p>
          📖{" "}
          <Link href="/glossary" className="text-[var(--color-accent)] hover:underline">
            查看术语表 → 词条
          </Link>{" "}
          —— 站内统一术语对照
        </p>
      </footer>
    </article>
  );
}
