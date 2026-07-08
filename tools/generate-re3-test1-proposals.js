/*
 * STATUS: rejected prototype.
 *
 * Do not use this script as the production rebuild workflow. The generated
 * RE3_TEST_1 SVGs were rejected because they copied PowerPoint states too
 * literally, used library components too blindly, and missed visual QA issues.
 *
 * Next rebuilds must start with:
 * - workflow/svg-rebuild-production-runbook.md
 * - analysis/rebuild-plans/<module_id>_svg_rebuild_plan.json
 * - a documented target-state and render cross-check
 */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const repoRoot = path.resolve(__dirname, "..");
const moduleId = "RE3_TEST_1";
const seminarId = "reliability_engineer_basis";
const sourceRoot = "source-materials/basis-seminar";
const pptxPath = `${sourceRoot}/pptx/Modul_3_RE3_Test_1.pptx`;
const pdfPath = `${sourceRoot}/pdf/Modul_3_RE3_Test_1.pdf`;
const pngDir = `${sourceRoot}/png/Modul_3_RE3_Test_1_PNG`;
const narrationPath = `${sourceRoot}/narration/RE3_TEST_1/Modul_3_Test_1.md`;
const pptxUnpackedPath = "analysis/pptx-unpacked/Modul_3_RE3_Test_1_raw";
const svgDir = path.join(repoRoot, "rebuild-proposals", "svg", moduleId);
const analysisDir = path.join(repoRoot, "analysis", "slides");
const animationDir = path.join(repoRoot, "analysis", "animations");
const reportsDir = path.join(repoRoot, "analysis", "reports");
const assetDir = path.join(repoRoot, "assets", "scenes", moduleId, "pictograms");
const assetHrefRoot = "../../../assets/scenes/RE3_TEST_1/pictograms";

const colors = {
  navy: "#062d46",
  ink: "#061923",
  blue: "#139ccb",
  cyan: "#009edb",
  pale: "#e7f6fb",
  pale2: "#f6fafc",
  grid: "#cfe1e9",
  gridStrong: "#97b7c7",
  red: "#d82735",
  green: "#6aa84f",
  muted: "#597381",
  soft: "#d7e6ed",
  darkBlue: "#073a5b",
};

