# ROADMAP

> 手册的前瞻计划。**新会话开始时扫这里**，找到当前最值得推进的任务。
>
> **范围规则**：ROADMAP 只装"已规划、未实现"的工作。每完成一项就移到末尾
> "已发布"段并附 commit hash。执行过程中的失败记 [journal/](journal/)。
> 载入性的设计决策另开 [SPEC](specs/)。

---

## 当前焦点（active milestone）

**M1 收尾 → 首次公网发布**

- [x] MDX 管线 + 章节路由
- [x] 三层 agent 知识体系（MCP + skills + gotchas）
- [x] README + LICENSE + DEPLOY.md
- [ ] **推送到 GitHub `wilsonwangdev/frontend-engineer-handbook`**（gh CLI 已就绪，等用户授权）
- [ ] **接入 Vercel 完成首次生产部署**（Vercel 控制台操作，由用户完成）
- [ ] 确认 Speed Insights + Web Analytics 收到数据
- [ ] 首次部署后更新 README.md 中的 live URL

操作步骤见 [docs/DEPLOY.md](docs/DEPLOY.md)。

---

## 下一步（首次发布之后）

### 内容主干

按 [SPEC-0003](specs/0003-table-of-contents/spec.md)。推荐顺序：

- [ ] **第 2 章 Web 平台基石**
  - 拆 6 个 section：`http` / `url` / `browser-rendering` / `event-loop`
    / `storage` / `security`
  - 每节 200–300 行，比第 1 章轻
  - 启动建议：先写 `index.mdx` + `sections/http.mdx` 作为风格样板，
    用户过目后再继续
- [ ] **第 3 章 HTML / CSS / 现代布局**
- [ ] **第 4 章 JavaScript 与 TypeScript**
- [ ] **第 5 章 React 与 Next.js**
- [ ] **第 6 章 工程化与构建**
- [ ] **第 7 章 质量与交付**
  - **待还的债**：把现有 `e2e/*.spec.ts` 从"具体文字断言"重构为
    "快照 + 结构断言"，按
    [SPEC-0005 §二](specs/0005-companion-tracks-and-test-strategy/spec.md)。
    重构本身就是本章的 case study。
- [ ] **第 8 章 现代前沿话题**（Wasm / WebGL / WebGPU / Edge / 微前端）
- [ ] **第 9 章 AI 原生工作流**
- [ ] **第 10 章 动手实践**（mini bundler / framework / agent-app）

### 内容附录

- [ ] **附录 A** 框架对照（Vue / Svelte / Solid）
- [ ] **附录 B** 精选一手资源 + 经典书目
- [ ] **附录 C** 中英术语对照表
- [ ] **附录 D** 实战避坑录（写作过程中持续从 [journal/](journal/)
      升级；按 [SPEC-0005](specs/0005-companion-tracks-and-test-strategy/spec.md) 的 4 项门禁筛选）

### 站点功能

按已批准的实施方案 M2–M5：

- [ ] **搜索**：FlexSearch 本地索引 + `⌘ K` 唤起
- [ ] **右侧 TOC**：章节页标题滚动跟踪
- [ ] **阅读进度**：顶部进度条 + 章节完成度（localStorage）
- [ ] **路径选择器 + 面包屑**：A/B/C 学习路径切换
- [ ] **移动端**：抽屉式侧边栏 + 底部导航
- [ ] **页面过渡**：React 19.2 `<ViewTransition>` 路由切换动画
- [ ] **暗色切换**：View Transition 圆形扩散动画
- [ ] **PWA**：`@serwist/next` Service Worker + 离线 fallback
- [ ] **导出**：PDF（Puppeteer 或 react-pdf）+ Markdown 打包（.zip）
- [ ] **首页打磨**：hero、路径卡片、特性栅格

---

## 候补池（未承诺，按需调度）

- [ ] **快照测试 helper**：`e2e/utils/snapshot.ts`——为内容类页面统一断言
      风格，做一次复用所有章节
