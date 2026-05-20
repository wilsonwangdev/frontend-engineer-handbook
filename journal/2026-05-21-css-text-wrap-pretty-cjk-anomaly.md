---
date: 2026-05-21
tags: [css, cjk, browser-feature, mobile]
---

## What happened

移动端阅读章节段落时段落宽度"无规律"——有些行占满整行，有些行
明显提前换行。本以为是容器宽度限制问题，但 `prose-cn` 的
`max-width: 72ch` 在 375px 容器内根本没生效（72ch ≈ 720px，
远大于内容区 343px）。

## Root cause

`p` / `li` 上叠加了三个相互冲突的换行属性：

```css
p,
li {
  text-wrap: pretty; /* CSS Text 4，2024 落地 */
  word-break: break-word; /* 非标准属性 */
  overflow-wrap: anywhere; /* 最激进断词策略 */
}
```

`text-wrap: pretty` 的设计目标是英文段落避免末行孤儿字——浏览器
**主动把上一行的字往下挪**让末行不孤立。但在中文段落里反常：每个
汉字都是潜在断点，pretty 算法选择更频繁，叠加 `overflow-wrap: anywhere`
后浏览器在"非自然"位置断行。结果就是用户看到的"有些行提前换行"。

更糟的是 `word-break: break-word` 是非标准属性，浏览器把它当
`overflow-wrap: break-word` 兼容处理，与 `overflow-wrap: anywhere`
直接冲突，行为不确定。

## Fix

简化为单一温和策略（commit `383d93c`）：

```css
p,
li {
  overflow-wrap: break-word;
}
```

只在超长 URL 等情况断词，中文正文按浏览器默认规则换行（最自然）。

## Lesson for next time

**CSS 新特性（特别是 Text Module Level 4 系列）的设计目标几乎都是
英文场景**：`text-wrap: pretty` / `balance` / `nowrap`、`hyphens`、
`line-break` 等。在中文场景下默认行为往往反常，需要单独验证。

写中文站点排版规则时：**不要默认引入新特性**——先用最简单的
`overflow-wrap: break-word`，需要"美化"时单独验证中文效果再启用。

未来素材：这次踩坑是第 3 章「HTML / CSS / 现代布局」的天然案例
（CSS 新特性 vs CJK 适配），也是附录 D「实战避坑录」候选。
