"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const inventoryArgument = process.argv.slice(2).find((argument) => !argument.startsWith("--"));

if (!inventoryArgument) {
  console.error("Usage: node tools/validate-source-svg-inventory.js <inventory.json>");
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function repoPath(value) {
  return path.resolve(repoRoot, String(value || "").replaceAll("/", path.sep));
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function main() {
  const data = readJson(path.resolve(inventoryArgument));
  const errors = [];
  const warnings = [];
  const seenNumbers = new Set();
  const seenKeys = new Set();

  if (data.schema_version !== "basisReSourceSvgInventory/v2") errors.push("schema_version muss basisReSourceSvgInventory/v2 sein.");
  if (!/^RE[1-5]$/.test(data.module_id || "")) errors.push("module_id ist ungueltig.");
  if (data.input_kind !== "powerpoint_slide_svg") errors.push("input_kind ist ungueltig.");
  if (data.text_mapping_status !== "mapped") errors.push("text_mapping_status ist nicht mapped.");
  if (!Array.isArray(data.slides) || data.slides.length === 0) errors.push("slides fehlt oder ist leer.");

  let previousNumber = null;
  for (const slide of data.slides || []) {
    if (seenNumbers.has(slide.source_slide_number)) errors.push(`Doppelte Foliennummer: ${slide.source_slide_number}`);
    if (seenKeys.has(slide.source_slide_key)) errors.push(`Doppelter Folienkey: ${slide.source_slide_key}`);
    seenNumbers.add(slide.source_slide_number);
    seenKeys.add(slide.source_slide_key);
    if (previousNumber !== null && slide.source_slide_number !== previousNumber + 1) {
      errors.push(`Nicht lueckenlose Reihenfolge bei Folie ${slide.source_slide_number}.`);
    }
    previousNumber = slide.source_slide_number;

    const svgPath = repoPath(slide.source_svg);
    if (!fs.existsSync(svgPath)) errors.push(`Quell-SVG fehlt: ${slide.source_svg}`);
    else if (sha256(svgPath) !== slide.sha256) errors.push(`SVG-Hash stimmt nicht: ${slide.source_svg}`);
    if (!slide.spoken_text || !slide.spoken_text_source || !slide.text_mapping_ref) {
      errors.push(`Textzuordnung fehlt: ${slide.source_slide_key}`);
    }
    if (!slide.view_box || slide.view_box === "missing") errors.push(`viewBox nicht ableitbar: ${slide.source_slide_key}`);
    if (slide.features?.powerpoint_speaker_control_count > 0) {
      warnings.push(`${slide.source_slide_key}: PowerPoint-Lautsprecher muss bei der Transformation entfernt werden.`);
    }
  }

  console.log(`Inventory slides: ${data.slides?.length || 0}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  for (const error of errors) console.log(`ERROR: ${error}`);
  for (const warning of warnings) console.log(`WARNING: ${warning}`);
  if (errors.length) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
