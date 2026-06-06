/**
 * <Term> MDX 组件 —— server component wrapper。
 *
 * 用法（在 mdx 里）：
 *   <Term k="sanitizer">sanitizer</Term>      —— 显示文本与 key 一致
 *   <Term k="sanitizer">净化器</Term>          —— 显示中文，悬浮卡片仍指向 sanitizer
 *
 * 找不到 key 时降级——直接渲染原文，console.warn 便于开发期发现拼写错误。
 * 这是渐进增强：术语表条目还没建时不会破坏页面。
 *
 * 客户端交互（hover / focus / 浮窗）在 term-tooltip.tsx。
 */
import { getTerm } from "@/lib/glossary";
import { TermTooltip } from "./term-tooltip";

interface TermProps {
  /** 术语 key（对应 content/glossary/terms.yaml 的顶层 key） */
  k: string;
  /** 显示在原文位置的文本（默认与 k 相同） */
  children?: React.ReactNode;
}

export async function Term({ k, children }: TermProps) {
  const term = await getTerm(k);

  if (!term) {
    // 降级：术语未登记时直接渲染原文 + 日志
    if (process.env.NODE_ENV === "development") {
      console.warn(`<Term> key="${k}" 未在 content/glossary/terms.yaml 中登记`);
    }
    return <>{children ?? k}</>;
  }

  // children 必须能转为字符串作为可见文本（MDX 里通常就是字面文本）
  const label = typeof children === "string" ? children : k;

  return <TermTooltip termKey={k} label={label} zh={term.zh} brief={term.brief} />;
}
