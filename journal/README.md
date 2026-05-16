# journal/

A cross-session failure log. When an agent (or a human) hits a non-obvious
mistake, dead end, or wrong turn, record it here so future sessions don't
repeat it. This is how the repo evolves itself.

## When to write an entry

Write one when:

- You went down a wrong path that wasn't obvious from the code.
- You discovered a constraint, gotcha, or footgun the docs don't mention.
- A test, build, or deploy failed in a way that took non-trivial debugging.
- A "fix" caused a regression — capture both the fix and the regression.

Do **not** write entries for:

- Routine bugs that the commit message already explains.
- Things already covered by `specs/` or `AGENTS.md`.
- Generic programming knowledge.

## Format

One file per incident. Filename: `YYYY-MM-DD-short-slug.md`.

Inside:

```markdown
---
date: YYYY-MM-DD
tags: [build, types, runtime, agent-behavior, ...]
---

## What happened

One paragraph. The symptom and the wrong assumption.

## Root cause

One paragraph. Why it actually broke.

## Fix

What we did, and a link to the commit if relevant.

## Lesson for next time

The single sentence a future agent needs to read to avoid this.
```

Keep entries short. The `Lesson for next time` line is the load-bearing part —
it's what scanning agents will skim first.

## Pruning

Entries don't need to live forever. If a lesson has been encoded into
`AGENTS.md`, a SPEC, a lint rule, or a test, the journal entry has done its
job and can be removed (or marked `superseded-by:` in the frontmatter).
