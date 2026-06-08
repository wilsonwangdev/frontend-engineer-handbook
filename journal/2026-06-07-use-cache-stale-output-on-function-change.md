---
date: 2026-06-07
tags: [cache-components, use-cache, debugging, dev-dx]
---

## `"use cache"` 函数体改动后缓存不失效

### 现象

修改了 `getChapterTree()` 的返回结构（`SectionMeta` 新增 `tier` 字段），但客户端组件收到的序列化数据始终不含新字段。所有调用方看到的仍是旧结构——无报错、无 warning，只是数据缺失。

### 根因

`"use cache"` 在首次调用时把**函数输出序列化到磁盘**（`.next/dev/cache/`）。后续请求直接反序列化磁盘文件，完全不执行函数体。改动函数源码不会使缓存失效——缓存键基于函数名 + 参数，函数体变化不在键中。

### 修复

1. `find .next/dev -type f -delete` 清磁盘缓存
2. 如果函数本身够轻量（如 `getChapterTree()` 只做 map），直接移除 `"use cache"`
3. 保留 `"use cache"` 的场景：改完函数后必须清 `.next/dev` 缓存

### 为什么不是 `getAllDocs()` 的问题

`getAllDocs()` 的缓存不需要清——它返回的 `frontmatter.tier` 本来就存在。
问题出在 `getChapterTree()` 的缓存：旧版函数体没有把 `doc.frontmatter.tier` 写入 section 对象，
缓存的是不含 `tier` 的结果。

### 识别特征

- TypeScript 类型检查通过（新字段在类型中）
- 直接 `import` 调用返回正确数据（vitest 验证 24/24 sections 有 tier）
- 但浏览器中 RSC 序列化数据不含新字段
- 控制台无任何错误

### 预防

- 改 `"use cache"` 函数的返回值结构后，重启 dev server 前先清 `.next/dev`
- 或考虑：轻量函数不加 `"use cache"`，把缓存留给真正昂贵的 I/O 函数

### 附：`find .next/dev -type f -delete` 的副作用

用 `find -delete` 只删文件不删目录，会让 Turbopack 认为编译产物存在但实际
文件缺失 → HMR 客户端请求 JS/CSS 得 404 → 触发重载 → 新一轮 404 → 无限循环。
**清缓存必须用 `rm -r .next`**，不能部分删除。

### 附 2：`usePath()` 抛异常 → 无限刷新

最初 `usePath()` 在 `PathContext` 为 null 时直接 `throw Error`。
`PathIndicator` 组件渲染在 `page.tsx`（server component）中，作为 `{children}`
传给 `PathProvider`（client component）。跨 RSC 边界的 Context 可能不传递，
导致 `usePath()` 抛错 → React Error Boundary 捕获 → 触发整页重载 → 再次抛错 →
无限刷新循环。修复：不抛异常，返回 `{ path: null, setPath: () => {} }` 安全默认值。
