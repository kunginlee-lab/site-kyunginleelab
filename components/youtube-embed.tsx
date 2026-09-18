"use client";

import Image from "next/image";
import { useState } from "react";
import { videoThumbnail } from "@/content/videos";

/**
 * 유튜브 영상 — 누르기 전에는 그림 한 장만 둔다.
 *
 * iframe 을 처음부터 심으면 페이지를 열 때마다 유튜브 스크립트가 따라 들어와
 * 1MB 가까이 받고 쿠키까지 남긴다. 대부분의 방문자는 영상을 누르지 않으므로,
 * 누른 사람에게만 iframe 을 만들어 준다. 주소도 쿠키를 남기지 않는 판본을 쓴다.
 */
export default function YouTubeEmbed({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-black">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`${title} 재생`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={videoThumbnail(id)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            unoptimized
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent/90 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            {/* 재생 삼각형 — 광학 중심을 맞추려 살짝 오른쪽으로 */}
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-white" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
