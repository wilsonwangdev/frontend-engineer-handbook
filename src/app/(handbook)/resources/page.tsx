import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "精选资源",
  description:
    "一手资料 + 经典书目——不收录二手解读、不列排行榜，只列我们实际读过且认为值得你花时间的资源",
};

interface Resource {
  title: string;
  url: string;
  desc: string;
}

interface Book {
  title: string;
  author: string;
  desc: string;
  level: "入门" | "进阶" | "资深";
}

const PRIMARY_SOURCES: { category: string; items: Resource[] }[] = [
  {
    category: "规范与标准",
    items: [
      {
        title: "ECMAScript 语言规范（TC39）",
        url: "https://tc39.es/ecma262/",
        desc: "JS 语法的唯一权威来源。不需要通读，但当你对某个特性的行为有疑问时，来这里而不是 Stack Overflow。",
      },
      {
        title: "WHATWG HTML Living Standard",
        url: "https://html.spec.whatwg.org/",
        desc: "HTML 和 DOM 的现行标准——'living' 意味着持续更新，MDN 的文档以此为准。",
      },
      {
        title: "W3C CSS 规范索引",
        url: "https://www.w3.org/Style/CSS/",
        desc: "CSS 各模块的规范入口。不需要全读，但了解哪些特性在哪个规范里能帮你判断浏览器支持时间线。",
      },
      {
        title: "HTTP/1.1 RFC 7230–7235",
        url: "https://httpwg.org/specs/",
        desc: "HTTP 协议的权威定义。读 §4（HTTP semantics）就能理解缓存、条件请求、内容协商——前端性能优化的大部分决策都基于此。",
      },
    ],
  },
  {
    category: "文档与教程",
    items: [
      {
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org/",
        desc: "Web 平台的百科全书。API 参考、指南、浏览器兼容性数据——前端工程师的默认第一站。",
      },
      {
        title: "React 官方文档（react.dev）",
        url: "https://react.dev/",
        desc: "2023 年重写版，以'思考方式'为主线而非 API 罗列。先读'Quick Start'再读'Describing the UI'。",
      },
      {
        title: "Next.js 官方文档",
        url: "https://nextjs.org/docs",
        desc: "App Router 模式的完整指南。从 Routing 到 Data Fetching 到 Caching——每个概念都有交互式示例。",
      },
      {
        title: "TypeScript Handbook",
        url: "https://www.typescriptlang.org/docs/handbook/",
        desc: "TS 官方入门教程。先读'Everyday Types'和'Narrowing'——这两章覆盖了 80% 日常使用场景。",
      },
      {
        title: "web.dev（Google）",
        url: "https://web.dev/",
        desc: "Google 的 Web 最佳实践指南。Performance、PWA、Accessibility 各板块有一手案例和度量方法。",
      },
    ],
  },
  {
    category: "工具与数据",
    items: [
      {
        title: "Can I Use",
        url: "https://caniuse.com/",
        desc: "浏览器特性支持查询。做兼容性决策时的第一站——输入特性名，看到全球和中国市场的支持百分比。",
      },
      {
        title: "Bundlephobia",
        url: "https://bundlephobia.com/",
        desc: "npm 包的体积分析。加依赖前先查——包大小、gzip 后、tree-shaking 友好度、依赖图。",
      },
      {
        title: "Chrome for Developers",
        url: "https://developer.chrome.com/",
        desc: "Chrome 团队的官方博客。新 API 的发布说明、性能 case study、DevTools 技巧——一手来源，不是二手解读。",
      },
    ],
  },
];

