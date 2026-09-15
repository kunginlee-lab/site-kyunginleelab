"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const CLASS = "nav-fading";
export const FADE_MS = 180;

/**
 * 화면 전환용 덮개. 이동할 때 배경색으로 잠깐 덮었다가 목적지에서 걷어낸다.
 * 스크롤 애니메이션 대신 쓰므로 페이지 안 이동(앵커)과 페이지 간 이동이 똑같이 보인다.
 */
export function fadeNavigate(action: () => void) {
  const root = document.documentElement;
  // 동작 줄이기 설정이면 덮개 없이 바로 이동한다
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    action();
    return;
  }
  root.classList.add(CLASS);
  window.setTimeout(() => {
    action();
    // 같은 페이지 안 이동이면 경로가 안 바뀌므로 여기서 직접 걷어낸다.
    // 페이지가 바뀌는 경우에는 PageFade 가 새 경로에서 걷어낸다.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => root.classList.remove(CLASS));
    });
  }, FADE_MS);
}

export default function PageFade() {
  const pathname = usePathname();

  // 새 페이지가 그려지면 덮개를 걷는다
  useEffect(() => {
    document.documentElement.classList.remove(CLASS);
  }, [pathname]);

  // 뒤로/앞으로 가기로 돌아왔을 때 덮개가 남지 않도록
  useEffect(() => {
    const clear = () => document.documentElement.classList.remove(CLASS);
    window.addEventListener("pageshow", clear);
    return () => window.removeEventListener("pageshow", clear);
  }, []);

  return <div id="page-fade" aria-hidden="true" />;
}
