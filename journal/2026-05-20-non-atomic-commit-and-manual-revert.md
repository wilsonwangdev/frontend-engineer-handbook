---
date: 2026-05-20
tags: [agent-behavior, git, atomicity, meta]
related: 2026-05-20-premature-tool-self-implementation.md
---

## What happened

撤回 `afa6f1f`（自写 validate-specs.mjs）时，我（agent）没有用
`git revert`，而是手动 Edit 一系列文件做"逆向修改"，然后另起
commit `afd2989`。

用户追问："为什么做不到用 git 回滚一次提交，而是通过 agent 进行类似
逆转的新改动？"

## Root cause

双重违规：

### 1. 原 commit 未原子化（违反 AGENTS.md §4）

`afa6f1f` 实际混合了两个独立 concern：

- **应保留**：`specs/README.md` 严格对标 MADR v4 的内容（status 枚举、
  双模板、本地化适配表）+ `ROADMAP.md` 加 spec-kit / OpenSpec 评估条目
- **应回退**：自写 `validate-specs.mjs` + test + lint-staged hook + CI
  step + `package.json` script + AGENTS.md 命令行

这两件事**当时应当拆成两个 commit**。一旦混合，`git revert` 就会把
保留部分一起反掉，导致 agent 觉得"git 不好用"，转向手写逆向。

### 2. Agent 未优先考虑 git 工具链

即使 commit 不原子，正确路径也是：

```bash
git revert -n afa6f1f                              # 暂存反向 diff，不立即提交
git restore --staged specs/README.md ROADMAP.md    # 把保留部分从反向 diff 里挑出
git diff specs/README.md                           # 验证 MADR 内容未被反向
git commit -m "revert: ..."
```

或 `git revert` + cherry-pick 保留部分。**我没考虑这条路径**，直接进入
手写 Edit 模式——理由跟"过早自实现"同源：agent 默认偏好"用代码（或
Edit）解决"，缺少"先想 git 工具能不能解决"的反射。

## 实际造成的代价

- **可审计性丢失**：git log 看到的是 `revert(specs)` commit，但内容是
  agent 手敲的逆向 diff，不是 git 自动生成的 inverse patch。reviewer 没法
  用 `git show -m` 等工具确认"是否真的完整逆向"。
- **风险靠事后测试兜底**：手写逆向可能漏改、可能误删保留部分。这次
  `pnpm run ci` 绿 + git 自检通过，但这只能证明"没破坏构建"，证明不了
  "过程严谨"。
- **乙级侥幸**：如果当时 CI 没覆盖某个边缘场景（比如 format 副产物在
  `content/chapter-00/index.mdx` 和 `scripts/smoke.mjs` 也被改了），
  手写 revert 就会出现"该回退的回退了，不该回退的也回退了"。

## Fix

### 1. 强化 AGENTS.md §4「原子提交」

在原"一个 concern 一个 commit"基础上加具体动作：

> **拆 commit 的判断**：写 commit message 时如果出现 "+ also / 同时 /
> 顺便" 等连词，说明应该拆。
>
> **回退已提交内容时**：**优先 `git revert <hash>`**，commit 不原子
> 时用 `git revert -n + git restore --staged` 挑出保留部分，**手写
> 逆向 Edit 是反模式**。

### 2. 强化 §5「同一 commit 内更新文档」与 §4 配合

§5 说"加命令 → 更新命令表"，但本次教训显示这条很容易把多个 concern
吸进同一 commit。明确：**配套文档更新是同 concern**（如新命令 + 命令
表新行），**对标决策 + 实现该决策的工具**是不同 concern（前者是
"决定怎么对标"，后者是"用什么工具对标"）。

## Lesson for next time

具体操作守则：

1. **写 commit message 前问自己**：能否用一句话概括 subject？如果需要
   用顿号、分号、连词，说明 concern 多了，拆。
2. **想要"撤回某个 commit 引入的某些改动"时，第一反应是 `git revert`
   或 `git revert -n + git restore`**，不是 `Edit` 工具。
3. **如果发现 git revert 会误伤保留部分**：先反思上一个 commit 是否
   不原子（多半是），然后用 `git revert -n` + 选择性 stage 解决。
4. **任何对 git 历史的改动**（revert / reset / cherry-pick / rebase）
   都要在 commit body 留 audit trail，说明用了哪条 git 命令。这样
   reviewer 可以追溯过程。

## 与其他 journal 的关系

本条与 [2026-05-20-premature-tool-self-implementation.md](2026-05-20-premature-tool-self-implementation.md)
是同一会话连续踩的两个坑，根因相同——**agent 偏好"动手做"而非"先用
现成工具"**：

- 上一条：偏好"写工具"而非"查社区工具"
- 这一条：偏好"手写 Edit"而非"用 git 工具"

两条都指向**强化"动手前的反射性检查"**这个元主题。是否升级为正式 SPEC
待用户决定。
