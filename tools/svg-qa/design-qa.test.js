"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { runStaticDesignQa } = require("./design-qa");
const { pictogram } = require("../../components/pictogram-library/reltest-pictograms");

function metadata() {
  return JSON.stringify({
    artifactScope: "content-svg",
    embeddingTarget: "powerpoint-slide",
    slideType: "test",
    contentTitle: "Test",
    layoutIntent: "test-layout",
    takeaway: "Test takeaway",
    density: "low",
    contentMode: "transparent-content",
    backgroundMode: "transparent",
    brandProfile: "reltest-education",
    brandVariant: "education-technical",
  });
}

function fullSlideMetadata() {
  return JSON.stringify({
    artifactScope: "full-slide",
    embeddingTarget: "standalone-slide",
    slideType: "test",
    contentTitle: "Full slide test",
    layoutIntent: "brand-frame-test",
    takeaway: "Full slide takeaway",
    density: "balanced",
    contentMode: "full-slide",
    backgroundMode: "brand-frame",
    brandProfile: "reltest-education",
    brandVariant: "education-production",
    officialLogoStatus: "approved-original-asset",
  });
}

function runSvg(body, metadataValue = metadata()) {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "reltest-design-qa-"));
  const svgPath = path.join(repoRoot, "slide.svg");
  fs.writeFileSync(
    svgPath,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
      <metadata id="slide-quality-metadata" type="application/json"><![CDATA[${metadataValue}]]></metadata>
      ${body}
    </svg>`,
    "utf8",
  );
  return runStaticDesignQa({
    svgFiles: [svgPath],
    repoRoot,
    strictDesign: true,
  });
}

test("flags a global text fill that overrides a different text presentation fill", () => {
  const result = runSvg(`
    <style>text { font-family: Archivo, Arial, sans-serif; fill: #031334; }</style>
    <rect x="100" y="100" width="600" height="240" fill="#031334"/>
    <text id="inverse_text" x="140" y="220" font-size="32" fill="#FFFFFF">Visible text</text>
  `);

  const issue = result.issues.find((item) => item.rule === "text-fill-cascade");
  assert.ok(issue);
  assert.equal(issue.severity, "error");
  assert.match(issue.detail, /1 text node/);
});

test("flags connector strokes above the RelTest maximum", () => {
  const result = runSvg(`
    <style>text { font-family: Archivo, Arial, sans-serif; } .connector { fill: none; stroke: #00A754; stroke-width: 8; }</style>
    <path id="oversized_arrow" class="connector" d="M100 200H700"/>
  `);

  const issue = result.issues.find((item) => item.rule === "stroke-weight");
  assert.ok(issue);
  assert.equal(issue.severity, "error");
  assert.equal(issue.actual, 8);
});

test("accepts token stroke weights and text colors without a global fill conflict", () => {
  const result = runSvg(`
    <style>
      text { font-family: Archivo, Arial, sans-serif; }
      .inverse { fill: #FFFFFF; }
      .connector { fill: none; stroke: #00A754; stroke-width: 4; }
    </style>
    <rect x="100" y="100" width="600" height="240" fill="#031334"/>
    <text id="inverse_text" class="inverse" x="140" y="220" font-size="32">Visible text</text>
    <path id="normal_arrow" class="connector" d="M100 400H700"/>
  `);

  assert.equal(result.issues.some((item) => item.rule === "text-fill-cascade"), false);
  assert.equal(result.issues.some((item) => item.rule === "stroke-weight"), false);
  assert.equal(result.issues.some((item) => item.rule === "brand-font-family"), false);
});

test("accepts the Education background gradient but rejects SVG shadow filters", () => {
  const gradientResult = runSvg(`
    <defs>
      <linearGradient id="education_background">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#E6F6EE"/>
      </linearGradient>
    </defs>
    <style>text { font-family: Archivo, Arial, sans-serif; }</style>
    <rect width="1920" height="1080" fill="url(#education_background)"/>
    <text x="120" y="320" font-size="32" fill="#031334">Fachinhalt</text>
  `, fullSlideMetadata());
  assert.equal(gradientResult.issues.some((item) => item.rule === "brand-effects"), false);

  const shadowResult = runSvg(`
    <defs>
      <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="12"/></filter>
    </defs>
    <style>text { font-family: Archivo, Arial, sans-serif; }</style>
    <rect x="100" y="100" width="600" height="240" fill="#FFFFFF" filter="url(#shadow)"/>
    <text x="140" y="220" font-size="32" fill="#031334">Fachinhalt</text>
  `);
  assert.ok(shadowResult.issues.some((item) => item.rule === "brand-effects"));
});

test("recognizes full-slide metadata and accepts downstream-owned slide chrome", () => {
  const result = runSvg(`
    <style>text { font-family: Archivo, Arial, sans-serif; }</style>
    <rect width="1920" height="1080" fill="#FFFFFF"/>
    <text x="120" y="320" font-size="32" fill="#031334">Fachinhalt</text>
  `, fullSlideMetadata());

  assert.equal(result.files[0].artifactScope, "full-slide");
  assert.equal(result.issues.some((item) => item.rule === "content-svg-scope"), false);
  assert.equal(result.issues.some((item) => item.rule === "powerpoint-master-element"), false);
  assert.equal(result.issues.some((item) => item.rule === "full-slide-brand-frame"), false);
  assert.equal(result.issues.some((item) => item.rule === "full-slide-logo"), false);
  assert.equal(result.issues.some((item) => item.rule === "downstream-master-element"), false);
});

test("flags slide chrome that belongs to the downstream repository", () => {
  const result = runSvg(`
    <style>text { font-family: Archivo, Arial, sans-serif; }</style>
    <rect width="1920" height="1080" fill="#FFFFFF"/>
    <rect x="74" y="36" width="118" height="5" fill="#00A754"/>
    <text class="slide-title" x="78" y="116" font-size="56">Duplicate title</text>
    <text x="78" y="1026" font-size="20">RelTest Education | Reliability Engineer</text>
    <text x="1580" y="1026" font-size="20">RE1 · Szene 06</text>
    <g id="official_logo_reserved"/>
  `, fullSlideMetadata());

  const issues = result.issues.filter((item) => item.rule === "downstream-master-element");
  assert.ok(issues.length >= 4);
  assert.ok(issues.every((item) => item.severity === "error"));
});

test("flags the retired Academy profile", () => {
  const retired = {
    ...JSON.parse(metadata()),
    brandProfile: "reltest-academy",
  };
  const result = runSvg(`
    <style>text { font-family: Archivo, Arial, sans-serif; }</style>
    <text x="120" y="320" font-size="32" fill="#031334">Fachinhalt</text>
  `, JSON.stringify(retired));

  assert.ok(result.issues.some((item) => item.rule === "brand-profile"));
});

test("flags the retired Academy name in visible text", () => {
  const result = runSvg(`
    <style>text { font-family: Archivo, Arial, sans-serif; }</style>
    <text x="120" y="320" font-size="32" fill="#031334">RelTest Academy</text>
  `);

  assert.ok(result.issues.some((item) => item.rule === "legacy-brand-name"));
});

test("flags a legacy leading font and accepts Archivo with fallbacks", () => {
  const legacyResult = runSvg(`
    <style>text { font-family: "Segoe UI", Arial, sans-serif; }</style>
    <text x="120" y="320" font-size="32" fill="#031334">Fachinhalt</text>
  `);
  assert.ok(legacyResult.issues.some((item) => item.rule === "brand-font-family"));

  const educationResult = runSvg(`
    <style>text { font-family: "Archivo", Arial, Helvetica, sans-serif; }</style>
    <text x="120" y="320" font-size="32" fill="#031334">Fachinhalt</text>
  `);
  assert.equal(
    educationResult.issues.some((item) => item.rule === "brand-font-family"),
    false,
  );
});

test("accepts canonical Education pictograms and rejects low-contrast variants", () => {
  const validResult = runSvg(`
    <style>text { font-family: Archivo, Arial, sans-serif; }</style>
    ${pictogram("target", { cx: 200, cy: 200, size: 64 })}
    <text x="260" y="210" font-size="32" fill="#031334">Ziel</text>
  `);
  assert.equal(validResult.issues.some((item) => item.rule.startsWith("pictogram-")), false);

  const invalidResult = runSvg(`
    <style>text { font-family: Archivo, Arial, sans-serif; }</style>
    ${pictogram("shield", { cx: 200, cy: 200, size: 64, color: "#E9B400", background: "#FFFFFF" })}
    <text x="260" y="210" font-size="32" fill="#031334">Warnung</text>
  `);
  assert.ok(invalidResult.issues.some((item) => item.rule === "pictogram-contrast"));
});
