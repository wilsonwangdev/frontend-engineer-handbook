# AGENTS.md

> 本仓库中所有 AI 编码 agent 的规范入口。
> `CLAUDE.md` / `.cursorrules` / `.windsurfrules` 均符号链接到此文件——只编辑本文件。

## 项目目标

围绕 agent 协作的前端工程师中文精编手册。**小而美，不是大而全**。
读者：新入行 / 1–3 年 / 资深，三档。定位：导航 + 判断 + 速查 + 实践。
完全免费，仅引一手来源。

## 入口

| 你想做什么            | 看哪个文件                                                                         |
| --------------------- | ---------------------------------------------------------------------------------- |
| 下一步该做什么        | [ROADMAP.md](ROADMAP.md)                                                           |
| 某个决策为什么这么定  | [specs/README.md](specs/README.md)（全部 SPEC 索引在此）                           |
| 可复用的 agent 工作流 | [skills/](skills/)                                                                 |
| 过去踩过的坑          | [journal/](journal/)（逐条事故）、[docs/GOTCHAS.md](docs/GOTCHAS.md)（高频坑速查） |
| 权限与 hook 配置      | [.claude/settings.json](.claude/settings.json)                                     |
| 公网发布步骤          | [docs/DEPLOY.md](docs/DEPLOY.md)                                                   |

> **元规则**：写任何开源仓库内容前先过 [SPEC-0007 开源资产边界](specs/0007-open-source-asset-boundary/spec.md)
> 的两道测试。这是每段内容都适用的元约束，其他 SPEC 按需查 specs/README.md。

## 仓库结构

```
AGENTS.md  ROADMAP.md  README.md
content/   src/        e2e/        scripts/   public/
specs/     skills/     journal/    docs/
.claude/   .mcp.json   .github/
```

每个顶层目录有自己的 `README.md` 说明本地约定。改文件之前先读对应 README。

## 常用命令

| 任务         | 命令                  | 备注                                                   |
| ------------ | --------------------- | ------------------------------------------------------ |
| 安装         | `pnpm install`        |                                                        |
| 开发服务     | `pnpm dev`            | Next.js 16 + Turbopack，3000 端口                      |
| 生产构建     | `pnpm build`          | Cache Components + React Compiler                      |
| 启动生产服务 | `pnpm start`          | E2E 用 `PORT=4173`                                     |
| 单元测试     | `pnpm test`           | Vitest                                                 |
| E2E          | `pnpm test:e2e`       | Playwright + axe-core；CI 用这个                       |
| E2E（本地）  | `pnpm test:e2e:local` | 跳过 webServer；TUN 模式代理用户用，见 GOTCHAS G.3     |
| 烟雾测试     | `pnpm smoke`          | 纯 node:http 检查页面；绕过任何代理                    |
| 死链检查     | `pnpm links`          | lychee 扫所有 .md / .mdx；本地需 `brew install lychee` |
| Lint         | `pnpm lint`           | oxlint                                                 |
| 格式化       | `pnpm format`         | oxfmt                                                  |
| 类型检查     | `pnpm type-check`     | tsc --noEmit（strict）                                 |
| 全部门禁     | `pnpm ci`             | type-check + lint + format + test + build              |

新增脚本时**同一 commit 内**更新本表。

## Agent 工具链

