// 헤드리스 크롬(CDP)으로 데스크톱·모바일 화면을 스크롤하며 캡처 — QA 용
// usage: node qa_shots.mjs <url> <outDir>
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const URL = process.argv[2] ?? "https://kyunginleelab.com/";
const OUT = resolve(process.argv[3] ?? "qa"); // 크롬 --user-data-dir 은 절대경로여야 한다
const PORT = 9333;
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
].find((p) => existsSync(p));
if (!CHROME) throw new Error("chrome.exe not found");
mkdirSync(OUT, { recursive: true });
// 크롬 프로필은 프로젝트 밖에 둔다 — 안에 두면 eslint 가 확장 프로그램 코드까지 검사한다
const PROFILE = mkdtempSync(join(tmpdir(), "qa-"));

const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    `--user-data-dir=${PROFILE}`,
    "--window-size=1440,900",
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
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id);
    pending.delete(m.id);
    if (m.error) rej(new Error(JSON.stringify(m.error)));
    else res(m.result);
  }
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

async function run(label, width, height, mobile) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
  await send("Emulation.setTouchEmulationEnabled", { enabled: mobile });
  await send("Page.navigate", { url: URL });
  await sleep(4500);
  await evaluate("document.documentElement.style.scrollBehavior='auto'; 1");
  const total = await evaluate("document.documentElement.scrollHeight");
  const step = Math.round(height * 0.8);
  const shots = [];
  for (let y = 0, i = 0; y < total - 10; y += step, i++) {
    await evaluate(`window.scrollTo(0, ${y}); 1`);
    await sleep(1000);
    const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 72 });
    const f = `${OUT}/${label}-${String(i).padStart(2, "0")}-y${y}.jpg`;
    writeFileSync(f, Buffer.from(data, "base64"));
    shots.push(f);
  }
  const errors = await evaluate("(window.__qaErrors||[]).length");
  return { label, total, shots: shots.length, errors };
}

await send("Runtime.enable");
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: "window.__qaErrors=[];window.addEventListener('error',e=>__qaErrors.push(e.message));",
});
console.log(JSON.stringify(await run("desktop", 1440, 900, false)));
console.log(JSON.stringify(await run("mobile", 390, 844, true)));
ws.close();
chrome.kill();
