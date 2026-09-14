"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useState, type ReactNode } from "react";

export type SearchApp = {
  slug: string;
  name: string;
  tagline: string;
  short: string;
  icon: string;
  statusLabel: string;
  keywords?: string[];
};

const MAX_RESULTS = 6;

/** 검색어와 일치하는 부분을 강조 */
function mark(text: string, terms: string[]): ReactNode {
  if (terms.length === 0) return text;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    terms.some((t) => part.toLowerCase() === t) ? (
      <mark key={i} className="bg-transparent text-accent-ink">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/**
 * 앱 검색 — 입력과 동시에 이름·설명·키워드로 걸러 보여준다. 앱이 늘어나도 그대로 동작.
 */
export default function AppSearch({ apps }: { apps: SearchApp[] }) {
  const [q, setQ] = useState("");
  const inputId = useId();
  const query = q.trim().toLowerCase();
  const terms = useMemo(() => (query ? query.split(/\s+/).filter(Boolean) : []), [query]);

  const results = useMemo(() => {
    if (terms.length === 0) return [];
    return apps
      .filter((a) => {
        const hay = [a.name, a.tagline, a.short, a.slug, ...(a.keywords ?? [])]
          .join(" ")
          .toLowerCase();
        return terms.every((t) => hay.includes(t));
      })
      .slice(0, MAX_RESULTS);
  }, [apps, terms]);

  return (
    <div>
      <label htmlFor={inputId} className="sr-only">
        앱 검색
      </label>
      <div className="glass flex items-center gap-3 rounded-full border border-line px-5 py-3 transition-colors focus-within:border-accent">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id={inputId}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="앱 이름이나 하는 일로 찾기 — 예: 칼로리, 사진"
          autoComplete="off"
          enterKeyHint="search"
          className="w-full bg-transparent text-base outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label="검색어 지우기"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-line text-xs text-muted transition-colors hover:text-ink"
          >
            ✕
          </button>
        )}
      </div>

      <div aria-live="polite" className="mt-4 min-h-6">
        {terms.length > 0 && results.length === 0 && (
          <p className="px-2 text-center text-sm text-muted">
            &ldquo;{q.trim()}&rdquo;에 맞는 앱이 아직 없습니다.
          </p>
        )}
        {results.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((app, i) => (
              <li key={app.slug} className="pop-in" style={{ animationDelay: `${i * 40}ms` }}>
                <Link
                  href={`/${app.slug}/`}
                  className="glass flex items-center gap-4 rounded-2xl border border-line p-4 transition-colors hover:border-accent"
                >
                  <Image
                    src={app.icon}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-xl border border-line"
                  />
                  <span className="min-w-0">
                    <span className="block truncate font-bold tracking-tight">
                      {mark(app.name, terms)}
                      <span className="ml-2 align-middle text-[11px] font-semibold text-accent-ink">
                        {app.statusLabel}
                      </span>
                    </span>
                    <span className="block truncate text-sm text-muted">
                      {mark(app.tagline, terms)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
