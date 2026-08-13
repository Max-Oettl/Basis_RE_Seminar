"use strict";

const fs = require("node:fs");
const path = require("node:path");
const educationTheme = require("./reltest-education-theme");

const root = path.resolve(__dirname, "..");
const outRoot = path.join(root, "rebuild-proposals", "svg", "RE2");
const assetRoot = path.join(root, "components", "image-library", "re2-ch4-fmea");
const sourceMap = JSON.parse(fs.readFileSync(path.join(root, "analysis", "rebuild-plans", "RE2_source-reference-map.json"), "utf8"));
const inventory = JSON.parse(fs.readFileSync(path.join(root, "analysis", "inventories", "RE2_svg-text-map.json"), "utf8"));
const scenes = sourceMap.mappings.filter((scene) => scene.chapter === 4);
const animated = process.argv.includes("--animated");

const C = educationTheme.colors;

const processLabels = [
  ["1. Schritt", "Planung und Vorbereitung"],
  ["2. Schritt", "Strukturanalyse"],
  ["3. Schritt", "Funktionsanalyse"],
  ["4. Schritt", "Fehleranalyse"],
  ["5. Schritt", "Risikoanalyse"],
  ["6. Schritt", "Optimierung"],
  ["7. Schritt", "Ergebnis- dokumentation"],
];

const titles = {
  63: "FMEA",
  64: "Was ist eine FMEA?",
  65: "Was ist eine FMEA?",
  66: "Ziele der FMEA",
  67: "Grundprinzipien der FMEA",
  68: "Welche Arten einer FMEA gibt es?",
  69: "Design-FMEA und Prozess-FMEA: Ziel und Fokus",
  70: "Design-FMEA und Prozess-FMEA: Zeitpunkt und Ergebnis",
  71: "Einsatz der FMEA",
  72: "Die 7 Schritte der FMEA",
  73: "1. Schritt: Planung und Vorbereitung",
  74: "Planung und Vorbereitung: zentrale Aufgaben",
  75: "Das FMEA-Team",
  76: "Ziel von Schritt 1",
  77: "Die 7 Schritte der FMEA",
  78: "2. Schritt: Strukturanalyse",
  79: "Systemgrenze festlegen",
  80: "Systemstruktur innerhalb der Systemgrenze",
  81: "Vorgehen in der Strukturanalyse",
  82: "Ziel von Schritt 2",
  83: "Systembaum: Systemebene 1",
  84: "Systembaum: Systemebene 2",
  85: "Systembaum: Systemebene 3",
  86: "Beispiel: Anpassungsgetriebe",
  87: "Stückliste des Anpassungsgetriebes",
  88: "Systemstruktur: Antrieb und Komponenten",
  89: "Systemstruktur: Abtrieb und Komponenten",
  90: "Die 7 Schritte der FMEA",
  91: "3. Schritt: Funktionsanalyse",
  92: "Funktionen den Systemelementen zuordnen",
  93: "Systembaum mit Funktionen",
  94: "Ziel von Schritt 3",
  95: "Funktionsstruktur des Anpassungsgetriebes",
  96: "Die 7 Schritte der FMEA",
  97: "4. Schritt: Fehleranalyse",
  98: "Von der Funktion zur Fehlfunktion",
  99: "Beispiel: Funktion und Fehlfunktionen",
  100: "Ziel von Schritt 4",
  101: "Systembaum mit Funktionen",
  102: "Fehlfunktionen ergänzen",
  103: "Vollständiger Funktions- und Fehlerbaum",
  104: "Fehlerzusammenhänge verknüpfen",
  105: "Fehlerfolge, Fehler und Fehlerursache",
  106: "FMEA-Sicht auf ein Systemelement",
  107: "Fehlerzusammenhang über zwei Ebenen",
  108: "Fehlerzusammenhang über drei Ebenen",
  109: "Typische Ausfallarten und Ausfallursachen",
  110: "Fehleranalyse des Anpassungsgetriebes",
  111: "Die 7 Schritte der FMEA",
  112: "5. Schritt: Risikoanalyse",
  113: "Drei Größen der Risikobewertung",
  114: "B: Bedeutung",
  115: "A: Auftretenswahrscheinlichkeit",
  116: "E: Entdeckungswahrscheinlichkeit",
  117: "B, A und E im Überblick",
  118: "Bewertungskriterien für B, A und E",
  119: "Bewertungstabelle der System-FMEA",
  120: "Risikobewertung mit der RPZ",
  121: "Von der RPZ zur Aufgabenpriorität",
  122: "Aufgabenpriorität: risikoorientiert entscheiden",
  123: "Hohe Aufgabenpriorität",
  124: "Mittlere Aufgabenpriorität",
  125: "Niedrige Aufgabenpriorität",
  126: "Ziel von Schritt 5",
  127: "Die 7 Schritte der FMEA",
  128: "6. Schritt: Optimierung",
  129: "Drei Hebel der Optimierung",
  130: "Ziel von Schritt 6",
  131: "Die 7 Schritte der FMEA",
  132: "7. Schritt: Ergebnisdokumentation",
  133: "FMEA-Formblatt: Grundstruktur",
  134: "FMEA-Formblatt: Struktur und Funktion",
  135: "FMEA-Formblatt: Fehler- und Risikoanalyse",
  136: "FMEA-Formblatt: Optimierung",
  137: "Ziele der Ergebnisdokumentation",
  138: "Die 7 Schritte der FMEA",
  139: "Design- und Prozess-FMEA",
  140: "Prozess-FMEA: Schritt 1",
  141: "1. Schritt: Planung und Vorbereitung",
  142: "Planung und Vorbereitung in der Prozess-FMEA",
  143: "Prozess-FMEA: Schritt 2",
  144: "2. Schritt: Strukturanalyse",
  145: "Strukturanalyse der Design-FMEA",
  146: "Strukturanalyse der Prozess-FMEA",
  147: "Prozess-FMEA: Schritt 3",
  148: "3. Schritt: Funktionsanalyse",
  149: "Funktionsanalyse der Design-FMEA",
  150: "Funktionsanalyse der Prozess-FMEA",
  151: "Prozess-FMEA: Schritt 4",
  152: "4. Schritt: Fehleranalyse",
  153: "Fehleranalyse der Design-FMEA",
  154: "Fehleranalyse der Prozess-FMEA",
  155: "Design- und Prozessfehler im Vergleich",
  156: "Prozess-FMEA: Schritt 5",
  157: "5. Schritt: Risikoanalyse",
  158: "Risikobewertung im Vergleich",
  159: "RPZ und Aufgabenpriorität",
  160: "Prozess-FMEA: Schritt 6",
  161: "6. Schritt: Optimierung",
  162: "Optimierung im Vergleich",
  163: "Prozess-FMEA: Schritt 7",
  164: "7. Schritt: Ergebnisdokumentation",
  165: "Ergebnisdokumentation im Vergleich",
};

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function wrap(text, max) {
  const lines = [];
  let line = "";
  for (const word of String(text).split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && next.length > max) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function txt(x, y, text, size = 24, weight = 600, fill = C.text, anchor = "start") {
  const fontSize = Math.max(18, size);
  return `<text x="${x}" y="${y}" font-size="${fontSize}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-padding="0">${esc(text)}</text>`;
}

function multi(x, y, width, text, size = 22, weight = 600, fill = C.text, anchor = "start", lineHeight = 1.22) {
  const fontSize = Math.max(18, size);
  const max = Math.max(8, Math.floor(width / (fontSize * 0.54)));
  const spans = wrap(text, max).map((line, index) =>
    `<tspan x="${x}" dy="${index ? Math.round(fontSize * lineHeight) : 0}">${esc(line)}</tspan>`).join("");
  return `<text x="${x}" y="${y}" font-size="${fontSize}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-padding="0">${spans}</text>`;
}

function multiRows(x, y, width, text, size = 22, weight = 600, fill = C.text, anchor = "start", lineHeight = 1.22) {
  const fontSize = Math.max(18, size);
  const max = Math.max(8, Math.floor(width / (fontSize * 0.54)));
  return wrap(text, max).map((row, index) =>
    txt(x, y + index * Math.round(fontSize * lineHeight), row, fontSize, weight, fill, anchor)).join("");
}

function annotationTxt(x, y, text, size = 18, weight = 820, fill = C.soft, anchor = "start") {
  return `<text x="${x}" y="${y}" font-size="${Math.max(18, size)}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="annotation" data-qc-layer="text">${esc(text)}</text>`;
}

function box(x, y, width, height, fill = C.surface, stroke = C.border, strokeWidth = 1.5, radius = 10) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

function group(id, label, body, markForAnimation = true) {
  return `<g id="${id}"${animated && markForAnimation ? ` data-anim-target="true" data-anim-label="${esc(label)}"` : ""}><title>${esc(label)}</title>${body}</g>`;
}

function line(x1, y1, x2, y2, color = C.deep, strokeWidth = 2.2, arrow = false, dash = "") {
  return `<path d="M ${x1} ${y1} L ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"${arrow ? ` marker-end="url(#arrow_${color.slice(1)})"` : ""}${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}

function pathLine(d, color = C.deep, strokeWidth = 2.2, arrow = false, dash = "") {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${arrow ? ` marker-end="url(#arrow_${color.slice(1)})"` : ""}${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}

function pill(x, y, width, label, color = C.accent, fill = C.surface) {
  return `${box(x, y, width, 38, fill, color, 1.4, 19)}${txt(x + width / 2, y + 26, label, 18, 780, color, "middle")}`;
}

function card(x, y, width, height, title, body, color = C.accent, fill = C.surface, options = {}) {
  const titleSize = options.titleSize || 23;
  const bodySize = options.bodySize || 20;
  return `${box(x, y, width, height, fill, color, options.strokeWidth || 1.8, options.radius || 10)}
    ${txt(x + 24, y + 42, title, titleSize, 800, color)}
    ${multi(x + 24, y + 82, width - 48, body, bodySize, 600, C.text, "start", 1.24)}`;
}

function bulletList(x, y, width, items, color = C.accent, size = 21, gap = 56) {
  return items.map((item, index) => {
    const yy = y + index * gap;
    return `${box(x, yy - 17, 18, 18, color, color, 1, 9)}${multi(x + 36, yy, width - 36, item, size, 600, C.text, "start", 1.18)}`;
  }).join("");
}

function evidence(markup, reference) {
  return `<g data-source-evidence="source_slide" data-source-reference="${esc(reference)}">${markup}</g>`;
}

function assetData(filename) {
  return `data:image/png;base64,${fs.readFileSync(path.join(assetRoot, filename)).toString("base64")}`;
}

function image(filename, x, y, width, height, label) {
  return `<image x="${x}" y="${y}" width="${width}" height="${height}" href="${assetData(filename)}" preserveAspectRatio="xMidYMid meet" aria-label="${esc(label)}" data-source-media="true" data-source-evidence="source_slide" data-source-reference="Extrahiertes und bereinigtes Quellasset"/>`;
}

function annotate(markup) {
  return markup
    .replace(/<text(?![^>]*data-qc-role)/g, '<text data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true"')
    .replace(/<tspan(?![^>]*data-qc-role)/g, '<tspan data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true"')
    .replace(/<rect(?![^>]*data-qc-allow-overlap)/g, '<rect data-qc-allow-overlap="true"')
    .replace(/<circle(?![^>]*data-qc-allow-overlap)/g, '<circle data-qc-allow-overlap="true"')
    .replace(/<image(?![^>]*data-qc-allow-overlap)/g, '<image data-qc-allow-overlap="true"')
    .replace(/<path(?![^>]*data-role)/g, '<path data-role="connector"');
}

function sourceEntry(n) {
  return inventory.mappings.find((entry) => entry.source_slide_number === n);
}

function cuePara(n, keywords = []) {
  const paragraphs = String(sourceEntry(n).spoken_text || "").split(/\n+/).map((value) => value.trim()).filter(Boolean);
  for (const keyword of keywords) {
    const match = paragraphs.find((paragraph) => paragraph.toLocaleLowerCase("de-DE").includes(String(keyword).toLocaleLowerCase("de-DE")));
    if (match) return match;
  }
  return paragraphs[0] || "";
}

function target(id, label, n, keywords, action = "show") {
  return { id, label, sourceText: cuePara(n, keywords), action };
}

function processStrip(activeStep = 0, y = 370, compact = false) {
  const width = compact ? 218 : 218;
  const gap = 14;
  const total = width * 7 + gap * 6;
  const x0 = (1920 - total) / 2;
  const height = compact ? 90 : 138;
  const links = processLabels.slice(0, 6).map((_, index) =>
    line(x0 + width + index * (width + gap), y + height / 2, x0 + (index + 1) * (width + gap), y + height / 2, C.soft, 2, true)).join("");
  const nodes = processLabels.map(([step, label], index) => {
    const active = activeStep === index + 1;
    const x = x0 + index * (width + gap);
    return `${box(x, y, width, height, active ? C.accent : C.deep, active ? C.accent : C.deep, 1.8, 12)}
      ${txt(x + width / 2, y + (compact ? 29 : 39), step.toUpperCase(), 18, 820, C.surface, "middle")}
      ${multi(x + width / 2, y + (compact ? 55 : 75), width - 34, label, 18, 720, C.surface, "middle", 1.05)}`;
  }).join("");
  return `${links}${nodes}`;
}

function frame(scene, content) {
  const n = scene.output_slide_number;
  const title = titles[n];
  const metadata = {
    artifactScope: "content-svg",
    embeddingTarget: "powerpoint-slide",
    slideType: content.archetype,
    contentTitle: title,
    layoutIntent: content.layout,
    takeaway: content.takeaway || `Quelltreuer Zustand der FMEA-Sequenz auf Folie ${n}.`,
    density: content.density || "balanced",
    contentMode: "transparent-content",
    backgroundMode: "transparent",
    brandProfile: educationTheme.brandProfile,
    brandVariant: educationTheme.brandVariant,
    sourceSlides: [n],
    officialLogoStatus: "pending-original-asset",
  };
  const markerColors = [...new Set([C.accent, C.deep, C.failure, C.success, C.secondary, C.soft, C.border])]
    .filter((color) => content.body.includes(color));
  const markers = markerColors.map((color) =>
    `<marker id="arrow_${color.slice(1)}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L11 6L1 11Z" fill="${color}"/></marker>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="accessible_title accessible_description" data-artifact-scope="content-svg" data-embedding-target="powerpoint-slide" data-scene-id="${scene.scene_id}" data-brand-profile="${educationTheme.brandProfile}">
<metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(metadata)}]]></metadata>
<title id="accessible_title">${esc(title)}</title><desc id="accessible_description">${esc(metadata.takeaway)}</desc>
<defs>
  ${markers}