const assetFiles = {
  tool: "tool-transform-arrow.png",
  graph: "method-graph.png",
  calc: "method-calculation.png",
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function pad(number) {
  return String(number).padStart(3, "0");
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function css() {
  return `<style>
    .bg { fill: #ffffff; }
    .surface { fill: ${colors.pale2}; }
    .panel { fill: #ffffff; stroke: ${colors.soft}; stroke-width: 2.5; }
    .panel-blue { fill: ${colors.pale}; stroke: #9ed9ea; stroke-width: 2.8; }
    .panel-muted { fill: #f8fbfc; stroke: ${colors.soft}; stroke-width: 2.2; }
    .axis { stroke: ${colors.navy}; stroke-width: 6; stroke-linecap: round; fill: none; }
    .axis-thin { stroke: ${colors.navy}; stroke-width: 4.2; stroke-linecap: round; fill: none; }
    .axis-head { fill: ${colors.navy}; }
    .tick { stroke: ${colors.navy}; stroke-width: 4; stroke-linecap: round; }
    .grid { stroke: ${colors.grid}; stroke-width: 1.5; }
    .grid-strong { stroke: ${colors.gridStrong}; stroke-width: 2.2; }
    .guide { stroke: ${colors.gridStrong}; stroke-width: 2; stroke-dasharray: 9 9; fill: none; }
    .guide-red { stroke: ${colors.red}; stroke-width: 2; stroke-dasharray: 7 7; fill: none; opacity: .72; }
    .line-red { stroke: ${colors.red}; stroke-width: 5; stroke-linecap: round; fill: none; }
    .line-blue { stroke: ${colors.cyan}; stroke-width: 5; stroke-linecap: round; fill: none; }
    .line-green { stroke: ${colors.green}; stroke-width: 5; stroke-linecap: round; fill: none; }
    .failure-red { stroke: ${colors.red}; stroke-width: 7; stroke-linecap: round; }
    .failure-blue { stroke: ${colors.cyan}; stroke-width: 7; stroke-linecap: round; }
    .marker-red { fill: #ffffff; stroke: ${colors.red}; stroke-width: 5; }
    .marker-blue { fill: #ffffff; stroke: ${colors.cyan}; stroke-width: 5; }
    .label { fill: ${colors.navy}; font-family: Inter, "Segoe UI", Arial, sans-serif; font-size: 29px; font-weight: 760; letter-spacing: 0; }
    .label-mid { fill: ${colors.navy}; font-family: Inter, "Segoe UI", Arial, sans-serif; font-size: 24px; font-weight: 720; letter-spacing: 0; }
    .label-small { fill: ${colors.navy}; font-family: Inter, "Segoe UI", Arial, sans-serif; font-size: 20px; font-weight: 640; letter-spacing: 0; }
    .label-tiny { fill: ${colors.muted}; font-family: Inter, "Segoe UI", Arial, sans-serif; font-size: 17px; font-weight: 600; letter-spacing: 0; }
    .axis-label { fill: ${colors.navy}; font-family: Inter, "Segoe UI", Arial, sans-serif; font-size: 21px; font-weight: 720; letter-spacing: 0; }
    .formula { fill: ${colors.ink}; font-family: Georgia, "Times New Roman", serif; font-size: 41px; font-style: italic; }
    .formula-small { fill: ${colors.ink}; font-family: Georgia, "Times New Roman", serif; font-size: 29px; font-style: italic; }
    .red-text { fill: ${colors.red}; font-family: Inter, "Segoe UI", Arial, sans-serif; font-size: 23px; font-weight: 760; font-style: italic; }
    .blue-text { fill: ${colors.cyan}; font-family: Inter, "Segoe UI", Arial, sans-serif; font-size: 23px; font-weight: 760; font-style: italic; }
    .tag { fill: #ffffff; font-family: Inter, "Segoe UI", Arial, sans-serif; font-size: 18px; font-weight: 800; text-anchor: middle; dominant-baseline: central; }
    .hidden { display: none; }
  </style>`;
}

function svgDoc(id, desc, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" role="img" aria-labelledby="title desc" data-module="${moduleId}" data-sequence="${id}">
  <title id="title">RE3 Test 1 SVG proposal</title>
  <desc id="desc">${esc(desc)}</desc>
  <defs>
    ${css()}
    <filter id="soft_shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="${colors.navy}" flood-opacity="0.13"/>
    </filter>
    <clipPath id="clip_weibull_mini"><rect x="0" y="0" width="1" height="1"/></clipPath>
  </defs>
  <rect class="bg" width="1920" height="1080"/>
${body}
</svg>
`;
}

function layer(id, visible, body, attrs = "") {
  return `  <g id="${id}" data-anim-layer="true"${visible ? "" : ' class="hidden"'}${attrs ? ` ${attrs}` : ""}>\n${body}\n  </g>`;
}

function card(x, y, w, h, cls = "panel", rx = 18, shadow = false) {
  return `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${shadow ? ' filter="url(#soft_shadow)"' : ""}/>`;
}

function arrowHeadRight(x, y, size = 28, fill = colors.navy) {
  return `<polygon class="axis-head" points="${x},${y - size * 0.45} ${x + size},${y} ${x},${y + size * 0.45}" fill="${fill}"/>`;
}

function arrowHeadUp(x, y, size = 28, fill = colors.navy) {
  return `<polygon class="axis-head" points="${x - size * 0.45},${y + size} ${x},${y} ${x + size * 0.45},${y + size}" fill="${fill}"/>`;
}

function failureCross(id, x, y, color = "red", size = 15) {
  const cls = color === "blue" ? "failure-blue" : "failure-red";
  return `<g id="${id}" transform="translate(${round(x)} ${round(y)})">
    <line class="${cls}" x1="${-size}" y1="${-size}" x2="${size}" y2="${size}"/>
    <line class="${cls}" x1="${-size}" y1="${size}" x2="${size}" y2="${-size}"/>
  </g>`;
}

function tLabel(index, x, y, color = "red") {
  const cls = color === "blue" ? "blue-text" : "red-text";
  return `<text class="${cls}" x="${round(x)}" y="${round(y)}">t<tspan baseline-shift="sub" font-size="15">${index}</tspan></text>`;
}

function timeline({
  id,
  x,
  y,
  w = 560,
  events = [],
  ticks = true,
  label = "t",
  axisClass = "axis",
  component = "timeline-failures",
}) {
  const start = 0;
  const shaftEnd = w;
  const tip = w + 38;
  const tickMarkup = ticks
    ? events.map((event) => `<line class="tick" x1="${round(event.x)}" y1="-28" x2="${round(event.x)}" y2="28"/>`).join("\n")
    : "";
  const eventMarkup = events.map((event, index) => {
    const color = event.color || "red";
    const indexText = event.label || index + 1;
    return `${failureCross(`${id}_failure_${index + 1}`, event.x, 0, color, event.size || 13)}
      ${tLabel(indexText, event.x - 15, 58, color)}`;
  }).join("\n");
  return `<g id="${id}" transform="translate(${x} ${y})" data-component-origin="components/svg-library/${component}.svg">
    <line class="${axisClass}" x1="${start}" y1="0" x2="${shaftEnd}" y2="0"/>
    ${arrowHeadRight(shaftEnd, 0, 38)}
    ${tickMarkup}
    ${eventMarkup}
    <text class="axis-label" x="${tip + 8}" y="9"><tspan font-style="italic">${label}</tspan></text>
  </g>`;
}

function transformIcon(x, y, size = 140, id = "tool_transform_asset") {
  return `<image id="${id}" href="${assetHrefRoot}/${assetFiles.tool}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`;
}

function methodIcon(kind, x, y, size = 74) {
  const file = kind === "graph" ? assetFiles.graph : assetFiles.calc;
  return `<image href="${assetHrefRoot}/${file}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`;
}

function stepRail(active, max = 3) {
  const steps = [
    ["0", ["Sammeln der", "Ausfalldaten"]],
    ["1", ["Berechnen von", "Ausfallwahrscheinlichkeiten"]],
    ["2", ["Ermittlung der", "Regressionsgeraden"]],
    ["3", ["Schätzung der", "Weibull-Parameter"]],
  ].slice(0, max + 1);
  let y = 0;
  const blocks = steps.map(([number, lines], index) => {
    const done = index < active;
    const activeStep = index === active;
    const h = 104;
    const fill = activeStep ? "panel-blue" : "panel-muted";
    const circleFill = activeStep ? colors.blue : done ? "#ffffff" : "#ffffff";
    const circleStroke = done || activeStep ? colors.blue : colors.soft;
    const numFill = activeStep ? "#ffffff" : colors.blue;
    const text = lines.map((line, lineIndex) => `<text class="label-small" x="88" y="${42 + lineIndex * 29}">${line}</text>`).join("\n");
    const block = `<g id="step_${index}" transform="translate(0 ${y})">
      <rect class="${fill}" x="0" y="0" width="430" height="${h}" rx="16"${activeStep ? ' filter="url(#soft_shadow)"' : ""}/>
      <circle cx="42" cy="52" r="25" fill="${circleFill}" stroke="${circleStroke}" stroke-width="4"/>
      <text x="42" y="53" fill="${numFill}" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="24" font-weight="850" text-anchor="middle" dominant-baseline="central">${number}</text>
      ${text}
    </g>`;
    y += h + 16;
    return block;
  }).join("\n");
  return `<g id="process_steps" transform="translate(88 150)" data-component-origin="custom-process-step-library">
    ${blocks}
  </g>`;
}

function medianRankFormula(x, y) {
  return `<g id="median_rank_formula" transform="translate(${x} ${y})">
    ${card(0, 0, 510, 232, "panel", 18, true)}
    <text class="label-mid" x="28" y="42">Median-Rank-Verfahren</text>
    <text class="formula" x="38" y="114">F(t<tspan baseline-shift="sub" font-size="22">i</tspan>) =</text>
    <text class="formula-small" x="178" y="90">i - 0,3</text>
    <line class="axis-thin" x1="170" y1="103" x2="302" y2="103"/>
    <text class="formula-small" x="178" y="140">n + 0,4</text>
    <text class="formula-small" x="324" y="116">, i = 1,...,n</text>
    <text class="label-tiny" x="38" y="184">i: Rangnummer des Ausfalls</text>
    <text class="label-tiny" x="38" y="212">n: Stichprobengröße</text>
  </g>`;
}

function cumulativePlot({ id, x, y, guides = false, points = false }) {
  const w = 760;
  const h = 458;
  const x0 = 92;
  const y0 = 386;
  const yTop = 74;
  const xEnd = 690;
  const times = [150, 236, 322, 408, 494, 568];
  const ys = [334, 284, 238, 194, 150, 106];
  const timelineMarks = times.map((tx, i) => `${failureCross(`${id}_axis_failure_${i + 1}`, tx, y0, "red", 10)} ${tLabel(i + 1, tx - 13, y0 + 34)}`).join("\n");
  const guideMarkup = guides
    ? times.map((tx, i) => `<path class="guide-red" d="M ${x0} ${ys[i]} H ${tx} V ${y0}"/>
      <text class="red-text" x="${x0 - 72}" y="${ys[i] + 7}">F(t<tspan baseline-shift="sub" font-size="14">${i + 1}</tspan>)</text>`).join("\n")
    : "";
  const pointMarkup = points ? times.map((tx, i) => failureCross(`${id}_point_${i + 1}`, tx, ys[i], "red", 10)).join("\n") : "";
  return `<g id="${id}" transform="translate(${x} ${y})" data-component-origin="components/svg-library/axis-diagram.svg">
    ${card(0, 0, w, h, "panel", 16)}
    <line class="axis-thin" x1="${x0}" y1="${y0}" x2="${x0}" y2="${yTop}"/>
    ${arrowHeadUp(x0, yTop - 30, 32)}
    <line class="axis-thin" x1="${x0}" y1="${y0}" x2="${xEnd}" y2="${y0}"/>
    ${arrowHeadRight(xEnd, y0, 32)}
    <text class="axis-label" x="24" y="242" transform="rotate(-90 24 242)">Summe der ausgefallenen Teile</text>
    <text class="axis-label" x="516" y="444">Lebensdauer <tspan font-style="italic">t</tspan></text>
    ${timelineMarks}
    ${guideMarkup}
    ${pointMarkup}
  </g>`;
}

function regressionPlot({ id, x, y, parameters = false }) {
  const pts = [
    [162, 337],
    [250, 292],
    [336, 258],
    [424, 216],
    [512, 172],
    [600, 126],
  ];
  const pointMarkup = pts.map((p, i) => `<circle id="${id}_point_${i + 1}" class="marker-red" cx="${p[0]}" cy="${p[1]}" r="8"/>`).join("\n");
  const parameterMarkup = parameters ? `<g id="${id}_parameter_layer" data-anim-layer="true">
      <path class="guide" d="M 92 196 H 552 V 386"/>
      <text class="formula-small" x="112" y="178">F = 63,2 %</text>
      <text class="formula-small" x="540" y="432">T</text>
      <path class="guide" d="M 338 258 H 440 V 214"/>
      <text class="formula-small" x="462" y="250">b</text>
    </g>` : "";
  return `<g id="${id}" transform="translate(${x} ${y})" data-component-origin="components/svg-library/axis-diagram.svg">
    ${card(0, 0, 760, 458, "panel", 16)}
    <line class="axis-thin" x1="92" y1="386" x2="92" y2="74"/>
    ${arrowHeadUp(92, 44, 32)}
    <line class="axis-thin" x1="92" y1="386" x2="690" y2="386"/>
    ${arrowHeadRight(690, 386, 32)}
    <text class="axis-label" x="24" y="242" transform="rotate(-90 24 242)">Ausfallwahrscheinlichkeit</text>
    <text class="axis-label" x="516" y="428">Lebensdauer <tspan font-style="italic">t</tspan></text>
    <line class="line-blue" x1="112" y1="362" x2="650" y2="98"/>
    ${pointMarkup}
    ${parameterMarkup}
  </g>`;
}

function weibullMini({ id, x, y, w = 620, h = 430, lines = ["red"], points = false, confidence = false, axisLabels = true }) {
  const margin = { l: 92, r: 34, t: 42, b: 72 };
  const x0 = margin.l;
  const y0 = h - margin.b;
  const x1 = w - margin.r;
  const y1 = margin.t;
  const log10 = (value) => Math.log10(value);
  const z = (f) => Math.log(-Math.log(1 - f));
  const zMin = z(0.01);
  const zMax = z(0.99);
  const xOf = (t) => x0 + ((log10(t) - log10(1)) / (log10(1000) - log10(1))) * (x1 - x0);
  const yOf = (f) => y0 - ((z(f) - zMin) / (zMax - zMin)) * (y0 - y1);
  const majorT = [1, 10, 100, 1000];
  const minorT = [];
  for (let decade = 1; decade <= 100; decade *= 10) {
    for (let m = 2; m <= 9; m += 1) minorT.push(decade * m);
  }
  const majorF = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 0.8, 0.9, 0.95, 0.99];
  const minorF = [0.03, 0.04, 0.06, 0.07, 0.08, 0.3, 0.4, 0.6, 0.7, 0.85, 0.92, 0.98];
  const minorGrid = [
    ...minorT.map((t) => `<line class="grid" x1="${round(xOf(t))}" y1="${y1}" x2="${round(xOf(t))}" y2="${y0}"/>`),
    ...minorF.map((f) => `<line class="grid" x1="${x0}" y1="${round(yOf(f))}" x2="${x1}" y2="${round(yOf(f))}"/>`),
  ].join("\n");
  const majorGrid = [
    ...majorT.map((t) => `<line class="grid-strong" x1="${round(xOf(t))}" y1="${y1}" x2="${round(xOf(t))}" y2="${y0}"/>`),
    ...majorF.map((f) => `<line class="grid-strong" x1="${x0}" y1="${round(yOf(f))}" x2="${x1}" y2="${round(yOf(f))}"/>`),
  ].join("\n");
  const yLabels = majorF.map((f) => `<text class="label-tiny" x="${x0 - 24}" y="${round(yOf(f) + 6)}" text-anchor="end">${Math.round(f * 100)}</text>`).join("\n");
  const xLabels = majorT.map((t) => `<text class="label-tiny" x="${round(xOf(t))}" y="${y0 + 42}" text-anchor="middle">${t}</text>`).join("\n");
  const redLine = `<line class="line-red" x1="${round(xOf(2.2))}" y1="${round(yOf(0.05))}" x2="${round(xOf(800))}" y2="${round(yOf(0.95))}"/>`;
  const blueLine = `<line class="line-blue" x1="${round(xOf(3.5))}" y1="${round(yOf(0.04))}" x2="${round(xOf(510))}" y2="${round(yOf(0.99))}"/>`;
  const samplePoints = [
    [3, 0.07],
    [7, 0.14],
    [18, 0.25],
    [45, 0.43],
    [110, 0.61],
    [260, 0.78],
    [620, 0.91],
  ];
  const pointMarkup = points
    ? samplePoints.map(([t, f], i) => `<circle id="${id}_point_${i + 1}" class="marker-red" cx="${round(xOf(t))}" cy="${round(yOf(f))}" r="8"/>`).join("\n")
    : "";
  const confidenceMarkup = confidence
    ? `<path class="guide" d="M ${round(xOf(2.4))} ${round(yOf(0.075))} C ${round(xOf(14))} ${round(yOf(0.24))}, ${round(xOf(120))} ${round(yOf(0.72))}, ${round(xOf(770))} ${round(yOf(0.985))}"/>
      <path class="guide" d="M ${round(xOf(2.4))} ${round(yOf(0.03))} C ${round(xOf(14))} ${round(yOf(0.09))}, ${round(xOf(120))} ${round(yOf(0.36))}, ${round(xOf(770))} ${round(yOf(0.84))}"/>
      <g id="${id}_upper_confidence_label" transform="translate(${round(xOf(245))} ${round(yOf(0.965) - 24)})">
        <rect x="-14" y="-24" width="292" height="42" rx="10" fill="#ffffff" opacity="0.9"/>
        <line class="guide" x1="0" y1="-2" x2="48" y2="-2"/>
        <text class="axis-label" x="62" y="6">95%-Vertrauensgrenze</text>
      </g>
      <g id="${id}_lower_confidence_label" transform="translate(${round(xOf(120))} ${round(yOf(0.22) + 42)})">
        <rect x="-14" y="-24" width="276" height="42" rx="10" fill="#ffffff" opacity="0.9"/>
        <line class="guide" x1="0" y1="-2" x2="48" y2="-2"/>
        <text class="axis-label" x="62" y="6">5%-Vertrauensgrenze</text>
      </g>`
    : "";
  const lineMarkup = [
    lines.includes("red") ? redLine : "",
    lines.includes("blue") ? blueLine : "",
  ].join("\n");
  const axisLabelMarkup = axisLabels ? `<text class="axis-label" x="${(x0 + x1) / 2}" y="${h - 14}" text-anchor="middle">Lebensdauer <tspan font-style="italic">t</tspan></text>
    <text class="axis-label" x="24" y="${(y0 + y1) / 2}" transform="rotate(-90 24 ${(y0 + y1) / 2})">Ausfallwahrscheinlichkeit F(t) [%]</text>` : "";
  return `<g id="${id}" transform="translate(${x} ${y})" data-component-origin="components/svg-library/weibull-diagram.svg" data-x-scale="log10(t)" data-y-scale="ln(-ln(1-F))">
    ${card(0, 0, w, h, "panel", 16)}
    <rect class="surface" x="${x0}" y="${y1}" width="${x1 - x0}" height="${y0 - y1}" rx="0"/>
    ${minorGrid}
    ${majorGrid}
    <line class="axis-thin" x1="${x0}" y1="${y0}" x2="${x1 + 30}" y2="${y0}"/>
    ${arrowHeadRight(x1 + 30, y0, 32)}
    <line class="axis-thin" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1 - 26}"/>
    ${arrowHeadUp(x0, y1 - 56, 32)}
    ${xLabels}
    ${yLabels}
    ${lineMarkup}
    ${confidenceMarkup}
    ${pointMarkup}
    ${axisLabelMarkup}
  </g>`;
}

function rightArrow(id, x, y, color = colors.navy) {
  return `<g id="${id}" transform="translate(${x} ${y})">
    <path d="M0 27 H58 V4 L126 58 L58 112 V89 H0 Z" fill="${color}"/>
  </g>`;
}

function introSlide(step, master = false) {
  let active = 0;
  if (step >= 2 && step <= 4) active = 1;
  if (step === 5) active = 2;
  if (step >= 6) active = 3;

  const events = [1, 2, 3, 4, 5, 6].map((i, idx) => ({ x: 78 + idx * 89, label: i }));
  const base = [
    stepRail(active, step <= 4 ? 1 : 3),
    timeline({ id: "intro_sorted_failures", x: 640, y: 206, w: 560, events, component: "timeline-failures" }),
  ];
  if (step === 1) {
    base.push(`<g id="intro_hint" transform="translate(650 330)">
      ${card(0, 0, 720, 155, "panel-blue", 18)}
      <text class="label" x="36" y="58">Ausfallzeiten werden zuerst sortiert.</text>
      <text class="label-mid" x="36" y="106">Die Reihenfolge entlang der Zeitachse ist die Basis für alle weiteren Schritte.</text>
    </g>`);
  } else if (step >= 2 && step <= 4) {
    base.push(medianRankFormula(620, 330));
    base.push(cumulativePlot({ id: "intro_cumulative_plot", x: 1160, y: 302, guides: master || step >= 3, points: master || step >= 4 }));
  } else {
    base.push(regressionPlot({ id: "intro_regression_plot", x: 700, y: 302, parameters: master || step >= 6 }));
    if (step >= 6 || master) {
      base.push(`<g id="intro_parameter_card" transform="translate(1490 392)">
        ${card(0, 0, 300, 210, "panel-blue", 18, true)}
        <text class="label-mid" x="28" y="50">Parameter</text>
        <text class="formula-small" x="30" y="108">b = Steigung</text>
        <text class="formula-small" x="30" y="164">T = F<tspan baseline-shift="super" font-size="18">-1</tspan>(0,632)</text>
      </g>`);
    }
  }
  return svgDoc("intro_build", `Aufbaufolge Folien 1 bis 6, Preview-Step ${step}.`, base.join("\n"));
}

function distributionSlide(showFormula, master = false) {
  const events = [1, 2, 3, 4, 5, 6].map((i, idx) => ({ x: 70 + idx * 82, label: i }));
  const formula = `<g id="distribution_formula_card" transform="translate(1115 410)">
    ${card(0, 0, 610, 290, "panel", 20, true)}
    <text class="formula-small" x="38" y="58">T → 8</text>
    <text class="formula-small" x="38" y="106">b → 3</text>
    <text class="formula" x="212" y="116">F(t) = 1 - e<tspan baseline-shift="super" font-size="26">-(t/8)³</tspan></text>
    <text class="formula" x="212" y="206">F(10) ≈ 85,8 %</text>
  </g>`;
  const body = [
    timeline({ id: "distribution_timeline", x: 260, y: 178, w: 540, events }),
    transformIcon(526, 296, 142),
    weibullMini({ id: "distribution_weibull", x: 238, y: 502, w: 690, h: 420, lines: ["red"], points: false }),
    layer("layer_distribution_formula", master || showFormula, formula, 'data-visible-from="slide_007"'),
  ].join("\n");
  return svgDoc("distribution_formula", `Weibull-Transformation mit Formelblock sichtbar: ${showFormula}.`, body);
}

function mechanismsSlide() {
  const mixed = [
    { x: 70, label: 1, color: "red" },
    { x: 158, label: 2, color: "blue" },
    { x: 246, label: 3, color: "red" },
    { x: 334, label: 4, color: "blue" },
    { x: 422, label: 5, color: "blue" },
    { x: 510, label: 6, color: "red" },
  ];
  const a = [
    { x: 90, label: 1, color: "red" },
    { x: 210, label: 3, color: "red" },
    { x: 315, label: 6, color: "red" },
  ];
  const b = [
    { x: 105, label: 2, color: "blue" },
    { x: 235, label: 4, color: "blue" },
    { x: 315, label: 5, color: "blue" },
  ];
  const body = `<text class="red-text" x="190" y="178" font-style="normal">Ausfallmechanismus A</text>
  <text class="blue-text" x="520" y="178" font-style="normal">Ausfallmechanismus B</text>
  ${timeline({ id: "mechanism_mixed_timeline", x: 210, y: 260, w: 550, events: mixed })}
  ${transformIcon(440, 388, 132)}
  ${weibullMini({ id: "mechanism_weibull", x: 188, y: 560, w: 640, h: 380, lines: ["red", "blue"], points: false })}
  ${rightArrow("mechanism_split_arrow", 900, 242)}
  <g id="mechanism_split_timelines" transform="translate(1110 158)">
    <text class="red-text" x="0" y="0" font-style="normal">Ausfallmechanismus A</text>
    ${timeline({ id: "mechanism_a_timeline", x: 95, y: 88, w: 360, events: a, axisClass: "axis-thin" })}
    <text class="blue-text" x="0" y="232" font-style="normal">Ausfallmechanismus B</text>
    ${timeline({ id: "mechanism_b_timeline", x: 95, y: 320, w: 360, events: b, axisClass: "axis-thin" })}
  </g>`;
  return svgDoc("mechanisms_split", "Ausfallmechanismen A und B werden als getrennte Datenreihen dargestellt.", body);
}

function objectChart(showCensored) {
  const rows = [1, 2, 3, 4, 5, 6].map((num, idx) => {
    const y = 340 - idx * 48;
    return `<line class="axis-thin" x1="96" y1="${y}" x2="560" y2="${y}"/>
      <text class="axis-label" x="54" y="${y + 7}" text-anchor="middle">${num}</text>`;
  }).join("\n");
  const failures = (showCensored
    ? [[300, 340], [250, 292], [456, 100], [398, 244]]
    : [[300, 340], [250, 292], [398, 244], [478, 196], [340, 148], [456, 100]]
  ).map(([fx, fy], i) => failureCross(`object_failure_${i + 1}`, fx, fy, "red", 12)).join("\n");
  const censored = showCensored ? `<g id="object_censored_layer" data-anim-layer="true">
    <g transform="translate(478 196)">
      <line class="line-blue" x1="0" y1="0" x2="70" y2="0"/>
      <polygon points="70,-11 98,0 70,11" fill="${colors.cyan}"/>
      <line stroke="${colors.cyan}" stroke-width="6" x1="0" y1="-24" x2="0" y2="24"/>
    </g>
    <g transform="translate(340 148)">
      <line class="line-blue" x1="0" y1="0" x2="86" y2="0"/>
      <polygon points="86,-11 114,0 86,11" fill="${colors.cyan}"/>
      <line stroke="${colors.cyan}" stroke-width="6" x1="0" y1="-24" x2="0" y2="24"/>
    </g>
  </g>` : "";
  return `<g id="object_time_chart" transform="translate(1076 220)" data-component-origin="components/svg-library/axis-diagram.svg">
    ${card(0, 0, 700, 490, "panel", 18)}
    <line class="axis-thin" x1="96" y1="390" x2="96" y2="62"/>
    <line class="axis-thin" x1="96" y1="390" x2="600" y2="390"/>
    ${arrowHeadRight(600, 390, 32)}
    <text class="axis-label" x="22" y="230" transform="rotate(-90 22 230)">Objekt Nr.</text>
    <text class="axis-label" x="632" y="398"><tspan font-style="italic">t</tspan></text>
    ${rows}
    ${failures}
    ${censored}
  </g>`;
}

function censoredSlide(showCensored, master = false) {
  const events = showCensored
    ? [
        { x: 70, label: 1, color: "red" },
        { x: 158, label: 2, color: "red" },
        { x: 246, label: 3, color: "red" },
        { x: 334, label: 4, color: "red" },
      ]
    : [1, 2, 3, 4, 5, 6].map((i, idx) => ({ x: 70 + idx * 82, label: i }));
  const censorTimelineLayer = showCensored || master ? `<g id="timeline_censor_marker" data-anim-layer="true">
      <g transform="translate(455 0)">
        <line stroke="${colors.cyan}" stroke-width="7" x1="0" y1="-28" x2="0" y2="28"/>
        <line class="line-blue" x1="0" y1="0" x2="54" y2="0"/>
        <polygon points="54,-11 80,0 54,11" fill="${colors.cyan}"/>
      </g>
    </g>` : "";
  const body = `<g id="censored_timeline_group" transform="translate(210 214)">
    ${timeline({ id: "censored_timeline", x: 0, y: 0, w: 560, events })}
    ${censorTimelineLayer}
  </g>
  ${transformIcon(440, 350, 132)}
  ${weibullMini({ id: "censored_weibull", x: 188, y: 548, w: 640, h: 380, lines: ["red"], points: false })}
  ${rightArrow("censored_object_arrow", 900, 246)}
  ${objectChart(master || showCensored)}`;
  return svgDoc("censored_build", `Objekt-Zeit-Diagramm mit Zensur-Layer sichtbar: ${showCensored}.`, body);
}

function methodsSlide() {
  const events = [1, 2, 3, 4, 5, 6].map((i, idx) => ({ x: 70 + idx * 82, label: i }));
  const body = `${timeline({ id: "methods_timeline", x: 210, y: 206, w: 560, events })}
  ${transformIcon(440, 338, 132)}
  ${weibullMini({ id: "methods_weibull", x: 188, y: 548, w: 640, h: 380, lines: ["red"], points: false })}
  ${rightArrow("methods_tree_arrow", 895, 510)}
  <g id="methods_tree" transform="translate(1100 340)">
    ${card(0, 0, 610, 390, "panel", 20, true)}
    <g id="graphic_method">
      ${methodIcon("graph", 42, 42, 78)}
      <text class="label" x="140" y="88">Grafische Methode</text>
    </g>
    <g id="calculation_methods" transform="translate(0 130)">
      ${methodIcon("calc", 42, 42, 78)}
      <text class="label" x="140" y="88">Berechnungs-Methoden</text>
      <line class="line-blue" x1="300" y1="126" x2="235" y2="224"/>
      <polygon points="222,213 216,246 244,229" fill="${colors.cyan}"/>
      <line class="line-blue" x1="380" y1="126" x2="462" y2="224"/>
      <polygon points="444,228 476,246 468,212" fill="${colors.cyan}"/>
      <text class="label-mid" x="204" y="300">MLS</text>
      <text class="label-mid" x="448" y="300">MLE</text>
    </g>
  </g>`;
  return svgDoc("methods_overview", "Grafische Methode und Berechnungsmethoden werden eingeordnet.", body);
}

function confidenceSlide() {
  const events = [1, 2, 3, 4, 5, 6].map((i, idx) => ({ x: 70 + idx * 82, label: i }));
  const body = `${timeline({ id: "confidence_timeline", x: 220, y: 178, w: 560, events })}
  ${transformIcon(464, 312, 132)}
  ${weibullMini({ id: "confidence_weibull", x: 360, y: 488, w: 1040, h: 472, lines: ["red"], points: true, confidence: true })}`;
  return svgDoc("confidence_bounds", "Weibull-Diagramm mit 95-Prozent- und 5-Prozent-Vertrauensgrenzen.", body);
}

function slideSvg(slideNumber) {
  if (slideNumber <= 6) return introSlide(slideNumber);
  if (slideNumber === 7) return distributionSlide(true);
  if (slideNumber === 8) return distributionSlide(false);
  if (slideNumber === 9) return mechanismsSlide();
  if (slideNumber === 10) return censoredSlide(false);
  if (slideNumber === 11) return censoredSlide(true);
  if (slideNumber === 12) return methodsSlide();
  if (slideNumber === 13) return confidenceSlide();
  throw new Error(`Unknown slide ${slideNumber}`);
}

function crc32(buffer) {
  let crc = -1;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ -1) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function setPixel(image, width, height, x, y, rgba) {
  const px = Math.floor(x);
  const py = Math.floor(y);
  if (px < 0 || py < 0 || px >= width || py >= height) return;
  const offset = (py * width + px) * 4;
  image[offset] = rgba[0];
  image[offset + 1] = rgba[1];
  image[offset + 2] = rgba[2];
  image[offset + 3] = rgba[3];
}

function pointInPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const xi = points[i][0];
    const yi = points[i][1];
    const xj = points[j][0];
    const yj = points[j][1];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function fillPolygon(image, width, height, points, rgba) {
  const minX = Math.max(0, Math.floor(Math.min(...points.map((p) => p[0]))));
  const maxX = Math.min(width - 1, Math.ceil(Math.max(...points.map((p) => p[0]))));
  const minY = Math.max(0, Math.floor(Math.min(...points.map((p) => p[1]))));
  const maxY = Math.min(height - 1, Math.ceil(Math.max(...points.map((p) => p[1]))));
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      if (pointInPolygon(x + 0.5, y + 0.5, points)) setPixel(image, width, height, x, y, rgba);
    }
  }
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
  const x = ax + t * dx;
  const y = ay + t * dy;
  return Math.hypot(px - x, py - y);
}

