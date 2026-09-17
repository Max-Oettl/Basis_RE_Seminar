"use strict";

const fs = require("node:fs");
const path = require("node:path");
const theme = require("./reltest-education-theme");

const C = theme.colors;
const REPO_ROOT = path.resolve(__dirname, "..");

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function wrap(text, width, size) {
  const maxChars = Math.max(8, Math.floor(width / (size * 0.53)));
  const lines = [];
  for (const paragraph of String(text).split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length > maxChars && current) {
        lines.push(current);
        current = word;
      } else current = candidate;
    }
    if (current) lines.push(current);
  }
  return lines;
}

function txt(x, y, text, size = 22, weight = 650, fill = C.text, anchor = "start") {
  return `<text x="${x}" y="${y}" font-size="${Math.max(18, size)}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true" data-qc-padding="2">${esc(text)}</text>`;
}

function multi(x, y, width, text, size = 22, weight = 650, fill = C.text, anchor = "start", lineHeight = 1.25) {
  const lines = wrap(text, width, size);
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true" data-qc-padding="2">${lines.map((item, index) => `<tspan x="${x}" dy="${index ? size * lineHeight : 0}">${esc(item)}</tspan>`).join("")}</text>`;
}

function rect(x, y, width, height, fill = C.surface, stroke = "none", strokeWidth = 0, radius = 0) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" data-qc-allow-overlap="true"/>`;
}

function line(x1, y1, x2, y2, stroke = C.accent, width = 2.5, arrow = false, dash = "") {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}${arrow ? ` marker-end="url(#arrow_${stroke.slice(1)})"` : ""} data-role="connector" data-qc-role="connector" data-qc-layer="connector"/>`;
}

function pathLine(d, stroke = C.accent, width = 2.5, arrow = false, dash = "") {
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}${arrow ? ` marker-end="url(#arrow_${stroke.slice(1)})"` : ""} data-role="connector" data-qc-role="connector" data-qc-layer="connector"/>`;
}

function image(href, x, y, width, height, label) {
  return `<image href="${href}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" aria-label="${esc(label)}" data-qc-allow-overlap="true"/>`;
}

function formulaImage(href, x, y, width, height, label) {
  return `<image href="${href}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" aria-label="${esc(label)}" data-formula-asset="${esc(href)}" data-qc-role="formula" data-qc-allow-overlap="true"/>`;
}

