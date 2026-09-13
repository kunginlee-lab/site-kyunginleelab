/**
 * 홈 히어로 배경 영상 — public/videos/ 에 파일을 넣고 여기에 순서대로 적으면
 * 자동으로 크로스페이드 무한 루프됩니다. 비우면 영상 없이 기존 배경만 보입니다.
 *
 * 권장: 720p, 10~20초, 5MB 이하, 소리 없음. 라이선스는 상업용 허용인지 확인.
 */
export type HeroVideo = { src: string; credit?: string };

export const heroVideos: HeroVideo[] = [];
