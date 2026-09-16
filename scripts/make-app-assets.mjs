// 앱 자산 만들기 — 스크린샷 원본을 사이트 규격으로 맞춘다.
//
//   node scripts/make-app-assets.mjs <slug> <스크린샷 폴더> <아이콘 png> "<제목>" "<한 줄 설명>"
//
// 예)
//   node scripts/make-app-assets.mjs infinite-stairs \
//     "../app_infinite_stairs/docs/screenshots" \
//     "../app_infinite_stairs/assets/icon/icon.png" \
//     "무한의 계단" "리듬처럼 두드려 올라가는 캐주얼 아케이드"
//
// 만들어지는 것 (public/apps/<slug>/):
//   icon.png      256×256
//   screen-N.webp 720×1600 (넘치는 폭은 가운데 기준으로 잘라 맞춘다)
//   og.png        1024×500 (SNS 공유 카드)
import { mkdirSync, readdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import sharp from "sharp";

const [slug, shotsDir, iconPath, title, tagline] = process.argv.slice(2);
if (!slug || !shotsDir || !iconPath) {
  console.error("사용법: node scripts/make-app-assets.mjs <slug> <스크린샷폴더> <아이콘> \"<제목>\" \"<설명>\"");
  process.exit(1);
}

const OUT = resolve("public/apps", slug);
mkdirSync(OUT, { recursive: true });

const SCREEN_W = 720;
const SCREEN_H = 1600;

// 1) 아이콘
await sharp(resolve(iconPath))
  .resize(256, 256, { fit: "cover" })
  .png({ quality: 92 })
  .toFile(join(OUT, "icon.png"));
console.log("icon.png 256×256");

// 2) 스크린샷 — 파일명 순서를 그대로 screen-1..N 으로
const sources = readdirSync(resolve(shotsDir))
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .sort();

const picked = [];
for (const [i, file] of sources.entries()) {
  const src = resolve(shotsDir, file);
  const meta = await sharp(src).metadata();

  // 목표 비율(0.45)보다 넓으면 좌우를, 좁으면 위아래를 가운데 기준으로 자른다.
  const targetRatio = SCREEN_W / SCREEN_H;
  const ratio = meta.width / meta.height;
  const crop = ratio > targetRatio
    ? {
        left: Math.round((meta.width - meta.height * targetRatio) / 2),
        top: 0,
        width: Math.round(meta.height * targetRatio),
        height: meta.height,
      }
    : {
        left: 0,
        top: Math.round((meta.height - meta.width / targetRatio) / 2),
        width: meta.width,
        height: Math.round(meta.width / targetRatio),
      };

  const out = join(OUT, `screen-${i + 1}.webp`);
  await sharp(src)
    .extract(crop)
    .resize(SCREEN_W, SCREEN_H)
    .webp({ quality: 82 })
    .toFile(out);
  picked.push({ file: basename(out), src });
  console.log(`${basename(out)} ← ${file}`);
}

// 3) OG 카드 — 왼쪽에 글, 오른쪽에 스크린샷 두 장.
if (title) {
  const W = 1024;
  const H = 500;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

  const bg = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0A0617"/>
          <stop offset="60%" stop-color="#1B0B34"/>
          <stop offset="100%" stop-color="#2A1050"/>
        </linearGradient>
        <radialGradient id="glow" cx="0.22" cy="0.4" r="0.6">
          <stop offset="0%" stop-color="#A855F7" stop-opacity="0.38"/>
          <stop offset="100%" stop-color="#A855F7" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#g)"/>
      <rect width="${W}" height="${H}" fill="url(#glow)"/>
      <text x="64" y="212" font-family="Malgun Gothic, Segoe UI, sans-serif"
            font-size="64" font-weight="800" fill="#F8FAFC">${esc(title)}</text>
      <text x="64" y="268" font-family="Malgun Gothic, Segoe UI, sans-serif"
            font-size="26" fill="#C4B5FD">${esc(tagline ?? "")}</text>
      <text x="64" y="408" font-family="Malgun Gothic, Segoe UI, sans-serif"
            font-size="22" fill="#94A3B8">경인리랩</text>
    </svg>`);

  const layers = [];
  const shots = picked.slice(0, 2);
  for (const [i, s] of shots.entries()) {
    const w = 210;
    const h = Math.round((w / SCREEN_W) * SCREEN_H);
    const img = await sharp(s.src)
      .resize(w, h, { fit: "cover" })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="22" ry="22" fill="#fff"/></svg>`,
          ),
          blend: "dest-in",
        },
      ])
      .png()
      .toBuffer();
    // 두 번째 장은 살짝 내려 겹치게 — 오른쪽 끝(1024)을 넘지 않도록 둔다.
    layers.push({ input: img, left: 566 + i * 232, top: i === 0 ? 40 : 96 });
  }

  await sharp(bg)
    .composite(layers)
    .png({ quality: 92 })
    .toFile(join(OUT, "og.png"));
  console.log("og.png 1024×500");
}

console.log(`\n완료 → ${OUT}`);
