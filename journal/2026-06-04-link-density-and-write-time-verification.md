---
date: 2026-06-04
tags: [content, citation, spec-0002, agent-efficiency, link-checking]
---

## What happened

写第 3 章 §3.3 现代 CSS 特性（1247 行 / 35+ 外链），收尾跑
`pnpm links` 全量 lychee 核验时被用户当场打断："这次的文章内容
很长而且涉及到太多外链了，导致 agent 按照链接有效性检查时花
费了大量的时间"。

时序看代价是怎么累出来的：

1. **写时不核**：边写边在每个子节按"该有一手参考"的位置堆链接，
   没有当场 curl，35+ 条全部累到收尾
2. **收尾全量扫**：`pnpm links` 一次性扫整仓 90+ md/mdx，lychee
   跑了 5.7s + 还要人工筛"哪些是本次造成的、哪些是存量"
3. **修复二次成本**：发现 3 条死链（web.dev/articles/css-cascade-layers
   两处、MDN zh-CN `light-dark` 不存在），又要研究替代 URL、
   逐条 curl 校验、再 Edit、再 lychee 重扫。一条死链的二次修复
   时间约等于写时核验的 5-10 倍

## Root cause

**两个独立动作叠加，单看都"合理"，组合起来代价非线性放大**：

- **写时不核**单看像"先专注内容、链接最后统一查"，但每条链接
  都从一个 URL 升级成"得查替代品 + 重新选词"的复合任务
- **收尾全量扫**单看像"门禁更严格更好"，但本次新增内容的死链
  混在存量已知不可达里（`cssp.app` / `stylifyme.com` 早就 connection
  closed），需要人工二次筛选

SPEC-0002 已经在 2026-05-23 加了「精确引用」条款来管"链接文本
忠实"——这次踩的不是文本忠实，是**链接活性 + 密度**两件 SPEC-0002
原文没显式约束的事。

## Fix

落到三处，按权重：

1. **SPEC-0002 引用规范段** 加「密度上限 + 写时即核验 + 收尾只扫
   本次改动」三条，这是 SSOT。所有 agent / 协作者读 spec 时都看见
2. **agent memory** 只留一行指针 `feedback-link-density-discipline`
   →「以 SPEC-0002 引用规范为准」，不重复写规则细节（避免 SSOT 漂移）
3. **本 journal** 记完整事故链，给未来"为什么 SPEC-0002 加这三条"
   留可追溯证据

## Lessons

1. **agent memory 不是跨会话/跨 agent SSOT**——它是单 agent 私有
   的便条，会话失效或换 agent 就没了。**任何要"未来 agent 都遵守"
   的经验必须落到 specs/ 或 docs/**，memory 只能放"本人下次少绕路"
   的小抄

2. **写时即核 ≫ 收尾全量扫**——一条死链在写时核验 5 秒能解决，
   累到收尾 + 全仓扫 + 人工筛 + 二次修复约 5-10 分钟。35 条 ×
   ROI 差 = 本次浪费的全部时间

3. **门禁工具的范围要匹配 commit 范围**——`pnpm links` 是全量扫，
   适合 weekly maintenance；功能性 commit 改动几个文件时直接
   `lychee <改动文件>`，不要用全量门禁当增量检查工具

## See also

- [SPEC-0002 §引用规范](../specs/0002-content-source-admission/spec.md)
  ——本次修订就是为了堵这个洞
- [content/chapter-03/sections/modern-css.mdx](../content/chapter-03/sections/modern-css.mdx)
  ——犯案现场（修复后），35 条外链全部 200
- [journal/2026-06-04-fabricated-citation-link-text.md](2026-06-04-fabricated-citation-link-text.md)
  ——同一天的另一条 SPEC-0002 相关事故（链接文本编造）
