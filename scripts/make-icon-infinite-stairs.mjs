// 무한의 계단 앱 아이콘 만들기.
//
//   node scripts/make-icon-infinite-stairs.mjs
//
// 손으로 그리지 않고 코드로 두는 이유: 색이나 계단 수를 고치면 스토어·런처·
// 사이트용 판본이 한 번에 따라온다. (묘연은 같은 일을 app_saju 쪽
// packages/saju_design/tool/generate_brand_assets.dart 가 맡는다.)
//
// 만들어지는 것
//   ../app_infinite_stairs/assets/icon/icon.png             1024 정사각(스토어·레거시 런처)
//   ../app_infinite_stairs/assets/icon/icon-foreground.png  1024 투명(안드로이드 적응형 전경)
//   ../app_infinite_stairs/assets/icon/icon-background.png  1024 (안드로이드 적응형 배경)
//   public/apps/infinite-stairs/icon.png                    256 (사이트 제품 카드)
//
// 디자인 메모
//  - 예전 아이콘은 계단이 가는 선이라 48px 런처에서 사라지고, 배경의 작은 별들은
//    얼룩으로 뭉쳤다. 획을 굵은 리본으로 바꾸고 별을 걷어냈다.
//  - 리본 아래쪽은 투명하게 풀려 어둠 속에서 올라오는 것처럼 보인다 — "무한".
//  - 적응형 아이콘은 108dp 중 가운데 72dp(약 66%)만 어떤 마스크에도 남는다.
//    전경 판본은 그 원 안에 계단과 구슬이 모두 들어가도록 줄여 넣는다.
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

// ── 색 ────────────────────────────────────────────────────────────────────
const INK_TOP = "#1C0B42";
const INK_BOTTOM = "#06030F";
const BLOOM = "#8B5CF6";

// ── 계단 기하 (로컬 좌표) ─────────────────────────────────────────────────
const STROKE = 60;
const TREAD = 116;
const RISER = 92;
const STEPS = 4;
const ORB_R = 54;

/** 아래에서 올라와 오른쪽 위로 네 칸 오르는 꺾은선. */
function stairPoints() {
  const pts = [];
  let x = 0;
  let y = RISER * (STEPS + 1);
  pts.push([x, y]);
  for (let i = 0; i < STEPS; i++) {
    y -= RISER;
    pts.push([x, y]);
    x += TREAD;
    pts.push([x, y]);
  }
  return pts;
}

const POINTS = stairPoints();
const PATH = POINTS.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
const TOP = POINTS[POINTS.length - 1];
const ORB = [TOP[0], TOP[1] - ORB_R - STROKE / 2 - 20];

/**
 * 마스크가 원이어도 잘리지 않도록, 그림 전체를 감싸는 가장 작은 원을 구한다.
 * 꼭짓점은 둥근 획 끝이라 반지름 STROKE/2 만큼 더 부풀려 센다.
 */
function enclosingCircle() {
  const blobs = [
    ...POINTS.map(([x, y]) => ({ x, y, r: STROKE / 2 })),
    { x: ORB[0], y: ORB[1], r: ORB_R },
  ];
  // 후보 중심을 조금씩 옮겨 가며 가장 먼 점을 끌어당긴다(간단한 수축 반복).
  let cx = 0;
  let cy = 0;
  for (const b of blobs) {
    cx += b.x / blobs.length;
    cy += b.y / blobs.length;
  }
  let stepSize = TREAD;
  for (let i = 0; i < 4000; i++) {
    let far = blobs[0];
    let farD = -Infinity;
    for (const b of blobs) {
      const d = Math.hypot(b.x - cx, b.y - cy) + b.r;
      if (d > farD) {
        farD = d;
        far = b;
      }
    }
    cx += (far.x - cx) * (stepSize / 1000);
    cy += (far.y - cy) * (stepSize / 1000);
    stepSize *= 0.999;
  }
  let r = 0;
  for (const b of blobs) r = Math.max(r, Math.hypot(b.x - cx, b.y - cy) + b.r);
  return { cx, cy, r };
}

