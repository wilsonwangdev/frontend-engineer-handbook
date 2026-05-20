# SPEC 模板与标准

> 从 specs/README.md 拆出的一次性参考内容。写新 SPEC 时查阅，
> 日常不需要加载到 agent 上下文。

## 标准对标：MADR v4

本项目的 SPEC 即 **ADR**（Architecture Decision Record），对标
[MADR v4](https://adr.github.io/madr/)。

**约束方式**：人工 review + 模板示范，不引入自动化校验工具。

**为什么不用 spec-kit / OpenSpec**：那两个工具解决的是"从零开发新
feature 的工作流"，不是"决策记录"。未来若做大型 feature 开发再评估。

### 与原版 MADR 的本地化适配

| 维度      | MADR 原版                  | 本项目                                    | 原因                               |
| --------- | -------------------------- | ----------------------------------------- | ---------------------------------- |
| 文件位置  | `docs/adr/nnnn-title.md`   | `specs/nnnn-title/spec.md`                | 用子目录支持 notes.md / assets/    |
| 文件名    | `nnnn-title.md` kebab-case | 子目录名 kebab-case，主文件统一 `spec.md` | review 时只需对一种文件名          |
| 语言      | 英文                       | 中文为主（章节名保留英文以对齐）          | 与项目"中文为主"约定一致           |
| 历史 SPEC | —                          | 0001–0007 用 minimal 变体免重写           | MADR v4 显式支持 minimal/bare 变体 |

## spec.md 模板（MADR full）

```markdown
---
id: NNNN
title: 简短名词短语（同时反映问题与解法）
status: proposed | accepted | rejected | deprecated | superseded
date: YYYY-MM-DD
---

## Context and Problem Statement

这是个什么情况？哪些约束促使必须做决策？两到三段话讲清。

## Decision Drivers

- 关键考量 1
- 关键考量 2

## Considered Options

- 选项 A
- 选项 B

## Decision Outcome

选了哪个选项及简短理由。

## Consequences

- 好：…
- 不好：…
- 待还的债：…

## Pros and Cons of the Options

（优先用对照表压缩行数）

## Confirmation

如何验证这条决策被遵守？

## More Information

引用、相关 SPEC、外部资料。
```

**最简版**（MADR minimal，适用于决策直接、无需展开 trade-off 的情况）：

```markdown
---
id: NNNN
title: 简短标题
status: accepted
date: YYYY-MM-DD
---

## Context and Problem Statement

…

## Decision Outcome

…

## Consequences

…
```

## Review 检查清单

写完 SPEC 后、提交前自查：

- [ ] 路径符合 `specs/NNNN-<kebab-slug>/spec.md`
- [ ] frontmatter 含 `id` / `title` / `status` / `date` 四个必填字段
- [ ] `status` 取值在 MADR v4 枚举内
- [ ] `date` 是 `YYYY-MM-DD` 格式
- [ ] frontmatter 的 `id` 与目录前缀编号一致
- [ ] 新 SPEC（id ≥ 0008）含 MADR 必需章节：
      `Context and Problem Statement` / `Decision Outcome` / `Consequences`
- [ ] 在 specs/README.md 索引表加一行
- [ ] 行数 ≤ 200（[HARNESS-HEALTH](../docs/HARNESS-HEALTH.md) 阈值）

## 参考资料

- [MADR v4 模板](https://adr.github.io/madr/)
- [adr.github.io](https://adr.github.io/)
- [Michael Nygard 原版 ADR 模板](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [github/spec-kit](https://github.com/github/spec-kit)（未来评估）
- [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)（未来评估）
