import Image from "next/image";
import Link from "next/link";
import { site } from "@/site.config";
import { apps, appIcon, statusLabel } from "@/content/apps";
import Reveal from "@/components/reveal";

const principles = [
  {
    no: "01",
    title: "프라이버시가 기본값",
    body: "민감한 기록은 서버가 아니라 사용자의 기기에 남깁니다. 계정에는 꼭 필요한 것만 담고, 수집하지 않는 것이 가장 안전한 보호라고 믿습니다.",
  },
  {
    no: "02",
    title: "마찰 없는 경험",
    body: "검색하고, 고르고, 입력하는 과정을 줄입니다. 매일 쓰는 도구라면 가장 좋은 기능은 손이 덜 가는 기능입니다.",
  },
  {
    no: "03",
    title: "작고 단단하게",
    body: "기능을 늘리기보다 하나의 일을 확실하게 해내는 제품을 만듭니다. 단순함은 오래 쓰이는 소프트웨어의 조건입니다.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero-bg">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-24 sm:pb-32 sm:pt-40">
          <Reveal>
            <p className="eyebrow mb-5">{site.nameEn} · Software Studio</p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-6xl sm:leading-[1.12]">
              일상을 가볍게 만드는
              <br />
              소프트웨어를 만듭니다.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {site.name}은 매일 반복되는 일을 사진 한 장, 탭 한 번으로 줄이는
              모바일 제품을 만드는 소프트웨어 스튜디오입니다.
            </p>
            <div className="mt-11 flex flex-wrap gap-3">
              <a
                href="#apps"
                className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-bg transition-opacity hover:opacity-85"
              >
                제품 보기
              </a>
              <a
                href={`mailto:${site.email}`}
                className="glass rounded-full border border-line px-7 py-3.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent-ink"
              >
                문의하기
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Principles */}
      <section
        id="about"
        className="scroll-mt-20 border-y border-line bg-surface/70"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow mb-3">Principles</p>
            <h2 className="max-w-lg text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
              제품을 만드는 방식
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-x-10 gap-y-10 sm:mt-12 sm:grid-cols-3 sm:gap-y-12">
            {principles.map((p, i) => (
              <Reveal key={p.no} delay={i * 110}>
                <div className="border-t border-line pt-6">
                  <p className="text-sm font-bold text-accent-ink">{p.no}</p>
                  <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Apps */}
      <section id="apps" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <Reveal>
            <p className="eyebrow mb-3">Products</p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              만들고 있는 제품
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-2">
            {apps.map((app, i) => (
              <Reveal key={app.slug} delay={i * 110}>
                <Link
                  href={`/${app.slug}/`}
                  className="glass group flex h-full flex-col gap-6 rounded-3xl border border-line p-7 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5 sm:p-8"
                >
                  <div className="flex items-center gap-5">
                    <Image
                      src={appIcon(app)}
                      alt={`${app.name} 앱 아이콘`}
                      width={72}
                      height={72}
                      className="h-16 w-16 rounded-2xl border border-line sm:h-18 sm:w-18"
                    />
                    <div>
                      <h3 className="text-xl font-extrabold tracking-tight">
                        {app.name}
                      </h3>
                      <p className="mt-0.5 text-sm font-medium text-muted">
                        {app.tagline}
                      </p>
                    </div>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-muted">
                    {app.short}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-ink">
                      {statusLabel[app.status]}
                    </span>
                    <span className="text-sm font-semibold text-accent-ink transition-transform group-hover:translate-x-1">
                      자세히 →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Studio band */}
      <section className="border-y border-line bg-surface/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:grid-cols-2 sm:gap-10 sm:py-24">
          <Reveal>
            <p className="eyebrow mb-3">Studio</p>
            <h2 className="text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
              작지만, 기준은 높게.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="leading-relaxed text-muted">
              {site.name}({site.nameEn})은 2026년 경기도 수원에서 시작한
              소프트웨어 스튜디오입니다. 규모를 키우는 것보다 제품 하나하나의
              완성도와 사용자의 신뢰를 쌓는 일을 우선합니다. 모든 제품은 설계
              단계에서부터 개인정보 최소 수집 원칙을 따릅니다.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-6xl px-6 py-16 text-center sm:py-24">
        <Reveal>
          <p className="eyebrow mb-3">Contact</p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            제안이나 문의가 있으신가요?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            협업·지원·기타 문의 모두 이메일로 받고 있습니다. 확인 후 빠르게
            답변드리겠습니다.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
          >
            {site.email}
          </a>
        </Reveal>
      </section>
    </>
  );
}
