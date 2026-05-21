"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton() {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  async function onCopy() {
    // 当前按钮位于 figure 内，从最近的 figure 里抓 <pre> 文本
    const figure = ref.current?.closest("figure");
    const pre = figure?.querySelector("pre");
    const text = pre?.textContent ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 浏览器拒绝权限或不支持——失败静默
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onCopy}
      aria-label={copied ? "已复制" : "复制代码"}
      className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]/80 text-fg-muted opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:text-[var(--color-fg)] focus-visible:opacity-100"
    >
      {copied ? (
        <Check size={14} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Copy size={14} strokeWidth={1.75} aria-hidden="true" />
      )}
    </button>
  );
}
