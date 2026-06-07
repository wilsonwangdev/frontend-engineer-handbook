# Known Gotchas（高频踩坑速查）

本项目特定的高频踩坑。什么时候来查这里：

- 在本仓库遇到一个让你困惑的报错（先搜再 debug）
- 写涉及下列领域的代码之前
- 想加新条目时——只在"同一坑被踩 ≥ 2 次"后才升级（[SPEC-0006](../specs/0006-agent-skills-system/spec.md) Layer 3 升级规则）

每条结构：症状 → 一行修复 → 完整事故链接。

---

## G.1 Next.js 16 — Cache Components 下必须加 `'use cache'`

**症状**：`pnpm build` 报 `Error: Uncached data was accessed outside of <Suspense>`。

**修复**：给任何异步数据加载函数顶部加 `"use cache";`：

```ts
export async function getAllDocs() {
  "use cache";
  // ...文件系统 / 数据库 / fetch 读取
}
```

**原因**：`next.config.ts` 启用了 `cacheComponents: true`。未加 directive
的数据访问被视为动态，与 prerender 冲突。

完整事故：[journal/2026-05-19-nextjs16-cache-components-directive.md](../journal/2026-05-19-nextjs16-cache-components-directive.md)
对应 skill：[skills/nextjs-16-guardrails](../skills/nextjs-16-guardrails/SKILL.md)

---

## G.2 Zod + gray-matter — YAML 自动把日期转 Date

**症状**：校验 frontmatter `lastVerified: 2026-05-19`（无引号）时报
`ZodError: expected string, received Date`。

**修复**：用防御性的 `union + transform` coerce：

```ts
const isoDateString = z
  .union([z.iso.date(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));
```

**原因**：gray-matter 遵循 YAML 1.1，会把裸 `YYYY-MM-DD` 自动解析为 JS
`Date` 对象。同类自动转换还有：`yes/no/on/off → boolean`、`null/~ → null`、
`1.5e10 → number`。

完整事故：[journal/2026-05-19-yaml-auto-date-coercion.md](../journal/2026-05-19-yaml-auto-date-coercion.md)
对应 skill：[skills/zod-frontmatter](../skills/zod-frontmatter/SKILL.md)

---

## G.3 E2E on macOS — TUN 模式代理拦截 localhost

**症状**：`pnpm test:e2e` 卡死或返回 `ERR_CONNECTION_REFUSED`，但
`pnpm start` 手动启动后 curl 完全正常。

**修复**：两种选择——

- 快速验证：`pnpm smoke`（纯 `node:http` 打 `127.0.0.1`，绕开 L7 代理逻辑）
- 完整 E2E：暂时关掉代理 app 的 TUN 模式，再 `pnpm test:e2e:local`

**原因**：TUN 模式代理（Clash / Surge 等）在网络栈 L3/L4 层拦截流量，
绕开所有应用层 `NO_PROXY` / `unset http_proxy`。CI 容器没有 TUN，
所以自动启 webServer 的 `pnpm test:e2e` 在 CI 能跑通。

完整事故：[journal/2026-05-19-playwright-tun-mode-proxy.md](../journal/2026-05-19-playwright-tun-mode-proxy.md)

---

## G.4 UI 组件提交前必须移动端验收

**症状**：组件在桌面端正常，移动端出现布局溢出、交互热区缺失、
表格列过窄换行等问题。`pnpm build` 通过不等于体验合格。

**修复**：提交 UI 组件前逐项确认：

1. **375px 视口目视验证**（Chrome DevTools → iPhone SE）
2. **交互组件三件套**：点击外部关闭、ESC 关闭、显式关闭按钮
3. **表格**：在窄屏下横向滚动是否顺畅、列宽是否合理
4. **文字**：标题字号是否渐进（移动端更小）、正文是否溢出

**原因**：编译通过 ≠ 体验合格。agent 写完组件后只跑 build 验证，
没有在真实窄屏上验证。这个坑在 agent-master-handbook 和本项目
各踩一次，属于 agent 行为模式缺陷而非技术栈问题。

完整事故：[journal/2026-05-20-mobile-layout-verification-gap.md](../journal/2026-05-20-mobile-layout-verification-gap.md)

### G.5 Markdown 粗体 + CJK 括号解析错误

**现象**：`**中文（English）**` 渲染结果异常——粗体未闭合、括号丢失、或后续文字被吞。

**原因**：Markdown 解析器遇到 `）**`（全角右括号紧接两个星号）会误判为"星号属于括号内容的一部分"，导致粗体边界识别错误。只发生在 `**...（...English...）**` 的嵌套模式。

**修复**：用 HTML `<strong>` 标签替代 Markdown `**` 语法：

```md
<!-- ❌ 错误 -->

**并发渲染（concurrent rendering）**

<!-- ✅ 正确 -->

<strong>并发渲染（concurrent rendering）</strong>
```

**何时触发**：当粗体内容包含 CJK 全角括号且括号内有英文单词。

### G.6 编辑 MDX 内容后 dev server 不热更新

**现象**：修改 `content/` 下的 `.mdx` 文件后，浏览器不自动刷新——必须手动
Cmd+Shift+R 硬刷新才能看到新内容。

**原因**：`src/lib/content.ts` 的 `getAllDocs()` / `getDocBySlug()` 使用了
`"use cache"` 指令（Cache Components 需要），文件读取被缓存在内存中。修改源
文件后缓存不失效，服务端仍返回旧内容。同时 `MdxBody` 组件也有 `"use cache"`，
MDX 编译结果被二次缓存。

**为什么不能去掉**：`"use cache"` 是 `next.config.ts` 中 `cacheComponents: true`
的必要条件——去掉会导致生产构建（`pnpm build`）prerender 报错。

**已知解法**：

- **Fumadocs 方案**：用 `local-md dev -- npm next dev` 在 Next.js 之前启动
  一个独立的文件监听进程，绕过 Turbo​pack 的缓存
- **本项目当前做法**：硬刷新（Cmd+Shift+R）。内容编辑频率远低于组件开发，
  可以接受

**同类参考**：`journal/2026-06-07-cdp-driven-ui-debugging.md`（HMR 相关讨论）

### G.7 Edge Runtime 与 Cache Components 不兼容

**症状**：`pnpm build` 报 `Route segment config "runtime" is not compatible with
nextConfig.cacheComponents. Please remove it.`

**修复**：去掉 `export const runtime = "edge"`——在已启用 `cacheComponents: true`
的项目中，API 路由不能声明 Edge Runtime。OG Image 生成等场景改用默认 Node.js
Runtime。

**原因**：`cacheComponents: true` 要求服务端 Runtime 支持静态缓存，Edge Runtime
的轻量环境不提供这一能力。两者互斥——要么关 cacheComponents，要么不用 Edge。
对静态站而言，OG 图片生成在 Node.js Runtime 下执行即可——首次请求后有 CDN 缓存，
性能差异可忽略。

**内容价值**：这是 Next.js 16 项目的常见配置冲突，可作为第 6/7 章工程化素材。
Edge vs Node.js Runtime 的选型决策（包括各自的 API 限制、冷启动差异、成本差异）
值得用单独一节展开。
