#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "rebuild-proposals", "svg", "RE2");
const files = fs.readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^slide_\d+$/.test(entry.name))
  .map((entry) => path.join(root, entry.name, `${entry.name}.svg`))
  .filter((file) => fs.existsSync(file));

let changed = 0;
let removedBackgrounds = 0;

for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  let after = before;

  after = after.replace(/\s*<g\b[^>]*\bid=["']brand_background["'][^>]*>[\s\S]*?<\/g>/g, () => {
    removedBackgrounds += 1;
    return "";
  });
  after = after.replace(/\s*<rect\b(?=[^>]*(?:width=["']1920["']|width=["']100%["']))(?=[^>]*(?:height=["']1080["']|height=["']100%["']))[^>]*fill=["']url\(#(?:backgroundGradient|technicalGrid)\)["'][^>]*\/>/g, "");
  after = after.replace(/\s*<linearGradient\b[^>]*\bid=["']backgroundGradient["'][^>]*>[\s\S]*?<\/linearGradient>/g, "");
  after = after.replace(/\s*<pattern\b[^>]*\bid=["']technicalGrid["'][^>]*>[\s\S]*?<\/pattern>/g, "");

  after = after
    .replace(/data-artifact-scope=["']full-slide["']/g, 'data-artifact-scope="content-svg"')
    .replace(/data-embedding-target=["']standalone-slide["']/g, 'data-embedding-target="powerpoint-slide"')
    .replace(/"artifactScope"\s*:\s*"full-slide"/g, '"artifactScope":"content-svg"')
    .replace(/"embeddingTarget"\s*:\s*"standalone-slide"/g, '"embeddingTarget":"powerpoint-slide"')
    .replace(/"contentMode"\s*:\s*"full-slide"/g, '"contentMode":"transparent-content"')
    .replace(/"backgroundMode"\s*:\s*"brand-frame"/g, '"backgroundMode":"transparent"');

  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    changed += 1;
  }
}

console.log(JSON.stringify({ scanned: files.length, changed, removedBackgrounds }, null, 2));
