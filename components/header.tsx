import Link from "next/link";
import { site } from "@/site.config";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold tracking-tight">
            {site.name}
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-widest text-muted sm:inline">
            {site.nameEn}
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/calosnap/"
            className="text-muted transition-colors hover:text-ink"
          >
            CaloSnap
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="rounded-full bg-accent px-4 py-1.5 text-white transition-opacity hover:opacity-85"
          >
            문의하기
          </a>
        </nav>
      </div>
    </header>
  );
}
