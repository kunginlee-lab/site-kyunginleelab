"use client";

import { useEffect, useRef } from "react";

const HIDE_AFTER_MS = 900;
const EDGE_PAD = 8; // 트랙 상하 여백(px)
const MIN_THUMB = 40;

/**
 * 스크롤할 때만 나타나는 얇은 오버레이 스크롤바 (macOS 느낌).
 * 마우스 환경에서만 동작하며 그때 네이티브 스크롤바는 globals.css 에서 숨긴다.
 * 터치 기기는 원래 자동으로 숨는 네이티브 스크롤바를 그대로 쓴다.
 */
export default function OverlayScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const doc = document.documentElement;
    let hideTimer = 0;
    let dragging = false;
    let dragStartY = 0;
    let dragStartScroll = 0;

    const metrics = () => {
      const vh = window.innerHeight;
      const sh = doc.scrollHeight;
      const trackH = vh - EDGE_PAD * 2;
      const thumbH = Math.max(MIN_THUMB, (vh / sh) * trackH);
      return { vh, sh, trackH, thumbH, maxTop: trackH - thumbH };
    };

    const layout = () => {
      const { vh, sh, thumbH, maxTop } = metrics();
      if (sh <= vh + 1) {
        track.classList.remove("is-visible");
        return false;
      }
      const y = (window.scrollY / (sh - vh)) * maxTop;
      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translateY(${y}px)`;
      return true;
    };

    const show = () => {
      if (!layout()) return;
      track.classList.add("is-visible");
      window.clearTimeout(hideTimer);
      if (!dragging) {
        hideTimer = window.setTimeout(
          () => track.classList.remove("is-visible"),
          HIDE_AFTER_MS,
        );
      }
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      dragStartY = e.clientY;
      dragStartScroll = window.scrollY;
      thumb.setPointerCapture(e.pointerId);
      window.clearTimeout(hideTimer);
      track.classList.add("is-visible");
      e.preventDefault();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const { vh, sh, maxTop } = metrics();
      const dy = e.clientY - dragStartY;
      window.scrollTo(0, dragStartScroll + (dy / maxTop) * (sh - vh));
    };
    const onUp = () => {
      dragging = false;
      show();
    };

    const ro = new ResizeObserver(() => layout());
    ro.observe(document.body);
    window.addEventListener("scroll", show, { passive: true });
    window.addEventListener("resize", layout);
    thumb.addEventListener("pointerdown", onDown);
    thumb.addEventListener("pointermove", onMove);
    thumb.addEventListener("pointerup", onUp);
    thumb.addEventListener("pointercancel", onUp);
    layout();

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", show);
      window.removeEventListener("resize", layout);
      thumb.removeEventListener("pointerdown", onDown);
      thumb.removeEventListener("pointermove", onMove);
      thumb.removeEventListener("pointerup", onUp);
      thumb.removeEventListener("pointercancel", onUp);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div ref={trackRef} aria-hidden="true" className="overlay-scrollbar">
      <div ref={thumbRef} className="overlay-scrollbar__thumb" />
    </div>
  );
}
