import type { ReactNode } from "react";

type Variant = "tip" | "warning" | "ai" | "reference";

const variantMeta: Record<Variant, { label: string; border: string; bg: string }> = {
  tip: {
    label: "提示",
    border: "border-l-[var(--color-accent)]",
    bg: "bg-[var(--color-bg-elevated)]",
  },
  warning: {
    label: "注意",
    border: "border-l-[var(--color-tier-understand)]",
    bg: "bg-[var(--color-tier-understand-bg)]",
  },
  ai: {
    label: "AI 协作要点",
    border: "border-l-[var(--color-tier-essential)]",
    bg: "bg-[var(--color-tier-essential-bg)]",
  },
  reference: {
    label: "延伸阅读",
    border: "border-l-[var(--color-tier-delegatable)]",
    bg: "bg-[var(--color-tier-delegatable-bg)]",
  },
};

export function Callout({ variant = "tip", children }: { variant?: Variant; children: ReactNode }) {
  const m = variantMeta[variant];
  return (
    <aside className={`my-6 border-l-4 ${m.border} ${m.bg} rounded-r-md px-4 py-3`}>
      <p className="mb-1 text-xs font-semibold tracking-wider text-fg-muted uppercase">{m.label}</p>
      <div className="prose-cn text-[0.95em] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}
