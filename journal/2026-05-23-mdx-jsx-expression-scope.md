---
date: 2026-05-23
tags: [mdx, next-mdx-remote, ssr, scope]
---

## What happened

第 3 章 §13 加经典布局案例时，DemoBlock 组件的源码区（`<pre>`）SSR
输出**全部为空**，但浏览器水合后通过 React 客户端运行时正常。production
build 后 `.next/server/app/chapter-03/modern-layout.html` 三个 `<pre>`
都是空的：

```html
<pre class="overflow-x-auto..."><code></code></pre>
```

mdx 写法：

```mdx
<DemoBlock title="协同头像叠放" code={AVATAR_STACK_CODE} language="html">
  <AvatarStackDemo />
</DemoBlock>
```

`AVATAR_STACK_CODE` 在 `src/components/mdx/demos/layout-classics.tsx`
导出，并注册到 `mdxComponents` map。直觉以为：mdx 会从 components scope
查到这个常量，然后作为 prop 传给 DemoBlock。

## Root cause

next-mdx-remote 把 mdx 文件里的 JSX 表达式 `{标识符}` 解析时，scope
**只查 React 组件名**，并不会注入纯字符串常量到表达式作用域。`code={AVATAR_STACK_CODE}`
里的 `AVATAR_STACK_CODE` 在 SSR 阶段就是 undefined——React 渲染
`<DemoBlock code={undefined}>`，组件内 `<pre><code>{code}</code></pre>`
渲染为空字符串。

为什么客户端水合后看起来"正常"？因为 hydration 也用同样的 undefined
渲染——所以源码区一直是空的；只是默认折叠 + 用户没展开时不会发现。
反馈触发后展开才看到问题。

## Fix

把 DemoBlock 用法封装到 demo 模块本身。每个 demo 导出一个**已经
组装好 DemoBlock 的完整组件**：

```tsx
// src/components/mdx/demos/layout-classics.tsx
const AVATAR_STACK_CODE = `<div class="avatar-stack">...`; // 不 export

export function AvatarStackDemo() {
  return (
    <DemoBlock title="协同头像叠放" code={AVATAR_STACK_CODE} language="html">
      <AvatarStackPreview />
    </DemoBlock>
  );
}
```

mdx 里只写一个标签，没有 `{表达式}` 引用：

```mdx
<AvatarStackDemo />
```

mdxComponents map 里也只注册 demo 组件，常量不必导出。

## Lesson for next time

**mdx scope 规则**（按经验复盘）：

| mdx 写法              | scope 来源              | 行为                           |
| --------------------- | ----------------------- | ------------------------------ |
| `<Component />`       | mdxComponents map       | 正常解析 React 组件            |
| `{expression}` 表达式 | mdxComponents map（仅） | **找不到的标识符 = undefined** |
| 文本字面量            | 无                      | 字符串                         |

**结论**：mdx 里需要传"非 JSX"参数（字符串 / 配置对象）时，**不要靠
mdxComponents map**。两条出路：

1. 把整块组合（组件 + 数据）封装为单一 mdx-friendly 组件——mdx 里
   只看到 `<NamedDemo />`（本次采纳）
2. 在 mdx 文件顶部用 `import` 语句（next-mdx-remote 需要 `parseFrontmatter`
   或 esm 支持，本仓库未启用）

未来 agent 在 mdx 里写 `<X prop={CONSTANT}>` 时——**先在 SSR HTML 里
确认 prop 真的传过去了**，不要光看客户端水合后的视觉。这种 SSR vs
客户端的不一致是最隐蔽的。
