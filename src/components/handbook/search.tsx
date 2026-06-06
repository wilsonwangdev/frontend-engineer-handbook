"use client";

import { useState, useEffect, useRef, useCallback, useMemo, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { SearchIcon, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/cn";

interface IndexEntry {
  title: string;
  description: string;
  url: string;
  type: "chapter" | "section" | "term" | "playground";
  text: string;
}

const TYPE_LABELS: Record<string, string> = {
  chapter: "章节",
  section: "小节",
  term: "术语",
  playground: "Playground",
};

type FilterType = "all" | IndexEntry["type"];

/** CJK-aware tokenizer: bigrams for Chinese, word-level for ASCII */
function tokenize(s: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i]!;
    if (/[一-鿿㐀-䶿]/.test(ch)) {
      // CJK character: emit character itself + bigram with next
      tokens.push(ch);
      if (i + 1 < s.length && /[一-鿿㐀-䶿]/.test(s[i + 1]!)) {
        tokens.push(ch + s[i + 1]!);
      }
      i++;
    } else if (/[a-zA-Z0-9]/.test(ch)) {
      // word character: accumulate into word
      let word = "";
      while (i < s.length && /[a-zA-Z0-9]/.test(s[i]!)) {
        word += s[i]!.toLowerCase();
        i++;
      }
      tokens.push(word);
    } else {
      i++;
    }
  }
  return tokens;
}

function search(query: string, entries: IndexEntry[]): IndexEntry[] {
  if (!query.trim()) return [];
  const qTokens = tokenize(query.trim());
  if (qTokens.length === 0) return [];

  const results: { entry: IndexEntry; score: number }[] = [];

  for (const entry of entries) {
    const titleLower = entry.title.toLowerCase();
    const titleTokens = tokenize(entry.title);
    const descTokens = tokenize(entry.description);
    const textTokens = tokenize(entry.text);

    let score = 0;

    // Exact match bonus
    if (titleLower === query.trim().toLowerCase()) {
      score += 100;
    }
    if (titleLower.includes(query.trim().toLowerCase())) {
      score += 50;
    }

    for (const qt of qTokens) {
      // Title match
      const titleMatch = titleTokens.filter((t) => t.includes(qt)).length;
      score += titleMatch * 10;

      // Description match
      const descMatch = descTokens.filter((t) => t.includes(qt)).length;
      score += descMatch * 3;

      // Text match
      const textMatch = textTokens.filter((t) => t.includes(qt)).length;
      score += textMatch;
    }

    if (score > 0) {
      results.push({ entry, score });
    }
  }

  return results.toSorted((a, b) => b.score - a.score).map((r) => r.entry);
}

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

  // Load index on first open
  useEffect(() => {
    if (loaded) return;
    fetch("/search-index.json")
      .then((r) => r.json())
      .then(setIndex)
      .then(() => setLoaded(true))
      .catch(() => setLoaded(true));
  }, [loaded]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Lock body scroll
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

  // Reset cursor when results change
  useEffect(() => {
    setCursor(0);
  }, [query, filter]);

  const navigate = useCallback(
    (url: string) => {
      onClose();
      router.push(url);
    },
    [onClose, router],
  );

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

  // Scroll cursor into view
  useEffect(() => {
    listRef.current?.children[cursor]?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const types: FilterType[] = ["all", "chapter", "section", "term", "playground"];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      {/* Panel */}
      <div className="relative z-10 mx-4 w-full max-w-lg rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-2xl">
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
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-fg-muted/60"
            aria-label="搜索"
          />
          <kbd className="hidden rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[10px] text-fg-muted sm:inline">
            esc
          </kbd>
        </div>

        {/* Filter tabs */}
        {query && (
          <div className="flex gap-1 border-b border-[var(--color-border)] px-3 py-2">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                className={cn(
                  "rounded px-2 py-0.5 text-xs transition-colors",
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
          <ul ref={listRef} className="max-h-[320px] overflow-y-auto p-2" role="listbox">
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
                    "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
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
                  {i === cursor && (
                    <CornerDownLeft
                      size={14}
                      strokeWidth={1.75}
                      className="mt-0.5 shrink-0 text-fg-muted/60"
                      aria-hidden="true"
                    />
                  )}
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
