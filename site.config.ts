/**
 * 사이트 전역 설정 — 사업자 정보는 전부 이 파일에서만 관리합니다.
 *
 *  - nameEn: 화면 표시용 영문 브랜드 표기 (헤더·푸터 로고)
 *  - legalNameEn: 공식 서류용 영문 상호 — D-U-N-S·Google 결제 프로필·홈택스 영문
 *    사업자등록증명과 글자 단위로 동일하게 유지 (2026-09-13 확정: KYUNGINLEELAB)
 *  - address: 사업장 주소 (전자상거래 표기 의무 — 등록증 기준). 비우면 표시되지 않음
 */
// 앱 목록·제품 페이지 데이터는 content/apps.ts 에서 관리합니다.
export const site = {
  name: "경인리랩",
  nameEn: "Kyungin LeeLab",
  legalNameEn: "KYUNGINLEELAB",
  tagline: "일상을 가볍게 만드는 앱을 만듭니다",
  url: "https://kyunginleelab.com",
  email: "ceo@kyunginleelab.com",
  business: {
    registrationNumber: "350-01-04344",
    representative: "이경인",
    address: "", // 사업장 주소 (사업자등록증 기준). 공개하려면 채운다
  },
  privacy: {
    effectiveDate: "2026년 9월 13일",
    officer: "이경인",
  },
} as const;
