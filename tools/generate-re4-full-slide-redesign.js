"use strict";

const fs = require("node:fs");
const path = require("node:path");
const theme = require("./reltest-education-theme");
const { SCENES } = require("./re4-redesign-spec");
const { createCreativeBuilders } = require("./re4-creative-builders");

const root = path.resolve(__dirname, "..");
const outRoot = path.join(root, "rebuild-proposals", "svg", "RE4");
const sourceAssetRoot = path.join(root, "analysis", "source-assets", "RE4");
const pictogramRoot = path.join(root, "components", "image-library", "generated-pictograms", "education-core");
const textMap = JSON.parse(fs.readFileSync(path.join(root, "analysis", "inventories", "RE4_svg-text-map.json"), "utf8"));
const C = theme.colors;

const MEDIA = Object.freeze({
  gear_weibull: [[5, "img3.png", "zahnrad-versagen.png"]],
  freewheel_transfer: [[67, "img4.png", "freilauf-ableitung.png"]],
  network_exercise: [[68, "img4.png", "netzwerke-aufgabe.png"]],
});

const PICTOGRAMS_BY_BUILDER = Object.freeze({
  system_hierarchy: [["layers.png", "layers.png"]],
  gear_weibull: [["flask.png", "flask.png"]],
  basis_probabilities: [["flask.png", "flask.png"], ["database.png", "database.png"], ["eye.png", "eye.png"]],
  boolean_prerequisites: [["shield.png", "shield.png"], ["wrench-alert.png", "wrench-alert.png"], ["layers.png", "layers.png"]],
  method_overview: [["settings.png", "settings.png"]],
  boolean_summary: [["shield.png", "shield.png"], ["wrench-alert.png", "wrench-alert.png"], ["layers.png", "layers.png"]],
  freewheel_transfer: [["settings.png", "settings.png"]],
});

const CUE_HINTS = Object.freeze({
  hierarchy_context: ["was ein „System“ überhaupt ist"],
  hierarchy_vehicle: ["Nehmen wir als Beispiel einen PKW"],
  hierarchy_subsystems: ["mehrere Subsysteme gemeinsam funktionieren"],
  hierarchy_gearbox: ["genaueren Blick auf das Getriebe"],
  hierarchy_components: ["besteht wiederum aus der Eingangswelle"],
  gear_test: ["Zahnräder an"],
  gear_failures: ["unter wechselnder Last geprüft"],
  gear_weibull: ["Weibull-Verteilung zu bestimmen"],
  gear_confidence: ["zusätzlich einen Vertrauensbereich"],
  aggregate_components: ["anderen Komponenten"],
  aggregate_gearbox: ["eine Hierarchieebene höher zusammenführen"],
  aggregate_subsystems: ["auf andere Teilsysteme anwenden"],
  aggregate_vehicle: ["Zuverlässigkeit des gesamten Fahrzeugs"],
  fta_process: ["quantitative Fehlerbaumanalyse hervorragend"],
  fta_first_four: ["ersten vier Schritte"],
  fta_top: ["Top-Ereignis: Getriebe defekt"],
  fta_tree: ["unmittelbaren Ursachen"],
  fta_basis: ["sogenannten Basisereignisse"],
  basis_events: ["blau hinterlegten Basisereignisse"],
  basis_metric: ["Ausfallwahrscheinlichkeit zu einem bestimmten Zeitpunkt"],
  basis_sources: ["unterschiedliche Datenquellen"],
  basis_assignment: ["jedem Basisereignis im Fehlerbaum"],
  quant_input: ["einzelnen Ausfallwahrscheinlichkeiten"],
  quant_logic: ["logische Struktur des Fehlerbaums"],
  quant_output: ["Durch die Umwandlung von Fehlerbaum zu Funktionsbaum"],
  quant_flow: ["Für die eigentliche Berechnung greifen wir"],
  inversion_error: ["nicht mehr von einem Fehlerbaum"],
  inversion_swap: ["Auf dieser Grundlage wandeln wir also unseren Fehlerbaum systematisch"],
  inversion_function: ["Funktionsbaum zu einem und-Gatter"],
  transform_error: ["Fehlerbaum systematisch"],
  transform_function: ["vollständigen Funktionsbaum"],
  transform_rbd: ["sogenannte Zuverlässigkeitsblockdiagramme"],
  transform_boolean: ["sogenannte boolesche Modell"],
  rbd_definition: ["grafisches Hilfsmittel"],
  rbd_blocks: ["Blöcken, meist in Form von Rechtecken"],
  rbd_connections: ["Verbindungen, oder auch Linien"],
  rbd_path: ["ununterbrochene Verbindung"],
  behavior_basis: ["zwei Basisstrukturen"],
  behavior_series: ["Serienstruktur sind alle Komponenten"],
  behavior_series_failure: ["Fällt auch nur eine Komponente aus"],
  behavior_parallel: ["Parallelstruktur hingegen gibt es Redundanz"],
  behavior_parallel_rule: ["solange mindestens eine"],
  math_series: ["Multiplikation der Einzelzuverlässigkeiten"],
  math_parallel: ["Ausfallwahrscheinlichkeit jeder Komponente"],
  math_example: ["jeweils drei Komponenten"],
  math_result_series: ["Zweiundsiebzigkomma neun Prozent"],
  math_result_parallel: ["neunundneunzigkomma neun Prozent"],
  mixed_system: ["Kombination beider Strukturen"],
  mixed_parallel: ["Parallelsystem aus Komponente zwei und drei"],
  mixed_reduce: ["Zuerst berechnet man die Zuverlässigkeit des Parallelsystems"],
  mixed_total: ["multiplizieren wir einfach nun"],
  cross_function: ["Grundlage für ein solches Blockdiagramm bildet der Funktionsbaum"],
  cross_error: ["Grundlage für ein solches Blockdiagramm bildet der Funktionsbaum"],
  cross_series: ["und-Verknüpfung im Funktionsbaum"],
  cross_parallel: ["ODER-Verknüpfung entspricht einer Parallelschaltung"],
  cross_links: ["für einfache Systeme lassen sich"],
  assumptions_binary: ["nur zwei Zustände"],
  assumptions_repair: ["Komponenten sind nicht reparierbar"],
  assumptions_independent: ["Komponenten sind unabhängig"],
  assumptions_bridge: ["sogenannte Brückenschaltung"],
  separation_bridge: ["Bei einer Brückenschaltung lässt sich die Zuverlässigkeit"],
  separation_methods: ["zwei Methoden"],
  separation_focus: ["Komponente fünf nimmt eine Schlüsselrolle"],
  separation_cases: ["betrachten wir zwei Fälle"],
  separation_case_working: ["Komponente fünf ist ständig funktionsfähig"],
  separation_case_failed: ["Komponente fünf ist ständig ausgefallen"],
  separation_weight_working: ["Im ersten Fall, also wenn die Komponente fünf funktionsfähig ist"],
  separation_weight_failed: ["Im zweiten Fall, also wenn die Komponente fünf ausgefallen ist"],
  separation_sum: ["Am Ende addieren wir beide Teilergebnisse"],
});

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function wrap(text, width, size) {
  const maxChars = Math.max(8, Math.floor(width / (size * 0.55)));
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else current = candidate;
  }
  if (current) lines.push(current);
  return lines;
}

function txt(x, y, text, size = 22, weight = 650, fill = C.text, anchor = "start") {
  return `<text x="${x}" y="${y}" font-size="${Math.max(18, size)}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true" data-qc-padding="2">${esc(text)}</text>`;
}

function multi(x, y, width, text, size = 22, weight = 650, fill = C.text, anchor = "start", lineHeight = 1.25) {
  const lines = String(text).split("\n").flatMap((lineValue) => wrap(lineValue, width, size));
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true" data-qc-padding="2">${lines.map((lineValue, index) => `<tspan x="${x}" dy="${index ? size * lineHeight : 0}">${esc(lineValue)}</tspan>`).join("")}</text>`;
}

function box(x, y, width, height, fill = C.surface, stroke = C.border, strokeWidth = 1.5, radius = 14) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" data-qc-allow-overlap="true"/>`;
}

function line(x1, y1, x2, y2, stroke = C.accent, width = 3, arrow = false, dash = "") {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}${arrow ? ` marker-end="url(#arrow_${stroke.slice(1)})"` : ""} data-role="connector" data-qc-role="connector" data-qc-layer="connector"/>`;
}

function pathLine(d, stroke = C.accent, width = 3, arrow = false, dash = "") {
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}${arrow ? ` marker-end="url(#arrow_${stroke.slice(1)})"` : ""} data-role="connector" data-qc-role="connector" data-qc-layer="connector"/>`;
}

function group(id, label, body, animated = true) {
  return `<g id="${id}"${animated ? ` data-anim-target="true" data-anim-label="${esc(label)}"` : ""} data-qc-group="${id}">${body}</g>`;
}

function image(href, x, y, width, height, label, mode = "meet") {
  return `<image href="${href}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid ${mode}" aria-label="${esc(label)}" data-qc-allow-overlap="true"/>`;
}

function pill(x, y, width, label, stroke = C.accent, fill = C.surface) {
  return `${box(x, y, width, 40, fill, stroke, 1.6, 20)}${txt(x + width / 2, y + 27, label, 17, 820, stroke, "middle")}`;
}

function card(id, x, y, width, height, eyebrow, title, body = "", options = {}) {
  const stroke = options.stroke || C.accent;
  const fill = options.fill || C.surface;
  return group(id, title, `${box(x, y, width, height, fill, stroke, options.strokeWidth || 1.8, options.radius || 14)}${eyebrow ? txt(x + 28, y + 40, eyebrow, 16, 850, stroke) : ""}${multi(x + 28, y + (eyebrow ? 84 : 52), width - 56, title, options.titleSize || 25, 800, C.deep)}${body ? multi(x + 28, y + (eyebrow ? 144 : 112), width - 56, body, options.bodySize || 20, 620, C.text, "start", 1.28) : ""}`, options.animated !== false);
}

