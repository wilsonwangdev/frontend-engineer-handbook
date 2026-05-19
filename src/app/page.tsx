import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <div className="space-y-6">
        <p className="text-sm font-medium tracking-widest text-fg-muted uppercase">
          AI 时代 · 中文精编手册
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">前端工程师手册</h1>
        <p className="text-lg leading-relaxed text-fg-muted">
          围绕 agent 协作的精编学习路线。
          <br />
          小而美，不是大而全。导航 + 判断 + 快速复习 + 实践。
        </p>

        <div className="flex flex-wrap gap-3 pt-4">
          <Link
            href="/chapter-00"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-white font-medium transition-transform hover:scale-[1.02]"
          >
            开始阅读
          </Link>
          <Link
            href="/chapter-01"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-5 py-2.5 font-medium transition-colors hover:bg-[var(--color-bg-elevated)]"
          >
            AI 时代能力地图
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <PathCard tag="A" title="系统学习" desc="从头到尾建立完整知识体系" tone="essential" />
          <PathCard tag="B" title="按需查阅" desc="查漏补缺，快速复习" tone="understand" />
          <PathCard tag="C" title="实践驱动" desc="边做边学，从项目入手" tone="delegatable" />
        </div>

        <p className="pt-12 text-sm text-fg-muted">施工中。手册正在按 specs/ 中的设计逐章构建。</p>
      </div>
    </main>
  );
}

function PathCard({
  tag,
  title,
  desc,
  tone,
}: {
  tag: string;
  title: string;
  desc: string;
  tone: "essential" | "understand" | "delegatable";
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:bg-[var(--color-bg-elevated)]">
      <div
        className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold"
        style={{
          background: `var(--color-tier-${tone}-bg)`,
          color: `var(--color-tier-${tone})`,
        }}
      >
        {tag}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-fg-muted">{desc}</p>
    </div>
  );
}
