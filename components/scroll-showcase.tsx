"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Screen = { file: string; alt: string };
type Feature = { emoji: string; title: string; body: string };

/**
 * 고정된 폰 목업 옆으로 기능 설명이 스크롤되고, 설명이 바뀔 때마다 화면이 교체된다.
 * 기능 i 번째는 스크린샷 i 번째와 짝 — 스크린샷이 모자라면 순환.
 * 모바일(md 미만)에선 폰을 상단에 작게 고정하고 설명은 그 아래로 흐른다.
 */
export default function ScrollShowcase({
  slug,
  screens,
  features,
}: {
  slug: string;
  screens: Screen[];
  features: Feature[];
}) {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(Number((e.target as HTMLElement).dataset.index));
          }
        }
      },
      // 뷰포트 세로 중앙 띠를 지나는 단계를 활성으로 본다 (모바일은 폰이 위를 차지하므로 아래쪽 띠)
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 },
    );
    steps.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const shotIndex = active % screens.length;

  return (
    <div className="md:grid md:grid-cols-2 md:gap-16">
      {/* 모바일: 상단 고정, 작게. 데스크톱: 화면 높이 컬럼 안에서 세로 중앙 */}
      <div className="sticky top-16 z-10 flex justify-center bg-gradient-to-b from-bg via-bg/90 to-transparent pb-6 pt-4 md:top-0 md:h-dvh md:items-center md:bg-none md:p-0">
        <div className="relative aspect-[9/19.5] w-[34vw] max-w-[150px] overflow-hidden rounded-[24px] border-[4px] border-ink/85 bg-black shadow-2xl shadow-black/30 sm:max-w-[200px] sm:rounded-[32px] sm:border-[5px] md:w-full md:max-w-[280px] md:rounded-[44px] md:border-[6px]">
          {screens.map((s, i) => (
            <Image
              key={s.file}
              src={`/apps/${slug}/${s.file}`}
              alt={s.alt}
              fill
              sizes="(min-width: 768px) 280px, 34vw"
              priority={i === 0}
              className="object-cover transition-opacity duration-700 ease-in-out"
              style={{ opacity: i === shotIndex ? 1 : 0 }}
            />
          ))}
          {/* 노치 */}
          <div className="absolute left-1/2 top-2 h-3 w-12 -translate-x-1/2 rounded-full bg-black/90 sm:h-5 sm:w-20" />
        </div>
      </div>

      {/* 위아래 17.5dvh 여백: 각 설명(65dvh 박스)의 중앙이 화면 중앙(=폰 중앙)에 올 수 있게 */}
      <div className="md:py-[17.5dvh]">
        {features.map((f, i) => (
          <div
            key={f.title}
            ref={(el) => {
              steps.current[i] = el;
            }}
            data-index={i}
            className="flex min-h-[45dvh] flex-col justify-center py-8 transition-opacity duration-500 md:min-h-[65dvh]"
            style={{ opacity: i === active ? 1 : 0.3 }}
          >
            <p className="text-2xl sm:text-3xl">{f.emoji}</p>
            <h3 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              {f.title}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
