import { readdir, readFile, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join, relative, resolve } from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { type Frontmatter, frontmatterSchema } from "./content-schema";

const CONTENT_DIR = resolve(process.cwd(), "content");
const REPO_ROOT = process.cwd();
const execFileAsync = promisify(execFile);

export interface ContentDoc {
  slug: string[];
  url: string;
  filePath: string;
  source: string;
  frontmatter: Frontmatter;
  readingMinutes: number;
  /** 文件最后一次 git commit 的 ISO 日期字符串（YYYY-MM-DD）。无 git 历史时为 null。 */
  lastModified: string | null;
}

export interface ChapterMeta {
  chapter: number;
  url: string;
  title: string;
  description: string;
  sections?: SectionMeta[];
}

export interface SectionMeta {
  url: string;
  title: string;
  description: string;
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function getGitLastModified(filePath: string): Promise<string | null> {
  try {
    const rel = relative(REPO_ROOT, filePath);
    const { stdout } = await execFileAsync("git", ["log", "-1", "--format=%cI", "--", rel], {
      cwd: REPO_ROOT,
    });
    const iso = stdout.trim();
    if (!iso) return null;
    return iso.slice(0, 10);
  } catch {
    return null;
  }
}

async function readDoc(filePath: string, slug: string[]): Promise<ContentDoc> {
  const raw = await readFile(filePath, "utf-8");
  const parsed = matter(raw);
  const frontmatter = frontmatterSchema.parse(parsed.data);
  const stats = readingTime(parsed.content, { wordsPerMinute: 350 });
  const lastModified = await getGitLastModified(filePath);

  return {
    slug,
    url: "/" + slug.join("/"),
    filePath,
    source: parsed.content,
    frontmatter,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    lastModified,
  };
}

export async function getAllDocs(): Promise<ContentDoc[]> {
  "use cache";
  if (!(await pathExists(CONTENT_DIR))) {
    return [];
  }
  const entries = await readdir(CONTENT_DIR, { withFileTypes: true });

  const chapterReads = entries
    .filter((e) => e.isDirectory())
    .map(async (entry) => {
      const chapterDir = join(CONTENT_DIR, entry.name);
      const indexPath = join(chapterDir, "index.mdx");
      const sectionsDir = join(chapterDir, "sections");

      const [indexExists, sectionsExists] = await Promise.all([
        pathExists(indexPath),
        pathExists(sectionsDir),
      ]);

      const docs: ContentDoc[] = [];
      if (indexExists) {
        docs.push(await readDoc(indexPath, [entry.name]));
      }
      if (sectionsExists) {
        const sectionFiles = await readdir(sectionsDir);
        const sectionDocs = await Promise.all(
          sectionFiles
            .filter((f) => f.endsWith(".mdx"))
            .map((file) => {
              const slug = file.replace(/\.mdx$/, "");
              return readDoc(join(sectionsDir, file), [entry.name, slug]);
            }),
        );
        docs.push(...sectionDocs);
      }
      return docs;
    });

  const grouped = await Promise.all(chapterReads);
  const docs = grouped.flat();

  return docs.toSorted((a, b) => {
    const seqA = a.frontmatter.paths?.sequential ?? 999;
    const seqB = b.frontmatter.paths?.sequential ?? 999;
    if (seqA !== seqB) return seqA - seqB;
    return a.url.localeCompare(b.url);
  });
}

export async function getDocBySlug(slug: string[]): Promise<ContentDoc | null> {
  "use cache";
  const all = await getAllDocs();
  return all.find((d) => d.slug.join("/") === slug.join("/")) ?? null;
}

export async function getChapterTree(): Promise<ChapterMeta[]> {
  "use cache";
  const docs = await getAllDocs();
  const byChapter = new Map<number, ChapterMeta>();

  for (const doc of docs) {
    const { chapter, title, description } = doc.frontmatter;
    const isIndex = doc.slug.length === 1;

    if (isIndex) {
      byChapter.set(chapter, {
        chapter,
        url: doc.url,
        title,
        description,
        sections: [],
      });
    } else {
      const existing = byChapter.get(chapter);
      if (existing) {
        existing.sections?.push({ url: doc.url, title, description });
      }
    }
  }

  return Array.from(byChapter.values()).toSorted((a, b) => a.chapter - b.chapter);
}

export async function getAdjacentDocs(
  current: ContentDoc,
): Promise<{ prev: ContentDoc | null; next: ContentDoc | null }> {
  "use cache";
  const all = await getAllDocs();
  const idx = all.findIndex((d) => d.url === current.url);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? (all[idx - 1] ?? null) : null,
    next: idx < all.length - 1 ? (all[idx + 1] ?? null) : null,
  };
}
