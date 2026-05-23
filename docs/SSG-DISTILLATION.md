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

- **回到顶部按钮（BackToTop）**：[src/components/handbook/back-to-top.tsx](../src/components/handbook/back-to-top.tsx)
  （2026-05-23 引入）
  - 选型理由：长内容页面阅读到底部需要快速回顶，单独走浏览器原生
    `window.scrollTo({top:0})` 即可，不需要 Sticky Anchor / IO 等
    重方案
  - 设计要点（参 Apple HIG「按钮 - 浮动操作」）：
    - 默认隐藏不打扰；只在 `scrollY > innerHeight`（滚过一屏）
      才出现
    - 固定右下，与 reading-width / 主题等 header 控件分区，避免
      工具栏拥挤
    - opacity + translateY 过渡，避免突现
    - 触控目标 ≥ 40×40 满足 WCAG 2.5.5
    - `env(safe-area-inset-bottom)` 适配 iOS 主页指示条
    - 平滑滚动用 `scroll-behavior: smooth`，浏览器自动按
      `prefers-reduced-motion` 降级为 instant

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
  - **窄屏踩坑（2026-05-23 修）**：CardAlignment 系列 demo 第一版用
    `gridTemplateColumns: "220px 220px"` 固定列宽 + `maxWidth: 480px`，
    在 < 456px 视口（典型手机）会撑大 prose → main → article 一路触发
    **整页横向滑动**。`maxWidth` 是上限不是下限，没起兜底作用。修法：
    内层列宽改 `repeat(2, minmax(0, 1fr))` + 容器 `width: 100%`，让卡
    片随父级宽度自适应——窄屏下卡片更窄、标题更易自然换行，subgrid 的
    断层 vs 对齐对比反而更明显。**写新 demo 时不要写死像素列宽 / 容器
    宽度；用 `1fr` / `minmax(0, ...)` / `width: 100%` 让内容跟随父级**

- **DemoBlock 实时预览组件**：[src/components/mdx/demo-block.tsx](../src/components/mdx/demo-block.tsx)
  （2026-05-23 引入）
  - 选型理由：手册讲布局 / 样式必须有"可看的案例"——文字描述 + 静态
    截图 vs 真实运行的 demo，后者记忆深 10 倍。MDN / web.dev 都用同
    模式
  - 替代方案对比：
    - **Sandpack**（CodeSandbox 出品）：运行时 bundle 几百 KB，对静
      态文档站太重
    - **React Live**：仍需运行时 babel；且 demo 不能直接 import 项
      目内组件
    - **iframe + CodePen embed**：依赖外部服务、暗色 / 主题不能跟
      随、首屏空白
    - **自建 DemoBlock（采纳）**：零运行时、SSR / Cache Components
      原生兼容、demo 是真实编译过的 React 组件，源码字符串作为 prop
      单独传——和站点其余部分完全统一
  - API：每个 demo 模块**包装好完整 DemoBlock 后**导出（如
    `<AvatarStackDemo />`），mdx 里只写一个标签即可
  - **重要：mdx scope 限制（已踩坑）**：mdx 的 JSX 表达式 scope 不
    会自动注入命名常量。曾经试过
    `<DemoBlock code={AVATAR_STACK_CODE}>...</DemoBlock>` 在 mdx
    里——编译过，但 SSR 时 code 被解析为 undefined 导致 `<pre>`
    源码区空白。这是因为 next-mdx-remote 把这个表达式的 scope 限
    制到 `mdxComponents` 内，常量被取到的是 `undefined`（mdx 把
    JSX expression child 当 React node 渲染，`undefined` 渲染为空）。
    **解决**：在 demo 模块里把 DemoBlock + 渲染节点 + 源码字符串
    打包成单一组件，mdx 只看到包装组件
  - 体验细节：
    - 上方预览区 `flex justify-center items-center` + `min-h-[140px]`
      自动居中各种尺寸 demo，最小高度避免小 demo 显得空
    - 下方源码用 `<details open>` **默认展开**（学习类站点核心诉求）；
      右上角复制按钮
    - 头部带 title / description / 语言标签
    - 跨设备：预览区 padding 在 sm 断点收紧；源码 pre 自然
      `overflow-x: auto`
  - 已落地的 demo（产品层，src/components/mdx/demos/layout-classics.tsx）：
    AvatarStackDemo / NotificationBadgeDemo / SkeletonCardDemo
  - **源码语法高亮**（2026-05-23 第二轮增量）：每个 demo 是 async
    server component，调用 `highlightCode(code, lang)`（[src/lib/highlight.ts](../src/lib/highlight.ts)）
    在构建期用 Shiki `codeToHtml` 预渲染。helper 包 `"use cache"`
    作为静态产物缓存。生成的 token span 与 rehype-pretty-code 同
    样带 `--shiki-light` / `--shiki-dark` 双 CSS 变量；globals.css
    用 `:is(figure[...], .demo-source-code)` 合并选择器统一切色。
    与 mdx 代码块视觉一致、零运行时开销
  - **默认折叠**：高亮后源码视觉占位变重，文档站点风格上「默认折
    叠」更克制——让用户主动选择"我要看代码"
  - **代价**：渲染节点和源码字符串两边维护——一旦 demo 改了源码字
    符串没跟，会"看到的 ≠ 代码"。第一版接受这个代价；未来若 demo
    数 ≥ 10，考虑用 babel-plugin 自动从组件源码生成 code 字符串

