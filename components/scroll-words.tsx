"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 문장을 화면 중앙에 고정해 두고, 긴 섹션(scrollLength × 화면 높이)을 스크롤하는 동안
 * 단어가 차례로 떠오르며 선명해진다 (Apple 스타일). `**단어**` 로 감싼 단어는 켜질 때 액센트 색.
 * 투명도·위치만 바뀌므로 reduced-motion 과 무관하게 동작.
 */
export default function ScrollWords({
  text,
  className = "",
  scrollLength = 2.2,
}: {
  text: string;
  className?: string;
  /** 섹션 높이 — 화면 높이의 배수. 클수록 천천히 켜진다 */
  scrollLength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // rAF 없이 스크롤 이벤트에서 바로 계산 — 백그라운드 탭·저사양에서 rAF가 멈춰도 동작
    const update = () => {
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      // 섹션 상단이 화면 위로 올라간 만큼이 진행도. 85% 지점에서 완성되게 해 잠시 완성본을 보여준다
      const p = travel > 0 ? -r.top / travel / 0.85 : 1;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const words = text.split(" ").map((raw) => {
    const highlight = raw.startsWith("**") && raw.endsWith("**");
    return { word: highlight ? raw.slice(2, -2) : raw, highlight };
  });
  const n = words.length;

  return (
    <div ref={ref} style={{ height: `${scrollLength * 100}vh` }}>
      <div className="relative sticky top-0 flex min-h-screen items-center overflow-hidden">
        {/* 진행도에 따라 번지며 오른쪽으로 흐르는 글로우 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-1/4 inset-y-0"
          style={{
            background:
              "radial-gradient(52% 60% at 30% 50%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)",
            opacity: 0.25 + progress * 0.75,
            transform: `translateX(${progress * 28}%) scale(${0.8 + progress * 0.5})`,
            transition: "transform 200ms linear, opacity 200ms linear",
          }}
        />
        <div className="relative w-full">
          <p className={className}>
            {words.map(({ word, highlight }, i) => {
              const raw = Math.min(1, Math.max(0, progress * (n + 1) - i));
              const t = raw * raw * (3 - 2 * raw); // smoothstep
              return (
                <span key={`${word}-${i}`}>
                  <span
                    className="inline-block"
                    style={{
                      opacity: 0.1 + 0.9 * t,
                      transform: `translateY(${(1 - t) * 0.45}em)`,
                      filter: `blur(${(1 - t) * 7}px)`,
                      color:
                        highlight && t > 0.55 ? "var(--accent-ink)" : undefined,
                      transition:
                        "opacity 160ms linear, transform 260ms cubic-bezier(0.16,1,0.3,1), filter 260ms linear, color 400ms ease",
                    }}
                  >
                    {word}
                  </span>
                  {i < n - 1 ? " " : ""}
                </span>
              );
            })}
          </p>
          {/* 진행 라인 */}
          <div
            className="mt-10 h-px w-full max-w-xl origin-left bg-accent/60 sm:mt-14"
            style={{
              transform: `scaleX(${progress})`,
              transition: "transform 200ms linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}
