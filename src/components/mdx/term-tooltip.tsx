/**
 * <Term> 客户端交互层。
 *
 * 视觉提示：dotted underline + 微弱前景色变化
 * 触发：hover（桌面）/ focus（键盘）/ click（移动端 + 跳转）
 *
 * 行为：
 *   - hover / focus → 显示浮窗（含 brief + "查看详情" 链接）
 *   - 浮窗里点链接 → 跳转 /glossary#<key>
 *   - 移动端 tap → 切换浮窗显示；浮窗外 tap → 关闭
 *
 * "鼠标穿越间隙"问题：trigger 和浮窗之间有 0.5rem 视觉间隙；如果鼠标
 * 移开 trigger 时立即关闭，鼠标过桥到浮窗的瞬间会触发关闭。
 * 修复：双重保险——
 *   1. 关闭走 setTimeout（120ms 延迟）；进入浮窗时 cancel 这个 timeout
 *   2. CSS 在 trigger / tooltip 之间用 ::before 透明桥填满间隙，
 *      鼠标穿越间隙时仍处于 hover 范围内
 *
 * 设计取舍：
 *   - 不用第三方 popover 库（Radix 等）—— 浮窗逻辑足够简单，
 *     避免引入 KB 级依赖
 *   - 浮窗位置用 absolute + transform，让浏览器自动处理边界
 *     （超出视口时由 max-width / overflow 控制）
 */
"use client";

import { useState, useRef, useEffect, useId, type KeyboardEvent } from "react";

interface TermTooltipProps {
  termKey: string;
  /** 显示在原文位置的文本（可与 termKey 不同——比如术语用过去时态） */
  label: string;
  /** 中文译名（无中文译时省略） */
  zh?: string;
  /** 一句话定义 */
  brief: string;
}

/** 关闭延迟（ms）—— 给鼠标"过桥"到浮窗留窗口期 */
const CLOSE_DELAY_MS = 120;

export function TermTooltip({ termKey, label, zh, brief }: TermTooltipProps) {
  const [open, setOpen] = useState(false);
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

  // 移动端 tap 浮窗外关闭
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

  // 卸载时清理 timer
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

  return (
    <span ref={containerRef} className="term">
      <span
        role="button"
        tabIndex={0}
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        className="term-trigger"
        onMouseEnter={openImmediately}
        onMouseLeave={scheduleClose}
        onFocus={openImmediately}
        onBlur={scheduleClose}
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
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="term-tooltip"
          // 浮窗内的鼠标移入也算 hover——cancel 关闭计时；鼠标移出时再次安排关闭
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
