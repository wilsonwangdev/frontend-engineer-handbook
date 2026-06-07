# 前端工程师手册

> 围绕 agent 协作的前端工程师中文精编手册。

🌐 **Live**: https://fe.wilsonhandbook.online/

[![CI](https://github.com/wilsonwangdev/frontend-engineer-handbook/actions/workflows/ci.yml/badge.svg)](https://github.com/wilsonwangdev/frontend-engineer-handbook/actions/workflows/ci.yml)

## 这是什么

一本面向不同经验前端工程师的中文精编手册，主题是**AI 时代前端工程师的
必要学习路线与核心知识点**。

它不打算覆盖"前端的一切"。它做三件事：

1. **告诉你 2026 年必须知道的事** —— 以及什么不再需要学（浮动布局、jQuery、ES5 polyfill、手写 Promise……）
2. **给出 AI 可委托清单** —— 哪些任务现在可以放心让 AI 写、哪些不行、判断依据是什么
3. **提供动手实践** —— 通过构建 mini bundler / mini framework / mini agent app 理解原理

## 读者

| 读者          | 路径                 |
| ------------- | -------------------- |
| 新入行 / 转行 | 按章节顺序读         |
| 1–3 年经验    | 搜索或按需查阅       |
| 资深工程师    | 速查 + AI 可委托清单 |

## 当前进度

第 0–4 章完整上线，第 5 章编写中。附录 B（精选资源）和术语表（/glossary）已上线。

**已上线内容**：

- ✅ 第 0 章 如何使用本手册
- ✅ 第 1 章 AI 时代前端工程师的能力地图
- ✅ 第 2 章 Web 平台基石（HTTP / URL / 渲染 / 事件循环 / 存储 / 安全）
- ✅ 第 3 章 HTML / CSS / 现代布局（含 4 个动画 demo + 3 个布局 demo）
- ✅ 第 4 章 JavaScript 与 TypeScript
- 🚧 第 5 章 React 与 Next.js（§5.1 已上线）
- ⏳ 第 6–10 章
- ✅ 附录 B 精选一手资源 + 经典书目（/resources）
- ✅ 术语表（/glossary，10 个术语，hover 浮窗 + 搜索可检索）
- ⏳ 附录 A / D

**站点功能**：

- 🔍 站内搜索（⌘K 命令面板，全文索引）
- 📖 术语表（hover 浮窗 + 底部弹窗）
- 🏗️ 演练场（/playground，7 个可调试 demo）
- 🌓 暗色模式（View Transition 圆形扩散切换）
- 📊 阅读进度条 + 章节完成标记

完整目录见 [specs/0003-table-of-contents/spec.md](specs/0003-table-of-contents/spec.md)。

## 内容原则

- **完全免费** — 手册内容免费，必要学习路径不依赖任何付费资源
- **一手来源** — 引用 W3C / WHATWG / TC39 / MDN / web.dev / 框架官方文档；不引用付费课程或社区博客
- **判断驱动** — 每个知识点附"为什么 AI 时代仍要学"的判断

详见 [specs/](specs/) 下的决策记录。

## 站点本身就是手册的活教材

技术栈与手册第 5–9 章教学一致，站点功能覆盖第 3 章动画 / View Transitions 教学案例：

- **Next.js 16** + React 19.2 + React Compiler + Cache Components
- **Tailwind CSS** + OXC 工具链（oxlint + oxfmt）
- **Turbopack**（开发）+ **Vercel**（部署 + Analytics）
- **MCP**（next-devtools-mcp agent 集成）

站点功能（搜索 / 暗色切换 / 页面过渡 / 阅读进度）本身就是 View Transitions、IntersectionObserver 的教学案例。第 10 章动手实践会直接参照本项目源码做对照分析。

## 本地开发

```bash
pnpm install
pnpm dev          # localhost:3000，启用 Turbopack
```

完整命令清单见 [AGENTS.md](AGENTS.md) 顶部的 Commands 表。

## 贡献

单作者维护。Issue 欢迎，PR 请先开 Issue 讨论。

约定见 [AGENTS.md](AGENTS.md)：

- Conventional Commits 原子提交
- 强制 CI：type-check / oxlint / oxfmt / vitest / build / playwright (CI only)
- 引用必走 [SPEC-0002 内容来源准入](specs/0002-content-source-admission/spec.md)

## License

MIT — 内容与代码均开源。详见 [LICENSE](LICENSE)。

---

**反馈**：[GitHub Issues](https://github.com/wilsonwangdev/frontend-engineer-handbook/issues)
