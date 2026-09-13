import { site } from "@/site.config";

export default function Footer() {
  const { registrationNumber, representative, address } = site.business;
  const bizLine = [
    `상호 ${site.name}`,
    representative && `대표 ${representative}`,
    `사업자등록번호 ${registrationNumber}`,
    address,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl space-y-3 px-5 py-10 text-sm text-muted">
        <p className="font-semibold text-ink">
          {site.name}{" "}
          <span className="font-normal text-muted">{site.nameEn}</span>
        </p>
        <p>{bizLine}</p>
        <p>
          이메일{" "}
          <a
            href={`mailto:${site.email}`}
            className="underline decoration-line underline-offset-4 transition-colors hover:text-ink"
          >
            {site.email}
          </a>
        </p>
        <p className="pt-2 text-xs">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
