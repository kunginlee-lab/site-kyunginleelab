/**
 * 사이트 전역 설정 — 사업자 정보는 전부 이 파일에서만 관리합니다.
 *
 *  - nameEn: 화면 표시용 영문 브랜드 표기 (헤더·푸터 로고)
 *  - legalNameEn: 공식 서류용 영문 상호 — 홈택스 영문 사업자등록증명(2026-09-13 발급)에
 *    "KYUNGIN LEELAB"(띄어쓰기)으로 기재됨. D-U-N-S·Google 결제 프로필도 이 표기로 통일
 *  - address: 사업장 주소 (전자상거래 표기 의무 — 등록증 기준). 비우면 표시되지 않음
 */
// 앱 목록·제품 페이지 데이터는 content/apps.ts 에서 관리합니다.
export const site = {
  name: "경인리랩",
  nameEn: "Kyungin LeeLab",
  legalNameEn: "KYUNGIN LEELAB",
  tagline: "일상을 가볍게 만드는 앱을 만듭니다",
  url: "https://kyunginleelab.com",
  email: "ceo@kyunginleelab.com",
  business: {
    registrationNumber: "350-01-04344",
    representative: "이경인",
    // 동·호수는 뺀다 — 영문 사업자등록증명·D-U-N-S·Play Console 표기와 동일하게 유지
    address: "경기도 수원시 영통구 덕영대로1555번길 20",
  },
  privacy: {
    effectiveDate: "2026년 9월 13일",
    officer: "이경인",
  },
  seo: {
    // 구글 서치콘솔 · 네이버 서치어드바이저에서 받은 소유 확인 코드 — 비워 두면 태그를 넣지 않는다
    googleSiteVerification: "",
    naverSiteVerification: "",
    // IndexNow 키 (public/<key>.txt 와 같은 값) — 배포 후 네이버·빙에 바뀐 URL 을 바로 알린다
    indexNowKey: "ad62a76d3d24acdd0c2d7852cc3cb7ca",
  },
} as const;
