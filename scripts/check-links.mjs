#!/usr/bin/env node
// 本地跑 lychee 死链检查。CI 用 lycheeverse/lychee-action（见 .github/workflows/links.yml）。
//
// 装 lychee：
//   macOS:  brew install lychee
//   其他:   https://lychee.cli.rs/installation/
//
// 用法：
//   pnpm links            # 默认扫所有 .md / .mdx
//   pnpm links --offline  # 只校验仓库内相对链接
import { spawnSync } from "node:child_process";

const which = spawnSync("which", ["lychee"], { encoding: "utf-8" });
if (which.status !== 0) {
  console.error(
    "✗ 未找到 lychee。安装：\n" +
      "    macOS:  brew install lychee\n" +
      "    其他:   https://lychee.cli.rs/installation/",
  );
  process.exit(127);
}

const args = ["--config", "lychee.toml", ...process.argv.slice(2), "./**/*.md", "./**/*.mdx"];

const result = spawnSync("lychee", args, { stdio: "inherit" });
process.exit(result.status ?? 1);
