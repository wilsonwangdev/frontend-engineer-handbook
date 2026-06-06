---
date: 2026-06-07
tags: [mobile, h5, event-handling, react, hydration]
---

## What happened

移动端术语弹窗（底部 sheet）首次 tap 没反应，第二次 tap 才打开。

## Root cause

`useState(false)` 初始化 `isMobile`，首帧为 `false`。移动端浏览器
在 tap 时会模拟 mouse 事件序列：

```
touchstart → touchend → mouseenter → focus → click
```

由于 `isMobile` 首帧为 `false`，`onMouseEnter` handler 没有被屏蔽。
mouseenter 触发 `openImmediately()` 打开了弹窗，紧接着 click 检测到
`open === true` 又将其关闭——首 tap 白点。

第二个 tap 时 `useEffect` 已执行，`isMobile = true`，mouseenter 被
屏蔽，仅 click 正常工作。

这个问题的本质是：**媒体查询状态初始化滞后于首次用户交互**。
`useEffect` 中的 `matchMedia` 必须在组件挂载后才执行，但有状态
初始化依赖它来决定事件 handler 的附加 / 剥离。

## Fix

```tsx
// Before: 首帧 isMobile 永远是 false
const [isMobile, setIsMobile] = useState(false);

// After: lazy initializer 直接从 matchMedia 读初始值
const [isMobile, setIsMobile] = useState(() => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767.98px)").matches;
});
```

`useState` 的 lazy initializer 在组件首次创建 state 时同步执行，
早于 `useEffect`。SSR 时 `window` 不存在，返回 `false` 安全降级；
客户端 hydration 时立即读到正确的媒体查询值。

`useEffect` 仍然保留——负责监听媒体查询变化（设备旋转等）。

## Lesson for next time

**依赖媒体查询状态的组件（`isMobile` / `isTouch` / `isDarkMode` 等），
如果状态影响事件 handler 的附加 / 剥离，必须用 `useState` lazy
initializer 而非 `useState(default)` + `useEffect`。**

原因：`useEffect` 晚于首次渲染 + 首次用户交互。任何依赖"首帧正确"
来避免事件冲突的逻辑，都不能等 `useEffect` 更新。

同类模式：

- `isTouchDevice` 决定是否绑 `onMouseEnter`
- `isDarkMode` 决定是否用不同的事件处理策略
- `isPortrait` 决定手势方向

## 是否值得成为手册内容

H5 开发中这类事件模型差异（mouse 模拟、300ms 延迟历史、
passive event listener、viewport 与 visualViewport）是前端
工程化的基础设施知识。当前手册 §3.4 响应式与中文 Web 侧重
CSS 层面，§2.4 事件循环偏 JS 运行机制——H5 事件模型作为一个
独立专题，值得在合适的章节（如 §3.4 扩展或 §6 工程化实战）
中系统覆盖。

**建议**：继续积累 ≥ 3 个同类 H5 事件坑后，评估是否开独立小节。
当前先记 journal，触发升级条件时再考虑入附录 D。
