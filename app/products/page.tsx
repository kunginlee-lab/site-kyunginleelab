import type { Metadata } from "next";
import { site } from "@/site.config";
import { apps, appsByStatus } from "@/content/apps";
import Reveal from "@/components/reveal";
import AppCard from "@/components/app-card";
import JsonLd, { breadcrumb } from "@/components/json-ld";
import { openGraph } from "@/lib/seo";

const title = "제품";
// 앱 이름을 넣어 제품명 검색에도 걸리게 한다. 앞 세 개만 적어 앱이 늘어도 80자를 넘지 않는다
const shown = apps.slice(0, 3).map((a) => a.name).join(", ");
const description = `${site.name}(${site.nameEn})이 만들고 있는 앱 ${apps.length}개 — ${shown} 등 전체 목록입니다.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/products/" },
  openGraph: openGraph({ title, description, path: "/products/" }),
};

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb(site.url, [
          { name: "홈", path: "/" },
          { name: title, path: "/products/" },
        ])}
      />
      <section className="hero-bg">
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-20 text-center sm:pt-28">
          <p className="eyebrow mb-4">Products</p>
          <h1 className="text-3xl font-extrabold leading-[1.3] tracking-tight sm:text-5xl sm:leading-[1.25]">
            만들고 있는 제품
          </h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
            많은 기능보다 확실한 하나. 매일 쓰이고 오래 쓰이는 앱을 하나씩
            만들고 있습니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-6 sm:pb-32">
        {/* 앱이 늘어나도 한눈에 — 최대 3열 카드, 출시된 앱부터. 카드가 적을 땐 가운데로 모인다 */}
        <div className="flex flex-wrap justify-center gap-5">
          {appsByStatus.map((app, i) => (
            <Reveal
              key={app.slug}
              delay={Math.min(i, 5) * 90}
              className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
            >
              <AppCard app={app} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
