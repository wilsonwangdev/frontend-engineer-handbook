---
id: 0012
title: 性能基准与 CI 门禁（performance baseline and CI gate）
status: proposed
date: 2026-05-21
---

## Context and Problem Statement

2026-05-21 用户在移动端访问站点时观察到加载进度缓慢、长尾资源持续
请求的现象。本项目当前**没有性能基准**：

- 已接入 Vercel Speed Insights / Web Analytics（运行时观测），但
  没有 CI 门禁——回归无法在合并前拦截
- ROADMAP 候补池列了「Lighthouse CI」但未实施
- 怀疑根因：Noto Sans SC 中文字体未子集化（完整字体 1MB+）、
  Cache Components 分包策略未优化、第三方脚本阻塞——但**没有数据
  支撑**，凭印象优化等于赌

随着内容章节增加（每章可能引入新组件、新外链、新字体子集），如果
不立基准、不进 CI，性能会无声地恶化。等读者抱怨时再修，代价远高于
立刻拦截。

需要一份决策：**用什么工具量化性能、设什么阈值、在 CI 哪个环节拦
回归、首屏优化做哪些**。

## Decision Drivers

- 必须可量化 + 可在 CI 拦截，不能只靠人工感受
- 工具选型遵循 SPEC-0008 R1：业界候选优先，避免自写
- 阈值不能太严（每次小改都过不了 CI）也不能太松（等于没设）
- 不引入复杂工具链——SPEC-0008 系列一致原则
- 优化项要按数据驱动决定优先级，不凭印象
- 与 SPEC-0010 配合：性能基础设施属于通用层，未来可抽离

## Considered Options

### A. Lighthouse CI（采纳候选）

`@lhci/cli` + GitHub Actions 集成：

- **好处**：业界主流；社区成熟；同时覆盖 Performance / Accessibility /
  Best Practices / SEO；脚本配置 < 50 行；GitHub PR 自动评论分数；
  支持设置阈值断言；免费
- **代价**：每次 PR 跑一次 Lighthouse 增加 ~1 分钟 CI 时间；首次配置
  需要决定阈值和忽略项

### B. Vercel Speed Insights（已接入，但作为 CI 门禁不够）

- **好处**：已接入站点，运行时真实用户数据
- **代价**：是观测工具不是门禁工具——不能在合并前拦截回归；阈值
  需要等数据积累；移动端样本可能不足

### C. WebPageTest API

- **好处**：测试更细致（可指定不同地区 / 设备）
- **代价**：API 收费；配置复杂；本项目当前规模过度

### D. 不立基准，凭人工感受

- **好处**：零工程开销
- **代价**：性能会无声恶化；用户已观察到问题就是证据

## Decision Outcome

**采纳 A**（Lighthouse CI）作为 CI 门禁，**保留 B**（Vercel Speed Insights）
作为运行时观测——两者互补。

### 实施分阶段（每阶段独立 commit）

**阶段 1：建立基准（不设硬门禁）**

1. `pnpm add -D @lhci/cli`
2. `lighthouserc.cjs` 配置：跑 `/`、`/chapter-00`、`/chapter-01` 三个页面，
   桌面端 + 移动端各一次
3. `.github/workflows/` 加 `lighthouse.yml`，PR 触发，结果上传 GitHub
   Actions Artifact + PR 评论
4. **第一周**仅观测，不 fail CI——收集真实基线数据

**阶段 2：设置阈值（基线建立后）**

基于阶段 1 数据，在 `lighthouserc.cjs` 加 `assert` 配置。初始阈值
建议（保守，不卡日常打磨）：

| 指标           | 移动端阈值 | 桌面端阈值 | 触发时 |
| -------------- | ---------- | ---------- | ------ |
| Performance    | ≥ 80       | ≥ 90       | error  |
| Accessibility  | ≥ 90       | ≥ 90       | error  |
| Best Practices | ≥ 90       | ≥ 90       | warn   |
| SEO            | ≥ 90       | ≥ 90       | warn   |
| LCP            | ≤ 2.5s     | ≤ 2.0s     | error  |
| TBT            | ≤ 300ms    | ≤ 200ms    | warn   |
| CLS            | ≤ 0.1      | ≤ 0.1      | error  |

阈值随基线数据调整——不是一成不变。

