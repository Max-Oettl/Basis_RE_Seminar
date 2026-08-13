"use strict";

const crypto = require("crypto");
const path = require("path");
const { pathToFileURL } = require("url");

const SUBSCRIPT = Object.freeze({
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9",
  "₊": "+", "₋": "-", "₌": "=", "₍": "(", "₎": ")", "ᵢ": "i", "ⱼ": "j", "ₙ": "n", "ₛ": "s", "ₜ": "t",
});
const SUPERSCRIPT = Object.freeze({
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
  "⁺": "+", "⁻": "-", "⁼": "=", "⁽": "(", "⁾": ")", "ⁿ": "n", "ⁱ": "i",
});

let mathJaxPromise;

function escapeXml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function stripMathDelimiters(value) {
  const source = String(value || "").trim();
  if ((source.startsWith("$$") && source.endsWith("$$")) || (source.startsWith("\\[") && source.endsWith("\\]"))) return source.slice(2, -2).trim();
  if (source.startsWith("$") && source.endsWith("$")) return source.slice(1, -1).trim();
  return source;
}

function consumeScriptRun(source, start, table) {
  let cursor = start;
  let value = "";
  while (cursor < source.length && Object.prototype.hasOwnProperty.call(table, source[cursor])) {
    value += table[source[cursor]];
    cursor += 1;
  }
  return { value, cursor };
}

function unicodeFormulaToTex(input) {
  const source = stripMathDelimiters(input).replace(/−/g, "-").replace(/·/g, "\\cdot ");
  let output = "";
  for (let index = 0; index < source.length;) {
    if (Object.prototype.hasOwnProperty.call(SUBSCRIPT, source[index])) {
      const run = consumeScriptRun(source, index, SUBSCRIPT);
      output += `_{${run.value}}`;
      index = run.cursor;
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(SUPERSCRIPT, source[index])) {
      const run = consumeScriptRun(source, index, SUPERSCRIPT);
      output += `^{${run.value}}`;
      index = run.cursor;
      continue;
    }
    const character = source[index];
    const replacement = {
      "∏": "\\prod", "∑": "\\sum", "∫": "\\int", "√": "\\sqrt{}", "∞": "\\infty", "≈": "\\approx",
      "≤": "\\leq", "≥": "\\geq", "→": "\\to", "λ": "\\lambda", "μ": "\\mu", "σ": "\\sigma",
      "Ⅰ": "_{\\mathrm{I}}", "Ⅱ": "_{\\mathrm{II}}", "Ⅲ": "_{\\mathrm{III}}", "Ⅳ": "_{\\mathrm{IV}}",
    }[character];
    output += replacement || character;
    index += 1;
  }
  return output.trim() || "x";
}

async function getMathJax() {
  if (!mathJaxPromise) {
    const MathJax = require("mathjax");
    const packageRoot = path.dirname(require.resolve("mathjax"));
    const mathJaxUrl = pathToFileURL(packageRoot).href.replace(/\/$/, "");
    mathJaxPromise = MathJax.init({
      loader: { paths: { mathjax: mathJaxUrl }, load: ["input/tex", "output/svg"] },
      svg: { fontCache: "local" },
    }).then((instance) => {
      if (!instance?.tex2svg || !instance?.startup?.adaptor) throw new Error("MathJax konnte nicht initialisiert werden.");
      return instance;
    });
  }
  return mathJaxPromise;
}

function numeric(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function rootAttribute(source, name) {
  const match = source.match(new RegExp(`<svg\\b[^>]*\\s${name}=["']([^"']+)["']`, "i"));
  return match ? match[1] : "";
}

function replaceRootAttributes(source, attributes) {
  return source.replace(/<svg\b[^>]*>/i, (opening) => {
    let next = opening;
    for (const [name, value] of Object.entries(attributes)) {
      const pattern = new RegExp(`\\s${name}=["'][^"']*["']`, "i");
      next = pattern.test(next) ? next.replace(pattern, ` ${name}="${escapeXml(value)}"`) : next.replace(/>$/, ` ${name}="${escapeXml(value)}">`);
    }
    return next;
  });
}

async function renderFormulaSvg(input, options = {}) {
  const formula = stripMathDelimiters(input) || "x";
  const tex = options.inputIsTex === false ? unicodeFormulaToTex(formula) : unicodeFormulaToTex(formula);
  const fontSize = Math.max(12, Math.min(96, numeric(options.fontSize, 34)));
  const color = /^#[0-9a-f]{6}$/i.test(String(options.color || "")) ? options.color : "#142452";
  const mathJax = await getMathJax();
  const container = mathJax.tex2svg(tex, { display: Boolean(options.display), em: fontSize, ex: fontSize / 2, containerWidth: 100000 });
  const serialized = mathJax.startup.adaptor.serializeXML(container);
  const match = serialized.match(/<svg\b[\s\S]*<\/svg>/i);
  if (!match) throw new Error("MathJax hat kein SVG erzeugt.");
  let svg = match[0];
  const viewBox = rootAttribute(svg, "viewBox");
  const viewValues = viewBox.trim().split(/[\s,]+/).map(Number);
  const naturalWidth = viewValues.length === 4 && Number.isFinite(viewValues[2]) ? Math.max(1, viewValues[2] / 1000 * fontSize) : 480;
  const naturalHeight = viewValues.length === 4 && Number.isFinite(viewValues[3]) ? Math.max(1, viewValues[3] / 1000 * fontSize) : 80;
  const width = Math.max(1, numeric(options.width, naturalWidth));
  const height = Math.max(1, numeric(options.height, naturalHeight));
  const prefix = `MF-${crypto.createHash("sha256").update(`${tex}|${fontSize}`).digest("hex").slice(0, 12)}`;
  svg = svg.replace(/MJX-\d+/g, prefix);
  svg = replaceRootAttributes(svg, {
    width: String(width), height: String(height), preserveAspectRatio: "xMidYMid meet", role: "img", focusable: "false",
    "data-formula-fontsize": String(fontSize), "data-renderer": "mathjax-svg-paths", "data-qc-role": "formula",
    style: `color:${color}`,
  });
  const metadata = escapeXml(JSON.stringify({ formula, tex, fontSize, color, renderer: "mathjax-svg-paths" }));
  svg = svg.replace(/(<svg\b[^>]*>)/i, `$1<title>${escapeXml(formula)}</title><metadata type="application/json">${metadata}</metadata>`);
  if (/<text\b/i.test(svg) || !/<path\b/i.test(svg)) throw new Error("Die Formel wurde nicht als SVG-Pfade gerendert.");
  return { source: svg, formula, tex, fontSize, color, width, height, renderer: "mathjax-svg-paths" };
}

module.exports = { renderFormulaSvg, stripMathDelimiters, unicodeFormulaToTex };
