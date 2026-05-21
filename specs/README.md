# specs/

SPEC 驱动的决策记录。一个 spec 一个文件夹。代码体现**做什么**、git 历史
体现**何时做**，spec 解释**为什么这么做**。

对标 [MADR v4](https://adr.github.io/madr/)。模板、Review 检查清单、
参考资料见 [\_meta/template-and-standard.md](_meta/template-and-standard.md)。

## 索引（按编号）

| #                                                       | 标题                       | 状态     | 适用场景                                                            |
| ------------------------------------------------------- | -------------------------- | -------- | ------------------------------------------------------------------- |
| [0001](0001-scope-and-audience/spec.md)                 | 范围与读者                 | accepted | 战略级；决定章节是否值得写                                          |
| [0002](0002-content-source-admission/spec.md)           | 内容来源准入               | accepted | 写章节正文、添加外链时                                              |
| [0003](0003-table-of-contents/spec.md)                  | 目录结构与章节归位         | accepted | 设计新章节 / 决定内容放哪一档                                       |
| [0004](0004-ai-delegation-criteria/spec.md)             | AI 可委托清单判断依据      | accepted | 第 1 章 / 涉及"什么任务可委托给 AI"的判断                           |
| [0005](0005-companion-tracks-and-test-strategy/spec.md) | 番外（附录 D）+ 测试策略   | accepted | 写 e2e 测试 / 把 journal 升级为附录条目时                           |
| [0006](0006-agent-skills-system/spec.md)                | Agent harness skills 体系  | accepted | 新增 skill / 选用社区 skill / 评估 MCP 集成时                       |
| [0007](0007-open-source-asset-boundary/spec.md)         | 开源资产边界               | accepted | **每段开源内容写入前必查**（元规则）                                |
| [0008](0008-pre-action-reflexive-checklist/spec.md)     | 动手前的反射性检查清单     | accepted | **写工具 / 改 git 历史 / 扩文档前必查**（元规则）                   |
| [0009](0009-release-cadence-and-versioning/spec.md)     | 发布节奏、版本号、历史版本 | accepted | 打 release 前必查；临近 v1.0.0 时再开新 SPEC 锁定历史版本实现       |
| [0010](0010-progressive-ssg-distillation/spec.md)       | 站点能力的渐进抽离         | accepted | 新增 / 大改组件时分类通用 / 产品层；评估自建 vs 引入成熟方案        |
| [0011](0011-content-accessibility-standard/spec.md)     | 内容可读性标准             | accepted | **写章节正文前必查**——5 项准则 + 4 问清单 + 反例库                  |
| [0012](0012-performance-baseline-and-ci-gate/spec.md)   | 性能基准与 CI 门禁         | proposed | 立 Lighthouse CI 基准；首屏优化按数据驱动；阶段 1 完成后转 accepted |
| [0013](0013-design-principles-as-undercurrent/spec.md)  | 设计原则作为整站暗线       | accepted | 写章节正文遇到设计模式 / 分层 / 模块化时；判断是否点破              |

新增 spec 时**只动这张表**，不动 AGENTS.md。

## 什么时候写 spec

任意一条 yes → 写 spec：

- 这是一个有多个合理答案的决策吗？
- 决策会影响未来工作（架构、数据模型、公共 API、构建管线等）吗？
- 未来 agent 仅靠读代码无法重建这个理由吗？

**不要为以下情况写 spec**：琐碎实现细节、看代码就能明白的事、
投机性的未来工作（等真要做时再写）。

## Status 取值

| 值           | 含义                                       |
| ------------ | ------------------------------------------ |
| `proposed`   | 写了，还没动手实施                         |
| `accepted`   | 已生效；代码与内容反映该决策               |
| `rejected`   | 评估后否决；保留以免重新争论               |
| `deprecated` | 曾经生效，现在不再推荐，但未被新 SPEC 取代 |
| `superseded` | 被其他 SPEC 取代                           |

## 目录结构

```
specs/
├── _meta/            # 模板、标准、检查清单（一次性参考）
└── NNNN-short-slug/
    ├── spec.md       # 决策本身（必需）
    ├── notes.md      # 可选：探索记录
    └── assets/       # 可选：图、数据
```

编号单调递增，永不复用。slug 用 kebab-case 英文。

## 维护原则

- **新增**：编号 + 文件夹 + 在本 README 索引表加一行。AGENTS.md 不动。
- **改**：附 Changelog 段记录变更。
- **取代**：旧 spec 改 `status: superseded`，新 spec 写明取代关系。
- **索引表 > 20 条时**：按主题分类，仍由本 README 单点维护。

## 生命周期

新增 → `proposed` → 实施完成后 `accepted`。
停用：`superseded`（有替代）/ `deprecated`（无替代）/ `rejected`（否决）。
状态变化本身就是 commit。
