import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/site.config";
import { apps, appIcon, statusLabel } from "@/content/apps";
import Reveal from "@/components/reveal";
import ScrollShowcase from "@/components/scroll-showcase";
import JsonLd, { breadcrumb } from "@/components/json-ld";

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

const legalPill =
  "glass rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-accent hover:text-accent-ink";

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = apps.find((a) => a.slug === slug);
  if (!app) return {};
  const title = `${app.name} — ${app.tagline}`;
  return {
    title,
    description: app.short,
    alternates: { canonical: `/${app.slug}/` },
    openGraph: {
      title,
      description: app.short,
      url: `/${app.slug}/`,
      ...(app.hasOgImage && { images: [`/apps/${app.slug}/og.png`] }),
    },
  };
}

export default async function AppPage({ params }: Props) {
  const { slug } = await params;
  const app = apps.find((a) => a.slug === slug);
  if (!app) notFound();

  const appLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.short,
    url: `${site.url}/${app.slug}/`,
    image: `${site.url}${appIcon(app)}`,
    applicationCategory: "HealthApplication",
    operatingSystem: "Android",
    ...(app.playUrl && { installUrl: app.playUrl }),
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    author: { "@type": "Organization", name: site.name, url: site.url },
  };

  const hasShowcase = !!(app.screens?.length && app.features?.length);

  return (
    <>
      <JsonLd data={appLd} />
      <JsonLd
        data={breadcrumb(site.url, [
          { name: "홈", path: "/" },
          { name: app.name, path: `/${app.slug}/` },
        ])}
      />

      {/* Hero */}
      <section className="hero-bg">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-16 text-center sm:pt-28">
          <Reveal>
            <Image
              src={appIcon(app)}
              alt={`${app.name} 앱 아이콘`}
              width={112}
              height={112}
              className="mx-auto h-24 w-24 rounded-[24px] border border-line shadow-sm sm:h-28 sm:w-28 sm:rounded-[28px]"
              priority
            />
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {app.name}
            </h1>
            <p className="mt-3 text-lg font-medium text-muted sm:text-xl">
              {app.tagline}
            </p>
            <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted">
              {app.short}
            </p>
            <div className="mt-8">
              {app.status === "live" && app.playUrl ? (
                <a
                  href={app.playUrl}
                  className="inline-block rounded-full bg-accent px-8 py-3.5 font-semibold text-white transition-opacity hover:opacity-85"
                >
                  Google Play에서 받기
                </a>
              ) : (
                <span className="glass inline-block rounded-full border border-line px-6 py-3 text-sm font-semibold text-accent-ink">
                  {statusLabel[app.status]}
                </span>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Showcase — 스크린샷 + 기능을 스크롤리텔링으로 */}
      {hasShowcase ? (
        <section className="band">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
            <ScrollShowcase
              slug={app.slug}
              screens={app.screens!}
              features={app.features!}
            />
          </div>
        </section>
      ) : (
        <>
          {app.screens && app.screens.length > 0 && (
            <section className="band">
              <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-5 py-14 sm:grid-cols-4">
                {app.screens.map((s, i) => (
                  <Reveal key={s.file} delay={i * 90}>
                    <Image
                      src={`/apps/${app.slug}/${s.file}`}
                      alt={s.alt}
                      width={720}
                      height={1600}
                      className="w-full rounded-2xl border border-line"
                    />
                  </Reveal>
                ))}
              </div>
            </section>
          )}
          {app.features && app.features.length > 0 && (
            <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
              <div className="grid gap-10 sm:grid-cols-2">
                {app.features.map((f, i) => (
                  <Reveal key={f.title} delay={(i % 2) * 110}>
                    <h2 className="mb-2 text-lg font-bold">
                      <span className="mr-2">{f.emoji}</span>
                      {f.title}
                    </h2>
                    <p className="leading-relaxed text-muted">{f.body}</p>
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Pricing */}
      {app.pricing && (
        <section>
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <Reveal>
              <h2 className="mb-2 text-center text-2xl font-bold tracking-tight">
                {app.pricing.heading}
              </h2>
              {app.pricing.sub && (
                <p className="mb-10 text-center text-muted">
                  {app.pricing.sub}
                </p>
              )}
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-3">
              {app.pricing.plans.map((p, i) => (
                <Reveal key={p.name} delay={i * 110} className="h-full">
                  <div
                    className={`h-full rounded-3xl border p-7 ${
                      p.highlight
                        ? "border-accent bg-accent-soft/80 backdrop-blur-sm"
                        : "glass border-line"
                    }`}
                  >
                    <h3 className="font-bold">{p.name}</h3>
                    <p className="mt-2 text-2xl font-extrabold tracking-tight">
                      {p.price}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {p.detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 법적 고지 — 사이트 안 문서는 같은 디자인의 페이지로, 외부 링크는 새 탭 없이 그대로 */}
      {(app.legal || (app.legalLinks && app.legalLinks.length > 0)) && (
        <section className="mx-auto max-w-6xl px-6 py-14 text-center">
          <p className="eyebrow mb-4">Legal</p>
          <div className="flex flex-wrap justify-center gap-3">
            {app.legal && (
              <>
                <Link href={`/${app.slug}/privacy/`} className={legalPill}>
                  개인정보처리방침
                </Link>
                <Link href={`/${app.slug}/delete-account/`} className={legalPill}>
                  계정 삭제 안내
                </Link>
              </>
            )}
            {app.legalLinks?.map((l) => (
              <a key={l.url} href={l.url} className={legalPill}>
                {l.label}
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
