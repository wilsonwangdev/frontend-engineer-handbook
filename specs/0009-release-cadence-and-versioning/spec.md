---
id: 0009
title: 发布节奏、版本号规则、与历史版本维护设计
status: accepted
date: 2026-05-20
---

## Context and Problem Statement

首次公网发布（M1）完成后，需要为项目立"发布"这件事的规则。当前没有
明文约定会导致：

- 版本号怎么打？SemVer 对内容站语义别扭（加一章是 minor 还是 patch？）
- 何时打 release？任何 commit 都打 → 噪声爆炸；从不打 → 失去版本锚点
- 历史版本如何让读者访问？v1.0 后必然有"老读者引用过老内容"的需求
- release 前要检查什么？避免推一个 CI 红或站点宕的 release

业界对照（同类内容 / handbook 项目）显示多数没有正式 release——
[yangshun/front-end-interview-handbook](https://github.com/yangshun/front-end-interview-handbook)
和 [wilsonwangdev/agent-master-handbook](https://github.com/wilsonwangdev/agent-master-handbook)
都没有 release / tag / CHANGELOG。但本项目想"借此立规则"，让 release
成为里程碑的稳定锚点 + 历史版本的入口。

## Decision Drivers

- **内容站不是 npm 库**——没有 API 兼容性语义；SemVer 强行套别扭
- **里程碑维度已存在**（ROADMAP 里程碑段）——release 应当与之耦合
  而非另立轨道
- **质量门禁优先于版本号**——CI 红 / 站点宕的发布无意义
- **历史版本是真实需求**——读者引用某节后内容更新会破坏外部链接；
  v1.0 后必须解决，但 v1.0 前没必要先实现
- **不引入自动化工具**（与 SPEC-0006 / 0008 一致）——`gh release create`
  够用，避免重复引入 release-please / semantic-release / changesets 这种
  在 npm 库场景有意义但内容站过度的工具

## Considered Options

- **A. 里程碑驱动 + 自然版本号 `v0.X.0`**（与里程碑 1:1）
- **B. CalVer 月度** `2026.05` / `2026.06`（按日历自动）
- **C. release-please bot 自动化**（强 SemVer + 自动 changelog）
- **D. 不打 release**，靠 git log + GitHub Releases 自然生成

## Decision Outcome

**选 A**——里程碑驱动 + 自然版本号 `v0.X.0`，不强制 SemVer 语义。

### 触发条件

ROADMAP 里程碑段新增一行 → 触发一次 `gh release create`。

### 版本号策略

- 主干版本号格式：`vMAJOR.MINOR.PATCH`，但**不承担 SemVer 兼容性含义**
- v1.0.0 之前：仅用 `MINOR` 自然递增（`v0.1.0` / `v0.2.0` / ...），全部
  标 `--prerelease`
- v1.0.0 留给"主干 10 章完成"这个里程碑
- v1.0.0 之后：仍用里程碑驱动，但开始承担"内容稳定承诺"——见下方
  历史版本维护设计

### 命名与 release notes

- Tag: `v0.X.0`
- Title: `v0.X.0 — <里程碑标题>`（例：`v0.1.0 — 首次公开可访问版本`）
- Notes: 自由组织，但必须含：
  - 对应 ROADMAP 里程碑段的链接
  - 本 release 包含的关键 SPEC / 章节 / 站点变化（高层次，不抄 commit log）
  - 已知问题（已记入待还的债的事项）

### 发布前置条件（每次 `gh release create` 前必过）

1. ✅ **CI 绿**：`gh run list --branch main --limit 1` 状态 = `completed/success`
2. ✅ **公网可访问**：`curl -fsS https://frontend-engineer-handbook.vercel.app/ -o /dev/null` 返回 200
3. ✅ **本地构建绿**：`pnpm build` 零警告
4. ✅ **目标 commit 已 push 到 origin/main**
5. ✅ **里程碑条目已写入 ROADMAP 里程碑段**

任一不过 → 不打 release。修完再发。

### 历史版本维护（设计；v1.0.0 后实现）

**v1.0.0 之前**：所有 release 标 `--prerelease`；**不维护历史可访问版本**；
读者永远看 latest deployment。

**v1.0.0 起**：每个 major release 必须有独立可访问的历史快照 URL。
具体实现方式**1.0 临近时再选**，本 SPEC 仅列候选：

| 候选 | 实现思路                                                             | 优点               | 代价                                               |
| ---- | -------------------------------------------------------------------- | ------------------ | -------------------------------------------------- |
| A    | Per-major Vercel project（v1.frontend-engineer-handbook.vercel.app） | 完全隔离、SEO 友好 | 每 major 增一个 Vercel project，运维变多           |
| B    | 同 project 的路径前缀（/v1/...、/v2/...）                            | 单一部署、最少基建 | Next.js 路由复杂度增；旧版本构建链可能被新依赖卡住 |
| C    | 仅 GitHub Release artifact（静态产物 zip 上传）                      | 零部署成本         | 读者要下载本地起 server 才能看；体验差             |

业界对照：Next.js / Astro / Vue.js docs 用 A；中小型文档站用 B；偏存档
用 C。**预判选 A**，但不在此 SPEC 锁定——临近 1.0 时根据当时的 Next.js
/ Vercel 能力再决定。

### 工具与自动化

- `gh release create` 手动调用
- 不引入 release-please / semantic-release / changesets
- CHANGELOG.md 不另立——GitHub Releases 页面即是 changelog

### 不修订旧 release

打出去的 release notes 立刻冻结。发现错误 → 在下一 release 的 notes 里
"勘误"段说明，**不编辑历史 release**（与 git history 同样的不可变原则）。

## Consequences

- 每个 ROADMAP 里程碑都有显式 release 锚点，方便外部引用 + 未来历史
  版本切换
- 5 项前置条件让 release 成为"质量门禁的合格证"——红 CI / 宕站点
  不可能发出去
- 不引入新工具，运维成本最低（与 SPEC-0006 / 0008 一致）
- 历史版本设计只立"v1.0 后必须做"的约定，不锁实现方案——保留临近
  时根据生态选最优解的灵活性
- v1.0.0 前所有 release 是 prerelease，对外读者不会被未稳定的内容
  误导；同时项目可以从 v0.1.0 起对每个里程碑打锚

## Pros and Cons of the Options

### A 里程碑驱动 + `v0.X.0`（采纳）

- 好处：与已有 ROADMAP 里程碑段天然耦合；不强制 SemVer 语义；零自动化
- 代价：依赖人为判断"是不是里程碑"——但本项目里程碑段已有明确的判断标准

### B CalVer 月度

- 好处：节奏稳定、机械可执行
- 代价：易"空发布"（某月无里程碑也打）或"延迟里程碑"（跨月里程碑被
  切碎）；对内容站语义没价值

### C release-please bot

- 好处：完全自动化、与 conventional commits 链接
- 代价：强 SemVer 假设，内容站没意义；自动化破坏当前手动 review 节奏；
  违反 SPEC-0006 / 0008 "借用优先 + 不过度自动化"

### D 不打 release

- 好处：零运维
- 代价：失去版本锚点——外部读者引用某节后无法定位"那时的版本"

## Confirmation

- **每次 release 时**：5 项前置条件全过 → 才允许执行 `gh release create`
- **每季度复核**：检查近 3 个月的 release 是否都对应 ROADMAP 里程碑
  （不应该有里程碑没 release / release 没里程碑的脱节）
- **临近 v1.0.0**：触发历史版本维护方案讨论，在新 SPEC（0009 修订或
  新编号）里锁定实现路径

## More Information

### 业界对照

- [Semantic Versioning](https://semver.org/) — 我们刻意不严格遵守，
  仅借用 `MAJOR.MINOR.PATCH` 格式
- [Calendar Versioning](https://calver.org/) — 已评估为不适合
- [Keep a Changelog](https://keepachangelog.com/) — 我们用 GitHub
  Releases 替代独立 CHANGELOG.md
- [yangshun/front-end-interview-handbook](https://github.com/yangshun/front-end-interview-handbook)、
  [wilsonwangdev/agent-master-handbook](https://github.com/wilsonwangdev/agent-master-handbook)
  ——同类项目均未正式 release；本 SPEC 是本项目"借此立规则"的产物

### 相关 SPEC

- [SPEC-0006](../0006-agent-skills-system/spec.md) — 不引入过度工具
  原则在 release 工具选择上同样适用
- [SPEC-0008](../0008-pre-action-reflexive-checklist/spec.md) — R1
  "借用优先"指导本 SPEC 拒绝 release-please / semantic-release 等
  自动化工具

### 第一次 release

`v0.1.0 — 首次公开可访问版本`，对应 ROADMAP 里程碑段 2026-05-20 "首次
公网发布" 条目，绑定到 commit `657b887` 或之后包含 SPEC-0009 落地的
commit。