function target(id, label, keywords = [], action = "show") {
  return { id, label, keywords, action };
}

function node(x, y, width, height, label, options = {}) {
  const fill = options.fill || C.surface;
  const stroke = options.stroke || C.accent;
  const textFill = options.textFill || C.deep;
  return `${box(x, y, width, height, fill, stroke, options.strokeWidth || 2, options.radius || 10)}${multi(x + width / 2, y + height / 2 - (String(label).includes("\n") ? 11 : -8), width - 24, label, options.size || 20, 780, textFill, "middle", 1.12)}`;
}

function dot(x, y, color = C.deep, r = 7) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
}

function cross(x, y, size = 22, color = C.failure) {
  return `${line(x - size, y - size, x + size, y + size, color, 6)}${line(x - size, y + size, x + size, y - size, color, 6)}`;
}

function rbdSeries(x, y, labels, options = {}) {
  const blockW = options.blockW || 130;
  const blockH = options.blockH || 66;
  const gap = options.gap || 55;
  const startX = x + 54;
  const total = labels.length * blockW + (labels.length - 1) * gap;
  const cy = y + blockH / 2;
  let body = `${txt(x, cy + 8, "E", 21, 850, C.deep, "middle")}${dot(x + 22, cy)}${line(x + 22, cy, startX, cy, C.deep, 3)}`;
  labels.forEach((label, index) => {
    const bx = startX + index * (blockW + gap);
    body += node(bx, y, blockW, blockH, label, { stroke: options.stroke || C.accent, fill: options.fill || C.surface });
    if (index < labels.length - 1) body += line(bx + blockW, cy, bx + blockW + gap, cy, C.deep, 3);
  });
  const end = startX + total;
  body += `${line(end, cy, end + 34, cy, C.deep, 3)}${dot(end + 34, cy)}${txt(end + 64, cy + 8, "A", 21, 850, C.deep, "middle")}`;
  return body;
}

function rbdParallel(x, y, labels, options = {}) {
  const blockW = options.blockW || 150;
  const blockH = options.blockH || 58;
  const gapY = options.gapY || 32;
  const rowsHeight = labels.length * blockH + (labels.length - 1) * gapY;
  const left = x + 64;
  const bx = x + 128;
  const right = bx + blockW + 64;
  const cy = y + rowsHeight / 2;
  let body = `${txt(x, cy + 8, "E", 21, 850, C.deep, "middle")}${dot(x + 22, cy)}${line(x + 22, cy, left, cy, C.deep, 3)}${line(left, y + blockH / 2, left, y + rowsHeight - blockH / 2, C.deep, 3)}${line(right, y + blockH / 2, right, y + rowsHeight - blockH / 2, C.deep, 3)}`;
  labels.forEach((label, index) => {
    const by = y + index * (blockH + gapY);
    body += `${line(left, by + blockH / 2, bx, by + blockH / 2, C.deep, 3)}${node(bx, by, blockW, blockH, label, { stroke: options.stroke || C.accent })}${line(bx + blockW, by + blockH / 2, right, by + blockH / 2, C.deep, 3)}`;
  });
  body += `${line(right, cy, right + 42, cy, C.deep, 3)}${dot(right + 42, cy)}${txt(right + 72, cy + 8, "A", 21, 850, C.deep, "middle")}`;
  return body;
}

function bridgeDiagram(x, y, options = {}) {
  const stroke = options.stroke || C.accent;
  const width = options.width || 800;
  const height = options.height || 210;
  const blockW = options.blockW || 132;
  const blockH = options.blockH || 58;
  const bridgeW = options.bridgeW || 92;
  const bridgeH = options.bridgeH || 62;
  const leftBus = x + 82;
  const rightBus = x + width - 82;
  const centerX = x + width / 2;
  const topCy = y + blockH / 2 + 4;
  const bottomCy = y + height - blockH / 2 - 4;
  const midY = y + height / 2;
  const leftBlockX = leftBus + 54;
  const rightBlockX = rightBus - 54 - blockW;
  const topY = topCy - blockH / 2;
  const bottomY = bottomCy - blockH / 2;
  const bridgeX = centerX - bridgeW / 2;
  const bridgeY = midY - bridgeH / 2;
  const focusStroke = options.focus ? C.educationAccent : stroke;
  const focusFill = options.focus ? C.educationAccentSoft : C.surface;

  return `${txt(x, midY + 8, "E", 22, 850, C.deep, "middle")}${dot(x + 28, midY)}${line(x + 28, midY, leftBus, midY, C.deep, 3)}` +
    `${line(leftBus, topCy, leftBus, bottomCy, C.deep, 3)}${line(leftBus, topCy, leftBlockX, topCy, C.deep, 3)}${line(leftBus, bottomCy, leftBlockX, bottomCy, C.deep, 3)}` +
    `${node(leftBlockX, topY, blockW, blockH, "1", { stroke })}${node(leftBlockX, bottomY, blockW, blockH, "2", { stroke })}` +
    `${line(leftBlockX + blockW, topCy, centerX, topCy, C.deep, 3)}${line(leftBlockX + blockW, bottomCy, centerX, bottomCy, C.deep, 3)}` +
    `${line(centerX, topCy, centerX, bridgeY, C.deep, 3)}${line(centerX, bridgeY + bridgeH, centerX, bottomCy, C.deep, 3)}` +
    `${node(bridgeX, bridgeY, bridgeW, bridgeH, "5", { stroke: focusStroke, fill: focusFill, strokeWidth: options.focus ? 4 : 2 })}` +
    `${dot(centerX, topCy, C.deep, 5)}${dot(centerX, bottomCy, C.deep, 5)}` +
    `${line(centerX, topCy, rightBlockX, topCy, C.deep, 3)}${line(centerX, bottomCy, rightBlockX, bottomCy, C.deep, 3)}` +
    `${node(rightBlockX, topY, blockW, blockH, "3", { stroke })}${node(rightBlockX, bottomY, blockW, blockH, "4", { stroke })}` +
    `${line(rightBlockX + blockW, topCy, rightBus, topCy, C.deep, 3)}${line(rightBlockX + blockW, bottomCy, rightBus, bottomCy, C.deep, 3)}${line(rightBus, topCy, rightBus, bottomCy, C.deep, 3)}` +
    `${line(rightBus, midY, x + width - 28, midY, C.deep, 3)}${dot(x + width - 28, midY)}${txt(x + width, midY + 8, "A", 22, 850, C.deep, "middle")}`;
}

function formulaAsset(scene, id, formulaText, x, y, width, height, fontSize = 34, options = {}) {
  const dir = path.join(outRoot, scene.work_unit, "formulas");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${id}.svg`);
  const quality = { artifactScope: "content-svg", embeddingTarget: "powerpoint-slide", slideType: "formula-asset", contentTitle: `Formel · ${id}`, layoutIntent: `re4-${scene.work_unit}-${id}-formula`, takeaway: formulaText, density: "low", contentMode: "transparent-content", backgroundMode: "transparent", brandProfile: theme.brandProfile, brandVariant: theme.brandVariant };
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" data-formula-fontsize="${fontSize}" data-renderer="controlled-svg-text-fallback" data-qc-role="formula" data-qc-group="formula_asset"><metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(quality)}]]></metadata><metadata><![CDATA[{"formula":"${formulaText.replaceAll('"', "\\\"")}","fontSize":${fontSize},"fallbackReason":"Python Mathtext runtime unavailable in current workspace environment","assetScope":"formula"}]]></metadata><style>text{font-family:Archivo,Arial,Helvetica,sans-serif}</style><text x="${options.anchor === "start" ? 8 : width / 2}" y="${height / 2 + fontSize * 0.36}" text-anchor="${options.anchor || "middle"}" font-size="${fontSize}" fill="${options.fill || C.deep}">${esc(formulaText)}</text></svg>\n`;
  fs.writeFileSync(file, svg, "utf8");
  return `<image href="formulas/${id}.svg" x="${x}" y="${y}" width="${width}" height="${height}" data-formula-asset="formulas/${id}.svg" data-qc-allow-overlap="true"/>`;
}

function buildSystemHierarchy() {
  const body = group("hierarchy_context", "System, Funktion und Fehlfunktion", `${card("context_card", 92, 252, 410, 450, "SYSTEM", "Gemeinsame Funktion", "Teilsysteme, Baugruppen und Komponenten wirken als verknüpfte Einheit.", { animated: false })}${pill(128, 566, 338, "FUNKTION · FAHREN", C.accent)}${pill(128, 624, 338, "FEHLFUNKTION · STILLSTAND", C.failure)}`) +
    group("hierarchy_vehicle", "PKW als System", node(850, 220, 220, 86, "PKW", { fill: C.accent, stroke: C.accent, textFill: "#FFFFFF", size: 26 })) +
    group("hierarchy_subsystems", "Teilsysteme", `${line(960, 306, 960, 376, C.accent, 3)}${line(690, 376, 1230, 376, C.accent, 3)}${line(690, 376, 690, 414, C.accent, 3)}${line(960, 376, 960, 414, C.accent, 3)}${line(1230, 376, 1230, 414, C.accent, 3)}${node(590, 414, 200, 78, "Motor")}${node(860, 414, 200, 78, "Getriebe", { stroke: C.educationAccent, strokeWidth: 4 })}${node(1130, 414, 200, 78, "Fahrwerk")}`) +
    group("hierarchy_gearbox", "Getriebe im Fokus", `${pill(824, 526, 272, "DREHMOMENT ÜBERTRAGEN", C.educationAccent)}${line(960, 492, 960, 526, C.educationAccent, 3)}`) +
    group("hierarchy_components", "Komponenten des Getriebes", `${line(960, 566, 960, 646, C.accent, 3)}${line(660, 646, 1560, 646, C.accent, 3)}${["Eingangswelle", "Zahnräder", "Ausgangswelle", "Gehäuse"].map((label, index) => { const x = 560 + index * 250; return `${line(x + 100, 646, x + 100, 686, C.accent, 3)}${node(x, 686, 200, 84, label, { size: 18 })}`; }).join("")}`);
  return { body, targets: [target("hierarchy_context", "Systemverständnis"), target("hierarchy_vehicle", "PKW"), target("hierarchy_subsystems", "Teilsysteme"), target("hierarchy_gearbox", "Getriebe"), target("hierarchy_components", "Getriebekomponenten")] };
}

