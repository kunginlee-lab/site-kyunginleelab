import type { MetadataRoute } from "next";
import { site } from "@/site.config";
import { apps, appIcon, type AppEntry } from "@/content/apps";
import { videos, videoThumbnail, videoUrl } from "@/content/videos";

export const dynamic = "force-static";

/**
 * 사이트맵. 각 항목에 그 페이지가 싣고 있는 그림 주소도 함께 적는다.
 *
 * 구글은 페이지를 긁으면서 본문의 <img> 를 보고 그림을 찾는데, 앱 스크린샷처럼
 * 한참 스크롤해야 나오거나 자바스크립트로 바뀌는 그림은 놓치기 쉽다. 사이트맵에
 * 주소를 직접 적어 두면 그런 그림도 이미지 검색 후보로 들어간다.
 * 그림이 무엇인지 설명하는 일은 페이지 안의 alt 가 맡는다 — 사이트맵은
 * "여기 이런 그림이 있다"까지만 알린다.
 */
const abs = (path: string) => `${site.url}${path}`;

/** 앱 페이지 한 장이 싣는 그림 — 아이콘, 스크린샷, 공유 카드 */
function appImages(app: AppEntry) {
  return [
    abs(appIcon(app)),
    ...(app.screens ?? []).map((s) => abs(`/apps/${app.slug}/${s.file}`)),
    ...(app.hasOgImage ? [abs(`/apps/${app.slug}/og.png`)] : []),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${site.url}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      images: [abs("/opengraph-image.png"), abs("/brand/icon-1024.png")],
    },
    {
      url: `${site.url}/products/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      images: apps.map((app) => abs(appIcon(app))),
    },
    {
      url: `${site.url}/about/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [abs("/brand/icon-1024.png")],
      // 소개 페이지에 실린 영상 — 구글은 동영상을 따로 수집한다
      videos: videos.map((v) => ({
        title: v.title,
        thumbnail_loc: videoThumbnail(v.id),
        description: v.description,
        content_loc: videoUrl(v.id),
        player_loc: `https://www.youtube-nocookie.com/embed/${v.id}`,
        publication_date: v.uploadDate,
      })),
    },
    ...apps.map((app) => ({
      url: `${site.url}/${app.slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: appImages(app),
    })),
    ...apps
      .filter((app) => app.legal)
      .flatMap((app) =>
        ["privacy", "delete-account"].map((doc) => ({
          url: `${site.url}/${app.slug}/${doc}/`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.4,
        })),
      ),
    { url: `${site.url}/privacy/`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
