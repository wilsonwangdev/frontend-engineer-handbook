---
date: 2026-05-19
tags: [agent-ready, harness, benchmark, agent-master-handbook]
---

## What happened

调研姊妹项目 [Agent Master Handbook](https://agent-master-handbook.vercel.app/zh/)
（同作者维护），用其"agent ready 实现维度"清单核对本项目当前 harness 状态。

## Findings

Agent Master Handbook 列举 5 个 agent-ready 维度：

| 维度                                                    | 本项目状态                                                 |
| ------------------------------------------------------- | ---------------------------------------------------------- |
| 1. AGENTS.md 作为规范入口                               | ✅ 128 行，含 entry points + SPEC 索引 + 命令表            |
| 2. 符号链接到 .cursorrules / .windsurfrules / CLAUDE.md | ✅ 4 个 symlink                                            |
| 3. 权限白名单 .claude/settings.json                     | ✅ 已配置 allowlist + deny list                            |
| 4. 知识三件套 journal / specs / skills                  | ✅ 全部就位 + 各自 README + 各自 SPEC                      |
| 5. 行数约束 / 上下文意识                                | ✅ AGENTS.md 121–128 行（曾因 gotchas 暴涨到 210，已瘦身） |

额外做到的（手册里未列）：

- **三层 agent 知识源**（SPEC-0006）：MCP / skills / inline gotchas 各司其职
- **Next.js DevTools MCP 接入**（`.mcp.json`）—— 框架级实时知识
- **测试策略与内容站匹配**（SPEC-0005）—— 反对具体文字断言
- **ROADMAP.md 与 AGENTS.md 解耦** —— 计划性内容不污染会话载入
- **GOTCHAS.md 独立** —— 边缘细节不进默认载入

## 双向验证关系

两个项目应建立双向反馈：

**Agent Master Handbook → 本项目**

- 提供 5 维度 agent ready 清单（已对照核对）
- 提供上下文工程概念、harness 工程化最佳实践
- 后续如果该手册更新（如新增"知识源分层"等概念），本项目应跟进评估

**本项目 → Agent Master Handbook**

- 作为活实践案例，发现清单覆盖不足处：
  - 未列：framework 官方 MCP 接入（Next.js DevTools MCP 是高 ROI 项）
  - 未列：三层知识源分层（MCP / skills / inline gotchas）
  - 未列：内容站 vs 应用站的测试策略差异
  - 未列：ROADMAP 与 AGENTS.md 解耦
  - 未列：GOTCHAS 文件从 AGENTS.md 独立的具体阈值
- 这些发现可作为外部 PR / issue 反馈到 agent-master-handbook 仓库
  （由作者本人完成，不属于本项目自动化流程）

## Lesson for next time

启动新 AI Native 项目时，可以直接套用 Agent Master Handbook 的 5 维度
清单作为最低限度检查表。如果时间充裕，再叠加本项目验证出的扩展维度
（framework MCP、三层知识源、分文件结构）。

两个项目可视为内容矩阵：

- Agent Master Handbook —— **怎么搭**这种 agent ready 环境
- 本手册 —— **搭好后**前端工程师在里面该学什么

按 [SPEC-0002](../specs/0002-content-source-admission/spec.md) 内容
来源准入策略，agent-master-handbook 不能作为本手册的**内容引用源**
（个人维护站点不在白名单内）。但作为**项目工程化参考资料**是允许
的——这层关系已写进
[SPEC-0006 Changelog](../specs/0006-agent-skills-system/spec.md)。

工程化参考 vs 内容引用是两件事，不要混淆。

---

## 修正注记（2026-05-20）

本条 journal 上方写了"双向验证关系——本项目作为活实践反过来验证
清单覆盖度、发现遗漏维度并反哺回去"等表述，**作者本人指出是过度
阐释**：

- 两个项目并非正式合作关系
- agent-master-handbook 没有承诺接受本项目的反馈
- "双向反哺 / 内容矩阵" 都是想当然的关系定性，给读者错误预期

更准确的客观表述：

- 本项目在自己的 harness 工程化中**实践**其中的 agent 约定（单向引用）
- 本手册涉及 agent 相关学习的章节，把它**列为参考资源之一**

修正后的关联描述见：

- [README.md](../README.md) "相关项目" 段
- [SPEC-0006](../specs/0006-agent-skills-system/spec.md) Changelog
  2026-05-20 条目

本注记不删除原文——journal 的价值在于保留"当时这么想 + 后来发现
过度"的完整轨迹。未来写关联描述时先过一遍此处。
