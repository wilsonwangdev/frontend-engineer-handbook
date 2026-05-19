import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

// E2E in local dev can be blocked by system-level proxies (Clash/Surge TUN
// mode intercepts even localhost traffic at the network stack, bypassing
// any application-level NO_PROXY env). When that happens, run E2E in CI
// (no system proxy) or set PLAYWRIGHT_SKIP_WEBSERVER=1 and start the
// server manually after temporarily disabling the proxy.
// See journal/2026-05-19-playwright-tun-mode-proxy.md
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
    proxy: { server: "direct://" },
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
          env: {
            PORT: String(PORT),
            NO_PROXY: "localhost,127.0.0.1",
            http_proxy: "",
            https_proxy: "",
            HTTP_PROXY: "",
            HTTPS_PROXY: "",
          },
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
});