const FIT = enclosingCircle();

/**
 * 아이콘 한 장의 SVG.
 * [coverage] 는 그림을 감싸는 원의 지름이 캔버스에서 차지할 비율이다.
 */
function icon({ size, coverage, background, subject = true }) {
  const scale = (coverage * size) / (FIT.r * 2);
  const place = `translate(${size / 2} ${size / 2}) scale(${scale}) translate(${-FIT.cx} ${-FIT.cy})`;
  const ribbon = `
      <path d="${PATH}" fill="none" stroke="url(#ribbon)" stroke-width="${STROKE}"
            stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${ORB[0]}" cy="${ORB[1]}" r="${ORB_R}" fill="url(#orb)"/>`;

  return Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"
     xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ink" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${INK_TOP}"/>
      <stop offset="1" stop-color="${INK_BOTTOM}"/>
    </linearGradient>
    <radialGradient id="bloom" cx="0.46" cy="0.44" r="0.58">
      <stop offset="0" stop-color="${BLOOM}" stop-opacity="0.5"/>
      <stop offset="1" stop-color="${BLOOM}" stop-opacity="0"/>
    </radialGradient>
    <!-- 아래는 어둠에 풀리고 위로 갈수록 뜨거워진다 -->
    <linearGradient id="ribbon" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#5B21B6" stop-opacity="0.12"/>
      <stop offset="0.3" stop-color="#8B3FE8"/>
      <stop offset="0.68" stop-color="#E0479A"/>
      <stop offset="1" stop-color="#FF5CA8"/>
    </linearGradient>
    <radialGradient id="orb" cx="0.38" cy="0.34" r="0.78">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="0.42" stop-color="#A5F3FC"/>
      <stop offset="1" stop-color="#22D3EE"/>
    </radialGradient>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="${Math.round(size * 0.034)}"/>
    </filter>
  </defs>
  ${background ? `<rect width="${size}" height="${size}" fill="url(#ink)"/>
  <rect width="${size}" height="${size}" fill="url(#bloom)"/>` : ""}
  ${subject ? `<g transform="${place}">
    <g filter="url(#glow)" opacity="0.8">${ribbon}</g>
    ${ribbon}
  </g>` : ""}
</svg>`);
}

const OUT_APP = resolve("../app_infinite_stairs/assets/icon");
const OUT_SITE = resolve("public/apps/infinite-stairs");

async function write(path, svg, size, { palette = false } = {}) {
  mkdirSync(dirname(path), { recursive: true });
  // 사이트 카드용 작은 판본만 팔레트로 줄인다 — 매끄러운 그라디언트라 트루컬러로
  // 두면 68KB 가 넘는다. 디더링을 켜면 256 색으로도 띠가 생기지 않는다.
  const out = await sharp(svg, { density: 384 })
    .resize(size, size)
    .png(palette ? { palette: true, dither: 1 } : { compressionLevel: 9 })
    .toFile(path);
  console.log(`  ✓ ${path} (${Math.round(out.size / 1024)}KB)`);
}

// 정사각 판본은 계단이 캔버스의 90% 를 가로지르고, 적응형 전경은 66% 안전 원에 맞춘다.
// 적응형은 배경을 따로 내보내 단색 대신 정사각 판본과 같은 먹빛 그라디언트를 쓴다.
await write(resolve(OUT_APP, "icon.png"), icon({ size: 1024, coverage: 0.9, background: true }), 1024);
await write(resolve(OUT_APP, "icon-foreground.png"), icon({ size: 1024, coverage: 0.66, background: false }), 1024);
await write(resolve(OUT_APP, "icon-background.png"), icon({ size: 1024, coverage: 0.9, background: true, subject: false }), 1024);
await write(resolve(OUT_SITE, "icon.png"), icon({ size: 1024, coverage: 0.9, background: true }), 256, { palette: true });

console.log("무한의 계단 아이콘을 만들었습니다.");
