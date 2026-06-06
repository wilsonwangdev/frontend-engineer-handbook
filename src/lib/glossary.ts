/**
 * 术语表（Glossary）数据加载层。
 *
 * 单一数据源：content/glossary/terms.yaml
 * 消费方：
 *   - <Term> MDX 组件（hover 卡片显示 brief）
 *   - /glossary 路由（索引页显示 long）
 *   - 未来站内搜索（FlexSearch 索引 brief + long）
 *
 * 设计取舍：
 *   - 用 yaml 而非 JSON——便于人工维护、long 字段写多行 markdown
 *   - 复用 gray-matter 内嵌的 js-yaml engine，不另加依赖
 *   - 用 zod 做 schema 校验——加新条目时 build 期就能拦截字段错
 *   - "use cache" 让结果作为静态产物缓存——构建期解析一次
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { load as parseYaml } from "js-yaml";
import { z } from "zod";

const TERMS_PATH = resolve(process.cwd(), "content/glossary/terms.yaml");

const termSchema = z.object({
  /** 中文译名（无中文译时省略，hover 卡片直接显示原词） */
  zh: z.string().optional(),
  /** 一句话定义（≤ 60 字）—— hover 卡片显示 */
  brief: z.string().min(1).max(120),
  /** 详细解释（多段、可含 markdown）—— /glossary#<key> 显示 */
  long: z.string().min(1),
  /** 关联术语 key（数组） */
  "see-also": z.array(z.string()).optional(),
  /** 一手参考链接（可选） */
  ref: z.url().optional(),
});

export type Term = z.infer<typeof termSchema> & { key: string };

const glossarySchema = z.record(z.string(), termSchema);

/**
 * 加载并校验整个术语表。
 * 返回按 key 字典序排序的 Term 数组——/glossary 索引页直接用。
 *
 * 完整性校验：see-also 引用的 key 必须存在于 terms 集合里——
 * 不存在的引用会被**静默过滤**，避免渲染出无效的死锚点链接
 * （之前的 bug：see-also: [xss, dompurify] 但这两个 key 没登记，
 * 渲染成 <a href="#xss"> 点击没反应）。
 * dev 环境会 console.warn 提示哪些引用被过滤掉了，方便补登记。
 */
export async function loadGlossary(): Promise<Term[]> {
  "use cache";
  const raw = await readFile(TERMS_PATH, "utf-8");
  const parsed = parseYaml(raw);
  const validated = glossarySchema.parse(parsed);
  const allKeys = new Set(Object.keys(validated));

  return Object.entries(validated)
    .map(([key, value]): Term => {
      const term = value as Term;
      term.key = key;

      // 过滤 see-also 里的无效引用（指向未登记的 key）
      if (term["see-also"]) {
        const valid: string[] = [];
        const invalid: string[] = [];
        for (const ref of term["see-also"]) {
          if (allKeys.has(ref)) {
            valid.push(ref);
          } else {
            invalid.push(ref);
          }
        }
        if (invalid.length > 0 && process.env.NODE_ENV === "development") {
          console.warn(
            `[glossary] term "${key}" 引用了未登记的 key: ${invalid.join(", ")}`,
            "—— 这些引用已从渲染中过滤；如需保留请在 terms.yaml 补登记",
          );
        }
        term["see-also"] = valid;
      }

      return term;
    })
    .toSorted((a, b) => a.key.localeCompare(b.key));
}

/**
 * 按 key 取单条术语（<Term> 组件用）。
 * 找不到时返回 null —— 调用方应当输出 fallback（原文 + warning）而非崩溃。
 */
export async function getTerm(key: string): Promise<Term | null> {
  const all = await loadGlossary();
  return all.find((t) => t.key === key) ?? null;
}
