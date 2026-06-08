import { getAllDocs, type SectionMeta } from "./content";
import { type ReadingPathId, getPathMeta } from "./reading-path-meta";

export type { ReadingPathId };
export { getPathMeta };

export interface ReadingPath {
  id: ReadingPathId;
  tag: string;
  label: string;
  desc: string;
  sections: SectionMeta[];
}

export async function getReadingPaths(): Promise<Record<ReadingPathId, ReadingPath>> {
  const docs = await getAllDocs();
  const sections: SectionMeta[] = docs
    .filter((d) => d.frontmatter.section && d.frontmatter.section > 0)
    .map((d) => ({
      url: d.url,
      title: d.frontmatter.title,
      description: d.frontmatter.description,
      tier: d.frontmatter.tier,
    }))
    .toSorted((a, b) => a.url.localeCompare(b.url));

  function buildPath(id: ReadingPathId): ReadingPath {
    const meta = getPathMeta(id);
    return {
      id,
      tag: meta.tag,
      label: meta.label,
      desc: meta.desc,
      sections: sections.filter((s) => {
        const doc = docs.find((d) => d.url === s.url);
        return doc?.frontmatter.paths?.reading?.includes(id) ?? false;
      }),
    };
  }

  return {
    beginner: buildPath("beginner"),
    intermediate: buildPath("intermediate"),
    senior: buildPath("senior"),
  };
}

/**
 * Given a section URL and a path, return the previous and next section
 * in that path's sequence. Returns null if the section isn't in the path.
 */
export function getPathAdjacent(
  sections: SectionMeta[],
  currentUrl: string,
): { prev: SectionMeta | null; next: SectionMeta | null; index: number; total: number } {
  const idx = sections.findIndex((s) => s.url === currentUrl);
  if (idx === -1) return { prev: null, next: null, index: -1, total: sections.length };
  return {
    prev: idx > 0 ? (sections[idx - 1] ?? null) : null,
    next: idx < sections.length - 1 ? (sections[idx + 1] ?? null) : null,
    index: idx + 1,
    total: sections.length,
  };
}
