const test = require("node:test");
const assert = require("node:assert/strict");

const domain = require("./svg-editor-server-domain");

test("findet ausschliesslich lokale referenzierte Formel-SVGs", () => {
  const source = `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <image href="formulas/a.svg" data-formula-asset="formulas/a.svg"/>
  <image href="formulas/b.svg" data-formula-asset="true"/>
  <svg data-formula-asset="true"><text>inline</text></svg>
</svg>`;
  const result = domain.discoverFormulaAssetReferences(source);
  assert.deepEqual(result.issues, []);
  assert.deepEqual(result.references.map((item) => item.path), ["formulas/a.svg", "formulas/b.svg"]);
  assert.deepEqual(domain.extractRootAttributes(source), {
    width: "1920",
    height: "1080",
    viewBox: "0 0 1920 1080",
  });
});

test("Formelpfade bleiben innerhalb des Szenenordners", () => {
  assert.equal(domain.normalizeFormulaAssetPath("formulas/math.svg"), "formulas/math.svg");
  for (const unsafe of [
    "../math.svg",
    "formulas/../math.svg",
    "/tmp/math.svg",
    "C:\\tmp\\math.svg",
    "https://example.test/math.svg",
    "formulas/math.png",
    "formulas/math.svg?x=1",
    "formulas/%2e%2e/math.svg",
  ]) {
    assert.equal(domain.normalizeFormulaAssetPath(unsafe), null, unsafe);
  }
});

test("SVG-Sicherheitsvalidierung blockiert aktive Inhalte und doppelte IDs", () => {
  const attacks = [
    `<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg"><foreignObject/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg"><iframe/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg"><object/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg"><embed/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg"><a href="jav&#x61;script:alert(1)"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg"><a href="vbscript:alert(1)"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg"><image href="data:text/html,x"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg"><image href="https://example.test/x.png"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg"><style>@import "x.css"</style></svg>`,
    `<!DOCTYPE svg SYSTEM "https://example.test/svg.dtd"><svg xmlns="http://www.w3.org/2000/svg"></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg"><g id="same"/><g id="same"/></svg>`,
  ];
  for (const source of attacks) {
    const result = domain.validateSvgSource(source);
    assert.equal(result.valid, false, source);
    assert.ok(result.errors.length > 0, source);
  }

  const safe = `<svg xmlns="http://www.w3.org/2000/svg"><image href="data:image/png;base64,AA=="/><use href="#shape"/><g id="shape"/></svg>`;
  assert.equal(domain.validateSvgSource(safe).valid, true);
});

test("SVG-Wurzel und schliessendes Element sind Pflicht", () => {
  assert.equal(domain.validateSvgSource(`<g/>`).valid, false);
  assert.equal(domain.validateSvgSource(`<svg><g/></svg><p/>`).valid, false);
  assert.equal(domain.validateSvgSource(`<?xml version="1.0"?><!-- ok --><svg><!-- body --></svg>`).valid, true);
});

test("Dokumentpruefsumme umfasst Pfad, Existenz und exakten Formelquelltext", () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"></svg>\n`;
  const formula = `<svg xmlns="http://www.w3.org/2000/svg"><text>x</text></svg>\n`;
  const original = domain.documentSha256(svg, [{ path: "formulas/a.svg", exists: true, source: formula }]);
  assert.match(original, /^[a-f0-9]{64}$/);
  assert.equal(
    original,
    domain.documentSha256(svg, [{ path: "formulas/a.svg", exists: true, source: formula }]),
  );
  assert.notEqual(
    original,
    domain.documentSha256(svg, [{ path: "formulas/a.svg", exists: true, source: formula.replace("x", "y") }]),
  );
  assert.notEqual(
    original,
    domain.documentSha256(svg, [{ path: "formulas/b.svg", exists: true, source: formula }]),
  );
  assert.notEqual(
    original,
    domain.documentSha256(svg, [{ path: "formulas/a.svg", exists: false, source: "" }]),
  );
});

test("Formelmetadaten werden ohne Veraenderung des Quelltexts gelesen", () => {
  const source = `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="82" viewBox="0 0 620 82" data-formula-fontsize="36" data-renderer="mathtext">
    <metadata><![CDATA[{"formula":"R(t)=1-F(t)","fontSize":36}]]></metadata>
  </svg>`;
  assert.deepEqual(domain.extractSvgMetadata(source), {
    width: "620",
    height: "82",
    viewBox: "0 0 620 82",
    formulaFontSize: "36",
    renderer: "mathtext",
    formula: "R(t)=1-F(t)",
  });
  assert.equal(domain.sha256(source), domain.sha256(`${source}`));
});
