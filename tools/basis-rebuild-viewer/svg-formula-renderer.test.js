"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { renderFormulaSvg, unicodeFormulaToTex } = require("./svg-formula-renderer");
const serverDomain = require("./svg-editor-server-domain");

test("Unicode-Indizes werden in echte TeX-Strukturen übersetzt", () => {
  assert.equal(
    unicodeFormulaToTex("Rₛ(t) = ∏ᵢ₌₁ⁿ Rᵢ(t)"),
    "R_{s}(t) = \\prod_{i=1}^{n} R_{i}(t)",
  );
  assert.equal(unicodeFormulaToTex("RⅡ = R₁ · R₂₃"), "R_{\\mathrm{II}} = R_{1} \\cdot  R_{23}");
});

test("MathJax erzeugt ein selbständiges Pfad-SVG ohne Textfallback", async () => {
  const formula = await renderFormulaSvg("Rₛ(t) = ∏ᵢ₌₁ⁿ Rᵢ(t)", {
    fontSize: 36,
    color: "#031334",
    width: 620,
    height: 82,
  });
  assert.equal(formula.renderer, "mathjax-svg-paths");
  assert.match(formula.source, /data-renderer="mathjax-svg-paths"/);
  assert.match(formula.source, /<path\b/);
  assert.doesNotMatch(formula.source, /<text\b/);
  assert.match(formula.source, /width="620"/);
  assert.match(formula.source, /height="82"/);
  assert.match(formula.source, /preserveAspectRatio="xMidYMid meet"/);
});

test("häufige Editorstrukturen werden als MathJax-Pfade gerendert", async () => {
  const formulas = [
    "\\alpha+\\beta+\\lambda+\\mu+\\pi+\\sigma+\\omega",
    "\\left\\|x\\right\\|+\\overline{x}+\\vec{x}",
    "\\prod_{i=1}^{n}R_i+\\lim_{t\\to\\infty}R(t)",
    "\\frac{\\partial R}{\\partial t}",
    "\\begin{bmatrix}a & b \\\\ c & d\\end{bmatrix}",
    "\\begin{cases}R_1 & t<0 \\\\ R_2 & t\\geq0\\end{cases}",
  ];
  for (const source of formulas) {
    const formula = await renderFormulaSvg(source, {
      fontSize: 34,
      color: "#142452",
      width: 720,
      height: 120,
    });
    assert.match(formula.source, /<path\b/, source);
    assert.doesNotMatch(formula.source, /<text\b/, source);
  }
});

test("alle migrierten RE4-Formelassets sind sichere Pfad-SVGs", () => {
  const re4Root = path.resolve(__dirname, "..", "..", "rebuild-proposals", "svg", "RE4");
  const formulaFiles = [];
  const visit = (directory) => fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(absolutePath);
    else if (entry.name.endsWith(".svg") && path.basename(directory) === "formulas") formulaFiles.push(absolutePath);
  });
  visit(re4Root);
  assert.equal(formulaFiles.length, 10);
  formulaFiles.forEach((absolutePath) => {
    const source = fs.readFileSync(absolutePath, "utf8");
    serverDomain.validateSvgSource(source);
    assert.match(source, /data-renderer="mathjax-svg-paths"/, absolutePath);
    assert.match(source, /<path\b/, absolutePath);
    assert.doesNotMatch(source, /<text\b|controlled-svg-text-fallback|svg-editor-controlled-fallback/, absolutePath);
  });
});
