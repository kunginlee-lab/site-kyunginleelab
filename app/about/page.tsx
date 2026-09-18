import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import { apps, appsByStatus } from "@/content/apps";
import Reveal from "@/components/reveal";
import EmailLink from "@/components/email-link";
import JsonLd, { breadcrumb } from "@/components/json-ld";
import { openGraph } from "@/lib/seo";

/*
 * 회사 소개 — 홈의 "제품을 만드는 방식"이 감성 문장이라면, 이 페이지는 사실을
 * 평문으로 적어 두는 자리다.
 *
 * 검색 결과 요약이나 AI 답변은 "경인리랩은 ~입니다" 처럼 질문에 곧장 답하는 문장을
 * 그대로 들어 올린다. 그런 문장이 사이트 어디에도 없으면 인용할 재료가 없어서
 * 회사 이름을 검색해도 아무 설명이 붙지 않는다. 그래서 첫 문단·표·FAQ 는
 * 멋을 부리지 않고 누가 · 언제 · 어디서 · 무엇을 하는지만 적는다.
 */

const [emailUser, emailDomain] = site.email.split("@");

const title = "회사 소개";
const description = `${site.name}(${site.nameEn})은 대표 ${site.business.representative}이 ${site.foundingYear}년 경기도 수원에 세운 소프트웨어 스튜디오입니다.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about/" },
  openGraph: openGraph({ title, description, path: "/about/" }),
};

/** 표로 보여 줄 사업자 정보 — 푸터·구조화 데이터와 같은 값을 쓴다 */
const facts: { label: string; value: string }[] = [
  { label: "상호", value: site.name },
  { label: "영문 상호", value: site.legalNameEn },
  { label: "대표", value: site.business.representative },
  { label: "설립", value: `${site.foundingYear}년` },
  { label: "소재지", value: "경기도 수원시 영통구" },
  { label: "사업자등록번호", value: site.business.registrationNumber },
  { label: "하는 일", value: "모바일 앱 기획 · 개발 · 운영" },
];

const appList = apps.map((a) => a.name).join(", ");

const faqs: { q: string; a: string }[] = [
  {
    q: `${site.name}은 어떤 회사인가요?`,
    a: `${site.name}(${site.nameEn})은 경기도 수원에 있는 소프트웨어 스튜디오입니다. 대표 ${site.business.representative}이 ${site.foundingYear}년에 설립했고, 모바일 앱을 직접 기획하고 개발해 운영합니다.`,
  },
  {
    q: "어떤 앱을 만드나요?",
    a: `현재 ${apps.length}개의 앱을 만들고 있습니다 — ${appList}. 각각 식사 기록, 음성 합성, 사주 풀이, 캐주얼 게임을 다룹니다.`,
  },
  {
    q: "앱은 어디에서 받을 수 있나요?",
    a: "모두 Google Play 출시를 준비하고 있습니다. 출시되면 이 사이트의 제품 페이지에서 스토어로 바로 이동할 수 있습니다.",
  },
  {
    q: "앱이 개인정보를 수집하나요?",
    a: "기록은 기본적으로 사용자의 기기 안에 남습니다. 서버에는 구독 상태처럼 앱이 동작하는 데 꼭 필요한 정보만 둡니다. 앱마다 다루는 내용이 다르므로 각 앱의 개인정보처리방침을 확인해 주세요.",
  },
  {
    q: `${site.name}에 문의하려면 어떻게 하나요?`,
    a: "사이트 오른쪽 위의 '문의하기' 또는 페이지 아래쪽의 '이메일 문의'를 누르면 메일 앱이 열립니다.",
  },
];

// 회사 자체는 layout 의 Organization 한 곳에만 적고, 여기서는 @id 로 가리키기만 한다.
const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `${title} — ${site.nameEn}`,
  url: `${site.url}/about/`,
  description,
  inLanguage: "ko-KR",
  mainEntity: { "@id": `${site.url}/#organization` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb(site.url, [
          { name: "홈", path: "/" },
          { name: title, path: "/about/" },
        ])}
      />
      <JsonLd data={aboutLd} />
      <JsonLd data={faqLd} />

      <section className="hero-bg">
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-20 text-center sm:pt-28">
          <p className="eyebrow mb-4">About</p>
          <h1 className="text-3xl font-extrabold leading-[1.3] tracking-tight sm:text-5xl sm:leading-[1.25]">
            {site.name}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
            {site.name}({site.nameEn})은 대표 {site.business.representative}이{" "}
            {site.foundingYear}년 경기도 수원에 세운 소프트웨어 스튜디오입니다.
            안드로이드 모바일 앱을 직접 기획하고 개발해 운영합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 pt-10">
        <Reveal>
          {/* 앱 이름을 손으로 적은 유일한 곳 — content/apps.ts 에 앱을 더하면 이 문단도 함께 고칠 것 */}
          <div className="space-y-5 leading-relaxed text-muted">
            <p>
              지금은 {apps.length}개의 앱을 만들고 있습니다. 식사 사진 한 장으로
              칼로리를 기록하는 CaloSnap, 내 목소리로 글을 읽고 노래를 부르는
              MyVoice, 절기를 천문 계산으로 산출하는 사주 앱 묘연, 두드려
              올라가는 캐주얼 아케이드 무한의 계단입니다. 모두 Google Play 출시를
              준비하고 있습니다.
            </p>
            <p>
              만드는 기준은 하나입니다. 기록은 사용자의 기기 안에 두고, 서버에는
              앱이 동작하는 데 꼭 필요한 것만 둡니다. 기능을 넓게 벌이기보다 매일
              쓰이는 하나를 오래 다듬는 쪽을 택합니다.
            </p>
          </div>
        </Reveal>

        {/* 사업자 정보 — 검색·AI 가 그대로 인용할 수 있게 항목과 값을 평문으로 */}
        <Reveal delay={90}>
          <h2 className="mb-6 mt-14 text-xl font-bold tracking-tight">
            한눈에 보기
          </h2>
          <dl className="text-sm">
            {facts.map((f) => (
              <div
                key={f.label}
                className="flex flex-col gap-1 border-t border-line py-3.5 sm:flex-row sm:gap-6"
              >
                <dt className="shrink-0 font-semibold sm:w-36">{f.label}</dt>
                <dd className="text-muted">{f.value}</dd>
              </div>
            ))}
            <div className="flex flex-col gap-1 border-y border-line py-3.5 sm:flex-row sm:gap-6">
              <dt className="shrink-0 font-semibold sm:w-36">문의</dt>
              <dd className="text-muted">
                <EmailLink
                  user={emailUser}
                  domain={emailDomain}
                  showAddress
                  className="transition-colors hover:text-ink"
                >
                  이메일 문의
                </EmailLink>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={90}>
          <h2 className="mb-6 mt-14 text-xl font-bold tracking-tight">
            자주 묻는 질문
          </h2>
          <div className="space-y-6">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="hairline mt-14" />
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href="/products/"
              className="rounded-full bg-accent px-5 py-2.5 font-semibold text-white transition-opacity hover:opacity-85"
            >
              제품 보기
            </Link>
            <Link
              href="/privacy/"
              className="rounded-full border border-line px-5 py-2.5 font-semibold text-muted transition-colors hover:text-ink"
            >
              개인정보처리방침
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted">
            제품별 자세한 소개는{" "}
            {appsByStatus.map((a, i) => (
              <span key={a.slug}>
                {i > 0 && " · "}
                <Link
                  href={`/${a.slug}/`}
                  className="text-accent-ink transition-opacity hover:opacity-80"
                >
                  {a.name}
                </Link>
              </span>
            ))}{" "}
            페이지에 있습니다.
          </p>
        </Reveal>
      </section>
    </>
  );
}
