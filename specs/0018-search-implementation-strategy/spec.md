---
id: 0018
title: 站内搜索实现策略
status: accepted
date: 2026-06-07
---

## Context and Problem Statement

站点内容已沉淀到需要搜索的规模（5 章 / 30 节 / 10 术语 / 2 Playground，
共 35 个可索引条目）。ROADMAP 早期规划使用 FlexSearch。

实施时需要回答：**自建轻量索引还是引入 FlexSearch（或其他搜索库）？**

约束：

- 内容体量小（35 条，预计 v1 完结 < 100 条）
- 中文为主，CJK 分词是核心挑战
- 项目定位"小而美"，不引入非必要依赖
- 搜索需要 ⌘K 命令面板 UI（该部分独立于搜索算法）

## Decision Drivers

- 搜索质量：中文 + 英文混合搜索效果
- 维护成本：依赖升级 / API 变动 / 体积
- 可控性：分词行为可调试、可定制
- 体积：客户端加载的 JS / 索引大小

## Considered Options

### A：自建（tokenize + score + sort ~ 80 行 TS）

CJK 逐字 + bigram 匹配，英文分词匹配，简单线性打分。

- 索引：build-time 脚本生成 JSON（24KB，gzip < 5KB）
- 搜索：客户端 fetch 索引后内存匹配

**好**：零依赖、完全可控、体积最小、分词逻辑透明
**不好**：无高级特性（模糊匹配、拼写纠错、相关性调优）；早期需要自己调参

### B：FlexSearch

成熟的 JS 全文搜索库，CJK 支持良好，支持序列化索引。

- 索引：需要构建 FlexSearch Index 并导出
- 搜索：客户端加载 FlexSearch 实例

**好**：开箱即用、相关性成熟、社区验证
**不好**：~12KB gzip 额外体积（比自建搜索逻辑 + 索引本身还大）；索引格式不透明；API 在 v0.7 → v0.8 有 breaking change

### C：Pagefind

静态站搜索工具，基于 Rust 编译的 WASM + 预建索引。

**好**：搜索质量极高、自动爬取页面、零客户端 JS 搜索逻辑
**不好**：引入 WASM 二进制（~60KB）、构建流程复杂、中文碎片索引需额外调参

## Decision Outcome

选 **A（自建）**。理由：

- 35 条索引，最复杂的搜索需求是"搜'动画'找到 §3.6"——不需要 TF-IDF
- 自建逻辑 80 行 TS，比 FlexSearch 更轻（12KB vs 0KB 新增依赖）
- CJK 分词本质就是 bigram——FlexSearch 的 CJK 模式也是同样做法，没有差异化优势
- 未来体量增长（≥ 200 条或搜索质量被投诉）时迁到 FlexSearch：索引格式兼容，UI 层零改动

### 触发重评估的条件

以下任一达到时，重新评估本决策：

1. 可索引条目 ≥ 200
2. 用户反馈搜索"找不到想要的内容" ≥ 3 次
3. 需要模糊匹配 / 拼写纠错

### 实施

见 commit `57e0927` feat(search): site search with command-k palette + build-time index。

## Consequences

**好**：

- 零额外依赖，与项目"小而美"定位一致
- 分词行为完全透明——搜索"动画"为什么命中 §3.6 可以逐行追踪
- 索引 JSON 可直接被未来其他消费方读取（如 AI 问答、相关内容推荐）

**不好**：

- 相关性调优需要手动迭代（当前用简单线性加权，对英文分词没有词干提取）
- 没有拼写容错——搜"donghua"找不到"动画"
- 条目数增长后线性扫描性能衰减（< 1000 条时感知不到）

## Pros and Cons of the Options

### A：自建

- 好：零依赖、完全可控、体积最小、CJK 分词透明可调
- 不好：无高级特性、需手动调相关性、无拼写容错

### B：FlexSearch

- 好：开箱即用、相关性成熟、社区验证
- 不好：体量过大（12KB vs 自建 0KB）；API 不稳定（v0.7→v0.8 有 break）

### C：Pagefind

- 好：搜索质量极高、自动索引
- 不好：WASM 二进制太重（~60KB）、中文碎片需额外配置、构建链路复杂

## Changelog

- 2026-06-07：初次落地。三选一选 A。包含触发重评估的三条定量条件。
