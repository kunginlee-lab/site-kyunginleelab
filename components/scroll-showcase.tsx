"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Screen = { file: string; alt: string };
type Feature = { emoji: string; title: string; body: string };

// 기본 기울기 — 마우스가 없어도 두께와 원근이 보이도록 (CSS 기본값과 동일)
const BASE_RX = 6;
const BASE_RY = -22;
// 스크롤로 단계가 바뀔 때마다 이만큼씩 더 돌아간다
const STEP_RY = 5;

/**
 * 고정된 폰 목업 옆으로 기능 설명이 스크롤되고, 설명이 바뀔 때마다 화면이 교체된다.
 * 기능 i 번째는 스크린샷 i 번째와 짝 — 스크린샷이 모자라면 순환.
 * 모바일(md 미만)에선 폰을 상단에 작게 고정하고 설명은 그 아래로 흐른다.
 * 입체감: 뒤판 두 겹(두께) + 원근 기울기 + 마우스를 따라 움직이는 하이라이트·그림자 + 부유 모션.
 * 기울기·하이라이트 위치는 CSS 변수(--rx --ry --mx --my --sx)로 넘긴다 (globals.css 참고).
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
  const phone = useRef<HTMLDivElement>(null);
  const tilt = useRef({ nx: 0, ny: 0, step: 0 });

  const paint = useCallback(() => {
    const el = phone.current;
    if (!el) return;
    const { nx, ny, step } = tilt.current;
    el.style.setProperty("--ry", `${BASE_RY + step + nx * 16}deg`);
    el.style.setProperty("--rx", `${BASE_RX - ny * 12}deg`);
    // 하이라이트는 빛(마우스) 쪽으로, 바닥 그림자는 반대쪽으로
    el.style.setProperty("--mx", `${35 + nx * 45}%`);
    el.style.setProperty("--my", `${25 + ny * 45}%`);
    el.style.setProperty("--sx", `${-nx * 48}`);
  }, []);

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

  // 단계가 바뀌면 폰이 조금씩 돌아간다
  useEffect(() => {
    tilt.current.step = (active - (features.length - 1) / 2) * STEP_RY;
    paint();
  }, [active, features.length, paint]);

  // 마우스를 따라 기울기·하이라이트·그림자 — 커서가 화면 어디에 있든 반응
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      tilt.current.nx = e.clientX / window.innerWidth - 0.5;
      tilt.current.ny = e.clientY / window.innerHeight - 0.5;
      paint();
    };
    const onLeave = () => {
      tilt.current.nx = 0;
      tilt.current.ny = 0;
      paint();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [paint]);

  const shotIndex = active % screens.length;

  return (
    <div className="md:grid md:grid-cols-2 md:gap-16">
      {/* 모바일: 상단 고정, 작게. 데스크톱: 화면 높이 컬럼 안에서 세로 중앙 */}
      <div className="phone-stage sticky top-[52px] z-10 flex justify-center bg-gradient-to-b from-bg via-bg/90 to-transparent pb-8 pt-4 md:top-0 md:h-dvh md:items-center md:bg-none md:p-0">
        <div className="phone-float w-[34vw] max-w-[150px] sm:max-w-[200px] md:w-full md:max-w-[310px]">
          <div ref={phone} className="phone-3d relative">
            {/* 바닥 그림자 */}
            <div className="phone-shadow" />
            {/* 프레임 (뒤판 두 겹은 ::before/::after) */}
            <div className="phone-body rounded-[30px] p-[4px] sm:rounded-[38px] sm:p-[5px] md:rounded-[52px] md:p-[8px]">
              <div className="phone-btn phone-btn--vol-up" />
              <div className="phone-btn phone-btn--vol-down" />
              <div className="phone-btn phone-btn--power" />
              {/* 화면 */}
              <div className="phone-screen relative aspect-[9/19.5] overflow-hidden rounded-[26px] bg-black sm:rounded-[33px] md:rounded-[44px]">
                {screens.map((s, i) => (
                  <Image
                    key={s.file}
                    src={`/apps/${slug}/${s.file}`}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 768px) 310px, 34vw"
                    priority={i === 0}
                    className="object-cover transition-opacity duration-700 ease-in-out"
                    style={{ opacity: i === shotIndex ? 1 : 0 }}
                  />
                ))}
                {/* 노치 */}
                <div className="absolute left-1/2 top-2 h-3 w-12 -translate-x-1/2 rounded-full bg-black/90 sm:h-5 sm:w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 위아래 21dvh 여백: 각 설명(58dvh 박스)의 중앙이 화면 중앙(=폰 중앙)에 올 수 있게 */}
      <div className="md:py-[21dvh]">
        {features.map((f, i) => (
          <div
            key={f.title}
            ref={(el) => {
              steps.current[i] = el;
            }}
            data-index={i}
            className="flex min-h-[45dvh] flex-col justify-center py-8 transition-opacity duration-500 md:min-h-[58dvh]"
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
