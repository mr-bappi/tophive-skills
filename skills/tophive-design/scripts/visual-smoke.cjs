#!/usr/bin/env node
/**
 * Optional local-only rendered page smoke check.
 * Requires Puppeteer in the current project or NODE_PATH; no auto installs.
 * Example: NODE_PATH=/path/to/node_modules node scripts/visual-smoke.cjs
 *          --url http://127.0.0.1:8765/ --out ./qa/visual-captures
 * Checks real browser geometry/runtime and captures screenshots; this is NOT
 * a full accessibility, design-quality, performance or deployed-site audit.
 */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

function parse(args) {
  const o = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    if (!["--url", "--out"].includes(key) || !args[i + 1]) {
      throw new Error("Usage: visual-smoke.cjs --url <local URL or HTML file> --out <output folder>");
    }
    o[key.slice(2)] = args[i + 1];
  }
  if (!o.url) throw new Error("--url is required");
  return o;
}

function safeUrl(value) {
  if (fs.existsSync(value) && fs.statSync(value).isFile())
    return pathToFileURL(path.resolve(value)).href;
  const url = new URL(value);
  const allowed = url.protocol === "file:" ||
    (url.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname));
  if (!allowed) throw new Error("Only local file:// or http://localhost/127.0.0.1 URLs allowed; avoid unintended remote requests");
  return url.href;
}

async function main() {
  const opts = parse(process.argv.slice(2));
  const url = safeUrl(opts.url);
  const output = path.resolve(opts.out || "qa/visual-captures");
  let puppeteer;
  try { puppeteer = require("puppeteer"); }
  catch (err) {
    console.error("NOT TESTED — Puppeteer unavailable. Supply it through the project's dependencies or NODE_PATH.");
    return 3;
  }
  fs.mkdirSync(output, { recursive: true });
  const chrome = process.env.CHROME_BIN || process.env.PUPPETEER_EXECUTABLE_PATH ||
    (process.platform === "darwin" && fs.existsSync("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome") ?
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" : undefined);
  const browser = await puppeteer.launch({
    headless: true,
    ...(chrome ? { executablePath: chrome } : {}),
    args: ["--no-sandbox"]
  });
  const report = { url, viewports: [], status: "NOT TESTED",
    limitations: ["WCAG contrast and assistive-technology audit NOT TESTED",
                  "Visual craft/human review NOT TESTED",
                  "Real backend and production performance NOT TESTED"] };
  const widths = [360, 390, 768, 1024, 1440, 1920];
  let failure = false;
  try {
    for (const width of widths) {
      const page = await browser.newPage();
      try {
        await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
        const errors = [];
        page.on("pageerror", e => errors.push(String(e.message || e)));
        page.on("requestfailed", req => errors.push("request failed: " + req.url()));
        await page.goto(url, { waitUntil: "load", timeout: 20000 });
        const visual = await page.evaluate(() => {
          const root = document.documentElement;
          const body = document.body;
          const overflow = Math.max(0, root.scrollWidth - root.clientWidth,
            body ? body.scrollWidth - root.clientWidth : 0);
          const brokenImages = [...document.images].filter(im => !im.complete || im.naturalWidth === 0)
            .map(im => im.currentSrc || im.src || "(unnamed)").slice(0, 12);
          return { overflowPixels: Math.round(overflow),
            imageFailures: brokenImages, title: document.title,
            headings: document.querySelectorAll("h1").length,
            buttons: document.querySelectorAll("button").length };
        });
        const name = "viewport-" + width + ".png";
        await page.screenshot({ path: path.join(output, name), fullPage: false });
        const ok = visual.overflowPixels <= 1 && !visual.imageFailures.length && !errors.length;
        report.viewports.push({ width, status: ok ? "PASS" : "FAIL",
          screenshot: name, ...visual, errors });
        console.log((ok ? "PASS" : "FAIL"), width, "overflow", visual.overflowPixels,
          "broken images", visual.imageFailures.length, "runtime errors", errors.length);
        if (!ok) failure = true;
      } catch (error) {
        failure = true;
        report.viewports.push({ width, status: "FAIL", error: String(error) });
        console.error("FAIL", width, String(error));
      } finally {
        await page.close();
      }
    }
  } finally { await browser.close(); }
  report.status = failure ? "FAIL" : "PASS";
  fs.writeFileSync(path.join(output, "results.json"), JSON.stringify(report, null, 2) + "\n");
  console.log("SUMMARY", report.status, report.viewports.length, "viewports",
    "visual/accessibility craft requires manual review");
  return failure ? 1 : 0;
}

main().then(code => { process.exitCode = code; }).catch(err => {
  console.error("NOT TESTED — unable to run browser:", String(err));
  process.exitCode = 3;
});
