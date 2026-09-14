"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";

export type MenuApp = {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  statusLabel: string;
};

const HEADER_H = 52;
const CLOSE_DELAY_MS = 160;

const subscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

/**
 * 헤더 "제품" 항목 — 마우스를 올리면 헤더 아래로 전체 폭 패널이 내려오고 앱 목록이 펼쳐진다 (애플 내비 스타일).
 * - 패널·어둠막은 body 로 포털해서 헤더의 backdrop-filter 영향 없이 뷰포트 기준으로 놓인다
 * - 마우스 환경에서만 열리고, 터치에선 그냥 /#apps 로 가는 링크
 * - Tab 으로 들어오면 열리고 Esc·스크롤·바깥 클릭으로 닫힌다
 */
export default function ProductsMenu({
  apps,
  className = "",
}: {
  apps: MenuApp[];
  className?: string;
}) {
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const timer = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, []);
  const close = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close);
    };
  }, [open, close]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onTriggerEnter = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse" || e.pointerType === "pen") show();
  };
  const onTriggerBlur = (e: FocusEvent) => {
    if (!panelRef.current?.contains(e.relatedTarget as Node | null)) hide();
  };
  const onPanelBlur = (e: FocusEvent) => {
    if (!panelRef.current?.contains(e.relatedTarget as Node | null)) hide();
  };

  const panel = (
    <div inert={!open}>
      {/* 나머지 화면을 어둡게 */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 bg-black/45 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ top: HEADER_H }}
        onPointerEnter={hide}
        onClick={close}
      />
      {/* 패널 */}
      <div
        ref={panelRef}
        className={`fixed inset-x-0 z-[45] bg-bg/92 backdrop-blur-xl transition-[opacity,transform] duration-300 ease-out ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        style={{ top: HEADER_H }}
        onPointerEnter={show}
        onPointerLeave={hide}
        onBlur={onPanelBlur}
      >
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
            Products
          </p>
          <ul className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <li key={app.slug}>
                <Link
                  href={`/${app.slug}/`}
                  onClick={close}
                  className="-mx-3 flex items-center gap-4 rounded-2xl px-3 py-2.5 transition-colors hover:bg-surface/80"
                >
                  <Image
                    src={app.icon}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-xl border border-line"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-base font-bold tracking-tight">
                      {app.name}
                      <span className="ml-2 align-middle text-[11px] font-semibold text-accent-ink">
                        {app.statusLabel}
                      </span>
                    </span>
                    <span className="block truncate text-sm text-muted">
                      {app.tagline}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#apps"
            onClick={close}
            className="mt-6 inline-block text-sm font-semibold text-accent-ink transition-opacity hover:opacity-80"
          >
            모든 제품 보기 →
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Link
        href="/#apps"
        className={className}
        aria-haspopup="true"
        aria-expanded={open}
        onPointerEnter={onTriggerEnter}
        onPointerLeave={hide}
        onFocus={show}
        onBlur={onTriggerBlur}
      >
        제품
      </Link>
      {mounted && createPortal(panel, document.body)}
    </>
  );
}