function drawLine(image, width, height, ax, ay, bx, by, radius, rgba) {
  const minX = Math.max(0, Math.floor(Math.min(ax, bx) - radius));
  const maxX = Math.min(width - 1, Math.ceil(Math.max(ax, bx) + radius));
  const minY = Math.max(0, Math.floor(Math.min(ay, by) - radius));
  const maxY = Math.min(height - 1, Math.ceil(Math.max(ay, by) + radius));
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      if (distanceToSegment(x + 0.5, y + 0.5, ax, ay, bx, by) <= radius) {
        setPixel(image, width, height, x, y, rgba);
      }
    }
  }
}

function drawCircle(image, width, height, cx, cy, radius, rgba) {
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
      if (Math.hypot(x + 0.5 - cx, y + 0.5 - cy) <= radius) setPixel(image, width, height, x, y, rgba);
    }
  }
}

function writePng(filePath, width, height, image) {
  const scanlines = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    scanlines[y * (width * 4 + 1)] = 0;
    image.copy(scanlines, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(scanlines)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
  fs.writeFileSync(filePath, png);
}

function createIcon(fileName, draw) {
  ensureDir(assetDir);
  const size = 512;
  const image = Buffer.alloc(size * size * 4, 0);
  draw(image, size, size);
  writePng(path.join(assetDir, fileName), size, size, image);
}

function createAssets() {
  const navy = [6, 45, 70, 255];
  const blue = [19, 156, 203, 255];
  const pale = [196, 235, 248, 255];
  const red = [216, 39, 53, 255];
  const white = [255, 255, 255, 255];

  createIcon(assetFiles.tool, (image, width, height) => {
    fillPolygon(image, width, height, [[112, 44], [400, 44], [400, 222], [490, 222], [256, 476], [22, 222], [112, 222]], pale);
    const outline = [[112, 44], [400, 44], [400, 222], [490, 222], [256, 476], [22, 222], [112, 222]];
    for (let i = 0; i < outline.length; i += 1) {
      const a = outline[i];
      const b = outline[(i + 1) % outline.length];
      drawLine(image, width, height, a[0], a[1], b[0], b[1], 7, navy);
    }
    drawLine(image, width, height, 168, 146, 342, 320, 15, navy);
    drawLine(image, width, height, 342, 146, 168, 320, 15, navy);
    drawCircle(image, width, height, 150, 128, 22, navy);
    drawCircle(image, width, height, 150, 128, 10, pale);
    drawCircle(image, width, height, 364, 128, 22, navy);
    drawCircle(image, width, height, 364, 128, 10, pale);
    drawLine(image, width, height, 202, 112, 398, 308, 8, blue);
    drawLine(image, width, height, 114, 308, 310, 112, 8, blue);
  });

  createIcon(assetFiles.graph, (image, width, height) => {
    drawLine(image, width, height, 104, 404, 104, 96, 12, navy);
    drawLine(image, width, height, 104, 404, 410, 404, 12, navy);
    fillPolygon(image, width, height, [[410, 404], [366, 380], [366, 428]], navy);
    fillPolygon(image, width, height, [[104, 96], [80, 140], [128, 140]], navy);
    drawLine(image, width, height, 132, 340, 194, 300, 9, blue);
    drawLine(image, width, height, 194, 300, 258, 220, 9, blue);
    drawLine(image, width, height, 258, 220, 350, 142, 9, blue);
    for (const [cx, cy] of [[132, 340], [194, 300], [258, 220], [350, 142]]) {
      drawCircle(image, width, height, cx, cy, 22, white);
      drawCircle(image, width, height, cx, cy, 14, red);
    }
  });

  createIcon(assetFiles.calc, (image, width, height) => {
    fillPolygon(image, width, height, [[122, 76], [390, 76], [390, 436], [122, 436]], [231, 246, 251, 255]);
    drawLine(image, width, height, 122, 76, 390, 76, 8, navy);
    drawLine(image, width, height, 390, 76, 390, 436, 8, navy);
    drawLine(image, width, height, 390, 436, 122, 436, 8, navy);
    drawLine(image, width, height, 122, 436, 122, 76, 8, navy);
    fillPolygon(image, width, height, [[156, 112], [356, 112], [356, 176], [156, 176]], white);
    drawLine(image, width, height, 156, 176, 356, 176, 4, navy);
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const cx = 178 + col * 78;
        const cy = 230 + row * 64;
        drawCircle(image, width, height, cx, cy, 19, col === 2 ? blue : navy);
      }
    }
    drawLine(image, width, height, 152, 382, 360, 382, 8, blue);
  });
}

