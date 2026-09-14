import Image from "next/image";

// 원본 public/brand/logo.webp (누끼 딴 KL 모노그램, 300×263) 의 가로/세로 비율
const ASPECT = 300 / 263;

/** 경인리랩 KL 로고. size = 높이(px). 장식용이라 alt 는 비운다 — 링크 쪽에 aria-label 을 준다. */
export default function LogoMark({
  size = 28,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/logo.webp"
      alt=""
      width={Math.round(size * ASPECT)}
      height={size}
      priority={priority}
      className={className}
      style={{ height: size, width: "auto" }}
    />
  );
}
