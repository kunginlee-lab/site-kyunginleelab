# 경인리랩 — 사업자 사이트

경인리랩(Gyeongin ReLab) 공식 웹사이트. Next.js 정적 사이트(`output: "export"`)로,
Cloudflare Pages·Vercel·Firebase Hosting 어디서든 그대로 호스팅할 수 있습니다.

## 새 앱 추가하는 법 (코드 수정 없음)

1. `public/apps/<slug>/` 폴더에 자산을 넣는다:
   - `icon.png` (512×512) — 필수
   - `screen-1.webp` … (720×1600 권장) — 선택
   - `og.png` (1024×500) — 선택 (SNS 공유 이미지)
2. `content/apps.ts`의 `apps` 배열에 항목을 추가한다.
   - 제품 페이지(`/<slug>/`), 홈 카드, sitemap이 자동 생성된다.
   - 선택 필드(`screens`·`features`·`pricing`·`legalLinks`)는 비우면
     해당 섹션이 페이지에서 빠진다 (무료 앱이면 `pricing` 생략).
3. 출시되면 `status: "live"` + `playUrl`로 바꾼다 → 버튼이 "받기"로 바뀐다.
4. 홈 상단 스크롤 쇼케이스에 올릴 앱 하나에 `featured: true` (screens·features 필요).
   제품 그리드는 3열이고 출시된 앱이 먼저 오며, 푸터 목록은 5개부터 두 단이 된다 —
   앱이 10개를 넘어도 코드 수정 없이 늘어난다.

## 반드시 채워야 할 값 — `site.config.ts`

| 키 | 내용 |
|---|---|
| `nameEn` | 영문 상호 확정본 (D-U-N-S 신청서·도메인과 반드시 동일 표기) |
| `url` | 커스텀 도메인 연결 후 실제 도메인 |
| `business.representative` | 대표자 성명 (사업자등록증 기준) |
| `business.address` | 사업장 주소 (전자상거래 표기 의무) |

## 개발

```bash
npm run dev     # 개발 서버
npm run build   # 정적 빌드 → out/
```

## 배포 (Cloudflare Pages)

1. GitHub에 push
2. dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git
3. 빌드 명령 `npm run build` · 출력 디렉터리 `out` → Deploy
4. Custom domains에서 도메인 추가 → 연결 후 `site.config.ts`의 `url` 교체 → push

Cloudflare Pages 무료 플랜은 상업적 사용이 허용됩니다 (Vercel Hobby는 비상업용).