const meta = {
  1: ["intro_build", "Ausfalldaten sammeln und entlang der Zeitachse sortieren.", "medium", "reveal_sequence", [1, 2, 3, 4, 5, 6]],
  2: ["intro_build", "Median-Rank-Formel zur Näherung der Ausfallwahrscheinlichkeit einführen.", "medium", "reveal_sequence", [1, 2, 3, 4, 5, 6]],
  3: ["intro_build", "Berechnete F(t_i)-Werte als Hilfslinien im Diagramm verorten.", "medium", "reveal_sequence", [1, 2, 3, 4, 5, 6]],
  4: ["intro_build", "Ausfallzeiten und Ausfallwahrscheinlichkeiten als Punkte darstellen.", "medium", "reveal_sequence", [1, 2, 3, 4, 5, 6]],
  5: ["intro_build", "Ausgleichsgerade durch die Datenpunkte bestimmen.", "medium", "reveal_sequence", [1, 2, 3, 4, 5, 6]],
  6: ["intro_build", "Weibull-Parameter aus Steigung und charakteristischer Lebensdauer ableiten.", "medium", "reveal_sequence", [1, 2, 3, 4, 5, 6]],
  7: ["distribution_formula", "Aus den sortierten Ausfällen entsteht eine Weibull-Funktion mit Beispielwert.", "low", "pptx_animation_sequence", [7, 8]],
  8: ["distribution_formula", "Zwischenzustand ohne Formelblock: die grafische Weibull-Auswertung bleibt sichtbar.", "low", "pptx_animation_sequence", [7, 8]],
  9: ["mechanisms_split", "Gemischte Ausfallereignisse werden nach Mechanismus A und B getrennt.", "low", "single_slide", [9]],
  10: ["censored_build", "Ausfallzeitpunkte werden einem Objekt-Zeit-Diagramm zugeordnet.", "low", "reveal_sequence", [10, 11]],
  11: ["censored_build", "Zensierte Beobachtungen werden als eigene blaue Ebene ergänzt.", "low", "reveal_sequence", [10, 11]],
  12: ["methods_overview", "Grafische Methode und Berechnungsmethoden MLS/MLE werden eingeordnet.", "low", "single_slide", [12]],
  13: ["confidence_bounds", "Weibull-Diagramm mit Vertrauensgrenzen und Streuband darstellen.", "low", "single_slide", [13]],
};