function buildGearWeibull() {
  const body = group("gear_test", "Zahnradversuch", `${box(92, 238, 640, 520, C.surface, C.border, 1.5, 16)}${image("media/zahnrad-versagen.png", 124, 276, 576, 324, "Gebrochenes Zahnrad", "slice")}${multi(128, 652, 568, "Wöhlertest unter wechselnder Last", 25, 800, C.deep)}${multi(128, 702, 568, "Prüfen bis zum Versagen", 20, 620, C.text)}`) +
    group("gear_failures", "Ausfallzeiten", card("gear_failures_card", 806, 238, 452, 220, "01", "Ausfallzeiten", "Beobachtete Lebensdauern der geprüften Zahnräder", { animated: false })) +
    group("gear_weibull", "Weibull-Modell", card("gear_weibull_card", 1286, 238, 542, 220, "02", "Weibull-Verteilung", "Mathematisches Modell des Ausfallverhaltens", { animated: false })) +
    group("gear_confidence", "Vertrauensbereich", `${card("gear_confidence_card", 806, 510, 1022, 248, "03", "Stichprobe → Grundgesamtheit", "Der Vertrauensbereich beschreibt die statistische Unsicherheit der aus der Stichprobe abgeleiteten Zuverlässigkeit.", { animated: false, stroke: C.educationAccent })}${pill(1354, 670, 420, "BEISPIEL · R(t) = 99 %", C.educationAccent)}`) +
    group("gear_flow", "Vom Versuch zur abgesicherten Aussage", `${line(732, 348, 806, 348, C.accent, 3, true)}${line(1258, 348, 1286, 348, C.accent, 3, true)}${pathLine("M1557 458V484H1317V510", C.accent, 3, true)}`);
  return { body, targets: [target("gear_test", "Wöhlertest"), target("gear_failures", "Ausfallzeiten"), target("gear_weibull", "Weibull-Modell"), target("gear_confidence", "Vertrauensbereich"), target("gear_flow", "Auswertungskette", ["Erst dann können"], "draw")] };
}

function buildReliabilityAggregation() {
  const componentLabels = ["Eingangswelle\n99 %", "Zahnräder\n99 %", "Ausgangswelle\n99 %", "Gehäuse\n99 %"];
  const body = group("aggregate_components", "Komponentenzuverlässigkeiten", `${componentLabels.map((label, index) => node(350 + index * 300, 704, 230, 96, label, { size: 20 })).join("")}${line(465, 664, 1365, 664, C.accent, 3)}${componentLabels.map((_, index) => line(465 + index * 300, 664, 465 + index * 300, 704, C.accent, 3)).join("")}`) +
    group("aggregate_gearbox", "Getriebezuverlässigkeit", `${node(810, 526, 300, 100, "Getriebe\n≈ 96,5 %", { stroke: C.educationAccent, strokeWidth: 4, size: 22 })}${line(960, 626, 960, 664, C.accent, 3)}`) +
    group("aggregate_subsystems", "Teilsystemzuverlässigkeiten", `${node(440, 344, 260, 96, "Motor\n≈ 96,5 %", { size: 20 })}${node(830, 344, 260, 96, "Getriebe\n≈ 96,5 %", { size: 20 })}${node(1220, 344, 260, 96, "Fahrwerk\n≈ 96,5 %", { size: 20 })}${line(570, 302, 1350, 302, C.accent, 3)}${[570, 960, 1350].map((x) => line(x, 302, x, 344, C.accent, 3)).join("")}${line(960, 440, 960, 526, C.accent, 3)}`) +
    group("aggregate_vehicle", "Fahrzeugzuverlässigkeit", `${node(810, 184, 300, 96, "PKW\n≈ 90 %", { fill: C.accent, stroke: C.accent, textFill: "#FFFFFF", size: 24 })}${line(960, 280, 960, 302, C.accent, 3)}${pill(1280, 198, 430, "SYSTEMWERT AUS TEILSYSTEMEN", C.educationAccent)}`);
  return { body, targets: [target("aggregate_components", "Komponentenwerte"), target("aggregate_gearbox", "Getriebewert"), target("aggregate_subsystems", "Teilsystemwerte"), target("aggregate_vehicle", "Fahrzeugwert")] };
}

function buildFtaWorkflow() {
  const steps = ["System\ndefinieren", "Top-Ereignis\nfestlegen", "Ursachen\nzerlegen", "Gatter\nverknüpfen", "Kennwerte\nbestimmen", "Quantitativ\nbewerten"];
  const process = steps.map((label, index) => `${node(92 + index * 278, 206, 238, 96, `${String(index + 1).padStart(2, "0")}\n${label}`, { fill: index < 4 ? C.surface : C.accentSoft, stroke: C.accent, size: 18 })}${index < 5 ? line(330 + index * 278, 254, 360 + index * 278, 254, C.accent, 3, true) : ""}`).join("");
  const top = node(1134, 416, 330, 78, "Getriebe defekt", { fill: C.accent, stroke: C.accent, textFill: "#FFFFFF", size: 22 });
  const causes = `${line(1299, 494, 1299, 540, C.accent, 3)}${line(1024, 540, 1574, 540, C.accent, 3)}${line(1024, 540, 1024, 580, C.accent, 3)}${line(1574, 540, 1574, 580, C.accent, 3)}${node(894, 580, 260, 78, "Kein Drehmoment")}${node(1444, 580, 260, 78, "Leckage")}`;
  const basis = `${["Ermüdung", "Materialfehler", "Verschleiß", "Alterung"].map((label, index) => node(816 + index * 244, 738, 200, 76, label, { fill: C.accentSoft, size: 18 })).join("")}${pathLine("M1024 658V698H916V738M1024 698H1160V738", C.accent, 3)}${pathLine("M1574 658V698H1404V738M1574 698H1648V738", C.accent, 3)}`;
  const body = group("fta_process", "Quantitative FTA", `${pill(92, 158, 376, "QUANTITATIVE FTA", C.accent)}${process}`) +
    group("fta_first_four", "Vier gemeinsame Analyseschritte", `${box(92, 370, 622, 444, C.surface, C.border, 1.5, 16)}${multi(130, 430, 548, "Die ersten vier Schritte strukturieren dieselbe Fehlerlogik wie in der qualitativen FTA.", 27, 790, C.deep)}${multi(130, 570, 548, "Die quantitative Erweiterung beginnt mit Kennwerten an den Basisereignissen und endet mit der Systembewertung.", 22, 620, C.text)}${pill(130, 724, 340, "QUALITATIV → QUANTITATIV", C.educationAccent)}`) +
    group("fta_top", "Top-Ereignis", top) +
    group("fta_tree", "Fehlerursachen", causes) +
    group("fta_basis", "Basisereignisse", basis);
  return { body, targets: [target("fta_process", "FTA-Prozess"), target("fta_first_four", "Vier gemeinsame Schritte"), target("fta_top", "Top-Ereignis"), target("fta_tree", "Ursachenstruktur"), target("fta_basis", "Basisereignisse")] };
}

function buildBasisProbabilities() {
  const tree = `${node(150, 230, 350, 78, "Getriebe defekt", { fill: C.accent, stroke: C.accent, textFill: "#FFFFFF" })}${line(325, 308, 325, 356, C.accent, 3)}${line(210, 356, 440, 356, C.accent, 3)}${line(210, 356, 210, 398, C.accent, 3)}${line(440, 356, 440, 398, C.accent, 3)}${node(92, 398, 236, 76, "Kein Drehmoment")}${node(322, 398, 236, 76, "Leckage")}${["Ermüdung\nF≈2 %", "Materialfehler\nF≈0,1 %", "Verschleiß\nF≈1 %", "Alterung\nF≈0 %"].map((label, index) => node(92 + (index % 2) * 250, 580 + Math.floor(index / 2) * 126, 228, 92, label, { fill: C.accentSoft, stroke: index === 3 ? C.educationAccent : C.accent, size: 18 })).join("")}${pathLine("M210 474V532H206V580M210 532H456V580", C.accent, 3)}${pathLine("M440 474V692H206V706M440 692H456V706", C.accent, 3)}`;
  const body = group("basis_events", "Basisereignisse im Fehlerbaum", `${box(92, 184, 540, 670, C.surface, C.border, 1.5, 16)}${tree}`) +
    group("basis_metric", "Ausfallwahrscheinlichkeit zum Zeitpunkt t", `${card("metric_card", 704, 184, 1124, 158, "KENNWERT", "Ausfallwahrscheinlichkeit Fᵢ(t)", "Bewertung eines Basisereignisses zu einem festgelegten Betrachtungszeitpunkt", { animated: false, stroke: C.educationAccent })}`) +
    group("basis_sources", "Datenquellen", `${card("source_lab", 704, 390, 342, 276, "EVIDENZ", "Versuch & Feld", "Lebensdauerversuche\nFelddaten", { animated: false })}${card("source_model", 1095, 390, 342, 276, "MODELL", "Berechnung", "Simulationen\nStatistische Modelle", { animated: false })}${card("source_expert", 1486, 390, 342, 276, "ERFAHRUNG", "Schätzung", "Expertenschätzung\nHistorische Daten", { animated: false })}`) +
    group("basis_assignment", "Kennwerte zuordnen", `${pill(825, 748, 882, "JE BASISEREIGNIS · EIN ZEITPUNKT · EINE BEGRÜNDUNG", C.accent)}`);
  return { body, targets: [target("basis_events", "Basisereignisse"), target("basis_metric", "Ausfallwahrscheinlichkeit"), target("basis_sources", "Datenquellen"), target("basis_assignment", "Zuordnung")] };
}

