import type { Metadata, Viewport } from "next";
import "./pretendard.css"; // 자체 호스팅 Pretendard (dynamic subset — 필요한 글자 범위만 내려받는다)
import "./globals.css";
import { site } from "@/site.config";
import Header from "@/components/header";
import Footer from "@/components/footer";
import OverlayScrollbar from "@/components/overlay-scrollbar";

const description = `${site.name}(${site.nameEn})은 프라이버시를 우선하는 모바일 앱을 만드는 소프트웨어 스튜디오입니다.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description,
  keywords: [
    site.name,
    site.nameEn,
    site.legalNameEn,
    "소프트웨어 스튜디오",
    "모바일 앱 개발",
    "CaloSnap",
    "칼로리 기록 앱",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    siteName: site.name,
    locale: "ko_KR",
    type: "website",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0f0c" },
  ],
};

// 검색엔진용 조직 정보 (Google 지식 패널·리치 결과)
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: [site.nameEn, site.legalNameEn],
  legalName: site.legalNameEn,
  url: site.url,
  logo: `${site.url}/brand/logo-mark.png`,
  foundingDate: "2026",
  founder: { "@type": "Person", name: site.business.representative },
  address: {
    "@type": "PostalAddress",
    streetAddress: "덕영대로1555번길 20",
    addressLocality: "수원시 영통구",
    addressRegion: "경기도",
    addressCountry: "KR",
  },
  taxID: site.business.registrationNumber,
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  inLanguage: "ko-KR",
  publisher: { "@type": "Organization", name: site.name, url: site.url },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <script
          // 리빌 애니메이션은 JS가 있을 때만 콘텐츠를 숨긴다 (no-JS 대비)
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <OverlayScrollbar />
      </body>
    </html>
  );
}
