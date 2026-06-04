---
id: 0002
title: 内容来源准入标准
status: accepted
date: 2026-05-14
---

## Context

读者反复抱怨中文前端学习路线"零散、矛盾、过期"。原因是大量内容来自个人博客、
营销号、二手译文，缺乏权威性与时效保证。手册若引用此类来源，会继承同样的
问题。

同时，本手册定位为**完全免费**——但"免费"需要精确定义：手册**内容本身**
免费、**必要学习路径**不花钱即可完成。对于希望深入特定主题的读者，可以
推荐少量经典书目作为**可选的深入参考**。

## Decision

### 一手来源白名单（默认可引）

引用任何外链都要落在以下类别之一：

1. **官方规范**：W3C、WHATWG、TC39、IETF（HTTP / URL / TLS 等 RFC）、Unicode。
2. **平台与浏览器厂商官方文档**：
   - [MDN Web Docs](https://developer.mozilla.org/zh-CN/)（Mozilla）
   - [web.dev](https://web.dev/)（Google）
   - [Chrome for Developers](https://developer.chrome.com/)
   - WebKit / Apple Developer、Microsoft Learn for Edge
3. **框架与运行时官方文档**：React、Vue、Svelte、Solid、Angular、Next.js、
   Nuxt、Remix、Vite、Node.js、Deno、Bun、TypeScript 等的官方站点。
4. **学术机构与开放课程**（必须免费）：
   - [Full Stack Open](https://fullstackopen.com/zh/)（赫尔辛基大学）
   - [The Odin Project](https://www.theodinproject.com/)
   - MIT OpenCourseWare、CS50 等开放课程
5. **开放协议组织白皮书**：OpenJS Foundation、Ecma International 等。
6. **开源的免费在线书籍**（同一手来源同等优先级）：
   - [You Don't Know JS (2nd Ed)](https://github.com/getify/You-Dont-Know-JS) — Kyle Simpson，CC 协议在线免费
   - [High Performance Browser Networking](https://hpbn.co/) — Ilya Grigorik，O'Reilly 免费在线版
   - [JavaScript.info](https://javascript.info/) — 完整免费教程
   - 其他符合"作者授权免费在线阅读"条件的书籍

### 灰名单（仅在没有一手替代时使用，且必须标注）

- 框架核心团队成员的个人博客（如 Dan Abramov 的 overreacted.io）——只在
  引用其作为核心维护者的署名观点时使用。
- GitHub 仓库的 README / RFC（仅当该仓库是事实标准时，例如 TC39 提案）。

### 经典书目白名单（仅可作为"可选深入参考"，不进主干）

为不破坏"必要学习路径完全免费"的承诺，经典书目仅在章节末尾的**"延伸阅读"**
里作为深入参考出现，**永不作为必读**。每条推荐需注明：

- 作者与出版信息
- 推荐场景（深入到哪一层才有必要读）
- 是否有免费在线替代（若有则优先链向后者）

预批准的候选清单（具体引用时仍需审核）：

| 书名                                | 用途               | 备注                        |
| ----------------------------------- | ------------------ | --------------------------- |
| WebKit 技术内幕（朱永盛）           | 浏览器渲染引擎深入 | 中文；目前无免费替代        |
| 高性能 JavaScript（Nicholas Zakas） | 性能优化基础       | 已部分被 web.dev 替代，可选 |
| HTTP 权威指南                       | 协议层深入         | 优先推荐 HPBN 免费在线版    |
| 你不知道的 JavaScript（第 2 版）    | 语言机制深入       | **优先链向作者免费在线版**  |
| CSS 揭秘（Lea Verou）               | CSS 进阶           | 仍无优质免费替代            |

未在此表的经典书目，写作时新增需走小改动 SPEC 流程或在 SPEC-0002 末尾追加。

### 黑名单（一律不收）

- 个人技术博客（除上文灰名单情形）
- 中文社区平台的用户投稿文章（掘金、CSDN、知乎专栏、博客园、简书等）
- AI 生成或拼接的"路线图汇总"
- 营销号、培训机构软文
- **付费课程或付费墙后的内容**（Frontend Masters、极客时间、慕课网付费课、
  付费视频课程等）——这是关键红线，违反手册"内容免费 + 必要路径免费完成"
  的定位

### 引用规范

- 每个外链给出：标题、来源机构、是否中文版可用。
- 优先链接到中文版本；中文版缺失或质量明显差时链接英文版并注明。
- 引用时检查链接活性，发现死链立即更新或移除。
- **精确引用，不要只引站点根目录**：当一段内容是被某篇具体文章
  / 某节文档启发或验证的，正文里的引用必须**直达那一页**（最好
  到带 anchor 的具体段），让读者一键到达"为什么这样写"的原始
  论述。站点根目录链接只放在节末「延伸阅读」作为"想系统读全套
  就来这"的入口。
  - 反例：正文写"参考 inclusive-components 系列" + 链向
    `https://inclusive-components.design/`
  - 正例：正文写"参考 Heydon Pickering 《A Modal Dialog》的
    focus management 段" + 链向
    `https://inclusive-components.design/a-modal-dialog/`
  - 触发本条最常见的两类内容：a) 作者亲自踩坑后查到答案的那篇
    一手文档；b) 设计模式 / 反例对照需要读者自己读完才能内化的
    深度文章。两者都属于"读者跟着读一遍才完成对照训练"的情形
    （[SPEC-0014](../0014-taste-cultivation-for-beginners/spec.md)
    触点 A）。
- **密度与核验时机**（2026-06-04 新增，详见
  [journal](../../journal/2026-06-04-link-density-and-write-time-verification.md)）：
  - **密度上限**：同一子节「一手参考」≤ 2 条；节末「延伸阅读」
    ≤ 8 条。同一观点不并列 3+ 条交叉引用——一手到位即止
  - **写时即核**（关键）：每加一条新外链当场用
    `curl -sL --max-time 8 -o /dev/null -w "%{http_code}\n" <url>`
    （或等价工具）验证返回 200 才落字。**不要积累到收尾**——
    一条死链在写时核验约 5 秒，累到收尾 + 全量扫 + 二次修复约
    5-10 倍代价
  - **优先稳定来源**：MDN / W3C TR / drafts.csswg.org / 框架官方
    站点 / 官方 repo README——URL 半衰期长。少用个人 blog /
    Medium / 短链 / 营销页（半年内迁移失效率高）
  - **取舍原则**：一条事实需要 3+ 引用才站得住 → 该事实大概率
    不该塞章节正文，降级到延伸阅读或删除
  - **收尾用范围扫**而非全量门禁：功能性 commit 改了几个文件时
    跑 `lychee <改动文件>`，不要用 `pnpm links` 全量门禁当增量
    检查工具——全量门禁存量已知不可达会噪声化新增问题

### 时效性要求

- 涉及框架版本号 / API / 浏览器特性时，注明最后核对日期。
- 每季度抽样复核，过期内容标记 `stale` 或更新。
- "面向 2026 年"这一定位（详见 [SPEC-0001](../0001-scope-and-audience/spec.md)）
  需在 2026 年底前评估是否升级到下一年度。

## Consequences

- 写作慢，但内容寿命长。
- 大量中文社区高人气文章不可引——必要时自己用一手资料重写要点。
- 手册必须自带"为什么"的论述，因为不能靠堆砌博客观点凑内容。
- 完全免费的承诺需要在 README 中显式声明，并通过人工评审拦截付费链接。
- 经典书目作为可选项存在，需要在章节模板里明确分区，防止读者误以为必读。

## Alternatives considered

- **完全禁止书籍**（严格遵守原"完全免费"）：读者深入特定主题时缺少高质量
  载体；放弃。
- **包含付费精品（如 Frontend Masters）**：质量确实高，但违反手册定位；
  放弃。
- **完全不引用外链**：读者无法深入；不可行。
- **允许中文社区文章但加质量评级**：评级标准难以稳定，沦为主观判断；放弃。

## Changelog

- 2026-05-14：初次落地。一手 / 灰 / 经典 / 黑名单四档 + 引用规范 +
  时效要求。
- 2026-05-23：引用规范段加「精确引用，不要只引站点根目录」一条。
  动因：写第 3 章 §3.2 时给读者引 inclusive-components.design
  系列，最初只引了站点根目录——读者要自己找文章 = 增加摩擦 + 失去
  跟读机会。改为正文里精确引到具体文章带 anchor，节末「延伸阅读」
  才放站点根目录。这是 SPEC-0014 触点 A「对照训练」在引用层的落地。
- 2026-06-04：引用规范段加「密度与核验时机」五项约束。动因：
  写第 3 章 §3.3 现代 CSS 特性（1247 行 / 35+ 外链），收尾跑
  `pnpm links` 全量核验时被打断——长文堆链接 + 写时不核 + 收尾
  全量扫三件叠加，让 agent 在链接核验环节代价非线性放大。完整
  事故链：[journal/2026-06-04-link-density-and-write-time-verification.md](../../journal/2026-06-04-link-density-and-write-time-verification.md)。
