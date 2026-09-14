/**
 * 앱 레지스트리 — 새 앱을 출시하면 여기에 항목 하나만 추가하면 됩니다.
 *
 * 1. `public/apps/<slug>/` 폴더에 icon.png (512px), screen-*.webp (720×1600),
 *    og.png (1024×500, 선택)를 넣는다.
 * 2. 아래 배열에 객체를 추가한다. 제품 페이지(/<slug>/), 홈 카드, sitemap이
 *    자동으로 생긴다.
 *
 * 선택 필드는 비우면 해당 섹션이 페이지에서 빠집니다 (무료 앱이면 plans 생략 등).
 */

import type { AppLegal } from "./legal";
import { calosnapLegal } from "./legal/calosnap";
import { myvoiceLegal } from "./legal/myvoice";

export type AppEntry = {
  slug: string;
  name: string;
  tagline: string;
  short: string;
  status: "live" | "coming-soon";
  /** 홈 상단 스크롤 쇼케이스 후보 중 서버 기본값으로 둘 앱 (접속마다 후보 중 랜덤으로 보여준다) */
  featured?: boolean;
  /** 홈 검색에서 이름·설명 외에 추가로 걸릴 말들 */
  keywords?: string[];
  playUrl?: string; // status가 live일 때 스토어 버튼에 사용
  screens?: { file: string; alt: string }[];
  features?: { emoji: string; title: string; body: string }[];
  pricing?: {
    heading: string;
    sub?: string;
    plans: { name: string; price: string; detail: string; highlight?: boolean }[];
  };
  /** 사이트 안에서 제공하는 앱 법적 문서 (content/legal/<slug>.ts) — /<slug>/privacy/, /<slug>/delete-account/ 가 생긴다 */
  legal?: AppLegal;
  /** 외부 문서 링크가 따로 있을 때만 */
  legalLinks?: { label: string; url: string }[];
  hasOgImage?: boolean; // public/apps/<slug>/og.png 존재 여부
  /** schema.org SoftwareApplication 의 applicationCategory. 비우면 HealthApplication */
  category?: string;
};

