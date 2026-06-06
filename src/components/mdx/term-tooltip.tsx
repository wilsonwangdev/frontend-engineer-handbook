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

export function TermTooltip({ termKey, label, zh, brief }: TermTooltipProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

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
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
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
          // 浮窗内的鼠标移入也算是 hover——避免 hover 离开 trigger 时浮窗立刻消失
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
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
