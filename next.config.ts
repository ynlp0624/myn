import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify 部署不要用 standalone，@netlify/plugin-nextjs 会接管输出
  // output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // 显式告诉 Next.js 用 src 目录，避免某些环境扫描不到 app
  // （Next.js 默认会自动检测 src/app，这里只是保险）
};

export default nextConfig;
