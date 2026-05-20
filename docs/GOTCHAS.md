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
