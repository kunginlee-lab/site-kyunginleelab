# 경인리랩 공식 사이트

**경인리랩**(Kyungin LeeLab)은 경기도 수원에 있는 소프트웨어 스튜디오입니다.
기록을 서버에 모으지 않고 사용자의 기기 안에 두는 모바일 앱을 만듭니다.
이 저장소는 회사 사이트 [kyunginleelab.com](https://kyunginleelab.com) 의 소스입니다.

Next.js 정적 내보내기(`output: "export"`)라 빌드 결과가 순수 HTML·CSS·JS 입니다.
Cloudflare Pages 에 올려 두었고, 어느 정적 호스팅으로 옮겨도 그대로 돕니다.

## 만들고 있는 앱

| 앱 | 하는 일 |
|---|---|
| [CaloSnap](https://kyunginleelab.com/calosnap/) | 식사 사진 한 장으로 칼로리와 탄단지를 기록 |
| [MyVoice](https://kyunginleelab.com/myvoice/) | 내 목소리로 글을 읽고 노래를 부름 |
| [묘연](https://kyunginleelab.com/myoyeon/) | 절기를 천문 계산으로 산출하는 정밀 만세력 사주 |
| [무한의 계단](https://kyunginleelab.com/infinite-stairs/) | 리듬처럼 두드려 올라가는 캐주얼 아케이드 |

## 새 앱 추가하는 법 (페이지 코드는 건드리지 않는다)

1. `public/apps/<slug>/` 에 자산을 넣는다.
   - `icon.png` (512×512) — 필수
   - `screen-1.webp` … (720×1600 권장) — 선택
   - `og.png` (1024×500) — 선택, 공유 카드
2. `content/apps.ts` 의 `apps` 배열에 항목 하나를 추가한다.
   제품 페이지(`/<slug>/`)·홈 카드·제품 목록·사이트맵이 따라서 생긴다.
   선택 필드(`screens`·`features`·`pricing`·`legal`)는 비우면 그 구획이 페이지에서 빠진다.
3. 출시되면 `status: "live"` 와 `playUrl` 로 바꾼다 — 버튼이 스토어로 이어진다.
4. 홈 상단 쇼케이스에 세울 앱 하나에 `featured: true` (screens·features 가 있어야 한다).

앱이 열 개를 넘어도 페이지 코드는 손대지 않는다. 제품 그리드는 출시된 앱을 앞에
놓고, 푸터 목록은 다섯 개부터 두 단으로 갈라진다.

## 사업자 정보는 한 곳에서

`site.config.ts` 가 상호·대표·주소·이메일·소유 확인 코드를 모두 쥐고 있다.
푸터, 구조화 데이터, 개인정보처리방침이 전부 이 파일을 읽는다.

`profiles` 배열은 같은 회사를 가리키는 바깥 주소(schema.org `sameAs`)를 담는다.
검색엔진은 자기 사이트 한 곳의 주장만으로 회사를 확정하지 않는다 — Play 개발자
페이지나 GitHub 프로필이 생기면 여기에 주소만 넣으면 구조화 데이터가 따라간다.

## 명령

```bash
npm run dev     # 개발 서버
npm run build   # 정적 빌드 → out/   (빌드 전에 폰트 서브셋을 자동으로 만든다)
npm run lint
npm run seo     # 검색 노출 점검 — 사이트맵의 주소를 하나씩 받아 확인
npm run perf    # 모바일 기준 Core Web Vitals 측정
npm run qa      # 헤드리스 크롬으로 PC·모바일 화면 캡처
```

`npm run seo` 는 사이트맵의 주소를 전부 받아 title·description 길이, canonical,
OG 태그, h1, 구조화 데이터, 사이트맵이 가리키는 그림이 열리는지까지 확인한다.
배포 뒤 한 번 돌리면 "검색에 안 잡히는" 실수를 대부분 잡아낸다.

## 배포

```bash
npm run build
npx wrangler@latest pages deploy out --project-name kyunginleelab --branch main
```

서버가 필요 없는 정적 파일이다. Cloudflare Pages 무료 플랜은 상업적 사용을 허용한다.

## 라이선스

소스는 공개하지만 상호·로고·앱 이름과 그림은 경인리랩의 것입니다.
