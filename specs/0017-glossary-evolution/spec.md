---
id: 0017
title: 术语表（glossary）维护方案演化路径
status: proposed
date: 2026-06-04
---

## Context and Problem Statement

2026-06-04 落地 `<Term>` MDX 组件 + `/glossary` 索引路由 + 单一数据源
`content/glossary/terms.yaml`（10 个初始术语）。当前阶段 yaml 单文件
方案足够用，但用户已经预见到长期问题：

> **YAML 在术语数量增长后**：
>
> - **维护性**：缩进敏感，长文本里漏空格容易破；多人协作合并冲突高发
> - **可读性**：所有术语挤在一个文件——浏览困难
> - **性能**：build 期一次解析全文件，但术语增到 100+ 条时编译期校验
>   也会变慢
> - **UX**：维护者要写代码示例 + 多段 markdown 时，yaml 多行字符串体验差

主流 wiki / 词条系统的方案：

- **MDX 文件 per 术语**（Astro Starlight / Docusaurus 部分插件）
- **JSON + 工具站**（Backlight 设计令牌）
- **Notion / Outline 嵌入**（团队协作密集的内部 wiki）
- **MediaWiki**（Wikipedia 自建）

需要决策**何时从 yaml 演化到下一个方案**——避免：

1. 过早抽象（10 个术语用复杂方案是杀鸡用牛刀）
2. 拖到太晚（术语增到 50+ 后再迁移成本大）
3. 选错方向（迁移到不适合本项目的方案）

## Decision Drivers

- 术语增长**节奏可控**——不是一次性爆发
- 与项目现有约定**风格一致**（mdx 内容、yaml 配置已有）
- 维护者**多为 agent + 少数人工**——格式要 agent 友好
- 不引入额外 CMS / 外部依赖（保"完全免费 + 静态"承诺）

## Considered Options

### 选项 A：保持 yaml + 触发迁移条件（推荐）

**当前阶段**：yaml 单文件继续用，10-29 个术语。

**触发迁移条件**：

| 条件                     | 触发动作                    |
| ------------------------ | --------------------------- |
| 术语数 ≥ 30              | 启动迁移到 MDX per 术语方案 |
| 单条 long 字段 ≥ 80 行   | 迁移本条到 .mdx 文件        |
| yaml 文件 ≥ 1500 行      | 启动迁移                    |
| 多人提交频繁产生合并冲突 | 启动迁移（>= 2 次/月）      |

满足任一条件 → 进入"迁移期"。迁移目标见选项 D。

**优点**：当前阶段 0 投入；明确触发条件避免拖延；用户能看到何时升级。
**缺点**：未来要做迁移工作。

### 选项 B：立即迁移到 MDX per 术语

```
content/glossary/
├── README.md
├── sanitizer.mdx      # frontmatter: zh / brief / see-also / ref
├── cjk.mdx
└── ...
```

**优点**：long 字段直接写 MDX（含 Term 嵌套、Callout、代码块）；一条术语一次 commit；无合并冲突。
**缺点**：当前 10 条迁移成本（约 1-2 小时）；增加文件数；目录扁平化压力。

### 选项 C：JSON + 工具站

JSON 数据 + 用 Backlight / Storybook 等工具展示。

**优点**：JSON 解析快；工具站 UI 漂亮。
**缺点**：与项目"中文为主 / mdx 优先"风格不一致；引入新依赖；不符合"完全免费 + 静态"承诺（Backlight 是付费 SaaS）。

### 选项 D（迁移目标）：MDX per 术语 + frontmatter

满足触发条件后迁移到的方案：

```
content/glossary/
├── README.md
├── _index.yaml       # 顶层 metadata：分类标签 / 推荐起点 / 主题分组
├── sanitizer.mdx
├── cjk.mdx
└── ...
```

**每个 .mdx**：

```mdx
---
key: sanitizer
zh: 净化器
brief: 把不可信 HTML 字符串过滤成只含安全标签的工具，防 XSS 标准手段
see-also: [xss, dompurify]
ref: https://github.com/cure53/DOMPurify
tags: [security, react]
---

`sanitizer`（净化器）的作用是接收一段不可信的 HTML 字符串……

**典型用法**：

\`\`\`js
import DOMPurify from 'dompurify';
const safe = DOMPurify.sanitize(userInput);
\`\`\`

**何时需要**：…
```

