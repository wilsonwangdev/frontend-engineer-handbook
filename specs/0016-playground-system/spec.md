---
id: 0016
title: 整站 Playground 集中页系统
status: proposed
date: 2026-06-04
---

## Context and Problem Statement

§3.6 动画章节首次引入"章节内嵌可调试 demo"模式（4 个 demo），
读者反馈对"动手玩"的需求强烈——希望有专门的集中页能看完整 demo 集，
而不是为了试一个 demo 跳进章节。

ROADMAP 候补池里已经有"动画 Playground 全集"——补齐 7 个未上线的
动画 demo（Loading spinner、骨架屏、手风琴、性能对比等）。本 SPEC
把范围从"§3.6 一节专属"扩展到**整站级 Playground 集中页**——未来
布局 demo（§3.1）、表单 demo（第 5 章）、数据展示 demo 都进同一系统。

需要决策：

- 路由结构（`/playground` 索引 + 子主题页）
- demo 在章节内嵌 vs 在 Playground 集中——什么标准
- demo 与 Playground 之间的代码组织（避免重复维护）
- demo 元数据格式（标题 / 描述 / 关联章节 / 难度）

约束：

- 与现有 `<DemoBlock>` 组件复用（已有 4 个动画 demo + 3 个布局 demo）
- 不能让 demo 维护成本爆炸——单一来源（SSOT）
- 静态生成（与 Cache Components 一致）
- 移动端可用（demo 浮窗 / 互动元素要响应式）

## Decision Drivers

- 章节阅读 vs 集中动手玩两种使用模式都要支持
- demo 数据元信息可被多处消费（Playground 索引 / 章节 / 未来搜索）
- 加新 demo 的边际成本要低
- 与现有 `<DemoBlock>` 模式兼容

## Considered Options

### 选项 A：路由 + 元数据驱动（推荐）

```
src/components/playground/
├── registry.ts                # demo 元数据 SSOT
├── animations/
│   ├── button-hover.tsx       # 已有
│   ├── card-entrance.tsx
│   ├── view-transition-basic.tsx
│   ├── theme-toggle.tsx
│   ├── loading-spinner.tsx    # 新加
│   ├── skeleton-shimmer.tsx
│   ├── accordion.tsx
│   ├── transform-vs-position.tsx
│   ├── view-transition-named.tsx
│   ├── scroll-progress.tsx
│   └── reduced-motion.tsx
├── layout/
│   ├── avatar-stack.tsx       # 已有（layout-classics）
│   ├── notification-badge.tsx
│   └── skeleton-card.tsx
└── ...

src/app/(handbook)/playground/
├── page.tsx                   # 索引：所有主题分组列出
└── [topic]/
    └── page.tsx               # 主题页：展示某主题全部 demo
```

**registry.ts 数据结构**：

```ts
export interface DemoMeta {
  id: string;
  title: string;
  description: string;
  topic: 'animations' | 'layout' | 'forms' | ...;
  /** 关联章节 url（可选）—— 让 Playground 链回章节阅读 */
  relatedChapter?: string;
  /** 难度（让读者按学习曲线挑选） */
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  /** demo 组件（async server component） */
  Component: () => Promise<JSX.Element>;
}

export const demoRegistry: DemoMeta[] = [
  {
    id: 'button-hover',
    title: '按钮 Hover 过渡',
    description: 'transition 基础：状态变化时自动插值',
    topic: 'animations',
    relatedChapter: '/chapter-03/animations#21-transition状态变化时自动插值',
    difficulty: 'beginner',
    Component: ButtonHoverDemo,
  },
  // ...
];
```

**优点**：单一来源；索引 / 主题页 / 未来搜索都从 registry 取；加 demo 只需写组件 + 注册。
**缺点**：要新建 registry 抽象层；现有 §3.6 章节内嵌 demo 需要适配。

### 选项 B：每个主题页手写 demo 列表

```
/playground 索引：硬编码主题列表
/playground/animations 页：硬编码每个 demo 的 import + 渲染
```

**优点**：简单；不需要 registry。
**缺点**：加 demo 要改两处（组件 + 页面）；元信息散落；不能复用到搜索 / 章节。

### 选项 C：整站 demo 全在 Playground，章节里只放链接

**优点**：维护单点；不存在 demo 双重存在
**缺点**：章节阅读连贯性变差——读者要跳到 Playground 才能动手；与 §3.6 现有"内嵌 demo"模式冲突

