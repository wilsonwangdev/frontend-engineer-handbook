/**
 * 动画 demo 的客户端预览组件。
 *
 * 这些 Preview 组件包含 hooks / 事件处理，必须在 client component 里。
 * 由 server component 包装器（animations.tsx）通过 <Preview /> 引用，
 * 与 DemoBlock 一起渲染。
 */
"use client";

import { useState, useRef, type CSSProperties } from "react";
import { flushSync } from "react-dom";

/* ============================================================
 * 1. ButtonHoverPreview —— transition 基础
 * ============================================================ */

export function ButtonHoverPreview() {
  const buttonStyle: CSSProperties = {
    padding: "0.625rem 1.25rem",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s ease, transform 0.2s ease",
    fontFamily: "system-ui, sans-serif",
  };

  return (
    <button
      type="button"
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1d4ed8";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#3b82f6";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      Hover 我看过渡
    </button>
  );
}

/* ============================================================
 * 2. CardEntrancePreview —— @keyframes + animation
 * ============================================================ */

export function CardEntrancePreview() {
  const [animating, setAnimating] = useState(true);

  const cardStyle: CSSProperties = {
    width: 280,
    padding: "1.25rem",
    background: "var(--color-bg-elevated)",
    border: "1px solid var(--color-border)",
    borderRadius: 12,
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    // 关键：用 animating 切换 animation 名称——'none' 时清除，下次切回触发 reflow
    animation: animating ? "demo-slide-in-up 0.4s ease-out both" : "none",
  };

  // 重新播放：先把 animation 设为 'none'，下一帧再恢复——浏览器把这视为"全新的动画"
  function replay() {
    setAnimating(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimating(true));
    });
  }

  return (
    <div>
      <style>{`
        @keyframes demo-slide-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          50% { opacity: 0.5; }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={cardStyle}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>卡片标题</h3>
        <p
          style={{
            margin: "0.5rem 0 0",
            fontSize: 14,
            color: "var(--color-fg-muted)",
          }}
        >
          进入动画演示：从下往上滑入 + 淡入
        </p>
      </div>
      <button
        type="button"
        onClick={replay}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 12,
          color: "var(--color-fg)",
        }}
      >
        重新播放
      </button>
    </div>
  );
}

/* ============================================================
 * 3. ViewTransitionBasicPreview —— View Transitions API
 * ============================================================ */

const viewToggleButtonStyle = (active: boolean): CSSProperties => ({
  flex: 1,
  padding: "0.5rem",
  background: active ? "#3b82f6" : "var(--color-bg-elevated)",
  color: active ? "white" : "var(--color-fg)",
  border: "1px solid var(--color-border)",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: active ? 600 : 400,
});

export function ViewTransitionBasicPreview() {
  const [view, setView] = useState<"list" | "grid">("list");

  const containerStyle: CSSProperties = {
    width: "100%",
    maxWidth: 400,
  };

  const buttonGroupStyle: CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
  };

  const itemStyle: CSSProperties = {
    padding: "0.75rem",
    background: "var(--color-bg-elevated)",
    border: "1px solid var(--color-border)",
    borderRadius: 6,
    fontSize: 13,
  };

  const listContainerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const gridContainerStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "0.5rem",
  };

  const handleToggle = (newView: "list" | "grid") => {
    if (typeof document.startViewTransition === "function") {
      // 关键：startViewTransition 的回调里必须用 flushSync 强制同步更新 DOM
      // 否则 React 18+ 异步批处理会让 DOM 在回调返回后才更新——浏览器抓不到差异
      document.startViewTransition(() => {
        flushSync(() => setView(newView));
      });
    } else {
      setView(newView);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={buttonGroupStyle}>
        <button
          type="button"
          style={viewToggleButtonStyle(view === "list")}
          onClick={() => handleToggle("list")}
        >
          列表视图
        </button>
        <button
          type="button"
          style={viewToggleButtonStyle(view === "grid")}
          onClick={() => handleToggle("grid")}
        >
          网格视图
        </button>
      </div>
      <div style={view === "list" ? listContainerStyle : gridContainerStyle}>
        <div style={itemStyle}>项目 1</div>
        <div style={itemStyle}>项目 2</div>
        <div style={itemStyle}>项目 3</div>
        <div style={itemStyle}>项目 4</div>
      </div>
    </div>
  );
}

/* ============================================================
 * 4. ThemeToggleCircularRevealPreview —— 暗色切换圆形扩散
 * ============================================================ */

export function ThemeToggleCircularRevealPreview() {
  const [isDark, setIsDark] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const containerStyle: CSSProperties = {
    width: "100%",
    minHeight: 240,
    padding: "2rem",
    background: isDark ? "#1a1a1a" : "#ffffff",
    color: isDark ? "#e5e5e5" : "#1a1a1a",
    borderRadius: 12,
    border: "1px solid var(--color-border)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    position: "relative",
    overflow: "hidden",
    // 关键：给 demo 容器命名，让 View Transition 把它作为独立"演员"捕获
    viewTransitionName: "demo-theme-container",
  };

  const buttonStyle: CSSProperties = {
    padding: "0.625rem 1.25rem",
    background: isDark ? "#3b82f6" : "#1a1a1a",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  };

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const x = event.clientX;
    const y = event.clientY;
    const rect = containerRef.current?.getBoundingClientRect();

    if (typeof document.startViewTransition !== "function") {
      setIsDark((v) => !v);
      return;
    }

    // 计算圆形扩散半径——以 demo 容器的对角线为半径，覆盖整个容器
    const localX = rect ? x - rect.left : x;
    const localY = rect ? y - rect.top : y;
    const w = rect?.width ?? window.innerWidth;
    const h = rect?.height ?? window.innerHeight;
    const endRadius = Math.hypot(Math.max(localX, w - localX), Math.max(localY, h - localY));

    const transition = document.startViewTransition(() => {
      // flushSync 强制同步更新 DOM，让 View Transition 抓到新旧状态差异
      flushSync(() => setIsDark((v) => !v));
    });

    transition.ready
      .then(() => {
        // 给命名的 demo 容器（::view-transition-new(demo-theme-container)）加圆形扩散动画
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
          },
          {
            duration: 500,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(demo-theme-container)",
          },
        );
      })
      .catch(() => {
        /* 动画 API 失败时静默降级——不影响主题切换 */
      });
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      <p style={{ fontSize: 14, margin: 0, opacity: 0.8 }}>当前主题：{isDark ? "暗色" : "亮色"}</p>
      <button type="button" style={buttonStyle} onClick={handleToggle}>
        点我切换主题
      </button>
      <p
        style={{
          fontSize: 12,
          margin: 0,
          opacity: 0.6,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        从点击位置圆形扩散（仅切换 demo 容器内主题）
        <br />
        Chrome / Edge / Safari 18+ 支持；不支持的浏览器降级直接切换
      </p>
    </div>
  );
}
