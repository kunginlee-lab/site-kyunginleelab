import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { site } from "@/site.config";
import type { LegalBlock, LegalDoc } from "@/content/legal";
import EmailLink from "@/components/email-link";

const [emailUser, emailDomain] = site.email.split("@");

/** **굵게**, [텍스트](주소), {email} 을 React 노드로 */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)|\{email\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(
        <strong key={k++} className="font-semibold text-ink">
          {m[1]}
        </strong>,
      );
    } else if (m[2] !== undefined) {
      const href = m[3];
      const cls = "text-accent-ink underline decoration-line underline-offset-4 hover:opacity-80";
      out.push(
        href.startsWith("/") ? (
          <Link key={k++} href={href} className={cls}>
            {m[2]}
          </Link>
        ) : (
          <a key={k++} href={href} className={cls} rel="noopener">
            {m[2]}
          </a>
        ),
      );
    } else {
      out.push(
        <EmailLink
          key={k++}
          user={emailUser}
          domain={emailDomain}
          showAddress
          className="text-accent-ink underline decoration-line underline-offset-4"
        >
          이메일 (JS 필요)
        </EmailLink>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Block({ b }: { b: LegalBlock }) {
  switch (b.type) {
    case "h2":
      return <h2 className="mt-12 text-lg font-bold tracking-tight text-ink">{b.text}</h2>;
    case "p":
      return <p className="mt-4">{inline(b.text)}</p>;
    case "note":
      return (
        <div className="glass mt-6 rounded-2xl border border-line p-5 text-[0.95rem] leading-relaxed">
          {b.title && (
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-accent-ink">
              {b.title}
            </p>
          )}
          <p>{inline(b.text)}</p>
        </div>
      );
    case "ul":
      return (
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {b.items.map((it, i) => (
            <li key={i}>{inline(it)}</li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="glass mt-5 space-y-3 rounded-2xl border border-line p-5">
          {b.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                {i + 1}
              </span>
              <span>{inline(it)}</span>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-ink">
                {b.head.map((h) => (
                  <th key={h} className="pb-2 pr-4 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, i) => (
                <tr key={i} className="align-top">
                  {row.map((cell, j) => (
                    <td key={j} className="pr-4 pt-3">
                      <div className="hairline mb-3" />
                      {j === 0 ? <span className="font-medium text-ink">{inline(cell)}</span> : inline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/** 앱 법적 문서 한 편 — 회사 개인정보처리방침 페이지와 같은 톤 */
export default function LegalDocView({
  appName,
  appHref,
  doc,
  sibling,
}: {
  appName: string;
  appHref: string;
  doc: LegalDoc;
  /** 함께 볼 문서 링크 (개인정보처리방침 ↔ 계정 삭제 안내) */
  sibling?: { label: string; href: string };
}) {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-14 sm:pt-20">
      <Link
        href={appHref}
        className="text-sm font-semibold text-muted transition-colors hover:text-ink"
      >
        ← {appName}
      </Link>
      <p className="eyebrow mt-8 mb-3">{appName}</p>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{doc.title}</h1>
      <p className="mt-3 text-sm text-muted">최종 수정 {doc.updated}</p>

      <div className="mt-8 leading-relaxed text-muted">
        {doc.blocks.map((b, i) => (
          <Fragment key={i}>
            <Block b={b} />
          </Fragment>
        ))}
      </div>

      {sibling && (
        <div className="mt-16">
          <div className="hairline" />
          <Link
            href={sibling.href}
            className="mt-6 inline-block text-sm font-semibold text-accent-ink transition-opacity hover:opacity-80"
          >
            {sibling.label} →
          </Link>
        </div>
      )}
    </article>
  );
}
