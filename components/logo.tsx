// 경인리랩 마크 — K 모노그램. 배경은 --accent 를 따라가서 라이트/다크 모두 맞는다.
// 원본 SVG: public/brand/logo-mark.svg (아이콘·OG 이미지도 같은 도형에서 생성)
export default function LogoMark({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
    >
      <rect width="100" height="100" rx="22" fill="var(--accent)" />
      <path
        d="M33 27v46M35 50l28-23M35 50l30 23"
        fill="none"
        stroke="#fff"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
