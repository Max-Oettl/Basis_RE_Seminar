"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "rebuild-proposals", "svg", "RE2");
const files = [
  path.join(root, "slide_001", "slide_001.svg"),
  path.join(root, "slide_003", "slide_003.svg"),
  path.join(root, "slide_003", "plots", "bathtub_curve.svg"),
];

const colorMap = new Map([
  ["#E7F6FB", "#E6F6EE"],
  ["#139CCB", "#00A754"],
  ["#F2A93B", "#E9B400"],
  ["#062D46", "#031334"],
  ["#EEF3F6", "#F7F9FC"],
  ["#CBD5E1", "#CDD0D6"],
  ["#6A7A86", "#687185"],
  ["#007EA7", "#0C84B4"],
  ["#102A43", "#031334"],
  ["#D1495B", "#EC6244"],
  ["#2F6F55", "#00A754"],
  ["#B7791F", "#E9B400"],
]);

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

  fs.writeFileSync(file, svg, "utf8");
  process.stdout.write(`Normalized ${path.relative(root, file)}\n`);
}