**阶段 3：首屏优化项（数据驱动）**

阶段 1 数据出来后再决定优先级。当前**怀疑但未验证**的优化项：

- **字体子集化**：`next/font/google` 引入的 Noto Sans SC 是否已自动
  子集化？需要 bundle analyzer 验证。如未子集化，按汉字常用字表（GB2312
  ~6700 字 / 通用规范汉字表 ~8100 字）做子集
- **Cache Components 分包**：检查 `_app` chunk 是否过大；按章节代码分割
- **第三方脚本**：Vercel Analytics + Speed Insights 是否都用 `next/script`
  的 `lazyOnload` 策略
- **图片优化**：当前无图片，未来章节引入时统一用 `next/image`
- **Preload 关键资源**：字体 woff2、首屏 CSS

### CI 集成位置

- **PR 触发**：每个 PR 自动跑 Lighthouse，结果评论到 PR
- **阶段 1**：仅作信息展示，不阻塞合并
- **阶段 2 起**：error 级别断言失败 → 阻塞合并；warn 级别仅提示
- **不在 push 触发**：避免每次 push 都跑（CI 配额浪费）

## Consequences

- **好**：性能回归在合并前被拦截，不依赖用户抱怨
- **好**：阈值数据驱动调整，不凭印象设
- **好**：未来增章 / 加组件时自动得到性能反馈
- **好**：首屏优化按数据驱动决定优先级
- **不好**：每个 PR 多约 1 分钟 CI 时间
- **不好**：首次配置 + 基线建立需要 1-2 个完整工作周期
- **待还的债**：阶段 2、阶段 3 都是后续 commit，本 SPEC 落地只完成
  阶段 1 配置
- **状态说明**：`status: proposed`——决策已定，但实施尚未开始；
  阶段 1 完成后改为 `accepted`

## Pros and Cons of the Options

| 选项                         | 好处                              | 代价                               |
| ---------------------------- | --------------------------------- | ---------------------------------- |
| **A. Lighthouse CI（采纳）** | 业界主流；多维覆盖；CI 拦截；免费 | PR 多 1 分钟 CI；首次配置成本      |
| B. Vercel Speed Insights     | 真实用户数据；已接入              | 是观测不是门禁；不能在合并前拦截   |
| C. WebPageTest API           | 测试更细                          | API 收费；配置复杂；本项目规模过度 |
| D. 不立基准                  | 零工程开销                        | 性能会无声恶化；已观察到问题       |

## Confirmation

如何确认本 SPEC 被遵守：

1. **阶段 1 完成标志**：`lighthouserc.cjs` 提交、`lighthouse.yml` workflow
   提交、PR 看到自动评论 + Lighthouse 报告 Artifact
2. **阶段 2 完成标志**：`lighthouserc.cjs` 含 `assert` 配置；首次 fail
   CI 应该是真实回归而非配置过严
3. **阶段 3 完成标志**：`docs/SSG-DISTILLATION.md` 通用层加入字体子集化
   等具体方案的决策记录
4. **季度复核**（与 SPEC-0006 / 0010 / 0011 同周期）：复核阈值是否
   仍合理、是否有新优化项

## More Information

### 相关 SPEC

- [SPEC-0008](../0008-pre-action-reflexive-checklist/spec.md) R1 — 写工具
  前调研。本 SPEC 选 Lighthouse CI 即遵循 R1
- [SPEC-0010](../0010-progressive-ssg-distillation/spec.md) — distillation
  track。性能基础设施属于通用层，符合 fork 测试
- [SPEC-0006](../0006-agent-skills-system/spec.md) — skills 体系。
  未来 `lighthouse-budget-tuning` 可作为 Layer 2 项目内 skill 候选

### 业界对照

- [@lhci/cli](https://github.com/GoogleChrome/lighthouse-ci) — Google
  Chrome 团队官方维护
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights) — 运行时
  观测，已接入
- [WebPageTest](https://www.webpagetest.org/) — 更细的多地区 / 多设备测试

### 触发本 SPEC 的会话

2026-05-21 会话中用户在移动端观察到"加载进度缓慢 + 长尾资源持续请求"
现象，提议立基准 + 进 CI。

## Changelog

- 2026-05-21：初次提案。status: proposed，阶段 1 完成后改 accepted。
