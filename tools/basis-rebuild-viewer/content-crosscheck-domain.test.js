const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildContentCrosscheck,
  extractSvgText,
  suspiciousEncodingFragments,
  textCoverage,
} = require("./content-crosscheck-domain");

test("SVG-Text wird ueber Text- und Tspan-Grenzen extrahiert", () => {
  const extracted = extractSvgText(
    '<svg><text>Berechnen <tspan>von</tspan></text><text>Ausfallwahrscheinlichkeiten</text></svg>',
  );
  assert.equal(extracted.text, "Berechnen von Ausfallwahrscheinlichkeiten");
  assert.equal(
    textCoverage("Berechnen von Ausfallwahrscheinlichkeiten", extracted.text).matched,
    true,
  );
});

test("typische Mojibake-Fragmente werden als Uebertragungsrisiko erkannt", () => {
  assert.deepEqual(suspiciousEncodingFragments("F(táµ¢) und GrÃ¶ÃŸe"), ["Ã¶", "ÃŸ", "áµ¢"]);
});

test("zusammengefuehrte Quellfolien werden gemeinsam geprueft", () => {
  const svg = '<svg><text>Hilfslinien</text><text>Lebensdauer t</text></svg>';
  const extracted = extractSvgText(svg);
  const report = buildContentCrosscheck({
    moduleId: "RE3_TEST_1",
    outputSlideNumber: 4,
    referenceMapping: {
      mapping_type: "merged",
      source_slides: [3, 4],
      primary_source_slide: 4,
    },
    sources: [
      {
        slideNumber: 3,
        oldSlide: { path: "Folie3.PNG" },
        analysisPath: "slide3.json",
        analysis: {
          visibleText: [{ id: "a", text: "Hilfslinien", role: "label" }],
          visualElements: [],
        },
      },
      {
        slideNumber: 4,
        oldSlide: { path: "Folie4.PNG" },
        analysisPath: "slide4.json",
        analysis: {
          visibleText: [{ id: "b", text: "Lebensdauer t", role: "label" }],
          visualElements: [],
        },
      },
    ],
    proposal: { path: "slide_004.svg", svg_sha256: "abc" },
    svgSource: svg,
    svgText: extracted.text,
    animationStepCount: 3,
  });

  assert.equal(report.status, "precheck_passed");
  assert.equal(report.summary.source_count, 2);
  assert.equal(report.content_checks.length, 2);
  assert.equal(report.summary.errors, 0);
});

test("Zusatzfolien bleiben ohne erfundene Altfolienreferenz", () => {
  const report = buildContentCrosscheck({
    moduleId: "RE3_TEST_1",
    outputSlideNumber: 1001,
    isAdditionalSlide: true,
    referenceMapping: { mapping_type: "new_content", source_slides: [] },
    sources: [],
    reviewNotes: "Neue Einordnung der Methode",
    proposal: { path: "slide_1001.svg", svg_sha256: "abc" },
    svgSource: "<svg><text>Neue Einordnung</text></svg>",
    svgText: "Neue Einordnung",
    animationStepCount: 1,
  });

  assert.equal(report.references.length, 0);
  assert.equal(report.summary.errors, 0);
  assert.equal(report.status, "precheck_passed");
  assert.equal(report.manual_review_required, true);
});
