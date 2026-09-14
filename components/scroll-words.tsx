"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * 문장을 화면 중앙에 고정해 두고, 긴 섹션(scrollLength × 화면 높이)을 스크롤하는 동안
 * 단어가 차례로 떠오르며 선명해진다 (Apple 스타일). `**단어**` 로 감싼 단어는 켜질 때 액센트 색.
 * 문장이 완성된 뒤 더 내리면 문장이 물러나고 outro(예: 회사 로고)가 떠오른다.
 * outro 는 섹션이 화면 밖으로 밀려나는 동안 녹아 사라진다 — 빈 화면이 스크롤되는 구간이 없다.
 *
 * 고정 구간 진행도 t (0 → 1):
 *   0    ~ 0.55  단어가 차례로 켜짐 (진행 바도 같이)
 *   0.55 ~ 0.6   완성된 문장을 잠시 보여줌
 *   0.6  ~ 0.7   문장 퇴장 · outro 등장 (0.62 ~ 0.76)
 *   0.76 ~ 1     outro 유지
 * 그 뒤 섹션이 위로 밀려나는 첫 절반 동안 outro 가 사라진다.
 *
 * - 스크롤 위치는 단어의 켜짐/꺼짐만 정하고, 실제 움직임은 CSS 트랜지션(.word)이 맡는다
 * - 서버 렌더·JS 없는 환경에서는 문장이 그대로 보인다 (마운트 후에만 효과 적용)
 * - 섹션 전체 폭을 차지하므로(글로우가 화면 밖에서 잘리도록) 바깥에서 컨테이너로 감싸지 말 것
 */
export default function ScrollWords({
  text,
  className = "",
  maxWidth = "max-w-5xl",
  scrollLength = 2.3,
  outro,
}: {
  text: string;
  className?: string;
  /** 문장·진행 바의 최대 폭 (Tailwind 클래스) */
  maxWidth?: string;
  /** 섹션 높이 — 화면 높이의 배수. 클수록 천천히 진행 */
  scrollLength?: number;
  /** 문장이 끝난 뒤 떠오를 내용 (없으면 문장 완성에서 끝) */
  outro?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [st, setSt] = useState<{ t: number; leave: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = r.height - vh;
      // 섹션 상단이 화면 70% 지점을 지날 때 시작 → 스티키가 끝나는 지점에서 1
      const start = vh * 0.7;
      const end = -travel;
      const t = start === end ? 1 : clamp((start - r.top) / (start - end));
      // 섹션 바닥이 화면 아래로 올라온 뒤 화면 절반을 지나는 동안 0 → 1
      const leave = clamp((vh - r.bottom) / (vh * 0.5));
      setSt({ t, leave });
    };
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
  const mounted = st !== null;
  const tt = st?.t ?? 0.58; // 마운트 전: 완성된 문장

  const phase = (a: number, b: number) => Math.min(1, Math.max(0, (tt - a) / (b - a)));
  const wordsEnd = outro ? 0.55 : 0.85;
  const pWords = phase(0, wordsEnd);
  const pExit = outro ? phase(0.6, 0.7) : 0; // 문장 퇴장
  const pIn = outro ? phase(0.62, 0.76) : 0; // outro 등장
  const pOut = outro ? (st?.leave ?? 0) : 0; // outro 퇴장 — 섹션이 밀려나는 동안
  const outroOpacity = pIn * (1 - pOut);

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
            opacity: 0.25 + pWords * 0.75 - pOut * 0.6,
            transform: `translateX(${(pWords - 0.5) * 16}%) scale(${0.8 + pWords * 0.5 + pIn * 0.15})`,
          }}
        />

        {/* 문장 */}
        <div
          className="relative mx-auto w-full max-w-6xl px-6 will-change-[transform,opacity]"
          style={{
            opacity: 1 - pExit,
            transform: `translateY(${-pExit * 40}px) scale(${1 - pExit * 0.04})`,
            pointerEvents: pExit > 0.5 ? "none" : undefined,
          }}
        >
          <div className={maxWidth}>
            <p className={className}>
              {words.map(({ word, highlight }, i) => {
                // 단어 i 는 진행도가 (i + 0.5) / (n + 1) 을 넘는 순간 켜진다 — 이후 움직임은 CSS 가 맡는다
                const lit = !mounted || pWords * (n + 1) - i > 0.5;
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
              style={{ transform: `scaleX(${pWords})` }}
            />
          </div>
        </div>

        {/* outro — 문장이 물러난 자리에 떠올랐다가, 섹션이 밀려날 때 녹아 사라진다 */}
        {outro && (
          <div
            aria-hidden={outroOpacity < 0.05}
            className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-[transform,opacity]"
            style={{
              opacity: outroOpacity,
              transform: `translateY(${(1 - pIn) * 28 - pOut * 24}px) scale(${0.92 + pIn * 0.08})`,
              filter: `blur(${(1 - pIn) * 8 + pOut * 6}px)`,
            }}
          >
            {outro}
          </div>
        )}
      </div>
    </div>
  );
}
