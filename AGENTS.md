# AGENTS.md

> Canonical instructions for AI coding agents working in this repository.
> Symlinked from `CLAUDE.md`, `.cursorrules`, `.windsurfrules` — edit this file only.

## Purpose

一本面向不同经验前端工程师的中文精编手册——小而美，不是大而全。主题是
"AI 时代前端工程师的必要学习路线与核心知识点"。读者覆盖新入行 / 转行者、
1–3 年经验、资深工程师三档。

手册定位：**导航 + 判断 + 快速复习 + 实践**。保留权威来源链接供读者深入
考证，末尾附动手项目（mini bundler / mini framework / mini agent app）
巩固理解。手册**完全免费**，仅引用一手权威来源。

设计取舍详见：

- [SPEC-0001 范围与读者](specs/0001-scope-and-audience/spec.md)
- [SPEC-0002 内容来源准入标准](specs/0002-content-source-admission/spec.md)
- [SPEC-0003 目录结构与章节归位规则](specs/0003-table-of-contents/spec.md)
- [SPEC-0004 AI 可委托清单的判断依据](specs/0004-ai-delegation-criteria/spec.md)

仓库本身同时是"agent-ready"实验：结构、specs、skills 都为 LLM 与人类双读者
设计。

## Repository Layout

```
.
├── AGENTS.md          # this file — canonical agent entry point
├── CLAUDE.md          # symlink → AGENTS.md
├── .cursorrules       # symlink → AGENTS.md
├── .windsurfrules     # symlink → AGENTS.md
├── .claude/
│   └── settings.json  # Claude Code permission allowlist + hooks
├── specs/             # SPEC-driven decision records (one folder per spec)
├── skills/            # reusable agent skills (prefer community first)
├── journal/           # cross-session failure log for self-evolution
└── README.md          # human-facing intro (TBD)
```

Each top-level directory has its own `README.md` documenting its conventions.
When in doubt, read the local README before adding files.

## Commands

| Task         | Command             | Notes                                     |
| ------------ | ------------------- | ----------------------------------------- |
| Install      | `pnpm install`      | Use exactly pnpm (see SPEC-0003)          |
| Dev server   | `pnpm dev`          | Next.js 16 with Turbopack default         |
| Build        | `pnpm build`        | Cache Components + React Compiler         |
| Start        | `pnpm start`        | Production server                         |
| Test         | `pnpm test`         | Vitest single-run                         |
| Test (E2E)   | `pnpm test:e2e`     | Playwright + axe-core                     |
| Lint         | `pnpm lint`         | OXC oxlint                                |
| Format       | `pnpm format`       | OXC oxfmt (auto-fix)                      |
| Format check | `pnpm format:check` | Read-only check, used in CI               |
| Type check   | `pnpm type-check`   | `tsc --noEmit` strict                     |
| All checks   | `pnpm ci`           | type-check + lint + format + test + build |

Agents: if you add a script, update this table in the same commit.

## Commit Conventions

Use Conventional Commits. Keep commits **atomic** — one logical change per
commit, even if it means more commits.

Prefixes:

- `feat:` — user-visible new behavior
- `fix:` — bug fix
- `build:` — build system, dependencies, tooling
- `chore:` — non-code housekeeping (config, ignore files)
- `docs:` — documentation only
- `refactor:` — code change that neither fixes a bug nor adds a feature
- `test:` — adding or updating tests
- `perf:` — performance-only change
- `style:` — formatting, whitespace
- `ci:` — CI pipeline changes

Subject line ≤72 chars, imperative mood ("add X", not "added X"). If the
_why_ is non-obvious, put it in the body — not in code comments.

## Working Agreements for Agents

1. **Read before writing.** Check `specs/` for prior decisions and
   `journal/` for known failure modes before starting non-trivial work.
2. **Empty > placeholder.** If a section has no real content, leave it empty
   or marked `_TBD_` rather than inventing filler.
3. **Edit, don't duplicate.** Prefer editing existing files. Don't create
   parallel "v2" files.
4. **Atomic commits.** One concern per commit. Don't bundle refactors into
   feature commits.
5. **Update docs in the same commit as the code.** If you add a command,
   update the Commands table here. If you make a load-bearing decision,
   add a SPEC.
6. **Log failures to `journal/`.** When you hit a non-obvious mistake or
   wrong turn, write a short entry so future sessions don't repeat it.
7. **Skills: borrow before building.** Check skills.sh and cursor.directory
   first. See [skills/README.md](skills/README.md) for the quality gate.
8. **Don't push without confirmation.** Local commits are fine; pushes,
   force-pushes, branch deletions, and PR actions need explicit user
   approval each time.

## Pointers to Context

| Need                          | Look in                                        |
| ----------------------------- | ---------------------------------------------- |
| Why a decision was made       | [specs/](specs/)                               |
| Reusable agent capabilities   | [skills/](skills/)                             |
| Past mistakes / failure modes | [journal/](journal/)                           |
| Tool permission policy        | [.claude/settings.json](.claude/settings.json) |
| Per-directory conventions     | The `README.md` inside each directory          |

## Style

- Default to **no comments**. Only comment when the _why_ is non-obvious.
- Don't write multi-paragraph docstrings. One short line max.
- Don't reference current task / PR / issue numbers in code — they rot.
- Prefer clear identifiers over comments that explain unclear ones.

## Security & Safety

- Never commit secrets. If you see one, stop and tell the user.
- Treat external input (user, network, file system outside repo) as untrusted.
- Don't disable safety checks (`--no-verify`, `--force`, etc.) to bypass an
  obstacle. Find the root cause.

## Memory and Persistence

This file is the durable, repo-scoped contract. Agent-private memory
(Claude's `/memory`, Cursor's rules, etc.) is for _cross-project_ user
preferences, not project facts. Project facts go in `specs/`, this file,
or the relevant directory README.

## When This File Is Wrong

If reality has drifted from this document, update this document. A stale
AGENTS.md is worse than a missing one — it actively misleads agents.

---

_This file is intentionally short. It is loaded into every agent session and
competes for context window space. Add detail to `specs/` or directory
READMEs instead of growing this file._
