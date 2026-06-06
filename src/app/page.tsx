import Link from "next/link";
import { ChapterPlan } from "@/components/landing/chapter-plan";
import { SearchIcon, BookOpen, Code2, Moon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-24">
      <div className="space-y-6">
        <p className="text-sm font-medium tracking-widest text-fg-muted uppercase">
          AI 时代 · 中文精编手册
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">前端工程师手册</h1>
        <p className="text-base leading-relaxed text-fg-muted sm:text-lg">
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
          <PathCard
            tag="C"
            title="实践驱动"
            desc="边做边学，从项目入手"
            tone="delegatable"
            note="第 10 章上线后开放"
          />
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <FeatureCard
            icon={SearchIcon}
            title="站内搜索"
            desc="⌘K 唤起，即时检索章节、术语、Playground demo"
          />
          <FeatureCard
            icon={BookOpen}
            title="术语浮窗"
            desc="hover 即时解释技术术语，点按直达完整词条"
          />
          <FeatureCard
            icon={Code2}
            title="可调试 Playground"
            desc="动画、布局 demo 可查看源码、复制修改"
          />
          <FeatureCard
            icon={Moon}
            title="暗色阅读"
            desc="View Transition 圆形扩散切换，跟随系统或手动"
          />
        </div>

        <ChapterPlan />
      </div>
    </main>
  );
}

function PathCard({
  tag,
  title,
  desc,
  tone,
  note,
}: {
  tag: string;
  title: string;
  desc: string;
  tone: "essential" | "understand" | "delegatable";
  note?: string;
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
      {note && <p className="mt-2 text-xs text-fg-muted/70">⏳ {note}</p>}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:bg-[var(--color-bg-elevated)]">
      <Icon size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-0.5 text-xs text-fg-muted">{desc}</p>
      </div>
    </div>
  );
}