- **表格移动端适配策略**：[src/styles/globals.css](../src/styles/globals.css#L323-L405)
  （2026-05-23 引入）
  - 默认行为（≥ 768px）：`table { width: 100% }` + `table-layout: auto`，
    内容自然分列、cell `overflow-wrap: break-word` 允许长 URL / 英文长
    词换行；行内 `<code>` 维持 `white-space: nowrap` 不被切
  - 移动端（< 768px）切换为"**表格内横滑**"：`table { width: max-content;
min-width: 100% }` + `.table-wrapper { overflow-x: auto }` - 短列（# / 归位 / 难度等 1-3 字定位列）保持紧凑一行展示 - 长说明列（理由 / 一句话定位 / 谁最该读）按内容自然宽度 - 表格自然总宽超过 wrapper 时在 wrapper 内横滑，**不触发整页横滑** - 右侧 sticky 渐变提示告知"右边还有内容可滑"
  - **关键陷阱**：媒体查询块必须放在所有基础 table/cell 规则**之后**——
    nested CSS 同 specificity 下 source order 决定胜负，`width: max-content`
    写在 `width: 100%` 之前会被静默覆盖（曾踩坑见
    [journal/2026-05-23-table-mobile-breakpoint-mismatch.md](../journal/2026-05-23-table-mobile-breakpoint-mismatch.md)）
  - **不选 wrap / 不选 fixed 的理由**：
    - 整表 wrap：所有列按比例压缩，"必学"竖排成一字一行，破坏短列
      的视觉锚点作用
    - `table-layout: fixed`：等分列宽，把"#"这种 1 字短列拉到和长说
      明列同宽，列宽信息丧失
    - `word-break: break-word`：改变 min-content 计算，浏览器认为任
      意字符可断，与 `width: 100%` 组合会把短列压成 1ch（已验证）
  - **选择标准（写新表时参考）**：
    - 适合**横滑**（当前默认）：列宽差异大、且短列必须保持紧凑才有
      意义。手册当前所有"# / 归位 / 理由"类速览表都属此类
    - 适合**换行**（未来如需 opt-in）：列内容长度差不多、没有"一定
      不能断"的语义单元（纯描述性长段、读者笔记）。出现这类表再加
      `.table-wrap` opt-in class，**不要现在先建抽象**
    - 含 code / URL / 长英文标识符的列：cell 内 `<code>` 已 nowrap
      处理，与外层 wrap / scroll 选择无关
  - 调试踩坑（4 轮迭代）完整脉络：见上述 journal

### 产品层（手册特定，不抽离）

候选范围：TierBadge、三档路径卡片、D1-D5 评估清单、手册特定
schema 字段（tier / paths / lastVerified 等）。

_TBD_

### 设计语言一致性原则

跨组件视觉一致性原则。新增 / 调整 UI 组件时对照——**不一致才需
要解释**，一致是默认。

| 维度        | 原则                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 形状        | 二级控件（toggle / 浮动按钮 / 复制按钮 / FAB-like 辅助按钮）一律 `rounded-md`；圆形 `rounded-full` 仅保留给"主操作 FAB"——本站当前没有 |
| 边框 + 背景 | 控件外壳：`border-[var(--color-border)] bg-[var(--color-bg-elevated)]`；选中态再加 `bg-[var(--color-bg)] shadow-sm ring-1`            |
| 触控目标    | 主要操作 ≥ 40×40（WCAG 2.5.5）；辅助按钮（icon-only）28-32px 也 OK，但 hit area 要补 padding                                          |
| 命名        | 用户可见 label 用**客观行为描述**（默认 / 宽屏 / 全宽），不用主观感受词（舒适 / 专注 / 沉浸）                                         |
| 图标尺寸    | 14-18px：14 用于内嵌（toggle 内）；18 用于浮动 / 独立按钮（BackToTop / GitHub）                                                       |
| 过渡        | `transition-colors` 默认；`transition-[opacity,transform,color]` 用于浮入浮出                                                         |
| a11y        | 所有 icon-only 按钮必须 `aria-label`；多选项 toggle 用 `role="radiogroup"` + `aria-checked`                                           |

**为什么写下来**：本仓库 2026-05-23 单天连续优化 reading-width
toggle / BackToTop / DemoBlock 时出现"圆形 vs 方形"不一致——根因
是没有明确原则，每次拍脑袋。这份原则把不一致的代价显化，未来动 UI
前先对照。

### CSS 实战案例池（写到对应章节时引用）

打磨站点过程中撞上的 CSS 高级话题，每条都是未来章节的现成案例。
**不主动展开**——只在写到对应章节时把"本站如何解决"作为活案例
引入。

| 话题                                               | 本站如何用                                                                                 | 写到哪节时引用                         |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------- |
| CSS 变量驱动状态                                   | reading-width 三档由 `:root[data-reading-width=...]` 切 `--handbook-*` 变量                | §3.5 样式方案选型 / §3.3 现代 CSS 特性 |
| `data-*` attribute 替代 class                      | reading-width / theme 都用 `data-*`，避免 class 冲突 + 便于 SSR / cookie                   | §3.5 样式方案选型                      |
| 防 FOUC 内联 script 模式                           | ThemeScript / ReadingWidthScript 顶层内联 script 在 hydration 前应用样式                   | §3.5 样式方案选型 / §3.4 暗色模式      |
| 容器查询 vs 媒体查询                               | toggle 按视口分档 + DemoBlock 预览区 padding 在 sm 断点收紧                                | §3.1 现代布局 §4 容器查询（已写）      |
| `@media (prefers-color-scheme)` 与手动 theme 协调  | `:root[data-theme="dark"]` 优先 + `@media` 兜底（用户未明确选时跟系统）                    | §3.4 响应式与中文 Web                  |
| `prefers-reduced-motion` 适配                      | skeleton-shimmer 关动画；scroll-behavior smooth 自动降级；BackToTop 渐显                   | §3.6 动画与 View Transitions           |
| `subgrid` 嵌套对齐                                 | CardAlignmentFixedDemo 真实演示                                                            | §3.1 §5（已写）                        |
| `@keyframes` + `background-size` 200% 驱动 shimmer | SkeletonCard demo                                                                          | §3.6 动画                              |
| `position: sticky` + 包含块陷阱                    | header / sidebar 都用 sticky                                                               | §3.1 §7.1（已写）                      |
| `env(safe-area-inset-*)` iOS 适配                  | BackToTop 的 paddingBottom                                                                 | §3.4 响应式与中文 Web                  |
| segmented control（radiogroup）                    | ReadingWidthToggle                                                                         | §3.5 样式方案选型 / §3.2 a11y          |
| `:is()` 合并选择器减少重复                         | globals.css 的 `:is(figure[data-rehype-pretty-code-figure], .demo-source-code)` 双主题切色 | §3.3 现代 CSS 特性                     |
| `dangerouslySetInnerHTML` + Shiki 预渲染           | DemoBlock 源码区                                                                           | §3.5 样式方案选型 / 第 5 章 React 集成 |
| `--color-bg` + `currentColor` 主题透传             | 所有 SVG diagrams 用 currentColor，配色跟主题切                                            | §3.4 暗色模式 / §3.5 设计令牌          |

新增 case 时追加；写章节时挑用——**不要为了"用满"而硬塞**。

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

### 2026-05-23 实时预览（DemoBlock）+ 经典案例库

动因：第 3 章讲布局必须有"可看的案例"——文字描述 + 静态截图远不
如真实运行的 demo 直观。同时反馈也指出"很多代码示例提到的效果，
能否像 MDN 一样提供预览"。这一轮把通用预览能力 + 三个经典案例
demo 落地：

- DemoBlock 通用层组件（自建零运行时方案，对比 Sandpack / React
  Live / iframe embed 的取舍写在条目里）
- 三个 demo 落地（产品层）：AvatarStack / NotificationBadge /
  SkeletonCard
- §3.1 modern-layout.mdx 加 §13 经典布局案例节，原 §13 练习清单
  顺延为 §14

跨设备验证（按 R10 第 4 问）：

- phone（< 768px）：预览区 padding 收紧、源码 pre 自然横滚
- tablet：DemoBlock 默认 max-width 跟随 prose-cn 自适应
- desktop：与 prose 同宽

升级触发数据更新：

- 数据触发 a：维持
- 数据触发 b（差异化 ≥ 3 条）：**+1，当前 2 条**——DemoBlock 自建
  零运行时方案是相对 rspress / Nextra（都依赖 Sandpack 或 iframe
  embed）的明确差异化点。第 1 条仍是 reading-width 三档
- 调研触发：否
- 灵感触发：是——同上一轮，内容需求驱动站点能力升级

下次评估：2026-08 季度复核，或差异化第 3 条触达时。

### 2026-05-23 demo 高亮 + 回到顶部 + 命名中性化

动因：第 13 节 demo 反馈连环：

- subgrid 缺修复后对比，问题本质看不到
- DemoBlock 源码无语法高亮，视觉与 mdx 代码块割裂
- 长内容缺回到顶部按钮，长页面阅读体验差
- reading-width 「舒适」label 主观（不同读者 / 场景下默认未必最舒适）

落地：

- 新增 `<CardAlignmentFixedDemo />`：用 `grid-template-rows: subgrid`
  - `grid-row: span 3` 真实演示修复后效果，与既有
    `<CardAlignmentMisalignedDemo />` 一前一后对比
- DemoBlock 接入 Shiki：新增 [src/lib/highlight.ts](../src/lib/highlight.ts)
  helper（`"use cache"` 缓存），demo 改 async server component；
  globals.css 双主题选择器扩到 `.demo-source-code`；defaultOpen
  改回 false（默认折叠）
- 新增 [src/components/handbook/back-to-top.tsx](../src/components/handbook/back-to-top.tsx)
  通用层组件——固定右下、滚过一屏出现、平滑滚回；图标 ArrowUp
  与现有按钮风格一致；触控目标 ≥ 40×40；`env(safe-area-inset-bottom)`
  适配 iOS 主页指示条；挂在 (handbook)/layout.tsx
- reading-width 「舒适」改「默认」——中性，不暗示主观偏好

跨设备验证（按 R10 第 4 问）：

- BackToTop：phone `right-4 bottom-4` / sm 起 `right-6 bottom-6`；
  safe-area 内边距适配 iOS；触控 40×40 ≥ WCAG 2.5.5
- 高亮 demo 源码：复用 globals.css 现有 pre 横滚样式，三档视口
  下都 `overflow-x: auto`

升级触发数据更新：

- 数据触发 a：维持
- 数据触发 b（差异化 ≥ 3 条）：维持 2 条；本轮三件都是质量补齐
  / UX 修补，BackToTop 是通用基础能力但**业界普遍存在**，不算
  本站差异化
- 调研触发：否
- 灵感触发：是——内容反馈驱动站点能力补齐的同源链路

下次评估：2026-08 季度复核，或差异化第 3 条触达时。

### 2026-05-23 设计语言一致性 + CSS 实践案例池

动因：连续多轮 UI 改动暴露"圆形 vs 方形 / 各按钮 token 不一致 /
主观命名"等问题——根因是缺一份明确的设计语言声明。同时这一周 CSS
高级话题（subgrid / shimmer / 容器查询 / 防 FOUC / data-\* 状态）
被反复用上但分散在各 commit 里，需要集中沉淀以便未来章节引用。

落地：

- 通知徽章源码补第 3 个 button（99+），与预览三个按钮一致——这条
  是基础质量缺口，"看到的 ≠ 代码"是手册可信度红线
- DemoBlock 语言标签从预览头部移到源码 summary 行：语言标签描述源
  码而非预览，逻辑上不该出现在预览头
- reading-width「专注」改「全宽」：与「舒适」改「默认」同思路，全
  部 label 走"客观行为描述"，去主观化
- BackToTop 圆形改 `rounded-md` 矩形：与 ReadingWidthToggle / theme
  等次级控件统一。原圆形是误用——圆形保留给"主操作 FAB"
- SSG-DISTILLATION 加「设计语言一致性原则」章节：形状 / 边框 / 触
  控 / 命名 / 图标尺寸 / 过渡 / a11y 七维度成文，未来动 UI 前对照
- SSG-DISTILLATION 加「CSS 实战案例池」：13 条本站撞上的 CSS 高级
  话题，每条标"写到哪节时引用"——把"站点构建实践→手册内容"的回路
  做扎实

升级触发数据更新：

- 数据触发 a：维持
- 数据触发 b（差异化 ≥ 3 条）：维持 2 条
- 调研触发：否
- 灵感触发：是——本次"圆形 vs 方形"不一致直接催生设计语言原则

下次评估：2026-08 季度复核，或差异化第 3 条触达时。

### 2026-05-23 表格移动端横滑策略沉淀

动因：第 2-3 章速览表 / 三档归位表在 H5 上反复出现"短列被压扁、字符
级换行"问题，4 轮迭代（断点对齐 → table-layout fixed → word-break →
source order）才稳定。表面是 CSS 调样式，本质是"列宽差异大的表格在
窄视口下，到底该 wrap 还是 scroll"的设计选择没有沉淀过——之前只在
2026-05-23 第三轮 reading-width 条目里顺手提了一句"去掉 nowrap"，
但那时方案还没演进到当前形态。

落地：

- 通用层加「表格移动端适配策略」独立条目，把横滑 vs 换行的选择标准、
  当前默认（横滑）的取舍、未来 opt-in 换行的触发条件都写明
- globals.css 顶部 `.table-wrapper` 注释加一行指回 SSG-DISTILLATION
- 4 轮迭代脉络仍在 journal/2026-05-23 里，本条目只引用不复制，避免
  设计意图与事故记录混淆（参 SSG-DISTILLATION 顶部注释「不是 journal」）

升级触发数据更新：

- 数据触发 a：维持
- 数据触发 b（差异化 ≥ 3 条）：维持 2 条；本轮是基础质量补齐，业界
  rspress / Nextra / Docusaurus 默认都让表格在窄视口下整体横滚（连
  short / long 列区分都没做），当前策略已是更好的体验，但还不算明
  确差异化点，再观察
- 调研触发：否
- 灵感触发：否（本轮是反复踩坑后的策略沉淀，不是新方向）

下次评估：2026-08 季度复核，或差异化第 3 条触达时。
