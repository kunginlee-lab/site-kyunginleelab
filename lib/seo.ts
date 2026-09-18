import type { Metadata } from "next";
import { site } from "@/site.config";

/** app/opengraph-image.png — 페이지가 자기 그림을 갖고 있지 않을 때 쓰는 기본 공유 카드 */
const DEFAULT_OG = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${site.nameEn} — ${site.tagline}`,
};

/**
 * 페이지 하나의 OpenGraph 묶음.
 *
 * Next 는 자식 페이지가 `openGraph` 를 선언하면 부모 layout 의 openGraph 를
 * **통째로 갈아치운다**. 그래서 페이지마다 title·description·url 만 적으면
 * og:image·og:site_name·og:locale·og:type 이 조용히 사라진다 — 카카오나
 * 네이버로 링크를 보냈을 때 썸네일 없는 허전한 카드가 되는 이유다.
 * 페이지에서는 이 함수를 불러 빠지는 항목 없이 채운다.
 *
 * [image] 는 그 페이지만의 그림(앱 OG 카드)이 있을 때만 넘긴다.
 */
export function openGraph({
  title,
  description,
  path,
  image,
}: {
  title?: string;
  description?: string;
  /** 사이트 루트 기준 경로, 예: "/products/" */
  path: string;
  image?: { url: string; alt: string };
}): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: site.nameEn,
    locale: "ko_KR",
    url: path,
    ...(title && { title }),
    ...(description && { description }),
    images: image
      ? [{ url: image.url, width: 1024, height: 500, alt: image.alt }]
      : [DEFAULT_OG],
  };
}
