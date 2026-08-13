"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "rebuild-proposals", "svg", "RE2");
const filesBySlide = new Map([
  [1, [path.join(root, "slide_001", "slide_001.svg")]],
  [3, [
    path.join(root, "slide_003", "slide_003.svg"),
    path.join(root, "slide_003", "plots", "bathtub_curve.svg"),
  ]],
]);

function selectedSlides() {
  const index = process.argv.indexOf("--slides");
  if (index < 0) return new Set(filesBySlide.keys());
  const result = new Set();
  for (const token of String(process.argv[index + 1] || "").split(",")) {
    const match = token.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!match) throw new Error(`Ungültige Folienauswahl: ${token}`);
    for (let slide = Number(match[1]); slide <= Number(match[2] || match[1]); slide += 1) {
      if (filesBySlide.has(slide)) result.add(slide);
    }
  }
  return result;
}

const colorMap = new Map([
  ["#00A754", "#142452"],
  ["#00A653", "#142452"],
  ["#E6F6EE", "#E8E9EE"],
  ["#CDD0D6", "#D0D3DC"],
  ["#E7F6FB", "#E8E9EE"],
  ["#139CCB", "#435075"],
  ["#F2A93B", "#727C97"],
  ["#062D46", "#031334"],
  ["#EEF3F6", "#F7F9FC"],
  ["#CBD5E1", "#D0D3DC"],
  ["#6A7A86", "#687185"],
  ["#007EA7", "#435075"],
  ["#102A43", "#031334"],
  ["#D1495B", "#EC6244"],
  ["#2F6F55", "#435075"],
  ["#B7791F", "#727C97"],
]);

const files = [...selectedSlides()].flatMap((slide) => filesBySlide.get(slide));
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let svg = fs.readFileSync(file, "utf8");
  svg = svg
    .replaceAll("reltest-academy", "reltest-education")
    .replaceAll("academy-production", "education-production")
    .replaceAll('"brandVariant":"technical"', '"brandVariant":"education-production"')
    .replace(/font-family\s*:\s*Inter\s*,\s*"Segoe UI"\s*,\s*Arial\s*,\s*sans-serif/gi, 'font-family: "Archivo", Arial, Helvetica, sans-serif')
    .replace(/font-family=["']Inter,[^"']*["']/gi, 'font-family="Archivo, Arial, Helvetica, sans-serif"')
    .replace(/\.card-title\s*\{\s*font-size:\s*34px;/gi, ".card-title { font-size: 32px;")
    .replace(/text\s*\{([^}]*)fill\s*:\s*#[0-9a-f]{6}\s*;?([^}]*)\}/gi, "text {$1$2}")
    .replace(/<text(?![^>]*\bfill=)([^>]*)>/gi, '<text fill="#031334"$1>')
    .replace(/stroke-width=["'](?:7|8|9|10|11|12)(?:\.0+)?["']/gi, 'stroke-width="4"');

  for (const [from, to] of colorMap) {
    svg = svg.replaceAll(from, to).replaceAll(from.toLowerCase(), to);
  }

  if (file.endsWith("slide_001.svg")) {
    svg = svg.replace(
      /(<g id="qualitative_focus_badge"[\s\S]*?<text[^>]*fill=")#[0-9A-Fa-f]{6}("[^>]*>FOKUS DIESES MODULS<\/text>)/,
      "$1#00A653$2",
    );
  }

  fs.writeFileSync(file, svg, "utf8");
  process.stdout.write(`Normalized ${path.relative(root, file)}\n`);
}
