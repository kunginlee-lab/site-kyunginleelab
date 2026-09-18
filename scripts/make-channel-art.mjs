// 유튜브 채널 아트 만들기 — 배너와 프로필 사진.
//
//   node scripts/make-channel-art.mjs
//
// 만들어지는 것 (brand-assets/youtube/ — 사이트가 쓰지 않으므로 public/ 밖에 둔다)
//   banner.png   2048×1152  채널 배너
//   avatar.png    800×800   프로필 사진
//
// 배너에서 가장 까다로운 건 기기마다 보이는 범위가 다르다는 점이다.
// TV 는 2048×1152 를 다 보여 주지만, 휴대폰은 가운데 1235×338 만 보인다.
// 그래서 이름·로고·한 줄 소개는 전부 그 안전 영역 안에 넣고, 바깥쪽은
// 배경과 은은한 빛만 이어지게 둔다 — 넓은 화면에서 잘린 것처럼 보이지 않도록.
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const OUT = resolve("brand-assets/youtube");
const MARK = resolve("public/brand/icon-1024.png");

// 사이트와 같은 색 (app/globals.css)
const BG = "#0d0f0c";
const INK = "#ecede8";
const MUTED = "#979d90";
const ACCENT = "#3ea076";

const W = 2048;
const H = 1152;
/** 휴대폰에서도 보이는 가운데 영역 */
const SAFE_W = 1235;
const SAFE_H = 338;

const FONT = "Pretendard, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif";

function banner() {
  const cx = W / 2;
  const cy = H / 2;
  // 안전 영역 안에서 [로고 | 글] 한 덩어리를 가운데 놓는다
  const markSize = 168;
  const gap = 44;
  const textW = 540;   // 가운데 정렬 기준 — 실제 글이 차지하는 폭
  const blockW = markSize + gap + textW;
  const left = cx - blockW / 2;
  const textX = left + markSize + gap;

  return Buffer.from(`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
     xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#141813"/>
      <stop offset="0.55" stop-color="${BG}"/>
      <stop offset="1" stop-color="#080a07"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.42">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="${ACCENT}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- 넓은 화면에서만 보이는 장식 — 안전 영역 밖이라 잘려도 그만 -->
  <g stroke="${ACCENT}" stroke-opacity="0.13" fill="none" stroke-width="2">
    <circle cx="${cx}" cy="${cy}" r="430"/>
    <circle cx="${cx}" cy="${cy}" r="560"/>
  </g>

  <g>
    <text x="${textX}" y="${cy - 26}" font-family="${FONT}" font-size="86"
          font-weight="800" fill="${INK}" letter-spacing="-2">경인리랩</text>
    <text x="${textX + 4}" y="${cy + 22}" font-family="${FONT}" font-size="25"
          font-weight="700" fill="${ACCENT}" letter-spacing="7">KYUNGIN LEELAB</text>
    <text x="${textX}" y="${cy + 92}" font-family="${FONT}" font-size="33"
          font-weight="500" fill="${MUTED}">일상을 가볍게 만드는 앱을 만듭니다</text>
  </g>

</svg>`);
}

mkdirSync(OUT, { recursive: true });

// 로고를 배너 위에 얹는다 (SVG 안에서 외부 이미지를 참조하면 librsvg 가 막는다).
// density 를 올리면 글자가 또렷해지는 대신 캔버스가 그만큼 커진다 — 먼저 2048×1152
// 로 되돌린 다음에 얹어야 좌표가 SVG 안의 배치와 맞는다.
const markSize = 196;
const blockW = 168 + 44 + 540;
const markLeft = Math.round(W / 2 - blockW / 2 - 14);
const markTop = Math.round(H / 2 - markSize / 2 + 6);

const base = await sharp(banner(), { density: 144 })
  .resize(W, H)
  .png()
  .toBuffer();
// 아이콘의 둥근 검은 판을 걷어내고 은빛 KL 만 남긴다. 밝기를 알파로 쓰면
// 어두운 판은 투명해지고 글자만 배너 배경 위에 뜬다 — 스티커처럼 보이지 않는다.
const flat = await sharp(MARK).resize(markSize, markSize).removeAlpha();
const rgb = await flat.clone().toBuffer();
const alpha = await flat
  .clone()
  .greyscale()
  .linear(255 / 80, (-70 * 255) / 80)
  .toColourspace("b-w")
  .toBuffer();
const mark = await sharp(rgb).joinChannel(alpha).png().toBuffer();
await sharp(base)
  .composite([{ input: mark, left: markLeft, top: markTop }])
  .png({ compressionLevel: 9 })
  .toFile(resolve(OUT, "banner.png"));
console.log(`  ✓ banner.png ${W}×${H} (안전 영역 ${SAFE_W}×${SAFE_H})`);

// 프로필 사진 — 유튜브도 원형으로 자르므로 마크가 원 안에 들어가는 원본을 그대로 쓴다
await sharp(MARK).resize(800, 800, { kernel: "lanczos3" }).png({ compressionLevel: 9 })
  .toFile(resolve(OUT, "avatar.png"));
console.log("  ✓ avatar.png 800×800");
