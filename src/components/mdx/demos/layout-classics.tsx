/**
 * 经典布局案例 demo 组件库。
 *
 * 每个 demo 导出**已包装好 DemoBlock 的完整组件**——mdx 里只需写
 * 一个标签 `<AvatarStackDemo />`，渲染节点 + 源码 + 元信息一并到位。
 * 渲染节点和源码字符串在同一文件维护，改一处必同步另一处。
 *
 * 为什么不让 mdx 直接传 code prop？mdx 的 JSX 表达式 scope 不会
 * 自动注入命名常量；曾经试过 `<DemoBlock code={AVATAR_STACK_CODE}>`
 * 在 SSR 时 code 解析为 undefined 导致源码区空白。封装内置避免坑。
 *
 * 每个 demo 是 async server component：用 highlightCode() 在构建期
 * 把源码字符串预渲染为 Shiki HTML（受 "use cache" 缓存），DemoBlock
 * 通过 dangerouslySetInnerHTML 注入。
 */
import type { CSSProperties } from "react";
import { DemoBlock } from "@/components/mdx/demo-block";
import { highlightCode } from "@/lib/highlight";

/* ---------- 1. 协同头像叠放（avatar stack） ---------- */

const AVATAR_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];
const AVATAR_LABELS = ["A", "B", "C", "D", "E"];

function AvatarStackPreview() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{ display: "flex" }}>
        {AVATAR_LABELS.map((label, i) => (
          <span
            key={label}
            title={`User ${label}`}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: AVATAR_COLORS[i],
              border: "2px solid var(--color-bg)",
              marginLeft: i === 0 ? 0 : -10,
              display: "grid",
              placeItems: "center",
              color: "white",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {label}
          </span>
        ))}
      </div>
      <span style={{ fontSize: 13, color: "var(--color-fg-muted)" }}>+3</span>
    </div>
  );
}

const AVATAR_STACK_CODE = `<div class="avatar-stack">
  <span class="avatar">A</span>
  <span class="avatar">B</span>
  <span class="avatar">C</span>
  <span class="avatar">D</span>
  <span class="avatar">E</span>
</div>
<span class="more">+3</span>

<style>
.avatar-stack { display: flex; }
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--bg);  /* 与背景同色，营造"留白"分隔 */
  display: grid;
  place-items: center;
  color: white;
  font-weight: 600;
}
.avatar:not(:first-child) {
  margin-left: -10px;            /* 关键：负 margin 让头像叠起来 */
}
</style>`;

export async function AvatarStackDemo() {
  const codeHtml = await highlightCode(AVATAR_STACK_CODE, "html");
  return (
    <DemoBlock
      title="协同头像叠放"
      description="GitHub / Vercel / Figma 风格"
      code={AVATAR_STACK_CODE}
      codeHtml={codeHtml}
      language="html"
    >
      <AvatarStackPreview />
    </DemoBlock>
  );
}

/* ---------- 2. 通知徽章（notification badge） ---------- */

function NotificationBadgePreview() {
  const buttonBase: CSSProperties = {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 8,
    border: "1px solid var(--color-border)",
    background: "var(--color-bg-elevated)",
    display: "grid",
    placeItems: "center",
    fontSize: 18,
    cursor: "pointer",
  };
  const dotBase: CSSProperties = {
    position: "absolute",
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#ef4444",
    border: "2px solid var(--color-bg)",
    boxSizing: "border-box",
  };
  const numBase: CSSProperties = {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 20,
    height: 20,
    padding: "0 6px",
    borderRadius: 999,
    background: "#ef4444",
    color: "white",
    fontSize: 11,
    lineHeight: 1,
    fontWeight: 600,
    fontFamily: "system-ui, sans-serif",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid var(--color-bg)",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
  };
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <button type="button" style={buttonBase} aria-label="通知（有新消息）">
        🔔
        <span style={dotBase} aria-hidden="true" />
      </button>
      <button type="button" style={buttonBase} aria-label="收件箱（12 条新消息）">
        ✉️
        <span style={numBase} aria-hidden="true">
          12
        </span>
      </button>
      <button type="button" style={buttonBase} aria-label="收件箱（99+ 条新消息）">
        ✉️
        <span style={numBase} aria-hidden="true">
          99+
        </span>
      </button>
    </div>
  );
}

