# specs/

SPEC 驱动的决策记录。一个 spec 一个文件夹。代码体现**做什么**、git 历史
体现**何时做**，spec 解释**为什么这么做**。

## 标准对标：MADR v4

本项目的 SPEC 即 **ADR**（Architecture Decision Record / 架构决策记录），
对标 [MADR v4](https://adr.github.io/madr/) 社区标准。新 SPEC 需要遵守
[Status 取值](#status-取值madr-v4-标准) 与下方模板。

**约束方式**：人工 review + 模板示范，不引入自动化校验工具。理由：

- 7 个 SPEC 体量小，单作者审稿可控
- 业界已有 [`@lordcraymen/adr-toolkit`](https://www.npmjs.com/package/@lordcraymen/adr-toolkit)、
  [`remark-lint-frontmatter-schema`](https://github.com/JulianCataldo/remark-lint-frontmatter-schema)
  等成熟方案；本项目自写校验属于过度特化（详见
  [journal/2026-05-20-premature-tool-self-implementation.md](../journal/2026-05-20-premature-tool-self-implementation.md)）
- 真正出错的不是 status 字符串拼写，而是判断决策错误——自动化管不了
- 若未来 SPEC 增长到几十条或有外部贡献者，再评估引入社区方案

**为什么不用 spec-kit / OpenSpec**：那两个工具解决的是"从零开发新 feature
的工作流"（propose → plan → tasks → implement），不是"决策记录"。本项目
当前阶段的 SPEC 都是决策记录类型。未来若做大型 feature 开发，再评估
spec-kit / OpenSpec；ADR 与 feature spec 可以并存。

### 与原版 MADR 的本地化适配

| 维度      | MADR 原版                  | 本项目                                    | 原因                               |
| --------- | -------------------------- | ----------------------------------------- | ---------------------------------- |
| 文件位置  | `docs/adr/nnnn-title.md`   | `specs/nnnn-title/spec.md`                | 用子目录支持 notes.md / assets/    |
| 文件名    | `nnnn-title.md` kebab-case | 子目录名 kebab-case，主文件统一 `spec.md` | 校验脚本只需扫一种文件名           |
| 语言      | 英文                       | 中文为主（章节名保留英文以对齐）          | 与项目"中文为主"约定一致           |
| 历史 SPEC | —                          | 0001–0007 用 minimal 变体免重写           | MADR v4 显式支持 minimal/bare 变体 |

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

## Status 取值（MADR v4 标准）

| 值           | 含义                                                              |
| ------------ | ----------------------------------------------------------------- |
| `proposed`   | 写了，还没动手实施                                                |
| `accepted`   | 已生效；代码与本仓库内容反映该决策                                |
| `rejected`   | 评估后否决；保留以免重新争论                                      |
| `deprecated` | 曾经生效，现在不再推荐使用，但还未被新 SPEC 正式取代              |
| `superseded` | 被其他 SPEC 取代；新决策在 More Information 段链接到取代它的 SPEC |

> 历史本项目曾用过 `withdrawn` / `superseded-by: NNNN-...`——这些**不再
> 允许新增使用**。校验脚本会拒绝。

## 目录结构

```
specs/
└── NNNN-short-kebab-slug/
    ├── spec.md       # 决策本身（必需）
    ├── notes.md      # 可选：更长的探索记录、权衡的备选
    └── assets/       # 可选：图、benchmark 数据、截图
```

编号单调递增，永不复用。slug 用 kebab-case 英文名词短语（与 MADR 标题
风格一致）。

## spec.md 模板（MADR full）

新 SPEC 使用以下模板。**章节标题必须严格匹配**，校验脚本会检测。

```markdown
---
id: NNNN
title: 简短名词短语（同时反映问题与解法）
status: proposed | accepted | rejected | deprecated | superseded
date: YYYY-MM-DD
---

## Context and Problem Statement

这是个什么情况？哪些约束促使必须做决策？两到三段话讲清。

## Decision Drivers

- 关键考量 1
- 关键考量 2

## Considered Options

- 选项 A
- 选项 B
- 选项 C

## Decision Outcome

选了哪个选项及简短理由。一段话讲清。

## Consequences

- 好：…
- 不好：…
- 待还的债：…

## Pros and Cons of the Options

### 选项 A

- 好处：…
- 代价：…

### 选项 B

- 好处：…
- 代价：…

## Confirmation

如何验证这条决策被遵守？校验脚本、code review checklist、CI 步骤、定期
复核机制等。

## More Information

引用、相关 SPEC、外部资料。如果本 SPEC 取代了某条旧 SPEC，在此说明
（"This SPEC supersedes SPEC-NNNN"）。
```

**最简版**（MADR minimal，适用于决策直接、无需展开 trade-off 的情况；
历史 0001–0007 即此风格）：

```markdown
---
id: NNNN
title: 简短标题
status: accepted
date: YYYY-MM-DD
---

## Context and Problem Statement

…

## Decision Outcome

…

## Consequences

…
```

## Review 检查清单（写新 SPEC 时人工对照）

写完 SPEC 后、提交前自查：

- [ ] 路径符合 `specs/NNNN-<kebab-slug>/spec.md`
- [ ] frontmatter 含 `id` / `title` / `status` / `date` 四个必填字段
- [ ] `status` 取值在 MADR v4 枚举内（`proposed` / `accepted` / `rejected` / `deprecated` / `superseded`）
- [ ] `date` 是 `YYYY-MM-DD` 格式
- [ ] frontmatter 的 `id` 与目录前缀编号一致
- [ ] 新 SPEC（id ≥ 0008）含 MADR 必需章节：
      `Context and Problem Statement` / `Decision Outcome` / `Consequences`
- [ ] 在本 README 顶部"索引"表加一行

PR review 时同样对照本清单。

## 生命周期

新增 → `proposed` → 实施完成后 `accepted`。

若需停用：

- 计划被取代 → `superseded`（在 More Information 链到新 SPEC）
- 已不推荐但无替代 → `deprecated`
- 评估后否决 → `rejected`

状态变化本身就是 commit（`docs(spec): supersede spec-NNNN`）。

## 维护原则

- **新增 spec**：编号 + 文件夹 + 在本 README 索引表加一行。AGENTS.md 不动。
- **改 spec**：附 Changelog 段记录变更。
- **取代 spec**：旧 spec 改 `status: superseded`，新 spec More Information
  段写明 "This SPEC supersedes SPEC-NNNN"。
- **索引表膨胀（>20 条）时**：按主题分类，但仍由本 README 单点维护。

## 参考资料

- [MADR v4 模板](https://adr.github.io/madr/) ——本项目对标的标准
- [adr.github.io](https://adr.github.io/) ——ADR 总入口
- [Michael Nygard 原版 ADR 模板](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) ——ADR 概念起源
- [github/spec-kit](https://github.com/github/spec-kit) ——feature 开发流程工具（未来评估）
- [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) ——变更提案工作流（未来评估）
