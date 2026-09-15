"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import FadeLink from "@/components/fade-link";
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
const PRODUCTS_PATH = "/products";

/** trailingSlash 설정 때문에 `/products` 로도 `/products/` 로도 올 수 있다. */
const isProductsPath = (pathname: string) =>
  pathname.replace(/\/+$/, "") === PRODUCTS_PATH;

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
 * - 마우스 환경에서만 열리고, 터치에선 그냥 제품 페이지로 가는 링크
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

  // 이미 제품 목록을 보고 있으면 메뉴를 열지 않는다 — 같은 목록으로 화면을 덮을 이유가 없다.
  const pathname = usePathname();
  const onProductsPage = isProductsPath(pathname);

  // 화면이 바뀌면 열려 있던 패널은 접는다. 렌더 중에 맞추므로 한 번 더 그리지 않는다.
  const [seenPath, setSeenPath] = useState(pathname);
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setOpen(false);
  }

  const show = useCallback(() => {
    if (onProductsPage) return;
    window.clearTimeout(timer.current);
    setOpen(true);
  }, [onProductsPage]);
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
                <FadeLink
                  href={`/${app.slug}/`}
                  onNavigate={close}
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
                </FadeLink>
              </li>
            ))}
          </ul>
          <FadeLink
            href="/products/"
            onNavigate={close}
            className="mt-6 inline-block text-sm font-semibold text-accent-ink transition-opacity hover:opacity-80"
          >
            모든 제품 보기 →
          </FadeLink>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <FadeLink
        href="/products/"
        className={className}
        onNavigate={close}
        aria-current={onProductsPage ? "page" : undefined}
        aria-haspopup={onProductsPage ? undefined : "true"}
        aria-expanded={onProductsPage ? undefined : open}
        onPointerEnter={onTriggerEnter}
        onPointerLeave={hide}
        onFocus={show}
        onBlur={onTriggerBlur}
      >
        제품
      </FadeLink>
      {mounted && !onProductsPage && createPortal(panel, document.body)}
    </>
  );
}
