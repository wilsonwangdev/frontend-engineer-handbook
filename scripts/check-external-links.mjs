/**
 * 内容外链验证脚本。
 *
 * 扫描指定 content/ 文件的全部外部链接，用 AnySearch 并行验证。
 * 写新章节或修改外链后运行——确保没有 404 或虚构 URL。
 *
 * 用法：
 *   node scripts/check-external-links.mjs content/chapter-05/sections/state-management.mdx
 *   node scripts/check-external-links.mjs content/chapter-05/
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const ANYSEARCH_CLI = resolve(
  REPO_ROOT,
  "../../.claude/skills/anysearch/scripts/anysearch_cli.py",
);

function extractUrls(text) {
  const urls = new Set();
  const regex = /https?:\/\/[^\s<>"'\])}]+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const url = match[0].replace(/[.,;:!?]*$/, "");
    urls.add(url);
  }
  return [...urls];
}

async function checkUrl(url) {
  try {
    const proc = Bun.spawn(["python3", ANYSEARCH_CLI, "search", `site:${new URL(url).hostname} ${new URL(url).pathname.split("/").pop()}`], {
      stdout: "pipe",
    });
    const output = await new Response(proc.stdout).text();
    // If the search returns results containing our URL, it's likely valid
    const found = output.includes(url) || output.includes(new URL(url).pathname.replace(/\/$/, ""));
    return { url, ok: found, detail: found ? "found" : "not found in search results" };
  } catch {
    return { url, ok: false, detail: "connection error" };
  }
}

async function collectFiles(target) {
  const targetPath = resolve(REPO_ROOT, target);
  const s = await stat(targetPath);
  if (s.isFile()) return [targetPath];
  if (s.isDirectory()) {
    const files = [];
    const entries = await readdir(targetPath, { recursive: true });
    for (const entry of entries) {
      if (extname(entry) === ".mdx") files.push(resolve(targetPath, entry));
    }
    return files;
  }
  return [];
}

async function main() {
  const target = process.argv[2];
  if (!target) {
    console.error("Usage: node scripts/check-external-links.mjs <file-or-dir>");
    process.exit(1);
  }

  const files = await collectFiles(target);
  if (files.length === 0) {
    console.log("No .mdx files found");
    return;
  }

  const allUrls = new Map();
  for (const file of files) {
    const text = await readFile(file, "utf-8");
    const urls = extractUrls(text);
    for (const url of urls) allUrls.set(url, file);
  }

  console.log(`Checking ${allUrls.size} unique URLs...`);
  const results = [];
  for (const [url, file] of allUrls) {
    const r = await checkUrl(url);
    results.push({ ...r, file });
    if (!r.ok) console.log(`  ❌ ${url} (${file})`);
    else console.log(`  ✅ ${url}`);
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.log(`\n${failed.length} URLs may be broken. Verify manually:`);
    for (const r of failed) console.log(`  ${r.url}`);
    process.exit(1);
  }
  console.log("\nAll links verified.");
}

main().catch((err) => {
  console.error("check-external-links failed:", err);
  process.exit(1);
});
