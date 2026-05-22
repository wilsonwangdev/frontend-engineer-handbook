"use client";

import { useState, type ReactNode } from "react";
import { ChevronRight, Check, Copy } from "lucide-react";

/**
 * Live demo block: visual preview on top, foldable source below.
 *
 * 设计取舍（vs Sandpack / React Live）：
 * - 不需要运行时 babel——demo 由 `children` 真实渲染，源码作为字符串单独传
 * - 零额外依赖，与 SSR / Cache Components 兼容
 * - 不能"在线编辑"，但手册需要的是"展示一个稳定结果"，不是"沙箱"
 *
 * Shiki 高亮：上层 server component（demo 模块）用 highlightCode()
 * 把源码字符串预渲染为 HTML，传 codeHtml；DemoBlock 通过
 * dangerouslySetInnerHTML 注入。原始字符串仍传 code，供"复制"用。
 *
 * 跨设备：预览容器自身设 padding，让内容居中；窄屏自动换行。
 */
export type DemoBlockProps = {
  /** 显示在头部的标题 */
  title: string;
  /** 一句话说明这个 demo 演示什么 */
  description?: string;
  /** 真实渲染的 demo 节点 */
  children: ReactNode;
  /** 原始源码字符串（用于复制按钮） */
  code: string;
  /** Shiki 预渲染的高亮 HTML 字符串（含 <pre><code>...</code></pre>） */
  codeHtml: string;
  /** 源码的语言标签（默认 tsx） */
  language?: string;
  /** 默认是否展开源码——默认折叠：保持页面视觉简洁，让读者主动选择 */
  defaultOpen?: boolean;
};

export function DemoBlock({
  title,
  description,
  children,
  code,
  codeHtml,
  language = "tsx",
  defaultOpen = false,
}: DemoBlockProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard 拒绝——静默失败 */
    }
  }

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
      <header className="flex items-baseline justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[var(--color-fg)]">{title}</span>
          {description && <span className="text-xs text-fg-muted">{description}</span>}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-fg-muted">
          {language}
        </span>
      </header>
      <div className="flex min-h-[140px] items-center justify-center bg-[var(--color-bg)] p-6 sm:p-8">
        {children}
      </div>
      <details
        open={open}
        onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
        className="demo-source border-t border-[var(--color-border)]"
      >
        <summary className="flex cursor-pointer select-none items-center gap-1.5 px-4 py-2 text-xs text-fg-muted transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]">
          <ChevronRight
            size={12}
            strokeWidth={2}
            aria-hidden="true"
            className={"transition-transform " + (open ? "rotate-90" : "")}
          />
          <span>{open ? "收起源码" : "查看源码"}</span>
        </summary>
        <div className="relative">
          <button
            type="button"
            onClick={onCopy}
            aria-label={copied ? "已复制" : "复制源码"}
            className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]/80 text-fg-muted backdrop-blur transition-colors hover:text-[var(--color-fg)]"
          >
            {copied ? (
              <Check size={14} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Copy size={14} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
          <div className="demo-source-code" dangerouslySetInnerHTML={{ __html: codeHtml }} />
        </div>
      </details>
    </figure>
  );
}
