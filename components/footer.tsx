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
        {/* 세 블록을 양끝에 붙여 균등 배분 (모바일은 세로 쌓임) */}
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between sm:gap-12">
          <div>
            <LogoMark size={36} className="mb-4" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
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
            {/* 앱이 많아지면 두 단으로 */}
            <ul
              className={`mt-4 text-sm [&>li]:mb-2.5 ${apps.length > 4 ? "sm:columns-2 sm:gap-x-8" : ""}`}
            >
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
          {/* 한 줄에 균등 배분(space-between). 구분점은 항목 앞에 붙여 두어 줄바꿈 때 줄 끝에 홀로 남지 않는다 */}
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-between">
            {[
              ...bizLines,
              <span key="email">
                이메일{" "}
                <EmailLink user={emailUser} domain={emailDomain} showAddress>
                  (JS 필요)
                </EmailLink>
              </span>,
            ].map((item) => (
              <span
                key={typeof item === "string" ? item : "email"}
                className="whitespace-nowrap [&:not(:first-child)]:before:mr-3 [&:not(:first-child)]:before:opacity-50 [&:not(:first-child)]:before:content-['·']"
              >
                {item}
              </span>
            ))}
          </p>
          <p className="pt-3 text-center">
            © {new Date().getFullYear()} {site.nameEn}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
