import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "前端工程师手册——AI 时代中文精编手册";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAGS = ["系统学习", "按需查阅", "实践驱动"];

export default async function Image() {
  const fontRes = await fetch(
    "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap",
  );
  const css = await fontRes.text();
  const fontUrl = css.match(/url\((https:\/\/[^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error("Failed to extract font URL");

  const fontData = await fetch(fontUrl).then((r) => r.arrayBuffer());

  const element = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        fontFamily: '"Noto Sans SC"',
        padding: 80,
      }}
    >
      <p
        style={{
          fontSize: 24,
          fontWeight: 400,
          letterSpacing: "0.2em",
          color: "#94a3b8",
          margin: 0,
        }}
      >
        AI 时代 · 中文精编手册
      </p>
      <h1
        style={{
          fontSize: 72,
          fontWeight: 700,
          margin: "24px 0",
          letterSpacing: "-0.02em",
          color: "#f1f5f9",
        }}
      >
        前端工程师手册
      </h1>
      <p
        style={{
          fontSize: 32,
          fontWeight: 400,
          color: "#94a3b8",
          margin: 0,
          maxWidth: 700,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        导航 + 判断 + 快速复习 + 实践
      </p>
      <div style={{ marginTop: 48, display: "flex", gap: 24 }}>
        {TAGS.map((tag, i) => (
          <span
            key={tag}
            style={{
              fontSize: 20,
              fontWeight: 400,
              padding: "6px 24px",
              borderRadius: 999,
              border: "1px solid #475569",
              color: i === 0 ? "#60a5fa" : "#94a3b8",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  return new ImageResponse(element, {
    ...size,
    fonts: [
      { name: "Noto Sans SC", data: fontData, weight: 400, style: "normal" },
      { name: "Noto Sans SC", data: fontData, weight: 700, style: "normal" },
    ],
  });
}
