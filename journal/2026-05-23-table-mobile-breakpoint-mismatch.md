---
date: 2026-05-23
tags: [css, mobile, agent-behavior]
---

## What happened

修复 prose 表格在 H5（< 768px）的横向溢出与 CJK 单字换行时，第一版改动用了
`@media (max-width: 639.98px)`（Tailwind 默认 `sm`），与项目其他组件（如
`reading-width-toggle.tsx`、AGENTS.md §10 明文规定的 phone / tablet / desktop
三档：< 768 / 768-1279 / ≥ 1280）不一致。还顺手写了两条无意义的 CSS 选择器
`&[style*="overflow"]::after`、`&:not(:has(table))::after`——前者匹配的是
内联 style 含 "overflow"（项目里 .table-wrapper 不带内联 style），后者匹配
"不含 table 的 table-wrapper"，常规情况永远不会命中。看起来是模型对
"如何检测溢出"自己脑补出的伪 CSS 兜底。

## Root cause

两个独立来源的疏忽：

1. 写新样式时没有先 grep 仓库已有断点约定，直接套用 Tailwind 默认值。
2. 想表达 "只有真正横向溢出时才显示渐变提示"，但 CSS 没有"检测溢出"的
   选择器，只能靠 JS（ResizeObserver / `scrollWidth > clientWidth`）。
   模型不愿放弃这个想法，于是用了两条永远不会按预期工作的属性选择器
   假装做到。

## Fix

- 断点统一改成 `767.98px`（沿用项目"边界 −0.02"惯例避免整数像素重叠）。
- 删除两条伪兜底选择器。可见性策略简化为：默认隐藏 → 移动端 media query
  显示。代价是 PC 窄窗也会看到提示，但项目断点体系下 desktop ≥ 1280px，
  实际表格几乎不会溢出，可接受。
- **二次修正**：第一版还在移动端塞了 `table-layout: fixed`，理由是
  "防止 CJK 单字换行"。但这相当于用"等分列宽"换"不滑动"——"#" / "归位"
  这种 1-2 字短列被拉到和长说明列同宽，整体可读性比横滑还糟。wrapper
  本来就有 `overflow-x: auto` + 渐变提示，移动端横滑是既定可接受方案，
  不该再叠一层 fixed 把短列也撑大。改回 `table-layout: auto`。
- **三次修正**：去掉 fixed 后"#"列仍在窄视口下显示异常（"2.1" 被字符级
  撕成竖排）。根因是 cell 上的 `word-break: break-word` + table
  `width: 100%` 双管齐下：前者允许浏览器在任意字符处断行做内容压缩，
  后者强制表格填满 wrapper 不溢出，组合下来短列被压成 1ch 宽。
  - cells 改回 `word-break: normal`，保留 `overflow-wrap: break-word`。
    后者只有"整词放不下"才断，长 URL 仍能换行，但短 token 不会被撕。
  - 移动端 table 用 `width: max-content; min-width: 100%`：内容能撑
    就撑、超过视口由 wrapper 横滑承接，不再按比例压缩列。
- **四次修正**：上一版改完发现"归位"列（2-3 字）每行还是只能展示 1 字。
  根因是 source order：`@media (max-width: 767.98px) { & table { width:
max-content } }` 写在了 `& table { width: 100% }` 之前，两条规则
  specificity 相同，后定义的 `100%` 覆盖了媒体查询里的 `max-content`，
  移动端规则形同虚设。把媒体查询块移到所有基础 table/cell 规则之后即可。
  教训：在 nested CSS 里写媒体查询时，**先写基础规则、再写覆盖规则**，
  否则同 specificity 下后写的会赢。

提交：见同 commit 与后续 amend / 跟进 commit。

## Lesson for next time

新增任何媒体查询前先 `grep -rn '@media' src/`：项目断点体系是 SSOT，
不要从 Tailwind 默认值反射性下笔。**当一个想法 ("仅在真正溢出时显示")
没法用当前技术（纯 CSS）表达时，要么换技术（JS observer），要么改约束
（移动端无脑显示），不要写假装能工作的代码。**

第二条教训：**遇到一个症状不要顺手叠"看起来稳"的兜底**。`table-layout:
fixed` 看似治住了 CJK 单字换行，实则把所有列拉成一样宽，破坏了内容
本来的信息层级。先想清楚溢出是问题还是可接受方案，再决定要不要"修"。

第三条教训：**`word-break: break-word` 与 `overflow-wrap: break-word`
不可混淆**。前者改变内容压缩的"最小宽度"——浏览器算列宽时认为可以拆到
1ch，于是短列被压扁；后者只在"整词不下"才断行，不改变 min-content 计算。
表格 cell 默认就该用后者；前者只在确知"内容必须能撕碎"才用（罕见）。
配合 `width: 100%` 时尤其危险，会让所有列被等比挤压。
