/**
 * 校验所有内容文件的 sequential 编号唯一且连续。
 *
 * 在 `pnpm build` 前运行，冲突时报错退出，防止类似
 * 第 4 章和第 5 章 sequential 重叠的问题。
 */

import { readdir, readFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const REPO_ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const CONTENT_DIR = resolve(REPO_ROOT, "content");

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
      const seq = matter(raw).data.paths?.sequential;
      if (seq != null) entries.push({ file: `${dir.name}/index.mdx`, seq });
    } catch {
      /* skip */
    }

    const sectionsDir = join(chapterDir, "sections");
    try {
      const files = (await readdir(sectionsDir)).filter((f) => f.endsWith(".mdx"));
      for (const file of files) {
        const raw = await readFile(join(sectionsDir, file), "utf-8");
        const seq = matter(raw).data.paths?.sequential;
        if (seq != null) entries.push({ file: `${dir.name}/sections/${file}`, seq });
      }
    } catch {
      /* skip */
    }
  }

  return entries;
}

async function main() {
  const entries = await collectFiles();
  const seen = new Map();

  let hasError = false;

  for (const { file, seq } of entries) {
    if (seen.has(seq)) {
      console.error(
        `[sequential] DUPLICATE: ${file} and ${seen.get(seq)} both use sequential: ${seq}`,
      );
      hasError = true;
    }
    seen.set(seq, file);
  }

  // Check for gaps (optional warning)
  const nums = [...seen.keys()].toSorted((a, b) => a - b);
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1] + 1) {
      console.warn(
        `[sequential] GAP: between ${seen.get(nums[i - 1])} (${nums[i - 1]}) and ${seen.get(nums[i])} (${nums[i]})`,
      );
    }
  }

  if (hasError) process.exit(1);
  console.log(`[sequential] OK — ${entries.length} entries, no duplicates`);

  // Also check chapter-plan.ts is consistent with content/
  console.log("[sequential] checking chapter-plan consistency...");
  const contentChapters = new Set(
    entries.map((e) => e.file.split("/")[0]).filter((d) => d && d.startsWith("chapter-")),
  );
  // Parse chapter-plan.ts to find chapters marked unpublished
  const planPath = resolve(REPO_ROOT, "src/lib/chapter-plan.ts");
  const planSrc = await readFile(planPath, "utf-8");
  const publishedPattern = /\{[^}]*id:\s*"(\d+)"[^}]*published:\s*false[^}]*\}/g;
  let match;
  while ((match = publishedPattern.exec(planSrc)) !== null) {
    const dirName = `chapter-${String(match[1]).padStart(2, "0")}`;
    if (contentChapters.has(dirName)) {
      console.warn(
        `[sequential] STALE: ${dirName} has content but chapter-plan says published=false — update src/lib/chapter-plan.ts`,
      );
    }
  }
}

main().catch((err) => {
  console.error("[sequential] failed:", err);
  process.exit(1);
});
