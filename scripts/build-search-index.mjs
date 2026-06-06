import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { load as parseYaml } from "js-yaml";

const REPO_ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const CONTENT_DIR = resolve(REPO_ROOT, "content");
const PUBLIC_DIR = resolve(REPO_ROOT, "public");
const OUT_FILE = resolve(PUBLIC_DIR, "search-index.json");

function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_~>|]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\{[\s\S]*?\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function excerpt(text, maxLen = 300) {
  const cleaned = stripMarkdown(text);
  if (cleaned.length <= maxLen) return cleaned;
  const cut = cleaned.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return lastSpace > maxLen * 0.7 ? cut.slice(0, lastSpace) : cut;
}

async function collectMdxFiles() {
  const entries = [];
  const chapterDirs = (await readdir(CONTENT_DIR, { withFileTypes: true })).filter(
    (e) => e.isDirectory() && e.name.startsWith("chapter-"),
  );

  for (const dir of chapterDirs) {
    const chapterDir = join(CONTENT_DIR, dir.name);

    const indexPath = join(chapterDir, "index.mdx");
    try {
      const raw = await readFile(indexPath, "utf-8");
      const { data } = matter(raw);
      entries.push({
        title: data.title || "",
        description: data.description || "",
        url: `/${dir.name}`,
        type: "chapter",
        text: data.description || "",
      });
    } catch {
      /* skip */
    }

    const sectionsDir = join(chapterDir, "sections");
    try {
      const sectionFiles = (await readdir(sectionsDir)).filter((f) => f.endsWith(".mdx"));
      for (const file of sectionFiles) {
        const raw = await readFile(join(sectionsDir, file), "utf-8");
        const { data, content } = matter(raw);
        const slug = file.replace(/\.mdx$/, "");
        entries.push({
          title: data.title || "",
          description: data.description || "",
          url: `/${dir.name}/${slug}`,
          type: "section",
          text: [data.description, excerpt(content)].filter(Boolean).join(" "),
        });
      }
    } catch {
      /* skip */
    }
  }

  return entries;
}

async function collectGlossaryTerms() {
  const termsPath = resolve(CONTENT_DIR, "glossary/terms.yaml");
  let raw;
  try {
    raw = await readFile(termsPath, "utf-8");
  } catch {
    return [];
  }
  const parsed = parseYaml(raw);
  if (!parsed || typeof parsed !== "object") return [];

  return Object.entries(parsed).map(([key, value]) => ({
    title: key,
    description: value.zh || "",
    url: `/glossary#${key}`,
    type: "term",
    text: [value.zh, value.brief, stripMarkdown(value.long || "").slice(0, 200)]
      .filter(Boolean)
      .join(" "),
  }));
}

async function main() {
  const [mdxEntries, glossaryEntries] = await Promise.all([
    collectMdxFiles(),
    collectGlossaryTerms(),
  ]);

  const playgroundEntries = [
    {
      title: "Animations",
      description: "transition / animation / View Transitions",
      url: "/playground/animations",
      type: "playground",
      text: "animation transition View Transitions button hover card entrance theme toggle circular reveal",
    },
    {
      title: "Layout",
      description: "Classic CSS layout patterns",
      url: "/playground/layout",
      type: "playground",
      text: "layout CSS avatar stack notification badge skeleton shimmer",
    },
  ];

  const index = [...mdxEntries, ...glossaryEntries, ...playgroundEntries];

  await mkdir(PUBLIC_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(index), "utf-8");

  const counts = { chapter: 0, section: 0, term: 0, playground: 0 };
  for (const e of index) counts[e.type] = (counts[e.type] || 0) + 1;
  console.log(
    `[search-index] ${index.length} entries (${counts.chapter} chapters, ${counts.section} sections, ${counts.term} terms, ${counts.playground} playground)`,
  );
}

main().catch((err) => {
  console.error("[search-index] failed:", err);
  process.exit(1);
});
