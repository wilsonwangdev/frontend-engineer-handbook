---
date: 2026-06-07
tags: [cdp, debugging, ui, methodology, agent-skill]
---

## What happened

首页 FeatureCard 高度不一致，前两次尝试（`h-full`、`items-stretch`）
都是猜的——从代码推理 CSS 行为，结论错误。第三次用 MCP browser_eval
工具直接测量 DOM，发现 Grid `items-stretch` 只保证同行等高、跨行不同，
最终通过 CDP 截图 + 测量定位到根因，换纵向居中布局彻底解决。

路径卡片（PathCard）同理：CDP 截图 + 测量确认改造后的 40px 圆形 +
居中布局视觉效果符合预期。

## Key insight

**CSS 布局 bug 不能从代码推理，必须从 DOM 测量。** `h-full` 在 Grid
stretch 布局中无效这个事实，读代码推断不出来——看 MDN 文档也不一定
注意到——但 `getBoundingClientRect()` 一行就能告诉你真相。

## CDP-driven UI debugging 工作流

```
1. navigate   → 打开页面
2. evaluate   → 测量关键元素的 computed style + rect
3. screenshot → 确认视觉结果
4. analyze    → 对比数据找根因
5. edit       → 修改代码
6. 重复 1-3   → 验证修复
```

关键命令：

```js
// 测量元素
const cards = document.querySelectorAll(".target-class");
Array.from(cards).map((c) => ({
  h: Math.round(c.getBoundingClientRect().height),
  w: Math.round(c.getBoundingClientRect().width),
}));

// 查看 computed style
const style = getComputedStyle(element);
style.display;
style.minHeight;
style.lineHeight;
```

## 什么场景必须用 CDP

| 场景                        | 纯代码推理  |      CDP 测量       |
| --------------------------- | :---------: | :-----------------: |
| CSS 布局不一致（高度/对齐） |    ❌ 猜    |    ✅ 一行测出来    |
| 响应式断点验证              | ❌ 心智模拟 | ✅ 调 viewport 截图 |
| 跨浏览器渲染差异            |  ❌ 不可知  | ✅ 换 browser 参数  |
| 动画/过渡行为异常           |    ❌ 猜    |  ✅ 截图对比前后帧  |

## Lesson for next time

**遇到 UI bug，第一反应不是读代码推理——是开 CDP 测量。** 代码告诉
你"应该怎样"，DOM 告诉你"实际怎样"。CSS 尤其如此——层叠、继承、
格式化上下文，任何一个环节都可能产生与代码逻辑不符的结果。

这个 workflow 应该在项目 memory 中持久化，确保跨会话 agent 遇到
UI 问题时优先走 CDP 测量路径。

---

## 追加：text-decoration 跨浏览器不一致问题

**现象**：`text-underline-offset` + `text-decoration-skip-ink: auto` 在
不同浏览器中对 descender（g/y/p 等字母降部）的处理不一致——部分浏览器
降部仍会"切断"下划线。

**根因**：`text-decoration-skip-ink` 的实现依赖字体的 ink 边界检测，不同
渲染引擎（Blink/WebKit/Gecko）对"何处算 ink"的判断不同。

**通用修复**：用 `border-bottom` 替代 `text-decoration`。边框始终绘制在
元素 box 下方，不受文字字形影响：

```css
a {
  text-decoration: none;
  border-bottom: 1px solid currentColor;
  padding-bottom: 0.05em;
}
a:hover {
  border-bottom-width: 2px;
}
```

**内容价值**：可升级到附录 D（实战避坑录），作为 CSS 实现细节的典型案例。
目前在 journal 为首次记录，等 ≥2 次同类问题累积后触发升级。
