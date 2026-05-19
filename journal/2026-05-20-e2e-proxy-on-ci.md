---
date: 2026-05-20
tags: [ci, playwright, proxy, github-actions, root-cause-corrected]
related: 2026-05-19-playwright-tun-mode-proxy.md
---

## What happened

首次推送到 GitHub 后 `CI / E2E (Playwright)` job 全部失败。错误：

```
page.goto: net::ERR_PROXY_CONNECTION_FAILED at http://localhost:4173/chapter-00
```

`Quality Gates` job（type-check / lint / format / test / build）全绿。

## 第一次归因（错误）

我最初推测是"GitHub Actions runner 环境注入了代理设置，chromium 拿到
后试图通过代理访问 localhost"。基于这个推测把 e2e job 改为
`workflow_dispatch` 仅手动触发，并把问题记入 ROADMAP 待还的债。

## 用户给出的关键反例

用户指出姊妹项目 `wilsonwangdev/agent-master-handbook` 在同账号、
同 GitHub Actions 基础设施上，访问 `http://localhost:3000` 是成功的
（`lighthouse.yml` 用 `npx serve` + `npx wait-on` 跑通了）。

这直接证伪"runner 拦截 localhost"的假设——**runner 本身没问题，问题
在我们 Playwright 配置里**。

## Root cause（修正后）

`playwright.config.ts` 之前有一行：

```ts
use: {
  proxy: {
    server: "direct://";
  }
}
```

我当初加它是想"绕过本地 TUN 代理"。但 `direct://` 不是合法的 proxy
URL——chromium 把它当成代理服务器名，**尝试解析并连接这个名为
`direct://` 的代理**，连接失败 → `ERR_PROXY_CONNECTION_FAILED`。

本地不报错的原因：TUN 代理在 L3/L4 把 chromium 流量也劫持了，掩盖了
"代理服务器名解析失败"这一真实错误。CI 上没有 TUN，chromium 严格
执行配置 → 立刻报错。

正确做法：**根本不设 `use.proxy`**。chromium 默认就是直连。

## Fix

[playwright.config.ts](../playwright.config.ts)：

- 删除 `use.proxy = { server: "direct://" }`（这才是 root cause）
- 删除 `webServer.env` 里 `NO_PROXY` / `http_proxy=""` 等（同属过度
  配置，本地能跑只是因为 TUN 没拦截这次启动；CI 上原本就没代理也无害，
  但精简为单 `PORT` 配置）

[.github/workflows/ci.yml](../.github/workflows/ci.yml)：

- 撤回上一轮 `if: github.event_name == 'workflow_dispatch'` 的临时
  解决——e2e 重新在 push / PR 上跑

ROADMAP 待还的债条目移除。

## Lesson for next time

按 [SPEC-0008](../specs/0008-pre-action-reflexive-checklist/spec.md)
R1 复盘，**第一次加 `use.proxy = "direct://"` 那次就违反了**：

- R1.3「业界候选方案」：从未调研过"绕过 TUN 代理在 Playwright 里
  应该怎么写"。直接靠"看起来像 direct""听起来像直连"凭感觉写。
- 这条配置加进来后从来没被验证过——本地恰好不报错（被 TUN 掩盖），
  CI 上才暴露。"看起来 work" ≠ "正确"。

更深的元教训：**本会话已经反复出现"先归因到外部环境（TUN / runner /
代理）再发现是自己配置错"的模式**。下次 e2e 类问题，先把自己的
配置全部删到最简（默认值），看默认能不能跑——能跑就一行一行加回来，
不能跑再去找环境层原因。

不要先假设环境出错，先假设自己配置出错。

## 与 [2026-05-19-playwright-tun-mode-proxy.md](2026-05-19-playwright-tun-mode-proxy.md) 的关系

那条 journal 记录的本地 TUN 拦截 localhost 是真实的——`pnpm smoke`
仍然是本地用户开 TUN 时的有用 workaround。

但**那次为了"防 TUN" 加的 `use.proxy = "direct://"` 反而是**这次 CI
失败的真因。修复 = 删那行 + 保留 smoke 脚本作为本地 TUN 用户的
fallback。两条 journal 共同构成一个完整的归因链。
