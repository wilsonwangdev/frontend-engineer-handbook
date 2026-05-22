# SSG Distillation Track

> 站点能力的渐进抽离记录。设立见
> [SPEC-0010](../specs/0010-progressive-ssg-distillation/spec.md)。
>
> **本文件不是 journal**——journal 记事故，本文件记设计意图沉淀。
> 数据攒齐前会长期看起来"空"，这是预期，**不要为了"填满"而编**。

## 当前分类清单

新增 / 大改组件时显式分类，填进对应栏目。**存量代码不主动迁**——
只在新增 / 大改触发分类讨论。

### 通用层（基础设施，跨手册可复用）

候选范围：章节树解析、MDX 渲染管线、prev/next 导航、callout、
代码块、sidebar、内容加载器、frontmatter 通用字段等。具体清单
在打磨过程中逐步填充。

**已确认引入的通用层方案**：

- **图标系统**：[lucide-react](https://lucide.dev/)（2026-05-20 引入）
  - 选型理由：shadcn/ui 默认方案、1400+ 图标、tree-shaking 友好、
    与 Tailwind 生态对齐、API 极简（`<Menu size={20} />`）
  - 替代方案对比：@heroicons/react（图标少 30%）、react-icons（包重）、
    iconify/react（学习成本高）、本地 SVG（维护成本高）
  - 触发场景：MobileNav 出现内联 SVG，违背"图标与组件解耦"的设计
    工程化最佳实践

- **死链巡检**：[lychee](https://lychee.cli.rs/) + lychee-action（2026-05-22 引入）
  - 选型理由：Rust 写、并发快、配置文件 toml（与 Cargo 生态对齐）、
    社区主流（fumadocs / Astro 都用）、有官方 GitHub Action 包装
  - 替代方案对比：linkinator（Node 慢）、markdown-link-check（停更）、
    自写脚本（重复造轮子）
  - 触发场景：2026-05-21 写第 2 章撞到 web.dev/articles/deeplinks 已 404，
    靠 agent 逐链查不可持续——需要工程化兜底
  - 落地：`pnpm links` 本地、每周一 09:30 UTC CI 巡检发 issue（不卡 PR）；
    [lychee.toml](../lychee.toml) 跳示例域名 + 429 视为通过

- **代码块高亮**：[rehype-pretty-code](https://rehype-pretty.pages.dev/) +
  [Shiki](https://shiki.style/)（2026-05-22 引入）
  - 选型理由：构建期高亮（零运行时）、Shiki 是 VSCode 同引擎、
    双主题支持、与现有 unified / next-mdx-remote 链路无缝接入
  - 替代方案对比：Prism（视觉旧、token 粒度差）、Starry Night（GitHub
    一手但 React 生态弱）、纯 CSS（无 token 信息）
  - 触发场景：第 2 章上线后发现代码块裸 `<pre>` 显示，损害可读性
  - 踩坑沉淀：rehype-pretty-code / Shiki 内部 `Date.now()` 与
    Cache Components 严格检查碰撞——见
    [journal/2026-05-22-rehype-pretty-code-cache-components.md](../journal/2026-05-22-rehype-pretty-code-cache-components.md)
  - 配套：`<CopyButton />` 客户端组件（30 行）通过覆盖 figure MDX 元素
    注入；行内代码 `bypassInlineCode: true` 不装饰，保持 prose 原貌

- **侧栏当前章节高亮**：自实现（2026-05-22 引入）
  - 选型理由：Next.js 16 没有稳定 RSC pathname API；标准模式是
    "use client" + `usePathname()`，影响仅 sidebar 一处，开销可忽略
  - 替代方案对比：middleware 注 x-pathname header（脆弱、与 Cache
    Components 静态化打架）；layout.tsx 读 params 算（不通用）
  - 触发场景：sidebar 不知道当前位置——用户视觉锚点缺失
  - 实现要点：`aria-current="page"` 兼顾 a11y；当前章下小节左侧竖线
    换 accent 色作为视觉锚

### 产品层（手册特定，不抽离）

候选范围：TierBadge、三档路径卡片、D1-D5 评估清单、手册特定
schema 字段（tier / paths / lastVerified 等）。

_TBD_

### 待分类

新增组件 / 工具但暂未判断归属时放这里，下次复核时清空。

_TBD_

## 竞品调研

业界主流方案的差异化对照。每次评估新功能 / 引入依赖时顺手填一行。

| 方案                                        | 强项  | 弱项  | 我们差异化点 |
| ------------------------------------------- | ----- | ----- | ------------ |
| [fumadocs](https://fumadocs.dev/)           | _TBD_ | _TBD_ | _TBD_        |
| [Nextra](https://nextra.site/)              | _TBD_ | _TBD_ | _TBD_        |
| [Starlight](https://starlight.astro.build/) | _TBD_ | _TBD_ | _TBD_        |
| [VitePress](https://vitepress.dev/)         | _TBD_ | _TBD_ | _TBD_        |
| [Rspress](https://rspress.dev/)             | _TBD_ | _TBD_ | _TBD_        |
| [Docusaurus](https://docusaurus.io/)        | _TBD_ | _TBD_ | _TBD_        |

## 差异化候选

现有自建实现在哪些点上比成熟方案做得更好。需要被打磨过程中的具体
场景验证——不要凭印象写。

_TBD_

## 替代候选

哪些自建不如直接用成熟方案，下次打磨时替换。

_TBD_

## 升级评估记录

每次复核（季度或灵感触发）写一段。包含：复核日期、当前状态、
是否触达升级条件、下次评估时间。

### 2026-05-20 立轨

初次设立。当前无升级条件满足：

- 数据触发 a（内容 ≥ 第 5-6 章）：否，当前 0 + 1 章上线
- 数据触发 b（差异化 ≥ 3 条）：否，当前 0 条
- 调研触发（完成竞品调研）：否
- 灵感触发：否

下次评估：2026-08 季度复核，或灵感触发。

### 2026-05-22 反射触发器补丁 + 通用层条目回填

动因：2026-05-22 会话连落 3 件基建（lychee 死链 / 侧栏高亮 / 代码块
高亮）均未触发分类讨论也未更新本文件——SPEC-0010 §Confirmation·1
要求"commit body 简短说明"但缺反射触发器，机制失效。本次补救：

1. AGENTS.md §协作准则·10 加 R10 反射触发器（commit body 答 3 问）
2. 回填上述 3 件通用层条目，对齐 lucide-react 既有格式
3. 顺手记 1 条 journal（rehype-pretty-code + Cache Components 碰撞）

升级触发数据更新：

- 数据触发 a（内容 ≥ 第 5-6 章）：否，当前 0 / 1 / 2 章上线（推进 +1）
- 数据触发 b（差异化 ≥ 3 条）：否，**当前 0 条**——通用层方案虽已 4 个，
  但都是直接用社区方案，差异化候选清单（"我们做得比 fumadocs 好"）
  仍空
- 调研触发（完成竞品调研）：否
- 灵感触发：否

下次评估：2026-08 季度复核，或第 5-6 章上线时（按 SPEC-0010 升级触发 a）
