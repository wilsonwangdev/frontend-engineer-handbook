---
name: nextjs-16-guardrails
description: Next.js 16 写代码前的核查清单 — 避免 Cache Components / proxy.ts / async APIs 等版本敏感的低级错误
owner: "@wilsonwangdev"
status: stable
---

## When to use

写或改任何 Next.js 应用代码之前，**特别是**：

- 在 `src/app/**` 下创建或修改 RSC / page / layout
- 修改 `next.config.ts`
- 涉及缓存（`'use cache'`、`revalidateTag`、`updateTag`）
- 涉及请求 API（`params` / `searchParams` / `cookies()` / `headers()`）
- 路由中间件（`proxy.ts` / 旧 `middleware.ts`）
- 图片处理（`next/image` + 配置）

## When NOT to use

- 写纯 client 组件 hooks（与 Next.js 无关时）
- 改 `content/` 下的 MDX（与框架无关）
- 改 CSS / Tailwind 配置
- 跑 Vitest 单元测试

## Steps

写代码前，按这个清单核查：

### 1. 数据访问 = 必须决定缓存策略

`next.config.ts` 启用了 `cacheComponents: true`。任何数据访问（fs / db / fetch）
不加 `'use cache'` directive 都被视为动态，会触发：

```
Error: Uncached data was accessed outside of <Suspense>
```

**决策树**：

- 数据是构建期就能确定的（fs.read / 静态 fetch）→ 顶部加 `"use cache";`
- 数据是请求期才能确定的（用户态 / 实时 API）→ 包消费它的组件在 `<Suspense fallback>` 内
- 整条路由都是动态的 → 路由文件加 `export const dynamic = 'force-dynamic';`

### 2. 路由参数 = 必须 await

Next.js 16 把 params/searchParams/cookies/headers 改成异步：

```ts
// ✅
const { slug } = await params;
const cookie = (await cookies()).get("theme");

// ❌ (Next.js 15 写法)
const { slug } = params;
```

### 3. middleware → proxy

旧的 `middleware.ts` 在 Next.js 16 deprecated，新用 `proxy.ts`：

```ts
// proxy.ts (新)
export default function proxy(request: NextRequest) {
  return NextResponse.redirect(...);
}
```

文件名、导出函数名都要改。

### 4. 缓存失效 API

- `revalidateTag(tag)` (旧签名) → `revalidateTag(tag, 'max' | 'hours' | 'days' | { expire: number })` (新签名要求 SWR profile)
- 想要 "立即读到刚写的数据"（Server Action 场景）→ 用新的 `updateTag(tag)`
- 想要刷新非缓存内容 → 用新的 `refresh()`

### 5. 默认依赖检查

- 默认 bundler 是 Turbopack（不要在 next.config 里启用 experimental.turbopack——已经移到顶层 `turbopack`）
- 默认 lint 工具不再是 `next lint` —— 已被移除，直接用 oxlint / biome / eslint
- `serverRuntimeConfig` / `publicRuntimeConfig` 已移除 → 用 `.env.*`

### 6. 不确定时查 MCP

每次有"这个 API 在 Next.js 16 怎么用"的疑问，**先查 next-devtools-mcp**：

```
Use the MCP server tool: get_errors / project_metadata / knowledge_base
```

不要凭印象写。

## Inputs

- 你想写的代码文件路径
- 你要使用的 Next.js API 名称（如果已知）

## Outputs

- 通过这 6 项核查后再开始写代码
- 任何一项不通过 → 先回到对应文档 / MCP 查询，不要写

## Verification

写完后立刻：

```bash
pnpm type-check    # 类型层拦截大部分误用
pnpm build         # PPR + Cache Components 错误只在 build 才暴露
```

`build` 是最关键的 — Cache Components 错误**不会**在 `dev` 报，但会 fail
`build`。所以提交前必须本地 `pnpm build` 过。

## 相关引用

- [Next.js 16 release notes](https://nextjs.org/blog/next-16)
- [Cache Components docs](https://nextjs.org/docs/app/getting-started/cache-components)
- [next-devtools-mcp](https://nextjs.org/docs/app/guides/mcp)
- 项目本地踩坑记录：[journal/2026-05-19-nextjs16-cache-components-directive.md](../../journal/2026-05-19-nextjs16-cache-components-directive.md)
