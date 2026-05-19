import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeScript } from "@/components/ui/theme-script";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://frontend-engineer-handbook.vercel.app"),
  title: {
    default: "AI 时代的前端工程师手册",
    template: "%s · 前端工程师手册",
  },
  description: "AI 时代的前端工程师手册。",
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
    title: "AI 时代的前端工程师手册",
    description: "AI 时代的前端工程师手册。",
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
