/**
 * 经典布局案例 demo 组件库。
 *
 * 每个 demo 同时导出真实渲染节点 + 对应源码字符串。源码字符串
 * 单独维护——为了让阅读者看到的"代码"和实际效果保持一致，
 * 两边修改时必须同步。
 */
import type { CSSProperties } from "react";

/* ---------- 1. 协同头像叠放（avatar stack） ---------- */

const AVATAR_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];
const AVATARS = ["A", "B", "C", "D", "E"];

export function AvatarStackDemo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{ display: "flex" }}>
        {AVATARS.map((label, i) => (
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

export const AVATAR_STACK_CODE = `<div class="avatar-stack">
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

/* ---------- 2. 通知徽章（notification badge） ---------- */

export function NotificationBadgeDemo() {
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
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#ef4444",
    border: "2px solid var(--color-bg)",
    boxSizing: "content-box",
  };
  const numBase: CSSProperties = {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    padding: "0 5px",
    borderRadius: 9,
    background: "#ef4444",
    color: "white",
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "system-ui, sans-serif",
    display: "grid",
    placeItems: "center",
    border: "2px solid var(--color-bg)",
    boxSizing: "content-box",
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

export const NOTIFICATION_BADGE_CODE = `<button class="icon-btn" aria-label="通知（有新消息）">
  🔔
  <span class="dot" aria-hidden="true"></span>
</button>

<button class="icon-btn" aria-label="收件箱（12 条新消息）">
  ✉️
  <span class="num-badge" aria-hidden="true">12</span>
</button>

<style>
.icon-btn {
  position: relative;            /* 关键：作为徽章的包含块 */
  width: 40px; height: 40px;
}
.dot {
  position: absolute;
  top: 6px; right: 6px;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid var(--bg);    /* 留白让小红点边缘清晰 */
}
.num-badge {
  position: absolute;
  top: -6px; right: -6px;          /* 露出图标边缘 */
  min-width: 18px; height: 18px;
  padding: 0 5px;
  border-radius: 9px;              /* min-width=height 时变胶囊形 */
  background: #ef4444;
  color: white;
  border: 2px solid var(--bg);
  display: grid; place-items: center;
}
</style>`;

/* ---------- 3. 骨架屏（skeleton loading） ---------- */

export function SkeletonCardDemo() {
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

export const SKELETON_CARD_CODE = `<article class="card" aria-busy="true" aria-label="加载中">
  <div class="skeleton" style="height: 140px;"></div>
  <div class="skeleton" style="height: 14px; width: 70%;"></div>
  <div class="skeleton" style="height: 12px;"></div>
  <div class="skeleton" style="height: 12px; width: 85%;"></div>
</article>

<style>
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

/* 尊重用户 reduced-motion 偏好——闪烁动画刺眼 */
@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
}
</style>`;