</defs>
<style>text{font-family:${educationTheme.bodyFontFamily};letter-spacing:0}</style>
<g id="scene_content" data-qc-group="scene_content" data-qc-layer="content">${annotate(evidence(content.body, `Quellfolie ${n}: ${sourceEntry(n).source_text_title}`))}</g>
</svg>`;
}

function processOnly(n, activeStep = 0) {
  const process = group(`s${n}_process`, "Sieben Schritte der FMEA", processStrip(activeStep, 386, false), false);
  const note = activeStep
    ? `${pill(736, 610, 448, `${activeStep}. SCHRITT IM FOKUS`, C.accent, C.accentSoft)}`
    : `${pill(748, 610, 424, "VOLLSTÄNDIGER METHODENABLAUF", C.accent, C.accentSoft)}`;
  return {
    archetype: "process-overview",
    layout: "Kanonische siebenstufige FMEA-Prozessleiste als dominante Erklärfläche.",
    takeaway: activeStep ? `Schritt ${activeStep} ist der aktive FMEA-Arbeitsschritt.` : "Die FMEA folgt einem klaren Ablauf aus sieben Schritten.",
    body: process + note,
    targets: [],
  };
}

function goalScene(n, step, statement) {
  const nav = step ? processStrip(step, 172, true) : "";
  const goal = group(`s${n}_goal`, "Ziel",
    `${box(204, 390, 1512, 350, C.surface, C.accent, 2.2, 16)}
     ${pill(252, 438, 150, "ZIEL", C.accent, C.accentSoft)}
     ${multi(960, 555, 1300, statement, 34, 800, C.deep, "middle", 1.22)}
     ${box(456, 782, 1008, 70, C.deep, C.deep, 1.5, 9)}
     ${multi(960, 826, 930, `Ergebnis des ${step}. FMEA-Schritts`, 22, 720, C.surface, "middle")}`);
  return {
    archetype: "key-takeaway",
    layout: "Kompakter Prozesskontext oben und eine dominante Zielaussage in der Mitte.",
    takeaway: statement,
    body: nav + goal,
    targets: [target(`s${n}_goal`, "Ziel", n, ["Ziel", "Ziel ist"])],
  };
}

function compareColumns(n, left, right, options = {}) {
  const y = options.y || 254;
  const height = options.height || 590;
  const leftColor = options.leftColor || C.accent;
  const rightColor = options.rightColor || C.secondary;
  const leftFill = options.leftFill || C.accentSoft;
  const rightFill = options.rightFill || C.secondarySoft;
  const leftGroup = group(`s${n}_left`, left.title,
    `${box(92, y, 816, height, leftFill, leftColor, 2, 14)}
     ${txt(500, y + 62, left.title, 30, 820, leftColor, "middle")}
     ${left.subtitle ? multi(500, y + 104, 700, left.subtitle, 21, 700, C.deep, "middle") : ""}
     ${bulletList(142, y + 178, 710, left.items, leftColor, options.bodySize || 21, options.gap || 82)}`);
  const rightGroup = group(`s${n}_right`, right.title,
    `${box(1012, y, 816, height, rightFill, rightColor, 2, 14)}
     ${txt(1420, y + 62, right.title, 30, 820, rightColor, "middle")}
     ${right.subtitle ? multi(1420, y + 104, 700, right.subtitle, 21, 700, C.deep, "middle") : ""}
     ${bulletList(1062, y + 178, 710, right.items, rightColor, options.bodySize || 21, options.gap || 82)}`);
  return {
    archetype: "two-column-comparison",
    layout: "Zwei gleichgewichtige, semantisch farbcodierte Vergleichsspalten.",
    takeaway: options.takeaway || `${left.title} und ${right.title} werden anhand derselben Vergleichslogik gegenübergestellt.`,
    body: leftGroup + rightGroup + (options.footer || ""),
    targets: [
      target(`s${n}_left`, left.title, n, left.cues || [left.title]),
      target(`s${n}_right`, right.title, n, right.cues || [right.title]),
    ],
  };
}

function genericSystemTree(n, options = {}) {
  const focusLevel = options.focusLevel || 0;
  const withFunctions = Boolean(options.withFunctions);
  const withFaults = Boolean(options.withFaults);
  const labels = options.labels || {
    root: "Systemelement 1",
    level2: ["Systemelement 2.1", "Systemelement 2.2", "Systemelement 2.3"],
    level3: ["Systemelement 3.1", "Systemelement 3.2", "Systemelement 3.3"],
  };
  const y1 = 286;
  const y2 = 490;
  const y3 = 714;
  const focus = [y1 - 42, y2 - 42, y3 - 42][focusLevel - 1];
  const focusBand = focusLevel
    ? `${box(202, focus, 8, focusLevel === 3 ? 194 : 154, C.accent, C.accent, 0, 4)}`
    : "";
  const connectors = group(`s${n}_tree_links`, "Hierarchische Verknüpfungen",
    `${pathLine(`M 960 ${y1 + 76} V ${y2 - 32} H 470 V ${y2}`, C.deep, 2.2)}
     ${pathLine(`M 960 ${y2 - 32} H 960 V ${y2}`, C.deep, 2.2)}
     ${pathLine(`M 960 ${y2 - 32} H 1450 V ${y2}`, C.deep, 2.2)}
     ${pathLine(`M 470 ${y2 + 76} V ${y3 - 32} H 330 V ${y3}`, C.deep, 2)}
     ${pathLine(`M 470 ${y3 - 32} H 610 V ${y3}`, C.deep, 2)}
     ${pathLine(`M 1450 ${y2 + 76} V ${y3 - 32} H 1310 V ${y3}`, C.deep, 2)}
     ${pathLine(`M 1450 ${y3 - 32} H 1590 V ${y3}`, C.deep, 2)}`);
  function node(x, y, width, label, fn, fault) {
    return `${box(x, y, width, 76, C.deep, C.deep, 1.5, 8)}
      ${multi(x + width / 2, y + 34, width - 24, label, 20, 800, C.surface, "middle", 1.06)}
      ${withFunctions ? `${box(x + 12, y + 88, width - 24, 50, C.successSoft, C.success, 1.4, 7)}${multi(x + width / 2, y + 119, width - 44, fn, 18, 700, C.success, "middle", 1.04)}` : ""}
      ${withFaults ? `${box(x + 20, y + (withFunctions ? 146 : 88), width - 40, 46, C.failureSoft, C.failure, 1.5, 7)}${multi(x + width / 2, y + (withFunctions ? 176 : 117), width - 56, fault, 18, 760, C.failure, "middle", 1.02)}` : ""}`;
  }
  const nodes = group(`s${n}_tree_nodes`, "Systemelemente",
    `${focusBand}
     ${annotationTxt(188, y1 + 40, "SYSTEMEBENE 1", 18, 820, C.soft, "end")}
     ${annotationTxt(188, y2 + 40, "SYSTEMEBENE 2", 18, 820, C.soft, "end")}
     ${annotationTxt(188, y3 + 40, "SYSTEMEBENE 3", 18, 820, C.soft, "end")}
     ${node(800, y1, 320, labels.root, "Funktion 1.1", "Fehler 1.1.1")}
     ${node(340, y2, 260, labels.level2[0], "Funktion 2.1.1", "Fehler 2.1.1.1")}
     ${node(830, y2, 260, labels.level2[1], "Funktion 2.2.1", "Fehler 2.2.1.1")}
     ${node(1320, y2, 260, labels.level2[2], "Funktion 2.3.1", "Fehler 2.3.1.1")}
     ${node(210, y3, 240, labels.level3[0], "Funktion 3.1.1", "Fehler 3.1.1.1")}
     ${node(490, y3, 240, labels.level3[1], "Funktion 3.1.2", "Fehler 3.1.2.1")}
     ${node(1190, y3, 240, labels.level3[2], "Funktion 3.2.1", "Fehler 3.2.1.1")}
     ${node(1470, y3, 240, labels.level3[3] || labels.level3[2].replace("3.3", "3.4"), "Funktion 3.4.1", "Fehler 3.4.1.1")}`);
  const targets = [
    target(`s${n}_tree_nodes`, "Systemelemente", n, ["Systemelement", "Systemstruktur", "hierarchisch"]),
    target(`s${n}_tree_links`, "Hierarchische Verknüpfungen", n, options.linkCues || ["hierarchisch", "verknüpft", "Systembaum"], "draw"),
  ];
  return {
    archetype: "hierarchy-tree",
    layout: "Kanonischer dreistufiger Systembaum mit optionalen Funktions- und Fehlerlagen.",
    takeaway: withFaults ? "Systemelemente, Funktionen und Fehlfunktionen bleiben hierarchisch miteinander verknüpft." : withFunctions ? "Jedes Systemelement erhält mindestens eine zugeordnete Funktion." : "Der Systembaum ordnet jedes Systemelement eindeutig einer Hierarchieebene zu.",
    density: withFunctions ? "dense" : "balanced",
    body: processStrip(withFaults ? 4 : withFunctions ? 3 : 2, 172, true) + connectors + nodes,
    targets,
  };
}

function scene63() {
  return {
    archetype: "title-slide",
    layout: "Ruhiger Kapitelauftakt mit dominantem Methodenbegriff.",
    takeaway: "Die FMEA ist die nächste qualitative Zuverlässigkeitsmethode im Modul.",
    body: `${box(244, 250, 1432, 560, C.deep, C.deep, 2, 18)}
      ${txt(960, 490, "FMEA", 156, 850, C.surface, "middle")}
      ${multi(960, 600, 1200, "Fehler-Möglichkeits- und Einfluss-Analyse", 38, 760, C.accentSoft, "middle")}
      ${pill(690, 690, 540, "QUALITATIVE ZUVERLÄSSIGKEITSMETHODE", C.accent, C.surface)}`,
    targets: [],
  };
}

function scene64() {
  return {
    archetype: "title-question",
    layout: "Große Leitfrage als bewusster Zwischenzustand vor der Definition.",
    takeaway: "Die Leitfrage bereitet die Auflösung des Akronyms vor.",
    body: `${txt(960, 465, "Wofür steht", 48, 760, C.soft, "middle")}
      ${txt(960, 640, "FMEA?", 164, 850, C.deep, "middle")}
      ${line(710, 694, 1210, 694, C.accent, 4)}`,
    targets: [],
  };
}

function scene65() {
  const acronym = group("s65_acronym", "Akronym FMEA",
    `${box(92, 222, 480, 524, C.deep, C.deep, 2, 16)}
     ${txt(332, 330, "FMEA", 88, 850, C.surface, "middle")}
     ${multi(332, 426, 390, "Fehler-Möglichkeits- und Einfluss-Analyse", 27, 760, C.accentSoft, "middle", 1.18)}
     ${multi(332, 570, 390, "Failure Mode and Effects Analysis", 24, 700, C.surface, "middle", 1.18)}`);
  const definition = group("s65_definition", "Definition",
    `${box(620, 222, 1208, 244, C.accentSoft, C.accent, 1.8, 14)}
     ${txt(654, 270, "FMEA IST …", 20, 820, C.accent)}
     ${multi(654, 326, 1120, "eine systematische, proaktive und entwicklungsbegleitende Methode, die im Team durchgeführt wird.", 29, 760, C.deep)}`);
  const roles = group("s65_roles", "Aufgaben der FMEA",
    `${card(620, 510, 380, 236, "FRÜH ERKENNEN", "Ausfallarten, Ausfallfolgen und Ausfallursachen identifizieren.", C.accent, C.surface)}
     ${card(1034, 510, 380, 236, "RISIKO BEWERTEN", "Risiken strukturiert einschätzen und priorisieren.", C.secondary, C.surface)}
     ${card(1448, 510, 380, 236, "OPTIMIEREN", "Geeignete Maßnahmen festlegen und dokumentieren.", C.success, C.surface)}`);
  return {
    archetype: "definition",
    layout: "Dominantes Akronym links, Definition und drei Aufgaben rechts.",
    takeaway: "Die FMEA erkennt potenzielle Fehler früh, bewertet ihr Risiko und leitet Optimierungen ab.",
    body: acronym + definition + roles,
    targets: [
      target("s65_acronym", "Akronym FMEA", 65, ["FMEA bedeutet"]),
      target("s65_definition", "Definition", 65, ["systematische"]),
      target("s65_roles", "Aufgaben der FMEA", 65, ["frühzeitig", "Risiko"]),
    ],
  };
}

function scene66() {
  const goals = [
    ["AUSFÄLLE VERMEIDEN", "Potenzielle Fehler früh erkennen und eine problemfreie Produkteinführung unterstützen.", C.failure, C.failureSoft],
    ["KOSTEN REDUZIEREN", "Nachbesserungen vermeiden und Ressourcen effizient einsetzen.", C.secondary, C.secondarySoft],
    ["PRODUKTQUALITÄT STEIGERN", "Schwachstellen aufdecken und konkrete Verbesserungsmaßnahmen ableiten.", C.accent, C.accentSoft],
    ["WISSEN SICHERN", "Erkenntnisse im Team dokumentieren und regulatorische Anforderungen erfüllen.", C.success, C.successSoft],
  ];
  const body = goals.map(([title, text, color, fill], index) => {
    const x = 92 + (index % 2) * 868;
    const y = 220 + Math.floor(index / 2) * 326;
    return group(`s66_goal_${index + 1}`, title, card(x, y, 812, 270, title, text, color, fill, { titleSize: 24, bodySize: 23 }));
  }).join("");
  return {
    archetype: "goals",
    layout: "Vier gleichgewichtige Zielbereiche in einem ruhigen 2×2-Raster.",
    takeaway: "FMEA reduziert Ausfälle und Kosten, steigert Qualität und sichert Wissen.",
    body,
    targets: goals.map(([title], index) => target(`s66_goal_${index + 1}`, title, 66, [title.split(" ")[0], "Ziel"])),
  };
}

function scene67() {
  const principles = [
    ["KONTINUITÄT", "begleitet Entwicklung und Optimierung fortlaufend", C.accent, C.accentSoft],
    ["SYSTEMATIK", "identifiziert, bewertet und priorisiert Risiken strukturiert", C.deep, C.surfaceSoft],
    ["PROAKTIVITÄT", "reagiert früh auf Veränderungen und Kundenfeedback", C.secondary, C.secondarySoft],
    ["DOKUMENTATION", "macht Entscheidungen für Verbesserungen nachvollziehbar", C.success, C.successSoft],
    ["TEAMARBEIT", "verbindet Expertenwissen aus mehreren Fachbereichen", C.failure, C.failureSoft],
  ];
  const width = 320;
  const gap = 30;
  const x0 = 100;
  const cards = principles.map(([title, text, color, fill], index) =>
    group(`s67_principle_${index + 1}`, title,
      card(x0 + index * (width + gap), 288, width, 476, title, text, color, fill, { titleSize: 22, bodySize: 21 }))).join("");
  return {
    archetype: "principles",
    layout: "Fünf gleichwertige Prinzipien in einer einheitlichen horizontalen Kartenfolge.",
    takeaway: "Kontinuität, Systematik, Proaktivität, Dokumentation und Teamarbeit tragen die FMEA.",
    body: cards,
    targets: [
      target("s67_principle_1", "KONTINUITÄT", 67, ["Kontinuität"]),
      target("s67_principle_2", "SYSTEMATIK", 67, ["Systematik"]),
      target("s67_principle_3", "PROAKTIVITÄT", 67, ["außerdem proaktiv"]),
      target("s67_principle_4", "DOKUMENTATION", 67, ["wesentlicher Bestandteil", "Dokumentation"]),
      target("s67_principle_5", "TEAMARBEIT", 67, ["Teamarbeit"]),
    ],
  };
}

function scene68() {
  return compareColumns(68,
    { title: "DESIGN-FMEA", subtitle: "Produktgestaltung", items: ["Risiken im Produktdesign untersuchen"], cues: ["Design-FMEA"] },
    { title: "PROZESS-FMEA", subtitle: "Fertigung und Montage", items: ["Risiken in Produktionsabläufen untersuchen"], cues: ["Prozess-FMEA"] },
    { height: 430, y: 290, bodySize: 25, gap: 90, takeaway: "FMEA wird als Design-FMEA oder Prozess-FMEA eingesetzt." });
}

function scene69() {
  return compareColumns(69,
    { title: "DESIGN-FMEA", subtitle: "Ziel: Schwachstellen im Produktdesign früh erkennen", items: ["Schwerpunkt: Produktqualität", "Komponenten, Baugruppen und ihre Interaktionen"], cues: ["Design-FMEA", "Produktdesign"] },
    { title: "PROZESS-FMEA", subtitle: "Ziel: Schwachstellen im Produktionsprozess früh erkennen", items: ["Schwerpunkt: Produktionseffizienz", "Schritte, Abläufe und Materialien des Produktionsprozesses"], cues: ["Prozess-FMEA", "Produktionsprozess"] },
    { takeaway: "Design-FMEA fokussiert das Produkt; Prozess-FMEA fokussiert den Produktionsprozess." });
}

function scene70() {
  return compareColumns(70,
    { title: "DESIGN-FMEA", subtitle: "während der Designphase", items: ["Idealerweise vor dem ersten Prototypen", "Ergebnis: sicheres und funktionales Produkt", "Beispiel: neu entwickeltes Autobatteriesystem"], cues: ["Designphase", "Prototyp"] },
    { title: "PROZESS-FMEA", subtitle: "ab der Produktionsplanung", items: ["Beginnt in der Planungsphase der Produktion", "Ergebnis: effiziente und kosteneffektive Produktion", "Beispiel: Montagelinie für Elektronikgeräte"], cues: ["kontinuierlich während des gesamten Produktionsprozesses", "Planungsphase der Produktion"] },
    { bodySize: 20, gap: 92, takeaway: "Beide FMEA-Arten setzen früh an, aber an unterschiedlichen Entwicklungsobjekten." });
}

function scene71() {
  const use = group("s71_use", "Einsatzbereiche",
    `${box(92, 224, 820, 290, C.accentSoft, C.accent, 1.8, 10)}
     ${txt(116, 266, "EINSATZBEREICHE", 23, 800, C.accent)}
     ${multiRows(116, 306, 772, "Qualität und Zuverlässigkeit in Automobilindustrie, Luft- und Raumfahrt, Medizintechnik, Elektronik, Chemie und Dienstleistungen absichern.", 22, 600, C.text)}
     ${card(92, 548, 820, 266, "STANDARDS UND LEITFÄDEN", "AIAG & VDA FMEA-Handbuch · IEC 60812 · SAE J1739", C.secondary, C.secondarySoft, { bodySize: 24 })}`);
  const goal = group("s71_goal", "Ziel der Anwendung",
    `${box(980, 224, 848, 590, C.surface, C.deep, 2, 14)}
     ${pill(1028, 270, 180, "ZIEL", C.accent, C.accentSoft)}
     ${bulletList(1032, 376, 720, [
       "Potenzielle Fehler identifizieren",
       "Ursachen und Auswirkungen analysieren",
       "Maßnahmen zur Risikominimierung entwickeln",
     ], C.accent, 25, 116)}`);
  return {
    archetype: "use-and-goal",
    layout: "Einsatz und Standards links, methodisches Ziel rechts.",
    takeaway: "FMEA identifiziert potenzielle Fehler, analysiert Ursachen und Auswirkungen und entwickelt Maßnahmen.",
    body: use + goal,
    targets: [
      target("s71_use", "Einsatzbereiche", 71, ["eingesetzt", "Branchen"]),
      target("s71_goal", "Ziel der Anwendung", 71, ["Ziel", "potenzielle Fehler"]),
    ],
  };
}

function scene74() {
  const items = [
    ["ANALYSEUMFANG", "Produkt oder Produktbereich bestimmen; Betrachtungsebene als System, Teilsystem oder Komponente festlegen.", C.accent, C.accentSoft],
    ["INFORMATIONEN", "Vorliegende Erkenntnisse aus Vorgänger-FMEA, früheren Projekten und Lessons Learned sammeln.", C.secondary, C.secondarySoft],
    ["FMEA-TEAM", "Interdisziplinäres Team mit unterschiedlichen Rollen und Fachbereichen zusammenstellen.", C.success, C.successSoft],
  ];
  const body = processStrip(1, 172, true) + items.map(([title, text, color, fill], index) =>
    group(`s74_task_${index + 1}`, title, card(92 + index * 584, 370, 540, 420, title, text, color, fill, { titleSize: 24, bodySize: 22 }))).join("");
  return {
    archetype: "three-part-workflow",
    layout: "Kompakter Prozesskontext und drei gleichwertige Vorbereitungsaufgaben.",
    takeaway: "Schritt 1 definiert Umfang, Informationsbasis und Team.",
    body,
    targets: [
      target("s74_task_1", "ANALYSEUMFANG", 74, ["Analyseumfang festgelegt"]),
      target("s74_task_2", "INFORMATIONEN", 74, ["Anschließend sammeln wir"]),
      target("s74_task_3", "FMEA-TEAM", 74, ["Zusammenstellung eines geeigneten Teams"]),
    ],
  };
}

function scene75() {
  const links = group("s75_links", "Teamstruktur",
    `${pathLine("M 960 360 V 414 M 960 550 V 612", C.deep, 2.2)}`);
  const structure = group("s75_structure", "FMEA-Team",
    `${box(690, 254, 540, 106, C.deep, C.deep, 2, 12)}${txt(960, 320, "FMEA-MODERATOR", 28, 820, C.surface, "middle")}
     ${box(520, 414, 880, 136, C.accentSoft, C.accent, 2, 12)}${txt(960, 466, "BASISTEAM", 27, 820, C.accent, "middle")}
     ${multi(960, 508, 760, "Methodenkompetenz · Moderation · Organisation · Grundkenntnisse der FMEA", 20, 640, C.deep, "middle")}
     ${box(300, 612, 1320, 210, C.successSoft, C.success, 2, 12)}${txt(960, 664, "ERWEITERTES TEAM MIT EXPERTEN", 27, 820, C.success, "middle")}
     ${multiRows(960, 718, 1160, "Expertenwissen aus Design, Qualität und weiteren Fachbereichen · Wissensträger aus Labor, Kundendienst und Rechtsabteilung", 22, 650, C.deep, "middle")}`);
  return {
    archetype: "team-hierarchy",
    layout: "Dreistufige Teamhierarchie mit Rollen und Kompetenzen.",
    takeaway: "Moderator, Basisteam und erweiterte Experten bringen unterschiedliche Kompetenzen in die FMEA ein.",
    body: processStrip(1, 172, true) + links + structure,
    targets: [
      target("s75_structure", "FMEA-Team", 75, ["Zusammenstellung eines geeigneten Teams"]),
      target("s75_links", "Teamstruktur", 75, ["Das Team wird in der Regel von einem Moderator begleitet"], "draw"),
    ],
  };
}

function scene79() {
  const boundary = group("s79_boundary", "Systemgrenze",
    `<rect x="248" y="316" width="1424" height="476" rx="18" fill="${C.surface}" fill-opacity=".76" stroke="${C.failure}" stroke-width="3" stroke-dasharray="11 8"/>
     ${pill(280, 338, 220, "SYSTEMGRENZE", C.failure, C.surface)}`);
  const elements = group("s79_elements", "Systemelemente",
    `${box(420, 472, 250, 116, C.deep, C.deep, 1.5, 10)}${txt(545, 540, "SYSTEMELEMENT", 21, 800, C.surface, "middle")}
     ${box(835, 472, 250, 116, C.deep, C.deep, 1.5, 10)}${txt(960, 540, "SYSTEMELEMENT", 21, 800, C.surface, "middle")}
     ${box(1250, 472, 250, 116, C.deep, C.deep, 1.5, 10)}${txt(1375, 540, "SYSTEMELEMENT", 21, 800, C.surface, "middle")}`);
  return {
    archetype: "system-boundary",
    layout: "Große Systemgrenze mit drei neutralen Systemelementen.",
    takeaway: "Die Strukturanalyse beginnt mit einer eindeutigen Systemgrenze.",
    body: processStrip(2, 172, true) + boundary + elements,
    targets: [
      target("s79_boundary", "Systemgrenze", 79, ["Systemgrenze", "abgegrenzt"]),
      target("s79_elements", "Systemelemente", 79, ["Systemelemente", "System"]),
    ],
  };
}

function scene80() {
  const tree = genericSystemTree(80);
  tree.body = `<rect x="146" y="264" width="1628" height="600" rx="18" fill="${C.surface}" fill-opacity=".55" stroke="${C.failure}" stroke-width="3" stroke-dasharray="11 8"/>` + tree.body;
  tree.layout = "Kanonischer Systembaum vollständig innerhalb der markierten Systemgrenze.";
  tree.takeaway = "Innerhalb der Systemgrenze werden alle Systemelemente hierarchisch strukturiert.";
  return tree;
}

function scene81() {
  const steps = [
    ["01", "SYSTEM ABGRENZEN", "Systemgrenze und Schnittstellen definieren."],
    ["02", "SYSTEM AUFTEILEN", "Teilsysteme, Baugruppen und Bauteile als eindeutige Systemelemente erfassen."],
    ["03", "SYSTEMBAUM ERSTELLEN", "Elemente hierarchisch anordnen; jedes Element kommt nur einmal vor."],
  ];
  const body = processStrip(2, 172, true) + steps.map(([number, title, text], index) =>
    group(`s81_step_${index + 1}`, title,
      `${box(92 + index * 584, 366, 540, 424, C.surface, [C.accent, C.secondary, C.success][index], 2, 14)}
       ${txt(140 + index * 584, 434, number, 44, 850, [C.accent, C.secondary, C.success][index])}
       ${txt(140 + index * 584, 492, title, 24, 820, C.deep)}
       ${multi(140 + index * 584, 560, 440, text, 23, 620, C.text)}`)).join("");
  return {
    archetype: "three-step-method",
    layout: "Drei nummerierte Arbeitsschritte der Strukturanalyse.",
    takeaway: "Abgrenzen, aufteilen und hierarchisch strukturieren bilden die Strukturanalyse.",
    body,
    targets: steps.map(([number, title], index) => target(`s81_step_${index + 1}`, `${number} ${title}`, 81, [title.split(" ")[0].toLocaleLowerCase("de-DE"), "System"])),
  };
}

function buildIntroAndEarlyScene(n) {
  if (n === 63) return scene63();
  if (n === 64) return scene64();
  if (n === 65) return scene65();
  if (n === 66) return scene66();
  if (n === 67) return scene67();
  if (n === 68) return scene68();
  if (n === 69) return scene69();
  if (n === 70) return scene70();
  if (n === 71) return scene71();
  if (n === 72) return processOnly(n, 0);
  if (n === 73) return processOnly(n, 1);
  if (n === 74) return scene74();
  if (n === 75) return scene75();
  if (n === 76) return goalScene(n, 1, "Definiere den Analyseumfang, sammle relevante Informationen und stelle das FMEA-Team zusammen.");
  if (n === 77) return processOnly(n, 0);
  if (n === 78) return processOnly(n, 2);
  if (n === 79) return scene79();
  if (n === 80) return scene80();
  if (n === 81) return scene81();
  if (n === 82) return goalScene(n, 2, "Erfasse und strukturiere alle beteiligten Systemelemente.");
  return null;
}

function gearHierarchy(n, mode = "structure", side = "antrieb") {
  const withFunctions = mode === "functions" || mode === "faults";
  const withFaults = mode === "faults";
  const level3 = side === "abtrieb"
    ? ["Ausgangswelle", "Zahnrad", "Rollenlager", "RWDR", "Passfeder", "Hülse"]
    : ["Eingangswelle", "Ritzel", "Rollenlager", "RWDR", "Passfeder", "Hülse"];
  const functions = side === "abtrieb"
    ? ["Abtriebsdrehmoment übertragen", "Drehmoment übertragen", "Wellen lagern", "Dichtheit gewährleisten", "Drehmoment übertragen", "Abstand gewährleisten"]
    : ["Antriebsdrehmoment übertragen", "Drehmoment übertragen", "Wellen lagern", "Dichtheit gewährleisten", "Drehmoment übertragen", "Abstand gewährleisten"];
  const faults = functions.map((value) => value.replace(" übertragen", " wird nicht übertragen").replace("Wellen lagern", "Lagerung nicht sichergestellt").replace(" gewährleisten", " nicht gewährleistet"));
  const x0 = 124;
  const nodeWidth = 250;
  const gap = 46;
  const y3 = 682;
  const connectors = group(`s${n}_gear_links`, "Hierarchische Verknüpfungen",
    `${pathLine("M 960 330 V 414 H 470 V 450 M 960 414 V 450 M 960 414 H 1450 V 450", C.deep, 2.2)}
     ${level3.map((_, index) => {
       const x = x0 + index * (nodeWidth + gap) + nodeWidth / 2;
       const parent = index < 2 ? 470 : index < 4 ? 960 : 1450;
       return pathLine(`M ${parent} 526 V 620 H ${x} V ${y3}`, C.deep, 1.8);
     }).join("")}`);
  const root = `${box(795, 254, 330, 76, C.deep, C.deep, 1.5, 8)}${txt(960, 302, "GETRIEBE", 24, 820, C.surface, "middle")}
    ${withFunctions ? `${pill(785, 344, 350, "DREHMOMENT & DREHZAHL WANDELN", C.success, C.successSoft)}` : ""}
    ${withFaults ? `${pill(806, 392, 308, "NICHT GEWANDELT", C.failure, C.failureSoft)}` : ""}`;
  const level2Labels = ["ANTRIEB", "ABTRIEB", "GEHÄUSE"];
  const level2 = level2Labels.map((label, index) => {
    const x = [340, 830, 1320][index];
    return `${box(x, 450, 260, 76, C.deep, C.deep, 1.5, 8)}${txt(x + 130, 498, label, 21, 820, C.surface, "middle")}`;
  }).join("");
  const children = level3.map((label, index) => {
    const x = x0 + index * (nodeWidth + gap);
    return `${box(x, y3, nodeWidth, 66, C.deep, C.deep, 1.3, 7)}
      ${multi(x + nodeWidth / 2, y3 + 40, nodeWidth - 20, label, 18, 800, C.surface, "middle", 1.02)}
      ${withFunctions ? `${box(x + 8, y3 + 78, nodeWidth - 16, 66, C.successSoft, C.success, 1.2, 7)}
        ${multi(x + nodeWidth / 2, y3 + 104, nodeWidth - 30, functions[index], 18, 680, C.success, "middle", 1.0)}` : ""}
      ${withFaults ? `${box(x + 14, y3 + 150, nodeWidth - 28, 62, C.failureSoft, C.failure, 1.3, 7)}
        ${multi(x + nodeWidth / 2, y3 + 176, nodeWidth - 42, faults[index], 18, 720, C.failure, "middle", 1.0)}` : ""}`;
  }).join("");
  const nodes = group(`s${n}_gear_nodes`, "Anpassungsgetriebe", root + level2 + children);
  return {
    archetype: "technical-hierarchy",
    layout: "Kanonischer Getriebebaum mit Systemelementen und optionalen Funktions-/Fehlerlagen.",
    takeaway: withFaults ? "Zu jeder Getriebefunktion wird eine konkrete Fehlfunktion dokumentiert." : withFunctions ? "Die Funktionen werden direkt an den Systemelementen des Getriebes geführt." : "Das Anpassungsgetriebe wird eindeutig in Antrieb, Abtrieb, Gehäuse und Komponenten zerlegt.",
    density: withFunctions ? "dense" : "balanced",
    body: processStrip(withFaults ? 4 : withFunctions ? 3 : 2, 172, true) + connectors + nodes,
    targets: [
      target(`s${n}_gear_nodes`, "Anpassungsgetriebe", n, ["Getriebe", "Systemstruktur", "Funktion"]),
      target(`s${n}_gear_links`, "Hierarchische Verknüpfungen", n, n === 95 ? ["Wir nutzen hierbei die Top-Down-Methode"] : ["Systembaum", "verknüpft", "Struktur"], "draw"),
    ],
  };
}

function scene86() {
  const media = group("s86_media", "Anpassungsgetriebe",
    `${box(92, 278, 1736, 574, C.surface, C.border, 1.5, 16)}
     ${image("gear-section.png", 136, 304, 790, 474, "Technischer Schnitt des Anpassungsgetriebes")}
     ${image("gear-schematic.png", 1010, 304, 730, 474, "Funktionsschema mit Ritzel und Zahnrad")}
     ${pill(276, 796, 500, "TECHNISCHER SCHNITT", C.accent, C.accentSoft)}
     ${pill(1126, 796, 500, "VEREINFACHTES SCHEMA", C.secondary, C.secondarySoft)}`);
  return {
    archetype: "technical-media",
    layout: "Zwei große, rahmenlose technische Quellmotive in einer gemeinsamen Medienfläche.",
    takeaway: "Technischer Schnitt und vereinfachtes Schema bilden die Grundlage für die FMEA des Anpassungsgetriebes.",
    body: processStrip(2, 172, true) + media,
    targets: [target("s86_media", "Anpassungsgetriebe", 86, ["Anpassungsgetriebe", "Getriebe"])],
  };
}

function scene87() {
  const media = group("s87_parts", "Stückliste",
    `${box(92, 278, 1736, 588, C.surface, C.border, 1.5, 16)}
     ${image("parts-antrieb.png", 126, 306, 800, 514, "Stückliste für Antrieb und Abtrieb")}
     ${image("parts-housing.png", 994, 306, 800, 514, "Stückliste für das Gehäuse")}
     ${pill(324, 818, 390, "BAUGRUPPEN 1 & 2", C.accent, C.accentSoft)}
     ${pill(1200, 818, 390, "BAUGRUPPE 3", C.secondary, C.secondarySoft)}`);
  return {
    archetype: "source-table",
    layout: "Zwei vergrößerte Stücklistenbereiche mit klarer Baugruppentrennung.",
    takeaway: "Die Stückliste liefert die eindeutige Komponentenbasis für den Systembaum.",
    body: processStrip(2, 172, true) + media,
    targets: [target("s87_parts", "Stückliste", 87, ["Stückliste", "Bauteile"])],
  };
}

function scene92() {
  const principle = group("s92_principle", "Top-down-Funktionszuordnung",
    `${box(92, 278, 1736, 578, C.surface, C.border, 1.5, 16)}
     ${image("function-assignment-principle.png", 188, 306, 1544, 458, "Top-down-Zuordnung von Funktionen zu Systemelementen")}
     ${box(318, 782, 1284, 62, C.accentSoft, C.accent, 1.5, 8)}
     ${multi(960, 822, 1190, "Jedem Systemelement in der Struktur wird mindestens eine Funktion zugeordnet.", 23, 760, C.deep, "middle")}`);
  return {
    archetype: "technical-diagram",
    layout: "Großes quelltreues Top-down-Diagramm mit einer gebündelten Kernaussage.",
    takeaway: "Funktionen werden top-down vom System bis zum Bauteil zugeordnet.",
    body: processStrip(3, 172, true) + principle,
    targets: [target("s92_principle", "Top-down-Funktionszuordnung", 92, ["mindestens eine Funktion", "top-down"])],
  };
}

function functionToFaultScene(n, concrete = false) {
  const functionLabel = concrete ? "Drehmoment übertragen" : "Funktion 1";
  const faultLabels = concrete
    ? ["Drehmoment wird nicht übertragen", "Drehmoment wird nur teilweise übertragen"]
    : ["Fehler 1.1", "Fehler 1.2", "Fehler 1.3"];
  const links = group(`s${n}_fault_links`, "Zuordnung der Fehlfunktionen",
    faultLabels.map((_, index) => line(800, 506, 1048, 368 + index * 150, C.failure, 2.3, true)).join(""));
  const functionNode = group(`s${n}_function`, "Funktion",
    `${box(288, 420, 512, 172, C.successSoft, C.success, 2, 12)}
     ${txt(544, 476, "FUNKTION", 20, 820, C.success, "middle")}
     ${multi(544, 532, 430, functionLabel, 30, 800, C.deep, "middle")}`);
  const faults = group(`s${n}_faults`, "Fehlfunktionen",
    faultLabels.map((label, index) =>
      `${box(1048, 304 + index * 150, 580, 104, C.failureSoft, C.failure, 2, 10)}
       ${multi(1338, 360 + index * 150, 510, label, concrete ? 24 : 28, 780, C.failure, "middle")}`).join(""));
  const rule = group(`s${n}_rule`, "Negationsprinzip",
    `${box(288, 690, 1340, 128, C.surface, C.border, 1.5, 10)}
     ${txt(326, 738, "REGEL", 19, 820, C.accent)}
     ${multi(466, 738, 1110, "Fehlfunktion = Funktion nicht erfüllt oder nur teilweise erfüllt.", 25, 720, C.deep)}`);
  return {
    archetype: "function-fault-mapping",
    layout: "Eine Funktion links und zugeordnete Fehlfunktionen rechts; Verbinder liegen hinter den Knoten.",
    takeaway: "Jeder Funktion wird mindestens eine negierte oder eingeschränkte Fehlfunktion zugeordnet.",
    body: processStrip(4, 172, true) + links + functionNode + faults + rule,
    targets: [
      target(`s${n}_function`, "Funktion", n, ["Funktion"]),
      target(`s${n}_faults`, "Fehlfunktionen", n, ["Fehlfunktion", "nicht"]),
      target(`s${n}_fault_links`, "Zuordnung", n, ["zugeordnet"], "draw"),
      target(`s${n}_rule`, "Negationsprinzip", n, ["Nichterfüllung", "Negation"]),
    ],
  };
}

function sourceDiagramScene(n, filename, label, takeaway, options = {}) {
  const media = group(`s${n}_media`, label,
    `${box(92, options.y || 278, 1736, options.height || 578, C.surface, C.border, 1.5, 16)}
     ${image(filename, options.imageX || 132, options.imageY || 304, options.imageW || 1656, options.imageH || 500, label)}
     ${options.footer || ""}`);
  return {
    archetype: "source-asset-diagram",
    layout: "Vergrößertes, bereinigtes Quellasset als dominante technische Erklärfläche.",
    takeaway,
    density: "dense",
    body: processStrip(options.activeStep || 4, 172, true) + media,
    targets: [target(`s${n}_media`, label, n, options.cues || [label])],
  };
}

function fmeaRelationScene(n, levels) {
  const colors = [C.accent, C.failure, C.secondary];
  const rowYs = levels === 1 ? [446] : levels === 2 ? [354, 606] : [280, 508, 736];
  const rows = rowYs.map((y, index) => {
    const level = levels === 1 ? 2 : index + 1;
    const labels = ["Fehlerfolge", "Fehler (Fehlfunktion)", "Fehlerursache"];
    const link = `${line(626, y + 56, 760, y + 56, C.deep, 2, true)}${line(1160, y + 56, 1294, y + 56, C.deep, 2, true)}`;
    const nodes = labels.map((label, column) =>
      `${box(250 + column * 534, y, 400, 112, column === 1 ? C.failureSoft : C.surface, colors[column], 1.8, 10)}
       ${multi(450 + column * 534, y + 62, 350, label, 23, 780, column === 1 ? C.failure : C.deep, "middle")}`).join("");
    return `${annotationTxt(100, y + 65, `SYSTEMEBENE ${level}`)}${link}${nodes}`;
  }).join("");
  const links = group(`s${n}_relation_links`, "Fehlerbeziehungen", rows.match(/<path[\s\S]*?(?=<rect|<text x="108"|$)/g)?.join("") || "");
  const nodes = group(`s${n}_relation_nodes`, "Fehlerfolge, Fehler und Ursache", rows);
  return {
    archetype: "cause-fault-effect",
    layout: `${levels} Systemebene(n) mit derselben kanonischen Fehlerfolge-Fehler-Ursache-Logik.`,
    takeaway: "In der FMEA-Sicht wird derselbe Fehler je nach Ebene als Folge, Fehlfunktion oder Ursache gelesen.",
    body: processStrip(4, 172, true) + nodes,
    targets: [target(`s${n}_relation_nodes`, "Fehlerzusammenhang", n, ["Fehlerfolge", "Fehlerursache", "Systemebene"])],
  };
}

function scene104() {
  const left = group("s104_tree", "Funktions- und Fehlerbaum",
    `${box(92, 278, 880, 562, C.surface, C.border, 1.5, 14)}
     ${image("error-network-tree.png", 128, 316, 808, 448, "Hierarchischer Funktions- und Fehlerbaum")}`);
  const links = group("s104_links", "Überführung in das Fehlernetz",
    `${line(972, 540, 1100, 540, C.accent, 3, true)}`);
  const right = group("s104_network", "Fehlernetz oder Fehlerbaum",
    `${box(1100, 278, 728, 562, C.accentSoft, C.accent, 2, 14)}
     ${txt(1464, 340, "FEHLERNETZ / FEHLERBAUM", 24, 820, C.accent, "middle")}
     ${box(1282, 390, 364, 82, C.failureSoft, C.failure, 1.7, 8)}${multi(1464, 440, 320, "Topsystemfehler", 22, 780, C.failure, "middle")}
     ${line(1464, 472, 1464, 534, C.deep, 2)}
     ${box(1282, 534, 364, 82, C.surface, C.deep, 1.7, 8)}${multi(1464, 584, 320, "Teilsystemfehler", 22, 760, C.deep, "middle")}
     ${pathLine("M 1464 616 V 666 H 1320 V 700 M 1464 666 H 1608 V 700", C.deep, 2)}
     ${box(1160, 700, 320, 78, C.surface, C.accent, 1.5, 8)}${multi(1320, 748, 278, "Subsystemfehler 1", 20, 720, C.deep, "middle")}
     ${box(1448, 700, 320, 78, C.surface, C.secondary, 1.5, 8)}${multi(1608, 748, 278, "Subsystemfehler 2 / 3", 20, 720, C.deep, "middle")}`);
  return {
    archetype: "tree-to-network",
    layout: "Hierarchischer Fehlerbaum links, Überführung und Fehlernetz rechts.",
    takeaway: "Die hierarchisch zugeordneten Fehler werden zu einem Fehlernetz oder Fehlerbaum verknüpft.",
    body: processStrip(4, 172, true) + links + left + right,
    targets: [
      target("s104_tree", "Funktions- und Fehlerbaum", 104, ["Ursache-Wirkung-Prinzip"]),
      target("s104_network", "Fehlernetz", 104, ["Am oberen Ende der Fehlerkette"]),
      target("s104_links", "Überführung", 104, ["Am oberen Ende der Fehlerkette"], "draw"),
    ],
  };
}

function scene105() {
  const links = group("s105_links", "Ursache-Wirkungs-Kette",
    `${line(612, 536, 760, 536, C.failure, 2.5, true)}${line(1160, 536, 1308, 536, C.failure, 2.5, true)}`);
  const nodes = group("s105_nodes", "Autoreifen-Beispiel",
    `${card(92, 392, 520, 290, "FEHLERFOLGE (FF)", "Fahrzeug fahruntüchtig", C.accent, C.accentSoft, { titleSize: 22, bodySize: 30 })}
     ${card(760, 392, 400, 290, "FEHLER", "Plötzlicher Druckverlust", C.failure, C.failureSoft, { titleSize: 22, bodySize: 29 })}
     ${card(1308, 392, 520, 290, "FEHLERURSACHE (FU)", "Spitzer Gegenstand", C.secondary, C.secondarySoft, { titleSize: 22, bodySize: 30 })}`);
  return {
    archetype: "cause-fault-effect",
    layout: "Dreiteilige Ursache-Fehler-Folge-Kette am konkreten Autoreifen-Beispiel.",
    takeaway: "Ein spitzer Gegenstand verursacht Druckverlust und kann das Fahrzeug fahruntüchtig machen.",
    body: processStrip(4, 172, true) + links + nodes,
    targets: [
      target("s105_nodes", "Autoreifen-Beispiel", 105, ["Autoreifen", "Druckverlust"]),
      target("s105_links", "Ursache-Wirkungs-Kette", 105, ["Fehlerursache", "Fehlerfolge"], "draw"),
    ],
  };
}

function scene109() {
  const left = group("s109_failures", "Typische Ausfallarten",
    `${box(92, 278, 816, 554, C.accentSoft, C.accent, 2, 14)}
     ${txt(500, 336, "TYPISCHE AUSFALLARTEN", 27, 820, C.accent, "middle")}
     ${bulletList(142, 422, 710, ["Bruch · Kurzschluss", "Undichtheit · Leistungsabfall", "Falscher Druck · Blockierung", "Reibung · Unterbrechung", "Fluchtungsfehler"], C.accent, 23, 74)}`);
  const right = group("s109_causes", "Typische Ausfallursachen",
    `${box(1012, 278, 816, 554, C.secondarySoft, C.secondary, 2, 14)}
     ${txt(1420, 336, "TYPISCHE AUSFALLURSACHEN", 27, 820, C.secondary, "middle")}
     ${bulletList(1062, 422, 710, ["Falsche Materialwahl · Materialfehler", "Unzulässige Belastung · Ermüdung", "Korrosion · falscher Einbau", "Undichtheit · beschädigte Dichtfläche", "Personalfluktuation · fehlende Kontrolle"], C.secondary, 22, 74)}`);
  return {
    archetype: "two-column-list",
    layout: "Zwei ruhige Listen für physikalische Ausfallarten und typische Ursachen.",
    takeaway: "Auf Bauteilebene werden physikalische Ausfallarten und ihre möglichen Ursachen konkret.",
    body: processStrip(4, 172, true) + left + right,
    targets: [
      target("s109_failures", "Typische Ausfallarten", 109, ["Ausfallarten", "Bruch"]),
      target("s109_causes", "Typische Ausfallursachen", 109, ["Ausfallursachen", "Materialwahl"]),
    ],
  };
}

function buildStructureAndFailureScene(n) {
  if (n === 83) return genericSystemTree(n, { focusLevel: 1, linkCues: ["direkt mit dem Systemelement eins verbunden"] });
  if (n === 84) return genericSystemTree(n, { focusLevel: 2, linkCues: ["direkt mit dem Systemelement eins verbunden"] });
  if (n === 85) return genericSystemTree(n, { focusLevel: 3, linkCues: ["direkt mit dem Systemelement eins verbunden"] });
  if (n === 86) return scene86();
  if (n === 87) return scene87();
  if (n === 88) return gearHierarchy(n, "structure", "antrieb");
  if (n === 89) return gearHierarchy(n, "structure", "abtrieb");
  if (n === 90) return processOnly(n, 0);
  if (n === 91) return processOnly(n, 3);
  if (n === 92) return scene92();
  if (n === 93) return genericSystemTree(n, { withFunctions: true });
  if (n === 94) return goalScene(n, 3, "Ordne die Funktionen den Systemelementen zu und verknüpfe sie hierarchisch.");
  if (n === 95) return gearHierarchy(n, "functions", "antrieb");
  if (n === 96) return processOnly(n, 0);
  if (n === 97) return processOnly(n, 4);
  if (n === 98) return functionToFaultScene(n, false);
  if (n === 99) return functionToFaultScene(n, true);
  if (n === 100) return goalScene(n, 4, "Ordne den Systemelementen Fehlfunktionen zu und verknüpfe ihre Fehlerzusammenhänge.");
  if (n === 101) return genericSystemTree(n, { withFunctions: true, linkCues: ["Blick auf unsere Systemstruktur"] });
  if (n === 102) return genericSystemTree(n, { withFunctions: true, withFaults: true, linkCues: ["Blick auf unsere Systemstruktur"] });
  if (n === 103) return sourceDiagramScene(n, "generic-function-error-tree.png", "Vollständiger Funktions- und Fehlerbaum", "Alle Systemelemente, Funktionen und Fehlfunktionen sind in einem gemeinsamen Baum verknüpft.", { imageX: 170, imageY: 286, imageW: 1580, imageH: 500, cues: ["Fehler", "Systemelement"] });
  if (n === 104) return scene104();
  if (n === 105) return scene105();
  if (n === 106) return fmeaRelationScene(n, 1);
  if (n === 107) return fmeaRelationScene(n, 2);
  if (n === 108) return fmeaRelationScene(n, 3);
  if (n === 109) return scene109();
  if (n === 110) return gearHierarchy(n, "faults", "antrieb");
  if (n === 111) return processOnly(n, 0);
  return null;
}

function baeTabs(focus = "") {
  const tabs = [
    ["B", "BEDEUTUNG", C.accent, C.accentSoft],
    ["A", "AUFTRETENSWAHRSCHEINLICHKEIT", C.secondary, C.secondarySoft],
    ["E", "ENTDECKUNGSWAHRSCHEINLICHKEIT", C.success, C.successSoft],
  ];
  return tabs.map(([key, label, color, fill], index) => {
    const x = 196 + index * 530;
    const active = !focus || focus === key;
    return `${box(x, 290, 470, 92, active ? color : C.surfaceSoft, active ? color : C.border, 1.8, 10)}
      ${txt(x + 42, 348, key, 30, 850, active ? C.surface : C.soft)}
      ${txt(x + 98, 348, label, 19, 800, active ? C.surface : C.soft)}`;
  }).join("");
}

function scene113() {
  const tabs = group("s113_tabs", "B, A und E", baeTabs(""));
  const scale = group("s113_scale", "Bewertungsskala",
    `${line(306, 584, 1614, 584, C.deep, 3)}
     ${Array.from({ length: 10 }, (_, index) => {
       const x = 306 + index * (1308 / 9);
       const color = index < 3 ? C.semanticSuccess : index < 7 ? C.semanticWarning : C.failure;
       return `${line(x, 568, x, 600, color, 3)}${txt(x, 642, String(index + 1), 20, 800, color, "middle")}`;
     }).join("")}
     ${pill(650, 700, 620, "BEWERTUNGSSKALA VON 1 BIS 10", C.deep, C.surface)}`);
  return {
    archetype: "rating-overview",
    density: "dense",
    layout: "Drei Bewertungsgrößen oben und eine gemeinsame Zehnerskala darunter.",
    takeaway: "Bedeutung, Auftreten und Entdeckung werden jeweils von 1 bis 10 bewertet.",
    body: processStrip(5, 172, true) + tabs + scale,
    targets: [
      target("s113_tabs", "B, A und E", 113, ["Bedeutung", "Auftretenswahrscheinlichkeit", "Entdeckungswahrscheinlichkeit"]),
      target("s113_scale", "Bewertungsskala", 113, ["Skala", "1 bis 10"]),
    ],
  };
}

function ratingDetailScene(n, key, title, description, low, high, note, color, fill) {
  const tabs = baeTabs(key);
  const detail = group(`s${n}_detail`, title,
    `${box(164, 430, 1592, 380, fill, color, 2, 14)}
     ${txt(218, 494, title.toUpperCase(), 28, 850, color)}
     ${multi(218, 548, 1460, description, 25, 700, C.deep)}
     ${box(220, 640, 560, 90, C.surface, color, 1.5, 9)}
     ${txt(258, 696, "1", 32, 850, C.semanticSuccess)}${multi(318, 687, 410, low, 21, 700, C.deep)}
     ${line(820, 686, 1100, 686, color, 3, true)}
     ${box(1140, 640, 560, 90, C.surface, color, 1.5, 9)}
     ${txt(1178, 696, "10", 32, 850, C.failure)}${multi(1258, 687, 390, high, 21, 700, C.deep)}
     ${multi(960, 774, 1410, note, 20, 620, C.muted, "middle")}`);
  return {
    archetype: "rating-detail",
    layout: "Bewertungsgröße als aktive Registerkarte mit klaren Skalenankern 1 und 10.",
    takeaway: `${title} wird anhand einer einheitlichen Skala von 1 bis 10 bewertet.`,
    body: processStrip(5, 172, true) + tabs + detail,
    targets: [target(`s${n}_detail`, title, n, [title, description.split(" ")[0]])],
  };
}

function scene117() {
  const tabs = group("s117_tabs", "B, A und E", baeTabs(""));
  const summaries = group("s117_summary", "Bewertungslogik",
    `${card(196, 454, 470, 300, "B · BEDEUTUNG", "Ausmaß der Fehlerfolge aus Sicht des Endverbrauchers.", C.accent, C.accentSoft)}
     ${card(726, 454, 470, 300, "A · AUFTRETEN", "Wirksamkeit präventiver Maßnahmen gegen das Auftreten.", C.secondary, C.secondarySoft)}
     ${card(1256, 454, 470, 300, "E · ENTDECKUNG", "Wirksamkeit von Maßnahmen zum Aufdecken der Fehlerursache.", C.success, C.successSoft)}`);
  return {
    archetype: "rating-summary",
    layout: "Drei identische Bewertungsrollen in einer gemeinsamen Zusammenfassung.",
    takeaway: "B bewertet die Folge, A das Auftreten und E die Entdeckung.",
    body: processStrip(5, 172, true) + tabs + summaries,
    targets: [
      target("s117_tabs", "B, A und E", 117, ["Bedeutung", "Auftretens", "Entdeckungs"]),
      target("s117_summary", "Bewertungslogik", 117, ["Bewertung", "Skala"]),
    ],
  };
}

function scene118() {
  const guidance = group("s118_guidance", "Bewertungsgrundsätze",
    `${box(92, 278, 610, 568, C.surface, C.border, 1.5, 14)}
     ${txt(136, 336, "BEWERTUNG VON B, A UND E", 24, 820, C.deep)}
     ${bulletList(136, 392, 510, [
       "Eindeutige und einheitliche Kriterien verwenden",
       "Anforderungen, Strategie und Produkt des Unternehmens berücksichtigen",
       "Tabellen nach AIAG/VDA (2019) einsetzen",
     ], C.accent, 22, 120)}`);
  const table = group("s118_table", "Bewertungskriterien",
    `${box(746, 278, 1082, 568, C.surface, C.border, 1.5, 14)}
     ${image("risk-criteria-table.png", 786, 304, 1000, 504, "Kriterien für die Bewertungsgrößen B, A und E")}`);
  return {
    archetype: "media-aside",
    layout: "Bewertungsgrundsätze links und vergrößerte Kriterien-Tabelle rechts.",
    takeaway: "B, A und E werden anhand eindeutiger, unternehmensspezifisch festgelegter Kriterien bewertet.",
    body: processStrip(5, 172, true) + guidance + table,
    targets: [
      target("s118_guidance", "Bewertungsgrundsätze", 118, ["Kriterien", "Unternehmen"]),
      target("s118_table", "Bewertungskriterien", 118, ["AIAG", "Tabelle"]),
    ],
  };
}

function scene119() {
  return sourceDiagramScene(119, "risk-table-full.png", "Bewertungstabelle der System-FMEA", "Die Kriterien für Bedeutung, Auftreten und Entdeckung werden in einer gemeinsamen Tabelle dokumentiert.", {
    activeStep: 5, y: 278, height: 590, imageX: 210, imageY: 300, imageW: 1500, imageH: 540, cues: ["Bewertung", "Tabelle"],
  });
}

function rpzFormulaMarkup(x, y, scale = 1) {
  return `${txt(x, y, "RPZ", 66 * scale, 850, C.deep)}
    ${txt(x + 176 * scale, y, "=", 60 * scale, 700, C.soft)}
    ${txt(x + 270 * scale, y, "B", 66 * scale, 850, C.accent)}
    ${txt(x + 365 * scale, y, "·", 58 * scale, 760, C.soft)}
    ${txt(x + 430 * scale, y, "A", 66 * scale, 850, C.secondary)}
    ${txt(x + 525 * scale, y, "·", 58 * scale, 760, C.soft)}
    ${txt(x + 590 * scale, y, "E", 66 * scale, 850, C.success)}`;
}

function scene120() {
  const formula = group("s120_formula", "Risikoprioritätszahl",
    `${box(246, 296, 1428, 326, C.surface, C.deep, 2, 16)}
     ${txt(960, 366, "RISIKOPRIORITÄTSZAHL", 24, 820, C.soft, "middle")}
     ${rpzFormulaMarkup(570, 500, 1)}
     ${pill(706, 550, 508, "WERTEBEREICH 1 BIS 1000", C.deep, C.surface)}`);
  const parameters = group("s120_parameters", "Bewertungsgrößen",
    `${card(246, 662, 430, 174, "B · BEDEUTUNG", "Wertebereich 1 bis 10", C.accent, C.accentSoft)}
     ${card(744, 662, 430, 174, "A · AUFTRETEN", "Wertebereich 1 bis 10", C.secondary, C.secondarySoft)}
     ${card(1242, 662, 430, 174, "E · ENTDECKUNG", "Wertebereich 1 bis 10", C.success, C.successSoft)}`);
  return {
    archetype: "formula",
    layout: "Kontrolliert gesetzte kurze Produktformel mit drei direkt zugeordneten Parametern.",
    takeaway: "Die RPZ ist das Produkt aus Bedeutung, Auftreten und Entdeckung und reicht von 1 bis 1000.",
    body: processStrip(5, 172, true) + formula + parameters,
    targets: [
      target("s120_parameters", "Bewertungsgrößen", 120, ["Bedeutung", "Auftreten", "Entdeckung"]),
      target("s120_formula", "Risikoprioritätszahl", 120, ["Risikoprioritätszahl", "RPZ"]),
    ],
  };
}

function scene121() {
  const formula = group("s121_formula", "RPZ",
    `${box(92, 272, 760, 520, C.surface, C.deep, 2, 14)}
     ${txt(472, 342, "RISIKOPRIORITÄTSZAHL", 24, 820, C.deep, "middle")}
     ${rpzFormulaMarkup(194, 476, .8)}
     ${pill(280, 548, 384, "1 BIS 1000", C.deep, C.surface)}
     ${multi(472, 682, 640, "klassische multiplikative Risikobewertung", 22, 650, C.muted, "middle")}`);
  const arrow = group("s121_transition", "Weiterentwicklung",
    `${line(852, 532, 1018, 532, C.accent, 4, true)}`);
  const matrix = group("s121_matrix", "Aufgabenpriorität",
    `${box(1018, 272, 810, 520, C.accentSoft, C.accent, 2, 14)}
     ${txt(1423, 342, "AUFGABENPRIORITÄT", 24, 820, C.accent, "middle")}
     ${image("task-priority-compact.png", 1150, 378, 546, 340, "Aufgabenprioritätsmatrix nach AIAG/VDA")}`);
  return {
    archetype: "method-transition",
    layout: "RPZ links, gerichtete Weiterentwicklung und Aufgabenpriorität rechts.",
    takeaway: "Das AIAG/VDA-Handbuch ergänzt die RPZ um die risikoorientierte Aufgabenpriorität.",
    body: processStrip(5, 172, true) + formula + arrow + matrix,
    targets: [
      target("s121_formula", "RPZ", 121, ["RPZ", "Risikoprioritätszahl"]),
      target("s121_matrix", "Aufgabenpriorität", 121, ["Aufgabenpriorität", "AIAG"]),
      target("s121_transition", "Weiterentwicklung", 121, ["Aufgabenpriorität"], "draw"),
    ],
  };
}

function taskPriorityScene(n, level = "") {
  const color = level === "hoch" ? C.failure : level === "mittel" ? C.semanticWarning : level === "niedrig" ? C.semanticSuccess : C.accent;
  const fill = level === "hoch" ? C.failureSoft : level === "mittel" ? C.semanticWarningSoft : level === "niedrig" ? C.semanticSuccessSoft : C.accentSoft;
  const texts = {
    hoch: ["HOCH · HOHE PRIORITÄT", "Eine angemessene Maßnahme muss definiert werden – oder die Angemessenheit bestehender Maßnahmen wird begründet und dokumentiert."],
    mittel: ["MITTEL · MITTLERE PRIORITÄT", "Eine angemessene Maßnahme sollte definiert werden – oder die Angemessenheit bestehender Maßnahmen wird begründet und dokumentiert."],
    niedrig: ["NIEDRIG · NIEDRIGE PRIORITÄT", "Maßnahmen können definiert werden. Ohne weitere Maßnahme ist keine zusätzliche Dokumentation notwendig."],
  };
  const explanation = group(`s${n}_explanation`, level ? texts[level][0] : "Aufgabenpriorität",
    `${box(92, 278, 704, 546, fill, color, 2, 14)}
     ${txt(138, 338, level ? texts[level][0] : "AUFGABENPRIORITÄT", 25, 840, color)}
     ${level
       ? multiRows(138, 400, 610, texts[level][1], 23, 650, C.deep)
       : bulletList(138, 392, 610, [
         "Prioritätsstufen hoch, mittel und niedrig",
         "Kombination der Einzelbewertungen in einer Tabelle",
         "Priorisierung konkreter Maßnahmen",
         "Erleichterte Entscheidungsfindung",
       ], color, 22, 92)}
     ${level ? pill(210, 706, 470, level.toUpperCase(), color, C.surface) : ""}`);
  const matrix = group(`s${n}_matrix`, "Aufgabenprioritätsmatrix",
    `${box(850, 278, 978, 546, C.surface, C.border, 1.5, 14)}
     ${image("task-priority-matrix.png", 998, 300, 680, 492, "Aufgabenprioritätsmatrix")}`);
  return {
    archetype: "priority-matrix",
    layout: "Handlungsaussage links und vergrößerte Aufgabenprioritätsmatrix rechts.",
    takeaway: level ? `Die Aufgabenpriorität ${level} bestimmt die Verbindlichkeit weiterer Maßnahmen.` : "Die Aufgabenpriorität übersetzt kombinierte Bewertungen in konkrete Handlungsempfehlungen.",
    body: processStrip(5, 172, true) + explanation + matrix,
    targets: [
      target(`s${n}_explanation`, level ? texts[level][0] : "Aufgabenpriorität", n, level ? [level, "Maßnahme"] : ["Prioritätsstufen", "Maßnahmen"]),
      target(`s${n}_matrix`, "Aufgabenprioritätsmatrix", n, ["Tabelle", "kombiniert"]),
    ],
  };
}

function scene129() {
  const levers = [
    ["01", "AUFTRETEN REDUZIEREN", "Fehlerursachen abstellen; Konstruktion oder Prozess verändern.", C.failure, C.failureSoft],
    ["02", "BEDEUTUNG REDUZIEREN", "Konzeptionelle Änderungen wie Redundanz oder Fehleranzeigen vorsehen.", C.secondary, C.secondarySoft],
    ["03", "ENTDECKUNG ERHÖHEN", "Konstruktion, Prüfverfahren oder Kontrollmechanismen verbessern.", C.accent, C.accentSoft],
  ];
  const body = processStrip(6, 172, true) + levers.map(([number, title, text, color, fill], index) =>
    group(`s129_lever_${index + 1}`, title,
      `${box(92 + index * 584, 368, 540, 430, fill, color, 2, 14)}
       ${txt(136 + index * 584, 438, number, 44, 850, color)}
       ${multi(136 + index * 584, 504, 446, title, 24, 820, C.deep)}
       ${multi(136 + index * 584, 602, 446, text, 22, 620, C.text)}`)).join("");
  return {
    archetype: "three-lever-optimization",
    layout: "Drei nummerierte Optimierungshebel mit klarer Bewertungszuordnung.",
    takeaway: "Optimierung reduziert Auftreten oder Bedeutung und erhöht die Entdeckungswahrscheinlichkeit.",
    body,
    targets: levers.map(([number, title], index) => target(`s129_lever_${index + 1}`, `${number} ${title}`, 129, [title.split(" ")[0].toLocaleLowerCase("de-DE"), "Optimierungsmaßnahmen"])),
  };
}

function formScene(n, stage) {
  const media = group(`s${n}_form`, `FMEA-Formblatt Stufe ${stage}`,
    `${box(92, 278, 1736, 588, C.surface, C.border, 1.5, 14)}
     ${image(`fmea-form-${n}.png`, 124, 306, 1672, 500, "FMEA-Formblatt mit stufenweise aktivierten Analysebereichen")}
     ${pill(650, 828, 620, `AUSBAUSTUFE ${stage} VON 4`, stage === 4 ? C.secondary : C.accent, C.surface)}`);
  return {
    archetype: "documentation-form",
    layout: "Vergrößertes und vom PowerPoint-Bedienelement bereinigtes FMEA-Formblatt.",
    takeaway: ["Das Formblatt ordnet die vollständige FMEA-Dokumentation in feste Spalten.", "Struktur- und Funktionsanalyse bilden die linke Informationsbasis.", "Fehler- und Risikoanalyse ergänzen die Bewertungsfelder.", "Der Optimierungsbereich dokumentiert Verantwortlichkeiten, Termine und Neubewertung."][stage - 1],
    density: "dense",
    body: processStrip(7, 172, true) + media,
    targets: [target(`s${n}_form`, `FMEA-Formblatt Stufe ${stage}`, n, ["Formblatt", "Dokumentation", "Struktur"])],
  };
}

function nativeFormScene(n, stage) {
  const columns = [
    ["STRUKTUR", "Systemelement · nächsthöhere Ebene", C.secondarySoft, C.secondary],
    ["FUNKTION", "Funktion · Anforderung", C.accentSoft, C.accent],
    ["FEHLER", "Fehlerfolge · Fehler · Ursache", C.failureSoft, C.failure],
    ["RISIKO", "B · A · E · Aufgabenpriorität", C.secondarySoft, C.secondary],
    ["OPTIMIERUNG", "Maßnahme · verantwortlich · Termin · Neubewertung", C.accentSoft, C.accent],
  ];
  const widths = [280, 280, 360, 330, 450];
  let cursor = 110;
  const columnMarkup = columns.map(([title, fields, fill, color], index) => {
    const width = widths[index];
    const active = stage === 4 || index < Math.min(columns.length, stage + 1);
    const markup = `${box(cursor, 354, width, 388, active ? fill : C.surfaceSoft, active ? color : C.border, active ? 2 : 1.5, 10)}
      ${box(cursor, 354, width, 76, active ? color : C.soft, active ? color : C.soft, 1, 10)}
      ${txt(cursor + width / 2, 402, title, 22, 840, C.surface, "middle")}
      ${multi(cursor + 24, 478, width - 48, fields, 21, 680, C.deep)}
      ${line(cursor + 24, 562, cursor + width - 24, 562, C.border, 1.5, "none")}
      ${line(cursor + 24, 646, cursor + width - 24, 646, C.border, 1.5, "none")}`;
    cursor += width + 12;
    return markup;
  }).join("");
  const media = group(`s${n}_form`, `FMEA-Formblatt Stufe ${stage}`,
    `${box(92, 278, 1736, 588, C.surface, C.border, 1.5, 14)}
     ${txt(122, 326, "FMEA-FORMBLATT", 24, 840, C.deep)}
     ${pill(1390, 296, 390, "EINE ZEILE = EIN FEHLERZUSAMMENHANG", C.accent, C.surface)}
     ${columnMarkup}
     ${pill(650, 804, 620, stage === 4 ? "VOLLSTÄNDIGE DOKUMENTATIONSLOGIK" : `AUSBAUSTUFE ${stage} VON 4`, stage === 4 ? C.secondary : C.accent, C.surface)}`);
  return {
    archetype: "documentation-form",
    layout: "Native FMEA-Formularübersicht ohne Crop- oder Rasterartefakte.",
    takeaway: ["Das Formblatt ordnet die vollständige FMEA-Dokumentation in feste Spalten.", "Struktur- und Funktionsanalyse bilden die linke Informationsbasis.", "Fehler- und Risikoanalyse ergänzen die Bewertungsfelder.", "Der Optimierungsbereich dokumentiert Verantwortlichkeiten, Termine und Neubewertung."][stage - 1],
    density: "dense",
    body: processStrip(7, 172, true) + media,
    targets: [target(`s${n}_form`, `FMEA-Formblatt Stufe ${stage}`, n, ["Formblatt", "Dokumentation", "Struktur"])],
  };
}

function scene137() {
  const intro = group("s137_intro", "Dokumentationsprinzip",
    `${box(92, 278, 1736, 150, C.deep, C.deep, 1.5, 10)}
     ${txt(132, 326, "DOKUMENTATION DER FMEA-ERGEBNISSE", 23, 820, C.accentSoft)}
     ${txt(132, 370, "Alle Erkenntnisse und Maßnahmen werden dynamisch, iterativ und nachvollziehbar", 22, 680, C.surface)}
     ${txt(132, 399, "sowie transparent in den Formblättern dokumentiert.", 22, 680, C.surface)}`);
  const goals = group("s137_goals", "Ziele",
    `${box(92, 456, 1736, 386, C.surface, C.border, 1.5, 14)}
     ${bulletList(142, 518, 1600, [
       "Aktuelle Risiken und getroffene Maßnahmen nachvollziehbar dokumentieren",
       "Wissen an Teammitglieder und Abteilungen weitergeben",
       "Wirksamkeit prüfen und Risiken iterativ neu bewerten",
       "Fortschritt und Maßnahmenumsetzung überwachen",
       "Stakeholder informieren und regulatorische Anforderungen einhalten",
     ], C.accent, 22, 68)}`);
  return {
    archetype: "documentation-goals",
    layout: "Ein dokumentarisches Grundprinzip und fünf zusammengehörige Ergebnisziele.",
    takeaway: "Ergebnisdokumentation schafft Transparenz, Wissensweitergabe, Wirksamkeitskontrolle und Nachweisfähigkeit.",
    body: processStrip(7, 172, true) + intro + goals,
    targets: [
      target("s137_intro", "Dokumentationsprinzip", 137, ["Formblättern", "dokumentiert"]),
      target("s137_goals", "Ziele", 137, ["Ziele", "Wissensweitergabe", "Überwachung"]),
    ],
  };
}

function buildRiskAndDocumentationScene(n) {
  if (n === 112) return processOnly(n, 5);
  if (n === 113) return scene113();
  if (n === 114) return ratingDetailScene(n, "B", "Bedeutung", "Ausmaß der Fehlerfolge für das Gesamtsystem aus Sicht des Endverbrauchers.", "geringe Bedeutung", "hohe Bedeutung", "Gleiche Fehlerfolgen erhalten die gleiche Bewertung.", C.failure, C.failureSoft);
  if (n === 115) return ratingDetailScene(n, "A", "Auftretenswahrscheinlichkeit", "Wirksamkeit aller Vermeidungsmaßnahmen gegen das Auftreten einer Fehlerursache.", "sehr unwahrscheinlich", "nahezu sicher", "Bewertet wird unter Berücksichtigung aller präventiven Maßnahmen.", C.secondary, C.secondarySoft);
  if (n === 116) return ratingDetailScene(n, "E", "Entdeckungswahrscheinlichkeit", "Wirksamkeit aller Entdeckungsmaßnahmen zum Aufdecken einer Fehlerursache.", "nahezu sichere Entdeckung", "sehr unwahrscheinliche Entdeckung", "Bewertet wird unter Berücksichtigung aller vorhandenen Entdeckungsmaßnahmen.", C.accent, C.accentSoft);
  if (n === 117) return scene117();
  if (n === 118) return scene118();
  if (n === 119) return scene119();
  if (n === 120) return scene120();
  if (n === 121) return scene121();
  if (n === 122) return taskPriorityScene(n, "");
  if (n === 123) return taskPriorityScene(n, "hoch");
  if (n === 124) return taskPriorityScene(n, "mittel");
  if (n === 125) return taskPriorityScene(n, "niedrig");
  if (n === 126) return goalScene(n, 5, "Dokumentiere aktuelle Vermeidungs- und Entdeckungsmaßnahmen und bewerte den derzeitigen Stand.");
  if (n === 127) return processOnly(n, 0);
  if (n === 128) return processOnly(n, 6);
  if (n === 129) return scene129();
  if (n === 130) return goalScene(n, 6, "Reduziere das Risiko durch weitere Maßnahmen, Neubewertung und Zuverlässigkeitsabsicherung.");
  if (n === 131) return processOnly(n, 0);
  if (n === 132) return processOnly(n, 7);
  if (n >= 133 && n <= 136) return nativeFormScene(n, n - 132);
  if (n === 137) return scene137();
  if (n === 138) return processOnly(n, 0);
  return null;
}

function scene139() {
  const comparison = compareColumns(139,
    { title: "DESIGN-FMEA", subtitle: "Fokus Produktgestaltung", items: ["Designschwachstellen und Produktrisiken", "Komponenten, Baugruppen und Interaktionen"], cues: ["Design-Variante", "Produktgestaltung"] },
    { title: "PROZESS-FMEA", subtitle: "Fokus Fertigung und Montage", items: ["Prozessfehler in Abläufen", "Prozessschritte, Materialien und Betriebsmittel"], cues: ["prozessorientierte Analyse", "Fertigung und Montage"] },
    { y: 224, height: 470, gap: 96, takeaway: "Beide FMEA-Arten nutzen sieben Schritte, untersuchen aber unterschiedliche Objekte." });
  comparison.body += group("s139_summary", "Gemeinsamer Ablauf und unterschiedlicher Fokus",
    `${box(242, 746, 1436, 92, C.deep, C.deep, 1.5, 10)}
     ${multi(960, 802, 1320, "GLEICHER 7-SCHRITT-ABLAUF · UNTERSCHIEDLICHER ANALYSEFOKUS", 23, 820, C.surface, "middle")}`);
  comparison.targets.push(target("s139_summary", "Gemeinsamer Ablauf und unterschiedlicher Fokus", 139, ["sieben Schritte", "inhaltlichen Fokus"]));
  return comparison;
}

function scene142() {
  const items = [
    ["01", "ANALYSEUMFANG ABGRENZEN", "Produkt- oder Prozessbereich und Schnittstellen festlegen.", C.accent, C.accentSoft],
    ["02", "UNTERLAGEN SAMMELN", "Vorhandene Prozess-, Qualitäts- und Erfahrungsdaten zusammentragen.", C.secondary, C.secondarySoft],
    ["03", "TEAM ZUSAMMENSTELLEN", "Prozessexperten und relevante Fachbereiche einbinden.", C.success, C.successSoft],
  ];
  const body = processStrip(1, 172, true) + items.map(([number, title, text, color, fill], index) =>
    group(`s142_part_${index + 1}`, title,
      `${box(92 + index * 584, 374, 540, 400, fill, color, 2, 14)}
       ${txt(138 + index * 584, 442, number, 42, 850, color)}
       ${multi(138 + index * 584, 504, 442, title, 23, 820, C.deep)}
       ${multi(138 + index * 584, 602, 442, text, 22, 620, C.text)}`)).join("");
  return {
    archetype: "three-part-workflow",
    layout: "Drei nummerierte Aufgaben der Planung und Vorbereitung in der Prozess-FMEA.",
    takeaway: "Auch die Prozess-FMEA beginnt mit Analyseumfang, Unterlagen und Team.",
    body,
    targets: items.map(([number, title], index) => target(`s142_part_${index + 1}`, `${number} ${title}`, 142, [title.split(" ")[0].toLocaleLowerCase("de-DE"), "Unterlagen", "Team"])),
  };
}

function compareAssetScene(n, filename, label, side, activeStep, takeaway) {
  const color = side === "Design-FMEA" ? C.accent : C.secondary;
  const fill = side === "Design-FMEA" ? C.accentSoft : C.secondarySoft;
  const media = group(`s${n}_asset`, label,
    `${box(92, 278, 1736, 576, C.surface, C.border, 1.5, 14)}
     ${pill(132, 304, 260, side.toUpperCase(), color, fill)}
     ${image(filename, 170, 340, 1580, 452, label)}`);
  return {
    archetype: "source-asset-diagram",
    layout: "Vergrößertes, quelltreues Struktur-, Funktions- oder Fehlerdiagramm mit klarer FMEA-Zuordnung.",
    takeaway,
    density: "dense",
    body: processStrip(activeStep, 172, true) + media,
    targets: [target(`s${n}_asset`, label, n, [side, "Struktur", "Funktion", "Fehler"])],
  };
}

function scene155() {
  return compareColumns(155,
    {
      title: "DESIGN-FMEA",
      subtitle: "Fehler im Produktdesign",
      items: [
        "Brainstorming und Fehlerbaumanalyse",
        "Bauteilebene: physikalische Ausfallmechanismen",
        "Beispiele: Bruch, Verschleiß, Klemmen",
      ],
      cues: ["Produktdesign", "Design-FMEA"],
    },
    {
      title: "PROZESS-FMEA",
      subtitle: "Fehler in Fertigung, Montage, Logistik und Transport",
      items: [
        "Prozessanalyse und Ursache-Wirkungs-Diagramme",
        "Letzte Strukturebene: die 5 M",
        "Mensch · Maschine · Material · Methode · Milieu/Mitwelt",
      ],
      cues: ["In der Prozessbetrachtung hingegen", "fünf Ms"],
    },
    { y: 270, height: 558, bodySize: 20, gap: 92, takeaway: "Design-FMEA untersucht Produktfehler; Prozess-FMEA untersucht Fehler in Abläufen und Prozessbedingungen." });
}

function scene158() {
  return compareColumns(158,
    {
      title: "DESIGN-FMEA",
      subtitle: "Risiko durch Designfehler",
      items: ["B: Auswirkung des Designfehlers", "A: Ausfallwahrscheinlichkeit", "E: Entdeckung des Designfehlers"],
      cues: ["Designfehler", "Ausfallwahrscheinlichkeit"],
    },
    {
      title: "PROZESS-FMEA",
      subtitle: "Risiko durch Prozessfehler",
      items: ["B: Auswirkung des Prozessfehlers", "A: statistische Prozesskontrolle", "E: Entdeckung des Prozessfehlers"],
      cues: ["Prozessfehler", "Prozesskontrolle"],
    },
    { y: 282, height: 530, gap: 90, takeaway: "B, A und E bleiben gleich; ihre konkrete Interpretation folgt dem Design- oder Prozesskontext." });
}

function scene159() {
  const formula = group("s159_formula", "Risikoprioritätszahl",
    `${box(92, 274, 760, 516, C.surface, C.deep, 2, 14)}
     ${txt(472, 346, "RISIKOPRIORITÄTSZAHL", 24, 820, C.deep, "middle")}
     ${rpzFormulaMarkup(194, 486, .8)}
     ${pill(280, 560, 384, "1 BIS 1000", C.deep, C.surface)}`);
  const matrix = group("s159_matrix", "Aufgabenpriorität",
    `${box(1018, 274, 810, 516, C.accentSoft, C.accent, 2, 14)}
     ${txt(1423, 346, "AUFGABENPRIORITÄT", 24, 820, C.accent, "middle")}
     ${image("task-priority-combined.png", 1170, 390, 506, 328, "Aufgabenprioritätsmatrix")}`);
  const braces = group("s159_shared", "Gemeinsame Bewertungslogik",
    `${pathLine("M 92 232 H 852 M 1018 232 H 1828", C.accent, 3)}
     ${pill(702, 830, 516, "GILT FÜR DESIGN- UND PROZESS-FMEA", C.accent, C.surface)}`);
  return {
    archetype: "risk-method-comparison",
    layout: "Gemeinsame RPZ-Formel und Aufgabenpriorität als zwei gleichwertige Bewertungsinstrumente.",
    takeaway: "RPZ und Aufgabenpriorität werden in Design- und Prozess-FMEA nach derselben Grundlogik eingesetzt.",
    body: processStrip(5, 172, true) + braces + formula + matrix,
    targets: [
      target("s159_formula", "Risikoprioritätszahl", 159, ["RPZ", "Risikoprioritätszahl"]),
      target("s159_matrix", "Aufgabenpriorität", 159, ["Aufgabenpriorität"]),
      target("s159_shared", "Gemeinsame Bewertungslogik", 159, ["In beiden Fällen"]),
    ],
  };
}

function scene162() {
  return compareColumns(162,
    {
      title: "DESIGN-FMEA",
      subtitle: "Konstruktionskonzept verbessern",
      items: [
        "Designänderungen, zum Beispiel Geometrie anpassen",
        "Robustere Materialien auswählen",
        "Beispiel: stabileren Werkstoff einsetzen, um Bruchrisiko zu reduzieren",
      ],
      cues: ["Konstruktionskonzept", "Werkstoff"],
    },
    {
      title: "PROZESS-FMEA",
      subtitle: "Fertigungsabläufe verbessern",
      items: [
        "Prozessschritte optimieren",
        "Personal schulen",
        "Beispiel: regelmäßige Wartungen zur Vermeidung von Maschinenausfällen",
      ],
      cues: ["Fertigungsabläufe", "Wartungen"],
    },
    { y: 280, height: 538, gap: 94, bodySize: 20, takeaway: "Optimierung verändert in der Design-FMEA das Produktkonzept und in der Prozess-FMEA den Fertigungsablauf." });
}

function scene165() {
  return compareColumns(165,
    {
      title: "DESIGN-FMEA",
      subtitle: "Fokus Produktdesign",
      items: [
        "Fehlfunktionen, Risiken und Optimierungsmaßnahmen dokumentieren",
        "Zeichnungen und technische Spezifikationen",
        "Konstruktionsunterlagen",
      ],
      cues: ["Produktdesign", "Zeichnungen"],
    },
    {
      title: "PROZESS-FMEA",
      subtitle: "Fokus Prozessdokumentation",
      items: [
        "Fehlfunktionen, Risiken und Optimierungsmaßnahmen dokumentieren",
        "Arbeitsanweisungen und Prozessbeschreibungen",
        "Schulungsunterlagen",
      ],
      cues: ["Prozessdokumentation", "Arbeitsanweisungen"],
    },
    { y: 270, height: 558, gap: 92, bodySize: 20, takeaway: "Beide FMEA-Arten dokumentieren dieselben Ergebnisarten, aber in unterschiedlichen Unterlagen." });
}

function buildComparisonScene(n) {
  if (n === 139) return scene139();
  if (n === 140) return processOnly(n, 1);
  if (n === 141) return processOnly(n, 1);
  if (n === 142) return scene142();
  if (n === 143) return processOnly(n, 2);
  if (n === 144) return processOnly(n, 2);
  if (n === 145) return compareAssetScene(n, "design-structure.png", "Produktstruktur", "Design-FMEA", 2, "Die Design-FMEA strukturiert das Produkt in Systemelemente und Hierarchieebenen.");
  if (n === 146) return compareAssetScene(n, "process-structure.png", "Prozessstruktur", "Prozess-FMEA", 2, "Die Prozess-FMEA strukturiert den Ablauf in Prozessschritte und untergeordnete Arbeitsschritte.");
  if (n === 147) return processOnly(n, 3);
  if (n === 148) return processOnly(n, 3);
  if (n === 149) return compareAssetScene(n, "design-function-tree.png", "Produktfunktionen", "Design-FMEA", 3, "In der Design-FMEA werden Funktionen den Systemelementen des Produkts zugeordnet.");
  if (n === 150) return compareAssetScene(n, "process-function-tree.png", "Prozessfunktionen", "Prozess-FMEA", 3, "In der Prozess-FMEA werden Funktionen den einzelnen Prozessschritten zugeordnet.");
  if (n === 151) return processOnly(n, 4);
  if (n === 152) return processOnly(n, 4);
  if (n === 153) return compareAssetScene(n, "design-error-tree.png", "Produktfehlfunktionen", "Design-FMEA", 4, "Die Design-FMEA negiert Produktfunktionen zu Fehlfunktionen und ordnet sie hierarchisch.");
  if (n === 154) return compareAssetScene(n, "process-error-tree.png", "Prozessfehlfunktionen", "Prozess-FMEA", 4, "Die Prozess-FMEA negiert Prozessfunktionen zu Prozessfehlern.");
  if (n === 155) return scene155();
  if (n === 156) return processOnly(n, 5);
  if (n === 157) return processOnly(n, 5);
  if (n === 158) return scene158();
  if (n === 159) return scene159();
  if (n === 160) return processOnly(n, 6);
  if (n === 161) return processOnly(n, 6);
  if (n === 162) return scene162();
  if (n === 163) return processOnly(n, 7);
  if (n === 164) return processOnly(n, 7);
  if (n === 165) return scene165();
  return null;
}

function buildScene(n) {
  return buildIntroAndEarlyScene(n)
    || buildStructureAndFailureScene(n)
    || buildRiskAndDocumentationScene(n)
    || buildComparisonScene(n);
}

function selectedSlides() {
  const index = process.argv.indexOf("--slides");
  if (index < 0) return new Set(scenes.map((scene) => scene.output_slide_number));
  const selected = new Set();
  for (const token of String(process.argv[index + 1] || "").split(",")) {
    const match = token.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!match) throw new Error(`Ungültige Folienauswahl: ${token}`);
    for (let slide = Number(match[1]); slide <= Number(match[2] || match[1]); slide += 1) selected.add(slide);
  }
  return selected;
}

function writeManifest(scene, content) {
  const manifest = {
    schemaVersion: "svgAnimationManifest/v1",
    svgPath: `${scene.work_unit}.svg`,
    defaults: { enterFrames: 16, exitFrames: 12, highlightDurFrames: 30, drawDurFrames: 42, transformDurFrames: 30 },
    targets: content.targets.map((entry) => ({
      targetId: entry.id,
      label: entry.label,
      status: "animated",
      visibleInEditor: true,
      render: true,
      confidence: "high",
    })),
    steps: content.targets.map((entry, index) => ({
      stepId: `step_${String(index + 1).padStart(2, "0")}_${entry.id}`,
      targetId: entry.id,
      action: entry.action,
      sourceText: entry.sourceText,
      occurrence: 1,
      confidence: "high",
      notes: entry.action === "draw"
        ? "Beziehung wird erst nach den zugehörigen fachlichen Endpunkten aufgebaut."
        : "Vollständige semantische Einheit aus Form, Text und gegebenenfalls Bild.",
      ...(entry.action === "draw" ? { drawDurFrames: 42 } : { enterFrames: 16 }),
    })),
  };
  fs.writeFileSync(path.join(outRoot, scene.work_unit, "scene.animation.v1.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(outRoot, scene.work_unit, "element-animation-plan.json"), `${JSON.stringify({
    schemaVersion: "elementAnimationPlan/v1",
    sceneId: scene.scene_id,
    targets: manifest.targets,
    steps: manifest.steps,
  }, null, 2)}\n`, "utf8");
}

function writeBrief(scene, content) {
  const n = scene.output_slide_number;
  const text = `# Redesign-Brief — ${scene.work_unit}

