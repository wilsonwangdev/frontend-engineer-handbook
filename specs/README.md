# specs/

SPEC 驱动的决策记录。一个 spec 一个文件夹。代码体现**做什么**、git 历史
体现**何时做**，spec 解释**为什么这么做**。

## 索引（按编号）

| #                                                       | 标题                      | 状态     | 适用场景                                      |
| ------------------------------------------------------- | ------------------------- | -------- | --------------------------------------------- |
| [0001](0001-scope-and-audience/spec.md)                 | 范围与读者                | accepted | 战略级；决定章节是否值得写                    |
| [0002](0002-content-source-admission/spec.md)           | 内容来源准入              | accepted | 写章节正文、添加外链时                        |
| [0003](0003-table-of-contents/spec.md)                  | 目录结构与章节归位        | accepted | 设计新章节 / 决定内容放哪一档                 |
| [0004](0004-ai-delegation-criteria/spec.md)             | AI 可委托清单判断依据     | accepted | 第 1 章 / 涉及"什么任务可委托给 AI"的判断     |
| [0005](0005-companion-tracks-and-test-strategy/spec.md) | 番外（附录 D）+ 测试策略  | accepted | 写 e2e 测试 / 把 journal 升级为附录条目时     |
| [0006](0006-agent-skills-system/spec.md)                | Agent harness skills 体系 | accepted | 新增 skill / 选用社区 skill / 评估 MCP 集成时 |
| [0007](0007-open-source-asset-boundary/spec.md)         | 开源资产边界              | accepted | **每段开源内容写入前必查**（元规则）          |

新增 spec 时**只动这张表**，不动 AGENTS.md。

## 什么时候写 spec

写 spec 的判断：

- 这是一个有多个合理答案的决策吗？
- 决策会影响未来工作（架构、数据模型、公共 API、构建管线等）吗？
- 未来 agent 仅靠读代码无法重建这个理由吗？

任意一条 yes → 写 spec。

**不要为以下情况写 spec**：

- 琐碎的实现细节
- 看代码就能明白的事
- 投机性的未来工作（等真要做时再写）

## 目录结构

```
specs/
└── NNNN-short-kebab-slug/
    ├── spec.md       # 决策本身（必需）
    ├── notes.md      # 可选：更长的探索记录、权衡的备选
    └── assets/       # 可选：图、benchmark 数据、截图
```

编号单调递增，永不复用。如果一个 spec 被取代，标记
`status: superseded-by: NNNN-...`，不要删除。

## spec.md 模板

```markdown
---
id: NNNN
title: 简短标题
status: proposed | accepted | superseded-by: NNNN-... | withdrawn
date: YYYY-MM-DD
---

## Context

这是个什么情况？有哪些约束？

## Decision

选了什么。一段话讲清。

## Consequences

什么会变容易、什么会变难、承诺了什么。

## Alternatives considered

简要——每条一两句话——以及为什么没选。
```

## 生命周期

- `proposed` — 写了，还没动手实施。
- `accepted` — 已生效；代码与本仓库内容反映该决策。
- `superseded-by: NNNN-...` — 被取代；保留文件用于历史溯源。
- `withdrawn` — 从未实施；保留以免重新陷入同一争论。

状态变化本身就是 commit（`docs(spec): accept spec-NNNN`）。

## 维护原则

- **新增 spec**：编号 + 文件夹 + 在本 README 索引表加一行。AGENTS.md 不动。
- **改 spec**：附 Changelog 段记录变更。
- **取代 spec**：旧 spec 加 `superseded-by`，新 spec Changelog 写明动机。
- **索引表膨胀（>20 条）时**：按主题分类（如"内容策略 / 工程化 / agent
  harness"），但仍由本 README 单点维护。