const BOOKS: { category: string; items: Book[] }[] = [
  {
    category: "入门——建立心智模型",
    items: [
      {
        title: "Eloquent JavaScript（4th ed.）",
        author: "Marijn Haverbeke",
        desc: "用'写代码'教编程——每一章都有可运行的示例和习题。Part 1（语言）+ Part 2（浏览器）覆盖了前端最核心的 JS 知识。",
        level: "入门",
      },
      {
        title: "Web 前端开发（第 4 版）",
        author: "MDN 社区",
        desc: "MDN 团队编写的结构化教程，比零散查文档更适合系统学习。HTML/CSS/JS 三件套的'教科书'版本。",
        level: "入门",
      },
    ],
  },
  {
    category: "进阶——理解'为什么'",
    items: [
      {
        title: "You Don't Know JS Yet（2nd ed.）",
        author: "Kyle Simpson",
        desc: "深入 JS 语言机制的系列。Scope & Closures 卷是必读——不理解闭包就无法真正理解 React hooks。",
        level: "进阶",
      },
      {
        title: "CSS: The Definitive Guide（5th ed.）",
        author: "Eric A. Meyer, Estelle Weyl",
        desc: "CSS 的'规格说明书'翻译成人话。当 MDN 的解释不够深入时读这本——特别是 Layout 和 Visual Effects 章节。",
        level: "进阶",
      },
      {
        title: " Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        desc: "严格来说不是前端书。但理解存储、复制、分区、事务之后，你对'前端状态管理'的看法会彻底改变——为什么 Redux 这样设计、为什么缓存这么难。",
        level: "进阶",
      },
    ],
  },
  {
    category: "资深——审美与判断力",
    items: [
      {
        title: "Refactoring UI",
        author: "Adam Wathan, Steve Schoger",
        desc: "从程序员视角讲设计——间距、颜色、字体、层级。不是理论，是具体可操作的 tactics：'什么时候用 border 而不是 shadow'、'表单标签放左边还是上面'。",
        level: "资深",
      },
      {
        title: "The Pragmatic Programmer（20th Anniversary ed.）",
        author: "David Thomas, Andrew Hunt",
        desc: "不限于前端，但每一章都适用于前端工程化。'Don't Live with Broken Windows'、'Orthogonality'、'Tracer Bullets'——这些原则在你设计组件库和构建管线时会反复出现。",
        level: "资深",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <article className="prose-cn">
      <header className="not-prose mb-8 border-b border-[var(--color-border)] pb-6 sm:mb-10">
        <p className="font-mono text-xs tabular-nums text-fg-muted uppercase tracking-widest">
          附录 B
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          精选一手资源 + 经典书目
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted sm:mt-3 sm:text-base">
          不收录二手解读、不列排行榜。这里每一本 / 每一个链接都是我们实际读过、
          用过、且认为值得你花时间的资源。收录标准见{" "}
          <a
            href="https://github.com/wilsonwangdev/frontend-engineer-handbook/blob/main/specs/0002-content-source-admission/spec.md"
            className="text-[var(--color-accent)] hover:underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            SPEC-0002
          </a>
          。
        </p>
      </header>

      <section className="space-y-12">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">🌐 一手资料</h2>
          <p className="mt-1 text-sm text-fg-muted">
            当你有疑问时，先来这里——而不是搜索引擎。一手资料是唯一的真相来源。
          </p>
        </div>

        {PRIMARY_SOURCES.map(({ category, items }) => (
          <section key={category}>
            <h3 className="text-base font-semibold">{category}</h3>
            <ul className="mt-2 space-y-3">
              {items.map((r) => (
                <li key={r.url} className="text-sm">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-medium text-[var(--color-accent)] hover:underline"
                  >
                    {r.title}
                  </a>
                  <span className="ml-2 text-fg-muted">{r.desc}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </section>

      <hr className="my-10 border-[var(--color-border)]" />

      <section className="space-y-10">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">📚 经典书目</h2>
          <p className="mt-1 text-sm text-fg-muted">
            按学习阶段分档——'入门'建立心智模型，'进阶'理解为什么，'资深'培养审美与判断力。
          </p>
        </div>

        {BOOKS.map(({ category, items }) => (
          <section key={category}>
            <h3 className="text-base font-semibold">{category}</h3>
            <ul className="mt-2 space-y-4">
              {items.map((b) => (
                <li key={b.title} className="text-sm">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-medium text-[var(--color-fg)]">{b.title}</span>
                    <span className="text-xs text-fg-muted">—— {b.author}</span>
                    <span className="rounded bg-[var(--color-bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">
                      {b.level}
                    </span>
                  </div>
                  <p className="mt-0.5 text-fg-muted">{b.desc}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </section>

      <footer className="not-prose mt-12 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-sm text-fg-muted sm:p-6">
        <p>
          资源推荐是主观的——这份列表反映的是 2026 年我们团队认为最有价值的资源。
          如果你有补充建议，欢迎{" "}
          <a
            href="https://github.com/wilsonwangdev/frontend-engineer-handbook/issues/new"
            className="text-[var(--color-accent)] hover:underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            提 Issue
          </a>
          。
        </p>
      </footer>
    </article>
  );
}
