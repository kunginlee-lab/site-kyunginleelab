import Image from "next/image";
import Link from "next/link";
import { appIcon, statusLabel, type AppEntry } from "@/content/apps";

/** 제품 목록에 쓰는 앱 카드 — 아이콘·이름·한 줄 소개·설명·상태 */
export default function AppCard({ app }: { app: AppEntry }) {
  return (
    <Link
      href={`/${app.slug}/`}
      className="glass group flex h-full flex-col gap-5 rounded-3xl border border-line p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5"
    >
      <div className="flex items-center gap-4">
        <Image
          src={appIcon(app)}
          alt={`${app.name} 앱 아이콘`}
          width={56}
          height={56}
          className="h-14 w-14 rounded-2xl border border-line"
        />
        <div>
          <h3 className="text-lg font-extrabold tracking-tight">{app.name}</h3>
          <p className="mt-0.5 text-sm font-medium text-muted">{app.tagline}</p>
        </div>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-muted">{app.short}</p>
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-ink">
          {statusLabel[app.status]}
        </span>
        <span className="text-sm font-semibold text-accent-ink transition-transform group-hover:translate-x-1">
          자세히 →
        </span>
      </div>
    </Link>
  );
}
