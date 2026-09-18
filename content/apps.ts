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
import { myoyeonLegal } from "./legal/myoyeon";
import { infiniteStairsLegal } from "./legal/infinite-stairs";

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
      "20분만 녹음하면 내 목소리가 만들어집니다. 글을 내 목소리로 읽어 주고, 좋아하는 노래를 내 목소리로 다시 부릅니다.",
    status: "coming-soon",
    category: "MultimediaApplication",
    keywords: ["목소리", "음성 합성", "TTS", "노래 변환", "AI 커버", "보컬", "노래방", "녹음", "내 목소리", "마이보이스", "RVC"],
    screens: [
      { file: "screen-1.webp", alt: "변환된 노래 재생 화면 — 앨범 디스크와 목소리·반주·잔향·키 조절" },
      { file: "screen-2.webp", alt: "노래 화면 — 내 목소리 고르기와 노래 파일 선택" },
      { file: "screen-3.webp", alt: "내 목소리 만들기 — 녹음 진행률과 시작 버튼" },
      { file: "screen-4.webp", alt: "노래 바꾸는 중 — 남은 시간과 대기 목록" },
    ],
    features: [
      {
        emoji: "🎤",
        title: "20분만 읽으면 내 목소리가 생깁니다",
        body: "화면에 뜨는 문장을 소리 내어 읽기만 하면 됩니다. 녹음이 모이면 버튼 하나로 시작됩니다. 만드는 동안 앱을 꺼 두어도 되고, 다 되면 알림으로 알려 드립니다. 그다음부터는 바로 쓸 수 있습니다.",
      },
      {
        emoji: "🎧",
        title: "좋아하는 노래를 내 목소리로",
        body: "곡을 고르면 원곡에서 가수 목소리만 걷어내고 그 자리에 내 목소리를 넣습니다. 반주는 원곡 그대로이고, 키를 올리거나 내리면 반주도 따라옵니다. 두 사람이 주고받듯 번갈아 부르거나 화음을 얹을 수도 있습니다.",
      },
      {
        emoji: "🎚",
        title: "들으면서 바로 맞춥니다",
        body: "완성된 노래는 들으면서 내 목소리 크기, 반주 크기, 울림, 키를 바로 조절할 수 있습니다. 앨범을 넘기듯 골라 듣고, 마음에 들면 파일로 공유합니다.",
      },
      {
        emoji: "🔒",
        title: "녹음은 내 폰에 남습니다",
        body: "녹음한 파일과 만들어진 노래는 내 휴대전화 안에 있습니다. 목소리를 만들거나 노래를 바꿀 때만 그 파일이 잠금 처리되어 서버로 갔다가, 일이 끝나면 7일 안에 지워집니다. 글을 읽어 주는 기능은 인터넷 없이 휴대전화 안에서만 돌아갑니다.",
      },
    ],
    pricing: {
      heading: "쓴 만큼만 내면 됩니다",
      sub: "매달 빠져나가는 구독료가 없습니다. 노래를 바꾸거나 목소리를 만들 때만 요금이 듭니다.",
      plans: [
        {
          name: "노래 한 곡 바꾸기",
          price: "900원",
          detail:
            "원곡에서 가수 목소리만 걷어내고 그 자리에 내 목소리를 넣습니다. 반주는 원곡 그대로입니다. 15~25분이면 끝나고, 중간에 잘못되면 요금을 돌려드립니다.",
          highlight: true,
        },
        {
          name: "내 목소리 만들기",
          price: "4,900원부터",
          detail:
            "녹음해 둔 목소리를 컴퓨터가 배워서 나만의 목소리를 만듭니다. 한 번 만들면 이후 노래에 계속 씁니다. 더 오래 배우게 하면(6,900원 · 8,900원) 실제 목소리에 더 가까워집니다.",
        },
        {
          name: "먼저 충전해 두기",
          price: "1,000원부터",
          detail:
            "앞으로 쓸 금액을 미리 충전해 두고 쓸 때마다 차감합니다. 1,000원 · 5,000원 · 10,000원 중에서 고르면 되고, 처음 가입하면 노래 한 곡 바꿀 만큼을 그냥 드립니다.",
        },
      ],
    },
    legal: myvoiceLegal,
    hasOgImage: true,
  },
  {
    slug: "myoyeon",
    name: "묘연",
    tagline: "태어난 순간의 하늘을, 기기 안에서 읽습니다",
    short:
      "절기를 천문 계산으로 산출하는 정밀 만세력으로 사주를 뽑습니다. AI 도사가 기기 안에서 답하고, 출생 정보는 밖으로 나가지 않습니다.",
    status: "coming-soon",
    category: "LifestyleApplication",
    keywords: ["사주", "사주팔자", "만세력", "운세", "오늘의 운세", "명리", "대운", "오행", "십신", "묘연", "사주 앱"],
    screens: [
      { file: "screen-1.webp", alt: "사주 원국 화면 — 시·일·월·년 네 기둥을 세로로 세운 카드와 일간 풀이" },
      { file: "screen-2.webp", alt: "설정 화면 — 개인정보처리방침과 계정 및 데이터 삭제, 기기 안에만 남는다는 안내" },
      { file: "screen-3.webp", alt: "묘연 도사 상담 화면 — 원국을 근거로 기기 안에서 만들어진 답변" },
      { file: "screen-4.webp", alt: "운의 흐름 화면 — 십 년 단위 대운 타임라인과 현재 대운 풀이" },
    ],
    features: [
      {
        emoji: "🌌",
        title: "절기 기반 정밀 만세력",
        body: "절기표를 앱 안에 넣어 두지 않고 천문 계산으로 24절기와 음력을 매번 산출합니다. 그래서 연도 범위 제한이 없고, 출생지 경도에 따른 진태양시 보정까지 반영해 절입 시각에 걸친 사주도 그대로 계산합니다.",
      },
      {
        emoji: "🔒",
        title: "출생 정보는 내 폰에만",
        body: "생년월일시·출생지, 계산 결과, 저장한 해석, 도사와 나눈 대화가 전부 기기 안에만 남습니다. 서버에 담기는 것은 구독 상태뿐이고, 이름과 이메일은 아예 받지 않습니다.",
      },
      {
        emoji: "🧙",
        title: "묘연 도사와 상담",
        body: "궁금한 것을 물으면 도사가 답합니다. 계산된 원국을 근거로만 말하도록 만든 규칙 기반 엔진이 기기 안에서 문장을 지어내므로, 질문도 답도 밖으로 나가지 않습니다. 무료로 하루 3회 상담할 수 있습니다.",
      },
      {
        emoji: "📜",
        title: "해석과 운의 흐름",
        body: "일간·오행·십신·합충·신살·대운 여섯 문단으로 사주를 풀어 주고, 대운 타임라인에서 십 년 단위로 흐름이 어떻게 바뀌는지 짚어 줍니다.",
      },
    ],
    pricing: {
      heading: "무료로 시작, 필요할 때 프리미엄",
      sub: "사주 원국·오행·십신·오늘의 운세는 언제나 무료입니다.",
      plans: [
        {
          name: "무료",
          price: "0원",
          detail:
            "원국·오행·십신·오늘의 운세 무제한 · 해석 2편 · AI 상담 하루 3회 · 프로필 1개",
        },
        {
          name: "프리미엄",
          price: "월 4,900원",
          detail:
            "해석 6편 전체 · 합충·신살 · 대운 전 구간·세운 · 무제한 상담 · 프로필 12개 · 연 39,000원",
          highlight: true,
        },
        {
          name: "평생 이용권",
          price: "89,000원",
          detail:
            "한 번 결제로 프리미엄 전부, 갱신·해지 없음 · 상담권 30회 2,900원도 따로 있음",
        },
      ],
    },
    legal: myoyeonLegal,
    hasOgImage: true,
  },
  {
    slug: "infinite-stairs",
    name: "무한의 계단",
    tagline: "리듬처럼 두드려 올라가는 캐주얼 아케이드",
    short:
      "좌우를 번갈아 두드려 끝없는 계단을 오릅니다. 리듬이 붙을수록 콤보가 쌓이고, 친구와 함께 오를 수도 있어요.",
    status: "coming-soon",
    category: "GameApplication",
    keywords: [
      "계단",
      "무한의 계단",
      "아케이드",
      "캐주얼 게임",
      "콤보",
      "리듬",
      "한손 게임",
      "랭킹",
      "협동",
      "멀티플레이",
      "오프라인 게임",
    ],
    screens: [
      { file: "screen-1.webp", alt: "게임 화면 — 네온 계단을 오르는 캐릭터와 콤보 표시" },
      { file: "screen-2.webp", alt: "콤보가 쌓여 코인 배수가 오른 게임 화면" },
      { file: "screen-3.webp", alt: "홈 화면 — 고른 캐릭터와 최고 기록" },
      { file: "screen-4.webp", alt: "상점 — 캐릭터 목록과 해금 가격" },
      { file: "screen-5.webp", alt: "함께 오르기 로비 — 모드 선택과 방 목록" },
    ],
    features: [
      {
        emoji: "👆",
        title: "좌우 두 번, 그게 전부입니다",
        body: "다음 계단이 놓인 쪽을 누르기만 하면 올라갑니다. 규칙을 배우는 데 3초면 충분하고, 손에 익으면 화면을 보지 않고도 리듬이 맞습니다. 한 손으로, 서 있는 지하철에서도 됩니다.",
      },
      {
        emoji: "🔥",
        title: "빨라질수록 보상이 커집니다",
        body: "끊기지 않고 두드리면 콤보가 쌓이고 코인이 최대 5배까지 붙습니다. 대신 높이 오를수록 시간 게이지가 빨리 줄어들어, 급한 마음과 정확함이 계속 부딪힙니다.",
      },
      {
        emoji: "👥",
        title: "친구와 같은 계단을",
        body: "같은 계단을 셋이 함께 오릅니다. 삐끗한 동료는 내가 그 높이까지 올라가면 다시 일어나고, 보급을 떨궈 뒤를 받쳐 줄 수도 있습니다. 도둑과 경찰 모드에서는 한 명이 나머지를 쫓습니다.",
      },
      {
        emoji: "📵",
        title: "인터넷 없이도 즐겁습니다",
        body: "혼자 오르기는 비행기 모드에서도 그대로 돌아갑니다. 기록·코인·해금은 전부 내 기기에 저장되고, 랭킹에 올리는 것은 내가 정한 닉네임과 점수뿐입니다.",
      },
    ],
    pricing: {
      heading: "무료로 충분히, 원하면 프리미엄",
      sub: "혼자 오르기와 랭킹은 언제나 무료입니다.",
      plans: [
        {
          name: "무료",
          price: "0원",
          detail:
            "혼자 오르기 무제한 · 주간 랭킹 · 함께 오르기 하루 3판(광고 보면 한 판 더) · 코인으로 캐릭터·맵 해금",
        },
        {
          name: "프리미엄",
          price: "월 3,900원",
          detail:
            "광고 완전 제거 · 함께 오르기 무제한 · 캐릭터·맵 전부 해금 · 코인 2배 · 매일 300코인 · 기기 간 진행도 동기화 · 연 29,000원",
          highlight: true,
        },
        {
          name: "평생 이용권",
          price: "49,000원",
          detail: "한 번 결제로 프리미엄 전부, 갱신·해지 없음 · 코인 팩도 1,200원부터 따로 있음",
        },
      ],
    },
    legal: infiniteStairsLegal,
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