function buildQuantitativeTree() {
  const body = group("quant_input", "Ausfallwahrscheinlichkeiten", `${card("quant_input_card", 92, 278, 440, 390, "EINGANG", "Basisereignisse", "F₁(t) · F₂(t) · … · Fₙ(t)\n\nWerte aus Versuch, Feld, Berechnung oder Schätzung", { animated: false })}`) +
    group("quant_logic", "Fehlerbaumlogik", `${card("quant_logic_card", 740, 278, 440, 390, "VERKNÜPFUNG", "Gatterlogik", "ODER: mindestens ein Ereignis\n\nUND: alle Ereignisse gemeinsam", { animated: false })}`) +
    group("quant_output", "Gesamtausfallwahrscheinlichkeit", `${card("quant_output_card", 1388, 278, 440, 390, "ERGEBNIS", "Top-Ereignis", "Gesamtausfallwahrscheinlichkeit F_S(t) des betrachteten Systems", { animated: false, stroke: C.educationAccent })}`) +
    group("quant_flow", "Quantitative Auswertung", `${line(532, 473, 740, 473, C.accent, 4, true)}${line(1180, 473, 1388, 473, C.accent, 4, true)}${pill(640, 744, 640, "BASISWERTE → LOGIK → SYSTEMWERT", C.accent)}`);
  return { body, targets: [target("quant_input", "Basiswerte"), target("quant_logic", "Fehlerlogik"), target("quant_output", "Systemwert"), target("quant_flow", "Berechnungsweg", ["berechnen"], "draw")] };
}

function gateIcon(x, y, symbol, label, color = C.accent) {
  return `${box(x, y, 174, 112, C.surface, color, 2, 12)}${txt(x + 87, y + 62, symbol, 38, 850, color, "middle")}${txt(x + 87, y + 94, label, 16, 800, color, "middle")}`;
}

function buildLogicInversion() {
  const body = group("inversion_error", "Fehlerbaum", `${box(92, 244, 700, 474, C.surface, C.accent, 2, 16)}${txt(136, 298, "FEHLERBAUM", 18, 850, C.accent)}${multi(136, 354, 612, "Ausfallwahrscheinlichkeiten", 30, 820, C.deep)}${gateIcon(180, 470, "≥ 1", "ODER")}${gateIcon(500, 470, "&", "UND")}${txt(267, 640, "F_S(t)", 25, 780, C.deep, "middle")}${txt(587, 640, "F_S(t)", 25, 780, C.deep, "middle")}`) +
    group("inversion_function", "Funktionsbaum", `${box(1128, 244, 700, 474, C.surface, C.accent, 2, 16)}${txt(1172, 298, "FUNKTIONSBAUM", 18, 850, C.accent)}${multi(1172, 354, 612, "Zuverlässigkeitswerte", 30, 820, C.deep)}${gateIcon(1216, 470, "&", "UND", C.educationAccent)}${gateIcon(1536, 470, "≥ 1", "ODER", C.educationAccent)}${txt(1303, 640, "R_S(t)", 25, 780, C.deep, "middle")}${txt(1623, 640, "R_S(t)", 25, 780, C.deep, "middle")}`) +
    group("inversion_swap", "Logik umkehren", `${line(832, 410, 1088, 410, C.accent, 4, true)}${line(1088, 570, 832, 570, C.accent, 4, true)}${pill(828, 462, 264, "GATTER UMKEHREN", C.accent)}${pill(634, 786, 652, "AUSFALL F(t) ↔ FUNKTION R(t)", C.educationAccent)}`);
  return { body, targets: [target("inversion_error", "Fehlerbaum"), target("inversion_swap", "Logikumkehr", [], "draw"), target("inversion_function", "Funktionsbaum")] };
}

function buildTreeToRbd() {
  const body = group("transform_error", "Fehlerbaum", `${card("transform_error_card", 92, 238, 484, 520, "01", "Fehlerbaum", "Top-Ereignis\n\nODER- und UND-Gatter\n\nAusfallwahrscheinlichkeiten Fᵢ(t)", { animated: false })}${gateIcon(248, 594, "≥ 1", "ODER")}`) +
    group("transform_function", "Funktionsbaum", `${card("transform_function_card", 718, 238, 484, 520, "02", "Funktionsbaum", "Systemfunktion\n\nUmgekehrte Gatterlogik\n\nZuverlässigkeiten Rᵢ(t)", { animated: false })}${gateIcon(874, 594, "&", "UND", C.educationAccent)}`) +
    group("transform_rbd", "Zuverlässigkeitsblockdiagramm", `${box(1344, 238, 484, 520, C.surface, C.accent, 1.8, 14)}${txt(1372, 278, "03", 16, 850, C.accent)}${multi(1372, 326, 428, "Blockdiagramm", 25, 800, C.deep)}${rbdSeries(1424, 476, ["1", "2"], { blockW: 108, blockH: 62, gap: 32 })}${rbdParallel(1458, 620, ["1", "2"], { blockW: 110, blockH: 44, gapY: 18 })}`) +
    group("transform_boolean", "Boolesches Modell", `${line(576, 488, 718, 488, C.accent, 4, true)}${line(1202, 488, 1344, 488, C.accent, 4, true)}${pill(630, 818, 660, "LOGIK → FUNKTION → ZUVERLÄSSIGKEIT", C.educationAccent)}`);
  return { body, targets: [target("transform_error", "Fehlerbaum"), target("transform_function", "Funktionsbaum"), target("transform_rbd", "Blockdiagramm"), target("transform_boolean", "Boolesches Modell", [], "draw")] };
}

function buildRbdIntro() {
  const body = group("rbd_definition", "RBD als Systemmodell", `${box(92, 220, 1736, 594, C.surface, C.border, 1.5, 18)}${multi(132, 280, 620, "Reliability Block Diagram", 31, 820, C.deep)}${multi(132, 350, 620, "Grafisches Modell für die funktionalen Abhängigkeiten eines Systems.", 23, 620, C.text)}${pill(132, 502, 430, "EINGANG E → AUSGANG A", C.accent)}`) +
    group("rbd_blocks", "Komponenten als Blöcke", `${rbdSeries(890, 340, ["1", "2", "…", "n"], { blockW: 124, blockH: 78, gap: 38 })}${pill(980, 522, 374, "BLÖCKE · KOMPONENTEN", C.accent)}`) +
    group("rbd_connections", "Funktionale Verbindungen", `${pill(1380, 522, 326, "LINIEN · ABHÄNGIGKEIT", C.accent)}`) +
    group("rbd_path", "Durchgängiger Funktionspfad", `${line(912, 379, 944, 379, C.educationAccent, 4)}${line(1068, 379, 1106, 379, C.educationAccent, 4)}${line(1230, 379, 1268, 379, C.educationAccent, 4)}${line(1392, 379, 1430, 379, C.educationAccent, 4)}${line(1554, 379, 1588, 379, C.educationAccent, 4)}${pill(890, 686, 816, "DURCHGÄNGIGER PFAD = SYSTEM FUNKTIONSFÄHIG", C.educationAccent)}`);
  return { body, targets: [target("rbd_definition", "RBD-Definition"), target("rbd_blocks", "Komponentenblöcke"), target("rbd_connections", "Verbindungen"), target("rbd_path", "Funktionspfad", [], "draw")] };
}

function buildSeriesParallelBehavior() {
  const body = group("behavior_basis", "Zwei Basisstrukturen", `${pill(620, 170, 680, "ZWEI BASISSTRUKTUREN · GLEICHE KOMPONENTEN", C.accent)}`) +
    group("behavior_series", "Serienstruktur", `${box(92, 246, 800, 560, C.surface, C.accent, 2, 16)}${txt(136, 300, "SERIENSTRUKTUR", 18, 850, C.accent)}${rbdSeries(188, 398, ["1", "2", "3"], { blockW: 130, blockH: 72, gap: 44 })}${multi(136, 604, 700, "Alle Komponenten müssen funktionieren.", 25, 800, C.deep)}${pill(136, 702, 580, "EIN AUSFALL UNTERBRICHT DEN PFAD", C.accent)}`) +
    group("behavior_parallel", "Parallelstruktur", `${box(1028, 246, 800, 560, C.surface, C.accent, 2, 16)}${txt(1072, 300, "PARALLELSTRUKTUR", 18, 850, C.accent)}${rbdParallel(1210, 342, ["1", "2", "3"], { blockW: 150, blockH: 58, gapY: 28 })}${multi(1072, 604, 700, "Mindestens ein Pfad muss funktionieren.", 25, 800, C.deep)}${pill(1072, 702, 580, "REDUNDANZ ERHÄLT DIE FUNKTION", C.educationAccent)}`) +
    group("behavior_series_failure", "Ein Ausfall stoppt die Serie", `${cross(480, 434, 28, C.failure)}${txt(480, 532, "Komponente 2 ausgefallen", 18, 760, C.failure, "middle")}`) +
    group("behavior_parallel_rule", "Ein Pfad genügt", `${line(1338, 371, 1488, 371, C.educationAccent, 4)}${line(1338, 457, 1488, 457, C.educationAccent, 4)}${cross(1413, 543, 20, C.failure)}`);
  return { body, targets: [target("behavior_basis", "Basisstrukturen"), target("behavior_series", "Serienstruktur"), target("behavior_series_failure", "Serienausfall"), target("behavior_parallel", "Parallelstruktur"), target("behavior_parallel_rule", "Parallelregel")] };
}

