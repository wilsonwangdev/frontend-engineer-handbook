import { ImageResponse } from "next/og";
import { getDocBySlug } from "@/lib/content";

export const runtime = "edge";
export const alt = "前端工程师手册";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string[] } }) {
  const { slug } = params;
  const doc = await getDocBySlug(slug);
  if (!doc) return new Response("Not found", { status: 404 });

  const title = doc.frontmatter.title;
  const description = doc.frontmatter.description;

  const fontRes = await fetch(
    "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap",
  );
  const css = await fontRes.text();
  const fontUrl = css.match(/url\((https:\/\/[^)]+)\)/)?.[1];
  const fontData = fontUrl ? await fetch(fontUrl).then((r) => r.arrayBuffer()) : null;

  const element = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        fontFamily: fontData ? '"Noto Sans SC"' : "system-ui, sans-serif",
        padding: 80,
      }}
    >
      <p
        style={{
          fontSize: 22,
          fontWeight: 400,
          color: "#94a3b8",
          margin: 0,
        }}
      >
        第 {doc.frontmatter.chapter} 章 · 前端工程师手册
      </p>
      <h1
        style={{
          fontSize: 64,
          fontWeight: 700,
          margin: "20px 0 16px",
          color: "#f1f5f9",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: 28,
          color: "#94a3b8",
          margin: 0,
          maxWidth: 800,
          lineHeight: 1.4,
        }}
      >
        {description}
      </p>
    </div>
  );

  return new ImageResponse(element, {
    ...size,
    ...(fontData
      ? {
          fonts: [
            { name: "Noto Sans SC", data: fontData, weight: 400, style: "normal" },
            { name: "Noto Sans SC", data: fontData, weight: 700, style: "normal" },
          ],
        }
      : {}),
  });
}
