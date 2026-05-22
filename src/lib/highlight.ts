import { codeToHtml } from "shiki";

/**
 * 用 Shiki 在构建期高亮一段代码字符串，输出可直接 dangerouslySetInnerHTML
 * 的 HTML 字符串。
 *
 * 与本站 mdx 代码块（rehype-pretty-code）使用同一对主题 ID
 * （github-light / github-dark），渲染产物的 token span 也带
 * --shiki-light / --shiki-dark 双 CSS 变量；现有 globals.css 的
 * 双主题切换规则会**自动覆盖**到这里。
 *
 * 包到 "use cache" 让结果作为构建产物缓存——code 字符串稳定时
 * 命中即返回，零运行时高亮开销。
 */
export async function highlightCode(code: string, lang: string): Promise<string> {
  "use cache";
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
