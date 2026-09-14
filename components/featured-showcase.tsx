"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import ScrollShowcase from "@/components/scroll-showcase";

export type FeaturedCandidate = {
  slug: string;
  name: string;
  tagline: string;
  short: string;
  screens: { file: string; alt: string }[];
  features: { emoji: string; title: string; body: string }[];
};

// 접속마다 하나를 뽑되, 한 번 뽑은 값은 그 페이지에서 유지 (useSyncExternalStore 스냅샷은 안정적이어야 한다)
let picked = -1;
const subscribe = () => () => {};
const pickOnClient = (n: number) => {
  if (picked < 0 || picked >= n) picked = Math.floor(Math.random() * n);
  return picked;
};

/**
 * 홈 Featured 섹션 — 쇼케이스 자산(screens·features)이 있는 앱 중 하나를 접속마다 랜덤으로 보여준다.
 * 서버 HTML 은 첫 앱으로 만들고(검색엔진·JS 없는 환경), 클라이언트에서 hydration 직후 뽑은 앱으로 바뀐다.
 * 후보가 하나뿐이면 그대로.
 */
export default function FeaturedShowcase({ candidates }: { candidates: FeaturedCandidate[] }) {
  const idx = useSyncExternalStore(
    subscribe,
    () => pickOnClient(candidates.length),
    () => 0,
  );
  const app = candidates[idx] ?? candidates[0];
  if (!app) return null;

  return (
    <section className="band">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div>
          <p className="eyebrow mb-3">Featured</p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {app.name} — {app.tagline}
          </h2>
          <p className="mt-3 max-w-xl text-muted">{app.short}</p>
        </div>
        <div className="mt-12 sm:mt-16">
          {/* key 로 앱이 바뀔 때 쇼케이스 상태(활성 단계)를 초기화 */}
          <ScrollShowcase
            key={app.slug}
            slug={app.slug}
            screens={app.screens}
            features={app.features}
          />
        </div>
        <div className="mt-8 text-center sm:mt-12">
          <Link
            href={`/${app.slug}/`}
            className="inline-block rounded-full bg-accent px-6 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            {app.name} 자세히 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
