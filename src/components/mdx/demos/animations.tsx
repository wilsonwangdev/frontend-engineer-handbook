/**
 * 动画 demo 组件库（章节内嵌版）—— Server component 包装器。
 *
 * 每个 demo 是 async server component，用 highlightCode() 在构建期
 * 把源码字符串预渲染为 Shiki HTML，然后与客户端 Preview 组件一起
 * 传给 DemoBlock。
 *
 * 客户端 Preview 组件（含 hooks / 事件处理）位于 animations-client.tsx。
 */
import { DemoBlock } from "@/components/mdx/demo-block";
import { highlightCode } from "@/lib/highlight";
import {
  ButtonHoverPreview,
  CardEntrancePreview,
  ViewTransitionBasicPreview,
  ThemeToggleCircularRevealPreview,
} from "./animations-client";

/* ============================================================
 * Demo 1: ButtonHoverDemo —— transition 基础
 * ============================================================ */

const BUTTON_HOVER_CODE = `<button class="btn">Hover 我看过渡</button>

<style>
.btn {
  padding: 0.625rem 1.25rem;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  /* 关键：transition 写在默认状态，hover 进入和离开都有过渡 */
  transition: background 0.2s ease, transform 0.2s ease;
}

.btn:hover {
  background: #1d4ed8;         /* 颜色变深 */
  transform: translateY(-2px); /* 略微上浮 */
}

/* 试着改：
   - duration: 0.2s → 1s    （感受过渡变慢）
   - ease → linear           （感受机械感）
   - translateY(-2px) → -10px（感受过度强调）
*/
</style>`;

export async function ButtonHoverDemo() {
  const codeHtml = await highlightCode(BUTTON_HOVER_CODE, "html");
  return (
    <DemoBlock
      title="按钮 Hover 过渡"
      description="transition 基础：状态变化时自动插值"
      code={BUTTON_HOVER_CODE}
      codeHtml={codeHtml}
      language="html"
    >
      <ButtonHoverPreview />
    </DemoBlock>
  );
}

/* ============================================================
 * Demo 2: CardEntranceDemo —— @keyframes + animation
 * ============================================================ */

const CARD_ENTRANCE_CODE = `<div class="card">
  <h3>卡片标题</h3>
  <p>进入动画演示：从下往上滑入 + 淡入</p>
</div>

<style>
.card {
  animation: slide-in-up 0.4s ease-out both;
  /*         ↑名称  ↑时长 ↑缓动  ↑填充模式 */
}

@keyframes slide-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  50% {
    opacity: 0.5; /* 中间关键帧：半透明 */
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* animation-fill-mode: both = 
   动画开始前停在 0%，结束后停在 100% */
/* 试着改：
   - 0% translateY(20px) → 50px（感受起点更远）
   - ease-out → linear（感受机械感）
   - 删掉 50% 关键帧（感受三帧 vs 两帧）
*/
</style>`;

export async function CardEntranceDemo() {
  const codeHtml = await highlightCode(CARD_ENTRANCE_CODE, "html");
  return (
    <DemoBlock
      title="卡片进入动画"
      description="@keyframes + animation：多关键帧时间轴"
      code={CARD_ENTRANCE_CODE}
      codeHtml={codeHtml}
      language="html"
    >
      <CardEntrancePreview />
    </DemoBlock>
  );
}

/* ============================================================
 * Demo 3: ViewTransitionBasicDemo —— View Transitions API
 * ============================================================ */

const VIEW_TRANSITION_BASIC_CODE = `<button onclick="toggleView('list')">列表视图</button>
<button onclick="toggleView('grid')">网格视图</button>

<div id="container" class="list-view">
  <div class="item">项目 1</div>
  <div class="item">项目 2</div>
  <div class="item">项目 3</div>
  <div class="item">项目 4</div>
</div>

<script>
function toggleView(view) {
  const container = document.getElementById('container');
  
  // 关键：View Transition API
  if (!document.startViewTransition) {
    // 降级：不支持的浏览器直接改 DOM
    container.className = view + '-view';
    return;
  }
  
  // 支持的浏览器：自动捕获前后状态、生成过渡
  document.startViewTransition(() => {
    container.className = view + '-view';
  });
}
</script>

<style>
.list-view {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.grid-view {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

/* 浏览器自动生成交叉淡入淡出，零额外 CSS */
</style>`;

export async function ViewTransitionBasicDemo() {
  const codeHtml = await highlightCode(VIEW_TRANSITION_BASIC_CODE, "html");
  return (
    <DemoBlock
      title="View Transition 基础"
      description="浏览器原生跨状态过渡（含降级）"
      code={VIEW_TRANSITION_BASIC_CODE}
      codeHtml={codeHtml}
      language="html"
    >
      <ViewTransitionBasicPreview />
    </DemoBlock>
  );
}

/* ============================================================
 * Demo 4: ThemeToggleCircularRevealDemo —— 暗色切换圆形扩散
 * ============================================================ */

const THEME_TOGGLE_CIRCULAR_CODE = `<button id="theme-toggle">切换主题</button>

<script>
document.getElementById('theme-toggle')
  .addEventListener('click', (event) => {
  const x = event.clientX;
  const y = event.clientY;
  
  // 计算从点击位置到屏幕四角的最远距离
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );
  
  // 降级判断
  if (!document.startViewTransition) {
    toggleTheme();
    return;
  }
  
  // 触发 View Transition
  const transition = document.startViewTransition(() => {
    toggleTheme();
  });
  
  // 自定义动画：从点击位置圆形扩散
  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          \`circle(0px at \${x}px \${y}px)\`,
          \`circle(\${endRadius}px at \${x}px \${y}px)\`,
        ],
      },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  });
});

function toggleTheme() {
  const root = document.documentElement;
  root.dataset.theme = 
    root.dataset.theme === 'dark' ? 'light' : 'dark';
}
</script>

<style>
[data-theme='light'] {
  background: #ffffff;
  color: #1a1a1a;
}
[data-theme='dark'] {
  background: #1a1a1a;
  color: #e5e5e5;
}
</style>`;

export async function ThemeToggleCircularRevealDemo() {
  const codeHtml = await highlightCode(THEME_TOGGLE_CIRCULAR_CODE, "html");
  return (
    <DemoBlock
      title="暗色切换圆形扩散"
      description="View Transition + clip-path 实现的杀手级效果"
      code={THEME_TOGGLE_CIRCULAR_CODE}
      codeHtml={codeHtml}
      language="html"
    >
      <ThemeToggleCircularRevealPreview />
    </DemoBlock>
  );
}
