import type { Metadata } from "next";
import { PITFALLS, getPitfallCount } from "@/lib/pitfalls";

export const metadata: Metadata = {
  title: "实战避坑录",
  description: "本书编写过程中积累的真枪实战踩坑记录——按网络/框架/工具链/部署/跨平台五类组织",
};

export default function AppendixDPage() {
  return (
    <article className="prose-cn">
      <header className="not-prose mb-8 border-b border-[var(--color-border)] pb-6 sm:mb-10">
        <p className="font-mono text-xs tabular-nums text-fg-muted uppercase tracking-widest">
          附录 D
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          实战避坑录
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted sm:mt-3 sm:text-base">
          本书编写过程中积累的真枪实战踩坑记录。按网络 / 框架 / 工具链 / 部署 / 可访问性
          五类组织，每条包含症状、原因、修复——方便你 Ctrl+F 快速定位。
        </p>
        <p className="mt-2 text-xs text-fg-muted">
          升级标准：同一坑被踩 ≥ 2 次从 journal 升级到这里（
          <a
            href="https://github.com/wilsonwangdev/frontend-engineer-handbook/blob/main/specs/0005-companion-tracks-and-test-strategy/spec.md"
            className="text-[var(--color-accent)] hover:underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            SPEC-0005
          </a>
          ）。当前共 {getPitfallCount()} 条。
        </p>
      </header>

      {PITFALLS.map(({ category, desc, items }) => (
        <section key={category} className="mb-10">
          <h2 className="text-base font-semibold">{category}</h2>
          <p className="mt-1 text-sm text-fg-muted">{desc}</p>
          <div className="mt-4 space-y-6">
            {items.map((item) => (
              <div
                key={item.title}
                className="not-prose rounded-lg border border-[var(--color-border)] p-4"
              >
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <dl className="mt-2 space-y-2 text-sm">
                  <div>
                    <dt className="inline font-medium text-red-600 dark:text-red-400">症状：</dt>
                    <dd className="inline text-fg-muted">{item.symptom}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-amber-600 dark:text-amber-400">
                      原因：
                    </dt>
                    <dd className="inline text-fg-muted">{item.cause}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-green-600 dark:text-green-400">
                      修复：
                    </dt>
                    <dd className="inline text-fg-muted">{item.fix}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </section>
      ))}

      <footer className="not-prose mt-12 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-sm text-fg-muted sm:p-6">
        <p>
          避坑录持续更新中。发现新坑请{" "}
          <a
            href="https://github.com/wilsonwangdev/frontend-engineer-handbook/issues/new?template=content.yml"
            className="text-[var(--color-accent)] hover:underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            提交 Issue
          </a>
          （选"内容建议"模板）。重复出现 ≥ 2 次后升级至此。
        </p>
      </footer>
    </article>
  );
}
