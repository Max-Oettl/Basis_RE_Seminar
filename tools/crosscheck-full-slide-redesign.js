"use strict";

const fs = require("fs");
const path = require("path");

function parseArguments(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    if (!argv[index].startsWith("--")) continue;
    args[argv[index].slice(2)] = argv[index + 1];
    index += 1;
  }
  return args;
}

function decodeXml(value) {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function main() {
  const args = parseArguments(process.argv);
  if (!args.requirements || !args["scene-plan"] || !args["output-root"] || !args.output) {
    throw new Error("Usage: node tools/crosscheck-full-slide-redesign.js --requirements <json> --scene-plan <json> --output-root <dir> --output <json>");
  }
  const requirements = JSON.parse(fs.readFileSync(args.requirements, "utf8"));
  const scenePlan = JSON.parse(fs.readFileSync(args["scene-plan"], "utf8"));
  const sceneBySlide = new Map(scenePlan.scenes.map((scene) => [scene.output_slide_number, scene]));
  const results = [];

  for (const requirement of requirements.slides) {
    const number = String(requirement.slide).padStart(3, "0");
    const directory = path.join(args["output-root"], `slide_${number}`);
    const svgPath = path.join(directory, `slide_${number}.svg`);
    const manifestPath = path.join(directory, "scene.animation.v1.json");
    const svg = fs.readFileSync(svgPath, "utf8");
    const visibleText = decodeXml(svg);
    const normalizedVisibleText = visibleText.toLocaleLowerCase("de-DE");
    const compactVisibleText = normalizedVisibleText.replace(/\s+/g, "");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const scene = sceneBySlide.get(requirement.slide);
    const issues = [];

    for (const term of requirement.required_terms) {
      const normalizedTerm = term.toLocaleLowerCase("de-DE");
      const compactTerm = normalizedTerm.replace(/\s+/g, "");
      if (!normalizedVisibleText.includes(normalizedTerm) && !compactVisibleText.includes(compactTerm)) issues.push(`Pflichtinhalt fehlt: ${term}`);
    }
    const metadataMatch = svg.match(/<metadata[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/metadata>/i);
    const metadata = metadataMatch ? JSON.parse(metadataMatch[1]) : {};
    if (JSON.stringify(metadata.sourceSlides || []) !== JSON.stringify(requirement.source_slides)) {
      issues.push(`Quellfolienreferenz stimmt nicht: ${JSON.stringify(metadata.sourceSlides || [])}`);
    }
    const rasterImageCount = (svg.match(/<image\b/gi) || []).length;
    const vectorMediaCount = (svg.match(/<svg\b[^>]*\bdata-source-media="true"/gi) || []).length;
    const imageCount = rasterImageCount + vectorMediaCount;
    if (requirement.min_images && imageCount < requirement.min_images) issues.push(`Zu wenige Inhaltsbilder oder Vektormedien: ${imageCount}`);
    const formulaAssetCount = (svg.match(/data-formula-asset="true"/gi) || []).length;
    if (requirement.min_formula_assets && formulaAssetCount < requirement.min_formula_assets) issues.push(`Zu wenige Formel-SVG-Assets: ${formulaAssetCount}`);
    if (requirement.plot_required && !/data-plot-asset="true"/.test(svg)) issues.push("Python-Plotasset fehlt.");
    if (/width="64"\s+height="64"|height="64"\s+width="64"/.test(svg)) issues.push("PowerPoint-Lautsprecher erkannt.");
    if (/(?:href|xlink:href)="https?:/i.test(svg)) issues.push("Externe SVG-Referenz erkannt.");
    for (const animationStep of manifest.steps || []) {
      if (!scene.spoken_text.includes(animationStep.sourceText)) issues.push(`Triggerphrase fehlt im Sprechertext: ${animationStep.sourceText}`);
      if (!svg.includes(`id="${animationStep.targetId}"`)) issues.push(`Animationsziel fehlt: ${animationStep.targetId}`);
    }
    results.push({ slide: requirement.slide, source_slides: requirement.source_slides, status: issues.length ? "failed" : "passed", issues });
  }

  const failed = results.filter((result) => result.status === "failed");
  const report = {
    schema_version: "fullSlideRedesignCrosscheck/v1",
    module_id: requirements.module_id,
    checked_slides: results.length,
    passed_slides: results.length - failed.length,
    failed_slides: failed.length,
    status: failed.length ? "failed" : "passed",
    results,
  };
  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Full-slide redesign crosscheck: ${report.status}; ${report.passed_slides}/${report.checked_slides} scenes passed.`);
  for (const result of failed) for (const issue of result.issues) console.log(`ERROR slide ${result.slide}: ${issue}`);
  if (failed.length) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