- Kapitel: 4
- Lektion: ${scene.lesson}
- Quellfolie: ${n}
- Zielmodus: full_slide, 1920×1080
- Titel: ${titles[n]}
- Dominante Lernbotschaft: ${content.takeaway}
- Archetyp: ${content.archetype}
- Layout: ${content.layout}
- Inhaltsinventar: Fachbegriffe, Beziehungen, Hierarchien, Tabellenzustände und Beispiele bleiben erhalten; PowerPoint-Bedienelemente und Masterdekoration entfallen.
- Referenz-Lock: RE1 slide_013, slide_009, slide_027 und slide_022
- Assetstrategie: ${content.body.includes("<image") ? "bereinigtes und vergrößertes Quellasset" : "native RelTest-SVG-Komposition"}
- Animation: ${content.targets.length ? "animated — sprechertextgeführte semantische Gruppen" : "static — der Zustand ist als vollständiger Aufbau-/Fokuszustand sofort verständlich"}
- Statisches Freigabekriterium: vollständiger Quellen-Ziel-Referenzvergleich ohne Text-, Kontrast-, Pfeil- oder Assetbefund
- QA-Schwerpunkte: 1:1-Inhaltstransfer, Mindestschrift 18 px, Verbinder 1,5–2,5 px, Pfeile hinter Knoten, keine unbelegte fachliche Ergänzung
`;
  fs.writeFileSync(path.join(outRoot, scene.work_unit, "redesign-brief.md"), text, "utf8");
}

function main() {
  const selected = selectedSlides();
  const generated = [];
  for (const scene of scenes) {
    const n = scene.output_slide_number;
    if (!selected.has(n)) continue;
    const renderN = scene.render_source_slide || scene.primary_source_slide || n;
    const renderScene = { ...scene, output_slide_number: renderN };
    const content = buildScene(renderN);
    if (!content) throw new Error(`Keine Kapitel-4-Szenendefinition für Folie ${n}.`);
    const sceneDir = path.join(outRoot, scene.work_unit);
    fs.mkdirSync(sceneDir, { recursive: true });
    fs.writeFileSync(path.join(sceneDir, `${scene.work_unit}.svg`), frame(renderScene, content), "utf8");
    writeBrief(renderScene, content);
    if (animated) writeManifest(renderScene, content);
    generated.push(scene.work_unit);
  }
  process.stdout.write(`Generated ${generated.length} RE2 chapter-4 scene(s)${animated ? " with animation manifests" : " as static pilots/end states"}: ${generated.join(", ")}.\n`);
}

main();
