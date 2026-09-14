"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroVideo } from "@/content/hero-videos";

const FADE_MS = 1600;

/** 데이터 절약 모드이거나 느린 회선이면 영상을 아예 받지 않는다 (포스터 이미지로 충분하다) */
function prefersNoVideo() {
  const c = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (!c) return false;
  return !!c.saveData || c.effectiveType === "2g" || c.effectiveType === "slow-2g";
}

/**
 * 여러 영상을 순서대로 재생하며 끝나기 직전에 다음 영상으로 크로스페이드한다.
 * 무음·자동재생·인라인 재생. 배경색으로 눌러 연하게 보이는 무음 영상이라
 * prefers-reduced-motion 과 무관하게 재생한다 (OS 애니메이션 끄기 설정이 흔해서).
 *
 * 로딩 순서: 처음에는 poster 만 그리고(preload="none"), 페이지가 다 뜬 뒤에야 영상을 받는다.
 * 영상 세 개가 2MB 가 넘어 첫 화면과 대역폭을 다투면 본문이 늦게 뜨기 때문이다.
 */
export default function HeroVideoBackground({
  videos,
  poster,
}: {
  videos: HeroVideo[];
  /** 영상 로드 전에 보여줄 정지 이미지 — 첫 화면이 비어 보이지 않게 */
  poster?: string;
}) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const switching = useRef(false);

  // 첫 화면 로딩이 끝난 뒤에 영상을 시작한다
  useEffect(() => {
    if (videos.length === 0 || prefersNoVideo()) return;
    let timer = 0;
    const begin = () => {
      timer = window.setTimeout(() => setStarted(true), 400);
    };
    if (document.readyState === "complete") begin();
    else {
      window.addEventListener("load", begin, { once: true });
      // load 이벤트가 늦어도 3초 뒤에는 시작
      timer = window.setTimeout(() => setStarted(true), 3000);
    }
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", begin);
    };
  }, [videos.length]);

  useEffect(() => {
    if (!started || videos.length === 0) return;
    const current = refs.current[active];
    if (!current) return;
    switching.current = false;
    // React 가 muted 를 속성으로 직렬화하지 않는 경우가 있어 재생 전에 직접 보장한다
    current.muted = true;
    current.defaultMuted = true;
    current.currentTime = 0;
    current.play().catch(() => {});

    if (videos.length === 1) {
      current.loop = true;
      return;
    }

    const goNext = () => {
      if (switching.current) return;
      switching.current = true;
      setActive((i) => (i + 1) % videos.length);
    };
    const onTime = () => {
      if (current.duration && current.duration - current.currentTime <= FADE_MS / 1000) {
        goNext();
      }
    };
    current.addEventListener("timeupdate", onTime);
    current.addEventListener("ended", goNext);
    current.addEventListener("error", goNext);
    return () => {
      current.removeEventListener("timeupdate", onTime);
      current.removeEventListener("ended", goNext);
      current.removeEventListener("error", goNext);
    };
  }, [active, started, videos.length]);

  // 활성 영상이 바뀌면 이전 영상은 페이드아웃이 끝난 뒤 멈춘다
  useEffect(() => {
    const t = setTimeout(() => {
      refs.current.forEach((v, i) => {
        if (v && i !== active) v.pause();
      });
    }, FADE_MS);
    return () => clearTimeout(t);
  }, [active]);

  if (videos.length === 0) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 포스터는 항상 깔아 둔다 — 영상을 받지 않는 회선에서도 배경이 비지 않는다 */}
      {poster && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
      {/* 영상은 시작 신호가 온 뒤에만 DOM 에 넣는다 — 그전에는 요청조차 나가지 않는다 */}
      {started &&
        videos.map((v, i) => (
          <video
            key={v.src}
            ref={(el) => {
              refs.current[i] = el;
            }}
            src={v.src}
            muted
            playsInline
            preload={i === 0 ? "auto" : "none"}
            className="absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out"
            style={{
              opacity: i === active ? 1 : 0,
              transitionDuration: `${FADE_MS}ms`,
            }}
          />
        ))}
      {/* 영상을 연하게 — 배경색으로 눌러 텍스트가 항상 읽히게 하고, 아래쪽은 영상이 끝나기 전에 완전히 배경색이 되게 한다 */}
      <div className="absolute inset-0 bg-bg/70" />
      <div className="hero-fade absolute inset-0" />
    </div>
  );
}
