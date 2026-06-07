import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  // turbopackFileSystemCacheForDev 会导致 HMR 跳过文件变更，
  // 开发体验比冷启动速度更重要——保持默认关闭
  images: {
    formats: ["image/avif", "image/webp"],
  },
  typedRoutes: true,
};

export default nextConfig;
