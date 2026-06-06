"use client";

import { useState, useEffect, useCallback } from "react";
import { Sun, Moon } from "lucide-react";

function getTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getTheme());
    setMounted(true);
  }, []);

  const toggle = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const x = event.clientX;
      const y = event.clientY;
      const next = theme === "light" ? "dark" : "light";

      if (typeof document.startViewTransition !== "function") {
        setTheme(next);
        applyTheme(next);
        return;
      }

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      const transition = document.startViewTransition(() => {
        applyTheme(next);
      });

      setTheme(next);

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
            },
            {
              duration: 500,
              easing: "ease-in-out",
              pseudoElement: "::view-transition-new(root)",
            },
          );
        })
        .catch(() => {
          /* 动画 API 异常时静默降级——主题已切换成功 */
        });
    },
    [theme],
  );

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? (theme === "light" ? "切换到暗色模式" : "切换到亮色模式") : "切换主题"}
      className="inline-flex items-center justify-center rounded-md p-1.5 text-fg-muted transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]"
    >
      {!mounted ? (
        <span className="h-[18px] w-[18px]" aria-hidden="true" />
      ) : theme === "light" ? (
        <Sun size={18} strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Moon size={18} strokeWidth={1.75} aria-hidden="true" />
      )}
    </button>
  );
}
