import type { MetadataRoute } from "next";
import { site } from "@/site.config";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.tagline,
    short_name: site.nameEn,
    description: `${site.name}(${site.nameEn})은 프라이버시를 우선하는 모바일 앱을 만드는 소프트웨어 스튜디오입니다.`,
    start_url: "/",
    display: "standalone",
    // 사이트가 다크 한 벌이라 홈 화면에서 열었을 때 위아래 띠도 같은 먹빛으로
    background_color: "#0d0f0c",
    theme_color: "#0d0f0c",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
