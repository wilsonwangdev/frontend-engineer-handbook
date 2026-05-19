#!/usr/bin/env node
/* eslint-disable no-console */
// Smoke test: pure-curl check that pages render with expected markers.
// Use when Playwright E2E is blocked by local environment (e.g. TUN proxy).
// Requires `pnpm start` running on PORT=4173.

import { request } from "node:http";

const PORT = process.env.PORT ?? "4173";
const HOST = "127.0.0.1";

const checks = [
  {
    path: "/",
    expect: ["前端工程师手册", "系统学习", "按需查阅", "实践驱动"],
  },
  {
    path: "/chapter-00",
    expect: ["如何使用本手册", "你是谁", "三种使用方式", "必学"],
  },
  {
    path: "/chapter-01",
    expect: ["AI 时代前端工程师的能力地图", "Tier 1：完全委托", "永不委托"],
  },
];

/** @param {string} path */
function fetch(path) {
  return new Promise((resolve, reject) => {
    const req = request(
      { host: HOST, port: PORT, path, method: "GET" },
      (res) => {
        let body = "";
        res.setEncoding("utf-8");
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve({ status: res.statusCode ?? 0, body }));
      },
    );
    req.on("error", reject);
    req.setTimeout(5000, () => {
      req.destroy(new Error("timeout"));
    });
    req.end();
  });
}

const results = await Promise.all(
  checks.map(async (check) => {
    try {
      const res = await fetch(check.path);
      const missing = check.expect.filter((s) => !res.body.includes(s));
      const ok = res.status === 200 && missing.length === 0;
      return { path: check.path, status: res.status, ok, missing };
    } catch (err) {
      return {
        path: check.path,
        status: 0,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }),
);

let failed = 0;
for (const r of results) {
  if (r.ok) {
    console.log(`  ok  ${r.path}  [${r.status}]`);
  } else {
    failed++;
    console.log(
      `FAIL  ${r.path}  [${r.status}]  ${
        r.error ? `error: ${r.error}` : `missing: ${(r.missing ?? []).join(", ")}`
      }`,
    );
  }
}

if (failed > 0) {
  console.log(`\n${failed}/${results.length} smoke checks failed`);
  process.exit(1);
}
console.log(`\nall ${results.length} smoke checks passed`);
