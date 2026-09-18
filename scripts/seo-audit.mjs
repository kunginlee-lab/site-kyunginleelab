// 검색 노출 점검 — 사이트맵에 올린 주소를 하나씩 받아 보고, 구글·네이버가
// 실제로 읽는 항목이 제대로 들어 있는지 확인한다.
//
//   node scripts/seo-audit.mjs                     배포된 사이트를 점검
//   node scripts/seo-audit.mjs http://localhost:4173  로컬 빌드를 점검
//
// 보는 것
//   - 사이트맵의 주소가 전부 200 으로 열리는가 (404·리다이렉트는 색인에서 빠진다)
//   - out/ 에 있는데 사이트맵에 빠진 페이지는 없는가
//   - title·description 이 페이지마다 다른가 (겹치면 한쪽만 색인된다)
//   - description 길이 — 네이버 권장 80자, 구글은 대략 155자에서 잘린다
//   - canonical 이 자기 주소를 가리키는가
//   - og:title/description/image — 네이버·카카오 공유 카드가 이걸 쓴다
//   - h1 이 정확히 하나인가
//   - 구조화 데이터가 붙어 있는가
//   - 사이트맵에 적은 그림 주소가 전부 열리는가 (404 는 이미지 검색에서 감점)
import { readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const BASE = (process.argv[2] ?? "https://kyunginleelab.com").replace(/\/$/, "");

const pick = (html, re) => html.match(re)?.[1]?.trim() ?? null;
const attr = (html, name) =>
  pick(html, new RegExp(`<meta[^>]+(?:name|property)="${name}"[^>]+content="([^"]*)"`, "i")) ??
  pick(html, new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:name|property)="${name}"`, "i"));

/** 사람이 세는 글자 수 (네이버 권장치 기준) */
const chars = (s) => [...(s ?? "")].length;

function decode(s) {
  return (s ?? "")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** out/ 을 훑어 실제로 만들어진 페이지 주소를 모은다 */
function builtPages() {
  const root = resolve("out");
  const found = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        if (name === "_next") continue;
        walk(full);
      } else if (name === "index.html") {
        const rel = relative(root, dir).split(sep).filter(Boolean).join("/");
        found.push(rel ? `/${rel}/` : "/");
      }
    }
  };
  try {
    walk(root);
  } catch {
    return null; // out/ 이 없으면 이 검사만 건너뛴다
  }
  return found.filter((p) => !p.startsWith("/_"));
}

const problems = [];
const note = (url, msg) => problems.push({ url, msg });

// ── 1. robots.txt · 사이트맵 ───────────────────────────────────────────────
const robots = await (await fetch(`${BASE}/robots.txt`)).text();
console.log("robots.txt");
for (const line of robots.split("\n").filter((l) => l.trim() && !l.startsWith("#"))) {
  console.log("   ", line.trim());
}
if (!/^\s*Sitemap:/im.test(robots)) note("robots.txt", "Sitemap 줄이 없다");
if (/^\s*Disallow:\s*\/\s*$/im.test(robots)) note("robots.txt", "전체 차단 상태");

const sitemapXml = await (await fetch(`${BASE}/sitemap.xml`)).text();
// 사이트맵에는 운영 도메인이 절대주소로 박혀 있다. 로컬 빌드를 볼 때는 경로만 떼어
// BASE 에 붙여야 지금 고친 내용을 본다 — 안 그러면 조용히 배포본을 점검하게 된다.
const SITE = "https://kyunginleelab.com";
const toPath = (u) => u.replace(SITE, "").replace(BASE, "") || "/";
const paths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => toPath(m[1]));
const urls = paths.map((p) => `${BASE}${p}`);
console.log(`\n사이트맵 주소 ${urls.length}개`);

const lastmods = [...sitemapXml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
if (lastmods.length && lastmods.length !== urls.length) {
  note("sitemap.xml", `lastmod 개수(${lastmods.length})가 주소 개수와 다르다`);
}

// out/ 과 비교 — 사이트맵에서 빠진 페이지 찾기
const built = builtPages();
if (built) {
  const inSitemap = new Set(paths);
  const missing = built.filter((p) => !inSitemap.has(p) && !/^\/(404|_not-found)\//.test(p));
  if (missing.length) note("sitemap.xml", `빌드에는 있는데 사이트맵에 없다: ${missing.join(", ")}`);
  const extra = [...inSitemap].filter((p) => !built.includes(p));
  if (extra.length) note("sitemap.xml", `사이트맵에는 있는데 빌드에 없다: ${extra.join(", ")}`);
}

// ── 2. 사이트맵이 가리키는 그림 ───────────────────────────────────────────
const imageLocs = [...new Set([...sitemapXml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1]))];
if (imageLocs.length) {
  let broken = 0;
  for (const loc of imageLocs) {
    const r = await fetch(`${BASE}${toPath(loc)}`, { method: "HEAD" });
    if (r.status !== 200) {
      note("sitemap.xml", `그림이 안 열린다 (HTTP ${r.status}): ${toPath(loc)}`);
      broken += 1;
    }
  }
  console.log(`사이트맵 그림 ${imageLocs.length}개 — ${imageLocs.length - broken}개 정상`);
} else {
  note("sitemap.xml", "그림 주소(image:loc)가 하나도 없다 — 이미지 검색 후보로 못 올라간다");
}

// ── 3. 페이지별 점검 ──────────────────────────────────────────────────────
const seenTitle = new Map();
const seenDesc = new Map();
const rows = [];

for (const url of urls) {
  const res = await fetch(url, { redirect: "manual" });
  if (res.status !== 200) {
    note(url, `HTTP ${res.status}${res.headers.get("location") ? ` → ${res.headers.get("location")}` : ""}`);
    rows.push({ url, status: res.status });
    continue;
  }
  const html = await res.text();

  const title = decode(pick(html, /<title>([^<]*)<\/title>/i));
  const desc = decode(attr(html, "description"));
  const canonical = pick(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i);
  const ogTitle = decode(attr(html, "og:title"));
  const ogDesc = decode(attr(html, "og:description"));
  const ogImage = attr(html, "og:image");
  const ogUrl = attr(html, "og:url");
  const robotsMeta = attr(html, "robots");
  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    decode(m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()),
  );
  const ldTypes = [...html.matchAll(/"@type":"([A-Za-z]+)"/g)].map((m) => m[1]);
  const path = url.replace(BASE, "") || "/";

  if (!title) note(url, "title 없음");
  else {
    if (chars(title) > 60) note(url, `title ${chars(title)}자 — 검색 결과에서 잘린다`);
    const prev = seenTitle.get(title);
    if (prev) note(url, `title 이 ${prev} 와 똑같다`);
    else seenTitle.set(title, path);
  }

  if (!desc) note(url, "description 없음");
  else {
    if (chars(desc) > 80) note(url, `description ${chars(desc)}자 — 네이버 권장 80자 초과`);
    if (chars(desc) < 40) note(url, `description ${chars(desc)}자 — 너무 짧다`);
    const prev = seenDesc.get(desc);
    if (prev) note(url, `description 이 ${prev} 와 똑같다`);
    else seenDesc.set(desc, path);
  }

  // canonical 은 늘 운영 도메인을 가리키므로 경로만 비교한다 (로컬 점검에서도 통하도록)
  if (!canonical) note(url, "canonical 없음");
  else if (toPath(canonical) !== path)
    note(url, `canonical 이 다른 페이지를 가리킨다 → ${canonical}`);

  if (!ogTitle) note(url, "og:title 없음 — 카카오·네이버 공유 카드 제목이 빈다");
  if (!ogDesc) note(url, "og:description 없음");
  if (!ogImage) note(url, "og:image 없음");
  if (!ogUrl) note(url, "og:url 없음");
  if (robotsMeta && /noindex/i.test(robotsMeta)) note(url, `robots 메타가 noindex: ${robotsMeta}`);

  if (h1.length === 0) note(url, "h1 없음");
  else if (h1.length > 1) note(url, `h1 이 ${h1.length}개 (${h1.join(" / ")})`);

  if (ldTypes.length === 0) note(url, "구조화 데이터 없음");

  rows.push({
    url: path,
    status: 200,
    title: chars(title),
    desc: chars(desc),
    h1: h1.length,
    ld: [...new Set(ldTypes)].length,
    og: [ogTitle, ogDesc, ogImage].filter(Boolean).length,
  });
}

// ── 4. 출력 ───────────────────────────────────────────────────────────────
console.log("\n주소                          상태  title  desc  h1  og  ld");
for (const r of rows) {
  if (r.status !== 200) {
    console.log(`${r.url.padEnd(30)}${String(r.status).padStart(4)}`);
    continue;
  }
  console.log(
    `${r.url.padEnd(30)}${String(r.status).padStart(4)}` +
      `${String(r.title).padStart(7)}${String(r.desc).padStart(6)}` +
      `${String(r.h1).padStart(4)}${String(r.og).padStart(4)}/3${String(r.ld).padStart(4)}`,
  );
}

console.log(`\n지적 ${problems.length}건`);
for (const p of problems) console.log(`  ${p.url.replace(BASE, "") || "/"} — ${p.msg}`);
process.exitCode = problems.length ? 1 : 0;
