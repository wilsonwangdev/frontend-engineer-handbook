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
 * 跨设备：预览容器自身设 padding，让内容居中；窄屏自动换行。
 */
export type DemoBlockProps = {
  /** 显示在头部的标题 */
  title: string;
  /** 一句话说明这个 demo 演示什么 */
  description?: string;
  /** 真实渲染的 demo 节点 */
  children: ReactNode;
  /** 源码字符串（包含 HTML 结构 + CSS） */
  code: string;
  /** 源码的语言标签（默认 tsx） */
  language?: string;
  /** 默认是否展开源码 */
  defaultOpen?: boolean;
};

export function DemoBlock({
  title,
  description,
  children,
  code,
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
      <div className="grid place-items-center bg-[var(--color-bg)] p-6 sm:p-8">{children}</div>
      <details
        open={open}
        onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
        className="border-t border-[var(--color-border)]"
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
            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]/80 text-fg-muted backdrop-blur transition-colors hover:text-[var(--color-fg)]"
          >
            {copied ? (
              <Check size={14} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Copy size={14} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
          <pre className="overflow-x-auto bg-[var(--color-bg-elevated)] p-4 font-mono text-xs leading-relaxed text-[var(--color-fg)]">
            <code>{code}</code>
          </pre>
        </div>
      </details>
    </figure>
  );
}
