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

提交：见同 commit。

## Lesson for next time

新增任何媒体查询前先 `grep -rn '@media' src/`：项目断点体系是 SSOT，
不要从 Tailwind 默认值反射性下笔。**当一个想法 ("仅在真正溢出时显示")
没法用当前技术（纯 CSS）表达时，要么换技术（JS observer），要么改约束
（移动端无脑显示），不要写假装能工作的代码。**