function buildSeriesParallelMath(scene) {
  const seriesFormula = formulaAsset(scene, "series-general", "Rₛ(t) = ∏ᵢ₌₁ⁿ Rᵢ(t)", 178, 540, 620, 82, 36);
  const parallelFormula = formulaAsset(scene, "parallel-general", "Rₛ(t) = 1 − ∏ᵢ₌₁ⁿ [1 − Rᵢ(t)]", 1088, 540, 650, 82, 34);
  const body = group("math_series", "Serienformel", `${box(92, 214, 814, 560, C.surface, C.accent, 2, 16)}${txt(136, 270, "SERIE", 18, 850, C.accent)}${rbdSeries(206, 338, ["1", "2", "3"], { blockW: 132, blockH: 66, gap: 46 })}${seriesFormula}`) +
    group("math_parallel", "Parallelformel", `${box(1014, 214, 814, 560, C.surface, C.accent, 2, 16)}${txt(1058, 270, "PARALLEL", 18, 850, C.accent)}${rbdParallel(1218, 300, ["1", "2", "3"], { blockW: 146, blockH: 52, gapY: 24 })}${parallelFormula}`) +
    group("math_example", "Drei Komponenten mit 90 Prozent", `${pill(668, 822, 584, "BEISPIEL · R₁ = R₂ = R₃ = 0,9", C.accent)}`) +
    group("math_result_series", "Ergebnis der Serienschaltung", `${pill(192, 672, 614, "R_S = 0,9³ = 0,729", C.failure)}`) +
    group("math_result_parallel", "Ergebnis der Parallelschaltung", `${pill(1114, 672, 614, "R_S = 1 − 0,1³ = 0,999", C.educationAccent)}`);
  return { body, targets: [target("math_series", "Serienformel"), target("math_parallel", "Parallelformel"), target("math_example", "Zahlenbeispiel"), target("math_result_series", "Ergebnis Serienschaltung"), target("math_result_parallel", "Ergebnis Parallelschaltung")] };
}

function mixedDiagram(x, y) {
  const cy = y + 96;
  return `${txt(x, cy + 8, "E", 21, 850, C.deep, "middle")}${dot(x + 20, cy)}${line(x + 20, cy, x + 72, cy, C.deep, 3)}${node(x + 72, y + 60, 136, 72, "1")}${line(x + 208, cy, x + 274, cy, C.deep, 3)}${line(x + 274, y + 34, x + 274, y + 158, C.deep, 3)}${line(x + 516, y + 34, x + 516, y + 158, C.deep, 3)}${line(x + 274, y + 34, x + 322, y + 34, C.deep, 3)}${line(x + 274, y + 158, x + 322, y + 158, C.deep, 3)}${node(x + 322, y, 150, 68, "2", { stroke: C.educationAccent })}${node(x + 322, y + 124, 150, 68, "3", { stroke: C.educationAccent })}${line(x + 472, y + 34, x + 516, y + 34, C.deep, 3)}${line(x + 472, y + 158, x + 516, y + 158, C.deep, 3)}${line(x + 516, cy, x + 564, cy, C.deep, 3)}${dot(x + 564, cy)}${txt(x + 594, cy + 8, "A", 21, 850, C.deep, "middle")}`;
}

function buildMixedReduction(scene) {
  const f1 = formulaAsset(scene, "parallel-23", "R₂₃ = 1 − (1 − R₂)(1 − R₃)", 1284, 482, 400, 64, 29);
  const f2 = formulaAsset(scene, "mixed-total", "Rₛ = R₁ · R₂₃", 1346, 674, 330, 60, 31);
  const body = group("mixed_system", "Gemischte Struktur", `${box(92, 238, 780, 520, C.surface, C.border, 1.5, 16)}${mixedDiagram(158, 386)}${pill(192, 664, 580, "1 IN SERIE MIT PARALLELSYSTEM 2 ∥ 3", C.accent)}`) +
    group("mixed_parallel", "Parallelsystem erkennen", `${card("mixed_step_1", 948, 238, 780, 154, "01", "Teilsystem 2 ∥ 3 erkennen", "Parallele Komponenten zuerst zusammenfassen", { animated: false })}`) +
    group("mixed_reduce", "Parallelsystem berechnen", `${card("mixed_step_2", 948, 430, 780, 154, "02", "Parallelteil reduzieren", "", { animated: false, stroke: C.educationAccent })}${f1}`) +
    group("mixed_total", "Gesamtsystem berechnen", `${card("mixed_step_3", 948, 622, 780, 154, "03", "Mit Komponente 1 multiplizieren", "", { animated: false })}${f2}`);
  return { body, targets: [target("mixed_system", "Gemischtes System"), target("mixed_parallel", "Parallelteil"), target("mixed_reduce", "Teilzuverlässigkeit"), target("mixed_total", "Systemzuverlässigkeit")] };
}

function buildFtaFunctionRbd() {
  const body = group("cross_function", "Drei Sichten einer Systemlogik", `${pill(580, 164, 760, "DREI SICHTEN · EINE SYSTEMLOGIK", C.accent)}`) +
    group("cross_error", "Fehlerbaum", `${box(92, 242, 520, 510, C.surface, C.accent, 2, 16)}${txt(136, 296, "FEHLERBAUM", 18, 850, C.accent)}${gateIcon(264, 408, "≥ 1", "ODER")}${multi(136, 602, 432, "Ausfall tritt ein, wenn mindestens eine Ursache wirksam wird.", 21, 620, C.text)}`) +
    group("cross_series", "UND wird Serie", `${box(700, 242, 520, 510, C.surface, C.accent, 2, 16)}${txt(744, 296, "FUNKTIONSBAUM", 18, 850, C.accent)}${gateIcon(872, 408, "&", "UND", C.educationAccent)}${multi(744, 602, 432, "Alle Teilfunktionen müssen erfüllt sein.", 21, 620, C.text)}`) +
    group("cross_parallel", "ODER wird Parallel", `${box(1308, 242, 520, 510, C.surface, C.accent, 2, 16)}${txt(1352, 296, "BLOCKDIAGRAMM", 18, 850, C.accent)}${rbdSeries(1386, 430, ["1", "2"], { blockW: 110, blockH: 62, gap: 34 })}${rbdParallel(1430, 570, ["1", "2"], { blockW: 110, blockH: 40, gapY: 16 })}`) +
    group("cross_links", "Modelltransformation", `${line(612, 496, 700, 496, C.accent, 4, true)}${line(1220, 496, 1308, 496, C.accent, 4, true)}${pill(562, 814, 796, "UND → SERIE · ODER → PARALLEL", C.educationAccent)}`);
  return { body, targets: [target("cross_function", "Gemeinsame Systemlogik"), target("cross_error", "Fehlerbaum", ["Funktions- oder Fehlerbaum"]), target("cross_series", "UND zu Serie"), target("cross_parallel", "ODER zu Parallel"), target("cross_links", "Transformation", ["ableiten"], "draw")] };
}

function assumptionCard(id, x, number, title, body, symbol) {
  return group(id, title, `${box(x, 232, 520, 390, C.surface, C.accent, 2, 16)}${txt(x + 42, 282, number, 18, 850, C.accent)}${txt(x + 260, 384, symbol, 58, 850, C.accent, "middle")}${multi(x + 42, 476, 436, title, 26, 820, C.deep)}${multi(x + 42, 544, 436, body, 20, 620, C.text)}`);
}

function buildBooleanPrerequisites() {
  const body = assumptionCard("assumptions_binary", 92, "01", "Binäre Zustände", "funktionsfähig oder ausgefallen", "0 / 1") +
    assumptionCard("assumptions_repair", 700, "02", "Nicht reparierbar", "Ausfall bleibt bis zum Betrachtungsende bestehen", "↛") +
    assumptionCard("assumptions_independent", 1308, "03", "Unabhängig", "Kein Ausfall beeinflusst eine andere Komponente", "⊥") +
    group("assumptions_bridge", "Brückenschaltung als Grenzfall", `${box(92, 664, 1736, 262, C.surface, C.border, 1.5, 16)}${txt(132, 716, "BRÜCKENSCHALTUNG", 18, 850, C.accent)}${multi(132, 764, 430, "Mehrere mögliche Systempfade", 27, 800, C.deep)}${pill(132, 844, 430, "NICHT DIREKT REDUZIERBAR", C.accent)}${bridgeDiagram(810, 690, { width: 820, height: 206, blockW: 126, blockH: 58, bridgeW: 92, bridgeH: 64, focus: true })}`);
  return { body, targets: [target("assumptions_binary", "Binäre Zustände"), target("assumptions_repair", "Nicht reparierbar"), target("assumptions_independent", "Unabhängig"), target("assumptions_bridge", "Brückenschaltung")] };
}

function buildBooleanStates() {
  const body = `${box(250, 230, 1420, 550, C.surface, C.border, 1.5, 18)}${txt(320, 292, "BOOLESCHES MODELL", 18, 850, C.accent)}${multi(320, 364, 560, "Komponenten- und Systemzustände werden eindeutig codiert.", 28, 800, C.deep)}${node(1050, 320, 220, 160, "1\nfunktionsfähig", { fill: C.accentSoft, stroke: C.educationAccent, strokeWidth: 4, size: 23 })}${node(1350, 320, 220, 160, "0\nausgefallen", { fill: C.surface, stroke: C.failure, strokeWidth: 4, size: 23 })}${pill(320, 548, 530, "xᵢ , y ∈ {0, 1}", C.accent)}${pill(930, 596, 640, "POSITIVLOGIK · 1 = FUNKTION", C.educationAccent)}${multi(320, 680, 520, "xᵢ beschreibt eine Komponente, y den Systemzustand.", 21, 620, C.text)}`;
  return { body, targets: [] };
}

