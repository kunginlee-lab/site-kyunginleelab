import type { MetadataRoute } from "next";
import { site } from "@/site.config";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.tagline,
    short_name: site.nameEn,
    description: `${site.name}(${site.nameEn})은 프라이버시를 우선하는 모바일 앱을 만드는 소프트웨어 스튜디오입니다.`,
    start_url: "/",
    display: "browser",
    background_color: "#0d0f0c",
    theme_color: "#10684a",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