function inlineSvgAsset(relativePath, x, y, width, height, label) {
  const source = fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
  const open = source.match(/<svg\b([^>]*)>/i);
  const closeIndex = source.lastIndexOf("</svg>");
  if (!open || closeIndex < 0) throw new Error(`Ungültiges SVG-Asset: ${relativePath}`);
  const viewBox = open[1].match(/viewBox="([^"]+)"/i)?.[1];
  if (!viewBox) throw new Error(`SVG-Asset ohne viewBox: ${relativePath}`);
  const bodyStart = open.index + open[0].length;
  const body = source
    .slice(bodyStart, closeIndex)
    .replace(/<metadata\b[^>]*>[\s\S]*?<\/metadata>/gi, "")
    .replace(/\bns4:href=/g, "xlink:href=")
    .replace(/font-family:\s*'Archivo'/g, "font-family: Archivo, Arial, Helvetica, sans-serif")
    .replace(/<text>/g, '<text style="font-size: 18px; font-family: Archivo, Arial, Helvetica, sans-serif">')
    .replace(/<(path|circle|line|rect)\b(?![^>]*\b(?:data-role|data-qc-role)=)/gi, '<$1 data-role="plot-geometry"');
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="${esc(label)}" data-qc-allow-overlap="true">${body}</svg>`;
}

function pictogram(href, x, y, size, kind) {
  return `<image href="${href}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" data-source-media="true" data-pictogram-asset-type="generated_png" data-pictogram-style="reltest-education-minimal-v1" data-pictogram-kind="${esc(kind)}" data-pictogram-size="${size}" data-pictogram-semantic-role="orientation" data-qc-allow-overlap="true"/>`;
}

function circleWithCheck(x, y, color = C.educationAccent) {
  return `${rect(x - 24, y - 24, 48, 48, color, color, 0, 24)}${pathLine(`M ${x - 11} ${y} L ${x - 2} ${y + 10} L ${x + 14} ${y - 12}`, C.surface, 4)}`;
}

function group(id, label, body, animated = true) {
  return `<g id="${id}"${animated ? ` data-anim-target="true" data-anim-label="${esc(label)}"` : ""} data-qc-group="${id}">${body}</g>`;
}

function target(id, label, keywords = [], action = "show") {
  return { id, label, keywords, action };
}

function sectionLabel(x, y, width, label, color = C.accent) {
  return `${txt(x, y, label.toUpperCase(), 18, 850, color)}${line(x, y + 18, x + width, y + 18, color, 3)}`;
}

function bulletList(x, y, width, items, options = {}) {
  const color = options.color || C.accent;
  const size = options.size || 22;
  const gap = options.gap || 58;
  const nested = options.nested || false;
  return items.map((item, index) => {
    const offset = nested && String(item).startsWith("↳") ? 30 : 0;
    const clean = String(item).replace(/^↳\s*/, "");
    const marker = offset ? `<path d="M${x + 5} ${y + index * gap - 4}h12v12" fill="none" stroke="${color}" stroke-width="2"/>` : `<circle cx="${x + 8}" cy="${y + index * gap - 7}" r="6" fill="${color}"/>`;
    return `${marker}${multi(x + 30 + offset, y + index * gap, width - 30 - offset, clean, size, offset ? 620 : 680, C.text)}`;
  }).join("");
}

function numberStep(x, y, number, title, body, color = C.accent) {
  return `${rect(x, y - 31, 54, 54, color, color, 0, 27)}${txt(x + 27, y + 7, number, 19, 850, C.surface, "middle")}${txt(x + 82, y - 5, title, 23, 800, C.deep)}${body ? multi(x + 82, y + 28, 430, body, 18, 620, C.text) : ""}`;
}

function calloutLine(x, y, width, label, value, color = C.accent) {
  return `${txt(x, y, label.toUpperCase(), 17, 840, color)}${line(x, y + 15, x + width, y + 15, C.border, 1.5)}${multi(x, y + 56, width, value, 24, 760, C.deep)}`;
}

function bottomRule(id, label, text, color = C.accent, animated = true) {
  const corporateThread = color === C.accent ? rect(92, 858, 8, 84, C.educationAccent, C.educationAccent, 0, 4) : "";
  return group(id, label, `${rect(92, 858, 1736, 84, color, color, 0, 4)}${corporateThread}${txt(960, 911, text, 25, 820, C.surface, "middle")}`, animated);
}

function plotHref(filename) {
  return `../../../../analysis/re3-assets/plots/${filename}`;
}

function timelineRow(id, label, y, start, end, censored = false, color = C.accent) {
  const marker = censored
    ? `${line(end - 22, y - 14, end, y, color, 3)}${line(end - 22, y + 14, end, y, color, 3)}`
    : `${line(end - 12, y - 12, end + 12, y + 12, C.failure, 3)}${line(end - 12, y + 12, end + 12, y - 12, C.failure, 3)}`;
  return group(id, label, `${txt(start - 42, y + 7, label, 19, 750, C.deep, "end")}${line(start, y, end, y, color, 3)}${marker}`);
}

function buildIntro() {
  const data = group("intro_1", "Ausfallzeiten", `${rect(92, 176, 720, 82, C.accent, C.accent, 0, 3)}${txt(452, 228, "AUSFALLZEITEN", 28, 850, C.surface, "middle")}`);
  const evaluation = group("intro_2", "Auswertung", `${pathLine("M 204 328 V 566 H 380", C.secondary, 6, true)}${multi(92, 392, 300, "Auswertung von\nAusfallzeiten", 24, 760, C.deep)}`);
  const method = group("intro_3", "Statistische Methoden", `${pathLine("M 598 294 V 390 H 700 L 540 500 L 380 390 H 482 V 294 Z", C.technical, 4)}${multi(540, 374, 250, "Statistische\nMethoden", 25, 800, C.deep, "middle")}`);
  const parameters = group("intro_4", "Verteilungsparameter", `${rect(300, 544, 510, 74, C.accentSoft, C.accent, 2, 3)}${txt(555, 592, "VERTEILUNGSPARAMETER", 24, 820, C.accent, "middle")}`);
  const forecast = group("intro_5", "Weibull-Auswertung", `${image(plotHref("weibull-parameter.svg"), 930, 170, 820, 570, "Weibullnetz mit Verteilungsparametern")}${txt(1340, 780, "F(t) = 1 − exp[−(t / T)ᵇ]", 31, 760, C.deep, "middle")}${txt(1120, 826, "T  →  charakteristische Lebensdauer", 19, 700, C.text)}${txt(1120, 856, "b  →  Formparameter", 19, 700, C.text)}`);
  const relation = bottomRule("intro_relation", "Ziel", "ZIEL  ·  Abschätzung des Ausfallverhaltens von Komponenten und Systemen", C.accent);
  return { body: data + evaluation + method + parameters + forecast + relation, targets: [target("intro_1", "Lebensdauerdaten", ["Lebensdauerdaten"]), target("intro_2", "Auswertung", ["auswerten"]), target("intro_3", "Weibullverteilung", ["Weibullverteilung"]), target("intro_4", "Parameter", ["Parameter"]), target("intro_5", "Prognosen", ["Prognosen"]), target("intro_relation", "Ziel", ["grundlegende Vorgehen"], "draw")] };
}

function buildWorkflow(scene) {
  const markerPositions = [164, 280, 430, 566];
  const markerLabels = ["t₁", "t₂", "…", "tₙ"];
  const markers = markerPositions.map((x, index) => `${line(x - 8, 303, x + 8, 319, C.educationAccent, 3)}${line(x - 8, 319, x + 8, 303, C.educationAccent, 3)}${txt(x, 350, markerLabels[index], 18, 760, C.educationAccent, "middle")}`).join("");

  const timeline = group(
    "workflow_timeline",
    "Sortierte Ausfallzeiten auf der Zeitachse",
    `${sectionLabel(92, 176, 520, "01 · Ausfallzeiten sortieren")}${txt(92, 244, "t₁ ≤ t₂ ≤ … ≤ tₙ", 24, 760, C.deep)}${line(132, 311, 612, 311, C.accent, 3, true)}${markers}${txt(612, 286, "Lebensdauer t", 18, 720, C.text, "end")}`,
  );

  const formula = group(
    "workflow_formula",
    "Median-Rank-Formel",
    `${sectionLabel(688, 176, 560, "02 · Median Ranks berechnen")}${formulaImage("formulas/median-rank.svg", 724, 226, 486, 76, "Median-Rank-Formel")}${line(724, 338, 724, 430, C.educationAccent, 5)}${txt(750, 362, "i", 22, 850, C.deep)}${txt(784, 362, "Rang des Ausfalls", 19, 680, C.text)}${txt(750, 414, "n", 22, 850, C.deep)}${txt(784, 414, "Stichprobengröße", 19, 680, C.text)}${txt(1088, 414, "hier: n = 7", 18, 760, C.educationAccent)}`,
  );

  const pairs = [
    ["t₁", "9,5 %"],
    ["t₂", "23,0 %"],
    ["t₃", "36,5 %"],
    ["t₄", "50,0 %"],
    ["t₅", "63,5 %"],
    ["t₆", "77,0 %"],
    ["t₇", "90,5 %"],
  ];
  const pairRows = pairs.map(([time, probability], index) => {
    const column = index < 4 ? 0 : 1;
    const row = column === 0 ? index : index - 4;
    const x = 1320 + column * 248;
    const y = 258 + row * 52;
    return group(`workflow_pair_${index+1}`,`Wertepaar ${index+1}`,`${txt(x, y, String(index+1), 20, 820, C.educationAccent)}${txt(x + 28, y, `F(${time})`, 20, 820, C.deep)}${txt(x + 110, y, "=", 19, 720, C.text)}${txt(x + 142, y, probability, 19, 760, C.educationAccent)}`);
  }).join("");
  const probabilityMap = group(
    "workflow_probability_map",
    "Zeitwerte und Ausfallwahrscheinlichkeiten zuordnen",
    `${sectionLabel(1300, 176, 528, "03 · Wertepaare bilden")}${txt(1320, 220, "F(tᵢ) aus der Rangposition", 18, 760, C.text)}${pairRows}`,
  );

  const plotPath = path.join("rebuild-proposals", "svg", "RE3", scene.work_unit, "plots", "weibull-probability.svg");
  const weibullPlot = group(
    "workflow_weibull_plot",
    "Wertepaare im Weibullnetz",
    `${sectionLabel(92, 520, 1000, "04 · Im Weibullnetz auftragen")}${inlineSvgAsset(plotPath, 92, 558, 1000, 420, "Weibullnetz mit sieben Median-Rank-Punkten und Ausgleichsgerade")}`,
  );

  const parameters = group(
    "workflow_parameters",
    "Weibull-Parameter ablesen",
    `${sectionLabel(1300, 520, 528, "05 · Fit auswerten")}${line(1300, 590, 1300, 740, C.educationAccent, 5)}${txt(1334, 626, "T", 28, 850, C.educationAccent)}${txt(1380, 626, "bei F(t) = 63,2 %", 20, 720, C.text)}${txt(1334, 692, "b", 28, 850, C.educationAccent)}${txt(1380, 692, "aus der Steigung", 20, 720, C.text)}`,
  );

  const result = group(
    "workflow_result",
    "Weibull-Funktion",
    `${txt(1300, 792, "WEIBULL-FUNKTION ANWENDEN", 18, 850, C.accent)}${formulaImage("formulas/weibull-function.svg", 1300, 816, 470, 62, "Weibull-Funktion aus T und b")}${line(1300, 904, 1828, 904, C.border, 2)}${txt(1300, 944, "Beispiel aus der Quelle", 18, 720, C.text)}${formulaImage("formulas/weibull-example.svg", 1320, 956, 470, 48, "Beispiel mit T gleich 8 und b gleich 3")}`,
  );

  return {
    body: timeline + formula + probabilityMap + weibullPlot + parameters + result,
    targets: [
      target("workflow_timeline", "Sortierte Ausfallzeiten", ["der Größe nach sortiert"]),
      target("workflow_formula", "Median-Rank-Formel", ["Näherungsformel des Median-Rang-Verfahrens"]),
      target("workflow_probability_map", "Zuordnung von tᵢ und F(tᵢ)", ["für jeden Ausfallzeitpunkt einen Wert"]),
      target("workflow_weibull_plot", "Median-Rank-Punkte im Weibullnetz", ["als Punkte in das Weibull-Wahrscheinlichkeits-Papier"]),
      target("plot_weibull_fit", "Ausgleichsgerade", ["Ausgleichsgerade durch die Punkte"], "draw"),
      target("workflow_parameters", "T und b ablesen", ["Sobald die Gerade festgelegt"]),
      target("workflow_result", "Weibull-Funktion", ["Damit haben wir die Weibullverteilung bestimmt"]),
    ],
  };
}

function buildMechanismsOverview() {
  const joint = group("mechanisms_joint", "Gemeinsame Ausgangsdaten", `${sectionLabel(92, 190, 390, "Ausgangsdaten", C.failure)}${multi(92, 252, 400, "Ausfälle mehrerer Mechanismen liegen zunächst in einem Datensatz vor.", 22, 700, C.text)}`);
  const plot = group("mechanisms_plot", "Ein Fit je Mechanismus", `${image(plotHref("mechanism-split.svg"), 500, 138, 1100, 640, "Getrennte Ausfallmechanismen im Weibullnetz")}`);
  const total = group("mechanisms_total", "Gesamtzuverlässigkeit", `${line(1600, 446, 1718, 446, C.accent, 4, true)}${sectionLabel(1640, 214, 190, "Danach")}${multi(1640, 282, 180, "Verteilungen wieder zur Gesamtzuverlässigkeit verrechnen.", 20, 760, C.deep)}`);
  const rule = bottomRule("mechanisms_rule", "Mechanismen trennen", "1  MECHANISMEN TRENNEN   →   2  EINZELN FITTEN   →   3  GESAMTZUVERLÄSSIGKEIT", C.accent);
  return { body: joint + plot + total + rule, targets: [target("mechanisms_joint", "Gemeinsame Daten", ["mehrere Ausfallmechanismen"]), target("mechanisms_plot", "Getrennte Weibull-Geraden", ["zwei ermittelte Weibull-Geraden"]), target("mechanisms_rule", "Getrennte Auswertung", ["getrennt voneinander"]), target("mechanisms_total", "Gesamtzuverlässigkeit", ["Gesamtzuverlässigkeit"])] };
}

function buildCensoredOverview() {
  const plot = group("censored_plot", "Objekt-Zeit-Diagramm", image(plotHref("censored.svg"), 92, 170, 1110, 650, "Objekt-Zeit-Diagramm mit zensierten Beobachtungen"));
  const context = group("censored_context", "Zensierte Information", `${sectionLabel(1260, 220, 510, "Zensierte Beobachtung")}${multi(1260, 286, 510, "Das Objekt ist bis zum Beobachtungsende funktionsfähig.", 25, 760, C.deep)}`);
  const examples = group("censored_examples", "Typische Gründe", `${sectionLabel(1260, 456, 510, "Warum endet die Beobachtung?")}${bulletList(1260, 520, 500, ["Test wird vorzeitig abgebrochen", "Versuchsende ist erreicht", "Objekt scheidet aus der Studie aus"], { size: 21, gap: 72 })}`);
  const rule = bottomRule("censored_rule", "Zensierte Zeit", "LAUFZEIT BEKANNT  ·  AUSFALLZEIT UNBEKANNT", C.accent);
  return { body: plot + context + examples + rule, targets: [target("censored_plot", "Objekt-Zeit-Diagramm", ["zensierte Daten", "Beobachtung"]), target("censored_context", "Zensierte Information", ["nicht ausgefallen", "weiterhin"]), target("censored_examples", "Zensierungsgründe", ["Versuchsende", "Studie"]), target("censored_rule", "Laufzeit bleibt bekannt", ["zensiert"])] };
}

function buildMethodChoice() {
  const miniPlot = `${line(810, 574, 1130, 574, C.deep, 3, true)}${line(810, 574, 810, 356, C.deep, 3, true)}${line(862, 530, 1088, 390, C.failure, 4)}${txt(970, 622, "Lebensdauer", 18, 700, C.text, "middle")}`;
  const source = group("method_mls", "Grafische Methode", `${timelineRow("method_data", "Daten", 252, 132, 560, false)}${line(610, 252, 760, 252, C.accent, 4, true)}${sectionLabel(810, 212, 390, "Grafische Methode")}${multi(810, 280, 390, "Weibullnetz · Regressionsgerade · Parameter ablesen", 22, 720, C.deep)}${miniPlot}`);
  const mle = group("method_mle", "Berechnungsmethoden", `${sectionLabel(1260, 212, 520, "Berechnungsmethoden")}${line(1370, 312, 1370, 430, C.secondary, 3)}${line(1370, 430, 1280, 510, C.secondary, 3, true)}${line(1370, 430, 1530, 510, C.secondary, 3, true)}${txt(1280, 560, "MLS", 34, 860, C.accent, "middle")}${txt(1530, 560, "MLE", 34, 860, C.accent, "middle")}${txt(1280, 610, "kleinste Quadrate", 19, 650, C.text, "middle")}${txt(1530, 610, "Maximum Likelihood", 19, 650, C.text, "middle")}`);
  const decision = group("method_decision", "Methodenwahl", `${line(92, 714, 1828, 714, C.border, 2)}${txt(92, 770, "METHODENWAHL", 18, 850, C.accent)}${txt(360, 770, "grafisch: anschaulich", 22, 760, C.deep)}${txt(790, 770, "MLS / MLE: genauer, mathematisch komplexer", 22, 760, C.deep)}${txt(790, 818, "Software rechnet – Fachverständnis verhindert Fehlanwendung", 20, 720, C.failure)}`);
  return { body: source + mle + decision, targets: [target("method_mls", "MLS", ["Least Square", "MLS"]), target("method_mle", "MLE", ["Maximum-Likelihood", "MLE"]), target("method_decision", "Methodenwahl", ["zensierte Daten", "vollständigen"])] };
}

function buildConfidenceIntro() {
  const plot = group("confidence_plot", "Fit mit Vertrauensgrenzen", image(plotHref("confidence.svg"), 92, 150, 1230, 700, "Weibull-Fit mit Vertrauensgrenzen"));
  const estimate = group("confidence_estimate", "Punktschätzung", calloutLine(1370, 220, 410, "Punktschätzung", "Weibullgerade aus der Stichprobe", C.accent));
  const bounds = group("confidence_bounds", "Vertrauensgrenzen", `${calloutLine(1370, 420, 410, "95-%-Vertrauensgrenze", "obere Grenze", C.secondary)}${calloutLine(1370, 598, 410, "5-%-Vertrauensgrenze", "untere Grenze", C.secondary)}`);
  const takeaway = bottomRule("confidence_takeaway", "Unsicherheit", "PUNKTSCHÄTZUNG + VERTRAUENSGRENZEN = UNSICHERHEIT SICHTBAR", C.accent);
  return { body: plot + estimate + bounds + takeaway, targets: [target("confidence_estimate", "Punktschätzung", ["Schätzung"]), target("confidence_plot", "Fit", ["Verteilung"]), target("confidence_bounds", "Vertrauensgrenzen", ["Vertrauensgrenzen", "Vertrauensbereich"]), target("confidence_takeaway", "Unsicherheit", ["Unsicherheit"])] };
}

function buildSamplePopulation() {
  const populationDots = Array.from({ length: 40 }, (_, index) => {
    const col = index % 8;
    const row = Math.floor(index / 8);
    const chosen = [2, 5, 11, 20, 28, 31, 35, 38].includes(index);
    return `<circle cx="${130 + col * 64}" cy="${245 + row * 68}" r="${chosen ? 15 : 11}" fill="${chosen ? C.educationAccent : C.accent}" opacity="${chosen ? 1 : .28}"/>`;
  }).join("");
  const sample = group("sample_population_sample", "Stichprobe", `${sectionLabel(92, 180, 520, "Grundgesamtheit")}${populationDots}${txt(350, 630, "markierte Punkte = Stichprobe", 20, 720, C.educationAccent, "middle")}`);
  const transfer = group("sample_population_transfer", "Statistischer Schluss", `${line(680, 432, 830, 432, C.accent, 4, true)}${txt(755, 392, "schätzen", 19, 800, C.accent, "middle")}`);
  const distribution = group("sample_population_distribution", "Lebensdauer der Grundgesamtheit", `${image(plotHref("confidence.svg"), 850, 150, 978, 650, "Verteilung der Grundgesamtheit mit Vertrauensgrenzen")}`);
  const rule = bottomRule("sample_population_rule", "Vertrauensbereich", "STICHPROBE → PUNKTSCHÄTZUNG → VERTRAUENSBEREICH DER GRUNDGESAMTHEIT", C.accent);
  return { body: sample + transfer + distribution + rule, targets: [target("sample_population_sample", "Stichprobe", ["Stichprobe"]), target("sample_population_transfer", "Schluss auf Grundgesamtheit", ["Grundgesamtheit"], "draw"), target("sample_population_distribution", "Verteilung und Grenzen", ["Vertrauensbereich"]), target("sample_population_rule", "Aussage", ["Schätzung"])] };
}

function buildConfidenceMeaning() {
  const plot = group("meaning_fit", "Weibullgerade", image(plotHref("confidence.svg"), 92, 150, 1080, 690, "Weibullgerade und Vertrauensgrenzen"));
  const bounds = group("meaning_bounds", "90-Prozent-Vertrauensbereich", `${sectionLabel(1230, 204, 550, "90-%-Vertrauensbereich")}${bulletList(1230, 278, 540, ["5-%- und 95-%-Grenze schließen den Bereich ein", "Vertrauensgrenzen beziehen sich auf wiederholte Stichproben"], { size: 22, gap: 100 })}`);
  const warning = group("meaning_warning", "Aussagesicherheit", `${sectionLabel(1230, 526, 550, "Aussagesicherheit")}${multi(1230, 594, 540, "Bei vielen Stichproben liegen rund 90 % der ermittelten Weibullgeraden innerhalb der Grenzen.", 23, 720, C.deep)}`);
  const rule = bottomRule("meaning_rule", "Korrekte Interpretation", "VERTRAUENSGRENZEN MACHEN SCHÄTZUNSICHERHEIT SICHTBAR", C.accent);
  return { body: plot + bounds + warning + rule, targets: [target("meaning_fit", "Schätzung", ["Schätzung"]), target("meaning_bounds", "Vertrauensgrenzen", ["Vertrauensgrenzen"]), target("meaning_warning", "Aussagesicherheit", ["Stichprobe"]), target("meaning_rule", "Unsicherheitsbereich", ["Grundgesamtheit"])] };
}

function driverScale(x, y, labelA, widthA, labelB, widthB, color) {
  return `${txt(x, y, labelA, 20, 740, C.deep)}${line(x + 150, y - 8, x + 560, y - 8, C.border, 6)}${line(x + 355 - widthA / 2, y - 8, x + 355 + widthA / 2, y - 8, color, 6)}${txt(x, y + 118, labelB, 20, 740, C.deep)}${line(x + 150, y + 110, x + 560, y + 110, C.border, 6)}${line(x + 355 - widthB / 2, y + 110, x + 355 + widthB / 2, y + 110, color, 6)}`;
}

function buildConfidenceDrivers() {
  const sample = group("drivers_sample", "Stichprobenumfang", `${sectionLabel(92, 218, 760, "Stichprobenumfang")}${driverScale(92, 340, "klein", 330, "groß", 110, C.accent)}${multi(92, 640, 700, "Mehr Daten  →  engerer Vertrauensbereich", 25, 800, C.deep)}`);
  const level = group("drivers_level", "Konfidenzniveau", `${sectionLabel(1000, 218, 760, "Konfidenzniveau")}${driverScale(1000, 340, "80 %  =  10 % / 90 %", 180, "90 %  =  5 % / 95 %", 350, C.secondary)}${multi(1000, 640, 700, "Höhere Aussagesicherheit  →  breiterer Bereich", 25, 800, C.deep)}`);
  const rule = bottomRule("drivers_rule", "Zwei Stellgrößen", "BREITE DES VERTRAUENSBEREICHS = DATENMENGE × KONFIDENZNIVEAU", C.accent);
  return { body: sample + level + rule, targets: [target("drivers_sample", "Stichprobenumfang", ["Stichprobenumfang", "Stichprobe"]), target("drivers_level", "Konfidenzniveau", ["Konfidenzniveau"]), target("drivers_rule", "Breite", ["breiter", "enger"])] };
}

function buildProbabilitySurface() {
  const plot = group("surface_plot", "Dichteverteilungen", image(plotHref("probability-surface.svg"), 92, 130, 1380, 750, "Dichteverteilungen der Ausfallwahrscheinlichkeit"));
  const meaning = group("surface_meaning", "Verteilung statt Einzelwert", `${sectionLabel(1500, 206, 300, "Für einen Zeitpunkt")}${multi(1500, 270, 300, "F(t) ist kein sicherer Einzelwert, sondern eine Verteilung plausibler Werte.", 22, 700, C.deep)}`);
  const message = group("surface_message", "Mediane verbinden", `${sectionLabel(1500, 516, 300, "Mediane verbinden")}${multi(1500, 580, 300, "Die Mediane der Dichtefunktionen bilden gemeinsam die Weibullgerade.", 22, 700, C.deep)}`);
  const note = bottomRule("surface_note", "50-50-Lage", "50 % DER VERLÄUFE OBERHALB  ·  50 % UNTERHALB DER MEDIANGERADEN", C.accent);
  return { body: plot + meaning + message + note, targets: [target("surface_plot", "Dichteverteilungen", ["dreidimensional"]), target("surface_meaning", "Verteilung statt Einzelwert", ["keine exakt festgelegte"]), target("surface_message", "Mediane und Weibullgerade", ["Median"]), target("surface_note", "50-50-Lage", ["fünfzig Prozent"])] };
}

function confidenceAxis(id, label, leftPercent, rightPercent, activeFrom, activeTo, note, color = C.accent) {
  const x1 = 260;
  const x2 = 1660;
  const width = x2 - x1;
  const from = x1 + width * activeFrom;
  const to = x1 + width * activeTo;
  return group(id, label, `${line(x1, 460, x2, 460, C.border, 4)}${line(from, 460, to, 460, color, 6)}${line(from, 422, from, 498, color, 4)}${line(to, 422, to, 498, color, 4)}${txt(from, 402, leftPercent, 24, 850, color, "middle")}${txt(to, 402, rightPercent, 24, 850, color, "middle")}${multi(960, 584, 1180, note, 30, 800, C.deep, "middle")}`);
}

function buildConfidenceTwoSided() {
  const visual = confidenceAxis("types_two", "Zweiseitiger 90-Prozent-Bereich", "5 %", "95 %", .05, .95, "90 % Aussagewahrscheinlichkeit zwischen zwei Grenzen");
  const meaning = group("types_two_meaning", "Unsicherheit in beide Richtungen", `${sectionLabel(280, 690, 1360, "Bedeutung")}${txt(960, 770, "untere Grenze   ←   Schätzwert   →   obere Grenze", 28, 780, C.deep, "middle")}`);
  const rule = bottomRule("types_two_rule", "Quantile", "ZWEISEITIG 90 %  =  5-%-GRENZE  +  95-%-GRENZE", C.accent);
  return { body: visual + meaning + rule, targets: [target("types_two", "5-%- und 95-%-Grenze", ["fünf-Prozent", "fünf Prozent"]), target("types_two_meaning", "Beide Richtungen", ["beide Richtungen"]), target("types_two_rule", "Zweiseitige Regel", ["neunzig Prozent"])] };
}

function buildConfidenceLeftSided() {
  const visual = confidenceAxis("types_left", "Linksseitiger 90-Prozent-Bereich", "−∞", "90 %", 0, .9, "Obere Grenze: Der wahre Wert liegt mit 90 % Sicherheit darunter");
  const meaning = group("types_left_meaning", "Maximale Ausfallwahrscheinlichkeit", `${sectionLabel(280, 710, 1360, "Fachliche Aussage", C.educationAccent)}${txt(960, 790, "maximale Ausfallwahrscheinlichkeit absichern", 30, 820, C.educationAccent, "middle")}`);
  const comparison = group("types_left_comparison", "Vergleich zum zweiseitigen Bereich", `${txt(960, 664, "Zum Vergleich: zweiseitig 90 % = 5-%- und 95-%-Grenze", 21, 720, C.text, "middle")}`);
  const rule = bottomRule("types_left_rule", "Obere Grenze", "LINKSSEITIG 90 %  =  EINE OBERE 90-%-GRENZE", C.accent);
  return { body: visual + comparison + meaning + rule, targets: [target("types_left", "Obere Grenze", ["obere Grenze"]), target("types_left_meaning", "Maximale Ausfallwahrscheinlichkeit", ["maximale Ausfallwahrscheinlichkeit"]), target("types_left_comparison", "Zweiseitiger Vergleich", ["fünf Prozent und eine fünfundneunzig Prozent"]), target("types_left_rule", "90-%-Grenze", ["neunzig Prozent Vertrauensgrenze"])] };
}

function buildConfidenceRightSided() {
  const visual = confidenceAxis("types_right", "Rechtsseitiger 90-Prozent-Bereich", "10 %", "+∞", .1, 1, "Untere Grenze: Der wahre Wert liegt mit 90 % Sicherheit darüber", C.secondary);
  const caution = group("types_right_caution", "Ausfallwahrscheinlichkeit", `${sectionLabel(180, 666, 720, "Bei F(t)", C.failure)}${multi(180, 728, 700, "Nur eine minimale Ausfallwahrscheinlichkeit nachweisen – meist wenig hilfreich.", 24, 740, C.deep)}`);
  const useful = group("types_right_useful", "Zuverlässigkeit", `${sectionLabel(1040, 666, 700, "Bei R(t)", C.educationAccent)}${multi(1040, 728, 700, "Als untere Zuverlässigkeitsgrenze fachlich sinnvoll.", 24, 780, C.deep)}`);
  const rule = bottomRule("types_right_rule", "Fragestellung", "RECHTSSEITIG 90 %  =  EINE UNTERE 10-%-GRENZE", C.accent);
  return { body: visual + caution + useful + rule, targets: [target("types_right", "Untere Grenze", ["untere Grenze"]), target("types_right_caution", "Minimale Ausfallwahrscheinlichkeit", ["minimale Ausfallwahrscheinlichkeit"]), target("types_right_useful", "Minimale Zuverlässigkeit", ["minimale Zuverlässigkeit"]), target("types_right_rule", "10-%-Grenze", ["zehn-Prozent-Vertrauensgrenze"])] };
}

function buildLifeDataSources() {
  const continuum = `${line(180, 258, 1740, 258, C.accent, 5, true)}${[260, 860, 1460].map((x) => `<circle cx="${x}" cy="258" r="17" fill="${C.accent}"/>`).join("")}`;
  const development = group("sources_development", "Test Bench", `${txt(260, 208, "TEST BENCH", 22, 850, C.accent, "middle")}${multi(260, 324, 420, "Prüfstand · beschleunigte Lebensdauerversuche", 22, 720, C.deep, "middle")}`);
  const testing = group("sources_testing", "Test Drive", `${txt(860, 208, "TEST DRIVE", 22, 850, C.accent, "middle")}${multi(860, 324, 420, "Fahrversuch · reale Lastkollektive", 22, 720, C.deep, "middle")}`);
  const field = group("sources_field", "Field Data", `${txt(1460, 208, "FIELD DATA", 22, 850, C.accent, "middle")}${multi(1460, 324, 420, "Felddaten · Service · Flottenbetrieb", 22, 720, C.deep, "middle")}`);
  const evidence = group("sources_evidence", "Produktentwicklungsprozess", `${image("media/lifecycle-data.jpg", 150, 430, 1620, 330, "Lebensdauerdaten entlang der Produktentwicklung")}${line(180, 814, 1740, 814, C.secondary, 3, true)}${txt(180, 790, "Unsicherheit", 19, 780, C.secondary)}${txt(1740, 790, "nimmt ab", 19, 780, C.secondary, "end")}${line(1740, 858, 180, 858, C.educationAccent, 3, true)}${txt(180, 900, "Repräsentativität nimmt zu", 19, 780, C.educationAccent)}`);
  return { body: continuum + development + testing + field + evidence, targets: [target("sources_development", "Prüfstand", ["Produktentwicklungsprozess", "Simulation"]), target("sources_testing", "Erprobung", ["Tests", "Versuchen"]), target("sources_field", "Feld", ["Feld", "Praxis"]), target("sources_evidence", "Evidenzbasis", ["Lebensdauerdaten"])] };
}

function buildCompleteData() {
  const plot = group("complete_plot", "Vollständige Objekt-Zeit-Verläufe", image(plotHref("failures.svg"), 92, 150, 1120, 680, "Vollständige Objekt-Zeit-Verläufe"));
  const definition = group("complete_definition", "Definition", `${sectionLabel(1260, 214, 520, "Vollständige Daten")}${multi(1260, 280, 520, "Alle Objekte sind ausgefallen.", 28, 820, C.deep)}`);
  const data = group("complete_data", "Versuchsende", `${bulletList(1260, 430, 500, ["Exakte Ausfallzeit für jedes Objekt bekannt", "Versuchsende nach letztem Ausfall", "Alle Zeiten gehen als Ausfälle in die Schätzung ein"], { size: 22, gap: 86 })}`);
  const rule = bottomRule("complete_rule", "Ausfallmarker", "×  =  BEOBACHTETER AUSFALL", C.accent);
  return { body: plot + definition + data + rule, targets: [target("complete_plot", "Objekt-Zeit-Verläufe", ["vollständigen Lebensdauerdaten"]), target("complete_definition", "Definition", ["Ausfall", "Prüfobjekte"]), target("complete_data", "Datensatz", ["Ausfallzeit"]), target("complete_rule", "Ausfallmarker", ["Ausfall"])] };
}

function buildRightCensored() {
  const plot = group("right_censored_plot", "Rechtszensierte Objekt-Zeit-Verläufe", image(plotHref("censored.svg"), 92, 150, 1120, 680, "Rechtszensierte Objekt-Zeit-Verläufe"));
  const definition = group("right_censored_definition", "Definition", `${sectionLabel(1260, 214, 520, "Rechtszensierung")}${multi(1260, 280, 520, "Nicht alle Objekte sind ausgefallen.", 28, 820, C.deep)}`);
  const coding = group("right_censored_coding", "Datencodierung", `${bulletList(1260, 430, 500, ["Objekt bis zur Herausnahme intakt", "Lebensdauer liegt rechts vom Beobachtungsende", "t_zens ≥ letzter beobachteter Ausfall", "Zeit und Status getrennt erfassen"], { size: 21, gap: 72 })}`);
  const rule = bottomRule("right_censored_rule", "Zensierungsmarker", "→  =  BIS ZU DIESEM ZEITPUNKT FUNKTIONSFÄHIG", C.accent);
  return { body: plot + definition + coding + rule, targets: [target("right_censored_plot", "Zensierte Verläufe", ["rechtszensiert"]), target("right_censored_definition", "Definition", ["Versuchsende", "funktioniert"]), target("right_censored_coding", "Zeit und Status", ["zensierte", "Daten"]), target("right_censored_rule", "Bedeutung", ["mindestens"])] };
}

function buildCensoringTypes() {
  const divider = line(960, 176, 960, 812, C.border, 2);
  const typeI = group("censor_type_i", "Typ I", `${sectionLabel(92, 204, 760, "Typ I · Versuchsstopp nach vorgegebener Zeit")}${line(700, 302, 700, 690, C.failure, 3, false, "10 7")}${txt(700, 282, "feste Prüfzeit", 18, 760, C.failure, "middle")}${timelineRow("type_i_1", "1", 380, 180, 440, false)}${timelineRow("type_i_2", "2", 480, 180, 610, false)}${timelineRow("type_i_3", "3", 580, 180, 700, true)}${multi(92, 752, 760, "Anzahl r der Ausfälle ist eine Zufallsgröße.", 23, 760, C.deep)}`);
  const typeII = group("censor_type_ii", "Typ II", `${sectionLabel(1040, 204, 740, "Typ II · Versuchsstopp nach vorgegebener Ausfallzahl")}${timelineRow("type_ii_1", "1", 380, 1120, 1380, false, C.secondary)}${timelineRow("type_ii_2", "2", 480, 1120, 1560, false, C.secondary)}${timelineRow("type_ii_3", "3", 580, 1120, 1680, true, C.secondary)}${multi(1040, 752, 740, "Versuchsende tᵣ ist eine Zufallsgröße.", 23, 760, C.deep)}`);
  const rule = bottomRule("censor_types_rule", "Vergleich", "TYP I: ZEIT FEST  ↔  TYP II: AUSFALLZAHL FEST", C.accent);
  return { body: divider + typeI + typeII + rule, targets: [target("censor_type_i", "Typ I", ["Typ I", "festen Zeit"]), target("censor_type_ii", "Typ II", ["Typ II", "Ausfälle"]), target("censor_types_rule", "Vergleich", ["Unterschied"])] };
}

function buildMultipleCensoring() {
  const axes = group("multi_censor_axes", "Unterschiedliche Beobachtungsfenster", `${sectionLabel(92, 190, 1080, "Multiple Zensierung")}${timelineRow("multi_1", "1", 310, 240, 740, false)}${timelineRow("multi_2", "2", 410, 330, 820, true, C.secondary)}${timelineRow("multi_3", "3", 510, 180, 900, false)}${timelineRow("multi_4", "4", 610, 470, 1040, true, C.secondary)}${line(180, 710, 1140, 710, C.deep, 2, true)}${txt(1140, 750, "Zeit", 18, 740, C.deep, "end")}`);
  const entry = group("multi_entry_exit", "Ein- und Austritt", `${sectionLabel(1240, 214, 540, "Ein- und Austritt variieren")}${multi(1240, 280, 540, "Objekte beginnen und beenden ihre Beobachtung zu unterschiedlichen Zeitpunkten.", 23, 720, C.deep)}`);
  const reasons = group("multi_reasons", "Zufällige Zensierungszeitpunkte", `${sectionLabel(1240, 492, 540, "Warum vorzeitig entfernt?")}${bulletList(1240, 558, 520, ["organisatorische Gründe", "technische Gründe", "wirtschaftliche Gründe"], { size: 21, gap: 64 })}`);
  const legend = bottomRule("multi_legend", "Status", "× AUSFALL  ·  → ZUFÄLLIG ZENSIERT  ·  ZEITPUNKTE LIEGEN ZWISCHEN AUSFÄLLEN", C.accent);
  return { body: axes + entry + reasons + legend, targets: [target("multi_censor_axes", "Beobachtungsfenster", ["Multiplen Zensierung", "unterschiedlichen Zeitpunkten"]), target("multi_entry_exit", "Ein- und Austritt", ["nicht gleichzeitig"]), target("multi_reasons", "Gründe", ["organisatorischen", "technischen", "wirtschaftlichen"]), target("multi_legend", "Zufällige Zensierung", ["zufälligen Zensierungszeitpunkten"])] };
}

function competingRows(mechanism, offset = 0) {
  const events = ["A", "B", "A", "B", "A", "B"];
  return events.map((event, index) => {
    const y = 370 + index * 72;
    const failure = event === mechanism;
    const color = event === "A" ? C.failure : C.educationAccent;
    const end = 610 + index * 34 + offset;
    return `${txt(150 + offset, y + 6, `Objekt ${index + 1}`, 18, 720, C.deep)}${line(280 + offset, y, end, y, C.border, 3)}${failure ? `${line(end - 12, y - 12, end + 12, y + 12, color, 4)}${line(end - 12, y + 12, end + 12, y - 12, color, 4)}` : `${line(end - 20, y - 14, end, y, C.secondary, 4)}${line(end - 20, y + 14, end, y, C.secondary, 4)}`}${txt(end + 34, y + 7, failure ? `${event}: Ausfall` : `${event}: zensiert`, 17, 760, failure ? color : C.secondary)}`;
  }).join("");
}

function buildCompetingRisks() {
  const source = group("competing_source", "Zwei Mechanismen", `${sectionLabel(92, 170, 1736, "Sechs Objekte · Ausfälle durch A oder B")}${txt(120, 242, "× A", 22, 850, C.failure)}${txt(230, 242, "× B", 22, 850, C.educationAccent)}`);
  const a = group("competing_a", "Analyse von A", `${rect(92, 268, 820, 500, C.surface, C.border, 1.5, 4)}${txt(130, 320, "ANALYSE A", 22, 850, C.failure)}${competingRows("A")}`);
  const b = group("competing_b", "Analyse von B", `${rect(1008, 268, 820, 500, C.surface, C.border, 1.5, 4)}${txt(1048, 320, "ANALYSE B", 22, 850, C.educationAccent)}${competingRows("B", 916)}`);
  const rule = bottomRule("competing_rule", "Reziproke Zensierung", "ANALYSE A: B ZENSIERT   ↔   ANALYSE B: A ZENSIERT", C.accent);
  return { body: source + a + b + rule, targets: [target("competing_source", "Mechanismen A und B", ["Ausfallmechanismus A", "Ausfallmechanismus B"]), target("competing_a", "A auswerten", ["Mechanismus A analysieren"]), target("competing_b", "B auswerten", ["umgekehrt", "Mechanismus B"]), target("competing_rule", "Wechselseitige Zensierung", ["als Zensierungszeitpunkte nutzen"])] };
}

function buildIntervalCensoring() {
  const windows = group("interval_windows", "Inspektionszeitpunkte", `${sectionLabel(92, 194, 1120, "Intervallzensierung")}${line(180, 510, 1220, 510, C.deep, 4, true)}${[300, 560, 820, 1080].map((x, index) => `${line(x, 444, x, 578, C.secondary, 2)}${txt(x, 620, `t${index}`, 19, 760, C.deep, "middle")}`).join("")}${rect(560, 444, 260, 134, C.surface, C.accent, 2, 2)}${txt(690, 498, "AUSFALL", 20, 850, C.accent, "middle")}${txt(690, 536, "irgendwo im Intervall", 20, 700, C.deep, "middle")}${txt(560, 394, "funktionsfähig", 20, 760, C.accent, "middle")}${txt(820, 394, "ausgefallen", 20, 760, C.failure, "middle")}`);
  const known = group("interval_known", "Bekannte Grenzen", calloutLine(1320, 244, 460, "Bekannt", "Untere und obere Intervallgrenze", C.accent));
  const unknown = group("interval_unknown", "Unbekannter Zeitpunkt", calloutLine(1320, 482, 460, "Unbekannt", "Exakter Ausfallzeitpunkt", C.secondary));
  const rule = bottomRule("interval_rule", "Beobachtungsauflösung", "INTERVALL = BEOBACHTUNGSAUFLÖSUNG  ·  NICHT AUTOMATISCH EIN EIGENER VERSUCHSTYP", C.accent);
  return { body: windows + known + unknown + rule, targets: [target("interval_windows", "Intervall", ["Intervallzensierung"]), target("interval_known", "Bekannte Grenzen", ["Zeitintervall"]), target("interval_unknown", "Unbekannter Zeitpunkt", ["nicht genau bekannt"]), target("interval_rule", "Intervall codieren", ["zwischen"])] };
}

function buildMlsMle() {
  const mlsPlot = `${line(1100, 650, 1710, 650, C.deep, 3, true)}${line(1100, 650, 1100, 326, C.deep, 3, true)}${[0, 1, 2, 3, 4, 5].map((index) => `<circle cx="${1160 + index * 92}" cy="${590 - index * 43 + (index % 2 ? 12 : -8)}" r="8" fill="${C.surface}" stroke="${C.failure}" stroke-width="3"/>`).join("")}${line(1150, 612, 1660, 360, C.accent, 4)}${txt(1405, 700, "Regressionsgerade im Weibullnetz", 19, 700, C.text, "middle")}`;
  const source = group("mls_panel", "MLS", `${sectionLabel(1040, 194, 740, "MLS · Methode der kleinsten Quadrate")}${multi(1040, 256, 740, "Abstände der Datenpunkte zur Geraden minimieren.", 22, 720, C.deep)}${mlsPlot}`);
  const mle = group("mle_panel", "MLE", `${sectionLabel(92, 194, 760, "MLE · Maximum-Likelihood-Methode")}${image("media/mls-mle-source.png", 92, 242, 760, 500, "Likelihood-Darstellung aus der Quellfolie")}${multi(92, 792, 760, "Nutzt Ausfälle und Zensierungsinformationen in der Likelihood.", 21, 720, C.deep)}`);
  const arrow = group("mls_mle_arrow", "Mehr Information", `${line(1000, 510, 850, 510, C.accent, 4, true)}${txt(925, 470, "mehr Information", 18, 780, C.accent, "middle")}`);
  const rule = bottomRule("mls_mle_rule", "Methodenregel", "MLS: EINFACH + ANSCHAULICH  ·  MLE: KOMPLEXER + SOFTWAREGESTÜTZT + ZENSIERUNGEN", C.accent);
  return { body: source + mle + arrow + rule, targets: [target("mls_panel", "MLS", ["MLS", "Least Square"]), target("mle_panel", "MLE", ["MLE", "Maximum-Likelihood"]), target("mls_mle_arrow", "Mehr Information", ["zensierte Daten"], "draw"), target("mls_mle_rule", "Methodenregel", ["Methode"])] };
}

function buildExerciseBikeSolution() {
  const context = group("bike_context", "Median-Rank-Ansatz", `${sectionLabel(92, 190, 500, "1 · Median Ranks")}${image("media/median-rank-formula.png", 92, 244, 500, 100, "Median-Rank-Formel")}${bulletList(92, 430, 500, ["Ausfallzeiten sortieren", "Ausfallwahrscheinlichkeiten bestimmen", "Punkte in das Weibullnetz übertragen"], { size: 22, gap: 74 })}`, false);
  const result = group("bike_result", "Weibull-Auswertung", `${sectionLabel(680, 190, 1148, "2 · Minitab-Auswertung")}${image("media/gear-fit.png", 680, 240, 1148, 570, "Weibull-Auswertung des Zahnrad-Grübchenversuchs")}`, false);
  const rule = bottomRule("bike_rule", "Lösungsweg", "DATEN → MEDIAN RANKS → FIT → FORMPARAMETER b + CHARAKTERISTISCHE LEBENSDAUER T", C.accent, false);
  return { body: context + result + rule, targets: [] };
}

function valueGrid(values, x, y, columns, cellWidth, rowHeight, options = {}) {
  return values.map((value, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const px = x + col * cellWidth;
    const py = y + row * rowHeight;
    return `${rect(px, py, cellWidth - 8, rowHeight - 8, options.fill || C.surface, options.stroke || C.border, 1.4, 3)}${txt(px + (cellWidth - 8) / 2, py + rowHeight / 2 + 5, value, options.size || 19, 760, options.color || C.deep, "middle")}`;
  }).join("");
}

function buildGearCase() {
  const context = group("gear_case_context", "Versuchsaufbau", `${sectionLabel(92, 174, 560, "Zahnrad-Grübchenversuch")}${txt(92, 246, "n = 10 Zahnräder", 26, 820, C.deep)}${txt(92, 296, "Flankenpressung  σH = 1.528 N/mm²", 24, 760, C.deep)}${multi(92, 370, 560, "Beobachtung: Lastwechsel bis zum Grübchenausfall", 22, 680, C.text)}`, false);
  const values = ["15,1", "12,2", "17,3", "14,3", "7,9", "18,2", "24,6", "13,5", "10,0", "30,5"];
  const data = group("gear_case_data", "Ausfallzeiten", `${sectionLabel(740, 174, 1088, "Ausfallzeiten · Mio. Lastwechsel")}${valueGrid(values, 740, 246, 5, 214, 92, { size: 23 })}`, false);
  const task = group("gear_case_task", "Arbeitsauftrag", `${line(92, 566, 1828, 566, C.border, 2)}${txt(92, 626, "ARBEITSAUFTRAG", 20, 850, C.accent)}${numberStep(92, 708, "01", "Daten sortieren", "aufsteigende Ausfallzeiten")}${numberStep(650, 708, "02", "Median Ranks", "F(tᵢ) bestimmen")}${numberStep(1208, 708, "03", "Weibull-Fit", "b und T ermitteln", C.educationAccent)}`, false);
  const rule = bottomRule("gear_case_rule", "Ziel", "BESTIMME DIE WEIBULLVERTEILUNG DER GRÜBCHENLEBENSDAUER", C.accent, false);
  return { body: context + data + task + rule, targets: [] };
}

function buildGearMedianRanks() {
  const times = ["7,9", "10,0", "12,2", "13,5", "14,3", "15,1", "17,3", "18,2", "24,6", "30,5"];
  const ranks = ["6,7 %", "16,3 %", "25,9 %", "35,6 %", "45,2 %", "54,8 %", "64,4 %", "74,1 %", "83,7 %", "93,3 %"];
  const formula = group("gear_rank_formula", "Median-Rank-Formel", `${sectionLabel(92, 176, 520, "1 · Median-Rank-Formel")}${image("media/median-rank-formula.png", 92, 242, 520, 110, "Median-Rank-Formel")}`, false);
  const sorted = group("gear_rank_sorted", "Sortierte Werte", `${sectionLabel(700, 176, 1128, "2 · Sortieren und zuordnen")}${txt(720, 244, "tᵢ [Mio. LW]", 19, 850, C.accent)}${txt(980, 244, "F(tᵢ)", 19, 850, C.accent)}${times.map((time, i) => `${txt(720 + (i >= 5 ? 530 : 0), 300 + (i % 5) * 86, `${String(i + 1).padStart(2, "0")}   ${time}`, 21, 760, C.deep)}${txt(980 + (i >= 5 ? 530 : 0), 300 + (i % 5) * 86, ranks[i], 21, 760, C.secondary)}`).join("")}`, false);
  const rule = bottomRule("gear_rank_rule", "Vollständige Punktbasis", "10 AUSFALLZEITEN  →  10 MEDIAN RANKS  →  10 PUNKTE IM WEIBULLNETZ", C.accent, false);
  return { body: formula + sorted + rule, targets: [] };
}

function buildGearFit() {
  const result = group("gear_fit_plot", "Weibull-Fit", `${image("media/gear-fit.png", 92, 140, 1320, 700, "Weibull-Auswertung des Zahnrad-Grübchenversuchs")}`, false);
  const read = group("gear_fit_read", "Parameter ablesen", `${sectionLabel(1460, 208, 340, "Ergebnis lesen")}${bulletList(1460, 286, 330, ["Steigung → b", "F = 63,2 % → T", "Geradheit prüfen", "Plausibilität bewerten"], { size: 21, gap: 82 })}`, false);
  const rule = bottomRule("gear_fit_rule", "Fit", "MEDIAN-RANK-PUNKTE → AUSGLEICHSGERADE → b UND T", C.accent, false);
  return { body: result + read + rule, targets: [] };
}

function buildExerciseOne() {
  const values = ["87.000", "80.000", "69.000", "66.000", "59.000", "100.000", "99.000", "98.000", "97.000", "90.000", "125.000", "118.000", "117.000", "109.000", "107.000", "186.000", "177.000", "158.000", "132.000", "126.000"];
  const context = group("exercise_one_context", "Prüfkontext", `${sectionLabel(92, 176, 560, "Wellenprüfung nach Maenning")}${bulletList(92, 248, 550, ["n = 20 Wellen", "Spannungsamplitude: 380 N/mm²", "wechselnde Zug-Druck-Schwingung"], { size: 21, gap: 70 })}`, false);
  const data = group("exercise_one_data", "Ausfallzeiten", `${sectionLabel(700, 176, 1128, "Ausfallzeiten · Lastwechsel")}${valueGrid(values, 700, 240, 5, 220, 72, { size: 18 })}`, false);
  const prompt = group("exercise_one_prompt", "Arbeitsauftrag", `${line(92, 596, 1828, 596, C.border, 2)}${sectionLabel(92, 652, 1736, "Arbeitsauftrag")}${numberStep(92, 744, "01", "Parameter", "b und T schätzen")}${numberStep(650, 744, "02", "Quantile", "B₁₀ und B₅ bestimmen")}${numberStep(1208, 744, "03", "Zuverlässigkeit", "R(50.000 LW) bestimmen", C.educationAccent)}`, false);
  const check = bottomRule("exercise_one_check", "Ergebniskontrolle", "VOLLSTÄNDIGE DATEN  ·  FIT  ·  b/T  ·  B₁₀/B₅  ·  R(50.000)", C.accent, false);
  return { body: context + data + prompt + check, targets: [] };
}

function buildConfidenceRepetition() {
  const plot = group("confidence_repeat_plot", "Median-Fit und Grenzen", image(plotHref("confidence.svg"), 92, 148, 1180, 690, "Weibull-Fit mit Vertrauensgrenzen"), false);
  const sequence = group("confidence_repeat_sequence", "Einordnung", `${sectionLabel(1320, 204, 500, "Was fehlt beim Median-Fit?")}${numberStep(1320, 300, "01", "Median-Fit", "zentrale Schätzung")}${numberStep(1320, 458, "02", "Unsicherheit", "50 % können früher ausfallen", C.failure)}${numberStep(1320, 640, "03", "Konservativ", "z. B. untere 90-%-Aussage", C.educationAccent)}`, false);
  const rule = bottomRule("confidence_repeat_rule", "Absicherung", "MEDIAN ≠ GARANTIE  ·  KONSERVATIVE VERTRAUENSGRENZE MITLESEN", C.failure, false);
  return { body: plot + sequence + rule, targets: [] };
}

function buildGearConfidenceResult() {
  const plot = group("gear_conf_plot", "Konfidenzergebnis", image("media/confidence-result.png", 92, 152, 1060, 660, "Konfidenzintervalle der Zahnrad-Auswertung"), false);
  const table = group("gear_conf_table", "Parameterintervalle", `${sectionLabel(1210, 194, 590, "90-%-Konfidenzintervall")}${txt(1230, 278, "Parameter", 18, 850, C.accent)}${txt(1430, 278, "Schätzwert", 18, 850, C.accent)}${txt(1600, 278, "SE", 18, 850, C.accent)}${txt(1730, 278, "90-%-KI", 18, 850, C.accent)}${line(1210, 302, 1820, 302, C.border, 2)}${txt(1230, 356, "Form b", 21, 760, C.deep)}${txt(1430, 356, "2,69218", 21, 760, C.deep)}${txt(1600, 356, "0,629417", 19, 700, C.text)}${txt(1730, 344, "1,83271 –", 18, 700, C.text)}${txt(1730, 374, "3,95472", 18, 700, C.text)}${line(1210, 408, 1820, 408, C.border, 1.5)}${txt(1230, 464, "Skala T", 21, 760, C.deep)}${txt(1430, 464, "18,4396", 21, 760, C.deep)}${txt(1600, 464, "2,29939", 19, 700, C.text)}${txt(1730, 452, "15,0202 –", 18, 700, C.text)}${txt(1730, 482, "22,6376", 18, 700, C.text)}${multi(1210, 590, 590, "Schätzwert und Unsicherheit gemeinsam berichten – nicht nur die zentrale Linie.", 23, 760, C.deep)}`, false);
  const rule = bottomRule("gear_conf_rule", "Vollständiger Ergebnisbericht", "PARAMETER  +  STANDARDFEHLER  +  KONFIDENZINTERVALL", C.accent, false);
  return { body: plot + table + rule, targets: [] };
}

function buildExerciseConfidence() {
  const plot = group("exercise_conf_plot", "Minitab-Ergebnis", image("media/confidence-result.png", 92, 160, 1230, 690, "Weibull-Ergebnis mit Vertrauensgrenzen"), false);
  const read = group("exercise_conf_read", "Ablesen", `${sectionLabel(1370, 222, 410, "Ablesen")}${bulletList(1370, 294, 400, ["Fit-Gerade", "5-%-Grenze", "95-%-Grenze", "Parameter"], { size: 22, gap: 72 })}`, false);
  const interpret = group("exercise_conf_interpret", "Interpretieren", `${sectionLabel(1370, 610, 410, "Interpretieren")}${multi(1370, 678, 400, "Welche Aussage ist abgesichert – und wo bleibt Unsicherheit?", 22, 720, C.deep)}`, false);
  const check = bottomRule("exercise_conf_check", "Kontrolle", "NICHT NUR DEN FIT LESEN  ·  VERTRAUENSGRENZEN MITINTERPRETIEREN", C.failure, false);
  return { body: plot + read + interpret + check, targets: [] };
}

function buildExerciseTwo() {
  const values = ["12.800", "24.000", "29.000", "52.500", "60.000", "69.000", "98.000", "128.000"];
  const photo = group("exercise_two_photo", "Wellentest", `${image("media/exercise-two-photo.jpg", 92, 180, 610, 520, "Bauteil des Wellentests")}${txt(397, 758, "8 VOLLSTÄNDIGE AUSFÄLLE", 22, 850, C.accent, "middle")}`, false);
  const prompt = group("exercise_two_prompt", "Arbeitsauftrag", `${sectionLabel(790, 176, 1038, "Übung 2 · Wellentest")}${txt(790, 238, "Ausfallwege [km]", 19, 850, C.accent)}${valueGrid(values, 790, 266, 4, 250, 76, { size: 20 })}${bulletList(790, 456, 980, ["Schätzungen und Vertrauensbereiche für b und T", "B₂-Lebensdauer mit 90 % Sicherheit", "Überlebenswahrscheinlichkeit bei 70.000 km"], { size: 22, gap: 96 })}`, false);
  const check = bottomRule("exercise_two_check", "Ergebniskontrolle", "FIT UND VERTRAUENSGRENZEN GEMEINSAM LESEN", C.accent, false);
  return { body: photo + prompt + check, targets: [] };
}

function scopeRail(active, animatedIds = []) {
  const labels = ["Introduction", "Classification of Life Datasets", "Evaluation of Different Life Datasets", "Special Aspects and Pitfalls"];
  const icons = [null, ["media/pictogram-database.png", "Lebensdauerdaten"], ["media/pictogram-list-check.png", "Auswertung"], ["media/pictogram-search.png", "Sonderfälle prüfen"]];
  return `${line(180, 470, 1740, 470, C.border, 6)}${labels.map((label, index) => {
    const x = 210 + index * 500;
    const current = index === active;
    const id = animatedIds[index];
    const icon = icons[index] ? pictogram(icons[index][0], x - 46, 326, 92, icons[index][1]) : "";
    const body = `${icon}${rect(x - 29, 441, 58, 58, current ? C.educationAccent : C.accent, "none", 0, 29)}${txt(x, 479, String(index + 1), 19, 850, C.surface, "middle")}${multi(x, 548, 360, label, 22, current ? 820 : 680, current ? C.educationAccent : C.deep, "middle")}`;
    return id ? group(id, label, body) : body;
  }).join("")}`;
}

function buildExerciseTransition() {
  const body = `${sectionLabel(92, 194, 1708, "Scope")}${scopeRail(2)}${txt(960, 760, "Datensätze  →  Auswertung  →  Sonderfälle kritisch prüfen", 27, 800, C.accent, "middle")}`;
  return { body, targets: [] };
}

function buildExerciseCensoringCompare() {
  const i = group("exercise_censor_i", "Typ I", `${sectionLabel(92, 194, 760, "Typ I · Versuchsstopp nach vorgegebener Zeit")}${image("media/type-i-source.png", 92, 258, 760, 420, "Typ-I-Beispiel")}${multi(92, 738, 760, "Anzahl r der Ausfälle ist eine Zufallsgröße.", 22, 740, C.deep)}`, false);
  const ii = group("exercise_censor_ii", "Typ II", `${sectionLabel(1010, 194, 770, "Typ II · Versuchsstopp nach r Ausfällen")}${image("media/type-ii-source.png", 1010, 258, 770, 420, "Typ-II-Beispiel")}${multi(1010, 738, 770, "Versuchsende tᵣ ist eine Zufallsgröße.", 22, 740, C.deep)}`, false);
  const status = group("exercise_censor_status", "Statuscodierung", `${image("media/censoring-status.png", 720, 820, 480, 90, "Statuscodes für Ausfall und Zensierung")}`, false);
  return { body: i + ii + status, targets: [] };
}

function buildExerciseCensoringExample() {
  const source = group("exercise_censor_example", "Versuchsbeispiel", image("media/censoring-example.png", 92, 160, 1210, 690, "Beispiel eines rechtszensierten Datensatzes"), false);
  const identify = group("exercise_censor_identify", "Erkennen", `${sectionLabel(1370, 230, 410, "1 · Erkennen")}${multi(1370, 298, 400, "Ist die Prüfzeit oder die Zahl der Ausfälle fest?", 23, 720, C.deep)}`, false);
  const code = group("exercise_censor_code", "Codieren", `${sectionLabel(1370, 498, 410, "2 · Codieren")}${multi(1370, 566, 400, "Zeit plus Status für jedes Objekt erfassen.", 23, 720, C.deep)}`, false);
  const rule = bottomRule("exercise_censor_rule", "Kontrolle", "FESTE GRENZE → ZENSIERUNGSTYP → STATUSCODIERUNG", C.accent, false);
  return { body: source + identify + code + rule, targets: [] };
}

function buildExerciseThree() {
  const source = group("exercise_three_source", "Übungsunterlage", image("media/exercise-three.jpg", 92, 150, 1210, 710, "Unterlage der dritten Übung"), false);
  const task = group("exercise_three_task", "Aufgabe", `${sectionLabel(1370, 222, 410, "Arbeitsweg")}${bulletList(1370, 298, 400, ["Zensierungsart bestimmen", "Zeit und Status codieren", "Weibull-Auswertung durchführen"], { size: 22, gap: 86 })}`, false);
  const result = group("exercise_three_result", "Ergebnis", `${sectionLabel(1370, 626, 410, "Ergebnis prüfen", C.failure)}${multi(1370, 694, 400, "Parameter, Vertrauensgrenzen und Plausibilität gemeinsam beurteilen.", 21, 720, C.deep)}`, false);
  const check = bottomRule("exercise_three_check", "Plausibilität", "PLAUSIBILITÄT VOR ZAHLEN", C.failure, false);
  return { body: source + task + result + check, targets: [] };
}

function buildExerciseExtrapolation() {
  const plot = group("exercise_extrapolation_plot", "Weibull-Ergebnis", image("media/exercise-three.jpg", 92, 146, 1260, 700, "Weibull-Auswertung mit großem Extrapolationsbereich"), false);
  const diagnosis = group("exercise_extrapolation_diagnosis", "Diagnose", `${sectionLabel(1410, 206, 390, "Diagnose", C.failure)}${bulletList(1410, 286, 380, ["wenige frühe Ausfälle", "viele späte Suspensionen", "großer ungestützter Bereich", "Prognose stark extrapoliert"], { color: C.failure, size: 21, gap: 78 })}`, false);
  const rule = bottomRule("exercise_extrapolation_rule", "Warnsignal", "VIELE SUSPENSIONEN  →  GROSSER EXTRAPOLATIONSBEREICH  →  UNSICHERE PROGNOSE", C.failure, false);
  return { body: plot + diagnosis + rule, targets: [] };
}

function buildExerciseThreeDataset() {
  const failures = ["12.367", "21.431", "28.527", "30.422", "34.576", "35.966", "36.969", "37.512"];
  const data = group("exercise_three_failures", "Acht Ausfälle", `${sectionLabel(92, 174, 820, "8 Ausfälle · Lastwechsel")}${valueGrid(failures, 92, 242, 4, 200, 78, { size: 20, stroke: C.failure })}`, false);
  const suspensions = group("exercise_three_suspensions", "Zwölf Suspensionen", `${sectionLabel(1010, 174, 790, "12 Suspensionen")}${txt(1010, 264, "12 × 40.000 Lastwechsel", 30, 850, C.secondary)}${multi(1010, 330, 750, "Alle zwölf Prüflinge waren beim Abbruch noch funktionsfähig.", 23, 720, C.deep)}`, false);
  const compare = group("exercise_three_compare", "Vergleichsauftrag", `${line(92, 486, 1828, 486, C.border, 2)}${sectionLabel(92, 548, 1736, "Vergleiche zwei Auswertungen")}${numberStep(92, 642, "01", "Nur Ausfälle", "acht Werte fitten")}${numberStep(650, 642, "02", "Mit Suspensionen", "8 Ausfälle + 12 zensierte Werte", C.secondary)}${numberStep(1208, 642, "03", "Erklären", "Unterschiede in Fit und Prognose", C.educationAccent)}`, false);
  const rule = bottomRule("exercise_three_dataset_rule", "Informationsregel", "SUSPENSIONEN SIND KEINE FEHLENDEN DATEN – SIE TRAGEN ÜBERLEBENSINFORMATION", C.accent, false);
  return { body: data + suspensions + compare + rule, targets: [] };
}

function buildSpecialCasesTransition() {
  const completed = group("special_completed", "Grundlagen", `${pictogram("media/pictogram-list-check.png", 244, 206, 112, "abgeschlossene Grundlagen")}${txt(300, 356, "GRUNDLAGEN", 22, 850, C.accent, "middle")}${multi(300, 418, 430, "Vollständige und rechtszensierte Daten auswerten", 25, 760, C.deep, "middle")}`);
  const next = group("special_next", "Sonderfälle", `${pictogram("media/pictogram-search.png", 1394, 206, 112, "Sonderfälle untersuchen")}${txt(1450, 356, "SONDERFÄLLE", 22, 850, C.educationAccent, "middle")}${multi(1450, 418, 460, "3-Parameter-Weibull · mehrere Ausfallmechanismen", 25, 760, C.deep, "middle")}`);
  const arrow = group("special_transition_arrow", "Übergang", `${line(560, 474, 1180, 474, C.accent, 6, true)}${txt(870, 432, "kritisch weiterdenken", 20, 780, C.accent, "middle")}`);
  const rule = bottomRule("special_transition_rule", "Ausblick", "SONDERFÄLLE UND STOLPERSTEINE DER PRAKTISCHEN AUSWERTUNG", C.accent);
  return { body: completed + next + arrow + rule, targets: [target("special_completed", "Grundlagen", ["Übungen", "abgeschlossen"]), target("special_next", "Sonderfälle", ["Sonderfälle"]), target("special_transition_arrow", "Übergang", ["nächsten Schritt"], "draw"), target("special_transition_rule", "Kritische Prüfung", ["Praxis"])] };
}

function buildThreeParameterSelect() {
  const plot = group("three_select_plot", "Gekrümmter Verlauf", `${sectionLabel(92, 150, 1030, "Beobachtung im Weibullnetz")}${image("plots/three-parameter-weibull.svg", 70, 190, 1080, 660, "Gekrümmter Verlauf im Weibull-Wahrscheinlichkeitsnetz")}`);
  const question = group("three_select_question", "Drei-Parameter-Modell prüfen", `${sectionLabel(1240, 206, 540, "Was zeigt die Krümmung?", C.educationAccent)}${multi(1240, 286, 520, "Die Daten folgen im Zweiparameter-Netz keiner Geraden.", 27, 780, C.deep)}${line(1240, 426, 1740, 426, C.border, 2)}${multi(1240, 486, 520, "Ist die 3-Parameter-Weibullverteilung besser geeignet?", 30, 850, C.accent)}`);
  const choice = group("three_select_choice", "Minitab-Auswahl", `${sectionLabel(1240, 656, 540, "In Minitab auswählen")}${rect(1240, 712, 540, 124, C.surfaceSoft, C.border, 2, 3)}${txt(1272, 752, "ANGENOMMENE VERTEILUNG", 18, 820, C.muted)}${rect(1272, 776, 476, 42, C.surface, C.educationAccent, 3, 2)}${txt(1292, 805, "Weibull mit 3 Parametern", 22, 800, C.deep)}${pathLine("M 1714 790 l 10 10 l 10 -10", C.educationAccent, 3)}${bottomRule("three_select_rule", "Prüfauftrag", "KRÜMMUNG ERKENNEN  →  DREI-PARAMETER-MODELL GEZIELT PRÜFEN", C.accent, false)}`);
  return {
    body: plot + question + choice,
    targets: [
      target("three_select_plot", "Gekrümmter Verlauf", ["gekrümmte Kurve"]),
      target("three_select_question", "Drei-Parameter-Modell prüfen", ["deutlicher Hinweis"]),
      target("three_select_choice", "Minitab-Auswahl", ["dreiparametrige Weibull-Verteilung wählen"]),
    ],
  };
}

function buildThreeParameterInterpret() {
  const tableRows = [
    ["Form", "2,99231", "1,05145", "1,50282", "5,95806"],
    ["Skala", "35.255,4", "10.251,9", "19.939,1", "62.337,2"],
    ["Schwellenwert", "20.008,5", "9.308,67", "1.763,79", "38.253,1"],
  ];
  const columns = [902, 1135, 1325, 1535, 1740];
  const table = `${rect(850, 184, 978, 330, C.surface, C.border, 2, 3)}${txt(884, 226, "PARAMETERSCHÄTZWERTE", 20, 850, C.accent)}${txt(1638, 226, "95-%-KI", 18, 780, C.muted, "middle")}${["Parameter", "Schätzwert", "Standardfehler", "Untergrenze", "Obergrenze"].map((label, index) => txt(columns[index], 278, label, 18, 760, C.deep, index ? "middle" : "start")).join("")}${line(878, 298, 1800, 298, C.border, 2)}${tableRows.map((row, rowIndex) => {
    const y = 348 + rowIndex * 72;
    const highlight = rowIndex === 2 ? rect(872, y - 36, 928, 54, C.surface, C.educationAccent, 3, 2) : "";
    return `${highlight}${row.map((value, index) => txt(columns[index], y, value, index === 0 ? 20 : 19, rowIndex === 2 ? 850 : 680, rowIndex === 2 ? C.educationAccent : C.text, index ? "middle" : "start")).join("")}`;
  }).join("")}`;
  const estimate = group("three_estimate_table", "Parameterschätzwerte", `${image("plots/three-parameter-weibull.svg", 72, 150, 700, 510, "Drei-Parameter-Weibullnetz mit Schwellenwert")}${table}`);
  const meaning = group("three_estimate_meaning", "Bedeutung des Schwellenwerts", `${sectionLabel(92, 708, 790, "Was bedeutet t₀?")}${txt(92, 778, "t₀", 48, 900, C.accent)}${multi(188, 762, 650, "Ausfallfreie Zeit: Vor diesem Zeitpunkt sagt das Modell keine Ausfälle voraus.", 25, 780, C.deep)}`);
  const warning = group("three_estimate_warning", "Negativen Schwellenwert prüfen", `${sectionLabel(1010, 632, 790, "Plausibilitätscheck", C.failure)}${rect(1010, 704, 320, 92, C.surface, C.failure, 3, 3)}${txt(1170, 765, "t₀ = −1374", 36, 900, C.failure, "middle")}${multi(1390, 722, 390, "physikalisch nicht sinnvoll", 25, 850, C.failure)}${multi(1390, 774, 390, "→ Stichprobe überprüfen", 23, 780, C.deep)}${bottomRule("three_estimate_rule", "Plausibilität vor Fit", "RECHNERISCHER FIT  ≠  PHYSIKALISCH SINNVOLLES MODELL", C.failure, false)}`);
  return {
    body: estimate + meaning + warning,
    targets: [
      target("three_estimate_table", "Dritter Parameterschätzwert", ["ein dritter Wert"]),
      target("three_estimate_meaning", "Ausfallfreie Zeit", ["Dieser Schwellenwert beschreibt"]),
      target("three_estimate_warning", "Negativer Schwellenwert", ["negativen Schwellenwert"]),
    ],
  };
}

function buildThreeParameterRules() {
  const row = (id, label, y, headline, body) => group(id, label, `${circleWithCheck(126, y - 10)}${txt(190, y, headline, 28, 840, C.deep)}${multi(190, y + 42, 1280, body, 21, 660, C.text)}${line(190, y + 104, 1780, y + 104, C.border, 1.5)}`);
  const first = row("three_rule_1", "Begründbare ausfallfreie Zeit", 258, "Ausfallfreie Zeit begründbar", "physikalisch plausibel und statistisch nachvollziehbar");
  const second = row("three_rule_2", "Konkaver Verlauf", 416, "Deutlich konkaver Verlauf", "die Krümmung im Zweiparameter-Weibullnetz ist klar erkennbar");
  const third = row("three_rule_3", "Große Stichprobe", 574, "Ausreichend großer Stichprobenumfang", "der zusätzliche Parameter benötigt eine belastbare Datenbasis");
  const fallback = group("three_rule_fallback", "Bei Unsicherheit zwei Parameter", `${sectionLabel(92, 762, 1688, "Bei Unsicherheit")}${txt(92, 836, "2-PARAMETER-WEIBULL", 25, 900, C.accent)}${txt(475, 836, "konservativer Ansatz", 23, 760, C.deep)}${line(770, 827, 900, 827, C.accent, 4, true)}${txt(950, 836, "modelliert Ausfälle ab t = 0", 23, 760, C.deep)}`);
  return { body: `${sectionLabel(92, 156, 1688, "3-Parameter-Weibull nur einsetzen, wenn")}${first}${second}${third}${fallback}`, targets: [target("three_rule_1", "Begründbare ausfallfreie Zeit", ["physikalisch begründbare"]), target("three_rule_2", "Konkaver Verlauf", ["deutlich konkav"]), target("three_rule_3", "Stichprobenumfang", ["ausreichend großen Stichprobenumfang"]), target("three_rule_fallback", "Konservative Alternative", ["folgende Faustregel"])] };
}

function buildBrakeExample() {
  const context = group("brake_context", "Bremsanlage und Daten", `${image("media/brake-large.jpg", 92, 160, 600, 380, "Betriebsbremsanlage")}${sectionLabel(92, 590, 600, "30 Prüflinge bis zum Ausfall")}${image("media/brake-data.png", 92, 650, 600, 160, "Ausfallzeiten der Bremshebel")}`, false);
  const result = group("brake_result", "Lebensdauerauswertung", `${image("media/brake-result.png", 760, 150, 1068, 650, "Lebensdauerauswertung mit zwei und drei Parametern")}${txt(1294, 828, "SOGAR MIT 30 PRÜFLINGEN KANN KEIN NACHWEIS ERFOLGEN", 22, 850, C.failure, "middle")}`);
  const rule = bottomRule("brake_rule", "Stichprobe reicht nicht automatisch", "STICHPROBENGRÖSSE ≠ NACHWEISSICHERHEIT", C.accent);
  return { body: context + result + rule, targets: [target("brake_result", "Auswertung", ["negativen Schwellenwert"]), target("brake_rule", "Unsicherheit", ["kleine Stichprobe"])] };
}

function buildBrakeCase() {
  const imageBlock = group("brake_case_image", "Betriebsbremse", image("media/brake-small.png", 92, 174, 700, 560, "Sicherheitskritische Betriebsbremse eines LKW"), false);
  const context = group("brake_case_context", "Fragestellung", `${sectionLabel(900, 194, 880, "Anwendungsfall")}${bulletList(900, 278, 840, ["System: LKW-Betriebsbremse", "kritische Komponente: Bremshebel", "Versagen: strukturell-mechanischer Bruch", "sicherheitskritische Funktion"], { size: 24, gap: 86 })}${sectionLabel(900, 672, 880, "Prüffrage", C.educationAccent)}${multi(900, 738, 840, "Lässt sich eine physikalisch plausible ausfallfreie Zeit t₀ nachweisen?", 27, 820, C.deep)}`, false);
  const rule = bottomRule("brake_case_rule", "Nachweisziel", "AUSFALLFREIE ZEIT NICHT ANNEHMEN – MIT DATEN UND GRENZEN NACHWEISEN", C.accent, false);
  return { body: imageBlock + context + rule, targets: [] };
}

function buildBrakeSample() {
  const photo = group("brake_sample_photo", "Bremsanlage", image("media/brake-large.jpg", 92, 156, 640, 590, "Bremsanlage und Bremshebel"), false);
  const data = group("brake_sample_data", "30 Ausfallzeiten", `${sectionLabel(810, 176, 990, "30 Prüflinge · vollständige Ausfallzeiten")}${image("media/brake-data.png", 810, 246, 990, 420, "Dreißig Ausfallzeiten der Bremshebel")}${multi(810, 726, 990, "Hoher Stichprobenumfang stärkt die Schätzung – garantiert aber noch keinen t₀-Nachweis.", 21, 780, C.deep)}`, false);
  const rule = bottomRule("brake_sample_rule", "Prüfschritt", "n = 30  ≠  AUTOMATISCHER NACHWEIS EINER AUSFALLFREIEN ZEIT", C.failure, false);
  return { body: photo + data + rule, targets: [] };
}

function buildBrakeResult() {
  const result = group("brake_result_plot", "Lebensdauerauswertung", image("media/brake-result.png", 92, 142, 1320, 710, "Lebensdauerauswertung der Bremshebel"), false);
  const verdict = group("brake_result_verdict", "Kein Nachweis", `${sectionLabel(1470, 208, 330, "Befund", C.failure)}${txt(1470, 300, "30", 62, 900, C.accent)}${txt(1570, 300, "Ausfälle", 25, 780, C.deep)}${multi(1470, 400, 330, "Trotz der Stichprobe ist t₀ statistisch nicht belastbar abgesichert.", 24, 800, C.deep)}${multi(1470, 604, 330, "Konservativ: 2-Parameter-Weibull verwenden.", 23, 780, C.educationAccent)}`, false);
  const rule = bottomRule("brake_result_rule", "Schlussfolgerung", "KEIN BELASTBARER t₀-NACHWEIS – TROTZ 30 PRÜFLINGEN", C.failure, false);
  return { body: result + verdict + rule, targets: [] };
}

function buildThreeParameterCompare() {
  const comparison = group("three_compare_plot", "Zwei- und Drei-Parameter-Modell", image("media/three-parameter-compare.jpg", 92, 138, 1300, 720, "Vergleich der zwei- und dreiparametrigen Weibullverteilung"), false);
  const check = group("three_compare_check", "Entscheidung offen", `${sectionLabel(1450, 208, 350, "Einordnung")}${bulletList(1450, 284, 340, ["beide Fits betrachten", "t₀ physikalisch prüfen", "Konfidenzgrenzen lesen", "Differenzierung nicht eindeutig"], { size: 20, gap: 80 })}`, false);
  const rule = bottomRule("three_compare_rule", "Modellwahl", "OPTISCH BESSERER FIT ALLEIN ENTSCHEIDET NICHT", C.accent, false);
  return { body: comparison + check + rule, targets: [] };
}

function buildNegativeThreshold() {
  const plot = group("negative_threshold_plot", "Negativer Schwellenwert", image("media/negative-threshold.png", 92, 148, 1230, 690, "Auswertung mit negativem Schwellenwert"), false);
  const verdict = group("negative_threshold_verdict", "Physikalische Prüfung", `${sectionLabel(1380, 210, 410, "Warnsignal", C.failure)}${txt(1380, 318, "t₀ < 0", 52, 900, C.failure)}${bulletList(1380, 412, 400, ["physikalisch nicht sinnvoll", "rechnerischer Fit reicht nicht", "möglicherweise zu wenig Daten"], { color: C.failure, size: 21, gap: 80 })}`, false);
  const rule = bottomRule("negative_threshold_rule", "Plausibilität", "NEGATIVER SCHWELLENWERT  →  MODELLINTERPRETATION VERWERFEN", C.failure, false);
  return { body: plot + verdict + rule, targets: [] };
}

function buildThresholdConfidence() {
  const bounds = group("threshold_confidence_plot", "Konfidenzgrenzen", image("media/confidence-check.png", 92, 150, 1040, 690, "Konfidenzgrenzen des Schwellenwerts"), false);
  const table = group("threshold_confidence_table", "Parameterschätzung", `${sectionLabel(1190, 198, 610, "Parameterschätzung")}${image("media/parameter-table.jpg", 1190, 266, 610, 210, "Parameterschätzung der Drei-Parameter-Auswertung")}${sectionLabel(1190, 562, 610, "Achtung", C.failure)}${multi(1190, 632, 600, "Die dargestellten Werte sind Medianwerte. Breite Konfidenzgrenzen können t₀ = 0 weiterhin einschließen.", 24, 800, C.deep)}`, false);
  const rule = bottomRule("threshold_confidence_rule", "Nachweis", "MEDIANWERT ALLEIN ≠ NACHWEIS  ·  KONFIDENZGRENZEN ENTSCHEIDEN", C.failure, false);
  return { body: bounds + table + rule, targets: [] };
}

function buildThreeParameterChallenge() {
  const negative = group("three_challenge_negative", "Negativer Schwellenwert", `${sectionLabel(92, 190, 760, "1 · Sinnhaftigkeit prüfen", C.failure)}${image("media/negative-threshold.png", 92, 250, 760, 360, "Ergebnis mit negativem Schwellenwert")}${bulletList(92, 680, 760, ["Negative ausfallfreie Zeiten sind nicht erklärbar", "Gute Korrelation kann physikalisch sinnlos sein"], { color: C.failure, size: 21, gap: 70 })}`);
  const confidence = group("three_challenge_confidence", "Vertrauensbereiche", `${sectionLabel(1010, 190, 770, "2 · Vertrauensbereiche berücksichtigen")}${image("media/confidence-check.png", 1010, 250, 770, 360, "Vertrauensbereich des Schwellenwerts")}${image("media/parameter-table.jpg", 1210, 642, 380, 116, "Parameterschätzung")}${txt(1395, 808, "Achtung: Medianwerte!", 22, 850, C.failure, "middle")}`);
  const rule = bottomRule("three_challenge_rule", "Plausibilität vor Fit", "RECHNERISCH BESSER ≠ PHYSIKALISCH SINNVOLL", C.failure);
  return { body: negative + confidence + rule, targets: [target("three_challenge_negative", "Negatives t null", ["negativen Schwellenwert"]), target("three_challenge_confidence", "Vertrauensbereich", ["Stichprobe", "Unsicherheit"]), target("three_challenge_rule", "Plausibilitätsregel", ["physikalisch nicht sinnvoll"])] };
}

function buildMultipleModesTransition() {
  const joint = group("modes_transition_joint", "Gemeinsamer Fit", `${pictogram("media/pictogram-database.png", 92, 186, 104, "gemeinsamer Datensatz")}${sectionLabel(224, 236, 488, "Alle Ausfälle gemeinsam")}${multi(224, 306, 488, "Eine Gerade soll unterschiedliche Mechanismen beschreiben.", 27, 760, C.deep)}`);
  const split = group("modes_transition_split", "Separate Fits", `${pictogram("media/pictogram-settings.png", 1120, 186, 104, "Ausfallmechanismen")}${sectionLabel(1252, 236, 528, "Ein Fit je Mechanismus", C.educationAccent)}${multi(1252, 306, 528, "Jeder Mechanismus erhält seine eigene Weibull-Verteilung.", 27, 760, C.deep)}`);
  const arrow = group("modes_transition_arrow", "Trennen", `${line(650, 500, 1080, 500, C.accent, 6, true)}${txt(865, 456, "Mechanismen trennen", 22, 820, C.accent, "middle")}`);
  const signal = bottomRule("modes_transition_signal", "Knick als Signal", "KNICK ODER MEHRERE GERADEN  →  TRENNUNG PRÜFEN", C.failure);
  return { body: joint + split + arrow + signal, targets: [target("modes_transition_joint", "Gemeinsamer Fit", ["Liste von Ausfallzeiten"]), target("modes_transition_signal", "Knick", ["mehrere Geraden"]), target("modes_transition_arrow", "Trennen", ["getrennt"], "draw"), target("modes_transition_split", "Separate Fits", ["separat analysiert"])] };
}

function buildMultipleModes() {
  const photo = group("multiple_modes_photo", "Bauteil mit mehreren Ausfallmechanismen", `${sectionLabel(1260, 150, 520, "Beispiel · Kupplung")}${image("media/common-poor-fit.jpg", 1260, 198, 520, 224, "Kupplungsbaugruppe mit mehreren möglichen Ausfallmechanismen")}`);
  const jointPlot = group("multiple_modes_joint_plot", "Gemeinsame Weibull-Auswertung", `${sectionLabel(92, 150, 1030, "Alle Ausfälle gemeinsam")}${image("plots/multiple-mechanisms-joint.svg", 70, 190, 1080, 650, "Gemeinsamer Weibull-Fit über zwei Ausfallmechanismen")}`);
  const diagnosis = group("multiple_modes_diagnosis", "Schlechter gemeinsamer Fit", `${sectionLabel(1260, 474, 520, "Befund", C.failure)}${bulletList(1260, 542, 510, ["eine Gerade passt schlecht", "Fit ist unzureichend", "Prognosen werden ungenau"], { color: C.failure, size: 22, gap: 76 })}`);
  const splitPlot = group("multiple_modes_split_plot", "Getrennte Weibull-Geraden", `${rect(70, 128, 1080, 728, C.surface)}${sectionLabel(92, 150, 1030, "Ausfallmechanismen getrennt")}${image("plots/multiple-mechanisms-split.svg", 70, 190, 1080, 650, "Getrennte Weibull-Fits für Ausfallmechanismus A und B")}`);
  const action = group("multiple_modes_action", "Separate Analyse", `${rect(1230, 440, 580, 270, C.surface)}${sectionLabel(1260, 474, 520, "Konsequenz", C.educationAccent)}${bulletList(1260, 542, 510, ["nach Mechanismen trennen", "jeweils separat analysieren"], { color: C.educationAccent, size: 22, gap: 82 })}`);
  const result = group("multiple_modes_result", "Eigener Fit je Mechanismus", `${line(1260, 678, 1780, 678, C.border, 2)}${txt(1260, 724, "JE MECHANISMUS", 18, 850, C.accent)}${txt(1260, 772, "eine eigene Weibull-Verteilung", 25, 820, C.deep)}${txt(1260, 818, "→ präzisere Beschreibung und bessere Prognose", 21, 760, C.educationAccent)}`);
  const rule = bottomRule("multiple_modes_rule", "Merksatz", "UNTERSCHIEDLICHE AUSFALLMECHANISMEN IMMER GETRENNT AUSWERTEN", C.accent);
  return {
    body: photo + jointPlot + diagnosis + splitPlot + action + result + rule,
    targets: [
      target("multiple_modes_photo", "Beispiel", ["folgenden Beispiel"]),
      target("multiple_modes_joint_plot", "Gemeinsame Weibull-Auswertung", ["gemeinsam in einer Weibull-Grafik"]),
      target("multiple_modes_diagnosis", "Schlechter gemeinsamer Fit", ["Fit ist schlecht"]),
      target("multiple_modes_split_plot", "Mehrere Geraden", ["mehrere Geraden beschreiben"]),
      target("multiple_modes_action", "Separate Analyse", ["getrennt und jeweils separat"]),
      target("multiple_modes_result", "Eigener Fit je Mechanismus", ["eigene Weibull-Verteilung"]),
      target("multiple_modes_rule", "Merksatz", ["Also Merke dir"]),
    ],
  };
}

function buildExerciseFour() {
  const context = group("exercise_four_context", "Zapfluftsystem eines US-Kampfjets", `${image("media/jet.jpg", 92, 170, 590, 420, "US-Kampfjet")}${sectionLabel(92, 644, 590, "Datengrundlage")}${bulletList(92, 714, 590, ["Forderung: minimale Lebensdauer 10.000 h", "stationiert an 6 Luftwaffenstützpunkten", "2.256 Felddaten · 19 Ausfälle"], { size: 20, gap: 58 })}`, false);
  const prompt = group("exercise_four_prompt", "Arbeitsauftrag", `${sectionLabel(780, 190, 1000, "Übung · Zapfluftsystem")}${bulletList(780, 286, 980, ["1. F(10.000 h) mit allen Daten schätzen", "2. F(10.000 h) mit separierten Fehlermechanismen schätzen", "3. Ergebnisse vergleichen", "4. Maßnahmen zur Sicherstellung der Zuverlässigkeit ableiten"], { size: 24, gap: 104 })}`, false);
  const check = bottomRule("exercise_four_check", "Mechanismen prüfen", "DATEN IN EXCEL  ·  GEMEINSAMER FIT  ·  GETRENNTE FITS  ·  MASSNAHME", C.accent, false);
  return { body: context + prompt + check, targets: [] };
}

function buildMultipleModesResult() {
  const joint = group("modes_result_joint", "Analyse aller Ausfalldaten", `${sectionLabel(92, 170, 560, "Analyse aller Ausfalldaten", C.failure)}${bulletList(92, 238, 540, ["T = 37.790 h; b = 1,31", "B₁₀ = 6.840 h", "Knick der Datenpunkte → verschiedene Ausfallmechanismen"], { size: 21, gap: 72 })}${image("media/joint-fit.png", 92, 480, 560, 330, "Gemeinsamer Weibull-Fit")}`);
  const split = group("modes_result_split", "Separate Datenanalyse", `${sectionLabel(720, 170, 1060, "Separate Datenanalyse")}${image("media/result-a.png", 720, 226, 500, 330, "Airbase D")}${image("media/result-b.png", 1280, 226, 500, 330, "Other Airbases")}${txt(970, 594, "AIRBASE D", 20, 850, C.accent, "middle")}${txt(1530, 594, "OTHER AIRBASES", 20, 850, C.accent, "middle")}${bulletList(720, 648, 500, ["T = 13.555 h; b = 2,21", "B₁₀ = 4.904 h", "↳ Verschleißausfall", "↳ Ursache: Korrosion am Meer"], { size: 18, gap: 48, nested: true })}${bulletList(1280, 648, 500, ["T = 482.975 h; b = 0,88", "B₁₀ = 37.241 h", "↳ Zufallsausfall", "↳ Ursache: Defekt oder Installation"], { size: 18, gap: 48, nested: true })}`);
  const rule = bottomRule("modes_result_rule", "Schlussfolgerung", "TRENNUNG MACHT UNTERSCHIEDLICHE URSACHEN UND MASSNAHMEN SICHTBAR", C.accent);
  return { body: joint + split + rule, targets: [target("modes_result_joint", "Gemeinsamer Fit", ["gemeinsam"]), target("modes_result_split", "Getrennte Fits", ["getrennt", "separat"]), target("modes_result_rule", "Bessere Prognose", ["präzisere Beschreibung", "bessere Prognose"])] };
}

function buildMultipleModesJoint() {
  const plot = group("modes_joint_plot", "Gemeinsamer Fit", image("media/joint-fit.png", 92, 142, 1210, 710, "Analyse aller Ausfalldaten"), false);
  const result = group("modes_joint_result", "Kennwerte", `${sectionLabel(1360, 202, 430, "Analyse aller Daten", C.failure)}${txt(1360, 292, "T = 37.790 h", 27, 840, C.deep)}${txt(1360, 354, "b = 1,31", 27, 840, C.deep)}${txt(1360, 416, "B₁₀ = 6.840 h", 27, 840, C.failure)}${line(1360, 470, 1780, 470, C.border, 2)}${multi(1360, 530, 420, "B₁₀ liegt unter der Forderung von 10.000 h.", 24, 800, C.deep)}${multi(1360, 674, 420, "Knick der Datenpunkte: verschiedene Mechanismen vermutet.", 22, 760, C.failure)}`, false);
  const rule = bottomRule("modes_joint_rule", "Diagnose", "GEMEINSAMER FIT VERDECKT UNTERSCHIEDLICHE AUSFALLMECHANISMEN", C.failure, false);
  return { body: plot + result + rule, targets: [] };
}

function buildMultipleModesSplit() {
  const plot = group("modes_split_plot", "Separate Fits", image("media/split-fit.jpg", 92, 142, 1260, 710, "Separate Weibull-Auswertung der Fehlermechanismen"), false);
  const interpretation = group("modes_split_interpretation", "Zwei Populationen", `${sectionLabel(1410, 204, 390, "Trennung zeigt")}${bulletList(1410, 282, 380, ["Airbase D bildet eigene Population", "andere Steigung und Lebensdauer", "unterschiedliche Ursachen", "zielgerichtete Maßnahmen möglich"], { size: 20, gap: 82 })}`, false);
  const rule = bottomRule("modes_split_rule", "Ergebnis", "JE MECHANISMUS EINE EIGENE WEIBULL-GERADE", C.accent, false);
  return { body: plot + interpretation + rule, targets: [] };
}

function buildMultipleModesConclusion() {
  const a = group("modes_conclusion_a", "Airbase D", `${sectionLabel(92, 174, 760, "Airbase D", C.failure)}${image("media/result-a.png", 92, 236, 760, 330, "Ergebnis Airbase D")}${bulletList(92, 632, 740, ["T = 13.555 h · b = 2,21", "B₁₀ = 4.904 h", "Verschleißausfall", "Ursache: Korrosion am Meer"], { color: C.failure, size: 20, gap: 52 })}`, false);
  const b = group("modes_conclusion_b", "Andere Airbases", `${sectionLabel(1010, 174, 770, "Other Airbases", C.educationAccent)}${image("media/result-b.png", 1010, 236, 770, 330, "Ergebnis andere Airbases")}${bulletList(1010, 632, 750, ["T = 482.975 h · b = 0,88", "B₁₀ = 37.241 h", "Zufallsausfall", "Ursache: Defekt oder Installation"], { color: C.educationAccent, size: 20, gap: 52 })}`, false);
  const rule = bottomRule("modes_conclusion_rule", "Maßnahmen", "KORROSIONSSCHUTZ FÜR AIRBASE D  ·  INSTALLATION/DEFEKTE ANDERWEITIG PRÜFEN", C.accent, false);
  return { body: a + b + rule, targets: [] };
}

function createCreativeBuilders() {
  return {
    intro: buildIntro,
    workflow: (scene) => require("./re3-feedback-builders").refineWorkflow(buildWorkflow(scene), scene),
    mechanisms_overview: buildMechanismsOverview,
    censored_overview: buildCensoredOverview,
    method_choice: buildMethodChoice,
    confidence_intro: buildConfidenceIntro,
    sample_population: buildSamplePopulation,
    confidence_meaning: buildConfidenceMeaning,
    confidence_drivers: buildConfidenceDrivers,
    probability_surface: buildProbabilitySurface,
    confidence_two_sided: buildConfidenceTwoSided,
    confidence_left_sided: buildConfidenceLeftSided,
    confidence_right_sided: buildConfidenceRightSided,
    life_data_sources: buildLifeDataSources,
    complete_data: buildCompleteData,
    right_censored: buildRightCensored,
    censoring_types: buildCensoringTypes,
    multiple_censoring: buildMultipleCensoring,
    competing_risks: buildCompetingRisks,
    interval_censoring: buildIntervalCensoring,
    mls_mle: buildMlsMle,
    gear_case: buildGearCase,
    gear_median_ranks: buildGearMedianRanks,
    gear_fit: buildGearFit,
    exercise_one: buildExerciseOne,
    confidence_repetition: buildConfidenceRepetition,
    gear_confidence_result: buildGearConfidenceResult,
    exercise_two: buildExerciseTwo,
    exercise_transition: buildExerciseTransition,
    exercise_censoring_compare: buildExerciseCensoringCompare,
    exercise_censoring_example: buildExerciseCensoringExample,
    exercise_extrapolation: buildExerciseExtrapolation,
    exercise_three_dataset: buildExerciseThreeDataset,
    special_cases_transition: buildSpecialCasesTransition,
    three_parameter_select: buildThreeParameterSelect,
    three_parameter_interpret: buildThreeParameterInterpret,
    three_parameter_rules: buildThreeParameterRules,
    brake_case: buildBrakeCase,
    brake_sample: buildBrakeSample,
    brake_result: buildBrakeResult,
    three_parameter_compare: buildThreeParameterCompare,
    negative_threshold: buildNegativeThreshold,
    threshold_confidence: buildThresholdConfidence,
    multiple_modes_transition: buildMultipleModesTransition,
    multiple_modes: buildMultipleModes,
    exercise_four: buildExerciseFour,
    multiple_modes_joint: buildMultipleModesJoint,
    multiple_modes_split: buildMultipleModesSplit,
    multiple_modes_conclusion: buildMultipleModesConclusion,
    ...require("./re3-feedback-builders").builders,
    ...require("./re3-confidence-feedback-builders").builders,
    ...require("./re3-data-feedback-builders").builders,
    ...require("./re3-method-feedback-builders").builders,
  };
}

module.exports = Object.freeze({ createCreativeBuilders });
