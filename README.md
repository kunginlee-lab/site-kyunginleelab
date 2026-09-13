# 경인리랩 — 사업자 사이트

경인리랩(Gyeongin ReLab) 공식 웹사이트. Next.js 정적 사이트(`output: "export"`)로,
Vercel·Firebase Hosting·Cloudflare Pages 어디서든 그대로 호스팅할 수 있습니다.

## 반드시 채워야 할 값 — `site.config.ts` 한 곳만 보면 됩니다

| 키 | 내용 |
|---|---|
| `nameEn` | 영문 상호 확정본 (D-U-N-S 신청서·도메인과 반드시 동일 표기) |
| `url` | 커스텀 도메인 연결 후 실제 도메인 |
| `business.representative` | 대표자 성명 (사업자등록증 기준) |
| `business.address` | 사업장 주소 (전자상거래 표기 의무) |
| `calosnap.playUrl` | 프로덕션 출시 후 Play 스토어 링크 (채우면 버튼이 "받기"로 바뀜) |

## 개발

```bash
npm run dev     # 개발 서버
npm run build   # 정적 빌드 → out/
```

## 배포 (Vercel)

1. GitHub에 push
2. vercel.com/new 에서 이 저장소 import — 프레임워크 자동 감지, 설정 불필요
3. Settings → Domains 에서 커스텀 도메인 추가 → 안내대로 DNS 설정
4. 도메인 연결 후 `site.config.ts`의 `url` 교체 → push (sitemap·OG 갱신)

주의: Vercel Hobby(무료) 플랜은 약관상 비상업용입니다. 사업자 사이트이므로
장기적으로는 Pro 전환 또는 Firebase Hosting/Cloudflare Pages 이전을 고려하세요.
`out/` 폴더를 그대로 올리면 되도록 정적 export로 만들어 두었습니다.
