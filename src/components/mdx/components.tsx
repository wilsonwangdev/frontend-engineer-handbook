import type { ComponentPropsWithoutRef } from "react";
import { Callout } from "@/components/ui/callout";
import { TierBadge } from "@/components/handbook/tier-badge";
import { CopyButton } from "@/components/mdx/copy-button";

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  );
}

// rehype-pretty-code 把 ```lang ``` 渲染为
//   <figure data-rehype-pretty-code-figure>
//     [<figcaption data-rehype-pretty-code-title>...</figcaption>]
//     <pre><code>...</code></pre>
//   </figure>
// 我们只在它生成的 figure 上加复制按钮；普通 figure（图片说明等）不动。
function Figure({ children, ...props }: ComponentPropsWithoutRef<"figure">) {
  const isCodeFigure =
    (props as Record<string, unknown>)["data-rehype-pretty-code-figure"] !== undefined;
  if (!isCodeFigure) {
    return <figure {...props}>{children}</figure>;
  }
  return (
    <figure {...props} className="group relative">
      {children}
      <CopyButton />
    </figure>
  );
}

export const mdxComponents = {
  Callout,
  TierBadge,
  table: Table,
  figure: Figure,
};

export type MDXComponentMap = typeof mdxComponents;
