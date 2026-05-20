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

_TBD_

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
