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
  70: "Design-FMEA und Prozess-FMEA im Vergleich",
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
  return `<rect data-role="functional" x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
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

function pictogram(relativePath, x, y, width, height, label) {
  const data = fs.readFileSync(path.join(root, relativePath)).toString("base64");
  return `<image x="${x}" y="${y}" width="${width}" height="${height}" href="data:image/png;base64,${data}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" data-component="reltest-pictogram" data-style="reltest-education-minimal-v1" data-kind="universal_pictogram" data-source-evidence="user_request" data-source-reference="Quellnahe Prinzipiengrafik; freigegebenes PNG aus der Education-Piktogrammbibliothek: ${esc(relativePath)}"/>`;
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

function navText(x, y, text, size, weight, fill, anchor = "middle") {
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="annotation" data-qc-layer="text" data-qc-padding="0">${esc(text)}</text>`;
}

function navMulti(x, y, width, text, size, weight, fill, lineHeight = 1) {
  const max = Math.max(8, Math.floor(width / (size * 0.54)));
  const spans = wrap(text, max)
    .map((row, index) => `<tspan x="${x}" dy="${index ? Math.round(size * lineHeight) : 0}">${esc(row)}</tspan>`)
    .join("");
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="middle" data-qc-role="annotation" data-qc-layer="text" data-qc-padding="0">${spans}</text>`;
}

function processStrip(activeStep = 0, y = 370, compact = false) {
  const width = compact ? 198 : 206;
  const gap = compact ? 10 : 12;
  const total = width * 7 + gap * 6;
  const x0 = (1920 - total) / 2;
  const height = compact ? 72 : 96;
  const links = processLabels.slice(0, 6).map((_, index) =>
    line(x0 + width + index * (width + gap), y + height / 2, x0 + (index + 1) * (width + gap), y + height / 2, C.soft, 1.5, true)).join("");
  const nodes = processLabels.map(([step, label], index) => {
    const active = activeStep === index + 1;
    const x = x0 + index * (width + gap);
    const fill = active ? C.educationAccent : C.surface;
    const stroke = active ? C.educationAccent : C.accent;
    const textFill = active ? C.surface : C.accent;
    return `${box(x, y, width, height, fill, stroke, 1.5, 8)}
      ${navText(x + width / 2, y + (compact ? 22 : 30), step.toUpperCase(), 18, 820, textFill)}
      ${navMulti(x + width / 2, y + (compact ? 44 : 59), width - 22, label, 18, 720, textFill, 1)}`;
  }).join("");
  return `${links}${nodes}`;
}

function frame(scene, content) {
  const n = scene.output_slide_number;
  const title = scene.content_title_override || titles[n];
  const metadata = {
    artifactScope: "content-svg",
    embeddingTarget: "powerpoint-slide",
    slideType: content.archetype,
    contentTitle: title,
    layoutIntent: content.layout,
    takeaway: content.takeaway || `Quelltreuer Zustand der FMEA-Sequenz auf Folie ${n}.`,
    density: content.density || "normal",
    contentMode: "transparent-content",
    backgroundMode: "transparent",
    brandProfile: educationTheme.brandProfile,
    brandVariant: educationTheme.brandVariant,
    sourceSlides: scene.source_slides || [n],
    officialLogoStatus: "pending-original-asset",
  };
  const markerColors = [...new Set([C.accent, C.deep, C.failure, C.success, C.secondary, C.soft, C.border, C.technical, C.educationAccent])]
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
  const process = group(`s${n}_process`, "Sieben Schritte der FMEA", processStrip(activeStep, 156, true), false);
  if (!activeStep) {
    return {
      archetype: "process-overview",
      layout: "Kompakte siebenstufige FMEA-Schrittübersicht als ruhiger Orientierungsrahmen.",
      takeaway: "Die FMEA folgt einem klaren Ablauf aus sieben Schritten.",
      body: process + `${txt(960, 520, "7 SCHRITTE", 104, 880, C.accent, "middle")}${txt(960, 600, "EIN DURCHGÄNGIGER ARBEITSWEG", 25, 820, C.secondary, "middle")}`,
      targets: [],
    };
  }
  const [stepLabel, stepTitle] = processLabels[activeStep - 1];
  const stepCounter = activeStep === 1
    ? `${txt(258, 578, "0", 76, 880, C.surface, "middle")}${txt(310, 578, "1", 76, 880, C.surface, "middle")}`
    : txt(286, 578, String(activeStep).padStart(2, "0"), 76, 880, C.surface, "middle");
  const previewByStep = {
    1: `${pathLine("M 1260 470 V 510 H 1080 V 560 M 1260 510 V 560 M 1260 510 H 1440 V 560", C.border, 3)}
        ${box(1130, 392, 260, 78, C.accent, C.accent, 1.5, 4)}${txt(1260, 440, "ANALYSEUMFANG", 20, 820, C.surface, "middle")}
        ${[1080, 1260, 1440].map((x, index) => `${box(x - 118, 560, 236, 82, C.surface, C.accent, 2, 4)}${txt(x, 610, ["SYSTEM", "TEILSYSTEM", "KOMPONENTE"][index], 19, 780, C.accent, "middle")}`).join("")}
        ${txt(1260, 722, "Informationen sammeln  ·  Team zusammenstellen", 22, 720, C.secondary, "middle")}`,
    2: `${pathLine("M 1260 456 V 510 H 1080 V 566 M 1260 510 V 566 M 1260 510 H 1440 V 566", C.border, 3)}
        ${box(1130, 374, 260, 82, C.accent, C.accent, 1.5, 4)}${txt(1260, 425, "SYSTEM", 21, 820, C.surface, "middle")}
        ${[1080, 1260, 1440].map((x, index) => `${box(x - 118, 566, 236, 82, C.surface, C.accent, 2, 4)}${txt(x, 616, ["TEILSYSTEM", "BAUGRUPPE", "BAUTEIL"][index], 19, 780, C.accent, "middle")}`).join("")}
        ${txt(1260, 724, "abgrenzen  →  aufteilen  →  hierarchisch ordnen", 22, 720, C.secondary, "middle")}`,
    3: `${box(1008, 438, 300, 92, C.surface, C.accent, 2, 4)}${txt(1158, 477, "SYSTEMELEMENT", 18, 820, C.soft, "middle")}${txt(1158, 512, "2.1", 25, 850, C.accent, "middle")}
        ${line(1308, 484, 1446, 484, C.secondary, 3, true)}
        ${box(1446, 438, 300, 92, C.surface, C.accent, 2, 4)}${txt(1596, 477, "FUNKTION", 18, 820, C.secondary, "middle")}${txt(1596, 512, "Funktion 2.1.1", 22, 780, C.accent, "middle")}
        ${txt(1377, 650, "Jedem Systemelement mindestens eine Funktion zuordnen", 23, 720, C.accent, "middle")}`,
    4: `${box(1000, 438, 300, 92, C.surface, C.accent, 2, 4)}${txt(1150, 477, "FUNKTION", 18, 820, C.secondary, "middle")}${txt(1150, 512, "Funktion 1", 24, 820, C.accent, "middle")}
        ${line(1300, 484, 1434, 484, C.failure, 3, true)}
        ${box(1434, 408, 312, 72, C.surface, C.failure, 2, 4)}${txt(1590, 452, "nicht erfüllt", 21, 760, C.failure, "middle")}
        ${box(1434, 504, 312, 72, C.surface, C.failure, 2, 4)}${txt(1590, 548, "fehlerhaft erfüllt", 21, 760, C.failure, "middle")}
        ${txt(1374, 674, "Funktion negieren  →  Fehlfunktionen verknüpfen", 23, 720, C.accent, "middle")}`,
    5: `${[1080, 1370, 1660].map((x, index) => `<circle cx="${x}" cy="500" r="76" fill="${index === 2 ? C.educationAccent : C.accent}"/>${txt(x, 513, ["B", "A", "E"][index], 44, 880, C.surface, "middle")}${txt(x, 620, ["Bedeutung", "Auftreten", "Entdeckung"][index], 21, 800, index === 2 ? C.educationAccent : C.accent, "middle")}${txt(x, 660, "Skala 1–10", 19, 620, C.soft, "middle")}`).join("")}`,
    6: `${txt(1370, 408, "RISIKO", 42, 880, C.failure, "middle")}
        ${pathLine("M 1060 690 C 1100 590 1190 540 1300 500", C.accent, 3, true)}${pathLine("M 1370 690 V 500", C.accent, 3, true)}${pathLine("M 1680 690 C 1640 590 1550 540 1440 500", C.educationAccent, 3, true)}
        ${txt(1020, 740, "Ursache beseitigen", 20, 760, C.accent, "middle")}${txt(1370, 740, "Bedeutung verringern", 20, 760, C.accent, "middle")}${txt(1720, 740, "Entdeckung erhöhen", 20, 760, C.educationAccent, "middle")}`,
    7: `<rect x="1090" y="372" width="560" height="420" fill="${C.surface}" stroke="${C.accent}" stroke-width="2"/>
        <rect x="1090" y="372" width="560" height="70" fill="${C.accent}"/>${txt(1370, 416, "FMEA-FORMBLATT", 23, 830, C.surface, "middle")}
        ${[500, 570, 640, 710].map((y) => `<path d="M1090 ${y}H1650" stroke="${C.border}" stroke-width="2"/>`).join("")}
        <path d="M1260 442V792M1430 442V792" stroke="${C.border}" stroke-width="2"/>
        ${txt(1370, 846, "Ergebnisse  ·  Maßnahmen  ·  Verantwortlichkeiten", 21, 720, C.secondary, "middle")}`,
  };
  const focus = group(`s${n}_focus`, `${stepLabel}: ${stepTitle}`,
    `${txt(112, 410, "ALS NÄCHSTES", 20, 840, C.secondary)}
     <circle cx="286" cy="590" r="126" fill="${C.accent}"/>
     ${stepCounter}
     ${txt(286, 630, "VON 07", 20, 760, C.surface, "middle")}
     ${txt(500, 530, stepLabel.toUpperCase(), 22, 830, C.secondary)}
     ${multiRows(500, 590, 360, stepTitle, 40, 820, C.accent, "start", 1.08)}
     <path d="M920 372V812" stroke="${C.border}" stroke-width="2"/>
     ${previewByStep[activeStep]}`);
  return {
    archetype: "step-transition-preview",
    layout: "Zurückhaltende Sieben-Schritt-Navigation oben mit signalgrünem aktuellem Schritt; darunter ein großer Schrittanker und eine fachliche Vorschau auf die kommende Denkoperation.",
    takeaway: `Schritt ${activeStep} – ${stepTitle} – ist der nächste FMEA-Arbeitsschritt.`,
    body: process + focus,
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
  const rightColor = options.rightColor || C.accent;
  const leftGroup = group(`s${n}_left`, left.title,
    `${box(110, y, 790, 68, C.deep, C.deep, 1.5, 3)}
     ${txt(505, y + 45, left.title, 29, 840, C.surface, "middle")}
     ${left.subtitle ? multi(505, y + 116, 700, left.subtitle, 21, 720, C.deep, "middle") : ""}
     ${line(110, y + 150, 900, y + 150, C.border, 2)}
     ${bulletList(142, y + 214, 710, left.items, leftColor, options.bodySize || 21, options.gap || 82)}`);
  const rightGroup = group(`s${n}_right`, right.title,
    `${box(1020, y, 790, 68, C.deep, C.deep, 1.5, 3)}
     ${txt(1415, y + 45, right.title, 29, 840, C.surface, "middle")}
     ${right.subtitle ? multi(1415, y + 116, 700, right.subtitle, 21, 720, C.deep, "middle") : ""}
     ${line(1020, y + 150, 1810, y + 150, C.border, 2)}
     ${bulletList(1052, y + 214, 710, right.items, rightColor, options.bodySize || 21, options.gap || 82)}`);
  const structure = `<path d="M960 ${y}V${y + height}" stroke="${C.border}" stroke-width="2"/>
    ${line(110, y + height, 1810, y + height, C.border, 2)}`;
  return {
    archetype: "open-aligned-comparison",
    layout: "Zwei gleichgewichtige Vergleichsspalten mit identischen Titelbändern, offener Textfläche und gemeinsamer Ausrichtung.",
    takeaway: options.takeaway || `${left.title} und ${right.title} werden anhand derselben Vergleichslogik gegenübergestellt.`,
    body: structure + leftGroup + rightGroup + (options.footer || ""),
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
  const y1 = 304;
  const y2 = 494;
  const y3 = 706;
  const focus = [y1 - 42, y2 - 42, y3 - 42][focusLevel - 1];
  const focusBand = focusLevel
    ? focusLevel === 3
      ? `<rect x="82" y="${y3 - 38}" width="1756" height="194" rx="4" fill="${C.accentSoft}" fill-opacity=".72" stroke="${C.educationAccent}" stroke-width="2.5"/>`
      : `${box(202, focus, 8, 154, C.accent, C.accent, 0, 4)}`
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
     ${annotationTxt(188, y3 + 40, "SYSTEMEBENE 3", 18, 820, focusLevel === 3 ? C.deep : C.soft, "end")}
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
    density: withFunctions ? "dense" : "normal",
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
  const letters = [
    ["F", "FEHLER"],
    ["M", "MÖGLICHKEITS-"],
    ["E", "EINFLUSS-"],
    ["A", "ANALYSE"],
  ];
  const acronym = letters.map(([letter, meaning], index) => {
    const x = 108 + index * 438;
    return group(`s65_letter_${letter.toLocaleLowerCase("de-DE")}`, `${letter} wie ${meaning}`,
      `${txt(x, 338, letter, 106, 900, C.deep)}
       ${line(x, 372, x + 330, 372, C.accent, 5)}
       ${txt(x, 422, meaning, 22, 860, C.deep)}`);
  }).join("");
  const english = group("s65_english", "Englische Bezeichnung",
    `${txt(108, 490, "ENGLISCH", 18, 850, C.soft)}
     ${txt(260, 490, "Failure Mode and Effects Analysis", 23, 740, C.secondary)}`);
  const definition = group("s65_definition", "Merkmale der FMEA",
    `${txt(108, 574, "DIE FMEA IST …", 20, 860, C.accent)}
     ${bulletList(108, 632, 760, [
       "systematisch, proaktiv und entwicklungsbegleitend",
       "eine Methode, die im Team durchgeführt wird",
       "auf frühe Erkennung von Ausfallarten, Folgen und Ursachen ausgerichtet",
     ], C.accent, 23, 78)}`);
  const roles = group("s65_roles", "Ergebnis der FMEA",
    `${txt(1030, 574, "SIE UNTERSTÜTZT …", 20, 860, C.accent)}
     ${bulletList(1030, 632, 760, [
       "die Einschätzung und Priorisierung des Risikos",
       "die Festlegung wirksamer Optimierungsmaßnahmen",
     ], C.accent, 23, 94)}`);
  return {
    archetype: "animated-acronym-definition",
    layout: "Die vier Buchstaben lösen sich nacheinander in ihre Bedeutungen auf; darunter folgen echte, unnummerierte Stichpunkte in zwei klaren Inhaltsgruppen.",
    takeaway: "Die FMEA erkennt potenzielle Fehler früh, bewertet ihr Risiko und leitet Optimierungen ab.",
    body: acronym + english + definition + roles,
    targets: [
      ...letters.map(([letter, meaning], index) => ({
        ...target(`s65_letter_${letter.toLocaleLowerCase("de-DE")}`, `${letter} wie ${meaning}`, 65, ["FMEA bedeutet"]),
        sourceText: cuePara(65, ["FMEA bedeutet"]),
      })),
      target("s65_english", "Englische Bezeichnung", 65, ["englischsprachigen Raum"]),
      target("s65_definition", "Merkmale der FMEA", 65, ["systematische"]),
      target("s65_roles", "Aufgaben der FMEA", 65, ["frühzeitig", "Risiko"]),
    ],
  };
}

function scene66() {
  const goals = [
    {
      title: "Minimierung oder Vermeidung von Ausfällen",
      bullets: ["Frühzeitige Erkennung potenzieller Fehler", "Problemfreie Produkteinführung"],
      x: 92,
      y: 220,
      triggerKeywords: ["Ausfälle minimieren", "Erkennen und Priorisieren"],
    },
    {
      title: "Reduktion der Kosten",
      bullets: ["Vermeidung von Nachbesserungen", "Effiziente Nutzung von Ressourcen"],
      x: 92,
      y: 548,
      triggerKeywords: ["Reduzierung von Kosten"],
    },
    {
      title: "Steigerung der Produktqualität",
      bullets: ["Aufdeckung von Schwachstellen", "Maßnahmen zur Verbesserung"],
      x: 960,
      y: 220,
      triggerKeywords: ["Produktqualität zu steigern"],
    },
    {
      title: "Dokumentation",
      bullets: ["Wissensaustausch im Team", "Einhaltung regulatorischer Anforderungen"],
      x: 960,
      y: 548,
      triggerKeywords: ["lückenlose Dokumentation"],
    },
  ];
  const goalGrid = goals.map(({ title, bullets, x, y }, index) => {
    const bulletMarkup = bullets.map((bullet, bulletIndex) => {
      const baseline = y + 132 + bulletIndex * 62;
      return `${txt(x + 38, baseline, "→", 27, 800, C.technical)}
        ${multi(x + 80, baseline, 690, bullet, 24, 600, C.text, "start", 1.2)}`;
    }).join("");
    return group(`s66_goal_${index + 1}`, title,
      `${box(x, y, 812, 270, C.surfaceSoft, C.deep, 1.8, 10)}
       ${multi(x + 34, y + 58, 744, title, 28, 800, C.deep, "start", 1.12)}
       ${bulletMarkup}`);
  }).join("");
  const prevention = group("s66_prevention", "Wirkung der Fehlerprävention",
    `${box(92, 854, 548, 104, C.deep, C.deep, 1.5, 8)}
     ${multi(366, 906, 490, "PRÄVENTION VON FEHLERN UND AUSFÄLLEN", 21, 840, C.surface, "middle")}
     ${box(686, 854, 548, 104, C.deep, C.deep, 1.5, 8)}
     ${multi(960, 906, 490, "STEIGERUNG VON SICHERHEIT UND ZUVERLÄSSIGKEIT", 21, 840, C.surface, "middle")}
     ${box(1280, 854, 548, 104, C.deep, C.deep, 1.5, 8)}
     ${multi(1554, 906, 490, "HÖHERE KUNDENZUFRIEDENHEIT", 21, 840, C.surface, "middle")}`);
  const body = goalGrid + prevention;
  return {
    archetype: "goals",
    layout: "Quellnahes 2×2-Raster: Ausfälle und Kosten links, Produktqualität und Dokumentation rechts; vier farblich und formal identische Themenboxen.",
    takeaway: "Vier gleichrangige FMEA-Ziele: Ausfälle vermeiden, Kosten reduzieren, Produktqualität steigern und Ergebnisse dokumentieren.",
    body,
    targets: [
      ...goals.map(({ title, triggerKeywords }, index) => target(`s66_goal_${index + 1}`, title, 66, triggerKeywords)),
      target("s66_prevention", "Wirkung der Fehlerprävention", 66, ["verhindert Fehler und Ausfälle", "Sicherheit und Zuverlässigkeit"]),
    ],
  };
}

function scene67() {
  const principles = [
    {
      id: "s67_principle_1",
      title: "Kontinuität",
      description: "Die FMEA ist ein fortlaufender Prozess, der die Entwicklung und Optimierung von Produkten und Prozessen kontinuierlich begleitet.",
      titleX: 660,
      titleY: 278,
      textX: 660,
      textY: 326,
      textWidth: 520,
      anchor: "end",
      tileX: 730,
      tileY: 240,
      icon: "components/image-library/generated-pictograms/education-core/loop.png",
    },
    {
      id: "s67_principle_2",
      title: "Systematik",
      description: "Nutzt einen strukturierten Ansatz zur Identifikation, Bewertung und Priorisierung von Risiken, um Produkten und Prozessen systematisch zu verbessern.",
      titleX: 1260,
      titleY: 278,
      textX: 1260,
      textY: 326,
      textWidth: 560,
      anchor: "start",
      tileX: 970,
      tileY: 240,
      icon: "components/image-library/generated-pictograms/education-core/layers.png",
    },
    {
      id: "s67_principle_3",
      title: "Proaktivität",
      description: "Regelmäßige Updates ermöglichen proaktiv auf Veränderungen und Kundenfeedback zu reagieren und Fehler frühzeitig zu erkennen.",
      titleX: 660,
      titleY: 520,
      textX: 660,
      textY: 568,
      textWidth: 520,
      anchor: "end",
      tileX: 730,
      tileY: 450,
      icon: "components/image-library/generated-pictograms/education-core/clock.png",
    },
    {
      id: "s67_principle_4",
      title: "Dokumentation",
      description: "Jeder Schritt und jede Entscheidung werden ausführlich dokumentiert, um eine Basis für zukünftige Verbesserungen zu schaffen.",
      titleX: 1260,
      titleY: 520,
      textX: 1260,
      textY: 568,
      textWidth: 560,
      anchor: "start",
      tileX: 970,
      tileY: 450,
      icon: "components/image-library/generated-pictograms/education-core/list-check.png",
    },
  ];
  const principleGroups = principles.map((principle) => group(principle.id, principle.title,
    `${box(principle.tileX, principle.tileY, 220, 190, C.deep, C.deep, 1.5, 24)}
     <circle cx="${principle.tileX + 110}" cy="${principle.tileY + 95}" r="66" fill="${C.surface}"/>
     ${pictogram(principle.icon, principle.tileX + 58, principle.tileY + 43, 104, 104, principle.title)}
     ${txt(principle.titleX, principle.titleY, principle.title, 27, 800, C.technical, principle.anchor)}
     ${multiRows(principle.textX, principle.textY, principle.textWidth, principle.description, 20, 560, C.text, principle.anchor, 1.2)}`)).join("");
  const teamwork = group("s67_principle_5", "Teamarbeit",
    `<circle cx="960" cy="440" r="76" fill="${C.surface}" stroke="${C.deep}" stroke-width="2.5"/>
     ${txt(960, 449, "TEAM", 25, 850, C.deep, "middle")}
     ${txt(960, 706, "Teamarbeit", 28, 820, C.deep, "middle")}
     ${multiRows(960, 752, 760, "Erfordert interdisziplinäre Teams zur effektiven Analyse und setzt auf die Zusammenarbeit von Experten aus verschiedenen Fachbereichen.", 20, 560, C.text, "middle", 1.18)}`);
  return {
    archetype: "principle-constellation",
    layout: "Quellnahe Zentralgrafik: vier identische Symbolfelder um Teamarbeit als verbindenden Mittelpunkt; freie Erläuterungen links, rechts und darunter.",
    takeaway: "Kontinuität, Systematik, Proaktivität, Dokumentation und Teamarbeit tragen die FMEA.",
    body: principleGroups + teamwork,
    targets: [
      target("s67_principle_1", "Kontinuität", 67, ["Kontinuität"]),
      target("s67_principle_2", "Systematik", 67, ["Systematik"]),
      target("s67_principle_3", "Proaktivität", 67, ["außerdem proaktiv"]),
      target("s67_principle_4", "Dokumentation", 67, ["wesentlicher Bestandteil", "Dokumentation"]),
      target("s67_principle_5", "Teamarbeit", 67, ["Teamarbeit"]),
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
  const split = group("s70_split", "Aufteilung in Design- und Prozess-FMEA",
    `${pill(824, 188, 272, "FMEA", C.accent, C.surface)}
     ${pathLine("M 960 226 V 260 H 660 V 292", C.soft, 2.2)}
     ${pathLine("M 960 260 H 1360 V 292", C.soft, 2.2)}
     ${box(350, 292, 620, 72, C.deep, C.deep, 1.5, 10)}
     ${txt(660, 338, "DESIGN-FMEA", 28, 840, C.surface, "middle")}
     ${box(1050, 292, 620, 72, C.deep, C.deep, 1.5, 10)}
     ${txt(1360, 338, "PROZESS-FMEA", 28, 840, C.surface, "middle")}
     ${txt(302, 402, "ZIELSETZUNG", 18, 820, C.technical, "end")}
     ${txt(302, 530, "SCHWERPUNKTE", 18, 820, C.technical, "end")}
     ${txt(302, 658, "ANWENDUNGS-", 18, 820, C.technical, "end")}
     ${txt(302, 682, "ZEITPUNKT", 18, 820, C.technical, "end")}
     ${txt(302, 770, "ERGEBNIS", 18, 820, C.technical, "end")}
     ${txt(302, 870, "BEISPIEL", 18, 820, C.technical, "end")}
     ${line(326, 474, 1748, 474, C.border, 1.4)}
     ${line(326, 602, 1748, 602, C.border, 1.4)}
     ${line(326, 720, 1748, 720, C.border, 1.4)}
     ${line(326, 816, 1748, 816, C.border, 1.4)}
     ${line(1010, 382, 1010, 902, C.border, 1.4)}`);
  const designAnalysis = group("s70_design_analysis", "Zielsetzung und Schwerpunkt der Design-FMEA",
    `${multiRows(382, 398, 542, "Frühzeitige Identifizierung und Behebung potenzieller Fehler und Schwachstellen im Produktdesign", 20, 600, C.text, "start", 1.18)}
     ${txt(382, 524, "Produktqualität", 21, 800, C.deep)}
     ${multiRows(382, 556, 542, "Komponenten, Baugruppen und Interaktionen innerhalb des Produktdesigns", 19, 560, C.text, "start", 1.18)}`);
  const processAnalysis = group("s70_process_analysis", "Zielsetzung und Schwerpunkt der Prozess-FMEA",
    `${multiRows(1082, 398, 542, "Frühzeitige Identifizierung und Behebung potenzieller Fehler und Schwachstellen im Produktionsprozess", 20, 600, C.text, "start", 1.18)}
     ${txt(1082, 524, "Produktionseffizienz", 21, 800, C.deep)}
     ${multiRows(1082, 556, 542, "Schritte, Abläufe und Materialien innerhalb des Produktionsprozesses", 19, 560, C.text, "start", 1.18)}`);
  const designApplication = group("s70_design_application", "Anwendung und Ergebnis der Design-FMEA",
    `${multiRows(382, 650, 542, "Während der Designphase → idealerweise vor dem ersten Prototypen", 20, 600, C.text, "start", 1.18)}
     ${multiRows(382, 764, 542, "Führt zu einem sicheren und funktionalen Produkt.", 20, 600, C.text, "start", 1.18)}
     ${multiRows(382, 866, 542, "Analyse eines neu entwickelten Autobatteriesystems", 20, 720, C.technical, "start", 1.18)}`);
  const processApplication = group("s70_process_application", "Anwendung und Ergebnis der Prozess-FMEA",
    `${multiRows(1082, 650, 542, "Während des Produktionsprozesses → beginnt in der Planungsphase der Produktion", 20, 600, C.text, "start", 1.18)}
     ${multiRows(1082, 764, 542, "Führt zu einer effizienteren und kosteneffektiveren Produktion.", 20, 600, C.text, "start", 1.18)}
     ${multiRows(1082, 866, 542, "Optimierung der Montagelinie für Elektronikgeräte", 20, 720, C.technical, "start", 1.18)}`);
  return {
    archetype: "open-comparison-matrix",
    layout: "Quellnahe Aufteilung mit echtem FMEA-Elternknoten, zwei gleichgewichtigen Kopfzeilen und fünf offenen, zeilenweise ausgerichteten Vergleichskriterien.",
    takeaway: "Design-FMEA und Prozess-FMEA verfolgen dieselbe Risikologik, setzen aber an Produktdesign beziehungsweise Produktionsprozess an.",
    density: "dense",
    body: split + designAnalysis + processAnalysis + designApplication + processApplication,
    targets: [
      target("s70_split", "Aufteilung in Design- und Prozess-FMEA", 70, ["zwei Hauptkategorien"]),
      target("s70_design_analysis", "Zielsetzung und Schwerpunkt der Design-FMEA", 70, ["Die Design-FMEA konzentriert"]),
      target("s70_process_analysis", "Zielsetzung und Schwerpunkt der Prozess-FMEA", 70, ["Die Prozess-FME-A hingegen"]),
      target("s70_design_application", "Anwendung und Ergebnis der Design-FMEA", 70, ["während der Designphase"]),
      target("s70_process_application", "Anwendung und Ergebnis der Prozess-FMEA", 70, ["kontinuierlich während des gesamten Produktionsprozesses"]),
    ],
  };
}

function scene71() {
  const use = group("s71_use", "Einsatz der FMEA",
    `${txt(150, 260, "EINSATZ DER FMEA", 28, 840, C.technical)}
     ${line(150, 284, 990, 284, C.border, 1.5)}
     ${multiRows(150, 340, 820, "In allen Bereichen zur Sicherstellung der Qualität und Zuverlässigkeit", 25, 760, C.deep, "start", 1.18)}
     ${txt(150, 444, "BRANCHEN", 18, 820, C.soft)}
     ${box(150, 474, 14, 14, C.semanticSuccess, C.semanticSuccess, 0, 7)}${txt(182, 489, "Automobilindustrie", 20, 620, C.text)}
     ${box(150, 526, 14, 14, C.semanticSuccess, C.semanticSuccess, 0, 7)}${txt(182, 541, "Luft- und Raumfahrt", 20, 620, C.text)}
     ${box(150, 578, 14, 14, C.semanticSuccess, C.semanticSuccess, 0, 7)}${txt(182, 593, "Medizintechnik", 20, 620, C.text)}
     ${box(530, 474, 14, 14, C.semanticSuccess, C.semanticSuccess, 0, 7)}${txt(562, 489, "Elektronik", 20, 620, C.text)}
     ${box(530, 526, 14, 14, C.semanticSuccess, C.semanticSuccess, 0, 7)}${txt(562, 541, "Chemieindustrie", 20, 620, C.text)}
     ${box(530, 578, 14, 14, C.semanticSuccess, C.semanticSuccess, 0, 7)}${txt(562, 593, "Dienstleistungssektor", 20, 620, C.text)}`);
  const standards = group("s71_standards", "Unterschiedliche Standards und Leitfäden",
    `${line(1052, 250, 1052, 626, C.border, 1.5)}
     ${txt(1120, 260, "UNTERSCHIEDLICHE STANDARDS", 28, 840, C.technical)}
     ${txt(1120, 294, "UND LEITFÄDEN", 28, 840, C.technical)}
     ${box(1120, 372, 16, 16, C.accent, C.accent, 1, 8)}
     ${txt(1160, 390, "AIAG & VDA FMEA-Handbuch", 22, 720, C.deep)}
     ${line(1120, 422, 1688, 422, C.border, 1.3)}
     ${box(1120, 464, 16, 16, C.accent, C.accent, 1, 8)}
     ${txt(1160, 482, "IEC 60812", 22, 720, C.deep)}
     ${line(1120, 514, 1688, 514, C.border, 1.3)}
     ${box(1120, 556, 16, 16, C.accent, C.accent, 1, 8)}
     ${txt(1160, 574, "SAE J1739", 22, 720, C.deep)}`);
  const goal = group("s71_goal", "Ziel der FMEA",
    `${box(150, 684, 1620, 196, C.deep, C.deep, 1.5, 16)}
     ${txt(198, 738, "ZIEL", 20, 840, C.technical)}
     ${multiRows(198, 786, 1180, "Identifizierung potenzieller Fehler, die Analyse deren Ursachen und Auswirkungen, sowie die Entwicklung von Maßnahmen zur Risikominimierung", 25, 720, C.surface, "start", 1.2)}
     <circle cx="1590" cy="782" r="72" fill="${C.surface}"/>
     ${pictogram("components/image-library/generated-pictograms/education-core/target.png", 1536, 728, 108, 108, "Ziel und Risikominimierung")}`);
  return {
    archetype: "use-and-goal",
    layout: "Offene Informationsbereiche für Einsatz und Standards; genau ein hervorgehobenes Zielband als zentrale Lernbotschaft.",
    takeaway: "FMEA wird branchenübergreifend und standardgestützt eingesetzt, um Fehler, Ursachen und Auswirkungen zu analysieren und Risiken zu minimieren.",
    body: use + standards + goal,
    targets: [
      target("s71_use", "Einsatz der FMEA", 71, ["Die FMEA findet in allen Bereichen"]),
      target("s71_standards", "Unterschiedliche Standards und Leitfäden", 71, ["Zur Unterstützung der Durchführung der FMEA"]),
      target("s71_goal", "Ziel der FMEA", 71, ["Unabhängig von Branche oder verwendetem Standard"]),
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

function planningScopeDocuments(n) {
  const scope = group(`s${n}_scope`, "Analyseumfang",
    `${box(108, 304, 710, 54, C.deep, C.deep, 1.5, 7)}
     ${txt(138, 340, "DEFINITION DES ANALYSEUMFANGS", 23, 860, C.surface)}
     ${bulletList(120, 410, 720, [
       "Produkt oder Produktbereich bestimmen",
       "Betrachtungsebene festlegen: System, Teilsystem oder Komponente",
     ], C.accent, 23, 72)}`);
  const documents = group(`s${n}_documents`, "Informationsbasis",
    `${box(108, 548, 1160, 54, C.deep, C.deep, 1.5, 7)}
     ${txt(138, 584, "INFORMATIONEN, DOKUMENTE UND MATERIALIEN SAMMELN", 23, 860, C.surface)}
     ${multi(120, 650, 1540, "Vorliegende Erkenntnisse und Erfahrungen zusammentragen:", 23, 720, C.deep)}
     ${bulletList(164, 710, 1510, [
       "frühere Projekte",
       "Vorgänger-FMEA",
       "Lessons Learned und bekannte wirksame Lösungen",
     ], C.accent, 22, 62)}`);
  const bridge = group(`s${n}_bridge`, "FMEA-Team",
    `${box(108, 888, 330, 54, C.deep, C.deep, 1.5, 7)}
     ${txt(138, 924, "FMEA-TEAM", 23, 860, C.surface)}
     ${multi(482, 924, 1260, "Interdisziplinäres Team aus unterschiedlichen Rollen und Fachbereichen zusammenstellen.", 22, 730, C.deep)}`);
  return {
    archetype: "planning-foundation",
    layout: "Drei quellnahe, klar gestaffelte Inhaltsabschnitte mit dunklen Abschnittsreitern und echten Stichpunkten.",
    takeaway: "Planung beginnt mit einem klaren Analyseumfang und einer belastbaren Informationsbasis.",
    body: processStrip(1, 172, true) + scope + documents + bridge,
    targets: [
      target(`s${n}_scope`, "Analyseumfang", n, ["Analyseumfang festgelegt", "Betrachtungsebene"]),
      target(`s${n}_documents`, "Informationsbasis", n, ["Anschließend sammeln wir"]),
      target(`s${n}_bridge`, "Nächster Vorbereitungsschritt", n, ["Zusammenstellung eines geeigneten Teams"]),
    ],
  };
}

function scene75() {
  const structure = group("s75_structure", "FMEA-Team als Kompetenzpyramide",
    `<path d="M 100 850 L 600 270 L 1100 850 Z" fill="${C.surface}" stroke="${C.deep}" stroke-width="2"/>
     <path d="M 600 270 L 798 500 H 402 Z" fill="${C.deep}"/>
     <path d="M 402 500 H 798 L 953 680 H 247 Z" fill="${C.accent}"/>
     <path d="M 247 680 H 953 L 1100 850 H 100 Z" fill="${C.accentSoft}"/>
     ${txt(600, 398, "FMEA-", 27, 850, C.surface, "middle")}${txt(600, 436, "MODERATOR", 27, 850, C.surface, "middle")}
     ${txt(600, 602, "BASISTEAM", 30, 850, C.surface, "middle")}
     ${txt(600, 788, "ERWEITERTES TEAM MIT EXPERTEN", 25, 840, C.deep, "middle")}`);
  const moderator = group("s75_moderator", "Kompetenzen des Moderators",
    `${bulletList(1170, 302, 650, [
       "neutrale Instanz",
       "Methoden-, Team- und Sozialkompetenz",
       "Moderation, Organisation, Überzeugung und Präsentation",
     ], C.deep, 20, 62)}`);
  const core = group("s75_core", "Kompetenzen des Basisteams",
    `${bulletList(1170, 526, 650, [
       "Grundkenntnisse der FMEA-Methodik",
       "Expertenwissen für den betrachteten Umfang",
       "Fachbereiche wie Design und Qualität",
     ], C.accent, 20, 62)}`);
  const experts = group("s75_experts", "Erweitertes Team",
    `${bulletList(1170, 746, 650, [
       "Wissensträger aus Labor, Kundendienst und Rechtsabteilung",
     ], C.secondary, 20, 62)}`);
  return {
    archetype: "team-hierarchy",
    layout: "Quellengetreue dreistufige Kompetenzpyramide; Erläuterungen liegen offen und höhengleich neben den Stufen.",
    takeaway: "Moderator, Basisteam und erweiterte Experten bringen unterschiedliche Kompetenzen in die FMEA ein.",
    body: processStrip(1, 154, true) + structure + moderator + core + experts,
    targets: [
      target("s75_structure", "FMEA-Team", 75, ["Werfen wir einen genaueren Blick auf die Teamzusammensetzung"]),
      target("s75_moderator", "FMEA-Moderator", 75, ["Moderator begleitet"]),
      target("s75_core", "Basisteam", 75, ["Basis-Team"]),
      target("s75_experts", "Erweitertes Team", 75, ["Falls erforderlich, kann das Team"]),
    ],
  };
}

function scene78() {
  const process = group("s78_process", "Sieben Schritte mit aktivem Schritt 2",
    `<path d="M 120 440 H 1640 V 352 L 1810 530 L 1640 708 V 620 H 120 Z" fill="${C.surfaceSoft}"/>
     ${processStrip(2, 454, false)}`);
  const focus = group("s78_focus", "Aktueller Fokus Strukturanalyse",
    `${txt(960, 780, "AKTUELLER FOKUS", 18, 850, C.soft, "middle")}
     ${txt(960, 836, "STRUKTURANALYSE", 34, 860, C.secondary, "middle")}`);
  return {
    archetype: "process-overview-active-step",
    layout: "Eine einzige dominante Prozesspfeil-Grafik wie in der Ausgangsszene; Schritt 2 ist klar hervorgehoben.",
    takeaway: "Nach Planung und Vorbereitung folgt die Strukturanalyse als zweiter FMEA-Schritt.",
    body: process + focus,
    targets: [
      target("s78_process", "Sieben Schritte der FMEA", 78, ["zweiten Schritt"]),
      target("s78_focus", "Strukturanalyse", 78, ["Strukturanalyse"]),
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
  const step1 = group("s81_step_1", "Abgrenzung des Systems",
    `<circle cx="144" cy="354" r="34" fill="${C.surface}" stroke="${C.deep}" stroke-width="2.5"/>${txt(144, 364, "1", 26, 860, C.deep, "middle")}
     ${txt(214, 362, "ABGRENZUNG DES SYSTEMS", 27, 850, C.deep)}
     ${multi(720, 362, 1010, "Systemgrenze und Schnittstellen eindeutig definieren", 23, 700, C.text)}`);
  const step2 = group("s81_step_2", "Aufteilen in Systemelemente",
    `<circle cx="144" cy="524" r="34" fill="${C.surface}" stroke="${C.deep}" stroke-width="2.5"/>${txt(144, 534, "2", 26, 860, C.deep, "middle")}
     ${multi(214, 516, 430, "SYSTEM IN ELEMENTE AUFTEILEN", 25, 850, C.deep, "start", 1.05)}
     ${pill(760, 492, 270, "TEILSYSTEME", C.deep, C.surface)}
     ${pill(1050, 492, 250, "BAUGRUPPEN", C.deep, C.surface)}
     ${pill(1320, 492, 380, "BAUTEILE · KOMPONENTEN", C.deep, C.surface)}`);
  const step3 = group("s81_step_3", "Systemstruktur erstellen",
    `<circle cx="144" cy="694" r="34" fill="${C.surface}" stroke="${C.deep}" stroke-width="2.5"/>${txt(144, 704, "3", 26, 860, C.deep, "middle")}
     ${multi(214, 686, 430, "SYSTEMSTRUKTUR ERSTELLEN", 25, 850, C.deep, "start", 1.05)}
     ${bulletList(760, 700, 940, [
       "Systemelemente hierarchisch anordnen",
       "beliebig viele Hierarchieebenen möglich",
       "jedes Systemelement kommt nur einmal vor",
       "Dummy-Systemelemente nur zur besseren Übersicht nutzen",
     ], C.accent, 20, 55)}`);
  const separators = group("s81_links", "Arbeitsroute der Strukturanalyse",
    `${line(108, 438, 1810, 438, C.border, 1.5)}${line(108, 608, 1810, 608, C.border, 1.5)}`);
  const body = processStrip(2, 154, true) + separators + step1 + step2 + step3;
  return {
    archetype: "open-three-step-workroute",
    layout: "Drei großzügige, quellnahe Arbeitszeilen mit klarer vertikaler Leserichtung und ohne gequetschte Mini-Diagramme.",
    takeaway: "Abgrenzen, aufteilen und hierarchisch strukturieren bilden die Strukturanalyse.",
    density: "dense",
    body,
    targets: [
      target("s81_step_1", "Abgrenzung des Systems", 81, ["Abgrenzung des Systems"]),
      target("s81_step_2", "Aufteilen in Systemelemente", 81, ["Aufteilen des Systems"]),
      target("s81_step_3", "Systemstruktur erstellen", 81, ["Erstellung Systemstruktur"]),
      target("s81_links", "Leserichtung", 81, ["Schritte", "Strukturanalyse"], "draw"),
    ],
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
    density: withFunctions ? "dense" : "normal",
    body: processStrip(withFaults ? 4 : withFunctions ? 3 : 2, 172, true) + connectors + nodes,
    targets: [
      target(`s${n}_gear_nodes`, "Anpassungsgetriebe", n, ["Getriebe", "Systemstruktur", "Funktion"]),
      target(`s${n}_gear_links`, "Hierarchische Verknüpfungen", n, n === 95 ? ["Wir nutzen hierbei die Top-Down-Methode"] : ["Systembaum", "verknüpft", "Struktur"], "draw"),
    ],
  };
}

function gearboxFailureHierarchy(n, options = {}) {
  const cues = options.cues || {};
  const level2 = [
    ["ANTRIEB", "Antriebsdrehmoment übertragen", "Antriebsdrehmoment wird nicht übertragen"],
    ["ABTRIEB", "Abtriebsdrehmoment übertragen", "Abtriebsdrehmoment wird nicht übertragen"],
    ["GEHÄUSE", "Dichtheit gewährleisten", "Dichtheit wird nicht gewährleistet"],
  ];
  const components = [
    ["Eingangswelle", "Antriebsdrehmoment übertragen", "Antriebsdrehmoment wird nicht übertragen"],
    ["Ritzel", "Antriebsdrehmoment übertragen", "Antriebsdrehmoment wird nicht übertragen"],
    ["Rollenlager", "Lagerung der Wellen", "Lagerung der Wellen nicht sichergestellt"],
    ["RWDR", "Dichtheit gewährleisten", "Dichtheit wird nicht gewährleistet"],
    ["Passfeder", "Drehmoment übertragen", "Drehmoment wird nicht übertragen"],
    ["Hülse", "Abstand gewährleisten", "Abstand wird nicht gewährleistet"],
  ];
  const root = group(`s${n}_gear_root`, "Systemebene 1: Getriebe",
    `${box(754, 276, 412, 58, C.deep, C.deep, 1.5, 6)}${txt(960, 314, "GETRIEBE", 23, 840, C.surface, "middle")}
     ${box(520, 348, 430, 46, C.successSoft, C.success, 1.3, 5)}${txt(735, 378, "DREHMOMENT & DREHZAHL WANDELN", 18, 760, C.success, "middle")}
     ${box(970, 348, 430, 46, C.successSoft, C.success, 1.3, 5)}${txt(1185, 378, "UMWELTVERTRÄGLICHKEIT GEWÄHRLEISTEN", 18, 760, C.success, "middle")}
     ${box(520, 402, 430, 64, C.failureSoft, C.failure, 1.5, 5)}${multi(735, 426, 396, "DREHMOMENT & DREHZAHL WIRD NICHT GEWANDELT", 18, 760, C.failure, "middle", 1.0)}
     ${box(970, 402, 430, 64, C.failureSoft, C.failure, 1.5, 5)}${multi(1185, 426, 396, "UMWELTVERTRÄGLICHKEIT IST NICHT GEWÄHRLEISTET", 18, 760, C.failure, "middle", 1.0)}`);
  const systemElements = group(`s${n}_gear_level2`, "Systemebene 2: Antrieb, Abtrieb und Gehäuse",
    level2.map(([label, fn, fault], index) => {
      const x = 126 + index * 598;
      return `${box(x, 520, 470, 52, C.deep, C.deep, 1.4, 6)}${txt(x + 235, 554, label, 21, 830, C.surface, "middle")}
        ${box(x, 580, 470, 48, C.successSoft, C.success, 1.2, 5)}${multi(x + 235, 610, 432, fn, 18, 700, C.success, "middle", 1.0)}
        ${box(x, 636, 470, 52, C.failureSoft, C.failure, 1.4, 5)}${multi(x + 235, 668, 432, fault, 18, 730, C.failure, "middle", 1.0)}`;
    }).join(""));
  const componentNodes = group(`s${n}_gear_components`, "Systemebene 3: Bauteile des Antriebs",
    `<rect x="44" y="696" width="286" height="42" fill="${C.surface}"/>
     ${annotationTxt(54, 728, "BAUTEILE DES ANTRIEBS", 18, 830, C.soft)}
     ${components.map(([label, fn, fault], index) => {
       const x = 36 + index * 315;
       return `${box(x, 756, 276, 50, C.deep, C.deep, 1.3, 5)}${multi(x + 138, 787, 250, label, 18, 820, C.surface, "middle", 1.0)}
         ${box(x, 814, 276, 58, C.successSoft, C.success, 1.1, 5)}${multi(x + 138, 842, 248, fn, 18, 680, C.success, "middle", 1.0)}
         ${box(x, 880, 276, 66, C.failureSoft, C.failure, 1.3, 5)}${multi(x + 138, 909, 248, fault, 18, 710, C.failure, "middle", 1.0)}`;
     }).join("")}`);
  const connectors = group(`s${n}_gear_links`, "Quellengetreue Systemhierarchie",
    `${pathLine("M 960 452 V 486 H 361 V 520 M 960 486 V 520 M 960 486 H 1557 V 520", C.deep, 2.2)}
     ${pathLine("M 361 688 V 716 H 174 V 756 M 361 716 H 1749 M 489 716 V 756 M 804 716 V 756 M 1119 716 V 756 M 1434 716 V 756 M 1749 716 V 756", C.deep, 1.8)}`);
  return {
    archetype: "source-faithful-technical-hierarchy",
    layout: "Drei klar getrennte Systemebenen; Funktionen und Fehlfunktionen werden direkt und quellengetreu unter jedem Systemelement geführt.",
    takeaway: "Die Fehlfunktionen werden vom Getriebe über Antrieb, Abtrieb und Gehäuse bis zu den Bauteilen des Antriebs abgeleitet.",
    referenceLock: options.referenceLock,
    density: "dense",
    body: processStrip(4, 172, true) + connectors + root + systemElements + componentNodes,
    targets: [
      target(`s${n}_gear_root`, "Systemebene 1: Getriebe", n, cues.root || ["Systemebene", "Drehmoment und Drehzahl", "Umweltverträglichkeit"]),
      target(`s${n}_gear_level2`, "Systemebene 2", n, cues.level2 || ["Antrieb", "Abtrieb", "Gehäuse"]),
      target(`s${n}_gear_components`, "Systemebene 3", n, cues.components || ["Bauteile", "untersten Systemebene"]),
      target(`s${n}_gear_links`, "Quellengetreue Systemhierarchie", n, cues.links || ["gleichen Logik", "definieren"], "draw"),
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

function gearboxSourceBasis(n) {
  const drawing = group(`s${n}_drawing`, "Technischer Schnitt",
    `${txt(112, 312, "TECHNISCHER SCHNITT", 20, 840, C.deep)}
     ${line(112, 344, 824, 344, C.accent, 4)}
     ${image("gear-section.png", 112, 372, 712, 410, "Technischer Schnitt des Anpassungsgetriebes")}`);
  const bom = group(`s${n}_bom`, "Stückliste",
    `${txt(914, 312, "STÜCKLISTE ALS VOLLSTÄNDIGKEITSCHECK", 20, 840, C.deep)}
     ${line(914, 344, 1810, 344, C.accent, 4)}
     ${image("parts-antrieb.png", 914, 374, 896, 214, "Stückliste für Antrieb und Abtrieb")}
     ${image("parts-housing.png", 914, 606, 896, 176, "Stückliste für das Gehäuse")}`);
  const bridge = group(`s${n}_bridge`, "Arbeitsgrundlage",
    `${line(112, 826, 1810, 826, C.border, 1.5)}
     ${txt(112, 872, "ARBEITSGRUNDLAGE", 18, 840, C.accent)}
     ${multi(360, 872, 1410, "Zeichnung erklärt den Aufbau · Stückliste sichert Baugruppen und Standardbauteile vollständig ab.", 22, 720, C.deep)}`);
  return {
    archetype: "technical-source-basis",
    layout: "Technischer Schnitt links und zweistufige Stückliste rechts; eine gemeinsame Arbeitsregel verbindet beide Quellen.",
    takeaway: "Zeichnung und Stückliste bilden gemeinsam die vollständige Basis für den Systembaum des Anpassungsgetriebes.",
    density: "dense",
    body: processStrip(2, 172, true) + drawing + bom + bridge,
    targets: [
      target(`s${n}_drawing`, "Technischer Schnitt", n, ["schematische Aufbau", "Anpassungsgetriebe"]),
      target(`s${n}_bom`, "Stückliste", n, ["Stückliste"]),
      target(`s${n}_bridge`, "Arbeitsgrundlage", n, ["kein Systemelement", "unterteilt"]),
    ],
  };
}

function gearboxHierarchyCombined(n) {
  const root = group(`s${n}_root`, "System Getriebe",
    `${annotationTxt(210, 332, "SYSTEMEBENE 1", 18, 830, C.soft, "end")}
     ${box(800, 286, 320, 72, C.deep, C.deep, 1.5, 6)}
     ${txt(960, 332, "GETRIEBE", 24, 860, C.surface, "middle")}`);
  const connectors = group(`s${n}_links`, "Systemhierarchie",
    `${pathLine("M 960 358 V 410 H 420 V 454 M 960 410 V 454 M 960 410 H 1500 V 454", C.deep, 2.4)}
     ${pathLine("M 960 526 V 606 H 310 V 674 M 960 606 H 1610 M 570 606 V 674 M 830 606 V 674 M 1090 606 V 674 M 1350 606 V 674 M 1610 606 V 674", C.deep, 2.2)}`);
  const headers = group(`s${n}_groups`, "Baugruppen",
    `${annotationTxt(210, 500, "SYSTEMEBENE 2", 18, 830, C.soft, "end")}
     ${box(290, 454, 260, 72, C.deep, C.deep, 1.5, 6)}${txt(420, 500, "ANTRIEB", 22, 850, C.surface, "middle")}
     ${box(830, 454, 260, 72, C.deep, C.deep, 1.5, 6)}${txt(960, 500, "ABTRIEB", 22, 850, C.surface, "middle")}
     ${box(1370, 454, 260, 72, C.deep, C.deep, 1.5, 6)}${txt(1500, 500, "GEHÄUSE", 22, 850, C.surface, "middle")}`);
  const componentLabels = ["AUSGANGSWELLE", "ZAHNRAD", "ROLLENLAGER", "RWDR", "PASSFEDER", "HÜLSE"];
  const components = group(`s${n}_components`, "Komponenten",
    `${annotationTxt(210, 720, "SYSTEMEBENE 3", 18, 830, C.soft, "end")}
     ${componentLabels.map((label, index) => {
       const x = 190 + index * 260;
       return `${box(x, 674, 240, 78, C.deep, C.deep, 1.4, 6)}${multi(x + 120, 718, 214, label, 18, 820, C.surface, "middle", 1.0)}`;
     }).join("")}`);
  const rule = group(`s${n}_rule`, "Vollständigkeitsregel",
    `${line(190, 824, 1730, 824, C.border, 1.5)}
     ${txt(190, 872, "VOLLSTÄNDIGKEITSREGEL", 18, 840, C.accent)}
     ${multi(488, 872, 1200, "Auch Standardbauteile bleiben Teil der Analyse; für Antrieb und Gehäuse wird die Struktur analog fortgeführt.", 22, 730, C.deep)}`);
  return {
    archetype: "system-hierarchy",
    layout: "Quellengetreuer Systembaum mit drei Ebenen: Getriebe, drei Baugruppen und sechs sichtbar unter dem Abtrieb verknüpfte Bauteile.",
    takeaway: "Das Getriebe wird in Antrieb, Abtrieb und Gehäuse zerlegt; der Abtrieb wird vollständig bis auf Bauteilebene aufgeschlüsselt.",
    density: "dense",
    body: processStrip(2, 172, true) + connectors + root + headers + components + rule,
    targets: [
      target(`s${n}_root`, "System Getriebe", n, ["Ganz oben", "Getriebe"]),
      target(`s${n}_groups`, "Baugruppen", n, ["Ganz oben, auf der ersten Systemebene"]),
      target(`s${n}_components`, "Komponenten", n, ["Der Antrieb umfasst die Eingangswelle"]),
      target(`s${n}_links`, "Systemhierarchie", n, ["untergliedert"], "draw"),
      target(`s${n}_rule`, "Vollständigkeitsregel", n, ["Standardbauteile"]),
    ],
  };
}

function gearFunctionHierarchy(n, withFaults = false) {
  const components = [
    ["EINGANGSWELLE", "Antriebsdrehmoment übertragen", "Antriebsdrehmoment wird nicht übertragen"],
    ["RITZEL", "Antriebsdrehmoment übertragen", "Antriebsdrehmoment wird nicht übertragen"],
    ["ROLLENLAGER", "Lagerung der Wellen", "Lagerung der Wellen nicht sichergestellt"],
    ["RWDR", "Dichtheit gewährleisten", "Dichtheit wird nicht gewährleistet"],
    ["PASSFEDER", "Drehmoment übertragen", "Drehmoment wird nicht übertragen"],
    ["HÜLSE", "Abstand gewährleisten", "Abstand wird nicht gewährleistet"],
  ];
  const groups = [
    ["ANTRIEB", "Antriebsdrehmoment übertragen", "Antriebsdrehmoment wird nicht übertragen"],
    ["ABTRIEB", "Abtriebsdrehmoment übertragen", "Abtriebsdrehmoment wird nicht übertragen"],
    ["GEHÄUSE", "Dichtheit gewährleisten", "Dichtheit wird nicht gewährleistet"],
  ];
  const functionBox = (x, y, width, value) => `${box(x, y, width, 48, C.accentSoft, C.accent, 1.5, 4)}${multi(x + width / 2, y + 29, width - 26, value, 18, 720, C.deep, "middle", 1.0)}`;
  const faultBox = (x, y, width, value) => `${box(x, y, width, 48, C.failureSoft, C.failure, 1.5, 4)}${multi(x + width / 2, y + 29, width - 26, value, 18, 740, C.failure, "middle", 1.0)}`;
  const links = group(`s${n}_gear_links`, "Hierarchische Verknüpfungen",
    `${pathLine("M 960 408 V 424 H 430 V 432 M 960 424 V 432 M 960 424 H 1490 V 432", C.deep, 2.2)}
     ${pathLine("M 430 594 V 618 H 215 V 630 M 430 618 H 1715 M 515 618 V 630 M 815 618 V 630 M 1115 618 V 630 M 1415 618 V 630 M 1715 618 V 630", C.deep, 2)}`);
  const root = group(`s${n}_gear_root`, "Systemebene 1 Getriebe",
    `${annotationTxt(188, 284, "SYSTEMEBENE 1", 18, 830, C.soft, "end")}
     ${box(780, 250, 360, 56, C.deep, C.deep, 1.5, 5)}${txt(960, 286, "GETRIEBE", 22, 850, C.surface, "middle")}
     ${functionBox(530, 314, 420, "Drehmoment & Drehzahl wandeln")}
     ${functionBox(970, 314, 420, "Umweltverträglichkeit gewährleisten")}
     ${withFaults ? `${faultBox(545, 368, 390, "Drehmoment & Drehzahl wird nicht gewandelt")}${faultBox(985, 368, 390, "Umweltverträglichkeit ist nicht gewährleistet")}` : ""}`);
  const level2 = group(`s${n}_gear_level2`, "Systemebene 2 mit Funktionen",
    `${annotationTxt(188, 468, "SYSTEMEBENE 2", 18, 830, C.soft, "end")}
     ${groups.map(([label, fn, fault], index) => {
       const x = 200 + index * 530;
       return `${box(x, 432, 460, 54, C.deep, C.deep, 1.5, 5)}${txt(x + 230, 467, label, 21, 850, C.surface, "middle")}
         ${functionBox(x + 15, 492, 430, fn)}
         ${withFaults ? faultBox(x + 30, 546, 400, fault) : ""}`;
     }).join("")}`);
  const level3 = group(`s${n}_gear_level3`, "Bauteile des Antriebs mit Funktionen",
    `${annotationTxt(188, 606, "SYSTEMEBENE 3", 18, 830, C.soft, "end")}
     ${components.map(([label, fn, fault], index) => {
       const x = 80 + index * 300;
       return `${box(x, 630, 270, 52, C.deep, C.deep, 1.4, 5)}${multi(x + 135, 662, 246, label, 18, 830, C.surface, "middle", 1.0)}
         ${functionBox(x + 5, 688, 260, fn)}
         ${withFaults ? faultBox(x + 10, 742, 250, fault) : ""}`;
     }).join("")}`);
  return {
    archetype: withFaults ? "function-fault-hierarchy" : "function-hierarchy",
    layout: withFaults
      ? "Exakt dieselbe Getriebehierarchie wie in der Funktionsszene; pro Funktion wird lediglich die Fehlfunktion ergänzt."
      : "Quellengetreuer dreistufiger Getriebebaum mit einheitlich gestalteten Funktionsfeldern auf jeder Ebene.",
    takeaway: withFaults
      ? "Fehlfunktionen werden direkt unter den zugehörigen Funktionen dokumentiert, ohne die Systemhierarchie zu verändern."
      : "Vom Getriebe über Antrieb, Abtrieb und Gehäuse bis zu den Bauteilen ist jeder Ebene mindestens eine Funktion zugeordnet.",
    density: "dense",
    body: processStrip(withFaults ? 4 : 3, 154, true) + links + root + level2 + level3,
    targets: [
      target(`s${n}_gear_root`, "Getriebe und Top-Funktionen", n, withFaults ? ["Werfen wir dazu einen Blick auf unsere Systemstruktur"] : ["System-Ebene", "Hauptfunktion"]),
      target(`s${n}_gear_level2`, "Funktionen der Baugruppen", n, withFaults ? ["Werfen wir dazu einen Blick auf unsere Systemstruktur"] : ["nächsten Ebene", "Baugruppen"]),
      target(`s${n}_gear_level3`, "Funktionen der Bauteile", n, withFaults ? ["Werfen wir dazu einen Blick auf unsere Systemstruktur"] : ["Funktionen der einzelnen Komponenten", "Systemstruktur"]),
      target(`s${n}_gear_links`, "Hierarchische Verknüpfungen", n, withFaults ? ["Wenn wir die Fehlfunktionen miteinander verknüpfen"] : ["Wir haben nun die Funktionsstruktur des Getriebes erstellt"], "draw"),
    ],
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

function functionMethodsScene(n) {
  const topDown = group(`s${n}_topdown`, "Top-down-Methode",
    `${txt(148, 314, "01 · TOP-DOWN", 22, 860, C.accent)}
     ${line(148, 348, 804, 348, C.accent, 4)}
     ${box(326, 398, 300, 70, C.deep, C.deep, 1.5, 8)}${txt(476, 442, "TOP-FUNKTION", 21, 840, C.surface, "middle")}
     ${pathLine("M 476 468 V 516 H 292 V 548 M 476 516 H 660 V 548", C.deep, 2.2)}
     ${box(148, 548, 288, 86, C.surface, C.accent, 1.8, 8)}${multi(292, 588, 240, "Teilfunktion 1", 20, 730, C.deep, "middle")}
     ${box(516, 548, 288, 86, C.surface, C.accent, 1.8, 8)}${multi(660, 588, 240, "Teilfunktion 2", 20, 730, C.deep, "middle")}
     ${multi(148, 704, 656, "Vom Gesamtsystem zu den Funktionen der untergeordneten Systemelemente.", 22, 660, C.deep)}`);
  const blackbox = group(`s${n}_blackbox`, "Blackbox-Methode",
    `${txt(1052, 314, "02 · BLACKBOX", 22, 860, C.accent)}
     ${line(1052, 348, 1772, 348, C.accent, 4)}
     ${txt(1052, 462, "EINGANG", 17, 820, C.soft)}
     ${line(1168, 454, 1274, 454, C.deep, 2.5, true)}
     ${box(1274, 398, 300, 112, C.deep, C.deep, 1.5, 8)}${multi(1424, 446, 246, "SYSTEMELEMENT", 22, 840, C.surface, "middle")}
     ${line(1574, 454, 1680, 454, C.deep, 2.5, true)}
     ${txt(1772, 462, "AUSGANG", 17, 820, C.soft, "end")}
     ${txt(1424, 570, "FUNKTION = TRANSFORMATION", 20, 840, C.accent, "middle")}
     ${multi(1052, 704, 720, "Eingangs- und Ausgangsgrößen sowie Einsatzbedingungen werden aus Anforderungen und Lastenheft abgeleitet.", 22, 660, C.deep)}`);
  const rule = group(`s${n}_rule`, "Zuordnungsregel",
    `${line(148, 814, 1772, 814, C.border, 1.5)}
     ${txt(148, 860, "ZUORDNUNGSREGEL", 18, 840, C.accent)}
     ${multi(404, 860, 1320, "Jedes Systemelement erhält mindestens eine Funktion; mehrere Funktionen sind möglich.", 23, 740, C.deep)}`);
  return {
    archetype: "method-comparison",
    layout: "Zwei offene Methodenfelder mit identischer Gewichtung; die gemeinsame Zuordnungsregel schließt die Szene ab.",
    takeaway: "Funktionen werden entweder top-down abgeleitet oder aus Ein- und Ausgangsgrößen einer Blackbox bestimmt.",
    body: processStrip(3, 172, true) + topDown + blackbox + rule,
    targets: [
      target(`s${n}_topdown`, "Top-down-Methode", n, ["Top-Down-Methode"]),
      target(`s${n}_blackbox`, "Blackbox-Methode", n, ["Blackbox"]),
      target(`s${n}_rule`, "Zuordnungsregel", n, ["mindestens eine Funktion"]),
    ],
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
    density: "dense",
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
    targets: [target(`s${n}_relation_nodes`, "Fehlerzusammenhang", n, ["benachbarten Systemebenen", "nächsthöheren Ebene", "Ursache-Wirkung-Prinzip"])],
  };
}

function scene108() {
  const nodes = group("s108_relation_nodes", "Fehlerzusammenhang über drei Systemebenen",
    `${annotationTxt(200, 342, "SYSTEMEBENE 1", 19, 840, C.deep, "end")}
     ${annotationTxt(200, 566, "SYSTEMEBENE 2", 19, 840, C.deep, "end")}
     ${annotationTxt(200, 790, "SYSTEMEBENE 3", 19, 840, C.deep, "end")}
     ${box(270, 292, 370, 100, C.failureSoft, C.failure, 2, 4)}${multi(455, 348, 330, "FEHLERFOLGE", 24, 850, C.failure, "middle")}
     ${box(650, 292, 410, 100, C.failureSoft, C.failure, 2, 4)}${multi(855, 348, 370, "FEHLER · FEHLFUNKTION", 24, 850, C.failure, "middle")}
     ${box(1070, 292, 370, 100, C.accentSoft, C.accent, 2, 4)}${multi(1255, 348, 330, "FEHLERURSACHE", 24, 850, C.deep, "middle")}
     ${txt(455, 570, "FEHLERFOLGE", 22, 820, C.deep, "middle")}
     ${multi(855, 562, 340, "FEHLER · FEHLFUNKTION", 22, 820, C.deep, "middle")}
     ${txt(1255, 570, "FEHLERURSACHE", 22, 820, C.deep, "middle")}
     ${box(270, 726, 370, 100, C.accentSoft, C.accent, 2, 4)}${multi(455, 782, 330, "FEHLERFOLGE", 24, 850, C.deep, "middle")}
     ${box(650, 726, 410, 100, C.failureSoft, C.failure, 2, 4)}${multi(855, 782, 370, "FEHLER · FEHLFUNKTION", 24, 850, C.failure, "middle")}
     ${box(1070, 726, 370, 100, C.failureSoft, C.failure, 2, 4)}${multi(1255, 782, 330, "FEHLERURSACHE", 24, 850, C.failure, "middle")}`);
  const links = group("s108_relation_links", "Überlappende Ursache-Wirkungs-Beziehungen",
    `${line(455, 526, 455, 404, C.deep, 3, true)}
     ${line(1255, 526, 1255, 404, C.deep, 3, true)}
     ${line(455, 594, 455, 716, C.deep, 3, true)}
     ${line(1255, 594, 1255, 716, C.deep, 3, true)}`);
  const perspective = group("s108_perspective", "FMEA-Sicht auf ein Systemelement",
    `<path d="M 1510 556 L 1590 458 V 500 H 1860 V 612 H 1590 V 654 Z" fill="${C.deep}"/>
     ${multi(1720, 548, 250, "FMEA-SICHT", 20, 860, C.surface, "middle")}
     ${multi(1720, 580, 250, "SYSTEMELEMENT", 20, 860, C.surface, "middle")}`);
  const rule = group("s108_rule", "Leseregel",
    `${line(270, 882, 1440, 882, C.border, 1.5)}
     ${txt(270, 930, "LESELOGIK", 18, 850, C.accent)}
     ${multi(468, 930, 970, "Fehler einer Ebene = Fehlerursache der höheren Ebene = Fehlerfolge der tieferen Ebene.", 22, 750, C.deep)}`);
  return {
    archetype: "cross-level-failure-hierarchy",
    layout: "Quellennahe dreistufige Fehlerhierarchie mit klaren Systemebenen, vertikalen Überlappungsbeziehungen und markierter FMEA-Perspektive.",
    takeaway: "Fehlerfolge, Fehlfunktion und Fehlerursache überlappen sich über benachbarte Systemebenen.",
    density: "dense",
    body: processStrip(4, 154, true) + links + nodes + perspective + rule,
    targets: [
      target("s108_relation_nodes", "Drei Systemebenen", 108, ["benachbarten Systemebenen"]),
      target("s108_relation_links", "Überlappende Beziehungen", 108, ["nächsthöheren Ebene", "nächsttiefere Ebene"], "draw"),
      target("s108_perspective", "FMEA-Sicht Systemelement", 108, ["innerhalb der Systemstruktur"]),
      target("s108_rule", "Leseregel", 108, ["Ursache-Wirkung-Prinzip"]),
    ],
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
    `${line(1450, 550, 1332, 550, C.failure, 3, true)}${line(992, 550, 874, 550, C.failure, 3, true)}`);
  const nodes = group("s105_nodes", "Autoreifen-Beispiel",
    `${txt(650, 414, "FEHLERFOLGE (FF)", 20, 850, C.accent, "middle")}
     ${txt(1162, 414, "FEHLER", 20, 850, C.accent, "middle")}
     ${txt(1620, 414, "FEHLERURSACHE (FU)", 20, 850, C.accent, "middle")}
     ${box(426, 472, 448, 156, C.surface, C.accent, 2, 8)}${multi(650, 552, 390, "Fahrzeug fahruntüchtig", 27, 800, C.deep, "middle")}
     ${box(992, 472, 340, 156, C.surface, C.accent, 2, 8)}${multi(1162, 552, 290, "Plötzlicher Druckverlust", 27, 820, C.deep, "middle")}
     ${box(1450, 472, 340, 156, C.surface, C.accent, 2, 8)}${multi(1620, 552, 290, "Spitzer Gegenstand", 27, 800, C.deep, "middle")}`);
  const tire = group("s105_tire", "Autoreifen",
    `${image("car-tire-pictogram.png", 88, 360, 300, 360, "Minimalistisches Piktogramm eines Autoreifens")}
     ${txt(238, 758, "AUTOREIFEN", 22, 860, C.deep, "middle")}`);
  const reading = group("s105_reading", "Leserichtung Ursache zu Folge",
    `${line(426, 706, 1790, 706, C.border, 1.5)}
     ${txt(426, 756, "LESERICHTUNG", 18, 850, C.soft)}
     ${txt(642, 756, "Ursache  →  Fehler  →  Folge", 22, 780, C.deep)}`);
  return {
    archetype: "cause-fault-effect",
    layout: "Eindeutiges Reifenpiktogramm als Gegenstandsanker; daneben die vollständige Ursache-Fehler-Folge-Kette mit echter Leserichtung.",
    takeaway: "Ein spitzer Gegenstand verursacht Druckverlust und kann das Fahrzeug fahruntüchtig machen.",
    body: processStrip(4, 154, true) + tire + links + nodes + reading,
    targets: [
      target("s105_tire", "Autoreifen", 105, ["Autoreifen"]),
      target("s105_nodes", "Autoreifen-Beispiel", 105, ["Druckverlust"]),
      target("s105_links", "Ursache-Wirkungs-Kette", 105, ["Fehlerursache", "Fehlerfolge"], "draw"),
      target("s105_reading", "Leserichtung", 105, ["Darüber hinaus besitzt jeder Fehler auch eine Fehlerfolge"]),
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
  if (n === 90) return processOnly(n, 3);
  if (n === 91) return processOnly(n, 3);
  if (n === 92) return scene92();
  if (n === 93) return genericSystemTree(n, { withFunctions: true });
  if (n === 94) return goalScene(n, 3, "Ordne die Funktionen den Systemelementen zu und verknüpfe sie hierarchisch.");
  if (n === 95) return gearFunctionHierarchy(n, false);
  if (n === 96) return processOnly(n, 4);
  if (n === 97) return processOnly(n, 4);
  if (n === 98) return functionToFaultScene(n, false);
  if (n === 99) return functionToFaultScene(n, true);
  if (n === 100) return goalScene(n, 4, "Ordne den Systemelementen Fehlfunktionen zu und verknüpfe ihre Fehlerzusammenhänge.");
  if (n === 101) return genericSystemTree(n, { withFunctions: true, linkCues: ["Blick auf unsere Systemstruktur"] });
  if (n === 102) return genericSystemTree(n, { withFunctions: true, withFaults: true, linkCues: ["Blick auf unsere Systemstruktur"] });
  if (n === 103) return gearboxFailureHierarchy(n, {
    referenceLock: "RE2 Viewer-Szene 51 / slide_110: source-faithful-technical-hierarchy",
    cues: {
      root: ["Werfen wir dazu einen Blick auf unsere Systemstruktur"],
      level2: ["Werfen wir dazu einen Blick auf unsere Systemstruktur"],
      components: ["Werfen wir dazu einen Blick auf unsere Systemstruktur"],
      links: ["Wenn wir die Fehlfunktionen miteinander verknüpfen"],
    },
  });
  if (n === 104) return scene104();
  if (n === 105) return scene105();
  if (n === 106) return fmeaRelationScene(n, 1);
  if (n === 107) return fmeaRelationScene(n, 2);
  if (n === 108) return scene108();
  if (n === 109) return scene109();
  if (n === 110) return gearboxFailureHierarchy(n);
  if (n === 111) return processOnly(n, 5);
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
  const tabs = group("s117_tabs", "B, A und E",
    `${box(196, 310, 470, 80, C.deep, C.deep, 1.5, 8)}${txt(431, 360, "B · BEDEUTUNG", 22, 850, C.surface, "middle")}
     ${box(726, 310, 470, 80, C.deep, C.deep, 1.5, 8)}${txt(961, 360, "A · AUFTRETEN", 22, 850, C.surface, "middle")}
     ${box(1256, 310, 470, 80, C.deep, C.deep, 1.5, 8)}${txt(1491, 360, "E · ENTDECKUNG", 22, 850, C.surface, "middle")}`);
  const summaries = group("s117_summary", "Bewertungslogik",
    `${card(196, 454, 470, 300, "B · BEDEUTUNG", "Ausmaß der Fehlerfolge aus Sicht des Endverbrauchers.", C.accent, C.accentSoft)}
     ${card(726, 454, 470, 300, "A · AUFTRETEN", "Wirksamkeit präventiver Maßnahmen gegen das Auftreten.", C.secondary, C.secondarySoft)}
     ${card(1256, 454, 470, 300, "E · ENTDECKUNG", "Wirksamkeit von Maßnahmen zum Aufdecken der Fehlerursache.", C.success, C.successSoft)}
     ${bulletList(220, 622, 400, ["Kundensicht", "Gleiche Folgen gleich bewerten"], C.accent, 18, 48)}
     ${bulletList(750, 622, 400, ["Fehlerursache", "Vermeidungsmaßnahmen einbeziehen"], C.secondary, 18, 48)}
     ${bulletList(1280, 622, 400, ["Vor der Auslieferung", "Entdeckungsmaßnahmen einbeziehen"], C.success, 18, 48)}
     ${txt(196, 790, "1 · geringe Bedeutung", 17, 760, C.accent)}${txt(666, 790, "10 · hohe Bedeutung", 17, 760, C.accent, "end")}${line(196, 812, 666, 812, C.accent, 2.5, true)}
     ${txt(726, 790, "1 · sehr unwahrscheinlich", 17, 760, C.secondary)}${txt(1196, 790, "10 · nahezu sicher", 17, 760, C.secondary, "end")}${line(726, 812, 1196, 812, C.secondary, 2.5, true)}
     ${txt(1256, 790, "1 · sehr gut entdeckt", 17, 760, C.success)}${txt(1726, 790, "10 · kaum entdeckt", 17, 760, C.success, "end")}${line(1256, 812, 1726, 812, C.success, 2.5, true)}`);
  return {
    archetype: "rating-summary",
    layout: "Drei identische Bewertungsrollen in einer gemeinsamen Zusammenfassung.",
    takeaway: "B bewertet die Folge, A das Auftreten und E die Entdeckung; bei allen drei Größen steigt das Risiko von 1 nach 10.",
    density: "dense",
    body: processStrip(5, 172, true) + tabs + summaries,
    targets: [
      target("s117_tabs", "B, A und E", 117, ["Bedeutung", "Auftretens", "Entdeckungs"]),
      target("s117_summary", "Bewertungslogik", 117, ["Bewertung", "Skala"]),
    ],
  };
}

function scene118() {
  const guidance = group("s118_guidance", "Bewertungsgrundsätze",
    `${txt(108, 338, "BEWERTUNG VON B, A UND E", 25, 840, C.deep)}
     ${line(108, 372, 686, 372, C.accent, 5)}
     ${bulletList(108, 448, 560, [
       "Eindeutige und einheitliche Kriterien verwenden",
       "Anforderungen, Strategie und Produkt des Unternehmens berücksichtigen",
       "Tabellen nach AIAG/VDA (2019) einsetzen",
     ], C.accent, 22, 130)}`);
  const table = group("s118_table", "Bewertungskriterien",
    `${txt(790, 338, "BEWERTUNGSKRITERIEN", 20, 820, C.secondary)}
     ${line(790, 372, 1810, 372, C.border, 2)}
     ${image("risk-criteria-table.png", 790, 394, 1000, 430, "Kriterien für die Bewertungsgrößen B, A und E")}`);
  return {
    archetype: "media-aside",
    layout: "Offene Bewertungsgrundsätze links und vergrößerte Kriterien-Tabelle rechts; nur das fachliche Dokument bleibt gerahmt.",
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
    `${txt(108, 338, level ? texts[level][0] : "AUFGABENPRIORITÄT", 26, 860, color)}
     ${line(108, 372, 780, 372, color, 5)}
     ${level
       ? multiRows(108, 446, 650, texts[level][1], 23, 650, C.deep)
       : bulletList(108, 446, 650, [
         "Prioritätsstufen hoch, mittel und niedrig",
         "Kombination der Einzelbewertungen in einer Tabelle",
         "Priorisierung konkreter Maßnahmen",
         "Erleichterte Entscheidungsfindung",
       ], color, 22, 98)}
     ${level ? `${txt(108, 724, "HANDLUNGSVERBINDLICHKEIT", 18, 820, C.soft)}${line(108, 750, 528, 750, color, 4)}` : ""}`);
  const matrix = group(`s${n}_matrix`, "Aufgabenprioritätsmatrix",
    `${txt(930, 338, "KOMBINATION VON B · A · E", 20, 820, C.secondary)}
     ${line(930, 372, 1810, 372, C.border, 2)}
     ${image("task-priority-matrix.png", 1050, 392, 680, 432, "Aufgabenprioritätsmatrix")}`);
  return {
    archetype: "priority-matrix",
    layout: "Offene Handlungsaussage links und vergrößerte Aufgabenprioritätsmatrix rechts; die Matrix bleibt das einzige gerahmte Fachobjekt.",
    takeaway: level ? `Die Aufgabenpriorität ${level} bestimmt die Verbindlichkeit weiterer Maßnahmen.` : "Die Aufgabenpriorität übersetzt kombinierte Bewertungen in konkrete Handlungsempfehlungen.",
    body: processStrip(5, 172, true) + explanation + matrix,
    targets: [
      target(`s${n}_explanation`, level ? texts[level][0] : "Aufgabenpriorität", n, level ? [level, "Maßnahme"] : ["Prioritätsstufen", "Maßnahmen"]),
      target(`s${n}_matrix`, "Aufgabenprioritätsmatrix", n, ["Tabelle", "kombiniert"]),
    ],
  };
}

function priorityActionsCombined(n) {
  const actionRow = (id, y, label, modal, textValue, color) => group(id, label,
    `${line(116, y, 116, y + 104, color, 4)}
     ${txt(150, y + 34, label, 21, 860, C.deep)}
     ${txt(150, y + 72, modal, 18, 860, color)}
     ${multi(346, y + 34, 760, textValue, 20, 650, C.deep)}`);
  const intro = group(`s${n}_intro`, "Aufgabenpriorität",
    `${txt(108, 310, "HANDLUNGSPFLICHT AUS B · A · E", 24, 860, C.deep)}
     ${line(108, 344, 1128, 344, C.accent, 4)}`);
  const high = actionRow(`s${n}_high`, 390, "HOCH", "MUSS", "Maßnahme definieren – oder Angemessenheit bestehender Maßnahmen begründen und dokumentieren.", C.failure);
  const medium = actionRow(`s${n}_medium`, 540, "MITTEL", "SOLLTE", "Maßnahme definieren – andernfalls Angemessenheit bestehender Maßnahmen begründen und dokumentieren.", C.semanticWarning);
  const low = actionRow(`s${n}_low`, 690, "NIEDRIG", "KANN", "Maßnahme möglich. Ohne zusätzliche Maßnahme ist keine weitere Dokumentation erforderlich.", C.semanticSuccess);
  const matrix = group(`s${n}_matrix`, "Aufgabenprioritätsmatrix",
    `${txt(1260, 310, "PRIORITÄTSMATRIX", 20, 840, C.deep)}
     ${line(1260, 344, 1810, 344, C.accent, 4)}
     ${image("task-priority-matrix.png", 1240, 390, 590, 392, "Aufgabenprioritätsmatrix")}`);
  const goal = group(`s${n}_goal`, "Ziel der Risikoanalyse",
    `${line(108, 846, 1810, 846, C.border, 1.5)}
     ${txt(108, 892, "ZIEL", 18, 840, C.accent)}
     ${multi(216, 892, 1540, "Aktuellen Stand dokumentieren und eindeutig festlegen, ob weitere Maßnahmen erforderlich sind.", 22, 730, C.deep)}`);
  return {
    archetype: "priority-actions",
    layout: "Drei offene Handlungszeilen mit schmaler Statusmarkierung links; Matrix als einziges gerahmtes Fachobjekt rechts.",
    takeaway: "Hohe, mittlere und niedrige Aufgabenpriorität unterscheiden klar zwischen Muss-, Sollte- und Kann-Handlungen.",
    density: "dense",
    body: processStrip(5, 172, true) + intro + high + medium + low + matrix + goal,
    targets: [
      target(`s${n}_intro`, "Aufgabenpriorität", n, ["kategorisiert Risiken"]),
      target(`s${n}_matrix`, "Aufgabenprioritätsmatrix", n, ["kombinierten Einzelbewertungen"]),
      target(`s${n}_high`, "Hohe Aufgabenpriorität", n, ["Aufgabenpriorität hoch"]),
      target(`s${n}_medium`, "Mittlere Aufgabenpriorität", n, ["Aufgabenpriorität mittel"]),
      target(`s${n}_low`, "Niedrige Aufgabenpriorität", n, ["Aufgabenpriorität dagegen niedrig"]),
      target(`s${n}_goal`, "Ziel der Risikoanalyse", n, ["Ziel des Schrittes Risikoanalyse"]),
    ],
  };
}

function scene129() {
  const levers = [
    ["01", "AUFTRETEN REDUZIEREN", "Fehlerursachen abstellen; Konstruktion oder Prozess verändern.", C.accent],
    ["02", "BEDEUTUNG REDUZIEREN", "Konzeptionelle Änderungen wie Redundanz oder Fehleranzeigen vorsehen.", C.accent],
    ["03", "ENTDECKUNG ERHÖHEN", "Konstruktion, Prüfverfahren oder Kontrollmechanismen verbessern.", C.educationAccent],
  ];
  const risk = group("s129_risk", "Risiko reduzieren",
    `<circle cx="960" cy="384" r="72" fill="${C.surface}" stroke="${C.failure}" stroke-width="3"/>
     ${txt(960, 374, "RISIKO", 22, 860, C.failure, "middle")}
     ${txt(960, 408, "REDUZIEREN", 18, 820, C.failure, "middle")}`);
  const leversMarkup = levers.map(([number, title, text, color], index) => {
    const x = 112 + index * 614;
    return group(`s129_lever_${index + 1}`, title,
      `${txt(x, 624, number, 52, 900, C.soft)}
       ${multi(x + 86, 612, 476, title, 24, 850, color)}
       ${line(x + 86, 646, x + 536, 646, color, 4)}
       ${multi(x + 86, 704, 460, text, 22, 650, C.text)}`);
  }).join("");
  const links = group("s129_links", "Drei Wege zur Risikoreduktion",
    `${pathLine("M 350 566 C 450 470 650 426 880 394", C.accent, 3, true)}
     ${line(960, 566, 960, 458, C.accent, 3, true)}
     ${pathLine("M 1570 566 C 1470 470 1270 426 1040 394", C.educationAccent, 3, true)}`);
  const body = processStrip(6, 172, true) + risk + leversMarkup + links;
  return {
    archetype: "risk-reduction-levers",
    layout: "Ein gemeinsames Risikoziel wird von drei offenen, nummerierten Optimierungshebeln adressiert.",
    takeaway: "Optimierung reduziert Auftreten oder Bedeutung und erhöht die Entdeckungswahrscheinlichkeit.",
    body,
    targets: [
      target("s129_risk", "Risiko reduzieren", 129, ["Risiko", "Optimierungsmaßnahmen"]),
      ...levers.map(([number, title], index) => target(`s129_lever_${index + 1}`, `${number} ${title}`, 129, [title.split(" ")[0].toLocaleLowerCase("de-DE"), "Optimierungsmaßnahmen"])),
      target("s129_links", "Drei Wege zur Risikoreduktion", 129, ["Risiko reduziert", "Maßnahmen"], "draw"),
    ],
  };
}

function modernFmeaFieldMarkup(x, y, field, tint, dataTint, options = {}) {
  const headerHeight = options.headerHeight || 76;
  const rowHeights = options.rowHeights || [60];
  const lines = field.lines || [field.label];
  const compact = lines.length === 1 && field.label.length <= 3;
  const lineGap = 20;
  const firstBaseline = y + headerHeight / 2 + 6 - ((lines.length - 1) * lineGap) / 2;
  const label = lines.map((lineText, lineIndex) => txt(
    x + field.width / 2,
    firstBaseline + lineIndex * lineGap,
    lineText,
    compact ? 19 : 18,
    compact ? 850 : 690,
    C.accent,
    "middle",
  )).join("");
  let rowY = y + headerHeight;
  const rows = rowHeights.map((height, rowIndex) => {
    const row = box(x, rowY, field.width, height, rowIndex % 2 === 0 ? C.surface : dataTint, C.border, 1.2, 0);
    rowY += height;
    return row;
  }).join("");
  return `${box(x, y, field.width, headerHeight, tint, C.border, 1.2, 0)}
    ${label}
    ${rows}`;
}

function modernFmeaGroupMarkup(x, y, title, fields, options = {}) {
  const width = fields.reduce((sum, field) => sum + field.width, 0);
  const groupHeaderHeight = options.groupHeaderHeight || 44;
  const headerFill = options.headerFill || C.accent;
  const tint = options.tint || C.accentSoft;
  const dataTint = options.dataTint || C.surfaceSoft;
  let cursor = x;
  const fieldMarkup = fields.map((field) => {
    const markup = modernFmeaFieldMarkup(cursor, y + groupHeaderHeight, field, tint, dataTint, options);
    cursor += field.width;
    return markup;
  }).join("");
  return `${box(x, y, width, groupHeaderHeight, headerFill, headerFill, 1.2, 0)}
    ${txt(x + width / 2, y + groupHeaderHeight / 2 + 7, title, 18, 850, C.surface, "middle")}
    ${fieldMarkup}`;
}

function modernFmeaFormMarkup() {
  const analysisGroups = [
    {
      title: "STRUKTURANALYSE",
      fields: [
        { label: "Nächsthöhere Ebene", lines: ["Obere", "Ebene"], width: 106 },
        { label: "Fokuselement", lines: ["Fokus-", "element"], width: 106 },
        { label: "Nächstniedrigere Ebene", lines: ["Untere", "Ebene"], width: 106 },
      ],
    },
    {
      title: "FUNKTIONSANALYSE",
      fields: [
        { label: "Funktion nächsthöhere Ebene", lines: ["Funktion", "oben"], width: 124 },
        { label: "Funktion / Anforderung", lines: ["Funktion /", "Anforderung"], width: 124 },
        { label: "Funktion nächstniedrigere Ebene", lines: ["Funktion", "unten"], width: 124 },
      ],
    },
    {
      title: "FEHLERANALYSE",
      fields: [
        { label: "Fehlerfolge", lines: ["Fehler-", "folge"], width: 145 },
        { label: "B", width: 50 },
        { label: "Fehlerart", lines: ["Fehler-", "art"], width: 140 },
        { label: "Fehlerursache", lines: ["Fehler-", "ursache"], width: 175 },
      ],
    },
    {
      title: "RISIKOANALYSE",
      fields: [
        { label: "Aktuelle Vermeidung", lines: ["Aktuelle", "Vermeidung"], width: 145 },
        { label: "A", width: 50 },
        { label: "Aktuelle Entdeckung", lines: ["Aktuelle", "Entdeckung"], width: 145 },
        { label: "E", width: 50 },
        { label: "AP", width: 106 },
      ],
    },
  ];
  const optimizationGroup = {
    title: "OPTIMIERUNG UND NEUBEWERTUNG",
    headerFill: C.educationAccent,
    tint: C.educationAccentSoft,
    dataTint: C.educationAccentSoft,
    fields: [
      { label: "Vermeidungsmaßnahme", lines: ["Vermeidungs-", "maßnahme"], width: 240 },
      { label: "Entdeckungsmaßnahme", lines: ["Entdeckungs-", "maßnahme"], width: 240 },
      { label: "Verantwortlich", width: 180 },
      { label: "Zieltermin", lines: ["Ziel-", "termin"], width: 140 },
      { label: "Status", width: 120 },
      { label: "Umsetzung / Nachweis", lines: ["Umsetzung /", "Nachweis"], width: 280 },
      { label: "Abschluss", width: 160 },
      { label: "B", width: 60 },
      { label: "A", width: 60 },
      { label: "E", width: 60 },
      { label: "AP", width: 156 },
    ],
  };
  let cursor = 112;
  const analysisMarkup = analysisGroups.map((entry) => {
    const markup = modernFmeaGroupMarkup(cursor, 398, entry.title, entry.fields, entry);
    cursor += entry.fields.reduce((sum, field) => sum + field.width, 0);
    return markup;
  }).join("");
  const optimizationMarkup = modernFmeaGroupMarkup(112, 598, optimizationGroup.title, optimizationGroup.fields, optimizationGroup);
  const meta = [
    [112, 430, "FMEA-Typ · Betrachtungsumfang"],
    [542, 390, "System · Projekt · Verantwortliche"],
    [932, 340, "Version · Datum"],
    [1272, 536, "Status · Freigabe"],
  ].map(([x, width, label]) => `${box(x, 340, width, 58, C.surface, C.border, 1.2, 0)}${txt(x + 18, 376, label, 18, 680, C.accent)}`).join("");
  return `${txt(122, 322, "FMEA-FORMBLATT", 24, 850, C.deep)}
    <g data-source-evidence="user_request" data-source-reference="Aktualisierung gemäß Nutzerauftrag und offizieller AIAG-VDA-Referenz">${pill(1370, 296, 408, "AIAG–VDA-LOGIK · 7 SCHRITTE · AP", C.accent, C.surface)}</g>
    ${meta}
    ${analysisMarkup}
    ${optimizationMarkup}
    ${box(112, 796, 1696, 34, C.surfaceSoft, C.border, 1.2, 6)}
    ${txt(960, 819, "B · A · E werden einzeln bewertet · AP priorisiert die weitere Bearbeitung", 18, 760, C.accent, "middle")}`;
}

function formScene(n, stage) {
  const media = group(`s${n}_form`, `FMEA-Formblatt Stufe ${stage}`,
    `${box(92, 278, 1736, 610, C.surface, C.border, 1.5, 14)}
     ${modernFmeaFormMarkup()}
     ${pill(650, 842, 620, `AUSBAUSTUFE ${stage} VON 4`, C.educationAccent, C.surface)}`);
  return {
    archetype: "documentation-form",
    layout: "Schematische, verlustfrei skalierbare FMEA-Formularansicht mit Analyse-, AP-, Maßnahmen- und Neubewertungsfeldern.",
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
    `${box(92, 286, 720, 54, C.deep, C.deep, 1.5, 7)}
     ${txt(122, 322, "DOKUMENTATION DER FMEA-ERGEBNISSE", 22, 850, C.surface)}
     ${bulletList(112, 388, 1640, [
       "Zusammenfassung aller Erkenntnisse und Maßnahmen in Formblättern",
       "dynamische und iterative Durchführung mit Aktualisierung nach jeder Neubewertung",
       "Informationen nachvollziehbar und transparent festhalten",
     ], C.accent, 21, 54)}`);
  const goals = group("s137_goals", "Ziele",
    `${box(92, 570, 1736, 340, C.surface, C.deep, 2, 0)}
     ${txt(124, 616, "ZIELE", 20, 860, C.educationAccent)}
     ${bulletList(124, 674, 790, [
       "Aktuelle Risiken und Maßnahmen dokumentieren und Risiken auf ein akzeptables Maß reduzieren",
       "Wissensweitergabe an Teammitglieder und Abteilungen sicherstellen",
       "Wirksamkeit der Maßnahmen prüfen und Risiken iterativ neu bewerten",
     ], C.deep, 20, 82)}
     ${bulletList(970, 674, 790, [
       "Fortschritt und Umsetzung der Maßnahmen überwachen",
       "Berichte ableiten und relevante Stakeholder gezielt informieren",
       "Branchenstandards und regulatorische Anforderungen einhalten",
     ], C.deep, 20, 82)}`);
  return {
    archetype: "documentation-goals",
    layout: "Quellnahe Hierarchie aus drei Dokumentationsprinzipien und sechs vollständig erhaltenen Zielstichpunkten in einem gemeinsamen Zielrahmen.",
    takeaway: "Ergebnisdokumentation schafft Transparenz, Wissensweitergabe, Wirksamkeitskontrolle und Nachweisfähigkeit.",
    body: processStrip(7, 172, true) + intro + goals,
    targets: [
      target("s137_intro", "Dokumentationsprinzip", 137, ["dynamisch und iterativ"]),
      target("s137_goals", "Ziele", 137, ["mehrere wichtige Ziele", "Wissensweitergabe", "Überwachung"]),
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
  if (n === 127) return processOnly(n, 6);
  if (n === 128) return { ...processOnly(n, 6), density: "dense" };
  if (n === 129) return scene129();
  if (n === 130) return goalScene(n, 6, "Reduziere das Risiko durch weitere Maßnahmen, Neubewertung und Zuverlässigkeitsabsicherung.");
  if (n === 131) return processOnly(n, 7);
  if (n === 132) return processOnly(n, 7);
  if (n >= 133 && n <= 135) return nativeFormScene(n, n - 132);
  if (n === 136) return formScene(n, 4);
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
  const context = group("s142_context", "Gleicher Ablauf, anderer Fokus",
    `${txt(960, 318, "1. SCHRITT  ·  PLANUNG UND VORBEREITUNG", 24, 850, C.accent, "middle")}
     ${txt(960, 354, "gleiche Aufgabe – unterschiedlicher Analysefokus", 20, 700, C.secondary, "middle")}
     ${box(396, 390, 650, 66, C.accent, C.accent, 1.5, 4)}${txt(721, 432, "DESIGN-FMEA", 25, 840, C.surface, "middle")}
     ${box(1080, 390, 650, 66, C.accent, C.accent, 1.5, 4)}${txt(1405, 432, "PROZESS-FMEA", 25, 840, C.surface, "middle")}
     ${line(366, 486, 1760, 486, C.border, 2)}${line(366, 648, 1760, 648, C.border, 2)}${line(366, 810, 1760, 810, C.border, 2)}
     ${line(1062, 390, 1062, 902, C.border, 2)}`);
  const scope = group("s142_part_1", "Analyseumfang und Detaillierungsebene",
    `${txt(118, 534, "01", 25, 860, C.secondary)}${txt(174, 534, "ANALYSEUMFANG", 20, 840, C.accent)}
     ${multiRows(426, 526, 560, "Produkt oder Produktbereich auswählen; Produktgestaltung und Anforderungen betrachten.", 21, 620, C.text, "start", 1.22)}
     ${multiRows(1110, 526, 570, "Prozessabschnitt auswählen; Fertigung, Montage, Logistik und Transport betrachten.", 21, 620, C.text, "start", 1.22)}`);
  const documents = group("s142_part_2", "Unterlagen und Materialien",
    `${txt(118, 696, "02", 25, 860, C.secondary)}${txt(174, 696, "UNTERLAGEN", 20, 840, C.accent)}
     ${multiRows(426, 688, 560, "Relevante Unterlagen, Materialien und Erkenntnisse zur Produktgestaltung zusammentragen.", 21, 620, C.text, "start", 1.22)}
     ${multiRows(1110, 688, 570, "Prozessablaufpläne, Arbeitsanweisungen sowie Maschinen- und Werkzeuglisten sammeln.", 21, 620, C.text, "start", 1.22)}`);
  const team = group("s142_part_3", "Interdisziplinäres Team",
    `${txt(118, 858, "03", 25, 860, C.secondary)}${txt(174, 858, "TEAM", 20, 840, C.accent)}
     ${multiRows(426, 850, 560, "Fachbereiche mit Perspektiven auf Produktgestaltung und Anforderungen einbinden.", 21, 620, C.text, "start", 1.22)}
     ${multiRows(1110, 850, 570, "Spezialistinnen und Spezialisten der betroffenen Prozessbereiche zusammenstellen.", 21, 620, C.text, "start", 1.22)}`);
  return {
    archetype: "open-aligned-comparison",
    layout: "Kompakte Schritt-Navigation; darunter eine offene Vergleichsmatrix mit drei gemeinsamen Kriterien und gleichfarbigen Spalten für Design- und Prozess-FMEA.",
    takeaway: "Planung und Vorbereitung folgen denselben drei Aufgaben; der Analysefokus wechselt vom Produkt zum Fertigungs- und Montageprozess.",
    density: "dense",
    body: processStrip(1, 172, true) + context + scope + documents + team,
    targets: [
      target("s142_context", "Gleicher Ablauf, anderer Fokus", 142, ["sieben Schritte", "inhaltlichen Fokus"]),
      target("s142_part_1", "Analyseumfang und Detaillierungsebene", 142, ["Analyseumfang", "Detaillierungsebene"]),
      target("s142_part_2", "Unterlagen und Materialien", 142, ["Unterlagen", "Materialien"]),
      target("s142_part_3", "Interdisziplinäres Team", 142, ["interdisziplinäre Team"]),
    ],
  };
}

function compareAssetScene(n, filename, label, side, activeStep, takeaway) {
  const color = side === "Design-FMEA" ? C.accent : C.secondary;
  const fill = side === "Design-FMEA" ? C.accentSoft : C.secondarySoft;
  const media = group(`s${n}_asset`, label,
    `${txt(108, 324, side.toUpperCase(), 20, 840, color)}
     ${line(108, 352, 1812, 352, color, 4)}
     ${image(filename, 170, 374, 1580, 430, label)}`);
  return {
    archetype: "source-asset-diagram",
    layout: "Vergrößertes, quelltreues Struktur-, Funktions- oder Fehlerdiagramm auf offener Fläche mit klarer FMEA-Zuordnung.",
    takeaway,
    density: "dense",
    body: processStrip(activeStep, 172, true) + media,
    targets: [target(`s${n}_asset`, label, n, [side, "Struktur", "Funktion", "Fehler"])],
  };
}

function comparisonPair(n, leftFile, rightFile, leftLabel, rightLabel, activeStep, takeaway, cueKeywords) {
  const divider = group(`s${n}_divider`, "Vergleichsachse",
    `${line(960, 294, 960, 830, C.border, 1.5)}
     ${txt(960, 868, "GLEICHE FMEA-LOGIK · ANDERER ANALYSEGEGENSTAND", 18, 840, C.accent, "middle")}`);
  const left = group(`s${n}_left`, leftLabel,
    `${txt(116, 312, "DESIGN-FMEA", 18, 840, C.soft)}
     ${txt(116, 352, leftLabel, 24, 860, C.deep)}
     ${line(116, 382, 874, 382, C.accent, 4)}
     ${image(leftFile, 116, 410, 758, 386, leftLabel)}`);
  const right = group(`s${n}_right`, rightLabel,
    `${txt(1046, 312, "PROZESS-FMEA", 18, 840, C.soft)}
     ${txt(1046, 352, rightLabel, 24, 860, C.deep)}
     ${line(1046, 382, 1804, 382, C.accent, 4)}
     ${image(rightFile, 1046, 410, 758, 386, rightLabel)}`);
  return {
    archetype: "paired-technical-comparison",
    layout: "Zwei gleich große, gleichfarbig gewichtete technische Diagramme auf einer offenen Vergleichsachse.",
    takeaway,
    density: "dense",
    body: processStrip(activeStep, 172, true) + divider + left + right,
    targets: [
      target(`s${n}_left`, leftLabel, n, [cueKeywords[0]]),
      target(`s${n}_right`, rightLabel, n, [cueKeywords[1]]),
      target(`s${n}_divider`, "Gemeinsame FMEA-Logik", n, [cueKeywords[1]]),
    ],
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
    `${txt(120, 350, "RISIKOPRIORITÄTSZAHL", 24, 840, C.deep)}
     ${line(120, 384, 842, 384, C.accent, 5)}
     ${rpzFormulaMarkup(170, 520, .82)}
     ${txt(170, 590, "WERTEBEREICH", 18, 820, C.soft)}
     ${txt(352, 590, "1 BIS 1000", 22, 850, C.deep)}
     ${multi(170, 678, 620, "Multiplikative Priorisierung aus Bedeutung, Auftreten und Entdeckung.", 22, 650, C.text)}`);
  const matrix = group("s159_matrix", "Aufgabenpriorität",
    `${txt(1082, 350, "AUFGABENPRIORITÄT", 24, 840, C.deep)}
     ${line(1082, 384, 1800, 384, C.accent, 5)}
     ${image("task-priority-combined.png", 1180, 412, 520, 328, "Aufgabenprioritätsmatrix")}`);
  const braces = group("s159_shared", "Gemeinsame Bewertungslogik",
    `${line(960, 316, 960, 782, C.border, 2)}
     ${line(420, 822, 1500, 822, C.border, 2)}
     ${txt(960, 868, "GILT FÜR DESIGN- UND PROZESS-FMEA", 20, 840, C.accent, "middle")}`);
  return {
    archetype: "risk-method-comparison",
    layout: "Gemeinsame RPZ-Formel und Aufgabenpriorität als zwei offene, gleichwertige Bewertungsinstrumente.",
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

function buildScene(n, variant = "") {
  if (variant === "planning_scope_documents") return planningScopeDocuments(n);
  if (variant === "gearbox_source_basis") return gearboxSourceBasis(n);
  if (variant === "gearbox_hierarchy_combined") return gearboxHierarchyCombined(n);
  if (variant === "function_methods") return functionMethodsScene(n);
  if (variant === "priority_actions_combined") return priorityActionsCombined(n);
  if (variant === "comparison_structure_pair") return comparisonPair(n, "design-structure.png", "process-structure.png", "PRODUKTSTRUKTUR", "PROZESSSTRUKTUR", 2, "Produkt und Prozess werden mit derselben FMEA-Logik, aber in unterschiedlichen Hierarchien strukturiert.", ["Systemstruktur", "Gesamtprozess"]);
  if (variant === "comparison_function_pair") return comparisonPair(n, "design-function-tree.png", "process-function-tree.png", "PRODUKTFUNKTIONEN", "PROZESSFUNKTIONEN", 3, "Die Funktionsanalyse ordnet Funktionen entweder Produktkomponenten oder Prozessschritten zu.", ["Beim Design", "prozessorientierten Variante"]);
  if (variant === "comparison_error_pair") return comparisonPair(n, "design-error-tree.png", "process-error-tree.png", "PRODUKTFEHLFUNKTIONEN", "PROZESSFEHLER", 4, "Fehler werden den Funktionen in der jeweiligen Produkt- oder Prozessstruktur zugeordnet.", ["Im vierten Schritt", "im Prozesskontext"]);
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
- Zielmodus: content_svg, transparentes 1920×1080-Inhaltsmodul für den Downstream-Master
- Titel: ${scene.content_title_override || titles[n]}
- Dominante Lernbotschaft: ${content.takeaway}
- Archetyp: ${content.archetype}
- Layout: ${content.layout}
- Inhaltsinventar: Fachbegriffe, Beziehungen, Hierarchien, Tabellenzustände und Beispiele bleiben erhalten; PowerPoint-Bedienelemente und Masterdekoration entfallen.
- Referenz-Lock: ${content.referenceLock || "RE1 slide_013, slide_009, slide_027 und slide_022"}
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
    const content = buildScene(renderN, scene.render_variant);
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
