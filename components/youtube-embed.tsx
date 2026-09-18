/**
 * 유튜브 영상.
 *
 * 처음에는 클릭해야 iframe 을 만드는 방식으로 짰다가 되돌렸다. 성능은 그쪽이
 * 낫지만 **구글봇은 클릭하지 않는다** — HTML 에 iframe 이 없으면 "재생할 수 있는
 * 영상이 이 페이지에 있다"는 것을 확인하지 못해 동영상 색인에서 빠진다.
 * 구글도 "사용자 동작 뒤에 영상을 불러오지 말 것"을 명시한다.
 *
 * 대신 loading="lazy" 로 미룬다. iframe 은 HTML 에 있으니 크롤러가 보고,
 * 실제 내려받기는 화면에 가까워질 때 일어난다. 소개 페이지에서 영상은
 * 한참 아래에 있어 대부분의 방문자는 끝까지 내려오지 않는다.
 * 주소는 쿠키를 남기지 않는 판본을 쓴다.
 */
export default function YouTubeEmbed({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-black">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title={title}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
