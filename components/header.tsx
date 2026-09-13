import Link from "next/link";
import { site } from "@/site.config";

const nav = [
  { label: "소개", href: "/#about" },
  { label: "제품", href: "/#apps" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="text-lg font-extrabold tracking-tight">
            {site.name}
          </span>
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-muted sm:inline">
            {site.nameEn}
          </span>
        </Link>
        <nav className="flex items-center gap-7 text-sm font-medium">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="hidden text-muted transition-colors hover:text-ink sm:inline"
            >
              {n.label}
            </Link>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="rounded-full bg-ink px-4.5 py-2 text-bg transition-opacity hover:opacity-85"
          >
            문의하기
          </a>
        </nav>
      </div>
    </header>
  );
}
