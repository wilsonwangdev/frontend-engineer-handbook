/**
 * /glossary —— 站点级术语表索引页。
 *
 * 数据源：content/glossary/terms.yaml（loadGlossary）
 * 渲染：每个术语一个 section，含 anchor（锚点）让 <Term> 浮窗里
 *      "查看详情 →" 链接能直达对应位置。
 *
 * 内容上：
 *   - key（英文原词）作为标题
 *   - zh（中文译名）副标题
 *   - long 字段是 markdown，用 next-mdx-remote 渲染
 *   - see-also 转化为锚点链接
 *   - ref 显示为外链
 *
 * 静态生成：因为 terms.yaml 是 build-time 数据，整页可以 prerender。
 */
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { loadGlossary } from "@/lib/glossary";
import { mdxComponents } from "@/components/mdx/components";

export const metadata: Metadata = {
  title: "术语表",
  description: "本站统一术语对照——sanitizer / CJK / RSC / cva / variant 等高频术语的标准化解释",
};

const prettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
  bypassInlineCode: true,
  defaultLang: "plaintext",
} as const;

async function TermLong({ source }: { source: string }) {
  "use cache";
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

export default async function GlossaryPage() {
  const terms = await loadGlossary();

  return (
    <article className="prose-cn">
      <header className="not-prose mb-8 border-b border-[var(--color-border)] pb-6 sm:mb-10">
        <p className="font-mono text-xs tabular-nums text-fg-muted uppercase tracking-widest">
          术语表
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          站内术语对照
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted sm:mt-3 sm:text-base">
          本页是全站 <code>&lt;Term&gt;</code> 浮窗的详情来源——按字母顺序排列。
          内容里遇到术语时，hover 看一句话定义，点&ldquo;查看详情&rdquo;来这里读完整解释。
        </p>
        <p className="mt-3 text-xs text-fg-muted">
          目前共 <strong>{terms.length}</strong> 个术语 · 按需扩充
        </p>
      </header>

      <nav aria-label="术语索引" className="not-prose mb-8 sm:mb-10">
        <p className="text-xs font-semibold tracking-wider text-fg-muted uppercase mb-3">
          快速索引
        </p>
        <ul className="flex flex-wrap gap-2">
          {terms.map((t) => (
            <li key={t.key}>
              <a
                href={`#${t.key}`}
                className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2 py-1 font-mono text-xs text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
              >
                {t.key}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-12">
        {terms.map((term) => (
          <section
            key={term.key}
            id={term.key}
            className="scroll-mt-20 border-b border-[var(--color-border)] pb-10 last:border-b-0"
          >
            <header className="not-prose mb-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h2 className="font-mono text-2xl font-bold text-[var(--color-fg)]">{term.key}</h2>
                {term.zh && <span className="text-lg text-fg-muted">{term.zh}</span>}
              </div>
              <p className="mt-2 text-base leading-relaxed text-[var(--color-fg)]">{term.brief}</p>
            </header>

            <TermLong source={term.long} />

            <footer className="not-prose mt-6 flex flex-wrap items-center gap-4 text-sm">
              {term["see-also"] && term["see-also"].length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold tracking-wider text-fg-muted uppercase">
                    关联术语
                  </span>
                  {term["see-also"].map((key) => (
                    <a
                      key={key}
                      href={`#${key}`}
                      className="inline-flex items-center rounded-md bg-[var(--color-bg-elevated)] px-2 py-0.5 font-mono text-xs text-[var(--color-accent)] transition-colors hover:underline"
                    >
                      {key}
                    </a>
                  ))}
                </div>
              )}
              {term.ref && (
                <a
                  href={term.ref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-xs text-fg-muted transition-colors hover:text-[var(--color-accent)]"
                >
                  <span>权威参考</span>
                  <ExternalLink size={12} strokeWidth={1.75} aria-hidden="true" />
                </a>
              )}
            </footer>
          </section>
        ))}
      </div>

      <footer className="not-prose mt-12 space-y-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-sm text-fg-muted sm:p-6">
        <p>
          🏗️{" "}
          <Link href="/playground" className="text-[var(--color-accent)] hover:underline">
            动手试试 → Playground
          </Link>{" "}
          —— 动画、布局等可调试 demo 集中页
        </p>
        <hr className="border-[var(--color-border)]" />
        <p>
          术语表是站内统一术语来源——内容里出现的{" "}
          <code className="font-mono text-xs">&lt;Term k=&quot;...&quot;&gt;</code>{" "}
          组件都从这里取值。 缺少术语或定义不准？
          <a
            href="https://github.com/wilsonwangdev/frontend-engineer-handbook/blob/main/content/glossary/terms.yaml"
            target="_blank"
            rel="noreferrer noopener"
            className="mx-1 text-[var(--color-accent)] hover:underline"
          >
            提 Issue 或直接编辑 <code className="font-mono text-xs">terms.yaml</code>
          </a>
          。
        </p>
      </footer>
    </article>
  );
}
