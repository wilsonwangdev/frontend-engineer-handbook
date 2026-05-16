---
id: 0003
title: 精编目录结构与章节归位规则
status: accepted
date: 2026-05-14
---

## Context

SPEC-0001 确定了手册的范围（精编、三档读者、AI 时代取舍双轨制）和主干框架
（React + Next.js）。需要一份具体的目录结构来指导写作顺序和内容边界。

## Decision

### 目录结构（10 章 + 3 附录）

```
第 0 章  如何使用本手册
第 1 章  AI 时代前端工程师的能力地图          ← 前置，先立世界观
第 2 章  Web 平台基石
第 3 章  HTML / CSS / 现代布局
第 4 章  JavaScript 与 TypeScript
第 5 章  React 与 Next.js
第 6 章  工程化与构建
第 7 章  质量与交付
第 8 章  现代前沿话题
第 9 章  AI 原生工作流（实操）
第 10 章 动手实践                             ← 通过构建理解原理

附录 A  框架对照（Vue / Svelte / Solid）
附录 B  精选一手资源与经典书目
附录 C  术语对照表（中英文）
```

### 各章内容边界

#### 第 0 章 如何使用本手册
- 三类读者的推荐阅读路径
- 三档归位约定说明（必学 / 仍需理解 / 可委托 AI）
- "AI 可委托清单"总览（从第 1 章提炼的速查版）

#### 第 1 章 AI 时代前端工程师的能力地图
- 什么变了、什么没变
- 工程师价值的新落点：判断、上下文管理、验证、品味
- "AI 可委托清单"完整版（明确列出可放心委托的任务类别）
- 三类读者各自的学习优先级建议

#### 第 2 章 Web 平台基石（不依赖框架的部分）
- HTTP/1.1、HTTP/2、HTTP/3 核心要点
- URL / URI 结构与解析
- 浏览器渲染管线（解析 → 样式 → 布局 → 绘制 → 合成）
- 事件循环与任务队列
- 浏览器存储模型（Cookie / Storage / IndexedDB / Cache API）
- Web 安全基本盘：同源策略、CSP、XSS、CSRF
- 延伸阅读：WebKit 技术内幕、HPBN

#### 第 3 章 HTML / CSS / 现代布局
- 语义化与可访问性（a11y）
- Flexbox / Grid / 容器查询 / 子网格
- 现代 CSS：@layer、:has()、嵌套、CSS 变量、color-mix
- 响应式设计（不含 IE 兼容）
- 不进主干：浮动布局、CSS Hack、IE 私有属性、预处理器详尽语法

#### 第 4 章 JavaScript 与 TypeScript
- 语言核心：作用域、闭包、原型链、this 绑定
- 异步模型：Promise、async/await、微任务
- 模块系统：ESM（不展开 CommonJS 内幕）
- ES2020–ES2025 必要特性精选
- TypeScript：结构化类型、泛型、类型收窄、工具类型
- 不进主干：ES5 polyfill 写法、CommonJS 详尽内幕、装饰器历史

#### 第 5 章 React 与 Next.js
- React 心智模型：组件、状态、副作用、Hooks
- 并发渲染与 Suspense
- 服务端组件 / 客户端组件 / 流式渲染
- Next.js App Router：路由、数据获取、缓存策略
- 状态管理：Zustand（推荐）/ Jotai / Redux Toolkit 对比
- 样式方案：Tailwind CSS（推荐）/ CSS Modules / styled-components 对比
- 不进主干：Class 组件、getInitialProps、Pages Router 详尽迁移

#### 第 6 章 工程化与构建（高级话题）
- 包管理：pnpm（推荐）/ npm / yarn 对比
- Vite 心智模型；esbuild / SWC / Rollup 角色
- Monorepo 基础（Turborepo / pnpm workspace）
- CI/CD 基础：GitHub Actions 实操
- 代码规范自动化：ESLint flat config + Prettier + lint-staged
- 不进主干：Webpack 详细配置（概念保留，配置委托 AI）

#### 第 7 章 质量与交付
- 类型检查作为第一道防线
- 测试金字塔：Vitest（单元）/ Playwright（E2E）
- Core Web Vitals 与性能优化基础
- 部署模型：Vercel / Cloudflare Pages / 静态托管
- 可观测性入门：错误监控、性能监控

