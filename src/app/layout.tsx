import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeScript } from "@/components/ui/theme-script";
import { ReadingWidthScript } from "@/components/ui/reading-width-script";
import pkg from "../../package.json";
import { SITE_URL } from "@/lib/site-url";
import "@/styles/globals.css";

const SITE_TITLE = "前端工程师手册";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_TITLE} · ${pkg.description.replace(/。$/, "")}`,
    template: `%s · ${SITE_TITLE}`,
  },
  description: pkg.description,
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
  authors: [{ name: SITE_TITLE }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: `${SITE_TITLE} · ${pkg.description.replace(/。$/, "")}`,
    description: pkg.description,
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
        <ReadingWidthScript />
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){if(location.hostname==='localhost'||location.hostname==='127.0.0.1'){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()})})}else{navigator.serviceWorker.register('/sw.js')}}`,
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
