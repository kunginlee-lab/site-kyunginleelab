import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { apps, appIcon, statusLabel } from "@/content/apps";

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = apps.find((a) => a.slug === slug);
  if (!app) return {};
  return {
    title: `${app.name} — ${app.tagline}`,
    description: app.short,
    openGraph: {
      title: `${app.name} — ${app.tagline}`,
      description: app.short,
      ...(app.hasOgImage && { images: [`/apps/${app.slug}/og.png`] }),
    },
  };
}

export default async function AppPage({ params }: Props) {
  const { slug } = await params;
  const app = apps.find((a) => a.slug === slug);
  if (!app) notFound();

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 text-center sm:pt-28">
        <Image
          src={appIcon(app)}
          alt={`${app.name} 앱 아이콘`}
          width={112}
          height={112}
          className="mx-auto h-28 w-28 rounded-[28px] border border-line shadow-sm"
          priority
        />
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {app.name}
        </h1>
        <p className="mt-3 text-xl font-medium text-muted">{app.tagline}</p>
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
            <span className="inline-block rounded-full bg-accent-soft px-6 py-3 text-sm font-semibold text-accent-ink">
              {statusLabel[app.status]}
            </span>
          )}
        </div>
      </section>

      {/* Screenshots */}
      {app.screens && app.screens.length > 0 && (
        <section className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-5 py-14 sm:grid-cols-4">
            {app.screens.map((s) => (
              <Image
                key={s.file}
                src={`/apps/${app.slug}/${s.file}`}
                alt={s.alt}
                width={720}
                height={1600}
                className="w-full rounded-2xl border border-line"
              />
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      {app.features && app.features.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 sm:grid-cols-2">
            {app.features.map((f) => (
              <div key={f.title}>
                <h2 className="mb-2 text-lg font-bold">
                  <span className="mr-2">{f.emoji}</span>
                  {f.title}
                </h2>
                <p className="leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pricing */}
      {app.pricing && (
        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="mb-2 text-center text-2xl font-bold tracking-tight">
              {app.pricing.heading}
            </h2>
            {app.pricing.sub && (
              <p className="mb-10 text-center text-muted">{app.pricing.sub}</p>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              {app.pricing.plans.map((p) => (
                <div
                  key={p.name}
                  className={`rounded-3xl border p-7 ${
                    p.highlight
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-bg"
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Legal links */}
      {app.legalLinks && app.legalLinks.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-12 text-center text-sm">
          {app.legalLinks.map((l) => (
            <a
              key={l.url}
              href={l.url}
              className="mx-3 text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </section>
      )}
    </>
  );
}