- [ ] **内容 frontmatter 检查**：CI 步骤，合并前对所有 `content/**/*.mdx`
      跑 `frontmatterSchema`。现在在 build 时才报错，独立检查给更快反馈
- [ ] **链接活性检查**：CI 跑 `lychee` 巡检所有外链，按
      [SPEC-0002](specs/0002-content-source-admission/spec.md) 来源策略
- [ ] **Renovate / Dependabot**：依赖更新机器人（Next 16 还在快速迭代）
- [ ] **Lighthouse CI**：把方案中的质量门禁固化到 CI（Perf 95+ / A11y 100 等）
- [ ] **Sitemap + robots.txt**：最基本的 SEO
- [ ] **SPEC-0007 候选**：agent 知识层级的季度复核流程——哪些 gotchas
      还有效、哪些 skills 被触发过、Cursor / Claude 工具链有什么新变化

---

## 已搁置 / v1 不做

考虑过但**明确不进 v1**。等 v1 上线稳定后再评估。

- 多语言（英文镜像）——见 SPEC-0001 §语言
- 用户系统 / 评论 / 收藏——破坏"免费 + 静态"承诺
- 视频教程——超出"图文小册"形态
- 自托管 analytics——v1 用 Vercel 免费层即可

---

## 待还的债（持续追踪到还清）

| 债务                             | 创建于       | 关联 SPEC                                                          | 偿还计划             |
| -------------------------------- | ------------ | ------------------------------------------------------------------ | -------------------- |
| `e2e/*.spec.ts` 用了具体文字断言 | 2026-05-19   | [SPEC-0005](specs/0005-companion-tracks-and-test-strategy/spec.md) | 第 7 章动笔时重构    |
| AGENTS.md 一度超过预算（210 行） | 2026-05-19   | SPEC-0006                                                          | 已在同会话内瘦身完成 |
| 首次季度 skills 复核             | 2026-08 到期 | [SPEC-0006](specs/0006-agent-skills-system/spec.md)                | 日历提醒             |
| 首次附录 D 升级复核              | 2026-08 到期 | [SPEC-0005](specs/0005-companion-tracks-and-test-strategy/spec.md) | 同上                 |

---

## 已发布（新 → 旧）

- 2026-05-19 — 拆分 AGENTS.md，提取 GOTCHAS + ROADMAP（commit `24c120d`）
- 2026-05-19 — README / LICENSE / DEPLOY.md（commit `d90de66`）
- 2026-05-19 — SPEC-0006 agent skills 体系 + 2 示范 skill（commit `5b49f0e`）
- 2026-05-19 — 接入 next-devtools-mcp + inline gotchas（commit `57f7c98`）
- 2026-05-19 — E2E 三轨制 + smoke 脚本（commit `def6018`）
- 2026-05-19 — SPEC-0005 番外 + 测试策略（commit `e0230d1`）
- 2026-05-19 — MDX 管线 + 章节路由（commit `253cc84`）
- 2026-05-19 — 第 1 章 AI 时代能力地图（commit `13282ee`）
- 2026-05-19 — 第 0 章 如何使用本手册（commit `5f86cc9`）
- 2026-05-19 — SPEC-0001 → 0004 决策基线
- 2026-05-19 — M0 质量门禁 + Next.js 16 骨架（commit `97ccc79`）
- 2026-05-19 — Agent-ready harness 启动（commit `712d3d8`）

---

## 怎么用本文件

- **新会话**：从上到下读一遍。"当前焦点"或"下一步"里第一个未勾选项就是
  你最该接的任务。
- **领任务**：超过 30 分钟工作量前先和用户确认方向。
- **完成后**：把条目移到"已发布"段，附 commit hash。
- **不要**：把本文件变成想到啥就堆啥的清单。条目要具体、要在 3 个月内
  有执行意图。再远的设想要么写进"已搁置"，要么删掉。
