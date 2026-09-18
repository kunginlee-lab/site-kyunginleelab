/**
 * 유튜브에 올린 영상 목록.
 *
 * 채널을 sameAs 로 가리키는 것만으로는 개별 영상이 사이트와 엮이지 않는다.
 * 여기 적어 두면 소개 페이지에 붙고, VideoObject 구조화 데이터와 사이트맵의
 * 동영상 항목이 함께 생겨 구글 동영상 검색 후보로 올라간다.
 *
 * 새 영상을 올리면 이 배열에 항목 하나만 추가하면 된다.
 */
export type VideoEntry = {
  /** 유튜브 영상 ID (youtu.be/<id> 의 뒷부분) */
  id: string;
  title: string;
  description: string;
  /** ISO 8601 날짜 */
  uploadDate: string;
  /** ISO 8601 기간 — 33초면 PT33S */
  duration: string;
};

export const videos: VideoEntry[] = [
  {
    id: "uFdXRqvHyfE",
    title: "덜어냈습니다 — 경인리랩 브랜드 필름",
    description:
      "하루는 자꾸 쌓입니다. 앱은 많은데, 쓸수록 무거워지죠. 그래서 덜어냈습니다. 경인리랩이 앱을 만드는 기준을 담은 브랜드 필름입니다.",
    uploadDate: "2026-09-19",
    duration: "PT33S",
  },
  {
    id: "7YPGFyLVMNM",
    title: "일상을 가볍게 — 경인리랩 소개",
    description:
      "쌓이는 하루에서 덜어내는 것을 택했습니다. 한 번의 동작, 그게 전부. 경인리랩 브랜드 타이포그래피 영상입니다.",
    uploadDate: "2026-09-19",
    duration: "PT16S",
  },
];

/** 유튜브가 만들어 주는 미리보기 그림 */
export const videoThumbnail = (id: string) =>
  `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

export const videoUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