function visibleText(slideNumber) {
  const commonTitle = {
    id: "source_title_omitted",
    text: "Allgemeines Vorgehen in der Lebensdatenanalyse",
    role: "source_title_not_rendered",
    keep_exact: true,
    rebuild_note: "Nicht sichtbar im SVG-Vorschlag; der Folientitel wird später außerhalb des SVG ergänzt.",
  };
  const perSlide = {
    1: ["Sammeln der Ausfalldaten", "Lebensdauer t"],
    2: ["Berechnen von Ausfallwahrscheinlichkeiten", "Median-Rank-Verfahren", "F(t_i) = (i - 0,3)/(n + 0,4)"],
    3: ["F(t_i)-Hilfslinien", "Berechnung mit"],
    4: ["F(t_i)-Punkte", "Lebensdauer t"],
    5: ["Ermittlung der Regressionsgeraden"],
    6: ["Schätzung der Weibull-Parameter", "b = Steigung", "T = F^-1(0,632)"],
    7: ["T → 8", "b → 3", "F(t) = 1 - e^(-(t/8)^3)", "F(10) ≈ 85,8 %"],
    8: ["Lebensdauer", "Ausfallwahrscheinlichkeit"],
    9: ["Ausfallmechanismus A", "Ausfallmechanismus B"],
    10: ["Objekt Nr.", "t"],
    11: ["Objekt Nr.", "t", "Zensierte Beobachtungen"],
    12: ["Grafische Methode", "Berechnungs-Methoden", "MLS", "MLE"],
    13: ["95%-Vertrauensgrenze", "5%-Vertrauensgrenze"],
  };
  return [
    commonTitle,
    ...(perSlide[slideNumber] || []).map((text, index) => ({
      id: `text_${pad(slideNumber)}_${index + 1}`,
      text,
      role: text.includes("=") || text.includes("F(") ? "formula_or_axis_label" : "label",
      keep_exact: true,
      rebuild_note: "Als editierbarer SVG-Text im Vorschlag gesetzt oder aus didaktischem Grund vereinfacht.",
    })),
  ];
}

