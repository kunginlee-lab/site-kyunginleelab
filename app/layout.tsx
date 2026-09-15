import type { Metadata, Viewport } from "next";
import "./pretendard.css"; // 자체 호스팅 Pretendard (dynamic subset — 필요한 글자 범위만 내려받는다)
import "./globals.css";
import { site } from "@/site.config";
import { apps } from "@/content/apps";
import Header from "@/components/header";
import Footer from "@/components/footer";
import OverlayScrollbar from "@/components/overlay-scrollbar";
import PageFade from "@/components/page-fade";

// 검색 결과 요약문 — 브랜드(국문·영문)가 들어가야 "경인리랩" 검색에 걸린다.
// 네이버 권장에 맞춰 80자 이내로 고정 (앱 이름은 각 제품 페이지가 맡는다)
const description = `${site.name}(${site.nameEn})은 데이터를 모으지 않는 모바일 앱을 만드는 수원의 소프트웨어 스튜디오입니다.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // 제목에는 국문 상호를 넣지 않는다 (링크 미리보기 요청). 브랜드 검색은 description·keywords·구조화 데이터가 맡는다
  title: {
    default: site.tagline,
    template: `%s — ${site.nameEn}`,
  },
  description,
  applicationName: site.nameEn,
  authors: [{ name: site.nameEn, url: site.url }],
  creator: site.nameEn,
  publisher: site.legalNameEn,
  category: "technology",
  keywords: [
    site.name,
    site.nameEn,
    site.legalNameEn,
    "소프트웨어 스튜디오",
    "모바일 앱 개발",
    "앱 개발 스튜디오",
    "수원 앱 개발",
    ...apps.flatMap((a) => [a.name, ...(a.keywords ?? [])]),
  ],
  alternates: { canonical: "/" },
  openGraph: {
    siteName: site.nameEn,
    locale: "ko_KR",
    type: "website",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  // 홈 화면에 추가하면 주소창 없이 앱처럼 열린다 (일반 브라우저·카카오 인앱 브라우저의 주소창은 웹에서 못 숨긴다)
  appleWebApp: { capable: true, statusBarStyle: "black", title: site.nameEn },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // 소유 확인 코드는 site.config.ts 의 seo 에 넣으면 여기로 들어간다
  verification: {
    google: site.seo.googleSiteVerification || undefined,
    other: site.seo.naverSiteVerification
      ? { "naver-site-verification": site.seo.naverSiteVerification }
      : undefined,
  },
};

// 사이트는 다크 한 벌만 쓴다 (app/globals.css 참고)
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0d0f0c",
};

// 검색엔진용 조직 정보 (Google 지식 패널·리치 결과).
// @id 를 붙여 두면 다른 페이지의 구조화 데이터가 이 회사를 가리켜 참조할 수 있다
// — 같은 이름이 여러 번 나오는 대신 하나의 대상으로 읽힌다.
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  alternateName: [site.nameEn, site.legalNameEn],
  legalName: site.legalNameEn,
  url: site.url,
  logo: `${site.url}/brand/icon-1024.png`,
  image: `${site.url}/opengraph-image.png`,
  description,
  slogan: site.tagline,
  foundingDate: site.foundingYear,
  founder: { "@type": "Person", name: site.business.representative },
  address: {
    "@type": "PostalAddress",
    streetAddress: "덕영대로1555번길 20",
    addressLocality: "수원시 영통구",
    addressRegion: "경기도",
    addressCountry: "KR",
  },
  areaServed: "KR",
  knowsAbout: ["모바일 앱 개발", "안드로이드 앱", "소프트웨어 스튜디오"],
  taxID: site.business.registrationNumber,
  // 외부 프로필이 생기기 전에는 빈 sameAs 를 두지 않는다 (아무 근거도 못 준다)
  ...(site.profiles.length > 0 && { sameAs: [...site.profiles] }),
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
        {/* 본문 글꼴을 CSS 파싱을 기다리지 않고 바로 받기 시작한다 */}
        <link
          rel="preload"
          href="/fonts/pretendard-subset.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
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
        <PageFade />
      </body>
    </html>
  );
}
