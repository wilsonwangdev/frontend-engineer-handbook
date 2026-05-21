import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getAllDocs, getDocBySlug, getAdjacentDocs } from "@/lib/content";
import { mdxComponents } from "@/components/mdx/components";
import { TierBadge } from "@/components/handbook/tier-badge";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const docs = await getAllDocs();
  return docs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);
  if (!doc) return {};
  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
  };
}

export default async function HandbookPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);
  if (!doc) notFound();

  const { prev, next } = await getAdjacentDocs(doc);

  return (
    <article className="prose-cn">
      <header className="not-prose mb-8 border-b border-[var(--color-border)] pb-6 sm:mb-10">
        <p className="font-mono text-xs tabular-nums text-fg-muted uppercase tracking-widest">
          第 {doc.frontmatter.chapter} 章
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          {doc.frontmatter.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted sm:mt-3 sm:text-base">
          {doc.frontmatter.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-fg-muted sm:mt-4">
          <TierBadge tier={doc.frontmatter.tier} />
          <span>约 {doc.readingMinutes} 分钟</span>
          {doc.lastModified && <span>上次更新于 {doc.lastModified}</span>}
        </div>
      </header>

      <MDXRemote
        source={doc.source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />

      <nav
        aria-label="章节导航"
        className="not-prose mt-16 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 sm:grid sm:grid-cols-2 sm:gap-4"
      >
        {prev ? (
          <Link
            href={prev.url}
            className="group rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:bg-[var(--color-bg-elevated)]"
          >
            <p className="text-xs text-fg-muted">← 上一节</p>
            <p className="mt-1 font-medium group-hover:text-[var(--color-accent)]">
              {prev.frontmatter.title}
            </p>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next ? (
          <Link
            href={next.url}
            className="group rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:bg-[var(--color-bg-elevated)] sm:text-right"
          >
            <p className="text-xs text-fg-muted">下一节 →</p>
            <p className="mt-1 font-medium group-hover:text-[var(--color-accent)]">
              {next.frontmatter.title}
            </p>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
      </nav>
    </article>
  );
}
