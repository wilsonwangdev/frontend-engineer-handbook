---
id: 0008
title: 动手前的反射性检查清单（Karpathy 4 原则 + git 工作流）
status: accepted
date: 2026-05-20
---

## Context and Problem Statement

2026-05-20 同一会话内 agent 连续踩了两个低级坑，均违反 AGENTS.md 已有
规则：

1. **过早自写工具**：写 `scripts/validate-specs.mjs`（170 行）做 ADR
   校验，没先查业界。事后发现 `@lordcraymen/adr-toolkit` /
   `remark-lint-frontmatter-schema` / `log4brains` 等成熟方案早就存在。
   违反 AGENTS.md §7「借用优先」。完整事故见
   [journal/2026-05-20-premature-tool-self-implementation.md](../../journal/2026-05-20-premature-tool-self-implementation.md)。
2. **手写 Edit 做 git revert**：撤回上述自写工具时，没用 `git revert`
   而是手动 Edit 一系列文件做逆向修改。完整事故见
   [journal/2026-05-20-non-atomic-commit-and-manual-revert.md](../../journal/2026-05-20-non-atomic-commit-and-manual-revert.md)。

两次都是用户追问才暴露。根因相同——AGENTS.md 已有规则（§4 原子提交、
§7 借用优先）是**声明式**的（"应该 / 不应该"），但 agent 写代码时不会
主动触发这些声明。Karpathy 的 65 行
[CLAUDE.md](https://reposquare.com/91k-stars-the-claude-md-file-that-fixes-ai-coding/)
4 条原则之所以有效，是因为它们把规则降级为**反射性问句**——动手前必
回答的具体问题，而不是事后对照的检查表。

本项目当前缺一份这样的反射性清单。本 SPEC 立此清单，并明确实施层级
（哪些写进 AGENTS.md inline 触发、哪些留在 SPEC 详述）。

## Decision Drivers

- 必须能在 agent 写代码 / 改 git 历史前**主动触发**，不靠"事后自觉"
- 触发条件必须具体到能用是 / 否回答，不能是模糊的"重要时"
- 不能太宽（任何动手都触发会噪声爆炸），也不能太严（只在大事触发 = 没用）
- **不引入自动化校验**——上一轮刚因为这违反 §7，再加自动化就是
  二次踩坑
- 与 Karpathy 4 原则（Think / Simplicity / Surgical / Goal-driven）对齐
- 与 [SPEC-0007](../0007-open-source-asset-boundary/spec.md) 的两道
  fork / 客观性测试形成对照：SPEC-0007 管"该不该写"（内容边界），
  本 SPEC 管"该用什么方式做"（行为边界）

## Considered Options

- **A. 写自动化 pre-commit hook 强制问题清单**：每次 commit 前要求
  在 commit body 回答清单
- **B. 写 SPEC + AGENTS.md inline 反射段**：声明式 + 入口段提示
- **C. 只在 journal 留教训，靠 agent 自觉**
- **D. 引用社区 karpathy-guidelines skill，少量本地补充**

## Decision Outcome

选 **B + D 组合**：

1. 本 SPEC 详述完整反射性清单（4 项动手前问句 + 2 项 git 工作流
   守则），不进 AGENTS.md 全文
2. AGENTS.md 在 §4「原子提交」和 §7「借用优先」分别加一行指针引用
   本 SPEC——保持 AGENTS.md 紧凑
3. Karpathy 4 原则与社区 [karpathy-guidelines](https://explainx.ai/skills/unknown/karpathy-guidelines/karpathy-guidelines)
   作为延伸阅读放 More Information 段
4. 不引入自动化 pre-commit 检查

### 反射性清单（动手前必过）

#### R1. 写新工具脚本 / 加新依赖之前

口头回答（在用户可见对话中）：

1. **是产品定制还是工程化基建？**
   - 产品定制（如 TierBadge / SourceLink / Sidebar）→ 直接写
   - 工程化基建（lint / validate / build helper / 通用脚本）→ 下一步
2. **通用问题还是项目特化？**
   - 通用 → 必须先调研社区
   - 特化 → 评估能否用通用工具配置满足
3. **业界 2–3 个候选方案是什么？维护状态如何？**
   - 列出候选；停滞 / 零 star 不算"覆盖"
4. **自写的独特价值能独立成包吗？**
   - 不能 → 过度特化 → 改为社区方案 + 极小特化层

任意一项答不出 → **暂停写代码，先调研**。

#### R2. 回退已提交内容之前

口头回答：

1. **目标 commit 是否原子？**
   - 是 → `git revert <hash>` 一条命令完成
   - 否 → 用 `git revert -n <hash>` 暂存反向 diff，再 `git restore --staged`
     选择性挑出保留部分，最后 `git commit`
2. **手写 Edit 做逆向修改是反模式**——丢失可审计性，reviewer 无法
   用 `git show -m` 等工具验证完整性。**永远先想 git 工具**。
3. **commit body 必须留 audit trail**：写明用了 `git revert` /
   `git revert -n + git restore` / `git cherry-pick` 等具体命令

#### R3. 写 commit 之前

口头回答：

1. **subject 能用一句话概括吗？**
   - 出现顿号 / 分号 / "顺便" / "同时" 等连词 → concern 多了，**拆**
2. **subject ≤ 72 字符、小写、祈使语态？**（commitlint 会检查，但
   动手前就该想清楚）
3. **body 用中文，解释 why 而非 what？**

### Karpathy 4 原则映射（动手时持续对照）

| 原则                                       | 本项目对应触发点                                               |
| ------------------------------------------ | -------------------------------------------------------------- |
| **Think before coding** — 不假设、不藏疑虑 | R1 第 1-2 问；写不确定的代码前要先说"我假设了什么"             |
| **Simplicity first** — 最少代码            | R1 第 4 问；50 行能解决就别写 200                              |
| **Surgical changes** — 只动该动的          | R2 全部；R3 拆分判据；不改"看起来需要清理"但与本任务无关的代码 |
| **Goal-driven execution** — 给标准非指令   | 用户给的是目标时，先回放成功标准让用户确认；不要直接跳到实现   |

## Consequences

- **好**：把声明式规则降级为反射性问句，agent 在动手前会主动触发；
  违规率应当下降
- **好**：与 Karpathy 4 原则对齐，未来如果引入社区
  karpathy-guidelines skill 直接兼容
- **不好**：仍依赖 agent 自觉触发——本 SPEC 不引入自动化（避免二次
  过度自实现），所以严格说"反射性"还是要靠 agent 主动按程序检查
- **待还的债**：2026-08 季度复核时统计本 SPEC 落地后 R1-R3 违规
  次数，如果未明显下降，再评估是否需要更强约束（如 commit-msg hook
  里抓"validate / lint / check"等关键词 prompt 反射）

## Pros and Cons of the Options

### 选项 A：自动化 pre-commit hook 强制问题清单

- **好处**：强制级别最高，agent 不可能忘
- **代价**：刚刚因为"过度自实现"被批评，再加自动化就是二次踩坑；
  违反 §7「借用优先」（这种 hook 也是项目特化）；prompt-style hook
  对静默问答的鲁棒性差

### 选项 B：写 SPEC + AGENTS.md 加触发段（采纳）

- **好处**：声明式但更可触发；与 SPEC-0007 同模式（两道测试是声明式
  但具体）；零运维成本
- **代价**：仍依赖 agent 自觉读 SPEC + AGENTS.md 触发条件

### 选项 C：只在 journal 留教训

- **好处**：零成本；已经是本会话事实
- **代价**：**已被验证不可靠**——journal 是被动记忆，agent 在动手前
  不会主动扫 journal。同一会话踩两次同源坑就是证据

### 选项 D：用社区 karpathy-guidelines skill（部分采纳）

- **好处**：借用优先；社区维护；与 Karpathy 4 原则原版兼容
- **代价**：未必完美匹配本项目（少 git 工作流条目）；引入外部依赖

## Confirmation

如何确认本 SPEC 被遵守：

1. **journal 监控**：未来若再次违反 R1-R3，按
   [SPEC-0007](../0007-open-source-asset-boundary/spec.md) 节奏写
   journal。tag 用 `karpathy` 或 `reflexive-check-violated` 便于扫描
2. **季度复核（2026-08 首次）**：
   - 统计 journal 中违反 R1-R3 的次数
   - 与本 SPEC 落地前对比（基线：本会话 2 次同源违规）
   - 若违规率未明显下降 → 评估升级为自动化（届时再考虑选项 A）
3. **不引入自动化校验脚本** —— 本 SPEC 的有效性测试本身就是"声明式
   规则能否自我约束 agent"。如果加自动化，测的就不是这个

## More Information

### 引用

- Karpathy 4 条原则原版（[reposquare 详解](https://reposquare.com/91k-stars-the-claude-md-file-that-fixes-ai-coding/)、
  [Karpathy gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)）
- 社区扩展 skill [karpathy-guidelines](https://explainx.ai/skills/unknown/karpathy-guidelines/karpathy-guidelines)
  （未来若引入第三方 skill 优先评估这一版）

### 相关 SPEC

- [SPEC-0007](../0007-open-source-asset-boundary/spec.md) — 内容边界
  （管"该不该写"），与本 SPEC（管"该用什么方式做"）形成两道反射检查
- [SPEC-0006](../0006-agent-skills-system/spec.md) — agent skills 体系，
  Layer 2 项目内 skill 可考虑把 R1-R3 做成可调用 skill

### 触发本 SPEC 的事故

- [journal/2026-05-20-premature-tool-self-implementation.md](../../journal/2026-05-20-premature-tool-self-implementation.md)
- [journal/2026-05-20-non-atomic-commit-and-manual-revert.md](../../journal/2026-05-20-non-atomic-commit-and-manual-revert.md)
