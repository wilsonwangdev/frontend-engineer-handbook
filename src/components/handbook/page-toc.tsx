"use client";

import { useEffect, useState, useRef } from "react";

interface HeadingItem {
  id: string;
  text: string;
  level: 2;
}

export function PageTOC() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const els = main.querySelectorAll("h2");
    const items: HeadingItem[] = [];

    els.forEach((el) => {
      const id = el.id;
      if (!id) return;
      items.push({
        id,
        text: el.textContent || "",
        level: 2,
      });
    });

    if (items.length < 2) return;
    setHeadings(items);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((best, cur) => {
            const bestTop = best.boundingClientRect.top;
            const curTop = cur.boundingClientRect.top;
            return curTop < bestTop ? cur : best;
          });
          setActiveId(top.target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );

    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    els.forEach((el) => observer.observe(el));
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [headings]);

  // Scroll active TOC item into view within the sidebar
  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const item = listRef.current.querySelector(`[data-toc="${activeId}"]`);
    if (item) {
      item.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeId]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="页面目录" className="text-sm">
      <p className="mb-3 text-xs font-semibold tracking-wider text-fg-muted uppercase">本页目录</p>
      <ol
        ref={listRef}
        className="max-h-[calc(100vh-10rem)] space-y-0.5 overflow-y-auto border-l border-[var(--color-border)] pl-3"
      >
        {headings.map((h) => (
          <li key={h.id} data-toc={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                  history.pushState(null, "", `#${h.id}`);
                  setActiveId(h.id);
                }
              }}
              className={
                "block truncate rounded px-2 py-1 text-xs transition-colors " +
                (activeId === h.id
                  ? "bg-[var(--color-bg-elevated)] font-medium text-[var(--color-accent)]"
                  : "text-fg-muted hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]")
              }
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
