---
date: 2026-06-07
tags: [mobile, h5, browser, ux, content-idea]
---

## 移动端浏览器默认行为收集

站内开发和内容写作过程中积累的 H5 默认行为知识。

### 已记录

1. **iOS Safari 输入框自动缩放**
   - 行为：输入框 `<input>` 获得焦点时，若 `font-size < 16px`，浏览器自动放大页面
   - 修复：设置 `font-size: 16px`（0.5 个小点的差异无关大局，但能消掉缩放）
   - 影响面：所有包含 `<input>` 的页面
   - 来源：搜索组件 H5 适配（2026-06-07）

2. **移动端 tap 事件触发 mouse 事件序列**
   - 行为：touchstart → touchend → mouseenter → focus → click
   - 修复：用 `(hover: hover)` 检测触屏设备，屏蔽 `onMouseEnter`/`onFocus`
   - 来源：TermTooltip 首次 tap 失效（2026-06-07）

3. **微信内置浏览器 Web Share API 不完整**
   - 行为：`navigator.share()` 存在但弹窗后无法跳转到会话选择
   - 修复：检测 MicroMessenger UA → 降级到剪切板复制
   - 来源：ShareButton 适配（2026-06-07）

### 待积累

4. **300ms tap delay 的历史与消除**
5. **passive event listener 的默认行为**
6. **viewport 元标签 vs visualViewport API**
7. **移动端 hover 态的"粘滞"问题**

### 内容价值评估

这类知识分散在 Stack Overflow、博客、Twitter 中，没有统一的中文整理。
对前端开发者（尤其是新人）来说，"移动端 H5 不同于桌面端的前 10 个坑"
是一份高价值速查清单。

建议归宿：

- 初期：持续收集到 journal，≥ 5 条后评估
- 中期：整理为附录 D（实战避坑录）的"H5 默认行为"子章节
- 远期：考虑在第 3 章（响应式）或第 8 章（前沿话题）中加入
  "移动端 Web 的隐性规则"独立小节
