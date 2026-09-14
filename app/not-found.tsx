import Link from "next/link";
import LogoMark from "@/components/logo";

export default function NotFound() {
  return (
    <section className="hero-bg">
      <div className="mx-auto flex min-h-[70dvh] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
        <LogoMark size={56} />
        <p className="eyebrow mt-10">404</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-4 max-w-md text-muted">
          주소가 바뀌었거나 삭제된 페이지입니다. 홈에서 다시 찾아보세요.
        </p>
        <Link
          href="/"
          className="mt-10 inline-block rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-bg transition-opacity hover:opacity-85"
        >
          홈으로
        </Link>
      </div>
    </section>
  );
}
