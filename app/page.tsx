import Image from "next/image";
import Link from "next/link";
import { site } from "@/site.config";
import { apps, appIcon, statusLabel } from "@/content/apps";
import { heroVideos } from "@/content/hero-videos";
import Reveal from "@/components/reveal";
import Parallax from "@/components/parallax";
import ScrollWords from "@/components/scroll-words";
import ScrollShowcase from "@/components/scroll-showcase";
import HeroVideoBackground from "@/components/hero-video";
import EmailLink from "@/components/email-link";

const [emailUser, emailDomain] = site.email.split("@");

const principles = [
  {
    no: "01",
    title: "모으지 않습니다",
    body: "수집하지 않는 데이터가 가장 안전한 데이터입니다. 당신의 기록은 당신의 기기에만 남습니다.",
  },
  {
    no: "02",
    title: "손이 덜 가게 만듭니다",
    body: "설명서가 필요 없어야 좋은 앱입니다. 열고, 한 번의 동작으로 끝나게 만듭니다.",
  },
  {
    no: "03",
    title: "하나를 제대로 합니다",
    body: "많은 기능보다 확실한 하나. 그래야 매일 쓰이고, 오래 쓰입니다.",
  },
];

// 홈에서 스크롤리텔링으로 보여줄 대표 앱 — 스크린샷과 기능 설명이 모두 있는 첫 앱
const featured = apps.find((a) => a.screens?.length && a.features?.length);

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero-bg relative overflow-hidden">
        <HeroVideoBackground videos={heroVideos} poster="/videos/hero-poster.jpg" />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-28 sm:pb-40 sm:pt-48">
          <Parallax>
            <Reveal>
              <p className="eyebrow mb-5">{site.nameEn} · Software Studio</p>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-6xl sm:leading-[1.12]">
                일상을 가볍게 만드는
                <br />
                소프트웨어를 만듭니다.
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#apps"
                  className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-bg transition-opacity hover:opacity-85"
                >
                  제품 보기
                </a>
                <EmailLink
                  user={emailUser}
                  domain={emailDomain}
                  className="glass rounded-full border border-line px-7 py-3.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent-ink"
                >
                  문의하기
                </EmailLink>
              </div>
            </Reveal>
          </Parallax>
        </div>
      </section>

      {/* Statement — 스크롤하면 단어가 차례로 밝아진다 */}
      <section className="band">
        <ScrollWords
          maxWidth="mx-auto max-w-5xl text-center"
          className="text-3xl font-extrabold leading-[1.5] tracking-tight sm:text-5xl sm:leading-[1.45] md:text-6xl md:leading-[1.4]"
          text="기능을 더하는 일보다 **덜어내는** 일에 시간을 씁니다. 설명이 필요 없고, 데이터를 요구하지 않고, 매일 **한** **번의** **동작으로** 끝나는 것. 그게 우리가 생각하는 **좋은** **소프트웨어입니다.**"
        />
      </section>

      {/* Principles */}
      <section id="about" className="scroll-mt-20">
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

      {/* Featured — 고정 폰 목업 스크롤리텔링 */}
      {featured && featured.screens && featured.features && (
        <section className="band">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
            <Reveal>
              <p className="eyebrow mb-3">Featured</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {featured.name} — {featured.tagline}
              </h2>
              <p className="mt-3 max-w-xl text-muted">{featured.short}</p>
            </Reveal>
            <div className="mt-12 sm:mt-16">
              <ScrollShowcase
                slug={featured.slug}
                screens={featured.screens}
                features={featured.features}
              />
            </div>
            <div className="mt-8 text-center sm:mt-12">
              <Link
                href={`/${featured.slug}/`}
                className="inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
              >
                {featured.name} 자세히 보기
              </Link>
            </div>
          </div>
        </section>
      )}

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

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 text-center sm:py-24">
        <Reveal>
          <p className="eyebrow mb-3">Contact</p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            제안이나 문의가 있으신가요?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            협업·지원·기타 문의 모두 이메일로 받고 있습니다. 확인 후 빠르게
            답변드리겠습니다.
          </p>
          <EmailLink
            user={emailUser}
            domain={emailDomain}
            showAddress
            className="mt-8 inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
          >
            이메일로 문의하기
          </EmailLink>
        </Reveal>
      </section>
    </>
  );
}
