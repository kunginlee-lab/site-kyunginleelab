// 헤드리스 크롬으로 실제 로딩 측정 — 다운로드된 리소스, LCP, 첫 화면까지 걸린 바이트
// usage: node scripts/perf.mjs [url] [desktop|mobile]
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const URL = process.argv[2] ?? "https://kyunginleelab.com/";
const MODE = process.argv[3] ?? "mobile";
const PORT = 9334;
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
].find((p) => existsSync(p));
if (!CHROME) throw new Error("chrome.exe not found");

const profile = mkdtempSync(join(tmpdir(), "perf-"));
const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let target;
for (let i = 0; i < 30 && !target; i++) {
  await sleep(500);
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    target = list.find((t) => t.type === "page");
  } catch {}
}
if (!target) throw new Error("chrome did not start");

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
const events = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id);
    pending.delete(m.id);
    if (m.error) rej(new Error(JSON.stringify(m.error)));
    else res(m.result);
  } else if (m.method) events.push(m);
};
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const i = ++id;
    pending.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method, params }));
  });
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result
    ?.value;

await send("Network.enable");
await send("Page.enable");
await send("Runtime.enable");
if (MODE === "mobile") {
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  // 느린 4G 근사 — 실제 사용자 체감에 가깝게
  await send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await send("Emulation.setCPUThrottlingRate", { rate: 4 });
} else {
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
}
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `
    window.__lcp = 0;
    window.__lcpEl = '';
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        window.__lcp = e.startTime;
        const el = e.element;
        window.__lcpEl = e.url || (el ? el.tagName + (el.className ? '.' + String(el.className).split(' ')[0] : '') + ' — ' + (el.textContent || '').trim().slice(0, 40) : '?');
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    window.__cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  `,
});

const t0 = Date.now();
await send("Page.navigate", { url: URL });
await sleep(MODE === "mobile" ? 14000 : 8000);

const resources = new Map();
for (const ev of events) {
  if (ev.method === "Network.responseReceived") {
    const { requestId, response, type } = ev.params;
    resources.set(requestId, { url: response.url, type, bytes: 0, mime: response.mimeType });
  } else if (ev.method === "Network.loadingFinished") {
    const r = resources.get(ev.params.requestId);
    if (r) r.bytes = ev.params.encodedDataLength;
  }
}
const list = [...resources.values()].filter((r) => r.bytes > 0);
const total = list.reduce((s, r) => s + r.bytes, 0);
const byType = {};
for (const r of list) byType[r.type] = (byType[r.type] ?? 0) + r.bytes;

const metrics = await evaluate(`JSON.stringify({
  lcp: Math.round(window.__lcp),
  lcpEl: window.__lcpEl,
  cls: +(window.__cls||0).toFixed(3),
  fcp: Math.round((performance.getEntriesByName('first-contentful-paint')[0]||{}).startTime||0),
  domContentLoaded: Math.round(performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart),
  load: Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart)
})`);

console.log(`\n### ${MODE} — ${URL}`);
console.log(`측정 시간 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
console.log("지표:", metrics);
console.log(`요청 ${list.length}개, 합계 ${(total / 1024).toFixed(0)} KB`);
console.log(
  "유형별:",
  Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ${(v / 1024).toFixed(0)}KB`)
    .join(", "),
);
console.log("\n가장 큰 리소스 15개:");
for (const r of list.sort((a, b) => b.bytes - a.bytes).slice(0, 15)) {
  console.log(
    `${(r.bytes / 1024).toFixed(0).padStart(6)} KB  ${r.type.padEnd(10)} ${r.url.replace(/^https?:\/\/[^/]+/, "").slice(0, 70)}`,
  );
}

ws.close();
chrome.kill();
