"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const {
  pictogram,
  pictogramKinds,
  pictogramRegistry,
} = require("../components/pictogram-library/reltest-pictograms");
const {
  contrastRatio,
  validatePictogramMarkup,
  validatePictogramProductionPolicy,
  validatePictogramsInSvg,
  validateRegistry,
} = require("./pictogram-qa");

test("registry and library contain the same semantically documented pictograms", () => {
  assert.deepEqual(validateRegistry(pictogramRegistry, [...pictogramKinds]), []);
});

test("canonical default pictograms pass the strict markup checks", () => {
  for (const kind of pictogramKinds) {
    const findings = validatePictogramMarkup(pictogram(kind, { size: 64 }));
    assert.equal(findings.some((finding) => finding.severity === "error"), false, kind);
  }
});

test("small status pictograms require review and subminimum pictograms are rejected", () => {
  const findings = validatePictogramMarkup(pictogram("clock", { size: 48 }));
  assert.ok(findings.some((finding) => finding.rule === "pictogram-small-scale-review"));
  assert.throws(() => pictogram("clock", { size: 24 }), /minimum is 32px/);
});

test("standalone semantic pictograms receive an escaped accessible name", () => {
  const markup = pictogram("search", { size: 64, ariaLabel: 'Bauteil suchen & prüfen' });
  assert.match(markup, /role="img"/);
  assert.match(markup, /aria-label="Bauteil suchen &amp; prüfen"/);
  assert.equal(validatePictogramMarkup(markup).some((finding) => finding.rule === "pictogram-accessibility"), false);
});

test("gold outline on a light field fails the non-text contrast gate", () => {
  const markup = pictogram("shield", { size: 64, color: "#E9B400", background: "#FFFFFF" });
  const findings = validatePictogramMarkup(markup);
  assert.ok(findings.some((finding) => finding.rule === "pictogram-contrast"));
  assert.ok(contrastRatio("#E9B400", "#FFFFFF") < 3);
});

test("pictogram snippets are discovered inside a scene SVG", () => {
  const scene = `<svg xmlns="http://www.w3.org/2000/svg">${pictogram("target", { size: 64 })}</svg>`;
  assert.equal(validatePictogramsInSvg(scene).length, 0);
});

test("production policy accepts generated PNG pictograms and rejects SVG-built pictograms", () => {
  const generatedPng = '<svg><image href="media/costs.png" data-pictogram-asset-type="generated_png"/></svg>';
  assert.deepEqual(validatePictogramProductionPolicy(generatedPng), []);

  const svgBuilt = `<svg>${pictogram("target", { size: 64 })}</svg>`;
  assert.ok(validatePictogramProductionPolicy(svgBuilt).some((finding) => finding.rule === "pictogram-png-only"));

  const wrongFormat = '<svg><image href="media/costs.svg" data-pictogram-asset-type="generated_png"/></svg>';
  assert.ok(validatePictogramProductionPolicy(wrongFormat).some((finding) => finding.rule === "pictogram-png-format"));
});

test("generated PNG registry items need an asset path but no SVG geometry", () => {
  const registry = {
    items: [{
      id: "generated-example",
      assetType: "generated_png",
      assetPath: "components/image-library/generated-pictograms/example.png",
      meaning: "Beispiel",
      preferredLabels: ["Beispiel"],
      avoidFor: ["Gegenbeispiel"],
      semanticRoles: ["concept-anchor"],
    }],
  };
  assert.deepEqual(validateRegistry(registry, []), []);
  delete registry.items[0].assetPath;
  assert.ok(validateRegistry(registry, []).some((finding) => finding.rule === "pictogram-registry-asset"));
});
