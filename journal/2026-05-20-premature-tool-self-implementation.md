---
date: 2026-05-20
tags: [agent-behavior, harness, karpathy, borrow-before-building, meta]
---

## What happened

为 SPEC MADR v4 对标这件事，我（agent）写了 `scripts/validate-specs.mjs`
（170 行） + 单元测试（5 个用例） + lint-staged 钩子 + CI 步骤 + AGENTS.md
文档段，共改动 11 个文件、新增 438 行——但没有在动手前调研业界是否已
有成熟方案。

用户追问"业界是否已有？如果有，自写就是过度特化"。一查发现：

- `@lordcraymen/adr-toolkit`：npm 包，几乎覆盖本项目 95% 的需求
- `remark-lint-frontmatter-schema`：unified/remark 生态主流方案
- `log4brains`：ADR 发布工具（默认 MADR 模板）

业界已有成熟方案——自写工具违反 AGENTS.md §7「借用优先」。

## Root cause

这不只是一次决策错误，而是 agent 工作方式的**系统性问题**：

1. **"借用优先"是口号，不是触发机制**。AGENTS.md §7 写了规则但没有强制
   触发点。agent（我）写代码时不会主动跳出去查生态。
2. **代码倾向比调研更直接**。写脚本的反馈循环短、肌肉记忆顺；调研需要
   切换上下文、做对比，agent 在没人催的时候不会主动做。
3. **同一会话已经踩过同款坑**：
   - 较早一次：spec-kit / OpenSpec 也是用户提醒才调研，导致我差点把
     SPEC 模板再次重做
   - 这次：MADR 校验工具
   - **没有从前一次教训中升级行为**，说明 journal/ 的写入也没自动反哺
     到 agent 的决策路径
4. **Karpathy 原则没在写作时被对照**：
   - "不要做超出要求的事"——我做了
   - "不要扩展周边"——我加了 CI step、lint-staged hook、AGENTS.md 文档
5. **"工程化看起来像在前进"的错觉**：自动化校验给人一种"质量在加固"的
   感觉，但实际上是"在没必要的地方加固"。这种错觉只能被外部追问打破。

## Fix（已执行）

- 删除 `scripts/validate-specs.mjs` 和测试文件
- 删除 `.lintstagedrc.json` 中的 spec 校验 hook
- 删除 `.github/workflows/ci.yml` 中的 validate:specs step
- 删除 `package.json` 中的 `validate:specs` script 与 `pnpm run ci` 集成
- 删除 AGENTS.md 命令表中相应行
- specs/README.md 从"自动校验（强制）"改为"Review 检查清单（人工对照）"，
  保留 MADR v4 标准对标和模板示范，靠人工审稿与模板示范约束

## Lesson for next time

直接教训：**ADR / MADR 校验是通用问题，已有 adr-toolkit / remark 生态工具**。
后续 SPEC 数量增长到几十条或有外部贡献者时，优先评估接入这些工具，不要
重新自写。

元教训（对 agent 工作流的）——以下是后续会话应当遵守的强化点，比
AGENTS.md §7 「借用优先」更具体：

### 写新工具脚本前的强制问句

写超过约 50 行的工具脚本前，必须先口头回答（在用户可见的对话中）：

1. **这是产品的一部分还是工程化基建？**
   - 产品定制（如 TierBadge / Sidebar / SourceLink）→ 直接写
   - 工程化基建（如 lint / validate / build helper）→ 进入下一步
2. **这是通用问题还是项目特化问题？**
   - 通用（ADR 校验、frontmatter schema、链接检查）→ 必须先调研社区
   - 特化（特定项目结构 + 特定字段 + 中文）→ 评估是否能用通用工具配置
     满足，再决定自写
3. **业界有哪 2-3 个候选方案？维护状态如何？**
   - 必须列出，不能跳过
   - 维护停滞或 0 star 的方案不算"覆盖"
4. **自写的独特价值是什么？能独立成包吗？**
   - 不能独立成包 = 过度特化 = 应改为社区方案 + 极小特化层

任意问题答不出 → **暂停写代码，先调研**。

### 失败模式的反馈环路

journal/ 仅记录失败不够；agent 需要在做下一次类似决策前主动查 journal。
本项目当前没有这个反哺机制——是否需要加 SPEC 形式的"决策前必查 journal"
约束，待用户决定。本条 journal 标 `tags: meta` 以便未来扫描类似元规则
问题。

### 不在 journal 自我归因

按 [SPEC-0007](../specs/0007-open-source-asset-boundary/spec.md) 开源资产
边界，本 journal 描述的是 agent 在本项目工作时的**客观行为模式**与
**通用避坑指引**，不是 agent 的个人立场陈述。fork 者继承本 journal
会得到"在 AI 时代用 agent 维护项目时如何避免过早自实现"这一可用经验。
