"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..", "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function assertTrueTypeFont(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  assert.equal(fs.existsSync(absolutePath), true, `${relativePath} is missing`);
  const bytes = fs.readFileSync(absolutePath);
  assert.ok(bytes.length > 1024, `${relativePath} is unexpectedly small`);
  assert.deepEqual(
    [...bytes.subarray(0, 4)],
    [0x00, 0x01, 0x00, 0x00],
    `${relativePath} is not a valid TrueType font`,
  );
}

test("Education token sources use the active profile and official palette", () => {
  const company = readJson("brand/company-brand-tokens.json");
  const fullSlide = readJson("brand/reltest-education-slide-design-tokens.json");

  assert.equal(company.brand.companyName, "RelTest Education");
  assert.equal(company.brand.profile, "reltest-education");
  assert.equal(company.colors.brandPrimary, "#031334");
  assert.equal(company.colors.accentPrimary, "#00A754");
  assert.equal(company.colors.educationGold, "#E9B400");
  assert.equal(company.colors.educationCoral, "#EC6244");
  assert.equal(company.colors.educationSteelCyan, "#0C84B4");
  assert.equal(company.colors.educationGraphiteBlue, "#25495F");

  assert.equal(fullSlide.brand.profile, "reltest-education");
  assert.equal(fullSlide.colors.educationGreen, "#00A754");
  assert.equal(fullSlide.typography.h1.family, "Oxanium");
  assert.equal(fullSlide.typography.body.family, "Archivo");
  assert.equal(fullSlide.brandFrame.chromeOwner, "downstream-repository");
});

test("Education production fonts are bundled and referenced by both token sources", () => {
  const company = readJson("brand/company-brand-tokens.json");
  const fullSlide = readJson("brand/reltest-education-slide-design-tokens.json");
  const fontPaths = Object.values(company.typography.fontAssets)
    .filter((value) => typeof value === "string" && value.endsWith(".ttf"));

  assert.deepEqual(
    fontPaths,
    [
      "brand/fonts/oxanium/Oxanium-wght.ttf",
      "brand/fonts/archivo/Archivo-wdth-wght.ttf",
      "brand/fonts/archivo/Archivo-Italic-wdth-wght.ttf",
    ],
  );
  assert.deepEqual(fullSlide.typography.fontAssets, company.typography.fontAssets);
  for (const fontPath of fontPaths) assertTrueTypeFont(fontPath);
});

test("legacy Academy tokens remain a deprecated compatibility redirect", () => {
  const legacy = readJson("brand/reltest-academy-slide-design-tokens.json");

  assert.match(String(legacy.status || ""), /deprecated/i);
  assert.equal(
    legacy.replacedBy,
    "brand/reltest-education-slide-design-tokens.json",
  );
});
