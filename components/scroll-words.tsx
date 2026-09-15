"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * 문장을 화면 중앙에 고정해 두고, 긴 섹션(scrollLength × 화면 높이)을 스크롤하는 동안
 * 단어가 차례로 떠오르며 선명해진다 (Apple 스타일). `**단어**` 로 감싼 단어는 켜질 때 액센트 색.
 * 문장이 완성된 뒤 더 내리면 문장이 물러나고 outro(예: 회사 로고)가 떠오르며,
 * 섹션이 화면 밖으로 밀려나는 동안 녹아 사라진다.
 *
 * 성능: 스크롤 중에는 React 를 다시 그리지 않는다.
 *  - 글로우·진행 바·문장·아웃트로처럼 매 프레임 변하는 값은 ref 로 DOM 에 직접 쓴다
 *  - 리렌더는 "켜진 단어 수" 가 바뀔 때만 (문장 전체에서 스무 번 남짓)
 * 예전에는 매 프레임 setState 를 해서 휴대폰에서 스크롤이 눈에 띄게 끊겼다.
 *
 * 고정 구간 진행도 t (0 → 1):
 *   0    ~ 0.55  단어가 차례로 켜짐
 *   0.55 ~ 0.6   완성된 문장을 잠시 보여줌
 *   0.6  ~ 0.76  문장 퇴장 · outro 등장
 *   0.76 ~ 1     outro 유지 (이후 섹션이 밀려나는 동안 사라짐)
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
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);

  const words = text.split(" ").map((raw) => {
    const highlight = raw.startsWith("**") && raw.endsWith("**");
    return { word: highlight ? raw.slice(2, -2) : raw, highlight };
  });
  const n = words.length;

  // -1 = 아직 재지 않음(서버 렌더·JS 없음) → 문장을 그대로 보여준다
  const [lit, setLit] = useState(-1);
  const litRef = useRef(-1);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = r.height - vh;
      // 섹션 상단이 화면 70% 지점을 지날 때 시작 → 스티키가 끝나는 지점에서 1
      const start = vh * 0.7;
      const end = -travel;
      const t = start === end ? 1 : clamp((start - r.top) / (start - end));
      // 섹션 바닥이 화면 위로 올라가는 동안 0 → 1 (아웃트로가 녹아 사라지는 구간)
      const leave = clamp((vh - r.bottom) / (vh * 0.5));

      const phase = (a: number, b: number) => clamp((t - a) / (b - a));
      const pWords = phase(0, outro ? 0.55 : 0.85);
      const pExit = outro ? phase(0.6, 0.7) : 0;
      const pIn = outro ? phase(0.62, 0.76) : 0;
      const pOut = outro ? leave : 0;

      const glow = glowRef.current;
      if (glow) {
        glow.style.opacity = String(0.25 + pWords * 0.75 - pOut * 0.6);
        glow.style.transform = `translateX(${(pWords - 0.5) * 16}%) scale(${0.8 + pWords * 0.5 + pIn * 0.15})`;
      }
      const textEl = textRef.current;
      if (textEl) {
        textEl.style.opacity = String(1 - pExit);
        textEl.style.transform = `translateY(${-pExit * 40}px) scale(${1 - pExit * 0.04})`;
        textEl.style.pointerEvents = pExit > 0.5 ? "none" : "";
      }
      const bar = barRef.current;
      if (bar) bar.style.transform = `scaleX(${pWords})`;
      const outroEl = outroRef.current;
      if (outroEl) {
        const opacity = pIn * (1 - pOut);
        outroEl.style.opacity = String(opacity);
        outroEl.style.transform = `translateY(${(1 - pIn) * 28 - pOut * 24}px) scale(${0.92 + pIn * 0.08})`;
        outroEl.style.filter = `blur(${(1 - pIn) * 8 + pOut * 6}px)`;
        outroEl.setAttribute("aria-hidden", opacity < 0.05 ? "true" : "false");
      }

      // 켜진 단어 수가 바뀔 때만 다시 그린다
      const count = Math.min(n, Math.max(0, Math.ceil(pWords * (n + 1) - 0.5)));
      if (count !== litRef.current) {
        litRef.current = count;
        setLit(count);
      }
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
  }, [n, outro]);

  return (
    <div ref={rootRef} style={{ height: `${scrollLength * 100}svh` }}>
      {/* 화면 전체 폭 — 글로우가 넘치는 부분은 화면 밖에서만 잘린다 */}
      <div className="relative sticky top-0 flex min-h-svh items-center overflow-hidden">
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-1/4 inset-y-0 will-change-[transform,opacity]"
          style={{
            background:
              "radial-gradient(40% 55% at 50% 50%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)",
            opacity: 1,
          }}
        />

        {/* 문장 */}
        <div
          ref={textRef}
          className="relative mx-auto w-full max-w-6xl px-6 will-change-[transform,opacity]"
        >
          <div className={maxWidth}>
            <p className={className}>
              {words.map(({ word, highlight }, i) => (
                <span key={`${word}-${i}`}>
                  <span
                    className={`word${lit < 0 || i < lit ? " is-lit" : ""}${
                      highlight ? " is-accent" : ""
                    }`}
                  >
                    {word}
                  </span>
                  {i < n - 1 ? " " : ""}
                </span>
              ))}
            </p>
            {/* 진행 바 — 문장과 같은 폭, 중앙에서 양쪽으로 끝까지 차오른다 */}
            <div
              ref={barRef}
              className="mt-12 h-px w-full origin-center bg-accent/60 will-change-transform sm:mt-16"
            />
          </div>
        </div>

        {/* outro — 문장이 물러난 자리에 떠올랐다가, 섹션이 밀려날 때 녹아 사라진다 */}
        {outro && (
          <div
            ref={outroRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-[transform,opacity]"
            style={{ opacity: 0 }}
          >
            {outro}
          </div>
        )}
      </div>
    </div>
  );
}
