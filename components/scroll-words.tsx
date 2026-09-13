"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 스크롤에 따라 단어가 하나씩 밝아지는 문장 (Apple 스타일 텍스트 리빌).
 * 요소 상단이 뷰포트 85% 지점에 들어올 때 시작해 35% 지점에서 끝난다.
 */
export default function ScrollWords({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (reduced) {
        setProgress(1);
        return;
      }
      const top = el.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.35;
      setProgress(Math.min(1, Math.max(0, (start - top) / (start - end))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const t = Math.min(1, Math.max(0, progress * (words.length + 2) - i));
        return (
          <span
            key={`${w}-${i}`}
            style={{ opacity: 0.16 + 0.84 * t, transition: "opacity 140ms linear" }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}