function analysisJson(slideNumber) {
  const [sequenceId, purpose, narrationConfidence, mode, groupSlides] = meta[slideNumber];
  const usesPng = [7, 8, 9, 10, 11, 12, 13].includes(slideNumber);
  return {
    schema_version: "1.0",
    seminar_id: seminarId,
    module_id: moduleId,
    slide_id: `${moduleId}_${pad(slideNumber)}`,
    source_slide_number: slideNumber,
    status: "review",
    source_files: {
      pptx: pptxPath,
      pptx_unpacked: pptxUnpackedPath,
      pdf: pdfPath,
      png: `${pngDir}/Folie${slideNumber}.PNG`,
      narration_md: narrationPath,
    },
    source_slide_group: {
      mode,
      group_id: `RE3_TEST_1_${sequenceId}`,
      source_slide_numbers: groupSlides,
      primary_slide_number: groupSlides[0],
      notes: [
        mode === "single_slide"
          ? "Als eigenständiger SVG-Vorschlag neu aufgebaut."
          : "Als Preview-Zustand eines animierbaren Master-SVGs modelliert.",
      ],
    },
    narration: {
      mode: "unchanged",
      text_ref: `${narrationPath}#folie-1--aufbaufolge`,
      text: null,
      confidence: narrationConfidence,
      sync_notes: [
        narrationConfidence === "low"
          ? "Sprechertext liegt fuer den Testausschnitt nicht folienscharf getrennt vor."
          : "Sprechertext-Zuordnung ist fuer die Aufbaufolge plausibel.",
      ],
    },
    slide_summary: {
      title: "Allgemeines Vorgehen in der Lebensdatenanalyse",
      title_rendering: "omitted_from_svg",
      purpose,
      core_message: purpose,
      layout_type: slideNumber <= 6 ? "build_sequence" : slideNumber === 9 ? "comparison" : "diagram",
      complexity: [7, 9, 13].includes(slideNumber) ? "high" : "medium",
    },
    visible_text: visibleText(slideNumber),
    visual_elements: [
      {
        id: `sequence_${sequenceId}`,
        type: "svg_group",
        semantic_role: purpose,
        source_methods: ["pptx_openxml", "png_reference", "component_library"],
        rebuild_intent: "Neu komponierte SVG-Grafik mit editierbaren Texten, berechneten Achsen und stabilen Layern.",
        component_sources: [
          "components/svg-library/timeline-failures.svg",
          "components/svg-library/axis-diagram.svg",
          [7, 8, 9, 12, 13].includes(slideNumber) ? "components/svg-library/weibull-diagram.svg" : null,
        ].filter(Boolean),
      },
    ],
    generated_assets: usesPng
      ? [
          {
            id: "tool_transform_arrow_png",
            path: "assets/scenes/RE3_TEST_1/pictograms/tool-transform-arrow.png",
            type: "png",
            purpose: "Transformations-/Werkzeugpiktogramm, per <image> eingebunden.",
          },
          ...(slideNumber === 12
            ? [
                {
                  id: "method_graph_png",
                  path: "assets/scenes/RE3_TEST_1/pictograms/method-graph.png",
                  type: "png",
                  purpose: "Icon fuer grafische Methode.",
                },
                {
                  id: "method_calculation_png",
                  path: "assets/scenes/RE3_TEST_1/pictograms/method-calculation.png",
                  type: "png",
                  purpose: "Icon fuer Berechnungsmethoden.",
                },
              ]
            : []),
        ]
      : [],
    qa: {
      completeness: "review",
      narration_linked: true,
      visible_text_complete: true,
      visual_structure_complete: true,
      animation_confidence: narrationConfidence,
      issues: [
        "SVG-Vorschlag enthält keinen sichtbaren Folientitel.",
        "PowerPoint-Aufbaufolien werden als Master-SVG/Preview-Zustände behandelt.",
      ],
      open_questions: [],
      assumptions: [
        "Die finale Folienüberschrift wird außerhalb des SVGs gesetzt.",
        "Die neue SVG-Komponentenbibliothek ist die Referenz fuer wiederkehrende Diagrammformen.",
      ],
    },
  };
}