export const apps: AppEntry[] = [
  {
    slug: "calosnap",
    name: "CaloSnap",
    tagline: "사진 한 장으로 기록하는 칼로리",
    short:
      "식사 사진 한 장이면 끝. AI가 칼로리와 탄단지를 자동으로 계산해 기록해요.",
    status: "coming-soon",
    featured: true,
    keywords: ["칼로리", "식단", "다이어트", "사진", "음식", "영양", "탄단지", "건강", "칼로스냅"],
    screens: [
      { file: "screen-1.webp", alt: "CaloSnap 홈 화면 — 오늘의 칼로리 링" },
      { file: "screen-3.webp", alt: "AI 분석 결과 — 사진 위 음식 태그와 칼로리 카드" },
      { file: "screen-2.webp", alt: "달력 화면 — 날짜별 섭취량 링" },
      { file: "screen-4.webp", alt: "AI 식사 인사이트 카드" },
    ],
    features: [
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
        emoji: "📅",
        title: "달력으로 한 달을 봅니다",
        body: "날짜마다 목표 대비 섭취량이 링으로 표시되어, 어느 날이 무거웠는지 한눈에 보입니다.",
      },
      {
        emoji: "🍽",
        title: "한식에 강합니다",
        body: "비빔밥, 김치찌개, 삼겹살 — 한식 데이터베이스를 기반으로 음식을 인식하고 1인분 기준 중량을 제안합니다. 중량을 조절하면 칼로리가 다시 계산됩니다.",
      },
    ],
    pricing: {
      heading: "라이트 & 프리미엄",
      sub: "시작은 무료입니다. 오늘 점심부터 찍어보세요.",
      plans: [
        {
          name: "무료 체험",
          price: "3일",
          detail: "프리미엄 전체 기능을 하루 3회씩",
        },
        {
          name: "라이트",
          price: "월 3,990원",
          detail:
            "월 200회 분석 · 7일 추이 · 상세 영양성분(당류·나트륨·식이섬유) · 연 29,900원",
        },
        {
          name: "프리미엄",
          price: "월 4,900원",
          detail:
            "라이트 전부 · 월 400회 · AI 식사 인사이트 · 30·90일 추이 · 목표 설정 · CSV 내보내기 · 연 39,900원",
          highlight: true,
        },
      ],
    },
    legal: calosnapLegal,
    hasOgImage: true,
  },
  {
    slug: "myvoice",
    name: "MyVoice",
    tagline: "내 목소리로 말하고, 내 목소리로 부르는 노래",
    short:
      "20분 녹음이면 내 목소리 모델이 생깁니다. 글을 내 목소리로 읽어 주고, 좋아하는 노래를 내 목소리로 다시 부릅니다.",
    status: "coming-soon",
    category: "MultimediaApplication",
    keywords: ["목소리", "음성 합성", "TTS", "노래 변환", "AI 커버", "보컬", "노래방", "녹음", "내 목소리", "마이보이스", "RVC"],
    screens: [
      { file: "screen-1.webp", alt: "변환된 노래 재생 화면 — 앨범 디스크와 목소리·반주·잔향·키 이펙트 조절" },
      { file: "screen-2.webp", alt: "노래 학습·변환 화면 — 노래 목소리 모델 선택과 노래 파일 선택" },
      { file: "screen-3.webp", alt: "내 목소리 만들기 — 녹음 진행률과 학습 시작 버튼" },
      { file: "screen-4.webp", alt: "노래 변환 진행 화면 — 예상 시간과 대기열" },
    ],
    features: [
      {
        emoji: "🎤",
        title: "녹음 20분이면 내 목소리가 생깁니다",
        body: "대본을 소리 내어 읽으면 됩니다. 녹음이 모이면 버튼 하나로 GPU 학습이 시작되고, 앱을 꺼도 계속됩니다. 끝나면 모델이 자동으로 설치되어 바로 쓸 수 있습니다.",
      },
      {
        emoji: "🎧",
        title: "좋아하는 노래를 내 목소리로",
        body: "곡을 고르면 원곡 보컬을 분리해 내 목소리로 바꿔 줍니다. 반주는 원곡 그대로, 키를 바꾸면 반주도 따라옵니다. 두 목소리로 번갈아 부르거나 화음을 얹을 수도 있습니다.",
      },
      {
        emoji: "🎚",
        title: "들으면서 바로 조절합니다",
        body: "변환된 곡은 내 목소리·반주·잔향·키를 재생 중에 실시간으로 조절할 수 있습니다. 앨범 디스크 화면에서 넘기며 듣고, 완성본은 파일로 공유합니다.",
      },
      {
        emoji: "🔒",
        title: "녹음은 내 폰에, 처리는 작업할 때만",
        body: "녹음·모델·변환곡은 기기 안에 저장됩니다. 학습과 변환을 실행할 때만 그 작업의 파일이 암호화되어 서버로 가고, 처리가 끝나면 7일 안에 자동 삭제됩니다. 말하기(음성 합성)는 기기 안에서만 이루어집니다.",
      },
    ],
    legal: myvoiceLegal,
    hasOgImage: true,
  },
];

export const statusLabel: Record<AppEntry["status"], string> = {
  live: "Google Play 출시",
  "coming-soon": "Google Play 출시 준비 중",
};

export function appIcon(app: AppEntry) {
  return `/apps/${app.slug}/icon.png`;
}

const hasShowcase = (a: AppEntry) => !!(a.screens?.length && a.features?.length);

/** 홈 쇼케이스용 대표 앱 — featured 표시된 앱, 없으면 자산 있는 첫 앱 */
export const featuredApp =
  apps.find((a) => a.featured && hasShowcase(a)) ?? apps.find(hasShowcase);

/** 목록 표시 순서 — 출시된 앱 먼저, 그다음 등록 순 */
export const appsByStatus = [...apps].sort(
  (a, b) => Number(b.status === "live") - Number(a.status === "live"),
);
