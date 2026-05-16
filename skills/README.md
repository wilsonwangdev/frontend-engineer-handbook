# skills/

Reusable agent capabilities scoped to this repository. A skill is a small
bundle of instructions (and optional scripts) an agent can invoke to do a
specific recurring task well.

## Borrow before building

**Always check community catalogs before writing a custom skill:**

- [skills.sh](https://skills.sh) — community skill registry
- [cursor.directory](https://cursor.directory) — Cursor rules and skills
- The agent's own built-in skills (run `/skills` or equivalent)

If a community skill covers 80% of the need, vendor it and adapt — don't
reinvent.

## Quality gate for adding a skill

A new skill earns its place in this directory only if **all** of these hold:

1. **Recurring need.** Used at least 3 times across distinct tasks, or
   clearly will be. One-off prompts don't become skills.
2. **Non-trivial.** The skill encodes knowledge, sequencing, or guardrails
   that aren't obvious from a single short prompt.
3. **Stable contract.** Inputs and outputs are well-defined. The skill
   doesn't drift across invocations.
4. **No community equivalent.** You searched skills.sh and cursor.directory
   and either nothing fit or you're wrapping/extending something that did.
5. **Testable.** There's a way to tell if the skill produced a correct
   result, even if it's just a manual checklist.
6. **Owned.** Every skill has a maintainer (a human) named in its
   frontmatter. Unowned skills get pruned.

If a candidate fails any of these, the right move is usually a one-shot
prompt or a SPEC, not a skill.

## Skill structure

```
skills/
└── short-kebab-slug/
    ├── SKILL.md      # the skill itself (required)
    ├── scripts/      # optional: helper scripts the skill invokes
    └── examples/     # optional: input/output examples
```

## SKILL.md template

```markdown
---
name: short-kebab-slug
description: One sentence — what this skill does and when to invoke it.
owner: @username
status: experimental | stable | deprecated
---

## When to use

Bullet list of trigger conditions.

## When NOT to use

Bullet list of anti-patterns — overlapping skills, wrong scope, etc.

## Steps

Numbered, deterministic. The agent should be able to follow these without
improvising.

## Inputs

What the skill expects to receive (file paths, args, prior context).

## Outputs

What the skill produces. Where it writes. What it leaves untouched.

## Verification

How to know the skill worked. A command, a checklist, a test to run.
```

## Pruning

Review skills quarterly. A skill that hasn't been invoked in two quarters
is a candidate for deprecation. Mark `status: deprecated` first; delete
only after another quarter.