#### 第 8 章 现代前沿话题（视野扩展）
- WebAssembly（Wasm）：是什么、前端何时需要
- WebGL / WebGPU：图形渲染管线概览与适用场景
- Web Components / Shadow DOM：标准化组件的现状
- Edge Computing / Edge Runtime
- PWA 现状与 Service Worker
- 微前端：何时值得、何时过度
- 每个话题只做"是什么 + 何时需要 + 入口指引"，不展开教程

#### 第 9 章 AI 原生工作流（实操）
- 与 AI 协作的项目结构（AGENTS.md / specs / journal）
- 上下文工程：什么放进 prompt、什么放进 spec、什么放进代码
- Prompt 设计模式（面向前端场景）
- AI 生成代码的 review checklist
- Agent harness 与 MCP 简介
- 工具链：Claude Code / Cursor / Windsurf / GitHub Copilot 对比

#### 第 10 章 动手实践
通过"从零构建 mini 版"来理解原理，而非停留在阅读。每个项目控制在
可在一个周末完成的体量。

- **10.1 构建 mini bundler**
  - 目标：理解模块解析、依赖图、代码转换、打包输出
  - 覆盖知识：第 6 章工程化原理的实践验证
  - 产出：一个能处理 ESM import/export 的极简打包器

- **10.2 构建 mini framework**
  - 目标：理解响应式系统、虚拟 DOM / 细粒度更新、组件模型
  - 覆盖知识：第 5 章 React 心智模型的底层验证
  - 产出：一个支持状态驱动渲染的极简 UI 库

- **10.3 构建 mini agent app**
  - 目标：理解完整前端应用工作流——从项目搭建到 AI 集成到部署
  - 覆盖知识：第 1/5/6/7/9 章的综合实践
  - 产出：一个带 AI 对话能力的小型 Web 应用（前端 + API 调用 + 部署）

每个项目的章节结构：
1. 我们要构建什么（最终效果预览）
2. 核心原理回顾（指回对应理论章节）
3. 分步实现（代码 + 解释）
4. 与成熟方案的对比（我们的 mini 版 vs 真实工具的差异在哪）
5. 延伸：如果想继续深入，去哪里

### 章节模板规则

每章内部结构：

```markdown
# 第 N 章 标题

> 一句话定位本章

## 本章三档归位速览
| 知识点 | 归位 | 理由 |
|--------|------|------|
| ...    | 必学 | ...  |

## 正文（按知识点分节）

### N.1 知识点标题
（正文内容）

## 延伸阅读
- [一手来源](url) — 一句话说明
- 📖 经典书目（可选深入）：书名 — 推荐场景
```

### 显式移除清单（不进主干的过时内容）

以下内容在 2026 年已不再需要作为前端工程师的必学项：

- 浮动布局、清除浮动技巧
- CSS Hack、IE 条件注释、IE 私有属性
- ES5 polyfill 手写、Babel 详细配置
- CommonJS 模块系统详尽内幕
- Webpack 详细配置（概念保留，配置可委托 AI）
- jQuery 及其生态
- Class 组件生命周期详解
- Jest 历史与迁移（直接用 Vitest）
- 手写 AJAX / XMLHttpRequest 兼容
- 各种"手写 XXX"面试八股（手写 Promise、手写 bind 等）

## Consequences

- 10 章 + 3 附录的结构清晰，每章可独立写作和评审。
- AI 章前置（第 1 章）确保读者从第一页就建立新世界观。
- 第 8 章"前沿话题"只做入口指引，避免手册膨胀。
- 第 10 章实践项目让手册从"读"升级为"做"，但需控制体量避免膨胀。
- 显式移除清单是一个有争议的立场——但这正是手册的核心价值。
- 框架对照放附录，Vue 读者需要翻到后面才能找到对应内容。

## Alternatives considered

- **AI 章独立但不前置**：读者可能先按传统路线读完再看 AI，错过世界观重塑；放弃。
- **前沿话题融入各章**：打断主线叙事；放弃，独立成章更清晰。
- **不设显式移除清单**：读者无法快速判断"什么不用学了"；放弃。
