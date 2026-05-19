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

## Lesson for next time

启动新 AI Native 项目时，可以直接套用 Agent Master Handbook 的 5 维度
清单作为最低限度检查表。如果时间充裕，再叠加本项目的三层知识源模型
（MCP > skills > gotchas）和分文件结构（AGENTS / ROADMAP / GOTCHAS）。

两个项目可视为内容矩阵：

- Agent Master Handbook —— **怎么搭**这种 agent ready 环境
- 本手册 —— **搭好后**前端工程师在里面该学什么

注意：按 [SPEC-0002](../specs/0002-content-source-admission/spec.md) 内容
来源准入策略，agent-master-handbook 不能作为本手册的**引用源**（个人维护
站点不在白名单内）。它仅作为**姊妹项目**在 README.md 出现，不进入正文
延伸阅读清单。
