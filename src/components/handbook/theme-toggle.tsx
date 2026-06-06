"use client";

import { useState, useEffect } from "react";
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

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  }

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
