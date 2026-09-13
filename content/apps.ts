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

export type AppEntry = {
  slug: string;
  name: string;
  tagline: string;
  short: string;
  status: "live" | "coming-soon";
  playUrl?: string; // status가 live일 때 스토어 버튼에 사용
  screens?: { file: string; alt: string }[];
  features?: { emoji: string; title: string; body: string }[];
  pricing?: {
    heading: string;
    sub?: string;
    plans: { name: string; price: string; detail: string; highlight?: boolean }[];
  };
  legalLinks?: { label: string; url: string }[];
  hasOgImage?: boolean; // public/apps/<slug>/og.png 존재 여부
};

export const apps: AppEntry[] = [
  {
    slug: "calosnap",
    name: "CaloSnap",
    tagline: "사진 한 장으로 기록하는 칼로리",
    short:
      "식사 사진 한 장이면 끝. AI가 칼로리와 탄단지를 자동으로 계산해 기록해요.",
    status: "coming-soon",
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
        emoji: "🍽",
        title: "한식에 강합니다",
        body: "비빔밥, 김치찌개, 삼겹살 — 한식 데이터베이스를 기반으로 음식을 인식하고 1인분 기준 중량을 제안합니다. 중량을 조절하면 칼로리가 다시 계산됩니다.",
      },
      {
        emoji: "📅",
        title: "달력으로 한 달을 봅니다",
        body: "날짜마다 목표 대비 섭취량이 링으로 표시되어, 어느 날이 무거웠는지 한눈에 보입니다.",
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
    legalLinks: [
      {
        label: "개인정보처리방침",
        url: "https://calosnap-app-2026.web.app/privacy.html",
      },
      {
        label: "계정 삭제 안내",
        url: "https://calosnap-app-2026.web.app/delete-account.html",
      },
    ],
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
