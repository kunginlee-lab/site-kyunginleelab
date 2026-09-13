"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 문장을 화면 중앙에 고정해 두고, 긴 섹션(scrollLength × 화면 높이)을 스크롤하는 동안
 * 단어가 차례로 밝아진다 (Apple 스타일). 투명도만 바뀌므로 reduced-motion 과 무관하게 동작.
 */
export default function ScrollWords({
  text,
  className = "",
  scrollLength = 1.8,
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

  const words = text.split(" ");
  return (
    <div ref={ref} style={{ height: `${scrollLength * 100}vh` }}>
      <div className="sticky top-0 flex min-h-screen items-center">
        <p className={className}>
          {words.map((w, i) => {
            const t = Math.min(1, Math.max(0, progress * (words.length + 1) - i));
            return (
              <span
                key={`${w}-${i}`}
                style={{ opacity: 0.14 + 0.86 * t, transition: "opacity 120ms linear" }}
              >
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
