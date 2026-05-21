# ROADMAP

> 手册的前瞻计划。**新会话开始时扫这里**，找到当前最值得推进的任务。
>
> **范围规则**：ROADMAP 主体只装"未发生"的事。例外是**里程碑**段——
> 项目叙事级的关键节点（M0 / M1 / 大章节完成等）保留以免被遗忘，
> 但**不镜像 commit log**。commit 粒度详情查 `git log` / GitHub
> Releases。执行过程中的失败记 [journal/](journal/)。载入性的设计
> 决策另开 [SPEC](specs/)。

---

## 当前焦点（active milestone）

**第 2 章 Web 平台基石**——见下方"下一步"。

M1 首次公网发布已完成；现状：

- GitHub: https://github.com/wilsonwangdev/frontend-engineer-handbook
- Live: https://frontend-engineer-handbook.vercel.app/

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
  - 素材：CSS Text Module Level 4 在中文场景的反常案例
    （[journal 2026-05-21](journal/2026-05-21-css-text-wrap-pretty-cjk-anomaly.md)）
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
- [ ] **Lighthouse CI**：按
      [SPEC-0012](specs/0012-performance-baseline-and-ci-gate/spec.md)
      分阶段实施——阶段 1（建立基准）/ 阶段 2（设阈值）/ 阶段 3（首屏优化）
- [ ] **Sitemap + robots.txt**：最基本的 SEO
- [ ] **SPEC-0007 候选**：agent 知识层级的季度复核流程——哪些 gotchas
      还有效、哪些 skills 被触发过、Cursor / Claude 工具链有什么新变化
- [ ] **SSG distillation track 沉淀**：按
      [SPEC-0010](specs/0010-progressive-ssg-distillation/spec.md)
      在打磨过程中持续记录 [docs/SSG-DISTILLATION.md](docs/SSG-DISTILLATION.md)；
      2026-08 首次季度复核，评估是否触达升级抽包条件
- [ ] **未来 feature 开发评估 spec-kit / OpenSpec**：当真正启动较大
      feature（如附录 D 完整实现、PWA 接入）时再评估是否引入。当前
      所有 SPEC 都是决策记录类型（ADR），已对标 MADR v4 标准；
      spec-kit 是 feature 开发流程工具，可与 ADR 并存使用，但**不
      替代 ADR**。

---

## 已搁置 / v1 不做

考虑过但**明确不进 v1**。等 v1 上线稳定后再评估。

- 多语言（英文镜像）——见 SPEC-0001 §语言
- 用户系统 / 评论 / 收藏——破坏"免费 + 静态"承诺
- 视频教程——超出"图文小册"形态
- 自托管 analytics——v1 用 Vercel 免费层即可

---

## 待还的债（持续追踪到还清）

| 债务                                                                                                               | 创建于       | 关联 SPEC                                                          | 偿还计划                                                           |
| ------------------------------------------------------------------------------------------------------------------ | ------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `e2e/*.spec.ts` 用了具体文字断言；同因素：CI 上 e2e 暂关（push/PR 不跑），需按 SPEC-0005 §二 重写为快照 + 结构断言 | 2026-05-19   | [SPEC-0005](specs/0005-companion-tracks-and-test-strategy/spec.md) | 第 7 章动笔时一并重构，重构后从 ci.yml 删 if 一行恢复 push/PR 触发 |
| 首次季度 skills 复核                                                                                               | 2026-08 到期 | [SPEC-0006](specs/0006-agent-skills-system/spec.md)                | 日历提醒                                                           |
| 首次附录 D 升级复核                                                                                                | 2026-08 到期 | [SPEC-0005](specs/0005-companion-tracks-and-test-strategy/spec.md) | 同上                                                               |

---

## 里程碑

项目叙事级关键节点。**不是 commit 列表**——只装值得作为版本号 /
GitHub Release 标题的事件。commit 粒度详情查 `git log`。

- **2026-05-19 项目启动** · agent-ready harness 立项（AGENTS.md / specs /
  skills / journal 四件套）+ Next.js 16 骨架 + 质量门禁基线（M0 完成）
- **2026-05-19 内容基线** · 第 0 / 1 章上线 + SPEC-0001 至 SPEC-0008
  决策基线落齐 + MADR v4 对标
- **2026-05-20 首次公开可访问版本（[v0.1.0](https://github.com/wilsonwangdev/frontend-engineer-handbook/releases/tag/v0.1.0)）** ·
  GitHub 仓库 + Vercel 部署 + Analytics 接入；
  live: https://frontend-engineer-handbook.vercel.app/ ；
  SPEC-0009 落地发布规则（M1 完成）

未来里程碑示例：第 2 章上线、第一次依赖大升级、首个外部贡献者、
PWA 上线、附录 D 首条升级等。

---

## 发布记录

发布历史**不在本文件维护**——`git log --oneline` 是真源，未来正式
发布后 [GitHub Releases](https://github.com/wilsonwangdev/frontend-engineer-handbook/releases)
会作为版本化记录。本文件只跟踪**未发生**的事 + 里程碑节点。

---

## 怎么用本文件

- **新会话**：从上到下读一遍。"当前焦点"或"下一步"里第一个未勾选项就是
  你最该接的任务。
- **领任务**：超过 30 分钟工作量前先和用户确认方向。
- **完成后**：
  - **里程碑级**（M0 / M1 / 大章节上线 / PWA 等）→ 加一行到"里程碑"段
  - **普通任务**（单 commit / 小迭代）→ 直接删条目；不必抄 commit hash
- **不要**：把本文件变成想到啥就堆啥的清单。条目要具体、要在 3 个月内
  有执行意图。再远的设想要么写进"已搁置"，要么删掉。
