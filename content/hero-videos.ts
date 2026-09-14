/**
 * 홈 히어로 배경 영상 — public/videos/ 에 파일을 넣고 여기에 순서대로 적으면
 * 자동으로 크로스페이드 무한 루프됩니다. 비우면 영상 없이 기존 배경만 보입니다.
 *
 * 권장: 가로형 720p 12초 안팎, 소리 없음. 라이선스는 상업용 허용인지 확인.
 * 휴대폰용(mobileSrc)은 세로로 잘라 작게 만든 판본 — 가로 영상을 그대로 쓰면 화면에 가운데 일부만
 * 크게 확대돼 보이고, 셀룰러 데이터도 서너 배 든다. 만드는 법(ffmpeg):
 *   crop=ih*9/16:ih, scale=450:800, fps=24, libx264 crf 36, 무음
 */
export type HeroVideo = {
  src: string;
  /** 좁은 화면(768px 미만)에서 대신 쓸 세로 판본 */
  mobileSrc?: string;
  credit?: string;
};

export const heroVideos: HeroVideo[] = [
  {
    src: "/videos/hero-1.mp4",
    mobileSrc: "/videos/hero-1-m.mp4",
    credit: "Mixkit #914 — 오픈 오피스",
  },
  {
    src: "/videos/hero-2.mp4",
    mobileSrc: "/videos/hero-2-m.mp4",
    credit: "Mixkit #4809 — 팀 회의",
  },
  {
    src: "/videos/hero-3.mp4",
    mobileSrc: "/videos/hero-3-m.mp4",
    credit: "Mixkit #4872 — 동료와 대화",
  },
];
