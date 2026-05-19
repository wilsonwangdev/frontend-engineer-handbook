#!/usr/bin/env node
/* eslint-disable no-console */
// MADR v4 校验脚本。
// 用法：
//   node scripts/validate-specs.mjs            校验全部 specs/
//   node scripts/validate-specs.mjs <files>    校验指定文件（pre-commit / lint-staged 用）
//
// 标准：specs/README.md "标准对标：MADR v4"。

import { readFile, readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import matter from "gray-matter";

const ROOT = resolve(process.cwd());
const SPECS_DIR = join(ROOT, "specs");

const MADR_STATUS = new Set(["proposed", "accepted", "rejected", "deprecated", "superseded"]);

const LEGACY_STATUS = new Set(["withdrawn"]);
const LEGACY_STATUS_PATTERN = /^superseded-by:/;

const REQUIRED_SECTIONS_FULL = [
  "Context and Problem Statement",
  "Decision Outcome",
  "Consequences",
];

const FIRST_STRICT_ID = 8;

function isIsoDate(s) {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

async function validateSpec(absPath) {
  // 仅识别绝对路径末尾的 "specs/NNNN-<slug>/spec.md" 段，与 cwd 无关，
  // 这样测试 fixture 和真实仓库内文件都能正确校验。
  const normalized = absPath.replace(/\\/g, "/");
  const m = normalized.match(/(?:^|\/)specs\/(\d{4})-([a-z0-9][a-z0-9-]*)\/spec\.md$/);
  const errors = [];
  const display = normalized.includes("/specs/")
    ? "specs/" + normalized.split("/specs/").pop()
    : normalized;

  if (!m) {
    errors.push(`path: 必须是 specs/NNNN-<kebab-slug>/spec.md，当前 ${display}`);
    return { ok: false, errors, display };
  }
  const idFromPath = m[1];

  const raw = await readFile(absPath, "utf-8");
  const parsed = matter(raw);
  const fm = parsed.data;

  if (
    !(
      (typeof fm.id === "string" && /^\d{4}$/.test(fm.id)) ||
      (typeof fm.id === "number" && Number.isInteger(fm.id) && fm.id >= 0 && fm.id <= 9999)
    )
  ) {
    errors.push("frontmatter.id: 必须是 4 位数字（YAML 标量，例如 0001 或 1）");
  } else {
    const normalizedId = typeof fm.id === "number" ? String(fm.id).padStart(4, "0") : fm.id;
    if (normalizedId !== idFromPath) {
      errors.push(
        `frontmatter.id 与目录编号不一致：frontmatter=${normalizedId}, dir=${idFromPath}`,
      );
    }
  }

  if (typeof fm.title !== "string" || fm.title.trim().length === 0) {
    errors.push("frontmatter.title: 必须是非空字符串");
  }

  const statusVal = String(fm.status ?? "");
  if (LEGACY_STATUS.has(statusVal) || LEGACY_STATUS_PATTERN.test(statusVal)) {
    errors.push(
      `frontmatter.status: "${statusVal}" 是已废弃取值；MADR v4 允许 ${[...MADR_STATUS].join(" / ")}`,
    );
  } else if (!MADR_STATUS.has(statusVal)) {
    errors.push(
      `frontmatter.status: "${statusVal}" 不在 MADR v4 标准内（${[...MADR_STATUS].join(" / ")}）`,
    );
  }

  const dateVal = fm.date;
  const dateStr = dateVal instanceof Date ? dateVal.toISOString().slice(0, 10) : dateVal;
  if (!isIsoDate(dateStr)) {
    errors.push("frontmatter.date: 必须是 YYYY-MM-DD 格式");
  }

  const numericId = Number.parseInt(idFromPath ?? "0", 10);
  if (numericId >= FIRST_STRICT_ID) {
    for (const heading of REQUIRED_SECTIONS_FULL) {
      const re = new RegExp(`^##\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "m");
      if (!re.test(parsed.content)) {
        errors.push(`missing required section: "## ${heading}"`);
      }
    }
  }

  return { ok: errors.length === 0, errors, display };
}

async function findAllSpecs() {
  const entries = await readdir(SPECS_DIR, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (!/^\d{4}-/.test(e.name)) continue;
    files.push(join(SPECS_DIR, e.name, "spec.md"));
  }
  return files;
}

async function main() {
  let files;
  const args = process.argv.slice(2);
  if (args.length > 0) {
    files = args.map((p) => resolve(p)).filter((p) => p.endsWith("spec.md"));
  } else {
    files = await findAllSpecs();
  }

  if (files.length === 0) {
    console.log("validate-specs: 没有 spec 文件待校验");
    return;
  }

  const results = await Promise.all(
    files.map(async (file) => ({ file, ...(await validateSpec(file)) })),
  );

  let failed = 0;
  for (const r of results) {
    const rel = r.display ?? relative(ROOT, r.file);
    if (r.ok) {
      console.log(`  ok  ${rel}`);
    } else {
      failed++;
      console.log(`FAIL  ${rel}`);
      for (const err of r.errors) {
        console.log(`      → ${err}`);
      }
    }
  }

  if (failed > 0) {
    console.log(`\n${failed}/${files.length} spec 未通过 MADR v4 校验（详见 specs/README.md）`);
    process.exit(1);
  }
  console.log(`\nall ${files.length} specs pass MADR v4 validation`);
}

await main();
