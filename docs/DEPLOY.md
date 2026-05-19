# 公网发布步骤

施工中的版本可以现在就发布到 Vercel 公网可访问，开始 build in public。
本文档列出**需要平台账号授权的操作**——这些 agent 不能直接做，但配合
`gh` CLI 已经能减少不少手动步骤。

## 步骤 1：创建 GitHub 仓库（gh CLI 可代办）

环境已配置 `gh` CLI 并登录到 `wilsonwangdev`。一句命令搞定：

```bash
gh repo create wilsonwangdev/frontend-engineer-handbook \
  --public \
  --description "面向 2026 年、围绕 agent 协作的前端工程师中文精编手册" \
  --source=. \
  --remote=origin \
  --push
```

> 等价于：建仓库 + 设置 remote + 把当前 main 推上去。
> 由 agent 代为执行时需要用户当次明确同意（参考 AGENTS.md 协作准则 §8）。

## 步骤 2：接入 Vercel（需要 Vercel 控制台操作）

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 选 "Import Git Repository"
3. 选 `wilsonwangdev/frontend-engineer-handbook`
4. **Framework Preset**：会自动识别为 **Next.js**——保持默认
5. **Build Command**：保持默认 `next build`
6. **Output Directory**：保持默认
7. **Install Command**：改成 `pnpm install --frozen-lockfile`
8. **Node.js Version**：选 24 或 22（≥ Next.js 16 要求的 20.9）
9. 点 Deploy

首次部署 1–2 分钟。

## 步骤 3：开启 Vercel 增值能力（免费层）

部署完成后，在 Vercel Dashboard 项目设置里开启：

- **Analytics** —— 流量与读者行为
- **Speed Insights** —— Core Web Vitals 实时监控
- **Web Analytics** —— 无 cookie 的访客统计

代码层 `@vercel/analytics` 和 `@vercel/speed-insights` 已经 wire 好，
开启即生效。

## 步骤 4（可选）：自定义域名

有域名的话：

1. Vercel Dashboard → Settings → Domains → Add
2. 按提示在 DNS 提供商配置 CNAME 或 A 记录
3. Vercel 自动签发 SSL 证书

## 步骤 5（可选）：GitHub Actions 触发

`.github/workflows/ci.yml` 已配置好，推送即触发 CI。
首次 push 后会在 GitHub Actions 看到运行结果。

如果 e2e 在 CI 失败：先看 Playwright 报告 artifacts，按 SPEC-0005 测试
策略章节评估是否需要先合并 e2e 重构 PR。

## 步骤 6：开启 build-in-public 反馈循环

发布后建议立刻：

- README.md 顶部加上正式的站点 URL
- GitHub Issues 开启
- 在自媒体（Twitter / 小红书 / 知乎等）公告（可选）

新踩坑 → `journal/` 记录；季度末走
[SPEC-0005](../specs/0005-companion-tracks-and-test-strategy/spec.md)
评估升级到附录 D。

## 故障排查

### 构建失败：missing dependency

确保 Vercel 用的是 pnpm：Install Command 必须是
`pnpm install --frozen-lockfile`。

### Cache Components / PPR 没生效

构建日志里应该看到：

```
└ ◐ /[...slug]     15m   1y    <-- Partial Prerender 标记
```

如果没有 ◐ 标记，检查 `next.config.ts` 里 `cacheComponents: true` 是否
还在。

### Speed Insights / Analytics 不显示数据

需要 5–10 分钟初始化。刷几次页面后再看 Dashboard。

---

完成步骤 1–3 后，本手册就在公网可访问了。后续每次推送到 main 自动重新
部署。
