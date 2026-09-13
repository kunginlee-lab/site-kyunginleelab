import Image from "next/image";
import Link from "next/link";
import { site, calosnap } from "@/site.config";

const principles = [
  {
    title: "프라이버시가 기본값",
    body: "민감한 기록은 서버가 아니라 사용자의 기기에 남깁니다. 계정에는 꼭 필요한 것만 담습니다.",
  },
  {
    title: "마찰 없는 경험",
    body: "검색하고, 고르고, 입력하는 과정을 줄입니다. 가장 좋은 기능은 손이 덜 가는 기능입니다.",
  },
  {
    title: "작고 단단하게",
    body: "기능을 늘리기보다 하나의 일을 확실하게 해내는 앱을 만듭니다. 매일 쓰는 도구는 가벼워야 합니다.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pb-20 pt-24 sm:pt-32">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent-ink">
          {site.nameEn} · Software Studio
        </p>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          일상을 가볍게 만드는
          <br />
          앱을 만듭니다.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          {site.name}은 매일 반복되는 일을 사진 한 장, 탭 한 번으로 줄이는
          모바일 앱을 만드는 스튜디오입니다.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/calosnap/"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85"
          >
            CaloSnap 보러가기
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent-ink"
          >
            문의하기
          </a>
        </div>
      </section>

      {/* Principles */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 py-16 sm:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title}>
              <h2 className="mb-2 font-bold">{p.title}</h2>
              <p className="text-sm leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Apps */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <h2 className="mb-8 text-2xl font-bold tracking-tight">
          만들고 있는 앱
        </h2>
        <Link
          href="/calosnap/"
          className="group flex flex-col gap-8 rounded-3xl border border-line bg-surface p-8 transition-shadow hover:shadow-lg sm:flex-row sm:items-center"
        >
          <Image
            src="/calosnap/icon.png"
            alt="CaloSnap 앱 아이콘"
            width={96}
            height={96}
            className="h-24 w-24 rounded-3xl border border-line"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-extrabold">{calosnap.name}</h3>
              <span className="rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold text-accent-ink">
                Google Play 출시 준비 중
              </span>
            </div>
            <p className="mt-1 font-medium text-muted">{calosnap.tagline}</p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
              {calosnap.short}
            </p>
          </div>
          <span className="text-sm font-semibold text-accent-ink transition-transform group-hover:translate-x-1">
            자세히 →
          </span>
        </Link>
      </section>

      {/* Contact */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            제안이나 문의가 있으신가요?
          </h2>
          <p className="mt-3 text-muted">
            협업·지원·기타 문의 모두 이메일로 받고 있습니다.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85"
          >
            {site.email}
          </a>
        </div>
      </section>
    </>
  );
}
