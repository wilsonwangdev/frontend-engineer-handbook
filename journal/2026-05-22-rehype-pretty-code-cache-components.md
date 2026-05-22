---
date: 2026-05-22
tags: [nextjs-16, cache-components, mdx, shiki, rehype]
---

## What happened

接入 [rehype-pretty-code](https://rehype-pretty.pages.dev/) 给 MDX 代码块
做语法高亮，`pnpm build` 失败：

```text
Route "/[...slug]" used `Date.now()` before accessing either uncached
data (e.g. `fetch()`) or Request data (e.g. `cookies()`, `headers()`,
`connection()`, and `searchParams`). Accessing the current time in a
Server Component requires reading one of these data sources first.
Alternatively, consider moving this expression into a Client Component
or Cache Component.
```

代码层面我没调用过 `Date.now()`——这是 rehype-pretty-code 或它依赖的
Shiki 内部用的。Cache Components 严格模式拒绝任何"未声明缓存语义"的
当前时间访问。

## Root cause

Next.js 16 + Cache Components 引入了"prerender 严格检查"：在 RSC 渲染
路径里调用 `Date.now()` / `new Date()` / `Math.random()` 等不可缓存的
"环境读取"会被静态化检查器拦截，要求显式 opt-in 缓存语义或移到 client。

rehype-pretty-code 的 unified pipeline 在解析阶段会创建/读取一些时间
相关的中间状态，传染到 RSC 渲染路径，被严格检查命中。这不是 bug——
是设计：让 RSC 边界的"时间漂移"显式化。

## Fix

把 `<MDXRemote>` 调用包成一个 `"use cache"` 异步函数，slug 作稳定 cache key：

```tsx
async function MdxBody({ slug, source }: { slug: string[]; source: string }) {
  "use cache";
  void slug; // 仅作 key 标记
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
        },
      }}
    />
  );
}
```

`"use cache"` 把整段渲染（含 Shiki 高亮）声明为可缓存的静态产物。
检查器接受——因为整个产物有稳定 key（slug），时间漂移不会泄漏。
副作用是：每个文档高亮一次，重复访问命中缓存，省 Shiki 重新跑。

## Lesson for next time

**Cache Components 严格检查 + 第三方 unified 插件 = 隐式碰撞高发区**。
任何 unified / remark / rehype 插件只要内部用了时间 / 随机 / 环境读取，
都可能在 Next.js 16 RSC 路径里炸——但报错指向的是"我自己的代码"，
不会指向插件。

**经验法则**：

- 接 unified 生态插件时，整段渲染默认包 `"use cache"`，把 cache key 显式化
- 报 `Date.now()` / 当前时间 / 随机数错时，先看是不是第三方 unified /
  remark / rehype 插件触发，不是先怀疑自己代码
- 包 `"use cache"` 时务必传一个**稳定**的入参作 cache key（这里是 slug），
  否则缓存命中率为 0，性能反而变差

**未来素材**：

- 第 5 章「React 与 Next.js」讲 Cache Components 和 RSC 边界时的真实案例
- 附录 D「实战避坑录」候选——Next.js 16 + 第三方 unified 生态的隐式
  契约，社区目前几乎没系统记录
- 触发 SPEC-0010 通用层 / 产品层分类讨论：MDX 渲染管线属于通用层，
  这次踩坑是它"不能简单 fork"的非显然约束
