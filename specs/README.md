# specs/

SPEC-driven decision records. One folder per spec. Specs are the durable
_why_ behind non-obvious choices — code shows the _what_, git history shows
_when_, specs explain _why_.

## When to write a spec

Write one when:

- You're making a decision that has more than one reasonable answer.
- The decision will be load-bearing for future work (architecture, data
  model, public API, build pipeline, etc.).
- A future agent reading the code alone would not be able to reconstruct
  the rationale.

Do **not** write a spec for:

- Trivial implementation details.
- Things that are obvious from the code.
- Speculative future work — wait until it's real.

## Structure

```
specs/
└── 0001-short-kebab-slug/
    ├── spec.md       # the decision (required)
    ├── notes.md      # optional: longer exploration, alternatives weighed
    └── assets/       # optional: diagrams, benchmark data, screenshots
```

Numbering is monotonic and never reused. If a spec is superseded, mark it
`status: superseded-by: NNNN-...` rather than deleting it.

## spec.md template

```markdown
---
id: NNNN
title: Short title
status: proposed | accepted | superseded-by: NNNN-... | withdrawn
date: YYYY-MM-DD
---

## Context

What's the situation that requires a decision? What constraints apply?

## Decision

The choice, stated plainly. One paragraph.

## Consequences

What becomes easier. What becomes harder. What we're committing to.

## Alternatives considered

Brief — one or two sentences each — and why they lost.
```

## Lifecycle

- `proposed` — written, not yet acted on.
- `accepted` — in effect; the codebase reflects this.
- `superseded-by: NNNN-...` — replaced; keep the file for historical context.
- `withdrawn` — never enacted; keep so we don't re-litigate.

Status changes are themselves commits (`docs: accept SPEC-0007`).
