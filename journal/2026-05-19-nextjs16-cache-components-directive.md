---
date: 2026-05-19
tags: [nextjs-16, cache-components, ppr, prerender, build-error]
---

## What happened

首次构建带内容路由的版本，`next build` 失败：

```
Error: Route "/[...slug]": Uncached data was accessed outside of <Suspense>.
This delays the entire page from rendering, resulting in a slow user experience.
Error occurred prerendering page "/chapter-01".
```

页面是普通 RSC，只是用 `getDocBySlug(slug)` 读了文件系统。理论上是
"静态内容"，应该能预渲染。

## Root cause

Next.js 16 默认启用了 `cacheComponents: true`（PPR + Cache Components 模型）。
在这个模型下：

- **任何未被显式 cache 的数据访问，都被视为"动态"**
- 预渲染时遇到"动态访问 + 不在 Suspense 内"→ 错误，因为这会阻塞整个页面

Next.js 16 的新约定：

- 数据访问要么用 `'use cache'` directive 标记为可缓存
- 要么把消费它的组件包在 `<Suspense fallback={...}>` 里

对静态内容来说，加 `'use cache'` 是正确选择——它告诉 Next.js"这次读取的结果
在构建期可以缓存为静态产物"。

## Fix

在 `lib/content.ts` 所有数据加载函数顶部加 `'use cache'`：

```ts
export async function getAllDocs(): Promise<ContentDoc[]> {
  "use cache";
  // ...
}

export async function getDocBySlug(slug: string[]): Promise<ContentDoc | null> {
  "use cache";
  // ...
}
```

构建产出从全静态变为 PPR：

```
└ ◐ /[...slug]     15m   1y    <-- Partial Prerender，符合预期
```

## Lesson for next time

Next.js 16 + `cacheComponents: true` 是新心智模型，**不能套用 v14 / v15 的
直觉**。任何文件读、数据库查、API 调用都要主动决定：

- 静态/可缓存 → `'use cache'`
- 动态/请求级 → 包 `<Suspense>`，组件外层会被预渲染为 shell
- 完全动态 → 整个路由标记 `dynamic = 'force-dynamic'`

调试建议：构建报错信息里的 "Uncached data was accessed outside of `<Suspense>`"
是 PPR 模型的核心错误，第一时间想 `'use cache'`，不要乱拆组件。

本条候选升级到 [附录 D.2 框架特定坑](../content/appendix-d) —— 影响范围 100%
Next.js 16 上手用户。
