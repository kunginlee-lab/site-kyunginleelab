/**
 * 사이트에 실제로 쓰인 글자만 담은 Pretendard 서브셋을 만든다. (npm run build 전에 자동 실행)
 *
 * 왜: Pretendard 의 dynamic-subset 은 한글을 유니코드 범위별로 92개 파일로 쪼개 두어,
 * 문장이 많은 페이지는 15개 안팎(약 390KB)을 내려받는다. 쓰는 글자만 모아 한 번에 서브셋하면
 * 파일 하나 70KB 로 끝난다.
 *
 * 글자는 소스(app/·components/·content/·site.config.ts)에서 모으므로, 문구를 추가하면
 * 다음 빌드에 자동으로 반영된다. 원본 폰트는 처음 한 번만 받아 scripts/.cache 에 둔다.
 *
 * 준비물: python + fonttools[woff] + brotli   (pip install "fonttools[woff]" brotli)
 * 없으면 경고만 남기고 기존 폰트를 그대로 쓴다 — 빌드를 막지 않는다.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = join(ROOT, "scripts", ".cache");
const SRC_FONT = join(CACHE, "PretendardVariable.ttf");
const DEST_DIR = join(ROOT, "public", "fonts");
const DEST = join(DEST_DIR, "pretendard-subset.woff2");
const FONT_URL =
  "https://github.com/orioncactus/pretendard/raw/v1.3.9/packages/pretendard/dist/public/variable/PretendardVariable.ttf";

// 글자를 모을 곳 — 화면에 나가는 문구가 들어 있는 파일들
const SOURCES = ["app", "components", "content", "site.config.ts", "out"];
const TEXT_EXT = [".tsx", ".ts", ".css", ".html", ".txt", ".md", ".json"];

function collectChars() {
  const chars = new Set();
  const addFile = (p) => {
    try {
      let src = readFileSync(p, "utf8");
      // 코드 주석은 화면에 안 나가므로 글리프에서 뺀다 (주석에 한글 설명이 많다).
      // 과하게 지워도 손해가 없다 — 주석 안에만 있던 글자는 어차피 화면에 안 나온다.
      if (p.endsWith(".ts") || p.endsWith(".tsx") || p.endsWith(".css")) {
        src = src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|\s)\/\/[^\n]*/g, " ");
      }
      for (const ch of src) chars.add(ch);
    } catch {
      /* 바이너리·읽기 실패는 건너뛴다 */
    }
  };
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (name === "node_modules" || name === "_next" || name === ".next") continue;
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (TEXT_EXT.some((e) => name.endsWith(e))) addFile(p);
    }
  };
  for (const s of SOURCES) {
    const p = join(ROOT, s);
    if (!existsSync(p)) continue;
    if (statSync(p).isDirectory()) walk(p);
    else addFile(p);
  }
  // 앞으로 쓸 문구에 대비한 여유분
  for (const ch of
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" +
    "·—–…“”‘’「」『』()[]{}<>《》〈〉%‰°±×÷≤≥≠→←↑↓∙※★☆♥✓✕€£¥₩$@#&*+=/\\|~^_" +
    "가나다라마바사아자차카타파하")
    chars.add(ch);
  return [...chars].filter((c) => c.codePointAt(0) > 0x1f).sort().join("");
}

function python(args) {
  execFileSync("python", args, { stdio: "inherit" });
}

try {
  execFileSync("python", ["-c", "import fontTools, brotli"], { stdio: "ignore" });
} catch {
  console.warn(
    '[build-font] python + fonttools 가 없어 폰트 서브셋을 건너뜁니다. 기존 public/fonts/pretendard-subset.woff2 를 사용합니다.\n            (설치: pip install "fonttools[woff]" brotli)',
  );
  process.exit(0);
}

const text = collectChars();
mkdirSync(CACHE, { recursive: true });
mkdirSync(DEST_DIR, { recursive: true });

// 글자 목록이 지난번과 같고 결과물이 있으면 다시 만들지 않는다
const listFile = join(CACHE, "chars.txt");
const prev = existsSync(listFile) ? readFileSync(listFile, "utf8") : "";
if (prev === text && existsSync(DEST)) {
  console.log(`[build-font] 글자 변화 없음 — 기존 서브셋 사용 (${(statSync(DEST).size / 1024).toFixed(0)} KB)`);
  process.exit(0);
}
writeFileSync(listFile, text, "utf8");

if (!existsSync(SRC_FONT)) {
  console.log("[build-font] 원본 폰트 내려받는 중…");
  const res = await fetch(FONT_URL);
  if (!res.ok) throw new Error(`폰트 다운로드 실패: ${res.status}`);
  writeFileSync(SRC_FONT, Buffer.from(await res.arrayBuffer()));
}

// 1) 글자 서브셋 — 자간·합자 등 실제로 쓰는 기능만 남긴다
const stage1 = join(CACHE, "stage1.woff2");
python([
  "-m",
  "fontTools.subset",
  SRC_FONT,
  `--text-file=${listFile}`,
  `--output-file=${stage1}`,
  "--flavor=woff2",
  "--layout-features=kern,liga,calt,ccmp,locl,rlig",
  "--no-hinting",
  "--desubroutinize",
  "--drop-tables+=DSIG",
  "--name-IDs=1,2,3,4,6",
]);

// 2) 가변 축을 사이트가 쓰는 굵기(400~800)로 좁힌다 — 45~920 전 구간을 담을 이유가 없다
python([
  "-m",
  "fontTools.varLib.instancer",
  stage1,
  "wght=400:800",
  "-o",
  DEST,
  "--no-overlap-flag",
]);

const kb = (p) => (statSync(p).size / 1024).toFixed(0);
console.log(`[build-font] 글자 ${text.length}자 → public/fonts/pretendard-subset.woff2 ${kb(DEST)} KB`);
