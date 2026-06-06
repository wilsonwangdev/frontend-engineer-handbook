"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  label: string;
  href: string;
  /** 路由尚未上线时禁用，显示为灰色不可点击 */
  disabled?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "术语", href: "/glossary" },
  { label: "示例", href: "/playground" },
  { label: "资源", href: "/resources" },
];

export function PublicNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="公共页面" className={className}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");

        if (item.disabled) {
          return (
            <span
              key={item.href}
              className="inline-flex items-center rounded-md px-2.5 py-1.5 text-sm text-fg-muted/50 cursor-not-allowed select-none"
              aria-disabled="true"
            >
              {item.label}
            </span>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={
              "inline-flex items-center rounded-md px-2.5 py-1.5 text-sm transition-colors " +
              (active
                ? "bg-[var(--color-bg-elevated)] font-medium text-[var(--color-accent)]"
                : "text-fg-muted hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]")
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
