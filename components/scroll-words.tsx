"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 문장을 화면 중앙에 고정해 두고, 긴 섹션(scrollLength × 화면 높이)을 스크롤하는 동안
 * 단어가 차례로 떠오르며 선명해진다 (Apple 스타일). `**단어**` 로 감싼 단어는 켜질 때 액센트 색.
 * - 스크롤 위치는 단어의 켜짐/꺼짐만 정하고, 실제 움직임은 CSS 트랜지션(.word)이 맡는다
 *   → 휠 한 칸마다 튀지 않고, 블러를 매 프레임 다시 계산하지 않아 스크롤이 매끄럽다
 * - 서버 렌더·JS 없는 환경에서는 문장이 그대로 보인다 (마운트 후에만 효과 적용)
 * - 섹션 전체 폭을 차지하므로(글로우가 화면 밖에서 잘리도록) 바깥에서 컨테이너로 감싸지 말 것
 */
export default function ScrollWords({
  text,
  className = "",
  maxWidth = "max-w-5xl",
  scrollLength = 1.8,
}: {
  text: string;
  className?: string;
  /** 문장·진행 바의 최대 폭 (Tailwind 클래스) */
  maxWidth?: string;
  /** 섹션 높이 — 화면 높이의 배수. 클수록 천천히 켜진다 */
  scrollLength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = r.height - vh;
      // 섹션 상단이 화면 70% 지점을 지날 때 시작 → 스티키 구간의 85% 에서 완성 (완성본을 잠시 보여준다)
      const start = vh * 0.7;
      const end = -travel * 0.85;
      const p = start === end ? 1 : (start - r.top) / (start - end);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    // 프레임당 한 번만 계산
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const words = text.split(" ").map((raw) => {
    const highlight = raw.startsWith("**") && raw.endsWith("**");
    return { word: highlight ? raw.slice(2, -2) : raw, highlight };
  });
  const n = words.length;
  const mounted = progress !== null;
  const pr = progress ?? 1;

  return (
    <div ref={ref} style={{ height: `${scrollLength * 100}svh` }}>
      {/* 화면 전체 폭 — 글로우가 넘치는 부분은 화면 밖에서만 잘린다 */}
      <div className="relative sticky top-0 flex min-h-svh items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-1/4 inset-y-0 will-change-[transform,opacity]"
          style={{
            background:
              "radial-gradient(40% 55% at 50% 50%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)",
            opacity: 0.25 + pr * 0.75,
            transform: `translateX(${(pr - 0.5) * 16}%) scale(${0.8 + pr * 0.5})`,
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-6">
          <div className={maxWidth}>
            <p className={className}>
              {words.map(({ word, highlight }, i) => {
                // 단어 i 는 진행도가 (i + 0.5) / (n + 1) 을 넘는 순간 켜진다 — 이후 움직임은 CSS 가 맡는다
                const lit = !mounted || pr * (n + 1) - i > 0.5;
                return (
                  <span key={`${word}-${i}`}>
                    <span
                      className={`word${lit ? " is-lit" : ""}${highlight ? " is-accent" : ""}`}
                    >
                      {word}
                    </span>
                    {i < n - 1 ? " " : ""}
                  </span>
                );
              })}
            </p>
            {/* 진행 바 — 문장과 같은 폭, 중앙에서 양쪽으로 끝까지 차오른다 */}
            <div
              className="mt-12 h-px w-full origin-center bg-accent/60 will-change-transform sm:mt-16"
              style={{ transform: `scaleX(${pr})` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
