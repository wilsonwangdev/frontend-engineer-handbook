export interface PlannedChapter {
  id: string;
  title: string;
  type: "chapter" | "appendix";
  published: boolean;
  url?: string;
  /** 部分发布：整章 frame 上线 + 部分子节上线，但子节不全 */
  partial?: { released: number; total: number };
}

export const chapterPlan: PlannedChapter[] = [
  { id: "00", title: "如何使用本手册", type: "chapter", published: true, url: "/chapter-00" },
  {
    id: "01",
    title: "AI 时代前端工程师的能力地图",
    type: "chapter",
    published: true,
    url: "/chapter-01",
  },
  { id: "02", title: "Web 平台基石", type: "chapter", published: true, url: "/chapter-02" },
  {
    id: "03",
    title: "HTML / CSS / 现代布局",
    type: "chapter",
    published: true,
    url: "/chapter-03",
  },
  {
    id: "04",
    title: "JavaScript 与 TypeScript",
    type: "chapter",
    published: true,
    url: "/chapter-04",
  },
  { id: "05", title: "React 与 Next.js", type: "chapter", published: false },
  { id: "06", title: "工程化与构建", type: "chapter", published: false },
  { id: "07", title: "质量与交付", type: "chapter", published: false },
  { id: "08", title: "现代前沿话题", type: "chapter", published: false },
  { id: "09", title: "AI 原生工作流", type: "chapter", published: false },
  { id: "10", title: "动手实践", type: "chapter", published: false },
  { id: "A", title: "框架对照（Vue / Svelte / Solid）", type: "appendix", published: false },
  {
    id: "B",
    title: "精选一手资源 + 经典书目",
    type: "appendix",
    published: true,
    url: "/resources",
  },
  { id: "C", title: "中英术语对照表", type: "appendix", published: true, url: "/glossary" },
  { id: "D", title: "实战避坑录", type: "appendix", published: false },
];

/** 完整发布的章数（partial 不计；它"在路上"但不是"完成") */
export function getPublishedCount() {
  return chapterPlan.filter((c) => c.type === "chapter" && c.published && !c.partial).length;
}

export function getPartialCount() {
  return chapterPlan.filter((c) => c.type === "chapter" && c.partial).length;
}

export function getChapterCount() {
  return chapterPlan.filter((c) => c.type === "chapter").length;
}

export function getAppendixCount() {
  return chapterPlan.filter((c) => c.type === "appendix").length;
}
