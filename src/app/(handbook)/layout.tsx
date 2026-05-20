import Link from "next/link";
import { Sidebar } from "@/components/handbook/sidebar";
import { MobileNav } from "@/components/handbook/mobile-nav";
import { getChapterTree } from "@/lib/content";

export default async function HandbookLayout({ children }: { children: React.ReactNode }) {
  const tree = await getChapterTree();

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="font-semibold tracking-tight transition-opacity hover:opacity-75"
          >
            前端工程师手册
          </Link>
          <nav className="text-sm text-fg-muted">
            <a
              href="https://github.com/wilsonwangdev/frontend-engineer-handbook"
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-[var(--color-fg)]"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <MobileNav tree={tree} />
        <div className="mt-4 grid grid-cols-[16rem_minmax(0,1fr)] gap-8 max-md:mt-0 max-md:grid-cols-1">
          <aside className="max-md:hidden">
            <div className="sticky top-20">
              <Sidebar tree={tree} />
            </div>
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
