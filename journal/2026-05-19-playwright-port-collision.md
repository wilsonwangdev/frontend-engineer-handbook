---
date: 2026-05-19
tags: [e2e, playwright, dev-server, ports]
---

## What happened

First Playwright E2E run failed with `net::ERR_CONNECTION_REFUSED at http://localhost:3100/`.
Earlier runs against port 3000 had passed against a _different_ server: a stray
`next dev` from an earlier session was still alive on 3000 and serving a
locale-redirected variant (`/en/`), masking the real test target.

## Root cause

Two issues stacked:

1. The Playwright `webServer.command` was `pnpm start --port 3100`, but pnpm
   eats the `--port` flag instead of forwarding it to Next.js. So `next start`
   bound to the default 3000, but Playwright probed 3100 → ECONNREFUSED.
2. Even when 3000 worked, it was answering against a leftover server from a
   prior run, not our build.

## Fix

- Pass `PORT=3100` via `webServer.env` (Next.js reads `PORT`).
- Kill stray dev servers between runs.
- See [playwright.config.ts](../playwright.config.ts).

## Lesson for next time

When wiring `webServer` in Playwright, prefer the `env` field over CLI flags —
pnpm script wrappers do not reliably forward unknown flags to the underlying
binary. And always verify nothing is already listening on the test port before
debugging "connection refused".
