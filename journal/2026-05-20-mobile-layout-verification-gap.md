---
date: 2026-05-20
tags: [ui, mobile, agent-behavior, verification]
---

## What happened

移动端布局和交互出现多个体验问题：抽屉点击外部未关闭、遮罩
backdrop-blur 性能差且视觉不清晰、缺少显式关闭按钮（热区不直观）、
表格列过窄导致文字多次换行、内容区 padding 在窄屏上太宽。

这些问题在 agent-master-handbook 项目中已经踩过一次。本项目使用
"最新成熟最佳实践"构建（Next.js 16 + Tailwind 4），技术栈不是
问题——问题是 agent 写完组件后只跑 `pnpm build` 验证编译通过，
没有在 375px 视口下目视验证。

## Root cause

agent 的验收流程缺少"移动端体验验证"环节。`pnpm build` 通过 +
`pnpm type-check` 通过只能证明代码正确，不能证明体验合格。

交互组件（抽屉/弹窗/下拉）有一套基本模式（点击外部关闭 / ESC /
显式关闭按钮 / body scroll lock），agent 没有 checklist 约束
必须逐项确认。

## Fix

1. 抽屉：遮罩改为纯色 bg-black/40 + onClick 关闭 + ESC document
   级监听 + 显式 X 按钮 + body overflow hidden
2. 表格：去掉 white-space: nowrap 统一设置，只保留 th nowrap
3. 布局：padding 移动端收窄 px-4、标题渐进字号、prev/next 纵向堆叠
4. GOTCHAS G.4 升级：UI 组件提交前必须移动端验收

## Lesson for next time

**UI 组件提交前必须在 375px 视口下目视验证**。交互组件必须验证
三件套：点击外部关闭、ESC 关闭、显式关闭按钮。`pnpm build` 通过
不等于体验合格——这是 agent 行为模式缺陷，不是技术栈问题。
