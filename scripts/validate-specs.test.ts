import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SCRIPT = join(process.cwd(), "scripts/validate-specs.mjs");

function runValidator(fixtureDir: string, target: string): { code: number; stdout: string } {
  try {
    const stdout = execFileSync("node", [SCRIPT, target], {
      cwd: fixtureDir,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, stdout };
  } catch (err) {
    const e = err as { status?: number; stdout?: string };
    return { code: e.status ?? 1, stdout: e.stdout ?? "" };
  }
}

function makeFixture(id: string, frontmatter: string, body: string): string {
  const dir = mkdtempSync(join(tmpdir(), "spec-validate-"));
  const specDir = join(dir, "specs", `${id}-test-fixture`);
  mkdirSync(specDir, { recursive: true });
  writeFileSync(join(specDir, "spec.md"), `---\n${frontmatter}\n---\n\n${body}\n`);
  return dir;
}

describe("validate-specs (MADR v4)", () => {
  it("accepts a well-formed MADR spec (numeric YAML id)", () => {
    const dir = makeFixture(
      "0099",
      "id: 0099\ntitle: 测试\nstatus: accepted\ndate: 2026-05-20",
      "## Context and Problem Statement\n\n…\n\n## Decision Outcome\n\n…\n\n## Consequences\n\n…",
    );
    try {
      const { code } = runValidator(dir, join(dir, "specs", "0099-test-fixture", "spec.md"));
      expect(code).toBe(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('rejects legacy "withdrawn" status', () => {
    const dir = makeFixture(
      "0099",
      "id: 0099\ntitle: 测试\nstatus: withdrawn\ndate: 2026-05-20",
      "## Context and Problem Statement\n\n…\n\n## Decision Outcome\n\n…\n\n## Consequences\n\n…",
    );
    try {
      const { code, stdout } = runValidator(
        dir,
        join(dir, "specs", "0099-test-fixture", "spec.md"),
      );
      expect(code).toBe(1);
      expect(stdout).toMatch(/withdrawn.*已废弃/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('rejects legacy "superseded-by: NNNN" status', () => {
    const dir = makeFixture(
      "0099",
      'id: 0099\ntitle: 测试\nstatus: "superseded-by: 0100"\ndate: 2026-05-20',
      "## Context and Problem Statement\n\n…\n\n## Decision Outcome\n\n…\n\n## Consequences\n\n…",
    );
    try {
      const { code, stdout } = runValidator(
        dir,
        join(dir, "specs", "0099-test-fixture", "spec.md"),
      );
      expect(code).toBe(1);
      expect(stdout).toMatch(/已废弃/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects id mismatch between frontmatter and directory", () => {
    const dir = makeFixture(
      "0099",
      "id: 0042\ntitle: 测试\nstatus: accepted\ndate: 2026-05-20",
      "## Context and Problem Statement\n\n…\n\n## Decision Outcome\n\n…\n\n## Consequences\n\n…",
    );
    try {
      const { code, stdout } = runValidator(
        dir,
        join(dir, "specs", "0099-test-fixture", "spec.md"),
      );
      expect(code).toBe(1);
      expect(stdout).toMatch(/不一致/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("requires MADR sections for new specs (id >= 0008)", () => {
    const dir = makeFixture(
      "0099",
      "id: 0099\ntitle: 测试\nstatus: accepted\ndate: 2026-05-20",
      "## Decision Outcome\n\n仅此而已",
    );
    try {
      const { code, stdout } = runValidator(
        dir,
        join(dir, "specs", "0099-test-fixture", "spec.md"),
      );
      expect(code).toBe(1);
      expect(stdout).toMatch(/Context and Problem Statement/);
      expect(stdout).toMatch(/Consequences/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
