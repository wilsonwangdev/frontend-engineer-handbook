import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

// 本地若开了系统级 TUN 代理（Clash / Surge 等），localhost 流量会被
// 内核层劫持，e2e 无法直连。两条规避路径：
// - PLAYWRIGHT_SKIP_WEBSERVER=1 + 手动 `pnpm start` + 在代理 app 排除 localhost
// - 用 `pnpm smoke` 做纯 node:http 烟雾测试
// 不要在本配置里设 use.proxy；chromium 默认已是直连，显式设 "direct://"
// 反而被当作代理服务器名解析失败（CI 上 ERR_PROXY_CONNECTION_FAILED）。
// 详见 journal/2026-05-20-e2e-proxy-on-ci.md。
const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  ...(skipWebServer
    ? {}
    : {
        webServer: {
          command: "pnpm start",
          url: BASE_URL,
          env: { PORT: String(PORT) },
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
});