`.mcp.json` 接入了 Next.js 官方 DevTools MCP。`pnpm dev` 运行时，写任何
Next.js 16 代码前先查 MCP（`get_errors`、`get_routes`、Cache Components
guide、knowledge base），不要凭印象。文档：
[nextjs.org/docs/app/guides/mcp](https://nextjs.org/docs/app/guides/mcp)。

本项目特定的高频踩坑（Cache Components、YAML 日期 coerce、TUN 代理）
见 [docs/GOTCHAS.md](docs/GOTCHAS.md)，每条带一行修复。

## 语言约定

**全项目以简体中文为主**。英文仅限：专有名词（`Next.js` / `React` 等）、
框架 API、命令与路径、Conventional Commits 前缀、错误信息原文。

**Commit subject 用英文小写**（Conventional Commits 惯例），body 用中文。

## 项目描述（SSOT）

长描述以 `package.json.description` 为单一数据源。改描述时同步
`README.md` 副标题 + 本文件项目目标段首句。GitHub repo description
独立维护（见 [docs/DEPLOY.md](docs/DEPLOY.md)）。Landing page hero
允许保留独立文案。

## 提交规范

Conventional Commits，原子化。Subject ≤ 72 字符、小写、祈使语态。
前缀：`feat` / `fix` / `build` / `chore` / `docs` / `refactor` / `test` /
`perf` / `style` / `ci`。Body 用中文解释 why。

## 协作准则

> **任务起步元反射**：用户给出新目标前，先过
> [SPEC-0008](specs/0008-pre-action-reflexive-checklist/spec.md) R7
> ——当前 model + thinking 档与任务难度类型（创作 / 判断 / 执行）
> 是否匹配？明显错配才出声建议，匹配则沉默继续。

1. **先读后写**：开工前查 ROADMAP / specs/ / journal/。**新写或改写
   章节正文前过 4 问**：
   - 第一段读完，新人知道这章讲什么吗？
   - 出现的术语首次都解释了吗？
   - 表格每格读完即懂、不用脑补吗？
   - 有"懂的人才懂"的内部表述吗？

   任一答不上 → 重写。修字 / 调链接 / 语气微调豁免。完整 5 项准则 + 反例库见 [SPEC-0011](specs/0011-content-accessibility-standard/spec.md)。

2. **宁缺毋滥**：内容不充分时留 `_TBD_` 或空白，不要编填充。
3. **改而非加 / 不留半成品**：优先编辑现有文件，不建 `v2` 平行文件。
   有视觉提示就必须有完整功能闭环，否则改纯展示或完全不做——
   详见 [SPEC-0008](specs/0008-pre-action-reflexive-checklist/spec.md) R6。
4. **原子提交**：一个 commit 只解决一件事。切换 concern 前先落地当前改动。
   详见 [SPEC-0008](specs/0008-pre-action-reflexive-checklist/spec.md) R2 / R3 / R4。
5. **同一 commit 内更新文档**：加命令 → 更新命令表；做载入性决策
   → 新增 SPEC。harness 文档膨胀会拖慢 agent——扩文档前过
   [SPEC-0008](specs/0008-pre-action-reflexive-checklist/spec.md) R5，
   行数阈值见 [docs/HARNESS-HEALTH.md](docs/HARNESS-HEALTH.md)。
6. **失败写 journal/**：同一坑不应被 debug 两次。重复出现 ≥ 2 次的坑
   才升级到 [docs/GOTCHAS.md](docs/GOTCHAS.md)。
7. **借用优先**：找官方实现；写新工具 / 加新依赖前必过
   [SPEC-0008](specs/0008-pre-action-reflexive-checklist/spec.md) R1 四问。
8. **远端操作需授权**：本地 commit 自由，**push / force push / 删分支 /
   操作 PR / 推 Vercel** 等需用户当次明确同意。`gh` CLI 已配置好，授权
   后可代为执行。
9. **守住开源资产边界**：写入仓库前过 fork 测试 + 客观性测试。
   详见 [SPEC-0007](specs/0007-open-source-asset-boundary/spec.md)。

## 代码风格

- 默认不写注释。只在 why **不明显**时写一行。
- 不写多段 docstring。
- 不在代码里引用当前任务 / PR / Issue 编号——它们会过期。

## 安全红线

- 永不提交密钥。看到就停下来告知用户。
- 不用 `--no-verify` / `--force` 等绕过检查的方式回避问题。先查根因。

## 这份文件错了怎么办

现实会偏离文档。**直接更新本文件**——陈旧的 AGENTS.md 比缺失更糟，它会
主动误导 agent。本文件每次会话都会被载入，每一行都在争夺上下文窗口。
**边缘细节属于 specs/ 或 docs/，不属于这里。**
