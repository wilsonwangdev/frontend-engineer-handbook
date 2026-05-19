---
name: zod-frontmatter
description: 给 mdx frontmatter 设计 Zod schema 时的防御性 coerce 模式，避免 YAML 解析陷阱
owner: "@wilsonwangdev"
status: stable
---

## When to use

- 设计或修改 [src/lib/content-schema.ts](../../src/lib/content-schema.ts)
- 给一个新的 MDX 内容类型设计 frontmatter schema
- 添加新的 frontmatter 字段
- 解析任何 YAML 文件并要做 schema 校验

## When NOT to use

- 校验 JSON（JSON 没有 YAML 的隐式类型转换问题）
- 校验 API 请求体（同上）
- 单纯的运行时类型校验（不涉及 YAML 时不用走这里）

## Steps

### 1. 知道 YAML 会自动转换哪些值

写 frontmatter 时这些字面量会被 gray-matter / js-yaml 自动转换：

| YAML 字面量           | JS 解析结果 |
| --------------------- | ----------- |
| `2026-05-19`          | `Date` 对象 |
| `yes` / `no`          | `boolean`   |
| `true` / `false`      | `boolean`   |
| `1.5e10`              | `number`    |
| `null` / `~` / `Null` | `null`      |
| `on` / `off`          | `boolean`   |

任何这些类型的字段，schema 必须做 coerce。

### 2. 用 union + transform 做防御性 coerce

不要假设 frontmatter 的字面写法就是最终 JS 类型：

```ts
// ❌ 会在用户写 lastVerified: 2026-05-19 时炸
lastVerified: z.iso.date();

// ✅ 接受 string 或 Date，统一转回 ISO date string
const isoDateString = z
  .union([z.iso.date(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));

lastVerified: isoDateString;
```

类似的常用 coerce：

```ts
// 布尔（YAML 会把 yes/no/on/off 都转 boolean）
const flexibleBoolean = z
  .union([z.boolean(), z.literal("true"), z.literal("false")])
  .transform((v) => v === true || v === "true");
```

### 3. 测试覆盖原始输入与转换后输入

每个 coerce 字段必须有两个测试：

```ts
it("accepts the canonical string form", () => {
  expect(schema.parse({ ...valid, lastVerified: "2026-05-19" })).toMatchObject({
    lastVerified: "2026-05-19",
  });
});

it("coerces a Date object (from YAML parsing)", () => {
  expect(schema.parse({ ...valid, lastVerified: new Date("2026-05-19") })).toMatchObject({
    lastVerified: "2026-05-19",
  });
});
```

### 4. 默认严格，例外项明确

schema 顶层保持严格（`.strict()` 或不允许未知字段）。
新增字段时优先考虑 `.optional()`，除非真的必填——这样老内容不会因为新字段
缺失而 build 失败。

### 5. 不允许在内容里 escape

如果遇到"加引号就能绕过 coerce"的诱惑——**不要**这样做。
内容作者不应该理解 YAML 类型陷阱，工程师应该。schema 层做 coerce 是工程师
的责任。

## Inputs

- 新字段名称
- 新字段在 MDX frontmatter 中的字面写法示例
- 该字段在 TS 中的目标类型

## Outputs

- 修改后的 [src/lib/content-schema.ts](../../src/lib/content-schema.ts)
- 至少 2 个新增测试（canonical + coerced）
- 测试全部通过：`pnpm test`

## Verification

```bash
pnpm test                  # schema tests 全部通过
pnpm build                 # 已有 mdx 仍能 build（regression check）
```

## 相关引用

- [Zod docs - transform](https://zod.dev/?id=transform)
- [gray-matter 默认行为](https://github.com/jonschlinkert/gray-matter#why-gray-matter)
- 项目本地踩坑记录：[journal/2026-05-19-yaml-auto-date-coercion.md](../../journal/2026-05-19-yaml-auto-date-coercion.md)
