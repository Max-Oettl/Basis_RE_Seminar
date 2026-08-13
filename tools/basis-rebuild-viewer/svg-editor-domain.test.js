"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const domain = require("./svg-editor-domain.js");

test("relative SVG assets resolve through /files without touching absolute references", () => {
  assert.equal(
    domain.resolveAssetUrl("rebuild-proposals/svg/RE4/slide_055/slide_055.svg", "formulas/bridge-total.svg"),
    "/files/rebuild-proposals/svg/RE4/slide_055/formulas/bridge-total.svg",
  );
  assert.equal(domain.resolveAssetUrl("a/b.svg", "#marker"), "#marker");
  assert.equal(domain.resolveAssetUrl("a/b.svg", "data:image/png;base64,abc"), "data:image/png;base64,abc");
});

test("formula source is recovered from metadata and fallback comments", () => {
  assert.equal(domain.extractFormulaSource("", { formula: "R(t)=e^{-λt}" }), "R(t)=e^{-λt}");
  assert.equal(domain.extractFormulaSource("<!-- latex: \\frac{a}{b} -->"), "\\frac{a}{b}");
  assert.equal(
    domain.extractFormulaSource('<svg><metadata>{"formula":"x^2"}</metadata></svg>'),
    "x^2",
  );
  assert.equal(domain.extractFormulaSource("<!-- $R(t)=e^{-\\lambda t}$ -->"), "R(t)=e^{-\\lambda t}");
});

test("number and transform helpers are stable for editor transactions", () => {
  assert.equal(domain.formatNumber(-0.00001), "0");
  assert.equal(domain.finiteNumber("12,5"), 12.5);
  assert.equal(domain.appendTransform("rotate(10)", "translate(2 3)"), "translate(2 3) rotate(10)");
  assert.equal(domain.preserveXmlPreamble('<?xml version="1.0"?>\n<svg/>', "<svg></svg>"), '<?xml version="1.0"?>\n<svg></svg>');
});

test("Shift constrains movement and line endpoints to one axis", () => {
  assert.deepEqual(domain.constrainDelta(24, 7), { dx: 24, dy: 0 });
  assert.deepEqual(domain.constrainDelta(3, -18), { dx: 0, dy: -18 });
  assert.deepEqual(
    domain.constrainLineEndpoint({ x1: 0, y1: 0, x2: 100, y2: 40 }, "end", { x: 60, y: 8 }, true),
    { x: 60, y: 0 },
  );
  assert.deepEqual(
    domain.constrainLineEndpoint({ x1: 0, y1: 0, x2: 100, y2: 40 }, "start", { x: 95, y: -30 }, true),
    { x: 100, y: -30 },
  );
});

test("boxes can be centered on or docked to a reference line", () => {
  const box = { x: 20, y: 70, width: 40, height: 20 };
  const horizontalLine = { x: 100, y: 40, width: 200, height: 0 };
  assert.deepEqual(domain.alignmentDelta(box, horizontalLine, "center-x"), { dx: 160, dy: 0 });
  assert.deepEqual(domain.alignmentDelta(box, horizontalLine, "center-both"), { dx: 160, dy: -40 });
  assert.deepEqual(domain.alignmentDelta(box, horizontalLine, "dock"), { dx: 160, dy: -30 });
});

test("connector points can be parsed, extended and serialized without losing geometry", () => {
  const points = domain.parseConnectorPoints("10,20 80,20 80,90");
  assert.deepEqual(points, [{ x: 10, y: 20 }, { x: 80, y: 20 }, { x: 80, y: 90 }]);
  assert.equal(domain.longestConnectorSegment(points), 0);
  assert.deepEqual(domain.insertConnectorPoint(points, 1), [
    { x: 10, y: 20 }, { x: 80, y: 20 }, { x: 80, y: 55 }, { x: 80, y: 90 },
  ]);
  assert.equal(domain.serializeConnectorPoints(points), "10 20 80 20 80 90");
});

test("straight and orthogonal SVG paths become editable connector points", () => {
  assert.deepEqual(domain.pathToConnectorPoints("M1557 458V484H1317V510"), [
    { x: 1557, y: 458 }, { x: 1557, y: 484 }, { x: 1317, y: 484 }, { x: 1317, y: 510 },
  ]);
  assert.deepEqual(domain.pathToConnectorPoints("M 20 30 L 80 30 l 0 50"), [
    { x: 20, y: 30 }, { x: 80, y: 30 }, { x: 80, y: 80 },
  ]);
  assert.deepEqual(domain.pathToConnectorPoints("M 0 0 C 10 0 20 20 30 20"), []);
});

test("connector endpoints dock to each side of a reference box", () => {
  const box = { x: 100, y: 200, width: 80, height: 40 };
  assert.deepEqual(domain.dockConnectorPoint(box, "left"), { x: 100, y: 220 });
  assert.deepEqual(domain.dockConnectorPoint(box, "right"), { x: 180, y: 220 });
  assert.deepEqual(domain.dockConnectorPoint(box, "top"), { x: 140, y: 200 });
  assert.deepEqual(domain.dockConnectorPoint(box, "bottom"), { x: 140, y: 240 });
});

test("marquee selection requires full containment from either drag direction", () => {
  const marquee = { left: 10, top: 10, right: 100, bottom: 100 };
  assert.equal(domain.rectMatchesMarquee({ left: 20, top: 20, right: 80, bottom: 80 }, marquee), true);
  assert.equal(domain.rectMatchesMarquee({ left: 80, top: 80, right: 130, bottom: 130 }, marquee), false);
  assert.equal(domain.rectMatchesMarquee({ left: 120, top: 120, right: 140, bottom: 140 }, marquee), false);
});

test("mouse wheel zooms in both directions and clamps safely", () => {
  assert.ok(domain.zoomFromWheel(1, -120) > 1);
  assert.ok(domain.zoomFromWheel(1, 120) < 1);
  assert.equal(domain.zoomFromWheel(4, -10000), 4);
  assert.equal(domain.zoomFromWheel(.2, 10000), .2);
});

test("wheel panning preserves vertical and horizontal intent", () => {
  assert.deepEqual(domain.panFromWheel(0, 120, false), { dx: 0, dy: 120 });
  assert.deepEqual(domain.panFromWheel(80, 0, false), { dx: 80, dy: 0 });
  assert.deepEqual(domain.panFromWheel(0, 120, true), { dx: 120, dy: 0 });
});

test("formula library inserts into the first editable placeholder", () => {
  assert.deepEqual(domain.prepareFormulaInsertion("\\frac{}{}"), {
    text: "\\frac{}{}", selectionStart: 6, selectionEnd: 6,
  });
  assert.deepEqual(domain.prepareFormulaInsertion("\\left({}\\right)", "R(t)"), {
    text: "\\left({R(t)}\\right)", selectionStart: 7, selectionEnd: 11,
  });
  assert.deepEqual(domain.prepareFormulaInsertion("\\alpha"), {
    text: "\\alpha", selectionStart: 6, selectionEnd: 6,
  });
});
