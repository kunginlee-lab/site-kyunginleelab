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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      el.style.opacity = String(Math.max(0, 1 - y / fadeAt));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed, fadeAt]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
