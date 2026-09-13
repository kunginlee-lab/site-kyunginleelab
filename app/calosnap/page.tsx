import type { Metadata } from "next";
import Image from "next/image";
import { calosnap } from "@/site.config";

export const metadata: Metadata = {
  title: `${calosnap.name} — ${calosnap.tagline}`,
  description: calosnap.short,
  openGraph: {
    title: `${calosnap.name} — ${calosnap.tagline}`,
    description: calosnap.short,
    images: ["/calosnap/og.png"],
  },
};

const screens = [
  { src: "/calosnap/screen-1.webp", alt: "CaloSnap 홈 화면 — 오늘의 칼로리 링" },
  { src: "/calosnap/screen-3.webp", alt: "AI 분석 결과 — 사진 위 음식 태그와 칼로리 카드" },
  { src: "/calosnap/screen-2.webp", alt: "달력 화면 — 날짜별 섭취량 링" },
  { src: "/calosnap/screen-4.webp", alt: "AI 식사 인사이트 카드" },
];

const features = [
  {
    emoji: "📸",
    title: "찍으면 기록됩니다",
    body: "식사 사진을 찍으면 AI가 음식을 알아보고 칼로리·탄수화물·단백질·지방을 자동으로 계산합니다. 검색하고, 고르고, 입력하는 과정이 사진 한 장으로 줄어듭니다.",
  },
  {
    emoji: "🔒",
    title: "기록은 내 폰에만 남습니다",
    body: "식사 기록·통계·사진은 전부 내 폰에만 저장됩니다. 계정에는 구독 정보만 담기고 기록은 서버로 가지 않습니다. AI 분석 순간에만 사진 한 장이 암호화되어 전달되고, 서버에 저장되지 않습니다.",
  },
  {
    emoji: "🍽",
    title: "한식에 강합니다",
    body: "비빔밥, 김치찌개, 삼겹살 — 한식 데이터베이스를 기반으로 음식을 인식하고 1인분 기준 중량을 제안합니다. 중량을 조절하면 칼로리가 다시 계산됩니다.",
  },
  {
    emoji: "📅",
    title: "달력으로 한 달을 봅니다",
    body: "날짜마다 목표 대비 섭취량이 링으로 표시되어, 어느 날이 무거웠는지 한눈에 보입니다.",
  },
];

const plans = [
  {
    name: "무료 체험",
    price: "3일",
    detail: "프리미엄 전체 기능을 하루 3회씩",
    highlight: false,
  },
  {
    name: "라이트",
    price: "월 3,990원",
    detail: "월 200회 분석 · 7일 추이 · 상세 영양성분(당류·나트륨·식이섬유) · 연 29,900원",
    highlight: false,
  },
  {
    name: "프리미엄",
    price: "월 4,900원",
    detail: "라이트 전부 · 월 400회 · AI 식사 인사이트 · 30·90일 추이 · 목표 설정 · CSV 내보내기 · 연 39,900원",
    highlight: true,
  },
];

export default function CaloSnapPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-20 text-center sm:pt-28">
        <Image
          src="/calosnap/icon.png"
          alt="CaloSnap 앱 아이콘"
          width={112}
          height={112}
          className="mx-auto h-28 w-28 rounded-[28px] border border-line shadow-sm"
          priority
        />
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {calosnap.name}
        </h1>
        <p className="mt-3 text-xl font-medium text-muted">
          {calosnap.tagline}
        </p>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted">
          {calosnap.short}
        </p>
        <div className="mt-8">
          {calosnap.playUrl ? (
            <a
              href={calosnap.playUrl}
              className="inline-block rounded-full bg-accent px-8 py-3.5 font-semibold text-white transition-opacity hover:opacity-85"
            >
              Google Play에서 받기
            </a>
          ) : (
            <span className="inline-block rounded-full bg-accent-soft px-6 py-3 text-sm font-semibold text-accent-ink">
              Google Play 출시 준비 중
            </span>
          )}
        </div>
      </section>

      {/* Screenshots */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-5 py-14 sm:grid-cols-4">
          {screens.map((s) => (
            <Image
              key={s.src}
              src={s.src}
              alt={s.alt}
              width={720}
              height={1600}
              className="w-full rounded-2xl border border-line"
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="grid gap-10 sm:grid-cols-2">
          {features.map((f) => (
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

      {/* Pricing */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <h2 className="mb-2 text-center text-2xl font-bold tracking-tight">
            라이트 & 프리미엄
          </h2>
          <p className="mb-10 text-center text-muted">
            시작은 무료입니다. 오늘 점심부터 찍어보세요.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {plans.map((p) => (
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

      {/* Legal links */}
      <section className="mx-auto max-w-5xl px-5 py-12 text-center text-sm">
        <a
          href={calosnap.privacyUrl}
          className="mx-3 text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
        >
          개인정보처리방침
        </a>
        <a
          href={calosnap.deleteAccountUrl}
          className="mx-3 text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
        >
          계정 삭제 안내
        </a>
      </section>
    </>
  );
}
