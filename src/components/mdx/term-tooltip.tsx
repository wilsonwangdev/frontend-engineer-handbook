/**
 * <Term> 客户端交互层。
 *
 * 视觉提示：dotted underline + 微弱前景色变化
 *
 * 设备适应策略（基于 W3C Media Queries Level 4）：
 *   - hover 设备（鼠标 / 触控板）→ hover / focus 显示浮窗
 *   - 触屏设备（手机 / 平板）→ tap 弹出底部 sheet
 *
 * 用 `(hover: hover)` 而非 `max-width` 判断设备能力，
 * 正确区分"窄桌面窗口"（有 hover）和"宽平板"（无 hover）。
 *
 * "鼠标穿越间隙"问题：trigger 和浮窗之间有 0.5rem 视觉间隙；如果鼠标
 * 移开 trigger 时立即关闭，鼠标过桥到浮窗的瞬间会触发关闭。
 * 修复：双重保险——
 *   1. 关闭走 setTimeout（120ms 延迟）；进入浮窗时 cancel 这个 timeout
 *   2. CSS 在 trigger / tooltip 之间用 ::before 透明桥填满间隙，
 *      鼠标穿越间隙时仍处于 hover 范围内
 */
"use client";

import { useState, useRef, useEffect, useId, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

interface TermTooltipProps {
  termKey: string;
  label: string;
  zh?: string;
  brief: string;
}

const CLOSE_DELAY_MS = 120;

export function TermTooltip({ termKey, label, zh, brief }: TermTooltipProps) {
  const [open, setOpen] = useState(false);
  // hover 能力是设备常量，不会在运行时变化——不需要 state + useEffect 监听
  const [isTouchDevice] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia("(hover: hover)").matches;
  });
  const containerRef = useRef<HTMLSpanElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  function scheduleClose() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  function cancelClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function openImmediately() {
    cancelClose();
    setOpen(true);
  }

  // 触屏设备点击浮窗外关闭 + Escape（hover 设备也有此需求）
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  function handleKeyDown(e: KeyboardEvent<HTMLSpanElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    }
  }

  // 触屏设备屏蔽所有 pointer 事件——只靠 onClick 切换，避免
  // mouseenter / focus / click 多个 handler 互相打架
  return (
    <span ref={containerRef} className="term">
      <span
        role="button"
        tabIndex={0}
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        className="term-trigger"
        onMouseEnter={isTouchDevice ? undefined : openImmediately}
        onMouseLeave={isTouchDevice ? undefined : scheduleClose}
        onFocus={isTouchDevice ? undefined : openImmediately}
        onBlur={isTouchDevice ? undefined : scheduleClose}
        onClick={(e) => {
          e.stopPropagation();
          if (open) {
            setOpen(false);
          } else {
            openImmediately();
          }
        }}
        onKeyDown={handleKeyDown}
      >
        {label}
      </span>
      {open &&
        isTouchDevice &&
        createPortal(
          <MobileTermSheet
            termKey={termKey}
            zh={zh}
            brief={brief}
            tooltipId={tooltipId}
            onClose={() => setOpen(false)}
          />,
          document.body,
        )}
      {open && !isTouchDevice && (
        <span
          id={tooltipId}
          role="tooltip"
          className="term-tooltip"
          onMouseEnter={openImmediately}
          onMouseLeave={scheduleClose}
        >
          <span className="term-tooltip-header">
            <span className="term-tooltip-key">{termKey}</span>
            {zh && <span className="term-tooltip-zh">{zh}</span>}
          </span>
          <span className="term-tooltip-brief">{brief}</span>
          <a
            href={`/glossary#${termKey}`}
            className="term-tooltip-link"
            onClick={(e) => e.stopPropagation()}
          >
            查看详情 →
          </a>
        </span>
      )}
    </span>
  );
}

function MobileTermSheet({
  termKey,
  zh,
  brief,
  tooltipId,
  onClose,
}: {
  termKey: string;
  zh?: string;
  brief: string;
  tooltipId: string;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 animate-[term-sheet-fade_0.2s_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        id={tooltipId}
        role="dialog"
        aria-modal="true"
        aria-label={`术语：${termKey}`}
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-xl border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 pb-8 pt-5 shadow-xl animate-[term-sheet-up_0.25s_ease-out]"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--color-border)]" />
        <div className="mb-3 flex items-baseline gap-3">
          <span className="font-mono text-lg font-bold text-[var(--color-accent)]">{termKey}</span>
          {zh && <span className="text-base text-fg-muted">{zh}</span>}
        </div>
        <div className="mb-4 text-sm leading-relaxed text-[var(--color-fg)]">{brief}</div>
        <a
          href={`/glossary#${termKey}`}
          className="inline-flex items-center rounded-md bg-[var(--color-bg-elevated)] px-3 py-2 text-sm font-medium text-[var(--color-accent)] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          查看详情 →
        </a>
      </div>
    </>
  );
}
