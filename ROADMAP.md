# ROADMAP

> Forward-looking plan for the handbook. New agent sessions: scan this to find
> the highest-leverage task to pick up next.
>
> **Scope rule**: ROADMAP captures planned-but-unimplemented work. Once an item
> ships, move it to the "Shipped" log at the bottom and link the commit. For
> failures during execution, write to [journal/](journal/). For load-bearing
> design decisions, write a [SPEC](specs/).

---

## Current focus (active milestone)

**M1 finalization → first public deploy**

- [x] MDX pipeline + handbook routes
- [x] Three-layer agent knowledge system (MCP + skills + gotchas)
- [x] README + LICENSE + DEPLOY.md
- [ ] **Push to GitHub `wilsonwangdev/frontend-engineer-handbook`** (manual, user-only)
- [ ] **Connect Vercel + first production deploy** (manual, user-only)
- [ ] Confirm Speed Insights + Web Analytics receiving data
- [ ] Update README.md with live URL after first deploy

See [docs/DEPLOY.md](docs/DEPLOY.md) for the manual steps.

---

## Next up (after first deploy)

### Content — main track

Per [SPEC-0003](specs/0003-table-of-contents/spec.md). Recommended order:

- [ ] **Chapter 2** Web platform fundamentals
  - Split into 6 sections per agreed structure: `http`, `url`,
    `browser-rendering`, `event-loop`, `storage`, `security`
  - Each ~200–300 lines, lighter than ch1
  - Suggested kickoff: write `index.mdx` + `sections/http.mdx` first as
    style sample, get feedback, then continue
- [ ] **Chapter 3** HTML / CSS / modern layout
- [ ] **Chapter 4** JavaScript & TypeScript
- [ ] **Chapter 5** React & Next.js
- [ ] **Chapter 6** Build & tooling
- [ ] **Chapter 7** Quality & delivery
  - **Pending refactor**: rewrite existing `e2e/*.spec.ts` from text
    assertions to snapshot + structural assertions, per
    [SPEC-0005 §二](specs/0005-companion-tracks-and-test-strategy/spec.md).
    Use the rewrite itself as a case study in this chapter.
- [ ] **Chapter 8** Modern frontier (Wasm / WebGL / WebGPU / Edge / etc.)
- [ ] **Chapter 9** AI-native workflow
- [ ] **Chapter 10** Hands-on (mini bundler / framework / agent-app)

### Content — appendices

- [ ] **Appendix A** Framework comparison (Vue / Svelte / Solid)
- [ ] **Appendix B** Curated primary resources + classic book list
- [ ] **Appendix C** Chinese ↔ English term glossary
- [ ] **Appendix D** Real-world pitfalls (build during writing; promote
      qualifying entries from [journal/](journal/) per [SPEC-0005](specs/0005-companion-tracks-and-test-strategy/spec.md) 4-criteria gate)

### Site features

Per the approved implementation plan (M2–M5):

- [ ] **Search**: FlexSearch index + `Cmd K` palette
- [ ] **Right-rail TOC**: heading scroll-spy on chapter pages
- [ ] **Reading progress**: top scroll bar + per-chapter completion
      (localStorage)
- [ ] **Path selector + breadcrumb**: A/B/C learning-path switcher
- [ ] **Mobile**: drawer sidebar, bottom nav
- [ ] **Page transitions**: React 19.2 `<ViewTransition>` on route change
- [ ] **Dark/light toggle**: View Transition circular reveal animation
- [ ] **PWA**: `@serwist/next` service worker + offline fallback
- [ ] **Export**: PDF (Puppeteer or react-pdf) + Markdown bundle (.zip)
- [ ] **Landing page polish**: hero, path cards, feature grid

---

## Backlog (uncommitted, evaluate when scheduling)

- [ ] **SPEC-0007 (or amend SPEC-0006)**: agent knowledge layering review
      protocol — quarterly check on which gotchas are still relevant,
      which skills are still triggered, which Cursor/Claude tooling
      primitives changed
- [ ] **Snapshot test helper**: a small `e2e/utils/snapshot.ts` for
      the content-page assertion style (one-time investment, reused for
      every chapter)
- [ ] **Content frontmatter linter**: CI step that validates every
      `content/**/*.mdx` against `frontmatterSchema` before merge — currently
      caught at build, but a dedicated check gives faster feedback
- [ ] **Link checker in CI**: `lychee` over all external links per
      [SPEC-0002](specs/0002-content-source-admission/spec.md) source policy
- [ ] **Renovate / Dependabot**: keep deps fresh (Next 16 is moving fast)
- [ ] **Lighthouse CI**: enforce the quality bars from the approved plan
      (Perf 95+ / A11y 100 / etc.)
- [ ] **Sitemap + robots.txt**: minimum SEO

---

## Deferred / out of scope for v1

These were considered and explicitly **not** for the first iteration. Revisit
only after v1 ships and stabilizes.

- Multi-language (English mirror) — see SPEC-0001 §language
- User accounts / comments / favorites — adds DB, breaks "free + static" promise
- Video tutorials — outside the "图文小册" form
- Self-hosted analytics — Vercel free tier sufficient for v1

---

## Known debts (track until paid)

| Debt                                      | Created     | SPEC reference                                                     | Resolution plan               |
| ----------------------------------------- | ----------- | ------------------------------------------------------------------ | ----------------------------- |
| `e2e/*.spec.ts` uses text assertions      | 2026-05-19  | [SPEC-0005](specs/0005-companion-tracks-and-test-strategy/spec.md) | Refactor when ch7 is authored |
| AGENTS.md was 210 lines (over budget)     | 2026-05-19  | SPEC-0006                                                          | Slimmed in this same session  |
| First quarterly skills review pending     | due 2026-08 | [SPEC-0006](specs/0006-agent-skills-system/spec.md)                | Reminder in calendar          |
| First appendix-D promotion review pending | due 2026-08 | [SPEC-0005](specs/0005-companion-tracks-and-test-strategy/spec.md) | Same window                   |

---

## Shipped (recent → older)

- 2026-05-19 — Chapter 1: AI-era frontend competency map (commit `13282ee`)
- 2026-05-19 — Chapter 0: how to use this handbook (commit `5f86cc9`)
- 2026-05-19 — MDX pipeline + handbook routes (commit `253cc84`)
- 2026-05-19 — SPEC-0001 → SPEC-0006 (decision baseline complete)
- 2026-05-19 — M0 quality gates + Next.js 16 skeleton (commit `97ccc79`)
- 2026-05-19 — Agent-ready harness bootstrap (commit `712d3d8`)

---

## How to use this file

- **New session**: read top to bottom. The first un-checked box under
  "Current focus" or "Next up" is your best candidate.
- **Picking a task**: confirm with the user before starting work that spans
  more than ~30 minutes.
- **After shipping**: move the item from its section to "Shipped", add the
  commit hash.
- **Don't**: turn this into a backlog of every imaginable feature. Keep
  items concrete and within ~3 months of intended execution. Older
  speculative ideas go in "Deferred / out of scope" or are deleted.