function sequenceManifest() {
  return {
    schema_version: "basisRebuildAnimationSequences/v2",
    module_id: moduleId,
    purpose: "Neu generierte SVG-Vorschlaege fuer RE3 Test 1 mit Komponentenbibliothek und PNG-Assets.",
    component_sources: [
      "components/svg-library/timeline-failures.svg",
      "components/svg-library/timeline-simple.svg",
      "components/svg-library/axis-diagram.svg",
      "components/svg-library/weibull-diagram.svg",
    ],
    asset_dependencies: [
      {
        id: "tool_transform_arrow_png",
        path: "assets/scenes/RE3_TEST_1/pictograms/tool-transform-arrow.png",
        status: "generated",
        usage: "Transformationspiktogramm in Folien 7-13.",
      },
      {
        id: "method_graph_png",
        path: "assets/scenes/RE3_TEST_1/pictograms/method-graph.png",
        status: "generated",
        usage: "Methodenbaum Folie 12.",
      },
      {
        id: "method_calculation_png",
        path: "assets/scenes/RE3_TEST_1/pictograms/method-calculation.png",
        status: "generated",
        usage: "Methodenbaum Folie 12.",
      },
    ],
    sequences: [
      {
        id: "intro_build",
        master_svg: "rebuild-proposals/svg/RE3_TEST_1/sequence_intro_build.svg",
        preview_slides: [1, 2, 3, 4, 5, 6],
        layers: ["formula", "F(t_i)-Hilfslinien", "Ausfallpunkte", "Regressionsgerade", "Parameter"],
      },
      {
        id: "distribution_formula",
        master_svg: "rebuild-proposals/svg/RE3_TEST_1/sequence_distribution_formula.svg",
        preview_slides: [7, 8],
        layers: ["layer_distribution_formula"],
      },
      {
        id: "censored_build",
        master_svg: "rebuild-proposals/svg/RE3_TEST_1/sequence_censored_build.svg",
        preview_slides: [10, 11],
        layers: ["timeline_censor_marker", "object_censored_layer"],
      },
    ],
  };
}

