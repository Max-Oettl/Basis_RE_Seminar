"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sourceMap = JSON.parse(
  fs.readFileSync(path.join(root, "analysis", "rebuild-plans", "RE2_source-reference-map.json"), "utf8"),
);
const textMap = JSON.parse(
  fs.readFileSync(path.join(root, "analysis", "inventories", "RE2_svg-text-map.json"), "utf8"),
);
const spokenBySlide = new Map(
  textMap.mappings.map((entry) => [entry.source_slide_number, entry.spoken_text || ""]),
);

function parseSlides(value) {
  return String(value).split(",").flatMap((entry) => {
    const [start, end] = entry.trim().split("-").map(Number);
    return Array.from({ length: (end || start) - start + 1 }, (_, index) => start + index);
  });
}

const slidesArg = process.argv[2] || "14,16-62";
const selected = new Set(parseSlides(slidesArg));
const failures = [];
let stepCount = 0;
let sceneCount = 0;

for (const scene of sourceMap.mappings.filter((entry) => selected.has(entry.output_slide_number))) {
  const sceneDir = path.join(root, "rebuild-proposals", "svg", "RE2", scene.work_unit);
  const manifestPath = path.join(sceneDir, "scene.animation.v1.json");
  const svgPath = path.join(sceneDir, `${scene.work_unit}.svg`);
  if (!fs.existsSync(manifestPath) || !fs.existsSync(svgPath)) {
    failures.push(`${scene.work_unit}: SVG oder Animationsmanifest fehlt.`);
    continue;
  }

  sceneCount += 1;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const svg = fs.readFileSync(svgPath, "utf8");
  const spokenText = [...new Set(scene.source_slides.map((slide) => spokenBySlide.get(slide) || ""))].join("\n\n");

  for (const step of manifest.steps || []) {
    stepCount += 1;
    if (!spokenText.includes(step.sourceText || "")) {
      failures.push(`${scene.work_unit}/${step.stepId}: sourceText ist kein exakter Ausschnitt des Quellsprechertexts.`);
    }
    const escaped = String(step.targetId || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`\\bid="${escaped}"`).test(svg)) {
      failures.push(`${scene.work_unit}/${step.stepId}: Ziel-ID ${step.targetId} fehlt im SVG.`);
    }
  }
}

process.stdout.write(
  `RE2 cue validation: ${sceneCount} scenes, ${stepCount} steps, ${failures.length} failure(s).\n`,
);
if (failures.length) {
  process.stdout.write(`${failures.map((failure) => `- ${failure}`).join("\n")}\n`);
  process.exitCode = 1;
}
