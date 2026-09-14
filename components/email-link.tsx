"use client";

import { useSyncExternalStore, type ReactNode } from "react";

// 서버에선 false, 클라이언트 마운트 후 true — hydration 불일치 없이 "마운트됨"을 판별
const subscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

/**
 * 이메일 주소를 HTML 에 평문으로 남기지 않는 링크.
 * 서버 HTML 에는 주소가 없고(수집 봇 회피), 마운트 후에 조합해 href 와 표시 텍스트를 채운다.
 * JS 가 없으면 children(대체 문구)만 보이고 클릭 시 홈의 문의 섹션으로 간다.
 */
export default function EmailLink({
  user,
  domain,
  className = "",
  children,
  showAddress = false,
}: {
  user: string;
  domain: string;
  className?: string;
  /** 표시 텍스트. showAddress 가 true 면 마운트 후 주소로 대체 */
  children?: ReactNode;
  showAddress?: boolean;
}) {
  const mounted = useMounted();
  const addr = mounted ? `${user}@${domain}` : null;

  return (
    <a href={addr ? `mailto:${addr}` : "/#contact"} className={className}>
      {showAddress && addr ? addr : (children ?? "이메일 문의")}
    </a>
  );
}