function bridgeWorking(x, y) {
  const topCy = y + 28;
  const bottomCy = y + 106;
  const midY = (topCy + bottomCy) / 2;
  const leftBus = x + 72;
  const leftBlock = x + 106;
  const leftMerge = x + 260;
  const rightSplit = x + 338;
  const rightBlock = x + 372;
  const rightMerge = x + 526;
  const blockW = 120;
  const blockH = 52;
  return `${txt(x, midY + 8, "E", 21, 850, C.deep, "middle")}${dot(x + 26, midY)}${line(x + 26, midY, leftBus, midY, C.deep, 3)}` +
    `${line(leftBus, topCy, leftBus, bottomCy, C.deep, 3)}${line(leftBus, topCy, leftBlock, topCy, C.deep, 3)}${line(leftBus, bottomCy, leftBlock, bottomCy, C.deep, 3)}` +
    `${node(leftBlock, topCy - blockH / 2, blockW, blockH, "1")}${node(leftBlock, bottomCy - blockH / 2, blockW, blockH, "2")}` +
    `${line(leftBlock + blockW, topCy, leftMerge, topCy, C.deep, 3)}${line(leftBlock + blockW, bottomCy, leftMerge, bottomCy, C.deep, 3)}${line(leftMerge, topCy, leftMerge, bottomCy, C.deep, 3)}` +
    `${line(leftMerge, midY, rightSplit, midY, C.deep, 3)}${line(rightSplit, topCy, rightSplit, bottomCy, C.deep, 3)}${line(rightSplit, topCy, rightBlock, topCy, C.deep, 3)}${line(rightSplit, bottomCy, rightBlock, bottomCy, C.deep, 3)}` +
    `${node(rightBlock, topCy - blockH / 2, blockW, blockH, "3")}${node(rightBlock, bottomCy - blockH / 2, blockW, blockH, "4")}` +
    `${line(rightBlock + blockW, topCy, rightMerge, topCy, C.deep, 3)}${line(rightBlock + blockW, bottomCy, rightMerge, bottomCy, C.deep, 3)}${line(rightMerge, topCy, rightMerge, bottomCy, C.deep, 3)}` +
    `${line(rightMerge, midY, x + 574, midY, C.deep, 3)}${dot(x + 574, midY)}${txt(x + 606, midY + 8, "A", 21, 850, C.deep, "middle")}`;
}

function bridgeFailed(x, y) {
  const topCy = y + 28;
  const bottomCy = y + 106;
  const midY = (topCy + bottomCy) / 2;
  const leftBus = x + 72;
  const firstBlock = x + 106;
  const secondBlock = x + 304;
  const rightBus = x + 478;
  const blockW = 126;
  const blockH = 52;
  return `${txt(x, midY + 8, "E", 21, 850, C.deep, "middle")}${dot(x + 26, midY)}${line(x + 26, midY, leftBus, midY, C.deep, 3)}` +
    `${line(leftBus, topCy, leftBus, bottomCy, C.deep, 3)}${line(leftBus, topCy, firstBlock, topCy, C.deep, 3)}${line(leftBus, bottomCy, firstBlock, bottomCy, C.deep, 3)}` +
    `${node(firstBlock, topCy - blockH / 2, blockW, blockH, "1")}${node(firstBlock, bottomCy - blockH / 2, blockW, blockH, "2")}` +
    `${line(firstBlock + blockW, topCy, secondBlock, topCy, C.deep, 3)}${line(firstBlock + blockW, bottomCy, secondBlock, bottomCy, C.deep, 3)}` +
    `${node(secondBlock, topCy - blockH / 2, blockW, blockH, "3")}${node(secondBlock, bottomCy - blockH / 2, blockW, blockH, "4")}` +
    `${line(secondBlock + blockW, topCy, rightBus, topCy, C.deep, 3)}${line(secondBlock + blockW, bottomCy, rightBus, bottomCy, C.deep, 3)}${line(rightBus, topCy, rightBus, bottomCy, C.deep, 3)}` +
    `${line(rightBus, midY, x + 574, midY, C.deep, 3)}${dot(x + 574, midY)}${txt(x + 606, midY + 8, "A", 21, 850, C.deep, "middle")}`;
}

function buildBridgeSeparation(scene) {
  const workingFormula = formulaAsset(scene, "bridge-case-working", "RⅠ = R₅ · [1 − (1 − R₁)(1 − R₂)] · [1 − (1 − R₃)(1 − R₄)]", 132, 774, 720, 52, 22);
  const failedFormula = formulaAsset(scene, "bridge-case-failed", "RⅡ = (1 − R₅) · [1 − (1 − R₁R₃)(1 − R₂R₄)]", 1060, 774, 736, 52, 22);
  const totalFormula = formulaAsset(scene, "bridge-total", "Rₛ = RⅠ + RⅡ", 686, 884, 548, 56, 32);
  const body = group("separation_methods", "Exakte Methoden für die Brücke", `${pill(566, 158, 788, "EXAKT · SEPARATION ODER MULTILINEARFORM", C.accent)}`) +
    group("separation_bridge", "Brückenschaltung", `${box(92, 214, 1736, 276, C.surface, C.border, 1.5, 16)}${txt(132, 270, "BRÜCKENSCHALTUNG", 18, 850, C.accent)}${multi(132, 320, 410, "Nicht direkt als reine Reihen- oder Parallelschaltung reduzierbar.", 23, 760, C.deep)}${bridgeDiagram(800, 242, { width: 820, height: 220, blockW: 130, blockH: 62, bridgeW: 96, bridgeH: 68 })}`) +
    group("separation_focus", "Komponente 5 separieren", `${pill(132, 410, 382, "SCHLÜSSELKOMPONENTE 5", C.educationAccent)}${box(1162, 318, 96, 68, C.educationAccentSoft, C.educationAccent, 4, 10)}${txt(1210, 360, "5", 20, 780, C.deep, "middle")}`) +
    group("separation_cases", "Zwei disjunkte Fälle", `${line(1210, 462, 1210, 506, C.accent, 3)}${line(500, 506, 1420, 506, C.accent, 3)}${line(500, 506, 500, 532, C.accent, 3, true)}${line(1420, 506, 1420, 532, C.accent, 3, true)}`) +
    group("separation_case_working", "Fall I: Komponente 5 funktioniert", `${box(92, 532, 792, 310, C.surface, C.accent, 2, 16)}${txt(132, 582, "FALL I", 18, 850, C.accent)}${pill(232, 554, 384, "KOMPONENTE 5 FUNKTIONIERT", C.educationAccent)}${bridgeWorking(150, 626)}${workingFormula}`) +
    group("separation_case_failed", "Fall II: Komponente 5 ist ausgefallen", `${box(1036, 532, 792, 310, C.surface, C.accent, 2, 16)}${txt(1076, 582, "FALL II", 18, 850, C.accent)}${pill(1180, 554, 384, "KOMPONENTE 5 AUSGEFALLEN", C.failure)}${bridgeFailed(1094, 626)}${failedFormula}`) +
    group("separation_sum", "Teilergebnisse addieren", `${pill(572, 850, 776, "SATZ DER TOTALEN WAHRSCHEINLICHKEIT", C.accent)}${totalFormula}`);
  return { body, targets: [target("separation_bridge", "Brückenschaltung"), target("separation_methods", "Lösungsmethoden"), target("separation_focus", "Komponente 5"), target("separation_cases", "Falltrennung", [], "draw"), target("separation_case_working", "Fall I"), target("separation_case_failed", "Fall II"), target("separation_sum", "Gesamtergebnis")] };
}

function buildMethodOverview() {
  const body = `${box(92, 230, 1736, 570, C.surface, C.border, 1.5, 18)}${line(290, 518, 1630, 518, C.accent, 5, true)}${dot(334, 518, C.accent, 11)}${dot(960, 518, C.accent, 11)}${dot(1578, 518, C.accent, 11)}${card("method_simple", 142, 286, 430, 380, "EINFACH", "Boolesche Systemtheorie", "Praktisch und ausreichend für nicht reparierbare Systeme", { animated: false })}${card("method_complex", 742, 286, 436, 380, "KOMPLEX", "Dynamische Modelle", "Markov-Theorie\nPetri-Netze\nMonte-Carlo-Simulation\nMomenten-Methode", { animated: false })}${card("method_analytic", 1348, 286, 430, 380, "ANALYTISCH", "Exakte Verfahren", "Multilinearform\nMellin-Transformation", { animated: false })}${pill(450, 738, 1020, "METHODE FOLGT SYSTEMSTRUKTUR UND REPARIERBARKEIT", C.accent)}`;
  return { body, targets: [] };
}

function buildBooleanSummary() {
  const cards = [
    ["01", "Zwei Zustände", "funktionsfähig oder ausgefallen"],
    ["02", "Nicht reparierbar", "Ausfall bleibt bestehen"],
    ["03", "Unabhängig", "keine gegenseitige Beeinflussung"],
  ];
  const body = `${cards.map(([number, title, textValue], index) => card(`summary_${index + 1}`, 92 + index * 608, 270, 520, 390, number, title, textValue, { animated: false })).join("")}${pill(474, 728, 972, "VOR DER BERECHNUNG · ANNAHMEN PRÜFEN", C.educationAccent)}`;
  return { body, targets: [] };
}

