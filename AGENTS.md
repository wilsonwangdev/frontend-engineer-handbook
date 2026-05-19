# AGENTS.md

> Canonical instructions for AI coding agents in this repository.
> Symlinked from `CLAUDE.md`, `.cursorrules`, `.windsurfrules` — edit this file only.

## Purpose

中文精编手册——面向 2026 年、围绕 agent 协作的前端工程师。**小而美，不是
大而全**。读者：新入行 / 1–3 年 / 资深，三档。定位：导航 + 判断 + 速查 + 实践。
完全免费，仅引一手来源。

## Entry points

| Need                              | File                                                                               |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| What to work on next              | [ROADMAP.md](ROADMAP.md)                                                           |
| Why a decision was made           | [specs/](specs/) (numbered, see index below)                                       |
| Reusable agent workflows          | [skills/](skills/)                                                                 |
| Past mistakes & how to avoid them | [journal/](journal/) (per-incident), [docs/GOTCHAS.md](docs/GOTCHAS.md) (top hits) |
| Permissions & hooks               | [.claude/settings.json](.claude/settings.json)                                     |
| Public deploy                     | [docs/DEPLOY.md](docs/DEPLOY.md)                                                   |

### SPECs (load-bearing decisions)

- [0001](specs/0001-scope-and-audience/spec.md) Scope & audience
- [0002](specs/0002-content-source-admission/spec.md) Content source admission
- [0003](specs/0003-table-of-contents/spec.md) Table of contents & tier rules
- [0004](specs/0004-ai-delegation-criteria/spec.md) AI delegation criteria
- [0005](specs/0005-companion-tracks-and-test-strategy/spec.md) Appendix D + test strategy
- [0006](specs/0006-agent-skills-system/spec.md) Agent harness skills system

## Repository layout

```
AGENTS.md  ROADMAP.md  README.md
content/   src/        e2e/        scripts/   public/
specs/     skills/     journal/    docs/
.claude/   .mcp.json   .github/
```

Each top-level directory carries a `README.md` documenting its conventions.
Read the local README before adding files there.

## Commands

| Task         | Command               | Notes                                                   |
| ------------ | --------------------- | ------------------------------------------------------- |
| Install      | `pnpm install`        |                                                         |
| Dev          | `pnpm dev`            | Next.js 16 + Turbopack, port 3000                       |
| Build        | `pnpm build`          | Cache Components + React Compiler                       |
| Start        | `pnpm start`          | Production; `PORT=4173` for E2E                         |
| Test (unit)  | `pnpm test`           | Vitest                                                  |
| Test (E2E)   | `pnpm test:e2e`       | Playwright + axe-core. CI uses this.                    |
| Test (local) | `pnpm test:e2e:local` | Skip webServer; for users with TUN-mode proxy. See G.3. |
| Smoke        | `pnpm smoke`          | Pure node:http page check; bypasses any proxy.          |
| Lint         | `pnpm lint`           | oxlint                                                  |
| Format       | `pnpm format`         | oxfmt                                                   |
| Type check   | `pnpm type-check`     | tsc --noEmit (strict)                                   |
| All gates    | `pnpm ci`             | type-check + lint + format + test + build               |

If you add a script, update this table in the same commit.

## Agent tooling

`.mcp.json` wires the official Next.js DevTools MCP. When `pnpm dev` runs,
query it before guessing about Next.js 16 (`get_errors`, `get_routes`,
Cache Components guide, knowledge base). See
[nextjs.org/docs/app/guides/mcp](https://nextjs.org/docs/app/guides/mcp).

For known project-specific footguns (Cache Components, YAML date coercion,
TUN proxy), see [docs/GOTCHAS.md](docs/GOTCHAS.md). Each entry has a 1-line
fix.

## Commit conventions

Conventional Commits, atomic. Subject ≤72 chars, lowercase, imperative
("add X", not "added X"). Prefixes:
`feat`, `fix`, `build`, `chore`, `docs`, `refactor`, `test`, `perf`, `style`, `ci`.

Body explains _why_ the change is non-obvious. Don't put `why` in code
comments.

## Working agreements

These are paired do/don't rules — knowing the alternative matters as much
as knowing the prohibition.

1. **Read before writing.** Check ROADMAP for what's planned, specs/ for
   why decisions were made, journal/ for known failures.
2. **Empty > placeholder.** Don't invent filler for sections with no real
   content. Use `_TBD_` or leave empty.
3. **Edit, don't duplicate.** Update existing files. No `v2` parallels.
4. **Atomic commits.** One concern per commit; chain commits if needed.
5. **Update docs in the same commit as the code.** New command → update
   table here. New load-bearing decision → new SPEC.
6. **Log failures to `journal/`.** A failure debugged once should not be
   debugged twice. Promote G.x to [docs/GOTCHAS.md](docs/GOTCHAS.md) only
   after the same issue bites ≥ 2 times.
7. **Skills: borrow before building.** Check official sources first;
   community skills with 4-criteria gate. See [skills/README.md](skills/README.md).
8. **Don't push without confirmation.** Local commits are fine. Pushes,
   force-pushes, branch deletions, and PR actions need explicit user
   approval each time.

## Style

- Default to no comments. Only comment when _why_ is non-obvious.
- One-line docstrings max.
- Don't reference current task / PR / issue numbers in code — they rot.

## Security

- Never commit secrets. If you see one, stop and tell the user.
- Don't disable safety checks (`--no-verify`, `--force`) to bypass an
  obstacle. Find the root cause.

## When this file is wrong

Reality drifts. Update this document — a stale AGENTS.md actively misleads
agents. The file is loaded into every session; every line competes for
context window. **Tangential detail belongs in specs/ or docs/, not here.**
