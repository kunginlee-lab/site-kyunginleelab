"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroVideo } from "@/content/hero-videos";

const FADE_MS = 1600;

/**
 * 여러 영상을 순서대로 재생하며 끝나기 직전에 다음 영상으로 크로스페이드한다.
 * 무음·자동재생·인라인 재생. 동작 축소 설정(prefers-reduced-motion)이면 첫 프레임만 보여준다.
 */
export default function HeroVideoBackground({ videos }: { videos: HeroVideo[] }) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  // 마크업은 이 값에 의존하지 않으므로 서버(false)/클라이언트 초기값이 달라도 hydration 문제 없음
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const switching = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced || videos.length === 0) return;
    const current = refs.current[active];
    if (!current) return;
    switching.current = false;
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
  }, [active, reduced, videos.length]);

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
      {videos.map((v, i) => (
        <video
          key={v.src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          src={v.src}
          muted
          playsInline
          preload={i === 0 ? "auto" : "metadata"}
          className="absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out"
          style={{
            opacity: i === active ? 1 : 0,
            transitionDuration: `${FADE_MS}ms`,
          }}
        />
      ))}
      {/* 영상을 연하게 — 배경색으로 눌러 텍스트가 항상 읽히게 한다 */}
      <div className="absolute inset-0 bg-bg/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-transparent to-bg" />
    </div>
  );
}
