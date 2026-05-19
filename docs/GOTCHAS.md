# Known Gotchas

Project-specific footguns discovered during build-out. Read this when:

- You hit a confusing error in this codebase (search before debugging)
- Before writing code touching the listed areas
- Adding a new entry — only after the same issue bites twice (per
  [SPEC-0006](../specs/0006-agent-skills-system/spec.md) Layer 3 promotion rule)

Each entry: symptom → 1-line fix → link to full incident.

---

## G.1 Next.js 16 — `'use cache'` required under Cache Components

**Symptom**: `Error: Uncached data was accessed outside of <Suspense>` during build.

**Fix**: Add `"use cache";` to the top of any async data-loading function.

```ts
export async function getAllDocs() {
  "use cache";
  // ...filesystem / db / fetch reads
}
```

**Why**: `next.config.ts` has `cacheComponents: true`. Any data access without
the directive is treated as dynamic, which conflicts with prerender.

Full incident: [journal/2026-05-19-nextjs16-cache-components-directive.md](../journal/2026-05-19-nextjs16-cache-components-directive.md)
Skill: [skills/nextjs-16-guardrails](../skills/nextjs-16-guardrails/SKILL.md)

---

## G.2 Zod + gray-matter — YAML auto-coerces bare dates

**Symptom**: `ZodError: expected string, received Date` when validating
frontmatter that has `lastVerified: 2026-05-19` (no quotes).

**Fix**: Use defensive `union + transform` coerce:

```ts
const isoDateString = z
  .union([z.iso.date(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));
```

**Why**: gray-matter follows YAML 1.1, which auto-parses `YYYY-MM-DD` as
a JS `Date`. Other auto-coercions: `yes/no/on/off → boolean`, `null/~ → null`.

Full incident: [journal/2026-05-19-yaml-auto-date-coercion.md](../journal/2026-05-19-yaml-auto-date-coercion.md)
Skill: [skills/zod-frontmatter](../skills/zod-frontmatter/SKILL.md)

---

## G.3 E2E on macOS — TUN-mode proxy intercepts localhost

**Symptom**: `pnpm test:e2e` hangs or returns `ERR_CONNECTION_REFUSED` while
`pnpm start` works fine standalone.

**Fix**: Two options —

- Quick check: `pnpm smoke` (pure `node:http` to `127.0.0.1`, bypasses
  L7 proxy logic)
- Full E2E: temporarily disable TUN mode in your proxy app, then run
  `pnpm test:e2e:local`

**Why**: TUN-mode proxies (Clash/Surge) intercept at L3/L4 of the network
stack, bypassing every application-layer `NO_PROXY` / `unset http_proxy`.
CI containers have no TUN, so the auto-started webServer works there.

Full incident: [journal/2026-05-19-playwright-tun-mode-proxy.md](../journal/2026-05-19-playwright-tun-mode-proxy.md)
