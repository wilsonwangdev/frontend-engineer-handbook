---
date: 2026-06-04
tags: [react, animation, view-transitions, dogfooding, demo]
---

## What happened

第 3 章 §3.6 动画与 View Transitions 上线后，作者在阅读时发现章节
内嵌的三个交互 demo 全部不工作：

1. `CardEntranceDemo` 点"重新播放"按钮无视觉反应
2. `ViewTransitionBasicDemo` 切换"列表 / 网格"视图无过渡且 DOM 不变
3. `ThemeToggleCircularRevealDemo` 点"切换主题"按钮无任何反应

讽刺的是——本章正文里反复强调"View Transitions API 已稳定"和
"减动效是 a11y 必备"，但**手册自己的 demo 都跑不起来**。读者动手
验证的第一步就被打断。这是非常典型的"吃自己的狗粮失败"。

## Root cause

三个 bug 的根因虽然不同，但都指向同一类问题：**React 18+ 的异步
状态更新 与 浏览器同步快照 API（startViewTransition / 一帧 reflow）
之间的时序错配**。

### Bug 1：CSS animation 重启的"看似正确实则无效"

```tsx
// 错误写法：依赖 React key 让内层 div 重挂载
const [animKey, setAnimKey] = useState(0);
<div key={animKey} style={{ animation: 'slide-in 0.4s' }}>...</div>
<button onClick={() => setAnimKey(k => k + 1)}>重新播放</button>
```

理论上 `key` 改变会让 React 卸载并重新挂载这个 div——但 React 的
协调 + 浏览器优化让 CSS animation **不一定**重新触发。即使 DOM
节点确实换了，浏览器可能复用动画状态。

正确写法：**显式让 animation 走一次 `'none'` → 真值的过渡**：

```tsx
const [animating, setAnimating] = useState(true);
<div style={{ animation: animating ? "slide-in 0.4s" : "none" }}>...</div>;

function replay() {
  setAnimating(false);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => setAnimating(true));
  });
}
```

双 `requestAnimationFrame` 确保浏览器**确实**进行过一次"无动画"的
布局——下一帧再恢复 animation 时浏览器视为全新动画。

### Bug 2 / 3：startViewTransition 抓快照时 React state 还没更新

```tsx
// 错误写法
document.startViewTransition(() => {
  setView(newView); // React 18+ 异步更新 DOM
});
```

`startViewTransition` 期望 callback **同步**改 DOM——但 React 18+ 的
状态更新是异步批处理的：callback 返回时 DOM 还是旧的。浏览器抓"新
状态快照"时抓到的还是旧 DOM——前后无差异，不会播放过渡。

修复：用 `flushSync` 强制同步更新 DOM：

```tsx
import { flushSync } from "react-dom";

document.startViewTransition(() => {
  flushSync(() => setView(newView)); // 同步更新，浏览器才能抓到差异
});
```

### Bug 3 额外坑：clipPath 动画作用对象错位

ThemeToggleDemo 的圆形扩散动画用了：

```tsx
document.documentElement.animate({ clipPath: [...] }, {
  pseudoElement: '::view-transition-new(root)', // ← 错
});
```

但这个 demo **只切换 demo 容器内的主题**——`root`（整个文档）几乎
没变化，浏览器抓的"新旧快照"差异极小，clipPath 动画作用在 root 上
也基本没视觉效果。

修复：给 demo 容器加 `view-transition-name`，clipPath 作用到这个
命名捕获上：

```tsx
<div style={{ viewTransitionName: 'demo-theme-container' }}>...</div>

// animate 时：
pseudoElement: '::view-transition-new(demo-theme-container)',
```

## Fix

完整修复见 commit `39e3001`：

- `src/components/mdx/demos/animations-client.tsx`：三处修复
  - CardEntrance：双 RAF + animation 切换 `'none'` / 真值
  - ViewTransitionBasic：`flushSync(() => setView(...))`
  - ThemeToggle：`viewTransitionName` 命名捕获 + `flushSync`
- `content/chapter-03/sections/animations.mdx` §5.2：补 React + `flushSync`
  特别注意段，给出 demo 源码 GitHub 链接，让读者能对照实现

## Lesson for next time

### 关于 demo

**"做了 demo" 不等于 "demo 能用"**。手册里的 demo 是给读者**亲手
验证**章节论点的工具——demo 跑不起来 = 章节核心论点没法验证 =
读者第一步就放弃。**每个 demo 上线前必须在浏览器里点一遍**。

CI 层面：未来章节内嵌的交互 demo 应该有一个 e2e 测试用例（按钮
能点 / 状态能切换 / DOM 有变化）——纳入 SPEC-0005 测试策略。
按文字断言重构成"快照 + 结构断言"时一并加上。

### 关于 React + 浏览器同步 API

**任何依赖"DOM 同步状态变化"的浏览器 API（`startViewTransition` /
`getBoundingClientRect()` 紧跟 `setState` / `IntersectionObserver`
首次触发等）和 React 18+ 异步状态更新都会冲突**。这一类配方都需要：

- `flushSync` 包住 setState
- 或者用 `useLayoutEffect`（不是 `useEffect`）做"同步副作用"
- 或者把 React state 替换为 `useState` + `useRef` 双轨制

未来 §5 React 章节写到这里时把这一类 trap 集中讲。

### 关于 CSS animation 重启

CSS animation 重启**不能依赖 React `key` 改变**——必须显式经过
"animation: none" 一帧。这是 CSS 规范级别的硬约束，不是 React 问题。

记忆点：双 `requestAnimationFrame` 是最稳的"等浏览器真正完成一帧"
的手段——比 `setTimeout(fn, 0)` 可靠。

### 关于"吃自己的狗粮"

这次踩坑暴露了一个流程缺口：**写完章节 → 提交 → 上线**之间没有
"作者亲手用浏览器走一遍"的环节。三个 demo 都是 commit 时跑了
type-check 和 build——但这两步都不会发现 demo 在运行时不工作。

未来流程改进：

- 凡是章节内嵌**交互 demo**，作者上线前必须在 dev server 里点一遍
- 升级 SPEC-0008 R6（视觉提示要有完整功能闭环）的执行点
- 候补池"动画 Playground"展开时，把这一条也作为门禁
