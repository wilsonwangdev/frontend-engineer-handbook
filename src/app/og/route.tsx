import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "前端工程师手册";
  const chapter = searchParams.get("chapter") || "";
  const desc = searchParams.get("desc") || "AI 时代的中文精编手册";

  const fontRes = await fetch(
    "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap",
  );
  const css = await fontRes.text();
  const fontUrl = css.match(/url\((https:\/\/[^)]+)\)/)?.[1];
  const fontData = fontUrl ? await fetch(fontUrl).then((r) => r.arrayBuffer()) : null;

  const element = (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        fontFamily: fontData ? '"Noto Sans SC"' : "system-ui, sans-serif",
        padding: 80,
      }}
    >
      {chapter && (
        <p style={{ fontSize: 22, fontWeight: 400, color: "#94a3b8", margin: 0 }}>
          第 {chapter} 章 · 前端工程师手册
        </p>
      )}
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
      <p style={{ fontSize: 28, color: "#94a3b8", margin: 0, maxWidth: 800, lineHeight: 1.4 }}>
        {desc}
      </p>
    </div>
  );

  return new ImageResponse(element, {
    width: 1200,
    height: 630,
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
