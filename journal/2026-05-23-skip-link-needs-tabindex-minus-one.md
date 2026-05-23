---
date: 2026-05-23
tags: [a11y, focus-management, skip-link, accessibility]
---

## What happened

写第 3 章 §3.2 语义化 HTML 时，扫 `src/components/` 自验证发现手册
缺 skip-to-content link。给 `(handbook)/layout.tsx` 加了：

```tsx
<a href="#main" className="sr-only focus:not-sr-only ...">
  跳到主内容
</a>
```

视觉验证通过——按 Tab 左上角弹出按钮、看着没问题，自以为修好了。
用户帮测时按 Enter 后**焦点纹丝不动**——skip link 失效。

## Root cause

`href="#main"` 仅触发**滚动锚点定位**，不会让浏览器把键盘焦点送到
目标元素上。要让焦点真的进入 main，目标必须满足两个条件之一：

1. 是**原生可聚焦元素**（如 `<a href>` / `<button>` / `<input>`）
2. 显式标 `tabindex="-1"`——表示"通过 JS / 锚点接收焦点，但 Tab
   正常顺序不落到我"

`<main>` 既不是原生可聚焦元素，也没有 `tabindex` ——所以 skip link
只完成了滚动、漏掉了焦点转移。

## Fix

```tsx
<main id="main" tabIndex={-1} className="min-w-0 focus:outline-none">
  {children}
</main>
```

三件事配套：

- `id="main"` 给 `href="#main"` 锚点目标
- `tabIndex={-1}` 让 main 可接收锚点焦点
- `focus:outline-none` 避免普通用户看到中转焦点轮廓（这是 a11y 圈
  的标准做法——main 被聚焦只是 skip link 的中转，不是用户主动操作）

修复 commit：[`0982ab2`](https://github.com/wilsonwangdev/frontend-engineer-handbook/commit/0982ab2)。

## Lessons

1. **视觉验证 ≠ 键盘验证**——能看到 skip link 弹出 ≠ 它真的工作。
   验证 skip link 必须按 Enter 后**继续按 Tab**，看下一个焦点
   是否落在 main 内部的元素上
2. **a11y 是"做了才会发现没做"的领域**——这是 §3.2 §5 的核心论点，
   亲身踩坑后写进了正文作者反思段
3. **AI 时代常见错配**：AI 写 skip link 经常只给 `<a href="#main">`，
   不补 `tabindex="-1"`——因为大量训练数据里的 skip link 都是错的。
   这正是 §3.2 §4「错配 ARIA 比没有 ARIA 更糟」的同一原理在
   非 ARIA 属性上的延伸

## See also

- [SPEC-0014 触点 B](../specs/0014-taste-cultivation-for-beginners/spec.md) ——
  作者反思的训练触发器；本节是 SPEC-0014 落地的活案例
- [Heydon Pickering · A Todo List · Managing focus](https://inclusive-components.design/a-todo-list/)
  ——skip link 设计的事实标准来源
- [content/chapter-03/sections/semantic-html.mdx §5.1](../content/chapter-03/sections/semantic-html.mdx) ——
  本踩坑作为正文的 §5.1 内嵌案例
