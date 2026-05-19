import { cn } from "@/lib/cn";
import type { Tier } from "@/lib/content-schema";

interface TierBadgeProps {
  tier: Tier;
  className?: string;
}

const tierMeta: Record<Tier, { label: string; bg: string; fg: string; ring: string }> = {
  essential: {
    label: "必学",
    bg: "bg-[var(--color-tier-essential-bg)]",
    fg: "text-[var(--color-tier-essential)]",
    ring: "ring-[var(--color-tier-essential)]/20",
  },
  understand: {
    label: "仍需理解",
    bg: "bg-[var(--color-tier-understand-bg)]",
    fg: "text-[var(--color-tier-understand)]",
    ring: "ring-[var(--color-tier-understand)]/20",
  },
  delegatable: {
    label: "可委托 AI",
    bg: "bg-[var(--color-tier-delegatable-bg)]",
    fg: "text-[var(--color-tier-delegatable)]",
    ring: "ring-[var(--color-tier-delegatable)]/20",
  },
};

export function TierBadge({ tier, className }: TierBadgeProps) {
  const m = tierMeta[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        m.bg,
        m.fg,
        m.ring,
        className,
      )}
    >
      {m.label}
    </span>
  );
}