## Decision Outcome

选 **A**。理由：

- 章节内嵌 + Playground 集中**两种模式互补**——选 C 会牺牲阅读连贯性
- registry 抽象层是 v1 的小投入（约 100 行 TS），未来收益（搜索 / 跨页索引 / 难度筛选）值得
- 与 SPEC-0010"渐进式 SSG 抽离"心智一致——把"产品层 demo"逐步抽出可复用结构

## 实施细节

### 路由

```
/playground                     # 索引：所有主题分组卡片
/playground/animations          # 11 个动画 demo
/playground/layout              # 3 个布局 demo
/playground/forms               # 未来：第 5 章表单 demo
```

### registry.ts SSOT

放在 `src/components/playground/registry.ts`。
按 topic 分组、按 difficulty 排序。

### 现有 demo 适配

已有 7 个 demo（4 个动画 + 3 个布局）需要：

1. 移动到 `src/components/playground/<topic>/<id>.tsx`（或保留在原位置但导入 registry）
2. 在 registry 注册元数据
3. 章节 mdx 里的 `<XxxDemo />` 引用方式不变（继续从 mdx-components 导出）

具体迁移路径（按 SPEC-0010 的"产品层 → 通用层"判断）：

- 通用 demo 组件 → 抽到 `src/components/playground/`
- 章节专属（如"§2.5 storage 演示"）→ 留在 `src/components/mdx/demos/`

### 索引页

`/playground` 显示主题分组卡片：

```tsx
<div className="topic-grid">
  <TopicCard
    title="动画"
    description="11 个可调试 demo——transition / animation / View Transitions"
    href="/playground/animations"
    demos={demoRegistry.filter(d => d.topic === 'animations').length}
  />
  <TopicCard title="布局" ... />
</div>
```

### 主题页

`/playground/animations` 平铺该主题所有 demo：

```tsx
<div className="demo-grid">
  {demoRegistry
    .filter((d) => d.topic === "animations")
    .map((demo) => (
      <DemoCard {...demo} />
    ))}
</div>
```

每个 `DemoCard`：含标题 / 描述 / 实际渲染的 demo / 难度徽章 / "查看章节"链接。

### 难度筛选

主题页顶部加难度过滤器（beginner / intermediate / advanced 三档）。

## Consequences

**好**：

- 章节阅读 + 集中动手玩双模式互补
- demo 元信息单一来源——未来可被搜索 / 路径选择器 / 进度追踪复用
- 新 demo 边际成本低（写组件 + registry 加一行）

**不好**：

- registry 抽象层的初始投入（~100 行 TS）
- 现有 7 个 demo 需要迁移
- 维护"主题分类"清单（未来加新主题时要扩展 type）

**待还的债**：

- 难度筛选 UI 实现（v2 加）
- demo 之间的"上一个 / 下一个"导航（v2 加）
- demo 截图 / 缩略图（搜索时用，v2）

## 实施触发条件

本 SPEC 是 `proposed`。实施前需要：

1. 顶级导航 SPEC-0015 落地（让 /playground 有入口）
2. 第 3 章动画 / 布局 demo 已存在（已满足）
3. 至少有 7 个 demo 沉淀（已满足）

实施可分两阶段：

**阶段 1**：基础架子

- registry.ts + 类型定义
- /playground 索引页
- /playground/animations 集成现有 4 个动画 demo
- /playground/layout 集成现有 3 个布局 demo

**阶段 2**：补全 + 增强

- 补 7 个动画 demo
- 难度筛选 UI
- 章节回链
- demo 之间的"上一个 / 下一个"

## 验收标准

阶段 1 完成时：

- `/playground` 索引页能看到所有主题
- `/playground/animations` 显示 4+ 个动画 demo，全部可交互
- `/playground/layout` 显示 3 个布局 demo
- 章节内嵌 demo 仍正常工作（不破坏现有阅读体验）
- 顶级导航有"Playground"入口（依赖 SPEC-0015）

## Pros and Cons of the Options

### A：路由 + registry SSOT

- 好：单一来源 / 双模式互补 / 扩展性强
- 不好：初始抽象投入

### B：每个主题页手写

- 好：实现最简单
- 不好：维护两份元信息 / 不可被其他系统消费

### C：所有 demo 集中

- 好：单点维护
- 不好：破坏章节阅读连贯性

## Changelog

- 2026-06-04：初次落地。选 A——registry 驱动 + 双模式互补。
  分两阶段实施。
