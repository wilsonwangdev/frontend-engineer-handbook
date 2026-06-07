"use client";

import { useState, useCallback, useEffect } from "react";
import { Share2, Check } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export function ShareButton({ title, description }: Props) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);

  const handleShare = useCallback(async () => {
    const url = window.location.href;

    if (canShare) {
      try {
        await navigator.share({ title, text: description, url });
      } catch {
        // 用户取消分享——静默
      }
    } else {
      // 桌面端降级：复制链接
      const text = `${title}\n${description}\n${url}`;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard 拒绝——静默
      }
    }
  }, [title, description, canShare]);

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-fg-muted transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]"
      aria-label={canShare ? "分享此页面" : "复制链接"}
    >
      {copied ? (
        <>
          <Check size={14} strokeWidth={2} />
          <span>已复制</span>
        </>
      ) : (
        <>
          <Share2 size={14} strokeWidth={1.75} />
          <span>{canShare ? "分享" : "复制链接"}</span>
        </>
      )}
    </button>
  );
}
