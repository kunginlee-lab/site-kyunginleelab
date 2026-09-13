import Link from "next/link";
import { site } from "@/site.config";
import { apps } from "@/content/apps";
import LogoMark from "@/components/logo";

export default function Footer() {
  const { registrationNumber, representative, address } = site.business;
  const bizLine = [
    `상호 ${site.name} (${site.legalNameEn})`,
    representative && `대표 ${representative}`,
    `사업자등록번호 ${registrationNumber}`,
    `이메일 ${site.email}`,
    address,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <LogoMark size={36} className="mb-4" />
            <p className="text-lg font-extrabold tracking-tight">{site.name}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              {site.nameEn}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {site.tagline}.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Products
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {apps.map((app) => (
                <li key={app.slug}>
                  <Link
                    href={`/${app.slug}/`}
                    className="text-muted transition-colors hover:text-ink"
                  >
                    {app.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Contact
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-muted transition-colors hover:text-ink"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <Link
                  href="/privacy/"
                  className="text-muted transition-colors hover:text-ink"
                >
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 space-y-2 border-t border-line pt-6 text-xs text-muted">
          <p>{bizLine}</p>
          <p>
            © {new Date().getFullYear()} {site.name} ({site.nameEn}). All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
