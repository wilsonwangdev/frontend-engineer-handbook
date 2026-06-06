import type { JSX } from "react";
import {
  ButtonHoverDemo,
  CardEntranceDemo,
  ViewTransitionBasicDemo,
  ThemeToggleCircularRevealDemo,
} from "@/components/mdx/demos/animations";
import {
  AvatarStackDemo,
  NotificationBadgeDemo,
  SkeletonCardDemo,
} from "@/components/mdx/demos/layout-classics";

export interface DemoMeta {
  id: string;
  title: string;
  description: string;
  topic: "animations" | "layout";
  relatedChapter?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  Component: () => Promise<JSX.Element>;
}

export interface TopicMeta {
  id: string;
  title: string;
  description: string;
}

export const demoRegistry: DemoMeta[] = [
  {
    id: "button-hover",
    title: "按钮 Hover 过渡",
    description: "transition 基础：状态变化时自动插值",
    topic: "animations",
    relatedChapter: "/chapter-03/animations",
    difficulty: "beginner",
    Component: ButtonHoverDemo,
  },
  {
    id: "card-entrance",
    title: "卡片进入动画",
    description: "@keyframes + animation：多关键帧时间轴",
    topic: "animations",
    relatedChapter: "/chapter-03/animations",
    difficulty: "beginner",
    Component: CardEntranceDemo,
  },
  {
    id: "view-transition-basic",
    title: "View Transition 基础",
    description: "浏览器原生跨状态过渡（含降级处理）",
    topic: "animations",
    relatedChapter: "/chapter-03/animations",
    difficulty: "intermediate",
    Component: ViewTransitionBasicDemo,
  },
  {
    id: "theme-toggle-circular",
    title: "暗色切换圆形扩散",
    description: "View Transition + clip-path 实现的杀手级效果",
    topic: "animations",
    relatedChapter: "/chapter-03/animations",
    difficulty: "advanced",
    Component: ThemeToggleCircularRevealDemo,
  },
  {
    id: "avatar-stack",
    title: "协同头像叠放",
    description: "GitHub / Vercel / Figma 风格头像叠放",
    topic: "layout",
    relatedChapter: "/chapter-03/semantic-html",
    difficulty: "beginner",
    Component: AvatarStackDemo,
  },
  {
    id: "notification-badge",
    title: "通知徽章",
    description: "红点 + 数字角标 + 99+ 三种形态",
    topic: "layout",
    relatedChapter: "/chapter-03/modern-css",
    difficulty: "beginner",
    Component: NotificationBadgeDemo,
  },
  {
    id: "skeleton-card",
    title: "骨架屏",
    description: "渐变 shimmer 动画 + reduced-motion 适配",
    topic: "layout",
    relatedChapter: "/chapter-03/modern-css",
    difficulty: "intermediate",
    Component: SkeletonCardDemo,
  },
];

export const topics: TopicMeta[] = [
  {
    id: "animations",
    title: "动画",
    description: "transition / animation / View Transitions —— 4 个可调试 demo",
  },
  {
    id: "layout",
    title: "布局",
    description: "经典 CSS 布局案例 —— 3 个可调试 demo",
  },
];

export function getDemosByTopic(topic: string) {
  return demoRegistry.filter((d) => d.topic === topic);
}

export function getDemoCount(topic: string) {
  return demoRegistry.filter((d) => d.topic === topic).length;
}
