import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "前端工程师手册——AI 时代中文精编手册";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        fontFamily: '"Noto Sans SC"',
      }}
    >
      {/* Visible in both rectangle and square crop */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: 560,
        }}
      >
        <p
          style={{
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: "0.15em",
            color: "#94a3b8",
            margin: 0,
          }}
        >
          AI 时代 · 中文精编手册
        </p>
        <h1
          style={{
            fontSize: 84,
            fontWeight: 700,
            margin: "20px 0 16px",
            letterSpacing: "-0.02em",
            color: "#f1f5f9",
            lineHeight: 1.1,
          }}
        >
          前端工程师手册
        </h1>
        <p
          style={{
            fontSize: 30,
            fontWeight: 400,
            color: "#94a3b8",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          导航 · 判断 · 速查 · 实践
        </p>
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