function buildStructureReference(scene) {
  const fsSeries = formulaAsset(scene, "reference-series", "Rₛ = ∏ᵢ₌₁ⁿ Rᵢ", 170, 532, 440, 64, 31);
  const fsParallel = formulaAsset(scene, "reference-parallel", "Rₛ = 1 − ∏ᵢ₌₁ⁿ (1 − Rᵢ)", 728, 532, 500, 64, 29);
  const fsMixed = formulaAsset(scene, "reference-mixed", "Rₛ = R₁ · [1 − (1 − R₂)(1 − R₃)]", 1300, 532, 470, 64, 26);
  const body = `${box(92, 214, 520, 552, C.surface, C.accent, 2, 16)}${txt(132, 266, "SERIE", 18, 850, C.accent)}${rbdSeries(170, 344, ["1", "2", "3"], { blockW: 92, blockH: 58, gap: 26 })}${fsSeries}${pill(150, 654, 404, "0,9³ = 0,729", C.failure)}${box(700, 214, 520, 552, C.surface, C.accent, 2, 16)}${txt(740, 266, "PARALLEL", 18, 850, C.accent)}${rbdParallel(804, 310, ["1", "2", "3"], { blockW: 120, blockH: 44, gapY: 18 })}${fsParallel}${pill(758, 654, 404, "1 − 0,1³ = 0,999", C.educationAccent)}${box(1308, 214, 520, 552, C.surface, C.accent, 2, 16)}${txt(1348, 266, "GEMISCHT", 18, 850, C.accent)}<g transform="translate(1336 310) scale(.75)">${mixedDiagram(0, 0)}</g>${fsMixed}${pill(1400, 654, 336, "SCHRITTWEISE", C.accent)}`;
  return { body, targets: [] };
}

function writeComponentCountPlot(scene) {
  const dir = path.join(outRoot, scene.work_unit, "plots");
  const dataDir = path.join(outRoot, scene.work_unit, "data");
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(dataDir, { recursive: true });
  const reliabilities = [0.95, 0.99, 0.995, 0.999];
  const width = 1040;
  const height = 610;
  const margin = { left: 106, right: 54, top: 34, bottom: 86 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const x = (n) => margin.left + ((n - 1) / 29) * plotW;
  const y = (value) => margin.top + (1 - value) * plotH;
  const colors = [C.deep, C.accent, C.secondary, C.educationAccent];
  const plotFont = String(theme.bodyFontFamily).replaceAll('"', "");
  const grid = [0, 0.2, 0.4, 0.6, 0.8, 1].map((tick) => `${line(margin.left, y(tick), width - margin.right, y(tick), C.border, 1)}${txt(margin.left - 20, y(tick) + 7, `${Math.round(tick * 100)}`, 17, 650, C.text, "end")}`).join("") +
    [1, 5, 10, 15, 20, 25, 30].map((tick) => `${line(x(tick), margin.top, x(tick), height - margin.bottom, C.border, 1)}${txt(x(tick), height - margin.bottom + 34, String(tick), 17, 650, C.text, "middle")}`).join("");
  const curves = reliabilities.map((r, index) => {
    const points = Array.from({ length: 30 }, (_, i) => `${x(i + 1).toFixed(2)},${y(r ** (i + 1)).toFixed(2)}`).join(" ");
    const lx = x(23);
    const ly = y(r ** 23);
    return `<g id="curve_${String(r).replace(".", "_")}"><polyline points="${points}" fill="none" stroke="${colors[index]}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><text x="${Math.min(width - 182, lx + 16)}" y="${Math.max(42, ly - 10)}" font-family="${esc(plotFont)}" font-size="18" font-weight="750" fill="${colors[index]}">R(B) = ${(r * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} %</text></g>`;
  }).join("");
  const plotBody = `${grid}${line(margin.left, height - margin.bottom, width - margin.right, height - margin.bottom, C.deep, 2)}${line(margin.left, margin.top, margin.left, height - margin.bottom, C.deep, 2)}${curves}${txt(width / 2, height - 24, "Anzahl der Komponenten n", 22, 750, C.deep, "middle")}<text x="28" y="${height / 2}" transform="rotate(-90 28 ${height / 2})" font-family="${esc(plotFont)}" font-size="22" font-weight="750" fill="${C.deep}" text-anchor="middle">Systemzuverlässigkeit Rₛ [%]</text>`;
  const quality = { artifactScope: "content-svg", embeddingTarget: "powerpoint-slide", slideType: "technical-plot", contentTitle: "Systemzuverlässigkeit über der Komponentenanzahl", layoutIntent: "re4-component-count-reliability-plot", takeaway: "In einer Serienstruktur sinkt die Systemzuverlässigkeit mit jeder zusätzlichen Komponente.", density: "normal", contentMode: "transparent-content", backgroundMode: "transparent", brandProfile: theme.brandProfile, brandVariant: theme.brandVariant };
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Systemzuverlässigkeit einer Serienstruktur über der Anzahl der Komponenten" data-diagram-type="technical" data-generator="controlled-node-fallback" data-qc-role="plot" data-qc-group="plot_asset"><metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(quality)}]]></metadata><metadata><![CDATA[{"diagram_type":"technical","x_axis":"Anzahl der Komponenten n","y_axis":"Systemzuverlässigkeit Rₛ [%]","model":"Rₛ = R(B)^n","source":"RE4 source 65","fallback_reason":"Python runtime unavailable in current workspace environment","assetScope":"plot"}]]></metadata><style>text{font-family:Archivo,Arial,Helvetica,sans-serif}</style><rect width="${width}" height="${height}" fill="transparent"/>${plotBody}</svg>\n`;
  fs.writeFileSync(path.join(dir, "component-count.svg"), svg, "utf8");
  fs.writeFileSync(path.join(dataDir, "component-count.json"), `${JSON.stringify({ model: "Rₛ = R(B)^n", component_counts: Array.from({ length: 30 }, (_, i) => i + 1), component_reliabilities: reliabilities, source_slide: 65 }, null, 2)}\n`, "utf8");
  return { plotBody, width, height };
}

function buildComponentCountPlot(scene) {
  const plot = writeComponentCountPlot(scene);
  const body = `${box(92, 220, 480, 590, C.surface, C.border, 1.5, 16)}${txt(136, 274, "SERIENSTRUKTUR", 18, 850, C.accent)}${multi(136, 344, 386, "Mit jeder zusätzlichen Komponente sinkt Rₛ.", 29, 820, C.deep)}${multi(136, 480, 386, "Je kleiner die Zuverlässigkeit einer Komponente, desto steiler der Abfall.", 22, 620, C.text)}${pill(136, 682, 390, "IDENTISCHE KOMPONENTEN", C.accent)}${box(642, 190, 1186, 650, C.surface, C.border, 1.5, 16)}<g transform="translate(704 218) scale(1.02 .97)" data-qc-group="component_count_plot">${plot.plotBody}</g>`;
  return { body, targets: [] };
}

function buildFreewheelTransfer() {
  const body = `${card("freewheel_steps", 92, 208, 462, 610, "ANWENDUNG", "Freilauf", "01 · Konstruktion verstehen\n\n02 · Funktionsstruktur aufstellen\n\n03 · Ausfallpfade in ein RBD übersetzen", { animated: false })}${pill(136, 724, 374, "SYSTEM → FUNKTION → RBD", C.educationAccent)}${box(624, 190, 1204, 650, C.surface, C.border, 1.5, 16)}${image("media/freilauf-ableitung.png", 672, 230, 1108, 570, "Ableitung eines Zuverlässigkeitsblockdiagramms am Freilauf")}`;
  return { body, targets: [] };
}

function buildNetworkExercise() {
  const body = `${box(92, 218, 450, 560, C.surface, C.accent, 2, 16)}${txt(136, 274, "ARBEITSAUFTRAG", 18, 850, C.accent)}${multi(136, 346, 360, "Bestimme für jedes System die Zuverlässigkeitsfunktion R_S(t).", 27, 800, C.deep)}${multi(136, 520, 360, "Berechne anschließend den Wert für identische Komponenten.", 21, 620, C.text)}${pill(136, 672, 360, "R_K(t) = 0,9", C.educationAccent)}${box(612, 190, 1216, 650, C.surface, C.border, 1.5, 16)}${image("media/netzwerke-aufgabe.png", 674, 238, 1090, 546, "Fünf Zuverlässigkeitsnetzwerke a bis e")}`;
  return { body, targets: [] };
}

const BUILDERS = createCreativeBuilders();

function sourceEntry(slide) {
  const entry = textMap.mappings.find((item) => item.source_slide_number === slide);
  if (!entry) throw new Error(`Kein Sprechertext-Mapping für RE4::${slide}.`);
  return entry;
}

function spokenText(scene) {
  return sourceEntry(scene.primary_source_slide).spoken_text;
}

function sentenceList(text) {
  const paragraphs = String(text).split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean);
  const sentences = paragraphs.flatMap((paragraph) => paragraph.match(/[^.!?]+[.!?]?/g) || [paragraph]).map((value) => value.trim()).filter(Boolean);
  return [...new Set(sentences)];
}

function normalizeKeywords(keywords) {
  return (Array.isArray(keywords) ? keywords : [keywords]).flat(Infinity).map((value) => String(value).toLocaleLowerCase("de-DE"));
}

function cue(scene, entry) {
  const text = spokenText(scene);
  const sentences = sentenceList(text);
  const needles = normalizeKeywords(CUE_HINTS[entry.id] || entry.keywords);
  for (const needle of needles) {
    const hit = sentences.find((sentence) => sentence.toLocaleLowerCase("de-DE").includes(needle));
    if (hit) return hit;
  }
  throw new Error(`Kein semantischer Sprechertext-Trigger für ${scene.work_unit}::${entry.id}.`);
}

