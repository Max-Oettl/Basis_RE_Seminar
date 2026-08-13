"use strict";

const fs = require("fs");
const path = require("path");
const { renderFormulaSvg } = require("./svg-formula-renderer");

const repoRoot = path.resolve(__dirname, "..", "..");
const targetRoot = path.join(repoRoot, "rebuild-proposals", "svg", "RE4");

function listSvgFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory() ? listSvgFiles(absolutePath) : entry.isFile() && entry.name.endsWith(".svg") ? [absolutePath] : [];
  });
}

function metadataObjects(source) {
  const values = [];
  for (const match of source.matchAll(/<metadata\b[^>]*>([\s\S]*?)<\/metadata>/gi)) {
    const text = match[1].replace(/^\s*<!\[CDATA\[/, "").replace(/\]\]>\s*$/, "").trim();
    try { values.push(JSON.parse(text)); } catch { /* descriptive metadata is optional */ }
  }
  return values;
}

function attribute(source, name, fallback = "") {
  return source.match(new RegExp(`(?:<svg\\b[^>]*|<text\\b[^>]*)\\s${name}=["']([^"']+)["']`, "i"))?.[1] || fallback;
}

async function migrateFile(absolutePath, write) {
  const original = fs.readFileSync(absolutePath, "utf8");
  if (!/data-renderer=["'](?:controlled-svg-text-fallback|svg-editor-controlled-fallback)["']/i.test(original)) return null;
  const metadata = metadataObjects(original);
  const formulaMetadata = metadata.find((item) => typeof item.formula === "string");
  const qualityMetadata = original.match(/<metadata\b[^>]*\bid=["']slide_quality_metadata["'][^>]*>[\s\S]*?<\/metadata>/i)?.[0] || "";
  const formula = formulaMetadata?.formula || metadata.find((item) => typeof item.takeaway === "string")?.takeaway;
  if (!formula) throw new Error(`Keine Formelquelle in ${path.relative(repoRoot, absolutePath)}`);
  const rendered = await renderFormulaSvg(formula, {
    fontSize: attribute(original, "data-formula-fontsize", formulaMetadata?.fontSize || 34),
    color: original.match(/<text\b[^>]*\sfill=["']([^"']+)["']/i)?.[1] || "#142452",
    width: attribute(original, "width", 480),
    height: attribute(original, "height", 80),
  });
  let next = rendered.source;
  if (qualityMetadata) next = next.replace(/(<title>[\s\S]*?<\/title>)/i, `$1${qualityMetadata}`);
  next = `<?xml version="1.0" encoding="UTF-8"?>\n${next}\n`;
  if (write) fs.writeFileSync(absolutePath, next, "utf8");
  return {
    path: path.relative(repoRoot, absolutePath).replace(/\\/g, "/"),
    formula,
    tex: rendered.tex,
    changed: original !== next,
  };
}

async function main() {
  const write = process.argv.includes("--write");
  const results = [];
  for (const filePath of listSvgFiles(targetRoot)) {
    const result = await migrateFile(filePath, write);
    if (result) results.push(result);
  }
  console.log(JSON.stringify({ mode: write ? "write" : "dry-run", count: results.length, results }, null, 2));
}

if (require.main === module) main().catch((error) => { console.error(error); process.exitCode = 1; });

module.exports = { metadataObjects, migrateFile };
