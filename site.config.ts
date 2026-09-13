/**
 * 사이트 전역 설정 — 사업자 정보는 전부 이 파일에서만 관리합니다.
 *
 * ⚠️ 채워야 할 값 (비워두면 화면에 표시되지 않습니다):
 *  - representative: 대표자 성명 (사업자등록증 기준)
 *  - address: 사업장 주소 (전자상거래 표기 의무 — 등록증 기준)
 *  - nameEn: 영문 상호 확정 시 교체 (D-U-N-S 신청서·도메인과 반드시 동일 표기)
 *  - url: 커스텀 도메인 연결 후 실제 도메인으로 교체
 */
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

export const calosnap = {
  name: "CaloSnap",
  tagline: "사진 한 장으로 기록하는 칼로리",
  short:
    "식사 사진 한 장이면 끝. AI가 칼로리와 탄단지를 자동으로 계산해 기록해요.",
  playUrl: "", // TODO: 프로덕션 출시 후 Play 스토어 링크
  privacyUrl: "https://calosnap-app-2026.web.app/privacy.html",
  deleteAccountUrl: "https://calosnap-app-2026.web.app/delete-account.html",
} as const;
