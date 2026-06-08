import Link from "next/link";
import { getChapterTree } from "@/lib/content";

interface BreadcrumbsProps {
  chapterNumber: number;
  sectionTitle?: string;
  /** 非章节页面（glossary / resources 等）的单行标题 */
  standaloneTitle?: string;
}

export async function Breadcrumbs({
  chapterNumber,
  sectionTitle,
  standaloneTitle,
}: BreadcrumbsProps) {
  if (standaloneTitle) {
    return (
      <nav aria-label="面包屑" className="not-prose mb-6">
        <ol className="flex list-none items-center gap-2 pl-0 text-xs text-fg-muted">
          <li>
            <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">
              首页
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--color-fg)]">{standaloneTitle}</li>
        </ol>
      </nav>
    );
  }

  const tree = await getChapterTree();
  const chapter = tree.find((c) => c.chapter === chapterNumber);

  return (
    <nav aria-label="面包屑" className="not-prose mb-6 border-b border-[var(--color-border)] pb-3">
      <ol className="flex list-none flex-wrap items-center gap-x-2 gap-y-0.5 pl-0 text-xs text-fg-muted">
        <li>
          <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">
            首页
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        {chapter ? (
          <>
            <li>
              <Link
                href={chapter.url}
                className="hover:text-[var(--color-accent)] transition-colors"
              >
                第 {chapterNumber} 章 {chapter.title}
              </Link>
            </li>
            {sectionTitle && (
              <>
                <li aria-hidden="true">/</li>
                <li className="text-[var(--color-fg)]">{sectionTitle}</li>
              </>
            )}
          </>
        ) : (
          <li className="text-[var(--color-fg)]">第 {chapterNumber} 章</li>
        )}
      </ol>
    </nav>
  );
}
