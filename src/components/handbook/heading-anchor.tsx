"use client";

import { useEffect, useState, useCallback } from "react";

export function HeadingAnchor() {
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1500);
  }, []);

  useEffect(() => {
    const article = document.querySelector("article.prose-cn");
    if (!article) return;

    function createButton(heading: HTMLHeadingElement) {
      if (heading.querySelector(".heading-anchor-btn")) return;

      const id = heading.id;
      if (!id) return;

      const btn = document.createElement("button");
      btn.className =
        "heading-anchor-btn absolute -left-7 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-6 h-6 rounded opacity-30 hover:opacity-100 transition-opacity text-fg-muted hover:text-[var(--color-accent)]";
      btn.setAttribute("data-testid", "heading-anchor");
      btn.setAttribute("aria-label", "复制此节链接");
      btn.setAttribute("title", "复制此节链接");
      btn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const url = `${window.location.origin}${window.location.pathname}#${id}`;
        navigator.clipboard
          .writeText(url)
          .then(() => showToast("链接已复制"))
          .catch(() => {});
      });

      heading.style.position = "relative";
      heading.appendChild(btn);
    }

    article.querySelectorAll<HTMLHeadingElement>("h2, h3").forEach(createButton);

    const observer = new MutationObserver(() => {
      article.querySelectorAll<HTMLHeadingElement>("h2, h3").forEach(createButton);
    });
    observer.observe(article, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [showToast]);

  if (!toast) return null;

  return (
    <span
      className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-[var(--color-fg)] px-4 py-2 text-sm text-[var(--color-bg)] shadow-lg animate-[heading-anchor-fade_1.5s_ease-out]"
      aria-live="polite"
    >
      {toast}
    </span>
  );
}
