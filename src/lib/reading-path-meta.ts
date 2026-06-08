export type ReadingPathId = "beginner" | "intermediate" | "senior";

const PATH_META: Record<ReadingPathId, { tag: string; label: string; desc: string }> = {
  beginner: { tag: "A", label: "系统学习", desc: "从头到尾建立完整知识体系" },
  intermediate: { tag: "B", label: "按需查阅", desc: "查漏补缺，快速复习" },
  senior: { tag: "C", label: "实践驱动", desc: "聚焦 AI 不可替代的判断力" },
};

export function getPathMeta(id: ReadingPathId) {
  return PATH_META[id];
}
