"use client";

import { useEffect, useState, type ReactNode } from "react";

interface TourTooltipProps {
  /** localStorage key — tooltip shows once, never again after dismissed */
  storageKey: string;
  /** Content to show in the tooltip */
  children: ReactNode;
  /** Called when the tooltip is dismissed */
  onDismiss?: () => void;
  /** Auto-dismiss after this many ms (default 5000) */
  duration?: number;
  /** Optional className for the wrapper */
  className?: string;
}

/**
 * One-time onboarding tooltip. Shows on first visit (per storageKey),
 * auto-dismisses after `duration` ms, and never shows again.
 *
 * Usage:
 *   <TourTooltip storageKey="my-feature-tour">
 *     <p>Click here to...</p>
 *   </TourTooltip>
 */
export function TourTooltip({
  storageKey,
  children,
  onDismiss,
  duration = 5000,
  className = "",
}: TourTooltipProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(storageKey)) return;
    setVisible(true);
    localStorage.setItem(storageKey, "1");
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [storageKey, duration]);

  if (!visible) return null;

  function dismiss() {
    setVisible(false);
    onDismiss?.();
  }

  return (
    <div
      role="status"
      className={
        "rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-bg)] px-3 py-2.5 shadow-lg " +
        className
      }
    >
      {children}
      <button
        type="button"
        onClick={dismiss}
        className="mt-1.5 text-[11px] text-[var(--color-accent)] hover:underline"
      >
        知道了
      </button>
    </div>
  );
}
