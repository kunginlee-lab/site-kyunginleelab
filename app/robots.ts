import type { MetadataRoute } from "next";
import { site } from "@/site.config";

export const dynamic = "force-static";

// 구글(Googlebot)·네이버(Yeti)·빙(bingbot) 모두 전체 허용. 빌드 내부 파일만 제외.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/_next/"] },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Yeti", allow: "/" },
      { userAgent: "bingbot", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
