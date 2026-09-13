"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Screen = { file: string; alt: string };
type Feature = { emoji: string; title: string; body: string };

/**
 * 고정된 폰 목업 옆으로 기능 설명이 스크롤되고, 설명이 바뀔 때마다 화면이 교체된다.
 * 기능 i 번째는 스크린샷 i 번째와 짝 — 스크린샷이 모자라면 순환.
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
      // 뷰포트 세로 중앙 10% 띠를 지나는 단계를 활성으로 본다
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    steps.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const shotIndex = active % screens.length;

  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 sm:gap-10 md:grid-cols-2 md:gap-16">
      <div className="sticky top-24 self-start md:top-28">
        <div className="relative mx-auto aspect-[9/19.5] w-full max-w-[150px] overflow-hidden rounded-[28px] border-[5px] border-ink/85 bg-black shadow-2xl shadow-black/30 sm:max-w-[220px] sm:rounded-[36px] sm:border-[6px] md:max-w-[280px] md:rounded-[44px]">
          {screens.map((s, i) => (
            <Image
              key={s.file}
              src={`/apps/${slug}/${s.file}`}
              alt={s.alt}
              fill
              sizes="(min-width: 768px) 280px, 40vw"
              priority={i === 0}
              className="object-cover transition-opacity duration-700 ease-in-out"
              style={{ opacity: i === shotIndex ? 1 : 0 }}
            />
          ))}
          {/* 노치 */}
          <div className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-full bg-black/90 sm:h-5 sm:w-20" />
        </div>
      </div>

      <div>
        {features.map((f, i) => (
          <div
            key={f.title}
            ref={(el) => {
              steps.current[i] = el;
            }}
            data-index={i}
            className="flex min-h-[55vh] flex-col justify-center py-8 transition-opacity duration-500 md:min-h-[65vh]"
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
