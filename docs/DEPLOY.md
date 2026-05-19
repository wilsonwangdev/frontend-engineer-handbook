# 公网发布步骤（需要你执行）

施工中的版本可以现在就发布到 Vercel 公网可访问，开始 build in public。
本文档列出**需要你（人类作者）执行**的步骤——这些操作需要你的 GitHub /
Vercel 账号授权，agent 没法替你做。

## 步骤 1：创建 GitHub 仓库

在 GitHub 网页或 `gh` CLI 创建仓库：

```bash
# 用 gh CLI（已登录的话）
gh repo create wilsonwangdev/frontend-engineer-handbook \
  --public \
  --description "面向 2026 年、围绕 agent 协作的前端工程师中文精编手册" \
  --source=. \
  --remote=origin \
  --push
```

或网页创建空仓库后：

```bash
git remote add origin git@github.com:wilsonwangdev/frontend-engineer-handbook.git
git push -u origin main
```

## 步骤 2：连接 Vercel

1. 访问 https://vercel.com/new
2. 选择 "Import Git Repository"
3. 选择 `wilsonwangdev/frontend-engineer-handbook`
4. **Framework Preset** 自动检测为 **Next.js** — 保持默认
5. **Build Command** 保持默认 `next build`
6. **Output Directory** 保持默认
7. **Install Command** 改为 `pnpm install --frozen-lockfile`
8. **Node.js Version** 选 24 或 22（≥ Next.js 16 要求的 20.9）
9. 点 Deploy

首次部署约 1–2 分钟。

## 步骤 3：启用 Vercel 增值能力（免费层）

部署成功后，在 Vercel Dashboard 项目设置中开启：

- **Analytics** —— 流量与读者行为
- **Speed Insights** —— Core Web Vitals 实时监控
- **Web Analytics** —— 无 cookie 的访客统计

代码层已 wire 好 `@vercel/analytics` 和 `@vercel/speed-insights`，开启即生效。

## 步骤 4（可选）：自定义域名

如果有域名：

1. Vercel Dashboard → Settings → Domains → Add
2. 按提示在 DNS 提供商配置 CNAME 或 A 记录
3. Vercel 自动签发 SSL 证书

## 步骤 5（可选）：GitHub Actions 触发

`.github/workflows/ci.yml` 已配置好，push 即触发 CI。
首次 push 后会在 GitHub Actions 看到运行结果。

如果 e2e 在 CI 失败：先查 Playwright 报告（artifacts），按 SPEC-0005 测试策略
section 评估是否需要先合并 e2e 重构 PR。

## 步骤 6：开启 build-in-public 反馈循环

发布后建议立刻：

- README.md 顶部加上正式的站点 URL
- GitHub Issues 开启
- 在 Twitter/小红书/知乎等渠道公告（可选）

发现新踩坑 → `journal/` 记录；季度末走 [SPEC-0005](../specs/0005-companion-tracks-and-test-strategy/spec.md)
评估升级到附录 D。

## 故障排查

### 构建失败：missing dependency

确保 Vercel 用 pnpm 安装：Install Command 必须是 `pnpm install --frozen-lockfile`。

### Cache Components / PPR 没生效

构建日志里应该看到：

```
└ ◐ /[...slug]     15m   1y    <-- Partial Prerender 标记
```

如果没有 ◐ 标记，检查 `next.config.ts` 是否启用 `cacheComponents: true`。

### Speed Insights / Analytics 不显示数据

需要 5–10 分钟初始化。多刷新几次页面后再看 Dashboard。

---

完成步骤 1–3 后，本手册就在公网可访问了。后续每次 push 到 main 自动重新部署。