function writeAssetManifest() {
  writeJson(path.join(assetDir, "manifest.json"), {
    schema_version: "sceneAssetManifest/v2",
    scene_id: moduleId,
    assets: [
      {
        id: "tool_transform_arrow_png",
        path: `assets/scenes/${moduleId}/pictograms/${assetFiles.tool}`,
        type: "png",
        status: "generated",
        contains_text: false,
        role: "Transformationspiktogramm.",
      },
      {
        id: "method_graph_png",
        path: `assets/scenes/${moduleId}/pictograms/${assetFiles.graph}`,
        type: "png",
        status: "generated",
        contains_text: false,
        role: "Grafische Methode.",
      },
      {
        id: "method_calculation_png",
        path: `assets/scenes/${moduleId}/pictograms/${assetFiles.calc}`,
        type: "png",
        status: "generated",
        contains_text: false,
        role: "Berechnungsmethoden.",
      },
    ],
  });
}

function updateInventory() {
  const filePath = path.join(repoRoot, "analysis", "inventories", "re3_test_1_inventory.json");
  if (!fs.existsSync(filePath)) return;
  const inventory = JSON.parse(fs.readFileSync(filePath, "utf8"));
  inventory.status = "review";
  for (const slide of inventory.slides || []) {
    slide.status = "review";
    const note = "Neu generierter SVG-Vorschlag mit Komponentenbibliothek und PNG-Assets.";
    if (!slide.notes.includes(note)) slide.notes.push(note);
  }
  writeJson(filePath, inventory);
}

function writeReport() {
  const rows = Array.from({ length: 13 }, (_, index) => {
    const n = index + 1;
    const [, , confidence, mode] = meta[n];
    return `| ${n} | \`${moduleId}_${pad(n)}\` | \`review\` | \`${confidence}\` | \`${mode}\` | \`rebuild-proposals/svg/RE3_TEST_1/slide_${pad(n)}.svg\` | Komponenten + PNG-Assets |`;
  }).join("\n");
  const report = `# Modulreport: RE3_TEST_1

## Status

\`\`\`text
module_id: RE3_TEST_1
status: review
slides_total: 13
slides_rebuilt_as_svg: 13
master_sequences: 3
\`\`\`

## Neue Rebuild-Runde

Alle SVG-Vorschlaege wurden neu generiert. Sichtbare Folientitel aus der PowerPoint sind bewusst nicht im SVG enthalten. Wiederkehrende Formen verwenden die Komponentenlogik aus \`components/svg-library/\`, insbesondere Zeitstrahl-, Achsen- und Weibull-Diagramm-Vorlagen.

## Sequenzen

- \`sequence_intro_build.svg\`: Folien 1-6
- \`sequence_distribution_formula.svg\`: Folien 7-8
- \`sequence_censored_build.svg\`: Folien 10-11

## PNG-Assets

- \`assets/scenes/RE3_TEST_1/pictograms/tool-transform-arrow.png\`
- \`assets/scenes/RE3_TEST_1/pictograms/method-graph.png\`
- \`assets/scenes/RE3_TEST_1/pictograms/method-calculation.png\`

## Folienstatus

| Folie | Slide-ID | Status | Sprechertext | Modus | SVG-Vorschlag | Hinweise |
| --- | --- | --- | --- | --- | --- | --- |
${rows}

## Review-Hinweise

- Folien 1-6, 7-8 und 10-11 sind als animierbare Sequenzen gedacht.
- Weibull-Diagramme nutzen berechnete Log-/Weibull-Koordinaten, keine gleichmaessige y-Skalierung.
- PNGs werden nur fuer Piktogramme/Icons verwendet; Achsen, Text, Formeln und Diagramme bleiben SVG-nativ.
`;
  ensureDir(reportsDir);
  fs.writeFileSync(path.join(reportsDir, "re3_test_1_report.md"), report, "utf8");
}

function main() {
  ensureDir(svgDir);
  ensureDir(analysisDir);
  ensureDir(animationDir);
  ensureDir(reportsDir);
  createAssets();
  writeAssetManifest();

  for (let slideNumber = 1; slideNumber <= 13; slideNumber += 1) {
    fs.writeFileSync(path.join(svgDir, `slide_${pad(slideNumber)}.svg`), slideSvg(slideNumber), "utf8");
    writeJson(path.join(analysisDir, `re3_test_1_slide_${pad(slideNumber)}_rebuild.json`), analysisJson(slideNumber));
  }

  fs.writeFileSync(path.join(svgDir, "sequence_intro_build.svg"), introSlide(6, true), "utf8");
  fs.writeFileSync(path.join(svgDir, "sequence_distribution_formula.svg"), distributionSlide(true, true), "utf8");
  fs.writeFileSync(path.join(svgDir, "sequence_censored_build.svg"), censoredSlide(true, true), "utf8");
  writeJson(path.join(animationDir, "re3_test_1_sequences.json"), sequenceManifest());
  updateInventory();
  writeReport();

  console.log("Generated RE3_TEST_1 SVG proposals with component library references and PNG assets.");
}

main();
