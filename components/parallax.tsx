"use client";

import { useEffect, useRef } from "react";

/** 페이지 최상단 요소용 — 스크롤하면 천천히 따라 내려가며 옅어진다. */
export default function Parallax({
  children,
  speed = 0.2,
  fadeAt = 640,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  fadeAt?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // OS "동작 줄이기" 설정과 무관하게 동작 — Windows 애니메이션 끄기가 흔해서
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      el.style.opacity = String(Math.max(0, 1 - y / fadeAt));
    };
    // 프레임당 한 번만
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed, fadeAt]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
