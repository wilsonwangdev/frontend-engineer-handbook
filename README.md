# 前端工程师手册

> 面向 2026 年、围绕 agent 协作的前端工程师中文精编手册。
> 小而美，不是大而全。

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

施工中，本着 build in public 的精神先发布、再迭代：

- ✅ 第 0 章 如何使用本手册
- ✅ 第 1 章 AI 时代前端工程师的能力地图
- 🚧 第 2 章 Web 平台基石
- ⏳ 第 3–10 章
- ⏳ 附录 A/B/C/D

完整目录见 [specs/0003-table-of-contents/spec.md](specs/0003-table-of-contents/spec.md)。

## 内容原则

- **完全免费** — 手册内容免费，必要学习路径不依赖任何付费资源
- **一手来源** — 引用 W3C / WHATWG / TC39 / MDN / web.dev / 框架官方文档；不引用付费课程或社区博客
- **判断驱动** — 每个知识点附"为什么 AI 时代仍要学"的判断

详见 [specs/](specs/) 下的决策记录。

## 站点本身就是手册的活教材

技术栈与手册第 5–9 章教学完全一致：

- **Next.js 16** + React 19.2 + React Compiler（stable）
- **Cache Components + PPR**（Partial Prerender）
- **Tailwind CSS 4**（CSS-first 配置）
- **OXC 工具链**（oxlint + oxfmt）
- **Turbopack**（默认）
- **next-devtools-mcp**（agent 集成）
- **Vercel** 部署 + Speed Insights + Web Analytics

第 10 章动手实践会直接参照本项目源码做对照分析。

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

## 相关项目

- [Agent Master Handbook](https://agent-master-handbook.vercel.app/zh/) ——
  同作者维护的另一本中文手册，主题是 AI Native 项目的构建实践
  （AGENTS.md / specs / skills / journal 等"agent ready"约定）。本项目
  的工程化骨架受其指导；两个项目可视为"内容矩阵"：那本讲怎么搭、
  这本讲前端工程师在搭好的环境里该学什么。

## License

MIT — 内容与代码均开源。详见 [LICENSE](LICENSE)。

---

**反馈**：[GitHub Issues](https://github.com/wilsonwangdev/frontend-engineer-handbook/issues)
