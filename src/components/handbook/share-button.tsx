"use client";

import { useState, useCallback, useEffect } from "react";
import { Share2, Check } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

const isWeChat = () =>
  typeof navigator !== "undefined" && /MicroMessenger/i.test(navigator.userAgent);

export function ShareButton({ title, description }: Props) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // 微信内置浏览器 Web Share API 实现不完整——能弹窗但无法跳转
    setCanShare(!isWeChat() && !!navigator.share);
  }, []);

  const handleShare = useCallback(async () => {
    const url = window.location.href;

    if (canShare) {
      try {
        await navigator.share({ title, text: description, url });
      } catch {
        // 用户取消分享或 API 异常——静默降级
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
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
