import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllDocs, getDocBySlug, getAdjacentDocs } from "@/lib/content";
import { mdxComponents } from "@/components/mdx/components";
import { TierBadge } from "@/components/handbook/tier-badge";
import { SITE_URL } from "@/lib/site-url";
import { ShareButton } from "@/components/handbook/share-button";
import { HeadingAnchor } from "@/components/handbook/heading-anchor";

const prettyCodeOptions = {
  // 双主题——CSS 通过 [data-theme] 切换；与本站现有 :root[data-theme="dark"] 暗色变量一致
  theme: { light: "github-light", dark: "github-dark" },
  // 关掉默认背景，由 globals.css 的 pre 样式统一控制（保持深浅模式 token 一致）
  keepBackground: false,
  // 行内 `code` 不走 Shiki 装饰——保持原 <code> 节点 + globals.css 的行内样式
  bypassInlineCode: true,
  defaultLang: "plaintext",
} as const;

// rehype-pretty-code / shiki 内部用了 Date.now()，在 Cache Components 严格
// 模式下会被拦截。包进 "use cache" 让它作为静态产物缓存——slug 是稳定 key，
// 命中后省去重复高亮开销。
async function MdxBody({ slug, source }: { slug: string[]; source: string }) {
  "use cache";
  void slug;
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
        },
      }}
    />
  );
}

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
  const ogUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(doc.frontmatter.title)}&chapter=${doc.frontmatter.chapter}&desc=${encodeURIComponent(doc.frontmatter.description)}`;
  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    openGraph: {
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
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
          <ShareButton title={doc.frontmatter.title} description={doc.frontmatter.description} />
        </div>
      </header>

      <MdxBody slug={slug} source={doc.source} />
      <HeadingAnchor />

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
