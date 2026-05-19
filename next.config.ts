import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  typedRoutes: true,
};

export default nextConfig;
