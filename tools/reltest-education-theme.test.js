"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const theme = require("./reltest-education-theme");

const repoRoot = path.resolve(__dirname, "..");
const tokens = JSON.parse(
  fs.readFileSync(
    path.join(repoRoot, "brand", "reltest-education-slide-design-tokens.json"),
    "utf8",
  ),
);

test("shared generator theme mirrors the canonical Education tokens", () => {
  assert.equal(theme.brandProfile, "reltest-education");
  assert.equal(theme.brandProfile, tokens.brand.profile);
  assert.equal(theme.colors.accent, tokens.colors.educationGreen);
  assert.equal(theme.colors.deep, tokens.colors.navy);
  assert.equal(theme.colors.failure, tokens.colors.educationCoral);
  assert.equal(theme.colors.cyan, tokens.colors.educationSteelCyan);
  assert.equal(theme.pictograms.styleProfile, "reltest-education-minimal-v1");
  assert.equal(theme.pictograms.defaultForeground, tokens.colors.navy);
  assert.equal(theme.pictograms.primaryAccent, tokens.colors.educationGreen);
  assert.equal(theme.pictograms.minimumNonTextContrast, 3);
  assert.match(theme.bodyFontFamily, /^"Archivo"/);
  assert.match(theme.displayFontFamily, /^"Oxanium"/);
});

test("active RE1 and RE2 generators use the shared Education theme", () => {
  const generatorFiles = [
    "generate-re1-full-slide-redesign.js",
    "generate-re2-chapter2-full-slide-redesign.js",
    "generate-re2-chapter3-full-slide-redesign.js",
    "generate-re2-chapter4-full-slide-redesign.js",
  ];
  const legacyPattern =
    /reltest-academy|academy-production|Segoe UI|#007EA7|#139CCB|#B7791F|#D1495B/i;

  for (const filename of generatorFiles) {
    const source = fs.readFileSync(path.join(__dirname, filename), "utf8");
    assert.match(source, /require\("\.\/reltest-education-theme"\)/);
    assert.doesNotMatch(source, legacyPattern);
  }
});
