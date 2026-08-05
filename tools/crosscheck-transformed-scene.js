"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

function parseArguments(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (!argv[index].startsWith("--")) continue;
    result[argv[index].slice(2)] = argv[index + 1];
    index += 1;
  }
  return result;
}

function required(args, key) {
  if (!args[key]) throw new Error(`Fehlendes Argument --${key}`);
  return args[key];
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function repoPath(value) {
  return path.resolve(repoRoot, String(value || "").replaceAll("/", path.sep));
}

function attrValue(attrs, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = String(attrs || "").match(new RegExp(`(?:^|\\s)${escaped}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match ? match[1] : "";
}

function hrefValue(attrs) {
  const match = String(attrs || "").match(/(?:^|\s)(?:xlink:)?href\s*=\s*["']([^"']*)["']/i);
  return match ? match[1] : "";
}

function decodeXmlText(value) {
  return String(value || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeGermanVisibleText(value) {
  return String(value || "")
    .replace(/\bfuer\b/gi, (match) => (match[0] === "F" ? "Für" : "für"))
    .replace(/\bkoennen\b/gi, (match) => (match[0] === "K" ? "Können" : "können"))
    .replace(/\bmuessen\b/gi, (match) => (match[0] === "M" ? "Müssen" : "müssen"))
    .replace(/\bgeschaetzt\b/gi, (match) => (match[0] === "G" ? "Geschätzt" : "geschätzt"))
    .replace(/\bAusfaelle\b/g, "Ausfälle")
    .replace(/\bausfaelle\b/g, "ausfälle")
    .replace(/\bergaenzen\b/gi, (match) => (match[0] === "E" ? "Ergänzen" : "ergänzen"))
    .replace(/\bSchaetz/g, "Schätz")
    .replace(/\bschaetz/g, "schätz");
}

function textElements(svgText) {
  return [...svgText.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi)].map((match) => ({
    attrs: match[1] || "",
    text: decodeXmlText(match[2]),
  })).filter((entry) => entry.text);
}

function isVisibleSlideTitle(entry) {
  const fontSize = Number(attrValue(entry.attrs, "font-size"));
  const transform = attrValue(entry.attrs, "transform");
  const match = transform.match(/translate\(\s*-?\d+(?:\.\d+)?(?:e[+-]?\d+)?[\s,]+(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)/i);
  const baseline = match ? Number(match[1]) : Number.NaN;
  return Number.isFinite(fontSize) && fontSize >= 30 && Number.isFinite(baseline) && baseline <= 105;
}

function isInvisibleText(entry) {
  const fillOpacity = attrValue(entry.attrs, "fill-opacity");
  const opacity = attrValue(entry.attrs, "opacity");
  const style = attrValue(entry.attrs, "style");
  return fillOpacity === "0" || opacity === "0" || /(?:^|;)\s*(?:fill-opacity|opacity)\s*:\s*0(?:;|$)/i.test(style) || /(?:^|;)\s*display\s*:\s*none(?:;|$)/i.test(style);
}

function imageAssets(svgText) {
  return [...svgText.matchAll(/<image\b([^>]*)>/gi)].map((match) => {
    const attrs = match[1] || "";
    const href = hrefValue(attrs);
    return {
      id: attrValue(attrs, "id"),
      width: Number(attrValue(attrs, "width")),
      height: Number(attrValue(attrs, "height")),
      href,
      hash: href ? crypto.createHash("sha256").update(href, "utf8").digest("hex") : "",
    };
  });
}

function countValues(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return counts;
}

function main() {
  const args = parseArguments(process.argv.slice(2));
  const planPath = path.resolve(required(args, "scene-plan"));
  const workUnit = required(args, "work-unit");
  const outputPath = path.resolve(required(args, "output"));
  const plan = readJson(planPath);
  const scene = plan.scenes.find((candidate) => candidate.work_unit === workUnit);
  if (!scene) throw new Error(`WorkUnit fehlt im Szenenplan: ${workUnit}`);
  const inventory = readJson(repoPath(plan.source_inventory));
  const inventoryBySlide = new Map(inventory.slides.map((slide) => [slide.source_slide_number, slide]));
  const targetSvgPath = repoPath(scene.target_svg);
  const targetText = readText(targetSvgPath);
  const targetTexts = textElements(targetText).map((entry) => normalizeGermanVisibleText(entry.text));
  const targetTextCounts = countValues(targetTexts);
  const targetImages = imageAssets(targetText);
  const targetImageHashes = new Set(targetImages.map((image) => image.hash).filter(Boolean));
  const issues = [];
  const warnings = [];
  const sourceChecks = [];

  for (const slideNumber of scene.source_slides) {
    const inventoryEntry = inventoryBySlide.get(slideNumber);
    if (!inventoryEntry) {
      issues.push(`Inventareintrag fehlt fuer Quellfolie ${slideNumber}.`);
      continue;
    }
    const sourceText = readText(repoPath(inventoryEntry.source_svg));
    const expectedTexts = textElements(sourceText)
      .filter((entry) => !isVisibleSlideTitle(entry) && !isInvisibleText(entry))
      .map((entry) => normalizeGermanVisibleText(entry.text));
    const expectedCounts = countValues(expectedTexts);
    const missingTexts = [];
    for (const [value, expectedCount] of expectedCounts.entries()) {
      if ((targetTextCounts.get(value) || 0) < expectedCount) missingTexts.push(value);
    }
    const sourceImages = imageAssets(sourceText);
    const hasSpeaker = Number(inventoryEntry.features?.powerpoint_speaker_control_count || 0) > 0;
    const expectedImages = sourceImages.filter((image) => !(hasSpeaker && image.width === 64 && image.height === 64));
    const missingImages = expectedImages.filter((image) => image.hash && !targetImageHashes.has(image.hash)).map((image) => image.id || image.hash.slice(0, 12));
    if (missingTexts.length) issues.push(`Quellfolie ${slideNumber}: ${missingTexts.length} sichtbare Texte fehlen im Ziel.`);
    if (missingImages.length) issues.push(`Quellfolie ${slideNumber}: ${missingImages.length} Inhaltsbilder fehlen im Ziel.`);
    sourceChecks.push({
      source_slide: slideNumber,
      source_svg: inventoryEntry.source_svg,
      expected_text_nodes: expectedTexts.length,
      missing_text_nodes: missingTexts,
      expected_image_assets: expectedImages.length,
      missing_image_assets: missingImages,
      speaker_control_expected_removed: hasSpeaker,
    });
  }

  if (!targetText.includes('data-artifact-scope="content-svg"')) issues.push("Content-SVG-Metadaten fehlen.");
  if (/<script\b|\bon\w+\s*=|javascript:/i.test(targetText)) issues.push("Aktiver Inhalt im Ziel-SVG erkannt.");
  if (/<image\b[^>]*\bwidth=["']64["'][^>]*\bheight=["']64["'][^>]*>/i.test(targetText)) {
    warnings.push("Ein 64x64-Bild verbleibt im Ziel; Speaker-QA muss die Verwendung pruefen.");
  }

  const report = {
    schema_version: "basisReContentCrosscheck/v1",
    module_id: plan.module_id,
    work_unit: scene.work_unit,
    scene_id: scene.scene_id,
    target_svg: scene.target_svg,
    source_slides: scene.source_slides,
    mapping_type: scene.mapping_type,
    source_checks: sourceChecks,
    qa: { issues, warnings, open_questions: [] },
    status: issues.length ? "failed" : "passed",
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`${workUnit}: content crosscheck ${report.status}; ${issues.length} issue(s), ${warnings.length} warning(s).`);
  for (const issue of issues) console.log(`ERROR: ${issue}`);
  for (const warning of warnings) console.log(`WARNING: ${warning}`);
  if (issues.length) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
