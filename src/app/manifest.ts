import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "前端工程师手册",
    short_name: "前端手册",
    description: "围绕 agent 协作的前端工程师中文精编手册",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a56db",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
