/**
 * 校验所有内容文件的 frontmatter 是否符合 zod schema。
 *
 * 独立于 build，CI 中提前运行——frontmatter 错误在 build 前被拦截。
 */

import { readdir, readFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { z } from "zod";

const REPO_ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const CONTENT_DIR = resolve(REPO_ROOT, "content");

const tierSchema = z.enum(["essential", "understand", "delegatable"]);
const frontmatterSchema = z.object({
  title: z.string().min(1),
  chapter: z.number().int().min(0).max(10),
  section: z.number().int().min(0).optional(),
  description: z.string().min(1),
  tier: tierSchema,
  readingTime: z.number().int().positive().optional(),
  prerequisites: z.array(z.string()).optional(),
  paths: z
    .object({
      sequential: z.number().int().positive().optional(),
      practice: z
        .array(
          z.object({
            project: z.enum(["mini-bundler", "mini-framework", "mini-agent-app"]),
            context: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),
});

async function collectFiles() {
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
      entries.push({ file: `${dir.name}/index.mdx`, data });
    } catch {
      /* skip */
    }

    const sectionsDir = join(chapterDir, "sections");
    try {
      const files = (await readdir(sectionsDir)).filter((f) => f.endsWith(".mdx"));
      for (const file of files) {
        const raw = await readFile(join(sectionsDir, file), "utf-8");
        const { data } = matter(raw);
        entries.push({ file: `${dir.name}/sections/${file}`, data });
      }
    } catch {
      /* skip */
    }
  }

  return entries;
}

async function main() {
  const entries = await collectFiles();
  let hasError = false;

  for (const { file, data } of entries) {
    const result = frontmatterSchema.safeParse(data);
    if (!result.success) {
      console.error(`[frontmatter] ${file}:`);
      for (const issue of result.error.issues) {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      }
      hasError = true;
    }
  }

  if (hasError) process.exit(1);
  console.log(`[frontmatter] OK — ${entries.length} files validated`);
}

main().catch((err) => {
  console.error("[frontmatter] failed:", err);
  process.exit(1);
});
