import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Sidebar } from "@/components/handbook/sidebar";
import { MobileNav } from "@/components/handbook/mobile-nav";
import { PublicNav } from "@/components/handbook/public-nav";
import { ReadingWidthToggle } from "@/components/handbook/reading-width-toggle";
import { ThemeToggle } from "@/components/handbook/theme-toggle";
import { SearchTrigger } from "@/components/handbook/search";
import { BackToTop } from "@/components/handbook/back-to-top";
import { getChapterTree } from "@/lib/content";

export default async function HandbookLayout({ children }: { children: React.ReactNode }) {
  const tree = await getChapterTree();

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--color-bg)] focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:outline-2 focus:outline-[var(--color-accent)]"
      >
        跳到主内容
      </a>
      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur">
        <div className="handbook-container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <MobileNav tree={tree} />
            <Link
              href="/"
              className="font-semibold tracking-tight transition-opacity hover:opacity-75"
            >
              前端工程师手册
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <PublicNav className="hidden md:flex items-center gap-1" />
            <ReadingWidthToggle />
            <ThemeToggle />
            <SearchTrigger />
            <a
              href="https://github.com/wilsonwangdev/frontend-engineer-handbook"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-fg-muted transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]"
            >
              <span>GitHub</span>
              <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <div className="handbook-container handbook-shell mx-auto grid grid-cols-1 gap-8 px-4 py-6 sm:px-6 sm:py-10 md:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="handbook-aside hidden md:block">
          <div className="sticky top-20">
            <Sidebar tree={tree} />
          </div>
        </aside>
        <main id="main" tabIndex={-1} className="min-w-0 focus:outline-none">
          {children}
        </main>
      </div>
      <BackToTop />
    </div>
  );
}
