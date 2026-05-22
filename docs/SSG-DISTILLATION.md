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
    Components 静态化打架）；layout.tsx 读 params 算(不通用)
  - 触发场景：sidebar 不知道当前位置——用户视觉锚点缺失
  - 实现要点：`aria-current="page"` 兼顾 a11y；当前章下小节左侧竖线
    换 accent 色作为视觉锚

- **阅读宽度三档（reading-width）**：自实现（2026-05-23 引入）
  - 选型理由：rspress / Nextra / Docusaurus 等主流文档站都把内容压
    在固定宽度内，**长表格被迫横滚**。手册第 3 章开始大量出现 4-5
    列表格，问题被放大——这正是本站的差异化机会
  - 三档：comfortable（80rem 容器 + 72ch 正文，默认）/ wide
    （96rem + 96ch）/ focus（min(120rem,100%) + 隐藏侧栏 + 全宽正文）
  - **设备分档（参 Apple HIG「响应式布局」）**：
    - phone（< 768px）：toggle **完全隐藏**——容器已撑满 + 侧栏
      改 drawer，三档无差异
    - tablet（768-1279px）：toggle 只显示**两档**「默认 / 专注」——
      此视口下 comfortable 与 wide 视觉无差（视口本身 < 96rem 容器），
      暴露相同选项是噪音；wide 样式同时由 `@media (min-width: 1280px)`
      包裹，存储是 wide 也降级到 comfortable
    - desktop（≥ 1280px）：三档全开
    - 状态保持原则：mode 数据层只有 3 档，视口变化只影响"哪些选项
      可见 / 哪种 CSS 生效"，用户在桌面选了 wide 切到平板再回桌面
      仍是 wide
  - 实现要点：
    - `:root[data-reading-width=...]` 驱动 CSS 变量
      `--handbook-container` / `--handbook-prose-max`，三档零 JS 切换
    - 状态写 `localStorage`；FOUC 防护用顶层内联 script（[ReadingWidthScript](../src/components/ui/reading-width-script.tsx)
      照搬 [ThemeScript](../src/components/ui/theme-script.tsx) 模式）
    - UX 选 segmented control（三段并排显示选中态），不是循环按钮
      ——离散选项的标准模式；`role="radiogroup"` + `aria-checked`
      照顾键盘 / 屏幕阅读器
    - 设备检测用 `window.matchMedia` + `addEventListener('change')`
      实时响应窗口拖拽 / 横竖屏切换
  - 顺手做的表格升级：去掉 `td/th { white-space: nowrap }`（CJK 表
    格被迫横滚的根因），改 `overflow-wrap: anywhere`；表格内 `<code>`
    保持 nowrap 避免代码片段被切
  - **手册侧关联**：本能力本身就是 §3.5 / §3.6 的活案例——CSS 变量
    驱动状态、`data-*` attribute 替代 class、防 FOUC 的内联 script
    模式、按视口分档暴露选项的"适应性设计"原则都可以在写到对应节
    时直接引为本站实例

- **MDX diagrams 组件**：[src/components/mdx/diagrams.tsx](../src/components/mdx/diagrams.tsx)
  （2026-05-23 引入）
  - 选型理由：mdx 里直接嵌内联 SVG / 复杂 HTML 会让内容文件臃肿、
    作者心智负担高；抽成命名组件后 mdx 里只写 `<FlexAxisDiagram />`
    一行
  - 当前条目：FlexAxisDiagram（Flex 主轴 / 交叉轴示意）、
    CardAlignmentMisalignedDemo（Grid 嵌套对齐断层 HTML 演示）
  - 替代方案对比：Mermaid（语法学习成本 + 中文渲染欠佳）、外部图片
    （编辑流程长、暗色适配麻烦）、ASCII 文字图（CJK + ASCII 字宽混
    排无法稳定对齐——已踩过坑）
  - 实现要点：颜色统一用 `currentColor`，自动跟随暗色模式；图本身
    放 `<figure className="not-prose">` 跳出 prose 排版约束；底部带
    `<figcaption>` 解释含义

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

### 2026-05-23 内容自洽 + 站点 UX 增量

动因：写第 3 章 §3.1 现代布局时暴露多个站点能力问题：表格被迫横滚、
ASCII 图对齐失败、内容固定宽度不适合 4-5 列表格。这一轮把三件事一并
落地：

- reading-width 三档（segmented control + CSS 变量 + 防 FOUC）
- 表格 CJK 友好（去 nowrap）
- mdx diagrams 组件（FlexAxisDiagram / CardAlignmentMisalignedDemo）

升级触发数据更新：

- 数据触发 a（内容 ≥ 第 5-6 章）：否，当前 0 / 1 / 2 / 3 章 §3.1 上线
- 数据触发 b（差异化 ≥ 3 条）：**+1，当前 1 条**——reading-width 三
  档是相对 rspress / Nextra / Docusaurus 的明确差异化点（这些站点
  内容区都是固定宽度，不支持调宽 / 隐藏侧栏 / 全宽阅读）；表格 CJK
  友好和 mdx diagrams 是基础质量补齐，不算差异化
- 调研触发（完成竞品调研）：否
- 灵感触发：是——本节内容暴露的渲染问题反过来成为站点能力升级机会，
  这正是 SPEC-0010 §灵感触发的标准形态

下次评估：2026-08 季度复核，或差异化第 2-3 条触达时。

### 2026-05-23 跨设备适配 + R10 元约束扩展

动因：reading-width 上一轮只在桌面验证，iPad 实测发现 comfortable
与 wide 视觉无差（视口 < 96rem 容器）、phone 视口下三档完全无意义。
违反"通用实现≠好体验"的适应性设计基本要求。

落地：

- toggle 按设备分档：phone 隐藏整个控件 / tablet 只显示「默认 +
  专注」/ desktop 三档全开（参 Apple HIG「响应式布局」）
- CSS 同步：wide 样式包裹在 `@media (min-width: 1280px)`，存储是
  wide 也按视口降级
- AGENTS.md §10 R10 加第 4 问「跨设备体验是否验证过？」——把"phone /
  tablet / desktop 三档过一遍"提升为站点能力修改的元约束

升级触发数据更新：

- 数据触发 a：维持上一轮
- 数据触发 b（差异化 ≥ 3 条）：维持 1 条；本轮是质量补齐不算新差异化
- 调研触发：否
- 灵感触发：否（本轮是上一轮的修补）

下次评估：2026-08 季度复核，或差异化第 2-3 条触达时。
