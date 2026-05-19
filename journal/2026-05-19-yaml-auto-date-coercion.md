---
date: 2026-05-19
tags: [zod, gray-matter, frontmatter, yaml, schema-validation]
---

## What happened

build 时 Zod schema 报错：

```
Error [ZodError]: [
  {
    "expected": "string",
    "code": "invalid_type",
    "path": ["lastVerified"],
    "message": "Invalid input: expected string, received Date"
  }
]
```

但 mdx frontmatter 里写的是 `lastVerified: 2026-05-19` —— **没有引号**，看起来
就是字符串。schema 里 `lastVerified: z.iso.date()` 是 string-based ISO 校验。

## Root cause

YAML 1.1 / 1.2 规范允许将 `YYYY-MM-DD` 形式的标量**自动识别为 Timestamp 类型**。
[gray-matter](https://www.npmjs.com/package/gray-matter) 默认行为遵循这条规则，
把 `2026-05-19`（没引号）解析为 JavaScript `Date` 对象。

要让它保持字符串，必须显式加引号：`lastVerified: "2026-05-19"`——但这违反
"内容作者应有最低心智负担"原则。

正确做法是在 schema 层做 coerce。

## Fix

在 [content-schema.ts](../src/lib/content-schema.ts) 用 union + transform：

```ts
const isoDateString = z
  .union([z.iso.date(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));

// ...
  lastVerified: isoDateString,
```

并在 test 里加回归用例：

```ts
it("coerces a Date object (from YAML parsing) to ISO date string", () => {
  const result = frontmatterSchema.parse({
    ...valid,
    lastVerified: new Date("2026-05-19T00:00:00.000Z"),
  });
  expect(result.lastVerified).toBe("2026-05-19");
});
```

## Lesson for next time

任何 YAML 解析器（gray-matter / js-yaml / front-matter）默认会把
`YYYY-MM-DD` 转为 Date。schema 设计时**永远不要假设 frontmatter 的值类型
等于源码里看起来的类型**。

常见自动转换：

| YAML 字面量      | JS 解析结果 |
| ---------------- | ----------- |
| `2026-05-19`     | `Date` 对象 |
| `yes` / `no`     | `boolean`   |
| `true` / `false` | `boolean`   |
| `1.5e10`         | `number`    |
| `null` / `~`     | `null`      |

最佳实践：所有 schema 字段做防御性 coerce，不要相信 YAML 类型推断。

本条**不进**附录 D —— 半衰期短（Zod 4.x + gray-matter 当前版本下的问题，
未来可能由 Zod 自身 coerce 解决），且对中文工程师没有额外门槛。留在 journal/ 即可。
