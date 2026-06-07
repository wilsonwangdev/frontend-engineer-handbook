"use client";

import { useState, useEffect, useRef, useMemo, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { search, type IndexEntry } from "@/lib/search";

const TYPE_LABELS: Record<string, string> = {
  chapter: "章节",
  section: "小节",
  term: "术语",
  playground: "Playground",
};

type FilterType = "all" | IndexEntry["type"];

export function SearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="search-trigger"
        aria-label="搜索（⌘K）"
        title="搜索（⌘K）"
        className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]"
      >
        <SearchIcon size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>
      {open && <SearchDialog onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<IndexEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [filter, setFilter] = useState<FilterType>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (loaded) return;
    fetch("/search-index.json")
      .then((r) => r.json())
      .then(setIndex)
      .then(() => setLoaded(true))
      .catch(() => setLoaded(true));
  }, [loaded]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const results = useMemo(() => {
    const matched = search(query, index);
    return filter === "all" ? matched : matched.filter((e) => e.type === filter);
  }, [query, index, filter]);

  useEffect(() => {
    setCursor(0);
  }, [query, filter]);

  function navigate(url: string) {
    onClose();
    router.push(url);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "Enter") {
      const r = results[cursor];
      if (r) navigate(r.url);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
      return;
    }
  }

  useEffect(() => {
    listRef.current?.children[cursor]?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const types: FilterType[] = ["all", "chapter", "section", "term", "playground"];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh]"
      onClick={() => onClose()}
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative z-10 mx-2 w-full max-w-lg rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-2xl sm:mx-4">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3">
          <SearchIcon size={18} strokeWidth={1.75} className="shrink-0 text-fg-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索章节、术语..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-fg-muted/60"
            aria-label="搜索"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭搜索"
            className="shrink-0 rounded p-1 text-fg-muted hover:text-[var(--color-fg)]"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* Filter tabs */}
        {query && (
          <div className="flex gap-1 overflow-x-auto border-b border-[var(--color-border)] px-3 py-2">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                className={cn(
                  "shrink-0 rounded px-2 py-0.5 text-xs transition-colors",
                  filter === t
                    ? "bg-[var(--color-bg-elevated)] font-medium text-[var(--color-accent)]"
                    : "text-fg-muted hover:text-[var(--color-fg)]",
                )}
              >
                {t === "all" ? "全部" : TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {query && (
          <ul
            ref={listRef}
            className="max-h-[50vh] overflow-y-auto p-2 sm:max-h-[320px]"
            role="listbox"
          >
            {!loaded && <li className="px-3 py-6 text-center text-sm text-fg-muted">加载中...</li>}
            {loaded && results.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-fg-muted">无结果</li>
            )}
            {results.map((entry, i) => (
              <li key={entry.url} role="option" aria-selected={i === cursor}>
                <button
                  type="button"
                  onClick={() => navigate(entry.url)}
                  onMouseEnter={() => setCursor(i)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors",
                    i === cursor
                      ? "bg-[var(--color-bg-elevated)] text-[var(--color-fg)]"
                      : "text-fg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px]",
                      i === cursor
                        ? "bg-[var(--color-bg)] text-[var(--color-accent)]"
                        : "bg-[var(--color-bg-elevated)] text-fg-muted/70",
                    )}
                  >
                    {TYPE_LABELS[entry.type]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{entry.title}</div>
                    <div className="truncate text-xs">{entry.description}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Empty state */}
        {!query && loaded && (
          <div className="px-4 py-8 text-center text-sm text-fg-muted">
            <p>输入关键词搜索章节、小节、术语</p>
            <p className="mt-1 text-xs text-fg-muted/60">
              支持中文 / 英文 · {index.length} 个条目已索引
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
