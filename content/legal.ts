/**
 * 앱별 법적 문서(개인정보처리방침·계정 삭제 안내)의 데이터 형식.
 * 문서는 content/legal/<slug>.ts 에 데이터로 적고, components/legal-doc.tsx 가 사이트 디자인으로 그린다.
 *
 * 본문 텍스트 안에서 쓸 수 있는 표기:
 *   **굵게**            강조
 *   [텍스트](https://…)  링크
 *   {email}             회사 공식 이메일 링크 (봇 수집을 피하려고 마운트 후 조합)
 */
export type LegalBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "note"; title?: string; text: string }
  | { type: "ul"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] };

export type LegalDoc = {
  /** 문서 제목 — 앱 이름은 렌더러가 앞에 붙인다 */
  title: string;
  /** "2026년 9월 2일" 처럼 표시용 */
  updated: string;
  /** 검색 결과·공유 미리보기용 한 줄 */
  description: string;
  blocks: LegalBlock[];
};

export type AppLegal = {
  privacy: LegalDoc;
  deleteAccount: LegalDoc;
};

/** URL 조각 ↔ 문서 키 */
export const LEGAL_DOC_SLUGS = {
  privacy: "privacy",
  deleteAccount: "delete-account",
} as const;

export const LEGAL_DOC_LABELS = {
  privacy: "개인정보처리방침",
  deleteAccount: "계정 삭제 안내",
} as const;

export type LegalDocKey = keyof AppLegal;
