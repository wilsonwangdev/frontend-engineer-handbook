---
date: 2026-06-04
tags: [content, citation, spec-0002, agent-behavior]
---

## What happened

写第 3 章 §3.3 现代 CSS 特性 §4.4「`:has()` 性能注意」时，正文讲完
"避免 `:has()` 套全局选择器""避免深嵌套"等几条经验后，习惯性地在
段尾加了一行「一手参考」：

```mdx
一手参考：[`:has()` 性能 · web.dev](https://web.dev/blog/has-pseudo-class) **（英文）** +
[CSS Selectors Level 4 §:has()](https://drafts.csswg.org/selectors-4/#has-pseudo) **（英文）**。
```

链接 URL 是真实存在的（`web.dev/blog/has-pseudo-class`），但**链接
文本「`:has()` 性能」没有核实过**——纯粹是因为正文段落主题是性能、
顺手把链接文本也改成了"性能"。用户读到时直接质疑："和性能有什么
关系"。

## Root cause

**根因是写引用时跳过了 SPEC-0002 修订条款的"精确引用"流程**。
SPEC-0002 在 2026-05-23 修订（commit 73aa9fb）就是为了堵这个洞——
要求"链接文本必须忠实描述目标内容"。但本次违规：

1. **没访问目标 URL** 确认其实际主题
2. **凭上下文推断**链接文本——上文讲 `:has()` 性能，下文加引用就
   写成"`:has()` 性能"。这是典型的"看着应该是这个意思"的偷懒
3. **复合引用粘合**——把不同主题的多条链接用 `+` 连成一段，结果
   笼统的描述会把第一条强行套进去

实际上 web.dev 这篇文章（按搜索结果看）是 `:has()` 的**通用介绍**
（功能 + 用法 + 浏览器支持），不是性能专项。规范页倒是规范，但
"性能"这个限定词只属于正文的论述、不属于规范文档本身。

## Fix

改为不带性能断言的中性描述 + 明确性能信息的真实出处：

```mdx
一手参考：[CSS Selectors Level 4 §:has()](https://drafts.csswg.org/selectors-4/#has-pseudo) **（英文）** ——
`:has()` 的规范定义。浏览器性能优化实现细节参考各浏览器发布博客
（Chrome / Safari / Firefox 的 release notes）。
```

两个改动：

- **删掉无法核实的 web.dev 链接**——找不到一手就不要凑数
- **诚实拆分主题**：规范页负责"是什么"，性能数据指向"各浏览器
  release notes"（这是性能数据真正的一手来源）

## Lessons

1. **写引用时必访问目标 URL**——不是"应该是这个主题"，而是"我看
   过这页确实在讲 X"。这是 SPEC-0002 修订条款的字面执行，本次
   破例就破在"省那一步访问"
2. **复合引用最容易出问题**——`a + b` 这种粘合句式让笼统描述把
   不能笼统描述的链接套进去。**宁可拆成两段**，也别凑成一句
3. **凑不出一手就不要凑**——找不到精确的一手参考时，删掉这行 /
   降级为"参考各浏览器 release notes"这种**不撒谎的笼统说法**，
   比编一个具体但错的链接文本好

## See also

- [SPEC-0002 §精确引用条款](../specs/0002-content-source-admission/spec.md)
  ——本次破的就是这条
- 修复 commit：本次会同 §3.3 打磨一起提交
- [content/chapter-03/sections/modern-css.mdx §4.4](../content/chapter-03/sections/modern-css.mdx)
  ——修复后的引用段
