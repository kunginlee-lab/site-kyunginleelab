/**
 * 사이트 전역 설정 — 사업자 정보는 전부 이 파일에서만 관리합니다.
 *
 * ⚠️ 채워야 할 값 (비워두면 화면에 표시되지 않습니다):
 *  - representative: 대표자 성명 (사업자등록증 기준)
 *  - address: 사업장 주소 (전자상거래 표기 의무 — 등록증 기준)
 *  - nameEn: 영문 상호 확정 시 교체 (D-U-N-S 신청서·도메인과 반드시 동일 표기)
 *  - url: 커스텀 도메인 연결 후 실제 도메인으로 교체
 */
// 앱 목록·제품 페이지 데이터는 content/apps.ts 에서 관리합니다.
export const site = {
  name: "경인리랩",
  nameEn: "Gyeongin ReLab", // TODO: D-U-N-S 신청 전 영문 표기 확정
  tagline: "일상을 가볍게 만드는 앱을 만듭니다",
  url: "https://gyeonginrelab.vercel.app", // TODO: 커스텀 도메인 연결 후 교체
  email: "vov.playconsole@gmail.com", // Play Console 공개 개발자 이메일과 동일하게 유지
  business: {
    registrationNumber: "350-01-04344",
    representative: "", // TODO: 대표자 성명
    address: "", // TODO: 사업장 주소
  },
} as const;
