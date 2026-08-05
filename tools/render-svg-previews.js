"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const { closePage, createPage, launchBrowser, stopBrowser } = require("./svg-qa/browser-layout-qa");

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    if (!argv[index].startsWith("--")) continue;
    args[argv[index].slice(2)] = argv[index + 1];
    index += 1;
  }
  if (!args.module || !args.slides || !args["output-dir"]) {
    throw new Error("Usage: node tools/render-svg-previews.js --module RE1 --slides 27,28 --output-dir <dir> [--source-dir <dir>]");
  }
  return args;
}

function parseSlides(value) {
  return value.split(",").flatMap((entry) => {
    const [start, end] = entry.split("-").map(Number);
    if (!end) return [start];
    return Array.from({ length: end - start + 1 }, (_, offset) => start + offset);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = parseArgs(process.argv);
  const repoRoot = path.resolve(__dirname, "..");
  const outputDir = path.resolve(args["output-dir"]);
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await launchBrowser();
  const page = await createPage(browser.port);
  try {
    await page.client.send("Emulation.setDeviceMetricsOverride", {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });
    for (const slide of parseSlides(args.slides)) {
      const number = String(slide).padStart(3, "0");
      const svgPath = args["source-dir"]
        ? path.resolve(repoRoot, args["source-dir"], `Folie${slide}.SVG`)
        : path.join(repoRoot, "rebuild-proposals", "svg", args.module, `slide_${number}`, `slide_${number}.svg`);
      await page.client.send("Page.navigate", { url: pathToFileURL(svgPath).href });
      await sleep(500);
      const screenshot = await page.client.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
      });
      const outputName = args["source-dir"] ? `source_${number}.png` : `slide_${number}.png`;
      fs.writeFileSync(path.join(outputDir, outputName), Buffer.from(screenshot.data, "base64"));
    }
  } finally {
    await closePage(browser.port, page);
    stopBrowser(browser);
  }
  process.stdout.write(`Rendered ${parseSlides(args.slides).length} SVG preview(s) to ${outputDir}.\n`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
