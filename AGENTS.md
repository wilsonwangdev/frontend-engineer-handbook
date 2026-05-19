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

| 任务         | 命令                  | 备注                                               |
| ------------ | --------------------- | -------------------------------------------------- |
| 安装         | `pnpm install`        |                                                    |
| 开发服务     | `pnpm dev`            | Next.js 16 + Turbopack，3000 端口                  |
| 生产构建     | `pnpm build`          | Cache Components + React Compiler                  |
| 启动生产服务 | `pnpm start`          | E2E 用 `PORT=4173`                                 |
| 单元测试     | `pnpm test`           | Vitest                                             |
| E2E          | `pnpm test:e2e`       | Playwright + axe-core；CI 用这个                   |
| E2E（本地）  | `pnpm test:e2e:local` | 跳过 webServer；TUN 模式代理用户用，见 GOTCHAS G.3 |
| 烟雾测试     | `pnpm smoke`          | 纯 node:http 检查页面；绕过任何代理                |
| Lint         | `pnpm lint`           | oxlint                                             |
| 格式化       | `pnpm format`         | oxfmt                                              |
| 类型检查     | `pnpm type-check`     | tsc --noEmit（strict）                             |
| 全部门禁     | `pnpm ci`             | type-check + lint + format + test + build          |

新增脚本时**同一 commit 内**更新本表。

## Agent 工具链

`.mcp.json` 接入了 Next.js 官方 DevTools MCP。`pnpm dev` 运行时，写任何
Next.js 16 代码前先查 MCP（`get_errors`、`get_routes`、Cache Components
guide、knowledge base），不要凭印象。文档：
[nextjs.org/docs/app/guides/mcp](https://nextjs.org/docs/app/guides/mcp)。

本项目特定的高频踩坑（Cache Components、YAML 日期 coerce、TUN 代理）
见 [docs/GOTCHAS.md](docs/GOTCHAS.md)，每条带一行修复。

## 语言约定

**全项目以简体中文为主**——内容、文档、提交信息正文、SPEC、journal、skill 都
用中文。例外的英文使用范围：

- 专有名词：`Next.js` / `React` / `Tailwind` / `Vercel` / `TypeScript` 等
- 框架 API：`'use cache'` / `proxy.ts` / `useEffectEvent` 等
- 命令与文件路径：`pnpm build` / `src/lib/content.ts` 等
- Conventional Commits 前缀：`feat` / `fix` / `build` 等
- 错误信息原文（保留以便搜索匹配）

**Commit subject 用英文小写**（Conventional Commits 惯例），body 用中文。

## 项目描述（SSOT）

项目内长描述以 `package.json.description` 为**单一数据源**。改描述时
同步三处人类可读源（脚本读取的源自动跟随 `package.json`）：

1. `package.json.description` —— 程序读取源（layout 元数据、Open Graph 等）
2. `README.md` 副标题 —— 人类入口
3. `AGENTS.md` 项目目标段首句 —— agent 入口

**GitHub repo description 独立维护**——这是"展位牌"，与项目内长描述
不必一致。当前定为「面向 AI 时代的前端工程师手册」。改动时同步
[docs/DEPLOY.md](docs/DEPLOY.md) 里的 `gh repo create --description`。

**少数场景例外**：landing page hero（`src/app/page.tsx`）属于产品营造
而非元数据，允许保留独立文案（如「小而美，不是大而全」等立场表达）。

## 提交规范

Conventional Commits，原子化。Subject ≤ 72 字符、小写、祈使语态
（"add X" 而非 "added X"）。前缀：
`feat`、`fix`、`build`、`chore`、`docs`、`refactor`、`test`、`perf`、`style`、`ci`。

Body 用中文解释**为什么**这么改。代码注释不写 why——写到 commit body 或
SPEC 里。

## 协作准则

每条都是配对的 do/don't——知道"应该怎么做"和"不该怎么做"同样重要。

1. **先读后写**：开工前查 ROADMAP 看是否已规划、specs/ 看是否有决策、
   journal/ 看是否踩过类似坑。
2. **宁缺毋滥**：内容不充分时留 `_TBD_` 或空白，不要编填充。
3. **改而非加**：优先编辑现有文件，不要建 `v2` 平行文件。
4. **原子提交**：一个 commit 只解决一件事；需要时拆成多个 commit。
   - 写 subject 时如果要用顿号 / 分号 / "顺便" / "同时" 等连词——拆。
   - **回退已提交内容时优先 `git revert <hash>`**；commit 不原子时用
     `git revert -n` 暂存反向 diff，再 `git restore --staged` 挑出
     保留部分。**手写 Edit 做逆向修改是反模式**——丢失可审计性，
     reviewer 无法用 git 工具验证完整性。
   - 更多触发条件见 [SPEC-0008](specs/0008-pre-action-reflexive-checklist/spec.md) R2 / R3。
5. **同一 commit 内更新文档**：加命令 → 更新本文件命令表；做载入性决策
   → 新增 SPEC。
6. **失败写 journal/**：同一坑不应被 debug 两次。重复出现 ≥ 2 次的坑
   才升级到 [docs/GOTCHAS.md](docs/GOTCHAS.md)。
7. **借用优先**：找官方实现；社区 skill 走 4 项门禁，见
   [skills/README.md](skills/README.md)。
   - **写新工具 / 加新依赖前必过 [SPEC-0008](specs/0008-pre-action-reflexive-checklist/spec.md) R1 四问**
     （产品 vs 基建？通用 vs 特化？业界候选？能否成包？）。任意答不出
     → 暂停写代码，先调研。
8. **远端操作需授权**：本地 commit 自由，**push / force push / 删分支 /
   操作 PR / 推 Vercel** 等需用户当次明确同意。`gh` CLI 已配置好，授权
   后可代为执行。
9. **守住开源资产边界**：写入仓库前过两道测试（fork 测试 / 客观性
   测试）。个人推广策略、时间承诺、社交账号、主观呼吁不进项目——
   去用户级笔记。详见
   [SPEC-0007](specs/0007-open-source-asset-boundary/spec.md)。

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
