---
date: 2026-05-20
tags: [ci, playwright, proxy, github-actions]
related: 2026-05-19-playwright-tun-mode-proxy.md
---

## What happened

首次推送到 GitHub 后 `CI / E2E (Playwright)` job 全部失败。错误：

```
page.goto: net::ERR_PROXY_CONNECTION_FAILED at http://localhost:4173/chapter-00
```

`Quality Gates` job（type-check / lint / format / test / build）全绿。
仅 `e2e` 失败。

## Root cause（怀疑）

GitHub Actions runner 上的 chromium **以某种方式拿到了代理设置**，
访问 `localhost:4173` 时尝试经代理而非直连，代理不可达 →
`ERR_PROXY_CONNECTION_FAILED`。

`playwright.config.ts` 里 `use.proxy = { server: "direct://" }`
本意是绕过代理直连，但 Playwright 1.60 在 GitHub Actions 这套
chromium 上**没有生效**。

未完全定位精确原因。三个可能：

1. GitHub Actions runner 环境注入 `HTTPS_PROXY` 影响 chromium 默认行为
2. `direct://` 在 Playwright 1.60 changelog 里有 deprecation
3. CI 使用的 chromium binary 启动参数与本地不同

与之前 [journal/2026-05-19-playwright-tun-mode-proxy.md](2026-05-19-playwright-tun-mode-proxy.md)
是**同源问题在不同栈复现**——本地 TUN 代理在 L3/L4 拦截 localhost，
CI runner 在 L7 通过 chromium proxy 设置劫持。两层各有触发条件，但
症状都是 e2e 无法访问 localhost 服务器。

## Fix（临时）

把 e2e job 改为只在 `workflow_dispatch`（手动触发）时运行：

```yaml
# .github/workflows/ci.yml
on:
  push: ...
  pull_request: ...
  workflow_dispatch:

jobs:
  e2e:
    if: github.event_name == 'workflow_dispatch'
```

这样：

- push / PR 不再触发 e2e → CI 总览不被污染
- 仍保留 e2e job 定义，手动可触发（GitHub UI 或 `gh workflow run ci.yml`）
- 未来修复后只需删 `if:` 一行恢复

ROADMAP 已记入"待还的债"。

## Lesson for next time

按 [SPEC-0008](../specs/0008-pre-action-reflexive-checklist/spec.md) R1
反射，**调研结论先于动手**：

- 已知本地 TUN 代理会让 e2e 失败（journal 2026-05-19）
- 未知 CI runner 是否会有类似问题
- 应当在加 e2e job 到 CI 之前**先在 fork 或 PR 上跑一次**验证，
  而不是直接推到 main 然后等 GitHub UI 标红

CI 配置类改动属于工程化基建（R1 第 1 问），未来加新 job 前应当
先用 act / fork PR 验证一遍，不能默认"本地能跑 = CI 也能跑"。

## 修复计划

未来某次单独 spike 解决：

1. 在 CI runner 上加 `echo "$HTTP_PROXY $HTTPS_PROXY"` 确认环境
2. 试 `use.proxy = undefined` 而非 `"direct://"`
3. 试在 chromium launchOptions 显式 `--no-proxy-server`
4. 试 `args: ["--proxy-bypass-list=*"]`
5. 都不行则改用 `vitest browser mode` 替代 Playwright（生态评估在
   [SPEC-0005](../specs/0005-companion-tracks-and-test-strategy/spec.md)
   测试策略里）

修好后从 ci.yml 删除 `if: github.event_name == 'workflow_dispatch'`，
e2e 恢复每 push/PR 跑。
