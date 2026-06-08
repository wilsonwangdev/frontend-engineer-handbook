---
date: 2026-06-08
tags: [next.js, link, static-page, refresh-loop, debugging, costly]
---

## Next.js `<Link>` 在静态首页导致浏览器交替刷新

### 现象

`pnpm dev` 后首次访问 `localhost:3000`，浏览器在 `/` 和 `/chapter-00` 之间
不停交替刷新。服务器日志显示每秒 3-4 次交替请求，各返回 HTTP 200。
Curl 单独请求任一 URL 均正常。生产构建（`pnpm build && pnpm start`）不出现。

### 排查路径（按时间顺序，标注误判）

1. ❌ **怀疑 Cache Components 缓存失效** — `"use cache"` 函数体改动后磁盘
   缓存不失效，导致服务端旧数据 + 客户端新代码 → hydration mismatch → 刷新。
   修复：`rm -r .next/dev`。**无效**。

2. ❌ **怀疑 Turbopack 文件缓存损坏** — SST/META 文件缺失报错。修复：
   `rm -r .next/dev/cache/turbopack`。**部分有效（解决了 Turbopack 崩溃），
   但刷新问题仍存在**。

3. ❌ **怀疑残留 dev server 进程** — `lsof -ti:3000 | xargs kill`。
   **无效**（每次重启都是干净的）。

4. ❌ **怀疑 `usePath()` 跨 RSC 边界抛异常** — PathIndicator 在
   page.tsx(server) 中作为 client component 渲染，Context 不传递导致
   `throw Error` → Error Boundary 捕获 → 整页重载 → 再次抛错 → 无限循环。
   修复：`usePath()` 不抛异常，返回安全默认值。**无效**。

5. ❌ **怀疑 `cacheComponents: true` 是根因** — 尝试改为
   `process.env.NODE_ENV === "production"`，导致 `"use cache"` 指令在 dev
   中报错。回退。**方向完全错误**。

6. ❌ **怀疑 PathSidebar 和 Sidebar 的 DOM 切换导致高度跳变** — 合并为单
   组件。**改善体验但无关刷新**。

7. ✅ **发现交替请求模式** — `/` 和 `/chapter-00` 交替，怀疑首页有东西
   自动触发导航。首页新增的 `PathLink` 组件使用了 `<Link href="/chapter-00">`。

8. ✅ **确认根因** — `<Link>` 在静态首页上的 prefetch 行为触发了 Next.js
   路由器内部状态变更，导致 `/`→`/chapter-00` 的自动导航。`/chapter-00`
   页面加载后，浏览器检测到 URL 从 `/` 变成了 `/chapter-00`（因为是从首页
   来的），尝试"返回"或重新加载，形成交替循环。

9. ✅ **修复** — `PathLink` 中的 `<Link>` 改为原生 `<a>` + `window.location.href`。

### 为什么生产构建不出现

生产构建中 `<Link>` 的 prefetch 机制不同——静态页面已经预渲染，prefetch 只是
加载 JSON 数据，不会触发路由状态变更。Dev 模式下 Turbopack 的编译流程与 prefetch
时序冲突才触发了这个边界 bug。

### 为什么代价这么大

1. 首页的 PathCard 是可点击的，但没有视觉反馈表明"正在导航"——看起来就是
   页面在不停闪烁
2. 交替刷新和 Fast Refresh 的视觉表现相似（都是页面重载），导致误判为 HMR 问题
3. 每次"修复"后重启 dev server，首次编译慢（5-8 秒），刷新在编译完成后
   才出现，时间线被拉长
4. `<Link>` 是 Next.js 核心组件，不会第一时间怀疑它有问题

### 教训

- 遇到浏览器刷新问题，先用 curl 隔离——如果 curl 正常而浏览器异常，问题在客户端
- 注意请求模式：交替两个 URL ≠ 同一 URL 反复请求 ≠ Fast Refresh 重建
- 有新组件时先怀疑新组件，不要一上来就怀疑基础设施
- `<Link>` 在静态页面的边界行为值得记住——不是 bug，是不符合直觉的特性
