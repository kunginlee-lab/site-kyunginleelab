import Link from "next/link";
import { site } from "@/site.config";
import { appIcon, appsByStatus, statusLabel } from "@/content/apps";
import LogoMark from "@/components/logo";
import EmailLink from "@/components/email-link";
import ProductsMenu, { type MenuApp } from "@/components/products-menu";

const [emailUser, emailDomain] = site.email.split("@");

// 제품 메가 메뉴에 넘길 목록 — 출시된 앱 먼저 (content/apps.ts 에 추가하면 자동으로 늘어난다)
const menuApps: MenuApp[] = appsByStatus.map((a) => ({
  slug: a.slug,
  name: a.name,
  tagline: a.tagline,
  icon: appIcon(a),
  statusLabel: statusLabel[a.status],
}));

const linkClass = "text-muted transition-colors hover:text-ink";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-[52px] max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label={`${site.name} 홈`}
          className="flex items-center gap-3"
        >
          <LogoMark size={26} priority />
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-muted min-[400px]:inline">
            {site.nameEn}
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-[13px] font-medium sm:gap-6">
          <Link href="/#about" className={linkClass}>
            소개
          </Link>
          <ProductsMenu apps={menuApps} className={linkClass} />
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