function frame(scene, content) {
  const body = scene.animation_decision === "static"
    ? content.body.replace(/ data-anim-target="true" data-anim-label="[^"]*"/g, "")
    : content.body;
  const colors = [...new Set([C.accent, C.deep, C.secondary, C.success, C.failure, C.educationAccent, C.semanticSuccess, C.semanticWarning, C.technical, C.graphite, C.border])]
    .filter((color) => body.includes(color));
  const markers = colors.map((color) => `<marker id="arrow_${color.slice(1)}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1L11 6L1 11Z" fill="${color}"/></marker>`).join("");
  const metadata = {
    artifactScope: "content-svg",
    embeddingTarget: "powerpoint-slide",
    slideType: scene.archetype,
    contentTitle: scene.title,
    layoutIntent: `re4-${scene.builder.replaceAll("_", "-")}-open-hierarchy`,
    takeaway: scene.takeaway,
    density: content.density || (["workflow-tree", "tree-calculation", "cross-model-map", "worked-method", "formula-reference", "formula-comparison", "logic-comparison", "logic-to-rbd", "assumption-checklist", "exercise"].includes(scene.archetype) ? "dense" : "normal"),
    contentMode: "transparent-content",
    backgroundMode: "transparent",
    brandProfile: theme.brandProfile,
    brandVariant: theme.brandVariant,
    sourceSlides: scene.source_slides,
    sourceTextSection: scene.source_text_section_id,
    structureStatus: "deferred-by-user",
    officialLogoStatus: "downstream-owned",
    referenceLock: content.referenceLock || ["RE3::1", "RE3::34", "RE3::70"],
  };
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="accessible_title accessible_description" data-artifact-scope="content-svg" data-embedding-target="powerpoint-slide" data-scene-id="${scene.scene_id}" data-brand-profile="${theme.brandProfile}">
<metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(metadata)}]]></metadata>
<title id="accessible_title">${esc(scene.title)}</title><desc id="accessible_description">${esc(scene.takeaway)}</desc>
<defs>${markers}</defs>
<style>text{font-family:${theme.bodyFontFamily};letter-spacing:0}</style>
<g id="scene_content" data-qc-group="scene_content" data-qc-layer="content" data-source-ref="RE4::${scene.source_slides.join(",RE4::")}">${body}</g>
</svg>`;
}

function copyAsset(source, destination) {
  if (!fs.existsSync(source)) throw new Error(`Asset fehlt: ${source}`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function prepareAssets(scene) {
  const dir = path.join(outRoot, scene.work_unit);
  for (const [slide, sourceName, filename] of MEDIA[scene.builder] || []) {
    const source = path.join(sourceAssetRoot, `source_${String(slide).padStart(3, "0")}`, sourceName);
    copyAsset(source, path.join(dir, "media", filename));
  }
  for (const [sourceName, filename] of PICTOGRAMS_BY_BUILDER[scene.builder] || []) {
    copyAsset(path.join(pictogramRoot, sourceName), path.join(dir, "media", filename));
  }
}

function writeManifest(scene, content) {
  const dir = path.join(outRoot, scene.work_unit);
  if (content.feedbackRevision) return require('./re4-feedback-support').writeAnimation(scene,content,dir);
  const staticScene = scene.animation_decision === "static";
  const targets = staticScene ? [] : content.targets.map((entry) => ({ targetId: entry.id, label: entry.label, status: "animated", visibleInEditor: true, render: true, confidence: "high" }));
  const resolved = staticScene ? [] : content.targets.map((entry, index) => {
    const sourceText = cue(scene, entry);
    return { entry, sourceText, sourceIndex: spokenText(scene).indexOf(sourceText), originalIndex: index };
  }).sort((a, b) => a.sourceIndex - b.sourceIndex || a.originalIndex - b.originalIndex);
  const steps = resolved.map(({ entry, sourceText }, index) => ({
    stepId: `step_${String(index + 1).padStart(2, "0")}_${entry.id}`,
    targetId: entry.id,
    action: entry.action,
    sourceText,
    occurrence: 1,
    confidence: "high",
    notes: entry.action === "draw" ? "Beziehung erscheint nach ihren fachlichen Endpunkten." : "Sprechertextgeführte semantische Gruppe.",
    ...(entry.action === "draw" ? { drawDurFrames: 42 } : { enterFrames: 16 }),
  }));
  const defaults = { enterFrames: 16, exitFrames: 12, highlightDurFrames: 30, drawDurFrames: 42, transformDurFrames: 30 };
  fs.writeFileSync(path.join(dir, "scene.animation.v1.json"), `${JSON.stringify({ schemaVersion: "svgAnimationManifest/v1", svgPath: `${scene.work_unit}.svg`, defaults, targets, steps }, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(dir, "element-animation-plan.json"), `${JSON.stringify({ schemaVersion: "elementAnimationPlan/v1", sceneId: scene.scene_id, decision: scene.animation_decision, defaults, targets, steps, notes: scene.notes || undefined }, null, 2)}\n`, "utf8");
}

function writeBrief(scene, content) {
  const sourceTitles = [...new Set(scene.source_slides.map((slide) => sourceEntry(slide).source_text_title))];
  const pictograms = content.pictograms || [];
  const hasPlot = scene.builder === "component_count_plot";
  const hasBridge = ["boolean_prerequisites", "bridge_separation", "bridge_separation_cases"].includes(scene.builder);
  const hasSeparation = ["bridge_separation", "bridge_separation_cases"].includes(scene.builder);
  const text = `# Redesign-Brief — ${scene.work_unit}

- Strukturstatus: Kapitel und Lektion noch nicht zugeordnet; Nutzervorgabe ausstehend
- Quellfolien: ${scene.source_slides.join(", ")}
- Sprechertext: ${scene.source_text_section_id} — ${sourceTitles.join(" / ")}
- Titel: ${scene.title}
- Takeaway: ${scene.takeaway}
- Archetyp: ${scene.archetype}
- Zielmodus: content_svg, transparent, 1920×1080; Titel, Footer, Logo und Hintergrund bleiben im E-Learning-Master
- Referenz-Lock: RE4-Quellfolie(n) der Szene sowie die freigegebene offene Hierarchie aus RE3 slide_001, slide_034 und slide_070
- Farbdramaturgie: Marineblau für Struktur, Signalgrün für Funktion/Fokus, Koralle für Ausfall und Stahlcyan für technische Ableitungen
- Animation: ${scene.animation_decision === "static" ? "statisch — kein belastbarer separater Sprechertextaufbau" : "sprechertextgeführt; semantische Gruppen statt Einzelobjekt-Mikroanimation"}
- Quellenregel: PowerPoint-Sprechericons, gelbe Produktionsnotizen und Masterdekoration entfallen
- Layoutprinzip: offene Hierarchie; Boxen nur für echte technische Knoten, Zustände oder Ergebnisflächen
- Assets: ${(MEDIA[scene.builder] || []).length ? "bereinigte Quellmedien" : "native technische SVG-Komposition"}${pictograms.length ? " plus freigegebene generierte PNG-Piktogramme aus education-core" : ""}
${pictograms.length ? `- PNG-Piktogramme: ${pictograms.map(([filename, kind, meaning]) => `${filename} (${kind}; ${meaning})`).join("; ")}\n- Piktogramm-Regel: redundant zur sichtbaren Beschriftung, atomar eingebettet und nicht aus SVG-Elementen nachgebaut\n` : ""}${hasBridge ? "- Brückengeometrie: kanonische Fünf-Komponenten-Topologie mit Komponente 5 als vertikale Kopplung zwischen den mittleren Knoten; alle Ersatzstrukturen verwenden dieselbe Komponentensprache\n" : ""}${hasSeparation ? "- Separationstransfer: Schlüsselkomponente, beide disjunkten Fälle, resultierende Ersatzstrukturen, Fallgewichte R₅ und 1 − R₅, Teilformeln sowie die vollständige Endsumme bleiben sichtbar erhalten\n" : ""}${hasPlot ? "- Diagramm: technische Direktbeschriftung; x = Anzahl der Komponenten n; y = Systemzuverlässigkeit R_S [%]; Modell R_S = R_i^n\n" : ""}`;
  fs.writeFileSync(path.join(outRoot, scene.work_unit, "redesign-brief.md"), text, "utf8");
}

function selectedScenes() {
  const index = process.argv.indexOf("--slides");
  if (index < 0) return new Set(SCENES.map((scene) => scene.output_slide_number));
  const selected = new Set();
  for (const token of String(process.argv[index + 1] || "").split(",")) {
    const match = token.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!match) throw new Error(`Ungültige Folienauswahl: ${token}`);
    for (let slide = Number(match[1]); slide <= Number(match[2] || match[1]); slide += 1) selected.add(slide);
  }
  return selected;
}

function main() {
  const selected = selectedScenes();
  const generated = [];
  for (const scene of SCENES) {
    if (!selected.has(scene.output_slide_number)) continue;
    const builder = BUILDERS[scene.builder];
    if (!builder) throw new Error(`Builder fehlt: ${scene.builder}`);
    const dir = path.join(outRoot, scene.work_unit);
    fs.mkdirSync(dir, { recursive: true });
    if (!process.argv.includes('--animation-only')) prepareAssets(scene);
    const content = builder(scene);
    if(process.argv.includes('--animation-only')) {
      if(fs.readFileSync(path.join(dir,`${scene.work_unit}.svg`),'utf8')!==`${frame(scene,content)}\n`) throw Error('Static scene changed; review before animation.');
      writeManifest(scene,content);generated.push(scene.work_unit);continue;
    }
    fs.writeFileSync(path.join(dir, `${scene.work_unit}.svg`), `${frame(scene, content)}\n`, "utf8");
    if(process.argv.includes('--static-only')) {generated.push(scene.work_unit);continue;}
    writeManifest(scene, content);
    if(!content.feedbackRevision) writeBrief(scene, content);
    generated.push(scene.work_unit);
  }
  process.stdout.write(`Generated ${generated.length} RE4 scene(s): ${generated.join(", ")}.\n`);
}

main();
