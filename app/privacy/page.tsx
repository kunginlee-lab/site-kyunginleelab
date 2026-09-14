import type { Metadata } from "next";
import { site } from "@/site.config";
import { apps } from "@/content/apps";
import EmailLink from "@/components/email-link";
import JsonLd, { breadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${site.name}(${site.legalNameEn}) 웹사이트 및 모바일 앱의 개인정보처리방침`,
  alternates: { canonical: "/privacy/" },
  openGraph: { url: "/privacy/", title: "개인정보처리방침" },
};

const [emailUser, emailDomain] = site.email.split("@");

// 앱에서 다루는 정보 — 각 앱의 개별 방침과 어긋나지 않게 "기기 내 저장"을 기본으로 둔다.
const appData = [
  {
    kind: "계정 정보",
    items: "로그인에 사용한 Google 계정 이메일, 계정 식별자",
    where: "서버 (Google Firebase)",
    why: "로그인, 구독 상태 확인",
  },
  {
    kind: "구독·이용 정보",
    items: "구독 상태, 결제 식별 정보, 유료 기능 사용 횟수",
    where: "서버 (Google Firebase · Google Play)",
    why: "유료 서비스 제공 및 결제 관리",
  },
  {
    kind: "이용자가 기록한 콘텐츠",
    items: "식사 기록, 사진, 통계, 목표·프로필 등 앱 안에서 만든 데이터",
    where: "이용자 기기 내부에만 저장 (서버로 전송하지 않음)",
    why: "앱 기능 제공",
  },
  {
    kind: "AI 분석 입력",
    items: "분석을 요청한 사진 1장",
    where: "분석 순간에만 전송, 결과 반환 후 즉시 폐기 (서버 미저장)",
    why: "사진 분석 기능 제공",
  },
  {
    kind: "자동 수집 정보",
    items: "기기 모델, OS 버전, 앱 버전, 오류 로그",
    where: "서버 (오류 분석 도구)",
    why: "오류 분석 및 품질 개선",
  },
];

const processors = [
  {
    name: "Google LLC — Firebase",
    task: "회원 인증, 구독 상태·사용량 저장, 오류 분석",
  },
  { name: "Google LLC — Gemini API", task: "사진 분석 (전송 후 즉시 폐기)" },
  { name: "Google LLC — Google Play", task: "인앱 결제(구독) 처리" },
];

// 앱별 방침 — 사이트 안 문서(legal)가 있으면 그 링크, 없으면 외부 링크
const appPolicies = apps.flatMap((app) => [
  ...(app.legal
    ? [
        { app: app.name, label: "개인정보처리방침", url: `/${app.slug}/privacy/` },
        { app: app.name, label: "계정 삭제 안내", url: `/${app.slug}/delete-account/` },
      ]
    : []),
  ...(app.legalLinks ?? []).map((l) => ({ app: app.name, ...l })),
]);

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-16 sm:pt-24">
      <JsonLd
        data={breadcrumb(site.url, [
          { name: "홈", path: "/" },
          { name: "개인정보처리방침", path: "/privacy/" },
        ])}
      />
      <p className="eyebrow mb-3">Privacy</p>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        개인정보처리방침
      </h1>
      <p className="mt-3 text-sm text-muted">
        시행일 {site.privacy.effectiveDate}
      </p>

      <div className="mt-10 space-y-12 leading-relaxed text-muted [&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        <p>
          {site.name}({site.legalNameEn}, 이하 &ldquo;회사&rdquo;)은 「개인정보
          보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 보호하기 위해 다음과
          같이 개인정보처리방침을 수립·공개합니다. 본 방침은 회사 웹사이트(
          {site.url.replace("https://", "")})와 회사가 배포하는 모바일 앱에
          공통으로 적용되며, 앱별 세부 사항은 각 앱의 개인정보처리방침이
          우선합니다.
        </p>

        <section className="space-y-3">
          <h2>1. 웹사이트에서 수집하는 정보</h2>
          <p>
            회사 웹사이트는 회원가입, 쿠키, 방문 분석 도구를 사용하지 않으며
            개인정보를 수집하지 않습니다. 이메일로 문의를 보내신 경우 발신
            이메일 주소와 문의 내용을 답변 목적으로만 보관합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2>2. 앱에서 수집하는 정보와 저장 위치</h2>
          <p>
            회사의 앱은 이용자가 만든 기록을 기기 안에만 두는 것을 원칙으로
            하며, 서버에는 서비스 운영에 꼭 필요한 최소한의 정보만 저장합니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left text-ink">
                  <th className="py-2 pr-4 font-semibold">구분</th>
                  <th className="py-2 pr-4 font-semibold">항목</th>
                  <th className="py-2 pr-4 font-semibold">저장 위치</th>
                  <th className="py-2 font-semibold">목적</th>
                </tr>
              </thead>
              <tbody>
                {appData.map((r) => (
                  <tr key={r.kind} className="border-b border-line align-top">
                    <td className="py-3 pr-4 font-medium text-ink">{r.kind}</td>
                    <td className="py-3 pr-4">{r.items}</td>
                    <td className="py-3 pr-4">{r.where}</td>
                    <td className="py-3">{r.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2>3. 개인정보의 이용 목적</h2>
          <ul>
            <li>회원 식별과 로그인 등 서비스 제공 및 운영</li>
            <li>유료 서비스(구독) 제공, 결제 확인 및 이용 한도 관리</li>
            <li>서비스 오류 분석 및 품질 개선</li>
            <li>문의 응대 및 공지사항 전달</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2>4. 보유 및 이용 기간</h2>
          <ul>
            <li>기기 내부에 저장된 데이터: 앱을 삭제하면 함께 삭제됩니다.</li>
            <li>
              서버에 저장된 데이터: 앱 내 계정 삭제 시 즉시 삭제되며, 별도
              요청 시 영업일 기준 7일 이내에 삭제합니다.
            </li>
            <li>
              법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다 —
              계약·청약철회 및 대금결제 기록 5년, 소비자 불만·분쟁처리 기록
              3년 (전자상거래법).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2>5. 처리 위탁 및 국외 이전</h2>
          <p>
            회사는 서비스 제공을 위해 아래 사업자에 개인정보 처리를 위탁하며,
            수탁자의 서버가 국외(미국 등)에 위치하여 개인정보가 국외로 이전될 수
            있습니다.
          </p>
          <ul>
            {processors.map((p) => (
              <li key={p.name}>
                <span className="font-medium text-ink">{p.name}</span> — {p.task}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2>6. 제3자 제공</h2>
          <p>
            회사는 위 위탁 사항 외에 이용자의 개인정보를 제3자에게 제공하지
            않습니다. 다만 이용자가 사전에 동의한 경우 또는 법령에 근거한
            요청이 있는 경우는 예외로 합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2>7. 이용자의 권리와 행사 방법</h2>
          <p>
            이용자는 언제든지 자신의 개인정보를 조회·정정·삭제할 수 있습니다.
            앱 설정의 계정 삭제 기능을 이용하거나, 아래 문의처로 요청하시면
            지체 없이 처리합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2>8. 개인정보의 파기</h2>
          <p>
            보유 기간이 지났거나 처리 목적이 달성된 개인정보는 지체 없이
            파기합니다. 전자적 파일은 복구할 수 없는 방법으로 영구 삭제합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2>9. 개인정보 보호책임자 및 문의처</h2>
          <ul>
            <li>개인정보 보호책임자: {site.privacy.officer}</li>
            <li>
              이메일:{" "}
              <EmailLink
                user={emailUser}
                domain={emailDomain}
                showAddress
                className="text-accent-ink underline decoration-line underline-offset-4"
              >
                이메일 문의 (JS 필요)
              </EmailLink>
            </li>
          </ul>
          <p>
            개인정보 침해에 대한 신고나 상담이 필요한 경우 개인정보침해신고센터
            (privacy.kisa.or.kr, 국번 없이 118)에 문의할 수 있습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2>10. 방침의 변경</h2>
          <p>
            본 방침의 내용이 변경되는 경우 시행일 최소 7일 전에 웹사이트를 통해
            공지합니다.
          </p>
        </section>

        {appPolicies.length > 0 && (
          <section className="space-y-3 pt-8">
            <h2>앱별 개인정보처리방침</h2>
            <ul>
              {appPolicies.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    className="text-accent-ink underline decoration-line underline-offset-4"
                  >
                    {l.app} — {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
