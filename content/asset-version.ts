import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const cache = new Map<string, string>();

/**
 * `public/` 아래 파일의 **내용 해시**를 붙인 URL 을 돌려준다.
 *
 * 스크린샷·OG 이미지는 파일명이 고정(`screen-1.webp`)이라, 내용만 바꿔 배포하면
 * 브라우저가 예전 이미지를 계속 보여 준다(`_headers` 의 max-age=600 +
 * stale-while-revalidate=86400 때문에 최대 하루). 해시를 쿼리로 붙이면 내용이
 * 바뀐 순간 URL 이 달라져 즉시 반영된다.
 *
 * ⚠️ `node:fs` 를 쓰므로 **서버 컴포넌트에서만** 부를 것. 정적 빌드라 실행 시점은
 * 빌드 때 한 번이고, 결과 문자열만 클라이언트로 내려간다.
 */
export function versioned(publicPath: string): string {
  const cached = cache.get(publicPath);
  if (cached) return cached;

  let url = publicPath;
  try {
    const buf = readFileSync(join(process.cwd(), "public", publicPath));
    const hash = createHash("sha1").update(buf).digest("hex").slice(0, 8);
    url = `${publicPath}?v=${hash}`;
  } catch {
    // 파일이 없으면 그냥 원래 경로 — 빌드를 막을 일은 아니다.
  }
  cache.set(publicPath, url);
  return url;
}

/** 앱 스크린샷 목록을 해시 붙인 src 로 바꿔 준다. */
export function versionedScreens(
  slug: string,
  screens: { file: string; alt: string }[],
): { src: string; alt: string }[] {
  return screens.map((s) => ({
    src: versioned(`/apps/${slug}/${s.file}`),
    alt: s.alt,
  }));
}
