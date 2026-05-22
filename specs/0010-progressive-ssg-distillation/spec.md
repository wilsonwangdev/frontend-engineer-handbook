---
id: 0010
title: 站点能力的渐进抽离（distillation track）
status: accepted
date: 2026-05-20
---

## Context and Problem Statement

本仓库是用 Next.js 16 + Cache Components 自建的内容站点。当前
**内容层**（章节、frontmatter schema、TierBadge / 三档路径卡片等
手册特定组件）和**基础设施层**（章节树解析、MDX 渲染管线、prev/next
导航、sidebar 等通用能力）耦合在同一份代码里。

随着打磨展开（参见 v0.1.0 后打磨计划 Phase 1-4），需要回答两类问题：

1. **当下决策**：每次"自建 vs 引入成熟方案"取舍时怎么决？
2. **长期方向**：是否把基础设施层做成可独立使用的轻量 SSG 方案？

第二个问题已被业界 [fumadocs](https://fumadocs.dev/) /
[Nextra](https://nextra.site/) / [Starlight](https://starlight.astro.build/) /
[VitePress](https://vitepress.dev/) 等成熟方案占满了红海。按
[SPEC-0008](../0008-pre-action-reflexive-checklist/spec.md) R1
第 3 / 4 问，现在还答不出"独特价值能独立成包吗"，所以**不能现在
就抽离发布**。

但 2026-05-20 会话中用户指出三点关键意图，让"完全不动"也不对：

1. **解耦本身就是好工程**——不依赖是否对外发布的判断
2. **dogfooding 教学价值**——与第 10 章「动手实践」内容定位呼应
3. **跨会话防遗失**——这个长期意图必须写进 specs/，否则下次会话
   扫入口表会丢

于是需要一条 **渐进抽离（distillation）路径**：现在就建立解耦
约束、持续沉淀差异化与替代候选数据，但**不承诺**发布为框架。
等数据攒到某个阈值（或灵感成熟）再开新 SPEC 评估真正抽包。

## Decision Drivers

- **跨会话防遗失**：意图必须被新会话扫入口表捕获
- **解耦优先于发布**：当下目标是独立演化，与对外发布解绑
- **不拖累打磨节奏**：分类只在新增 / 大改时触发，存量不主动迁
- **避免空中楼阁**：通用层 API 进入前必须被产品层实际复用 ≥ 2 处
- **与 SPEC-0007 fork 测试 / SPEC-0008 R1 调研配合**

## Considered Options

- **A. 立刻抽离为 monorepo + npm 发布**：现在就把通用层拆出成独立包
- **B. 立 SPEC 设立 distillation track，渐进抽离（采纳）**：建立解耦
  约束 + 持续沉淀机制，发布与否等数据触发
- **C. 不立 SPEC，靠每次自然演进**：每次改动凭直觉判断耦合
- **D. 直接放弃自建，迁移到 fumadocs**：用成熟方案替换自建实现

## Decision Outcome

选 **B**。建立 distillation track，由以下三层组成：

### 1. 决策原则（打磨期遵守）

新增组件 / 工具时显式分类为"通用层"或"产品层"：

- **通用层**：章节树解析、MDX 渲染管线、prev/next 导航、callout、
  代码块、sidebar、内容加载器、frontmatter 通用字段等
- **产品层**：TierBadge、三档路径卡片、D1-D5 评估清单、手册特定
  schema 字段（tier / paths / lastVerified 等）

约束：

- **通用层禁止依赖产品 schema**：tier / paths / D1-D5 等字段不进
  通用层
- **产品层自由依赖通用层**：反方向永远不行
- **新功能优先用"通用层 API + 产品层 wrapper"实现**：而非一次性
  硬编码
- **不引入 lint 规则强制**：人工 review 即可（与 SPEC 系列一致，
  不二次过度自实现）

### 2. 沉淀机制：`docs/SSG-DISTILLATION.md`

持续记录四类数据，每次打磨遇到相关决策时填充：

- **当前分类清单**：哪些模块属于通用层 / 产品层 / 待分类
- **竞品调研**：fumadocs / Nextra / Starlight 等的差异化对照
- **差异化候选**：现有自建在哪些点上比成熟方案做得更好
- **替代候选**：哪些自建不如直接用成熟方案，下次打磨时替换

文件位置选 `docs/` 而非 `journal/`——journal 记事故，本文件记
设计意图沉淀，性质不同。

### 3. 升级触发（什么时候真正抽包发布）

满足任一条件，开新 SPEC 评估"是否抽离为独立 npm 包发布"：

- **数据触发 a**：内容推进到第 5-6 章，通用层经过多样性内容验证
- **数据触发 b**：差异化候选清单累积 ≥ 3 个 fumadocs / Nextra 明确
  做不好的点
- **调研触发**：完成 fumadocs 等竞品的深度调研报告（至少半页"为
  什么不直接用 fumadocs"）
- **灵感触发（软出口）**：在某次打磨中作者产生强烈"这就是值得发布
  的差异化点"判断；即便客观条件未满足也可开 SPEC，但需要在
  `docs/SSG-DISTILLATION.md` 留一段"驱动我的灵感是什么"，避免
  冲动决策

## Consequences

- **好**：意图写入 specs/，新会话扫入口表自动捕获，跨会话不丢
- **好**：解耦约束让站点维护成本随内容增长是亚线性的
- **好**：第 10 章「动手实践」获得真实演化案例（从单体到分层）
- **好**：升级触发条件让"是否发布"决策有据可依，不靠拍脑袋
- **不好**：分类讨论增加新增 / 大改时的认知成本；缓解：存量代码
  不主动迁，只在新增 / 大改触发分类
- **不好**：`docs/SSG-DISTILLATION.md` 在数据攒齐前会长期看起来"空"；
  这是必要的，不要为了"填满"而填
- **待还的债**：内容到第 5-6 章 或 差异化清单 ≥ 3 条时，复核本 SPEC
  并决定是否开升级 SPEC

## Pros and Cons of the Options

| 选项                     | 好处                                       | 代价                                                  |
| ------------------------ | ------------------------------------------ | ----------------------------------------------------- |
| A. 立刻抽 monorepo + npm | 意图最坚决；代码组织彻底解耦               | 违反 R1（未调研）；发布成本拖累打磨；2 章内容验证不足 |
| **B. 渐进抽离（采纳）**  | 跨会话不遗失；解耦不绑定发布；为升级攒数据 | 仍需自律分类；数据攒齐有周期                          |
| C. 不立 SPEC，自然演进   | 零结构开销                                 | 新会话失忆；无统一标尺                                |
| D. 迁移 fumadocs         | 借用优先，最省精力                         | 失去 dogfooding 教学价值；丢失差异化潜力              |

## Confirmation

如何确认本 SPEC 被遵守：

1. **每次新增 / 大改组件时显式分类**：commit body 一句话答 R10 三问：
   通用层 / 产品层 / 待分类？是否触发新增 SSG-DISTILLATION 条目？是否
   产生值得 journal 记录的非显然踩坑？反射触发器 inline 在
   [AGENTS.md](../../AGENTS.md) §协作准则·10，避免新会话扫不到
2. **季度复核 `docs/SSG-DISTILLATION.md`**（2026-08 首次，与 SPEC-0006
   skills 复核同周期）：
   - 检查分类清单是否随新增组件更新
   - 复核竞品调研 / 差异化 / 替代候选是否有新增
   - 评估是否触达升级条件
3. **不引入 lint 自动校验**——与 SPEC-0008 一致，避免二次过度自实现；
   作者自律 + 季度复核即可

## More Information

### 相关 SPEC

- [SPEC-0007](../0007-open-source-asset-boundary/spec.md) — fork 测试。
  通用层符合"其他人 fork 改自己手册"的可复用资产边界，本 SPEC 给
  SPEC-0007 提供具体落地通道
- [SPEC-0008](../0008-pre-action-reflexive-checklist/spec.md) R1 —
  写工具前调研。本 SPEC 的"升级触发"条款 = R1 第 3 / 4 问的延伸：
  等业界调研完成、独特价值能答清楚，再决定抽包发布
- [SPEC-0005](../0005-companion-tracks-and-test-strategy/spec.md) —
  附录 D 实战避坑录。distillation 过程中的踩坑可升级为附录 D 素材

### 业界对照

主要竞品：[fumadocs](https://fumadocs.dev/) / [Nextra](https://nextra.site/) /
[Starlight](https://starlight.astro.build/) / [VitePress](https://vitepress.dev/) /
[Rspress](https://rspress.dev/) / [Docusaurus](https://docusaurus.io/)。
详细差异化对照持续记录在 [docs/SSG-DISTILLATION.md](../../docs/SSG-DISTILLATION.md)。

### 触发本 SPEC 的会话

2026-05-20 会话讨论 v0.1.0 后打磨计划时，用户提出"把站点构建过程
作为第 10 章实践素材 + 逐步孵化通用 SSG 方案"两个相关意图。本 SPEC
为这两个意图建立长期通道。

## Changelog

- 2026-05-20：初次落地。
- 2026-05-22：反射触发器 inline 进 AGENTS.md §协作准则·10，强化
  "改站点能力时分类 + 沉淀"的 commit-time 自检。动因：实测 2026-05-22
  会话连落 3 件基建（lychee / 侧栏高亮 / 代码块高亮）均未触发分类讨论，
  也未更新 SSG-DISTILLATION.md——SPEC 写得明白但缺反射触发器。
