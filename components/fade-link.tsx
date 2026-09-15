"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { fadeNavigate } from "@/components/page-fade";

type Props = Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "onClick"> & {
  href: string;
  /** 이동이 시작될 때 알려 준다 (메뉴 닫기 등) */
  onNavigate?: () => void;
};

/**
 * 내비게이션용 링크 — 스크롤을 굴리지 않고 화면을 잠깐 덮었다가 목적지에서 걷어낸다.
 * `/#about` 처럼 앵커가 붙은 주소도 다룬다: 같은 페이지면 즉시 그 위치로 옮기고, 다른 페이지면 이동 후 찾아간다.
 * 새 탭으로 열기(⌘·Ctrl·가운데 클릭)는 브라우저에 그대로 맡긴다.
 */
export default function FadeLink({ href, onNavigate, children, ...rest }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate?.();

    const [rawPath, hash] = href.split("#");
    const path = rawPath || pathname;
    const samePage = path === pathname;

    fadeNavigate(() => {
      if (hash && samePage) {
        const el = document.getElementById(hash);
        if (el) {
          // 스크롤 애니메이션 없이 한 번에 — 헤더 높이는 CSS scroll-padding-top 이 감안한다
          el.scrollIntoView({ behavior: "instant", block: "start" });
          window.history.replaceState(null, "", `#${hash}`);
        }
        return;
      }
      router.push(href);
      if (!hash) window.scrollTo({ top: 0, behavior: "instant" });
    });
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
