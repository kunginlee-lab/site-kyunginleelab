import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 정적 사이트로 출력 — Vercel 외에 Firebase Hosting·Cloudflare Pages로도
  // 그대로 옮길 수 있도록 서버 기능 없이 유지한다.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
