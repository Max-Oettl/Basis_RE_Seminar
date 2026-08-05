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

test("statische zusammengefuehrte Szene braucht keine erfundene Animation", () => {
  const report = buildContentCrosscheck({
    moduleId: "RE1",
    outputSlideNumber: 4,
    referenceMapping: { mapping_type: "merged", source_slides: [3, 4], primary_source_slide: 4 },
    sources: [{ slideNumber: 3 }, { slideNumber: 4 }],
    proposal: { path: "slide_004.svg", svg_sha256: "abc" },
    svgSource: "<svg><text>Vollstaendige statische Szene</text></svg>",
    svgText: "Vollstaendige statische Szene",
    animationDecision: "static",
    animationStepCount: 0,
  });

  assert.equal(
    report.findings.some((finding) => finding.code === "merged-source-without-animation"),
    false,
  );
});

test("animierte zusammengefuehrte Szene ohne Schritte bleibt ein Befund", () => {
  const report = buildContentCrosscheck({
    moduleId: "RE1",
    outputSlideNumber: 4,
    referenceMapping: { mapping_type: "merged", source_slides: [3, 4], primary_source_slide: 4 },
    sources: [{ slideNumber: 3 }, { slideNumber: 4 }],
    proposal: { path: "slide_004.svg", svg_sha256: "abc" },
    svgSource: "<svg><text>Geplanter Aufbau</text></svg>",
    svgText: "Geplanter Aufbau",
    animationDecision: "animated",
    animationStepCount: 0,
  });

  assert.equal(
    report.findings.some((finding) => finding.code === "merged-source-without-animation"),
    true,
  );
});

test("Quell-SVG-Text wird ohne Legacy-Analyse direkt gegen das Ziel geprueft", () => {
  const sourceSvg = '<svg viewBox="0 0 100 100"><text>Ausfallwahrscheinlichkeit</text><text>Lebensdauer</text></svg>';
  const targetSvg = '<svg viewBox="0 0 100 100"><text>Ausfallwahrscheinlichkeit</text><text>Lebensdauer</text></svg>';
  const report = buildContentCrosscheck({
    moduleId: "RE1",
    outputSlideNumber: 1,
    referenceMapping: {
      mapping_type: "direct",
      source_slides: [1],
      primary_source_slide: 1,
    },
    sources: [{
      slideNumber: 1,
      oldSlide: {
        path: "source-materials/basis-seminar/powerpoint-svg/RE1/slide_001.svg",
        sourceKind: "powerpoint_svg",
      },
      sourceSvgSource: sourceSvg,
      analysisPath: "",
      analysis: null,
    }],
    proposal: { path: "slide_001.svg", svg_sha256: "abc" },
    svgSource: targetSvg,
    svgText: extractSvgText(targetSvg).text,
    animationStepCount: 1,
  });

  assert.equal(report.schema_version, "basisRebuildContentCrosscheck/v2");
  assert.equal(report.status, "precheck_passed");
  assert.equal(report.content_checks.length, 2);
  assert.match(report.references[0].source_svg_path, /slide_001\.svg$/);
  assert.match(report.references[0].source_svg_sha256, /^[a-f0-9]{64}$/);
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

test("unbelegter sichtbarer Zieltext wird als Gegenrichtungs-Befund erkannt", () => {
  const sourceSvg = '<svg><text>System</text><text>Produkt / Prozess</text></svg>';
  const targetSvg = '<svg><text>System</text><text>Produkt / Prozess</text><text>SYSTEMGRENZE</text></svg>';
  const report = buildContentCrosscheck({
    moduleId: "RE2",
    outputSlideNumber: 8,
    referenceMapping: { mapping_type: "direct", source_slides: [8], primary_source_slide: 8 },
    sources: [{
      slideNumber: 8,
      oldSlide: { path: "Folie8.SVG", sourceKind: "powerpoint_svg" },
      sourceSvgSource: sourceSvg,
    }],
    proposal: { path: "slide_008.svg", svg_sha256: "abc" },
    svgSource: targetSvg,
    svgText: extractSvgText(targetSvg).text,
    spokenText: "Das P-Diagramm beschreibt Ein- und Ausgangsgrößen.",
    animationDecision: "static",
  });

  assert.equal(
    report.findings.some((finding) =>
      finding.code === "target-text-not-source-supported" &&
      finding.target_text === "SYSTEMGRENZE"
    ),
    true,
  );
  assert.equal(
    report.target_text_checks.some((check) =>
      check.target_text === "SYSTEMGRENZE" &&
      check.result === "unsupported_target_text"
    ),
    true,
  );
});

test("dokumentierte Zielergaenzung bleibt nachvollziehbar und ohne Befund", () => {
  const sourceSvg = '<svg><text>System</text></svg>';
  const targetSvg = `<svg>
    <text>System</text>
    <text data-source-evidence="user_request" data-source-reference="Review 2026-07-24">Zusatzlabel</text>
  </svg>`;
  const report = buildContentCrosscheck({
    moduleId: "RE2",
    outputSlideNumber: 8,
    referenceMapping: { mapping_type: "direct", source_slides: [8], primary_source_slide: 8 },
    sources: [{
      slideNumber: 8,
      oldSlide: { path: "Folie8.SVG", sourceKind: "powerpoint_svg" },
      sourceSvgSource: sourceSvg,
    }],
    proposal: { path: "slide_008.svg", svg_sha256: "abc" },
    svgSource: targetSvg,
    svgText: extractSvgText(targetSvg).text,
    animationDecision: "static",
  });

  assert.equal(
    report.findings.some((finding) =>
      finding.code === "target-text-not-source-supported" &&
      finding.target_text === "Zusatzlabel"
    ),
    false,
  );
  assert.equal(
    report.target_text_checks.some((check) =>
      check.target_text === "Zusatzlabel" &&
      check.result === "documented_addition"
    ),
    true,
  );
});
