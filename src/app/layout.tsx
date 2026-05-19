import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeScript } from "@/components/ui/theme-script";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://frontend-engineer-handbook.vercel.app"),
  title: {
    default: "前端工程师手册 · AI 时代的精编学习路线",
    template: "%s · 前端工程师手册",
  },
  description:
    "面向 2026 年的中文前端工程师精编手册——围绕 agent 协作的必要学习路线与核心知识点。小而美，不是大而全。",
  keywords: [
    "前端",
    "前端工程师",
    "学习路线",
    "Next.js",
    "React",
    "AI",
    "agent",
    "TypeScript",
    "手册",
  ],
  authors: [{ name: "Frontend Engineer Handbook" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: "前端工程师手册 · AI 时代的精编学习路线",
    description:
      "面向 2026 年的中文前端工程师精编手册——围绕 agent 协作的必要学习路线与核心知识点。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#262626" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
