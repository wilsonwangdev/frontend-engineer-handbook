---
date: 2026-05-19
tags: [playwright, e2e, proxy, network, macos, tun-mode]
---

## What happened

第二次 Playwright E2E 集成尝试，所有测试 `ERR_CONNECTION_REFUSED at http://localhost:4173/`。
但 `pnpm start` 手动启动 + `curl` 验证完全正常。换端口（3100 → 4173）、
unset 环境变量、在 `webServer.env` 注入 `NO_PROXY` 都无效。

Playwright debug 日志显示：

```
pw:webserver HTTP GET: http://localhost:4173/
pw:webserver HTTP Status: 400        <-- 没启动就 400？
pw:webserver WebServer is already available
```

`HTTP 400` 不是 Next.js 的响应——是本地 HTTP 代理 Clash/Surge 返回的。
关键卡点：**用户开启了代理的 TUN 模式**。

## Root cause

TUN 模式工作在网络栈 L3/L4 层，劫持所有 TCP/UDP 流量（包括 localhost），
**完全绕过应用层的 `http_proxy` / `HTTP_PROXY` / `NO_PROXY` env var**。
任何在 Node.js 进程里 unset 代理变量、设置 NO_PROXY 都是无效的——流量在
内核层就已经被路由到代理进程了。

Playwright 的 webServer health-check 用 Node http 模块发起 GET，TUN 把请求
导给代理，代理对 localhost 不知如何处理，返回 400。Playwright 把 400 当
"webServer ready" 然后开始跑测试，但真正的 `next start` 还没起来，于是
后续 `page.goto` 实际是 ERR_CONNECTION_REFUSED。

## Fix

**应用层 fix 无效**。只能：

1. **CI 环境跑 E2E**（CI 容器没 TUN，原配置工作）
2. 本地手动跑：先 `PORT=4173 pnpm start` 启动 Next.js，再用 `--ui` 或
   `--no-webserver` 启动 Playwright（需要先关闭 TUN 或加 localhost 排除规则）
3. 用户级别配置：在 Clash/Surge 的 `direct rules` 加入 `localhost,127.0.0.1`
   显式直连

仓库里的对应改动：

- [playwright.config.ts](../playwright.config.ts) 仍保留 `proxy: 'direct://'`
  和 webServer `NO_PROXY` 设置——对**非 TUN 模式**用户有效。
- CI 中 E2E 仍然自动运行（容器无代理）。

## Lesson for next time

**代理问题分两层**：

- **L7（应用层）代理** —— Node 进程读 `http_proxy` env var、Playwright 的
  `proxy` 配置。`NO_PROXY` 有效。
- **L3/L4（网络层）代理 / TUN 模式** —— 内核层流量劫持，**应用层完全无感**。
  唯一解：用户改代理配置、或换 CI 环境。

调试网络问题时第一件事：**确认用户是否启用了 TUN/系统代理/全局代理**。
不确认就上 env var 修补属于"在错误的层级解决问题"，会浪费大量时间。

本条候选升级到 [附录 D.1 网络与代理](../content/appendix-d) —— 是中文工程师
高频踩坑（Clash/Surge 在国内常见）且主流英文文档不覆盖。
