// filepath: next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',
  images: {
    unoptimized: true, // Cloudflare 免费版不支持 Next.js 的图片优化，建议开启此项
  },
};

export default nextConfig;