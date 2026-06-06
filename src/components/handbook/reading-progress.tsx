"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const COMPLETION_KEY = "handbook:completed";
const COMPLETION_THRESHOLD = 0.9;

function getCompletedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(COMPLETION_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export function ReadingProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }
      const pct = Math.min(scrollTop / docHeight, 1);
      setProgress(pct);

      if (pct >= COMPLETION_THRESHOLD) {
        const completed = getCompletedSet();
        if (!completed.has(pathname)) {
          completed.add(pathname);
          localStorage.setItem(COMPLETION_KEY, JSON.stringify([...completed]));
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-label="阅读进度"
      className="fixed top-0 left-0 z-30 h-[2px] bg-[var(--color-accent)] transition-[width] duration-150 ease-out"
      style={{ width: `${progress * 100}%` }}
    />
  );
}
