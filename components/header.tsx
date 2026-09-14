import Link from "next/link";
import { site } from "@/site.config";
import LogoMark from "@/components/logo";
import EmailLink from "@/components/email-link";

const nav = [
  { label: "소개", href: "/#about" },
  { label: "제품", href: "/#apps" },
];

const [emailUser, emailDomain] = site.email.split("@");

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-[52px] max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label={`${site.name} 홈`}
          className="flex items-center gap-3"
        >
          <LogoMark size={28} />
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-muted min-[400px]:inline">
            {site.nameEn}
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-[13px] font-medium sm:gap-6">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-muted transition-colors hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
          <EmailLink
            user={emailUser}
            domain={emailDomain}
            className="rounded-full bg-ink px-3.5 py-1.5 text-[13px] text-bg transition-opacity hover:opacity-85"
          >
            문의하기
          </EmailLink>
        </nav>
      </div>
    </header>
  );
}
