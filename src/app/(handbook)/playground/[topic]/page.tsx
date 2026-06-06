import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { topics, getDemosByTopic, type DemoMeta } from "@/components/playground/registry";

interface Props {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return topics.map((t) => ({ topic: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const topicMeta = topics.find((item) => item.id === topic);
  if (!topicMeta) return {};
  return {
    title: `示例 · ${topicMeta.title}`,
    description: topicMeta.description,
  };
}

export default async function TopicPage({ params }: Props) {
  const { topic } = await params;
  const topicMeta = topics.find((item) => item.id === topic);
  if (!topicMeta) notFound();

  const demos = getDemosByTopic(topic);

  return (
    <article className="prose-cn">
      <header className="not-prose mb-8 border-b border-[var(--color-border)] pb-6 sm:mb-10">
        <p className="font-mono text-xs tabular-nums text-fg-muted uppercase tracking-widest">
          <Link href="/playground" className="hover:text-[var(--color-accent)] transition-colors">
            示例
          </Link>{" "}
          / {topicMeta.title}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          {topicMeta.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted sm:mt-3 sm:text-base">
          {topicMeta.description}
        </p>
      </header>

      <div className="not-prose space-y-10">
        {demos.map((demo) => (
          <DemoSection key={demo.id} demo={demo} />
        ))}
      </div>
    </article>
  );
}

function DemoSection({ demo }: { demo: DemoMeta }) {
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-base font-semibold text-[var(--color-fg)]">{demo.title}</h2>
        <span className="rounded-md bg-[var(--color-bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-fg-muted">
          {demo.difficulty}
        </span>
        {demo.relatedChapter && (
          <Link
            href={demo.relatedChapter}
            className="text-xs text-[var(--color-accent)] hover:underline"
          >
            查看章节 →
          </Link>
        )}
      </div>
      <demo.Component />
    </section>
  );
}