**好处**：

- frontmatter 用 zod 校验（与现有 content schema 同模式）
- 正文是 MDX，可嵌套 `<Term>` / `<Callout>` / 代码块
- 一条术语一次 commit / 一次 PR

## Decision Outcome

选 **A + 触发条件落地后走 D**。理由：

- 当前 10 个术语用 yaml 没有现实痛点
- 立即迁移（B）是过早抽象——MDX per 术语的代价（更多文件 / 配套工具）现在不值
- 触发条件让"何时迁"显式化，避免拖延 / 凭感觉

## 触发条件细化

每次给 yaml 加新术语时，agent 应顺手检查：

```
1. 现有术语数（含本次新增）是否 >= 30？
2. 本次新增的 long 字段是否 >= 80 行？
3. yaml 总行数是否 >= 1500？
```

任一 yes → 在 commit body 提一句"触达 SPEC-0017 迁移条件 X"，
并在下一个 commit 启动迁移。

## 迁移路径（触达条件后）

**Step 1**：建脚手架

- `src/lib/glossary.ts` 改为读 mdx 文件夹（保留 `loadGlossary()` API 不变）
- frontmatter zod schema 与 yaml 一致
- 编写迁移脚本 `scripts/migrate-glossary-yaml-to-mdx.ts`

**Step 2**：批量迁移

- 脚本读 `terms.yaml` → 生成 `content/glossary/<key>.mdx`
- 删除 `terms.yaml`
- 更新 `loadGlossary()` 实现

**Step 3**：验证

- `<Term>` 浮窗仍工作
- `/glossary` 索引页仍渲染
- see-also 完整性校验仍生效
- a11y / 锚点 / 移动端 OK

## Consequences

**好**：

- 当前阶段 0 投入——把工程精力留给内容
- 触发条件让升级可预测
- 迁移目标（D）已经设计好——届时不用重新评估

**不好**：

- 迁移工作未来要做（一次性，约 2-3 小时）
- 触发条件需要 agent 每次加术语时主动检查（不能完全自动化）

**待还的债**：

- `scripts/migrate-glossary-yaml-to-mdx.ts` 等触达条件后再写
- `content/glossary/<key>.mdx` 的 frontmatter schema 等触达条件后再确定

## 检查触发条件的工具（可选）

未来加 lint script：

```bash
pnpm glossary:check
# 输出：
# - 当前术语数：12
# - 最大 long 字段：45 行
# - yaml 总行数：320
# - 距离迁移阈值：术语数 18 / long 35 / 行数 1180
```

工具不必现在写——10 个术语手数也快。

## 替代方案的明确否决

**为什么不立即迁到 MDX**：当前 10 个术语用 yaml 没有任何具体痛点。
agent 加术语不慢、读者不抱怨、构建不慢。"未来更好"不是立即迁移的理由。

**为什么不走 JSON / Backlight**：

- JSON 的多行字符串体验比 yaml 更差
- Backlight 是付费 SaaS——违反"完全免费"承诺
- 与项目 mdx-first 风格不一致

**为什么不外接 Notion / Outline**：

- 引入运行时依赖（API 调用）
- 破坏静态站点架构
- agent 无法直接编辑（要走 API）

## 验收标准

本 SPEC（proposed → accepted）的标准：

- yaml 维护文档（terms.yaml 头部注释）已说明触发条件
- ROADMAP 候补池有"术语表演化"条目（链回本 SPEC）

迁移完成的标准（未来）：

- 所有术语已迁移到 .mdx 文件
- yaml 已删除
- 现有 `<Term>` / `/glossary` API 行为不变
- 至少一条 mdx 利用了 mdx 特性（嵌套 `<Term>` / `<Callout>` 等）

## Changelog

- 2026-06-04：初次落地。选 A（保持 yaml + 显式触发条件）。
  迁移目标 D（MDX per 术语）已设计完整，等触达条件后实施。
