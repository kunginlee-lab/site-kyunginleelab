import Link from "next/link";
import { site } from "@/site.config";
import { apps } from "@/content/apps";
import LogoMark from "@/components/logo";
import EmailLink from "@/components/email-link";

const [emailUser, emailDomain] = site.email.split("@");

export default function Footer() {
  const { registrationNumber, representative, address } = site.business;
  const bizLines = [
    `상호 ${site.name} (${site.legalNameEn})`,
    representative && `대표 ${representative}`,
    `사업자등록번호 ${registrationNumber}`,
    address && `주소 ${address}`,
  ].filter(Boolean) as string[];

  return (
    <footer className="footer-bg">
      <div className="mx-auto max-w-6xl px-6 pb-14 pt-20">
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
                <EmailLink
                  user={emailUser}
                  domain={emailDomain}
                  showAddress
                  className="text-muted transition-colors hover:text-ink"
                >
                  이메일 문의
                </EmailLink>
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
        <div className="hairline mt-12" />
        <div className="space-y-1 pt-6 text-xs leading-relaxed text-muted">
          {bizLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>
            이메일{" "}
            <EmailLink user={emailUser} domain={emailDomain} showAddress>
              (JS 필요)
            </EmailLink>
          </p>
          <p className="pt-3">
            © {new Date().getFullYear()} {site.name} ({site.nameEn}). All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
