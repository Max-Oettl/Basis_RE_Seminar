"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const {
  buildAnimationStates,
  buildApplyAnimationStateExpression,
} = require("./svg-qa/animation-layout-rules");
const {
  closePage,
  createPage,
  launchBrowser,
  stopBrowser,
} = require("./svg-qa/browser-layout-qa");

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    if (!argv[index].startsWith("--")) continue;
    args[argv[index].slice(2)] = argv[index + 1];
    index += 1;
  }
  if (!args.module || !args.slides || !args["output-dir"]) {
    throw new Error(
      "Usage: node tools/render-svg-animation-states.js --module RE1 --slides 14-26 --output-dir <dir>",
    );
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

function safeLabel(value) {
  return String(value || "state")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48)
    .toLowerCase();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Browser evaluation failed");
  }
  return result.result?.value;
}

function reviewStates(manifest, sampleHighlights = false) {
  const animation = buildAnimationStates(manifest);
  if (!animation.timeline.length) return animation;

  const groups = [];
  for (const segment of animation.timeline) {
    const previous = groups.at(-1);
    if (previous?.index === segment.triggerGroupIndex) previous.segments.push(segment);
    else groups.push({ index: segment.triggerGroupIndex, segments: [segment] });
  }

  animation.states = [
    { label: "initial", timeMs: 0, timeSeconds: 0 },
    ...groups.map((group, index) => {
      const timeMs = Math.max(...group.segments.map((segment) => segment.end));
      const trigger = group.segments[0].step.sourceText || `trigger_${index + 1}`;
      return {
        label: `after_${String(index + 1).padStart(2, "0")}_${safeLabel(trigger)}`,
        timeMs,
        timeSeconds: Number((timeMs / 1000).toFixed(3)),
      };
    }),
  ];
  if (sampleHighlights) {
    for (const segment of animation.timeline.filter(item => item.step.action === "highlight")) {
      const timeMs=(segment.start+segment.end)/2;
      animation.states.push({label:`highlight_${safeLabel(segment.step.targetId)}_${segment.index}`,timeMs,timeSeconds:Number((timeMs/1000).toFixed(3))});
    }
    animation.states.sort((a,b)=>a.timeMs-b.timeMs);
  }
  return animation;
}

async function main() {
  const args = parseArgs(process.argv);
  const repoRoot = path.resolve(__dirname, "..");
  const outputDir = path.resolve(args["output-dir"]);
  const slides = parseSlides(args.slides);
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await launchBrowser();
  const page = await createPage(browser.port);
  let screenshotCount = 0;
  try {
    await page.client.send("Emulation.setDeviceMetricsOverride", {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });

    for (const slide of slides) {
      const number = String(slide).padStart(3, "0");
      const sceneDir = path.join(repoRoot, "rebuild-proposals", "svg", args.module, `slide_${number}`);
      const svgPath = path.join(sceneDir, `slide_${number}.svg`);
      const manifestPath = path.join(sceneDir, "scene.animation.v1.json");
      const manifest = fs.existsSync(manifestPath)
        ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
        : { targets: [], steps: [] };
      const animation = reviewStates(manifest, args["sample-highlights"] === "true");
      const slideOutput = path.join(outputDir, `slide_${number}`);
      fs.mkdirSync(slideOutput, { recursive: true });

      for (let index = 0; index < animation.states.length; index += 1) {
        const state = animation.states[index];
        await page.client.send("Page.navigate", { url: pathToFileURL(svgPath).href });
        await sleep(250);
        await evaluate(
          page.client,
          buildApplyAnimationStateExpression(animation.manifest, animation.timeline, state),
        );
        await sleep(50);
        const screenshot = await page.client.send("Page.captureScreenshot", {
          format: "png",
          captureBeyondViewport: false,
        });
        const outputName = `${String(index).padStart(2, "0")}_${safeLabel(state.label)}.png`;
        fs.writeFileSync(path.join(slideOutput, outputName), Buffer.from(screenshot.data, "base64"));
        screenshotCount += 1;
      }
    }
  } finally {
    await closePage(browser.port, page);
    stopBrowser(browser);
  }

  process.stdout.write(
    `Rendered ${screenshotCount} animation state preview(s) for ${slides.length} slide(s) to ${outputDir}.\n`,
  );
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