const NOTIFICATION_BADGE_CODE = `<button class="icon-btn" aria-label="通知（有新消息）">
  🔔
  <span class="dot" aria-hidden="true"></span>
</button>

<button class="icon-btn" aria-label="收件箱（12 条新消息）">
  ✉️
  <span class="num-badge" aria-hidden="true">12</span>
</button>

<button class="icon-btn" aria-label="收件箱（99+ 条新消息）">
  ✉️
  <span class="num-badge" aria-hidden="true">99+</span>
</button>

<style>
.icon-btn {
  position: relative;            /* 关键：作为徽章的包含块 */
  width: 40px; height: 40px;
}

/* 红点：纯装饰，固定 10×10，简单 */
.dot {
  position: absolute;
  top: 6px; right: 6px;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid var(--bg);   /* 留白让小红点边缘清晰 */
  box-sizing: border-box;        /* border 算入尺寸，不撑大 */
}

/* 数字角标：可变宽度（"12" 圆，"99+" 长胶囊） */
.num-badge {
  position: absolute;
  top: -6px; right: -8px;        /* 露出图标边缘 */
  min-width: 20px; height: 20px; /* min-width 让短文本仍是圆 */
  padding: 0 6px;
  border-radius: 999px;          /* 大值=任意宽都成胶囊 */
  background: #ef4444;
  color: white;
  font-size: 11px;
  line-height: 1;
  border: 2px solid var(--bg);
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;            /* "99+" 不被换行切成两行 */
}
</style>`;

export async function NotificationBadgeDemo() {
  const codeHtml = await highlightCode(NOTIFICATION_BADGE_CODE, "html");
  return (
    <DemoBlock
      title="通知徽章"
      description="红点 + 数字角标 + 99+ 三种形态"
      code={NOTIFICATION_BADGE_CODE}
      codeHtml={codeHtml}
      language="html"
    >
      <NotificationBadgePreview />
    </DemoBlock>
  );
}

/* ---------- 3. 骨架屏（skeleton loading） ---------- */

function SkeletonCardPreview() {
  const cardStyle: CSSProperties = {
    width: 280,
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    padding: "0.875rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.625rem",
    background: "var(--color-bg)",
  };
  return (
    <div style={cardStyle} aria-busy="true" aria-label="加载中">
      <div className="skeleton-shimmer" style={{ height: 140, borderRadius: 6 }} />
      <div className="skeleton-shimmer" style={{ height: 14, width: "70%", borderRadius: 4 }} />
      <div className="skeleton-shimmer" style={{ height: 12, width: "100%", borderRadius: 4 }} />
      <div className="skeleton-shimmer" style={{ height: 12, width: "85%", borderRadius: 4 }} />
    </div>
  );
}

const SKELETON_CARD_CODE = `<article class="card" aria-busy="true" aria-label="加载中">
  <div class="skeleton" style="height: 140px;"></div>
  <div class="skeleton" style="height: 14px; width: 70%;"></div>
  <div class="skeleton" style="height: 12px;"></div>
  <div class="skeleton" style="height: 12px; width: 85%;"></div>
</article>

<style>
/* 浅灰背景 + 略深的"亮带"扫过；亮 / 暗模式各给一组色值 */
:root {
  --skeleton-base: #f3f4f6;
  --skeleton-highlight: #e5e7eb;
}
@media (prefers-color-scheme: dark) {
  :root {
    --skeleton-base: #27272a;
    --skeleton-highlight: #3f3f46;
  }
}

.skeleton {
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 0%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* 尊重用户 reduced-motion 偏好——闪烁动画对前庭功能障碍 / 偏头痛
   用户刺眼。关键：要保留可见的占位（背景仍渐变），只停动画 */
@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
}
</style>`;

export async function SkeletonCardDemo() {
  const codeHtml = await highlightCode(SKELETON_CARD_CODE, "html");
  return (
    <DemoBlock
      title="骨架屏"
      description="渐变 shimmer 动画 + reduced-motion 适配"
      code={SKELETON_CARD_CODE}
      codeHtml={codeHtml}
      language="html"
    >
      <SkeletonCardPreview />
    </DemoBlock>
  );
}
