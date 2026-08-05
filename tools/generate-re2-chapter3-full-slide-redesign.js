const fs = require("fs");
const path = require("path");
const educationTheme = require("./reltest-education-theme");

const root = path.resolve(__dirname, "..");
const outRoot = path.join(root, "rebuild-proposals", "svg", "RE2");
const assetRoot = path.join(root, "components", "image-library", "re2-ch3-fta");
const sourceMap = JSON.parse(fs.readFileSync(path.join(root, "analysis", "rebuild-plans", "RE2_source-reference-map.json"), "utf8"));
const inventory = JSON.parse(fs.readFileSync(path.join(root, "analysis", "inventories", "RE2_svg-text-map.json"), "utf8"));
const scenes = sourceMap.mappings.filter((scene) => scene.chapter === 3);
const animated = process.argv.includes("--animated");

const C = educationTheme.colors;

const titles = {
  20: "Was ist eine FTA?",
  21: "FTA folgt dem Top-down-Prinzip",
  22: "Der Fehlerbaum macht Zusammenhänge sichtbar",
  23: "Qualitative und quantitative FTA",
  24: "Ablauf der qualitativen FTA",
  25: "1. Schritt: Systemanalyse",
  26: "Systemanalyse: Vorgehen und Ziel",
  27: "1. Schritt: Systemanalyse",
  28: "2. Schritt: Unerwünschtes Ereignis definieren",
  29: "Top-Ereignis: zwei mögliche Ansätze",
  30: "Präventiv oder korrektiv?",
  31: "2. Schritt: Unerwünschtes Ereignis definieren",
  32: "3. Schritt: Ausfallarten bestimmen",
  33: "Drei Ausfallarten von Komponenten",
  34: "Beispiel: Steuerung eines Motors",
  35: "3. Schritt: Ausfallarten bestimmen",
  36: "4. Schritt: Fehlerbaum erstellen",
  37: "Logische Gatter im Fehlerbaum",
  38: "Motorbeispiel: Top-Ereignis und Ausfallarten",
  39: "Motorbeispiel: logische Verknüpfung",
  40: "Motorbeispiel: Ursachen ergänzen",
  41: "Motorbeispiel: Primärausfälle",
  42: "Motorbeispiel: Sekundär- und kommandierte Ausfälle",
  43: "Motorbeispiel: vollständiger Fehlerbaum",
  44: "Fehlerbaum gezielt begrenzen",
  45: "Basisereignis als Ende eines Pfades",
  46: "Nicht weiter untersuchtes Ereignis",
  47: "Fehlerbaum mit Verweisung fortsetzen",
  48: "4. Schritt: Fehlerbaum erstellen",
  49: "5. Schritt: Qualitative Bewertung",
  50: "Kritische Pfade identifizieren",
  51: "Minimale Ausfallschnitte erkennen",
  52: "Beispiel: Fahrwerk eines Flugzeugs",
  53: "Fahrwerk: Ausfall des Bugrads",
  54: "Fahrwerk: Ausfall des linken Hauptfahrwerks",
  55: "Fahrwerk: Ausfall des rechten Hauptfahrwerks",
  56: "Fahrwerk: kritische Pfade und Minimalschnitte",
  57: "Common Mode beim Flugzeugfahrwerk",
  58: "Stromversorgung eines Operationssaals",
  59: "Fehlerbaum der Krankenhaus-Stromversorgung",
  60: "Common Mode: keine echte Redundanz",
  61: "Gemeinsame Kraftstoffversorgung",
  62: "Common Cause: gemeinsame Ausfallursache",
};

const takeaways = {
  20: "FTA bedeutet Fault Tree Analysis; auf Deutsch Fehlerbaum- oder Fehlzustandsbaumanalyse.",
  21: "Die Analyse arbeitet vom unerwünschten Top-Ereignis bis zu Basisereignissen und Ausfallmechanismen.",
  22: "Logische Verknüpfungen zeigen, welche Einzel- und Kombinationsausfälle zum Top-Ereignis führen.",
  23: "Qualitative FTA identifiziert Schwachstellen; quantitative FTA berechnet Wahrscheinlichkeiten.",
  26: "Systemgrenze, Einflüsse, Komponenten und Funktionen schaffen ein belastbares Systemverständnis.",
  29: "Das Top-Ereignis kann präventiv aus nicht erfüllten Anforderungen oder korrektiv aus einem realen Ausfall abgeleitet werden.",
  30: "Präventive Analyse wirkt proaktiv im Design; korrektive Analyse reagiert nach einem Ausfall.",
  33: "Primär-, Sekundär- und kommandierter Ausfall unterscheiden technische Ursache, Randbedingungen und Ansteuerung.",
  37: "UND, ODER und NICHT bilden die logischen Beziehungen im Fehlerbaum ab.",
  50: "Bei reinen ODER-Verknüpfungen kann jedes Basisereignis einen kritischen Pfad bilden.",
  51: "Ein minimaler Ausfallschnitt ist die kleinste Kombination von Basisereignissen, die zum Top-Ereignis führt.",
  56: "Je zwei ausgefallene Reifen einer Fahrwerksgruppe bilden einen minimalen Ausfallschnitt.",
  57: "Eine gemeinsame Ausfallart kann vermeintlich redundante Reifen gleichzeitig beeinträchtigen.",
  60: "Der Energiepuffer liegt in beiden Versorgungspfaden und verhindert echte Redundanz.",
  62: "Ein gemeinsamer Kraftstofftank ist eine gemeinsame Ausfallursache für Generator und Notstromaggregat.",
};

const processLabels = [
  ["1. Schritt", "Systemanalyse"],
  ["2. Schritt", "Unerwünschtes Ereignis und Ausfallkriterien"],
  ["3. Schritt", "Ausfallarten der Komponenten"],
  ["4. Schritt", "Fehlerbaum erstellen"],
  ["5. Schritt", "Qualitative Bewertung"],
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrap(text, max) {
  const lines = [];
  let line = "";
  for (const word of String(text).split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && next.length > max) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
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
  const max = Math.max(9, Math.floor(width / (fontSize * 0.54)));
  const spans = wrap(text, max)
    .map((line, index) => `<tspan x="${x}" dy="${index ? Math.round(fontSize * lineHeight) : 0}">${esc(line)}</tspan>`)
    .join("");
  return `<text x="${x}" y="${y}" font-size="${fontSize}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-padding="0">${spans}</text>`;
}

function box(x, y, width, height, fill = C.surface, stroke = C.border, strokeWidth = 1.5, radius = 10) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

function group(id, label, body) {
  return `<g id="${id}"${animated ? ` data-anim-target="true" data-anim-label="${esc(label)}"` : ""}><title>${esc(label)}</title>${body}</g>`;
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

function evidence(markup, reference) {
  return `<g data-source-evidence="source_slide" data-source-reference="${esc(reference)}">${markup}</g>`;
}

function eventBox(x, y, width, height, label, options = {}) {
  const fill = options.fill || C.surface;
  const stroke = options.stroke || C.deep;
  const textFill = options.textFill || C.deep;
  const size = options.size || 18;
  return `${box(x, y, width, height, fill, stroke, options.strokeWidth || 1.8, 7)}
    ${multi(x + width / 2, y + height / 2, width - 24, label, size, 700, textFill, "middle", 1.12)}`;
}

function gate(cx, cy, label, color = C.deep, fill = C.surface) {
  return `<circle cx="${cx}" cy="${cy}" r="30" fill="${fill}" stroke="${color}" stroke-width="2"/>
    ${txt(cx, cy + 8, label, 23, 820, color, "middle")}`;
}

function basicEvent(cx, cy, color = C.deep, fill = C.surface) {
  return `<circle cx="${cx}" cy="${cy}" r="20" fill="${fill}" stroke="${color}" stroke-width="2"/>`;
}

function assetData(filename) {
  return `data:image/png;base64,${fs.readFileSync(path.join(assetRoot, filename)).toString("base64")}`;
}

function image(filename, x, y, width, height, label) {
  return `<image x="${x}" y="${y}" width="${width}" height="${height}" href="${assetData(filename)}" preserveAspectRatio="xMidYMid meet" aria-label="${esc(label)}" data-source-media="true" data-source-evidence="generated_technical_asset" data-source-reference="Kapitel-3-Redesign: konkretes technisches Orientierungsmotiv"/>`;
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

function sceneInventory(n) {
  return inventory.mappings.find((entry) => entry.source_slide_number === n);
}

function frame(scene, content) {
  const n = scene.output_slide_number;
  const title = titles[n];
  const takeaway = takeaways[n] || "Der dargestellte Zustand übernimmt Inhalt und Erklärlogik der entsprechenden Quellfolie.";
  const dense = [21, 22, 26, 30, 34, 37, 38, 39, 40, 41, 42, 43, 50, 51, 52, 53, 54, 55, 56, 57, 59, 60, 61, 62].includes(n);
  const metadata = {
    artifactScope: "full-slide",
    embeddingTarget: "standalone-slide",
    slideType: content.archetype,
    contentTitle: title,
    layoutIntent: content.layout,
    takeaway,
    density: dense ? "dense" : "balanced",
    contentMode: "full-slide",
    backgroundMode: "brand-frame",
    brandProfile: educationTheme.brandProfile,
    brandVariant: educationTheme.brandVariant,
    sourceSlides: [n],
    officialLogoStatus: "pending-original-asset",
  };
  const markerColors = [...new Set([C.accent, C.deep, C.failure, C.success, C.secondary, C.soft])];
  const markers = markerColors.map((color) =>
    `<marker id="arrow_${color.slice(1)}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L11 6L1 11Z" fill="${color}"/></marker>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="accessible_title accessible_description" data-artifact-scope="full-slide" data-embedding-target="standalone-slide" data-scene-id="${scene.scene_id}" data-brand-profile="${educationTheme.brandProfile}">
<metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(metadata)}]]></metadata>
<title id="accessible_title">${esc(title)}</title><desc id="accessible_description">${esc(takeaway)}</desc>
<defs>
  <linearGradient id="backgroundGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${educationTheme.background.start}"/><stop offset="56%" stop-color="${educationTheme.background.mid}"/><stop offset="100%" stop-color="${educationTheme.background.end}"/></linearGradient>
  <pattern id="technicalGrid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="#031334" stroke-opacity=".035" stroke-width="1"/></pattern>
  ${markers}
</defs>
<style>text{font-family:${educationTheme.bodyFontFamily};letter-spacing:0}</style>
<rect width="1920" height="1080" fill="url(#backgroundGradient)"/><rect width="1920" height="1080" fill="url(#technicalGrid)"/>
<g id="scene_content" data-qc-group="scene_content" data-qc-layer="content">${annotate(evidence(content.body, `Quellfolie ${n}: ${sceneInventory(n).source_text_title}`))}</g>
</svg>`;
}

function target(id, label, sourceText, action = "show") {
  return { id, label, sourceText, action };
}

function cue(n, fragments) {
  const spoken = sceneInventory(n).spoken_text;
  for (const fragment of fragments) {
    if (spoken.includes(fragment)) return fragment;
  }
  throw new Error(`No exact speaker cue found for slide ${n}: ${fragments.join(" / ")}`);
}

function processStrip(activeStep, y = 390, compact = false) {
  const width = compact ? 260 : 292;
  const gap = compact ? 22 : 28;
  const total = width * 5 + gap * 4;
  const x0 = (1920 - total) / 2;
  const height = compact ? 104 : 142;
  const links = processLabels.slice(0, 4).map((_, index) =>
    line(x0 + width + index * (width + gap), y + height / 2, x0 + (index + 1) * (width + gap), y + height / 2, C.soft, 2.2, true)).join("");
  const nodes = processLabels.map(([step, label], index) => {
    const active = activeStep === index + 1;
    const x = x0 + index * (width + gap);
    return `${box(x, y, width, height, active ? C.accent : C.deep, active ? C.accent : C.deep, 2, 14)}
      ${txt(x + width / 2, y + (compact ? 34 : 43), step.toUpperCase(), compact ? 17 : 19, 800, C.surface, "middle")}
      ${multi(x + width / 2, y + (compact ? 63 : 80), width - 30, label, compact ? 18 : 21, 720, C.surface, "middle", 1.08)}`;
  }).join("");
  return `${links}${nodes}`;
}

function processScene(n, activeStep) {
  const id = `process_${n}`;
  return {
    archetype: "process-flow",
    layout: "Fünfstufiger Ablaufstreifen mit eindeutig hervorgehobenem aktuellem Schritt.",
    body: group(id, "FTA-Ablauf", processStrip(activeStep)),
    targets: [target(id, "FTA-Ablauf", cue(n, [
      "Die qualitative Fehlerbaumanalyse besteht aus insgesamt fünf Schritten.",
      "Der erste Schritt ist die System-Analyse.",
      "Im zweiten Schritt legen wir das unerwünschte Ereignis fest",
      "Kommen wir nun zum dritten Schritt in der Fehlerbaumanalyse.",
      "Kommen wir nun zum vierten Schritt: der Erstellung des Fehlerbaums.",
      "Kommen wir nun zum fünften und damit auch letzten Schritt",
    ]))],
  };
}

function definitionCard(id, x, y, width, height, kicker, title, body, color, fill) {
  return group(id, title,
    `${box(x, y, width, height, fill, color, 2.2, 14)}
     ${txt(x + 30, y + 44, kicker, 18, 800, color)}
     ${multi(x + 30, y + 92, width - 60, title, 28, 800, C.deep)}
     ${multi(x + 30, y + 184, width - 60, body, 21, 610, C.text)}`);
}

function motorCircuit() {
  return `${box(98, 292, 430, 430, C.surface, C.border, 1.5, 14)}
    ${txt(313, 334, "SCHALTUNG", 18, 800, C.soft, "middle")}
    ${line(168, 430, 448, 430, C.deep, 2.5)}
    ${pathLine("M 168 430 V 620 H 448 V 430", C.deep, 2.5)}
    ${line(224, 404, 276, 430, C.deep, 2.5)}${line(314, 404, 366, 430, C.deep, 2.5)}
    ${txt(250, 386, "Schalter 1", 18, 700, C.deep, "middle")}${txt(340, 386, "Schalter 2", 18, 700, C.deep, "middle")}
    ${box(132, 468, 72, 94, C.secondarySoft, C.secondary, 2, 8)}${txt(168, 508, "+", 24, 800, C.secondary, "middle")}${txt(168, 546, "−", 24, 800, C.secondary, "middle")}${txt(168, 592, "Stromquelle", 18, 700, C.deep, "middle")}
    <circle cx="286" cy="620" r="42" fill="${C.accentSoft}" stroke="${C.accent}" stroke-width="2.5"/>${txt(286, 629, "M", 28, 820, C.accent, "middle")}${txt(286, 690, "Motor", 18, 700, C.deep, "middle")}
    ${box(402, 575, 72, 90, C.successSoft, C.success, 2, 8)}${txt(438, 620, "SG", 24, 820, C.success, "middle")}${txt(438, 690, "Steuergerät", 18, 700, C.deep, "middle")}`;
}

function motorTree(focus = "none", reduced = false) {
  const highlight = (key) => focus === key || focus === "all";
  const fillFor = (key) => highlight(key) ? C.deep : C.surface;
  const textFor = (key) => highlight(key) ? C.surface : C.deep;
  const connectors = `${line(1190, 296, 1190, 332, C.deep, 2.2)}
    ${pathLine("M 1190 392 V 410 H 742 V 438 M 1190 410 H 1190 V 438 M 1190 410 H 1638 V 438", C.deep, 2.2)}
    ${pathLine("M 742 522 V 548 M 742 608 V 630 H 650 V 656 M 742 630 H 834 V 656", C.deep, 2.2)}
    ${pathLine("M 1190 522 V 548 M 1190 608 V 630 H 1098 V 656 M 1190 630 H 1282 V 656", C.deep, 2.2)}
    ${pathLine("M 1638 522 V 548 M 1638 608 V 630 H 1488 V 656 M 1638 630 H 1638 V 656 M 1638 630 H 1788 V 656", C.deep, 2.2)}`;
  const top = eventBox(1030, 220, 320, 76, "Motor läuft nicht an", { fill: highlight("top") ? C.failure : C.failureSoft, stroke: C.failure, textFill: highlight("top") ? C.surface : C.deep, size: 22 });
  const topGate = gate(1190, 362, "≥1", C.failure, C.surface);
  const categoryData = [
    [612, "primary", "Primärausfall Motor"],
    [1060, "secondary", "Sekundärausfall Motor"],
    [1508, "commanded", "Kommandierter Ausfall Motor"],
  ];
  const categories = categoryData.map(([x, key, label]) =>
    eventBox(x, 438, 260, 84, label, { fill: fillFor(key), stroke: key === "primary" ? C.accent : key === "secondary" ? C.secondary : C.success, textFill: textFor(key), size: 19 })).join("");
  const subGates = `${gate(742, 578, "≥1", C.accent)}${gate(1190, 578, "≥1", C.secondary)}${gate(1638, 578, "≥1", C.success)}`;
  if (reduced) return { connectors: `${line(1190, 296, 1190, 332, C.deep, 2.2)}${pathLine("M 1190 392 V 410 H 742 V 438 M 1190 410 H 1190 V 438 M 1190 410 H 1638 V 438", C.deep, 2.2)}`, nodes: `${top}${topGate}${categories}` };
  const causes = [
    eventBox(558, 656, 184, 104, "Durchgebrannte Wicklung", { fill: fillFor("primary"), stroke: C.accent, textFill: textFor("primary") }),
    eventBox(752, 656, 164, 104, "Lagerschaden", { fill: fillFor("primary"), stroke: C.accent, textFill: textFor("primary") }),
    eventBox(1006, 656, 184, 104, "Blockieren durch Verschmutzung", { fill: fillFor("secondary"), stroke: C.secondary, textFill: textFor("secondary") }),
    eventBox(1200, 656, 164, 104, "Gehäusebruch: Temperatur oder Vibration", { fill: fillFor("secondary"), stroke: C.secondary, textFill: textFor("secondary"), size: 17 }),
    eventBox(1412, 656, 152, 104, "Stromquelle ausgefallen", { fill: fillFor("commanded"), stroke: C.success, textFill: textFor("commanded"), size: 17 }),
    eventBox(1574, 656, 152, 104, "Steuergerät ausgefallen", { fill: fillFor("commanded"), stroke: C.success, textFill: textFor("commanded"), size: 17 }),
    eventBox(1736, 656, 152, 104, "Ein Schalter ausgefallen", { fill: fillFor("commanded"), stroke: C.success, textFill: textFor("commanded"), size: 17 }),
  ].join("");
  const basics = [650, 834, 1098, 1282, 1488, 1638, 1788].map((x) => basicEvent(x, 800, focus === "critical" ? C.failure : C.deep, focus === "critical" ? C.failureSoft : C.surface)).join("");
  const basicLinks = [650, 834, 1098, 1282, 1488, 1638, 1788].map((x) => line(x, 760, x, 780, C.deep, 2)).join("");
  return { connectors: `${connectors}${basicLinks}`, nodes: `${top}${topGate}${categories}${subGates}${causes}${basics}` };
}

function aircraftTree(focus = "none") {
  const active = (key) => focus === key || focus === "critical";
  const fill = (key) => active(key) ? C.deep : C.surface;
  const textFill = (key) => active(key) ? C.surface : C.deep;
  const xs = [970, 1280, 1590];
  const keys = ["left", "nose", "right"];
  const labels = ["Ausfall linkes Hauptfahrwerk", "Ausfall Bugrad", "Ausfall rechtes Hauptfahrwerk"];
  const connectors = `${line(1280, 286, 1280, 326, C.deep, 2.2)}
    ${pathLine("M 1280 386 V 406 H 970 V 430 M 1280 406 V 430 M 1280 406 H 1590 V 430", C.deep, 2.2)}
    ${xs.map((x) => line(x, 508, x, 536, C.deep, 2.2)).join("")}
    ${xs.map((x) => pathLine(`M ${x} 596 V 618 H ${x - 83} V 642 M ${x} 618 H ${x + 83} V 642`, C.deep, 2.2)).join("")}
    ${xs.flatMap((x) => [x - 83, x + 83]).map((x) => line(x, 724, x, 746, C.deep, 2)).join("")}`;
  const nodes = `${eventBox(1120, 210, 320, 76, "Ausfall des Bugradfahrwerks", { fill: focus === "critical" ? C.failure : C.failureSoft, stroke: C.failure, textFill: focus === "critical" ? C.surface : C.deep, size: 21 })}
    ${gate(1280, 356, "≥1", C.failure)}
    ${xs.map((x, i) => eventBox(x - 128, 430, 256, 78, labels[i], { fill: fill(keys[i]), stroke: C.accent, textFill: textFill(keys[i]), size: 17 })).join("")}
    ${xs.map((x, i) => gate(x, 566, "&", C.accent, active(keys[i]) ? C.accentSoft : C.surface)).join("")}
    ${xs.flatMap((x, i) => [
      eventBox(x - 154, 642, 142, 82, `Ausfall ${i === 0 ? "HL" : i === 1 ? "B" : "HR"}-Reifen 1`, { fill: fill(keys[i]), stroke: C.accent, textFill: textFill(keys[i]), size: 16 }),
      eventBox(x + 12, 642, 142, 82, `Ausfall ${i === 0 ? "HL" : i === 1 ? "B" : "HR"}-Reifen 2`, { fill: fill(keys[i]), stroke: C.accent, textFill: textFill(keys[i]), size: 16 }),
    ]).join("")}
    ${xs.flatMap((x) => [x - 83, x + 83]).map((x) => basicEvent(x, 770, C.deep, focus === "critical" ? C.failureSoft : C.surface)).join("")}`;
  return { connectors, nodes };
}

function hospitalTree(focus = "none") {
  const active = (key) => focus === key;
  const fill = (key) => active(key) ? C.deep : C.surface;
  const textFill = (key) => active(key) ? C.surface : C.deep;
  const connectors = `${line(1270, 286, 1270, 326, C.deep, 2.2)}
    ${pathLine("M 1270 386 V 408 H 1020 V 438 M 1270 408 H 1520 V 438", C.deep, 2.2)}
    ${line(1020, 516, 1020, 544, C.deep, 2.2)}${line(1520, 516, 1520, 544, C.deep, 2.2)}
    ${pathLine("M 1020 604 V 626 H 920 V 652 M 1020 626 H 1120 V 652", C.deep, 2.2)}
    ${pathLine("M 1520 604 V 626 H 1370 V 652 M 1520 626 V 652 M 1520 626 H 1670 V 652", C.deep, 2.2)}`;
  const nodes = `${eventBox(1090, 210, 360, 76, "Unterbrechung der Energieversorgung", { fill: C.failureSoft, stroke: C.failure, size: 21 })}
    ${gate(1270, 356, "&", C.failure)}
    ${eventBox(890, 438, 260, 78, "Ausfall erste Energieversorgung", { fill: fill("first"), stroke: C.accent, textFill: textFill("first"), size: 18 })}
    ${eventBox(1390, 438, 260, 78, "Ausfall zweite Energieversorgung", { fill: fill("second"), stroke: C.secondary, textFill: textFill("second"), size: 18 })}
    ${gate(1020, 574, "≥1", C.accent)}${gate(1520, 574, "≥1", C.secondary)}
    ${eventBox(828, 652, 184, 92, "Stromgenerator ausgefallen", { stroke: C.accent, size: 17 })}
    ${eventBox(1028, 652, 184, 92, "Energiepuffer ausgefallen", { fill: active("buffer") ? C.failure : C.surface, stroke: active("buffer") ? C.failure : C.accent, textFill: active("buffer") ? C.surface : C.deep, size: 17 })}
    ${eventBox(1278, 652, 184, 92, "Steuergerät ausgefallen", { stroke: C.secondary, size: 17 })}
    ${eventBox(1478, 652, 184, 92, "Energiepuffer ausgefallen", { fill: active("buffer") ? C.failure : C.surface, stroke: active("buffer") ? C.failure : C.secondary, textFill: active("buffer") ? C.surface : C.deep, size: 17 })}
    ${eventBox(1678, 652, 184, 92, "Notstromaggregat ausgefallen", { stroke: C.secondary, size: 17 })}`;
  return { connectors, nodes };
}

function scene20() {
  const acronym = group("fta20_acronym", "Abkürzung FTA",
    `${box(104, 236, 720, 560, C.deep, C.deep, 2, 18,)}
     ${txt(464, 440, "FTA", 132, 900, C.surface, "middle")}
     ${multi(464, 526, 600, "Fault Tree Analysis", 36, 760, C.accentSoft, "middle")}
     ${pill(266, 632, 396, "STRUKTURIERTE TOP-DOWN-METHODE", C.accent, C.surface)}`);
  const terms = group("fta20_terms", "Deutsche Bezeichnungen",
    `${definitionCard("unused", 928, 236, 788, 246, "ENGLISCH", "Fault Tree Analysis", "Analyse logischer Ausfallpfade vom Top-Ereignis bis zu den Ursachen.", C.accent, C.accentSoft).replace(/^<g[^>]*>|<\/g>$/g, "")}
     ${definitionCard("unused", 928, 534, 788, 262, "DEUTSCH", "Fehlerbaumanalyse (FBA)", "Auch als Fehlzustandsbaumanalyse bezeichnet.", C.secondary, C.secondarySoft).replace(/^<g[^>]*>|<\/g>$/g, "")}`);
  return {
    archetype: "definition-hero",
    layout: "Großes Akronym links, zwei klar hierarchisierte Definitionen rechts.",
    body: acronym + terms,
    targets: [
      target("fta20_acronym", "Abkürzung FTA", cue(20, ["F-T-A steht für den englischen Begriff Fault Tree Analysis."])),
      target("fta20_terms", "Deutsche Bezeichnungen", cue(20, ["Im Deutschen findet man manchmal auch die Abkürzung F-B-A"])),
    ],
  };
}

function scene21() {
  const method = group("fta21_method", "Top-down-Methode",
    `${box(96, 210, 520, 650, C.surface, C.border, 1.5, 16)}
     ${pill(126, 238, 210, "TOP-DOWN", C.accent, C.accentSoft)}
     ${multi(126, 316, 430, "Die Analyse beginnt beim unerwünschten Ereignis auf Systemebene.", 25, 720, C.deep)}
     ${multi(126, 498, 430, "Danach werden Ausfälle und Ausfallfolgen Ebene für Ebene nach unten verfolgt.", 23, 620, C.text)}
     ${multi(126, 696, 430, "Am Ende stehen Basisereignisse beziehungsweise Ausfallmechanismen.", 23, 620, C.text)}`);
  const hierarchyLinks = group("fta21_links", "Hierarchie-Beziehungen",
    `${[318, 430, 542, 654, 766].slice(0, 5).map((y) => line(1200, y, 1200, y + 36, C.accent, 2.5, true)).join("")}`);
  const levels = [
    ["TOP-Ereignis", "Systemausfall", C.failure, C.failureSoft],
    ["Teilsystem", "Ausfall eines Teilsystems", C.deep, C.surface],
    ["Baugruppe", "Ausfall einer Baugruppe", C.deep, C.surface],
    ["Bauteil", "Ausfall eines Bauteils", C.deep, C.surface],
    ["Ausfallart", "Spezifische Fehlfunktion", C.secondary, C.secondarySoft],
    ["Basisereignis", "Ausfallmechanismus / Schadensursache", C.success, C.successSoft],
  ];
  const hierarchy = group("fta21_hierarchy", "FTA-Hierarchie",
    levels.map((entry, index) => {
      const y = 222 + index * 112;
      return `${box(760, y, 880, 76, entry[3], entry[2], 2, 10)}
        ${txt(790, y + 31, entry[0].toUpperCase(), 18, 800, entry[2])}
        ${txt(1160, y + 48, entry[1], 24, 720, C.deep)}`;
    }).join(""));
  return {
    archetype: "hierarchy-flow",
    layout: "Erklärspalte links und vertikale Top-down-Hierarchie rechts.",
    body: method + hierarchyLinks + hierarchy,
    targets: [
      target("fta21_method", "Top-down-Methode", cue(21, ["Die Fehlerbaumanalyse ist eine strukturierte Top-Down-Methode."])),
      target("fta21_hierarchy", "FTA-Hierarchie", cue(21, ["Das heißt, zuerst wird auf der obersten Ebene ein unerwünschtes Ereignis"])),
      target("fta21_links", "Hierarchie-Beziehungen", cue(21, ["Auf der untersten Ebene befindet sich immer das Basisereignis"] ), "draw"),
    ],
  };
}

function scene22() {
  const links = group("fta22_links", "Logische Beziehungen",
    `${line(1110, 298, 1110, 338, C.deep, 2.3)}
     ${pathLine("M 1110 398 V 422 H 820 V 452 M 1110 422 V 452 M 1110 422 H 1400 V 452", C.deep, 2.3)}
     ${[820, 1110, 1400].map((x) => line(x, 530, x, 562, C.deep, 2.3)).join("")}
     ${[820, 1110, 1400].map((x) => pathLine(`M ${x} 622 V 646 H ${x - 82} V 670 M ${x} 646 H ${x + 82} V 670`, C.deep, 2.3)).join("")}`);
  const tree = group("fta22_tree", "Beispiel-Fehlerbaum",
    `${eventBox(930, 222, 360, 76, "Ausfall des Fahrzeugs", { fill: C.failureSoft, stroke: C.failure, size: 22 })}
     ${gate(1110, 368, "≥1", C.failure)}
     ${eventBox(690, 452, 260, 78, "Ausfall Antrieb", { stroke: C.accent })}
     ${eventBox(980, 452, 260, 78, "Ausfall Getriebe", { stroke: C.accent })}
     ${eventBox(1270, 452, 260, 78, "Ausfall Abtrieb", { stroke: C.accent })}
     ${[820, 1110, 1400].map((x) => gate(x, 592, "≥1", C.accent)).join("")}
     ${["Lagerung", "Gehäuse", "Zahnrad 1", "Zahnrad 2", "Synchron.", "Überlastung"].map((label, index) => {
       const x = [738, 902, 1028, 1192, 1318, 1482][index];
       return eventBox(x - 76, 670, 152, 72, label, { stroke: C.deep, size: 17 });
     }).join("")}`);
  const value = group("fta22_value", "Nutzen des Fehlerbaums",
    `${box(92, 222, 500, 520, C.surface, C.border, 1.5, 16)}
     ${txt(122, 270, "DER FEHLERBAUM ZEIGT", 18, 800, C.accent)}
     ${multi(122, 330, 420, "• logische Verknüpfungen von Ausfällen", 23, 700, C.deep)}
     ${multi(122, 438, 420, "• kritische Ereignisse und Ereigniskombinationen", 23, 700, C.deep)}
     ${multi(122, 570, 420, "• Auswirkungen einzelner Komponentenausfälle", 23, 700, C.deep)}
     ${box(92, 788, 1438, 88, C.accentSoft, C.accent, 1.5, 9)}
     ${multi(122, 840, 1370, "Fehlerpfade werden sichtbar – und damit Schwachstellen gezielt bearbeitbar.", 25, 760, C.deep)}`);
  return {
    archetype: "fault-tree-explainer",
    layout: "Nutzenargumente links, vereinfachter Fehlerbaum rechts; Beziehungen hinter den Ereignissen.",
    body: links + tree + value,
    targets: [
      target("fta22_tree", "Beispiel-Fehlerbaum", cue(22, ["Dieses Diagramm wird Fehlerbaum genannt"])),
      target("fta22_links", "Logische Beziehungen", cue(22, ["zeigt die logischen Verknüpfungen von Ausfällen"] ), "draw"),
      target("fta22_value", "Nutzen des Fehlerbaums", cue(22, ["Auf diese Weise können kritische Ereignisse identifiziert werden"])),
    ],
  };
}

function scene23() {
  const qualitative = group("fta23_qualitative", "Qualitative FTA",
    `${box(92, 226, 800, 572, C.accentSoft, C.accent, 2.2, 14)}
     ${txt(122, 272, "QUALITATIVE FTA", 18, 820, C.accent)}
     ${txt(122, 326, "Schwachstellen verstehen", 29, 820, C.deep)}
     ${txt(122, 408, "ZIEL", 18, 820, C.accent)}${multi(282, 408, 550, "Ausfälle, Kombinationen, Ursachen und logische Abhängigkeiten identifizieren.", 22, 650, C.text)}
     ${line(122, 486, 842, 486, C.accent, 1.2)}
     ${txt(122, 538, "ERGEBNIS", 18, 820, C.accent)}${multi(282, 538, 550, "Kritische Ereignisse oder Ereigniskombinationen.", 22, 650, C.text)}
     ${line(122, 612, 842, 612, C.accent, 1.2)}
     ${txt(122, 664, "VERWENDUNG", 18, 820, C.accent)}${multi(282, 664, 550, "Schwachstellenanalyse ohne Quantifizierung von Wahrscheinlichkeiten.", 22, 650, C.text)}`);
  const quantitative = group("fta23_quantitative", "Quantitative FTA",
    `${box(1028, 226, 800, 572, C.secondarySoft, C.secondary, 2.2, 14)}
     ${txt(1058, 272, "QUANTITATIVE FTA", 18, 820, C.secondary)}
     ${txt(1058, 326, "Wahrscheinlichkeiten berechnen", 29, 820, C.deep)}
     ${txt(1058, 408, "ZIEL", 18, 820, C.secondary)}${multi(1218, 408, 550, "Ausfallwahrscheinlichkeit des Systems berechnen.", 22, 650, C.text)}
     ${line(1058, 486, 1778, 486, C.secondary, 1.2)}
     ${txt(1058, 538, "ERGEBNIS", 18, 820, C.secondary)}${multi(1218, 538, 550, "Numerische Wahrscheinlichkeit für Systemausfälle.", 22, 650, C.text)}
     ${line(1058, 612, 1778, 612, C.secondary, 1.2)}
     ${txt(1058, 664, "VERWENDUNG", 18, 820, C.secondary)}${multi(1218, 664, 550, "Risikobewertung, Maßnahmenentscheidung und Zuverlässigkeitsnachweis.", 22, 650, C.text)}`);
  const scope = group("fta23_scope", "Fokus des Moduls",
    `${box(324, 842, 1272, 82, C.deep, C.deep, 1.5, 10)}
     ${txt(960, 893, "FOKUS DIESES MODULS: QUALITATIVE FEHLERBAUMANALYSE", 23, 800, C.surface, "middle")}`);
  return {
    archetype: "two-column-comparison",
    layout: "Zwei symmetrische Vergleichskarten plus klarer Modulfokus.",
    body: qualitative + quantitative + scope,
    targets: [
      target("fta23_qualitative", "Qualitative FTA", cue(23, ["Die qualitative Fehlerbaumanalyse hat das Ziel"])),
      target("fta23_quantitative", "Quantitative FTA", cue(23, ["Das Ziel der quantitativen Fehlerbaumanalyse hingegen ist"])),
      target("fta23_scope", "Fokus des Moduls", cue(23, ["In diesem Modul befassen wir uns allerdings nur mit der qualitativen Fehlerbaumanalyse."])),
    ],
  };
}

function scene26() {
  const strip = group("fta26_process", "Schritt 1 im Ablauf", processStrip(1, 190, true));
  const cards = [
    ["fta26_boundary", "01", "Systemgrenze definieren", "Zu untersuchendes System eindeutig abgrenzen.", C.accent, C.accentSoft],
    ["fta26_influences", "02", "Einflussgrößen ermitteln", "P-Diagramm und Ishikawa-Diagramm nutzen.", C.secondary, C.secondarySoft],
    ["fta26_blocks", "03", "Bauteilblockschaltbild", "Komponenten und Wechselwirkungen untersuchen.", C.success, C.successSoft],
    ["fta26_functions", "04", "Funktionen und Anforderungen", "System- und Komponentenfunktionen verstehen.", C.failure, C.failureSoft],
  ];
  const cardMarkup = cards.map((entry, index) => {
    const x = 92 + index * 442;
    return group(entry[0], entry[2],
      `${box(x, 392, 392, 340, entry[5], entry[4], 2, 14)}
       ${txt(x + 30, 442, entry[1], 22, 820, entry[4])}
       ${multi(x + 30, 502, 330, entry[2], 27, 800, C.deep)}
       ${multi(x + 30, 624, 330, entry[3], 21, 620, C.text)}`);
  }).join("");
  const goal = group("fta26_goal", "Ziel der Systemanalyse",
    `${box(92, 788, 1718, 112, C.deep, C.deep, 1.5, 10)}
     ${txt(120, 842, "ZIEL", 18, 800, C.accentSoft)}
     ${multi(248, 846, 1500, "Tiefgreifendes Verständnis über das System und seine Wirkungsweise entwickeln.", 26, 760, C.surface)}`);
  return {
    archetype: "method-cards",
    layout: "Kompakter Ablauf oben, vier gleichgewichtete Methoden und Zielband unten.",
    body: strip + cardMarkup + goal,
    targets: [
      target("fta26_process", "Schritt 1 im Ablauf", cue(26, ["Der erste Schritt ist die System-Analyse."])),
      target("fta26_boundary", "Systemgrenze", cue(26, ["Im ersten Schritt definieren wir unsere Systemgrenze"])),
      target("fta26_influences", "Einflussgrößen", cue(26, ["Im Anschluss können wir dann die Einflussgrößen"])),
      target("fta26_blocks", "Bauteilblockschaltbild", cue(26, ["Zusätzlich können wir auch Bauteilblockschaltbilder erstellen"])),
      target("fta26_functions", "Funktionen und Anforderungen", cue(26, ["Eine Funktionsanalyse hilft uns sämtliche Funktionen"])),
      target("fta26_goal", "Ziel der Systemanalyse", cue(26, ["Das Ziel im ersten Schritt ist es, ein tiefgreifendes Verständnis"])),
    ],
  };
}

function scene29() {
  const top = group("fta29_top", "Top-Ereignis",
    `${box(606, 206, 708, 104, C.failureSoft, C.failure, 2.5, 14)}
     ${txt(960, 252, "TOP-EREIGNIS", 18, 820, C.failure, "middle")}
     ${multi(960, 286, 640, "Unerwünschtes Ereignis im Fehlerbaum", 27, 800, C.deep, "middle")}`);
  const preventive = definitionCard("fta29_preventive", 92, 382, 808, 426, "1 · PRÄVENTIVER ANSATZ", "Nicht-Erfüllung vermeiden", "Unerwünschtes Ereignis wird aus der Nicht-Erfüllung von Funktionen oder Anforderungen definiert.", C.accent, C.accentSoft);
  const corrective = definitionCard("fta29_corrective", 1020, 382, 808, 426, "2 · KORREKTIVER ANSATZ", "Aufgetretenen Ausfall analysieren", "Ein realer Ausfall oder eine Fehlfunktion des Systems wird als unerwünschtes Ereignis festgelegt.", C.secondary, C.secondarySoft);
  const links = group("fta29_links", "Ableitung zum Top-Ereignis",
    `${pathLine("M 496 808 V 870 H 820", C.accent, 2.5, true)}${pathLine("M 1424 808 V 870 H 1100", C.secondary, 2.5, true)}
     ${pill(820, 850, 280, "DEFINITION TOP-EREIGNIS", C.failure, C.surface)}`);
  return {
    archetype: "two-path-decision",
    layout: "Top-Ereignis als gemeinsames Ziel, zwei klar getrennte Herleitungswege.",
    body: top + preventive + corrective + links,
    targets: [
      target("fta29_top", "Top-Ereignis", cue(29, ["Dieses wird im Fehlerbaum an oberster Stelle als Top-Ereignis dargestellt."])),
      target("fta29_preventive", "Präventiver Ansatz", cue(29, ["Zum einen gibt es den präventiven Ansatz."])),
      target("fta29_corrective", "Korrektiver Ansatz", cue(29, ["Demgegenüber steht der korrektive Ansatz."])),
      target("fta29_links", "Ableitung zum Top-Ereignis", cue(29, ["Aber wie genau unterscheiden sich diese beiden Ansätze?"]), "draw"),
    ],
  };
}

function scene30() {
  const preventive = group("fta30_preventive", "Präventiver Ansatz",
    `${box(92, 214, 808, 608, C.accentSoft, C.accent, 2.2, 16)}
     ${txt(496, 274, "PRÄVENTIV", 31, 850, C.accent, "middle")}
     ${pill(332, 302, 328, "PROAKTIV · VOR DEM AUFTRETEN", C.accent, C.surface)}
     ${multi(134, 410, 708, "• Fehlerquellen und Risiken frühzeitig identifizieren", 23, 700, C.deep)}
     ${multi(134, 518, 708, "• Systemzuverlässigkeit und -sicherheit durch Beseitigung potenzieller Risiken verbessern", 23, 700, C.deep)}
     ${multi(134, 670, 708, "• Spätere Korrekturmaßnahmen und Reparaturen reduzieren", 23, 700, C.deep)}`);
  const corrective = group("fta30_corrective", "Korrektiver Ansatz",
    `${box(1028, 214, 800, 608, C.secondarySoft, C.secondary, 2.2, 16)}
     ${txt(1428, 274, "KORREKTIV", 31, 850, C.secondary, "middle")}
     ${pill(1254, 302, 348, "REAKTIV · NACH DEM AUFTRETEN", C.secondary, C.surface)}
     ${multi(1070, 410, 708, "• Aufgetretene Fehler und Ursachen nach Vorfall oder Systemausfall analysieren", 23, 700, C.deep)}
     ${multi(1070, 550, 708, "• Wartung und Reparatur durch gezielte Korrekturmaßnahmen verbessern", 23, 700, C.deep)}
     ${multi(1070, 690, 708, "• Ähnliche Probleme künftig vermeiden", 23, 700, C.deep)}`);
  const comparison = group("fta30_comparison", "Zeitlicher Unterschied",
    `${box(244, 856, 1432, 76, C.deep, C.deep, 1.5, 9)}
     ${txt(960, 905, "DESIGN & ENTWICKLUNG  ←  PRÄVENTIV   |   KORREKTIV  →  BETRIEB & VORFALL", 22, 780, C.surface, "middle")}`);
  return {
    archetype: "two-column-comparison",
    layout: "Symmetrischer Zeit- und Wirkungsvergleich mit klarer Proaktiv/Reaktiv-Kennung.",
    body: preventive + corrective + comparison,
    targets: [
      target("fta30_preventive", "Präventiver Ansatz", cue(30, ["Beim präventiven Ansatz erfolgt die frühzeitige Identifizierung"])),
      target("fta30_corrective", "Korrektiver Ansatz", cue(30, ["Beim korrektiven Ansatz dagegen werden die aufgetretenen Fehler"])),
      target("fta30_comparison", "Zeitlicher Unterschied", cue(30, ["Dieser Ansatz ist also reaktiv"])),
    ],
  };
}

function scene33() {
  const data = [
    ["fta33_primary", "PRIMÄRAUSFALL", "Technisches Versagen", "Ausfall unter sonst zulässigen Einsatzbedingungen, zum Beispiel Materialversagen.", C.accent, C.accentSoft],
    ["fta33_secondary", "SEKUNDÄRAUSFALL", "Unzulässige Randbedingungen", "Ausfall durch unzulässige Einsatz- oder Umgebungsbedingungen.", C.secondary, C.secondarySoft],
    ["fta33_commanded", "KOMMANDIERTER AUSFALL", "Falsche Ansteuerung", "Funktionsfähige Komponente wird am falschen Ort oder Zeitpunkt aktiviert oder deaktiviert.", C.success, C.successSoft],
  ];
  const body = data.map((entry, index) => {
    const x = 92 + index * 590;
    return group(entry[0], entry[1],
      `${box(x, 236, 540, 582, entry[5], entry[4], 2.5, 16)}
       ${txt(x + 270, 294, entry[1], 23, 850, entry[4], "middle")}
       ${box(x + 180, 338, 180, 180, C.surface, entry[4], 2, 90)}
       ${txt(x + 270, 448, index === 0 ? "⚙" : index === 1 ? "↯" : "⌁", 70, 700, entry[4], "middle")}
       ${multi(x + 270, 588, 450, entry[2], 27, 820, C.deep, "middle")}
       ${multi(x + 270, 666, 446, entry[3], 21, 620, C.text, "middle")}`);
  }).join("");
  return {
    archetype: "three-column-comparison",
    layout: "Drei gleichwertige Ausfallkategorien mit Ursache, Symbol und Definition.",
    body,
    targets: [
      target("fta33_primary", "Primärausfall", cue(33, ["Bei einem Primärausfall erfolgt der Ausfall"])),
      target("fta33_secondary", "Sekundärausfall", cue(33, ["Ein Sekundärausfall entsteht"])),
      target("fta33_commanded", "Kommandierter Ausfall", cue(33, ["Bei einem kommandierten Ausfall"])),
    ],
  };
}

function scene34() {
  const circuit = group("fta34_circuit", "Motorschaltung", motorCircuit());
  const categories = group("fta34_categories", "Ausfallpfade",
    `${definitionCard("unused", 590, 246, 388, 540, "PRIMÄRAUSFALL", "Motor selbst versagt", "Durchgebrannte Wicklung\nLagerschaden", C.accent, C.accentSoft).replace(/^<g[^>]*>|<\/g>$/g, "")}
     ${definitionCard("unused", 1004, 246, 388, 540, "SEKUNDÄRAUSFALL", "Randbedingungen wirken", "Blockieren durch Verschmutzung\nGehäusebruch durch Temperatur oder Vibration", C.secondary, C.secondarySoft).replace(/^<g[^>]*>|<\/g>$/g, "")}
     ${definitionCard("unused", 1418, 246, 388, 540, "KOMMANDIERTER AUSFALL", "Ansteuerung fehlt", "Stromquelle\nSteuergerät\nSchalter", C.success, C.successSoft).replace(/^<g[^>]*>|<\/g>$/g, "")}`);
  const event = group("fta34_event", "Unerwünschtes Ereignis",
    `${box(590, 830, 1216, 82, C.failureSoft, C.failure, 2, 10)}
     ${txt(620, 880, "TOP-EREIGNIS", 18, 820, C.failure)}
     ${txt(1020, 883, "Motor läuft nicht an", 26, 820, C.deep)}`);
  return {
    archetype: "technical-example",
    layout: "Konkrete Motorschaltung links, drei getrennte Ausfallpfade rechts.",
    body: circuit + categories + event,
    targets: [
      target("fta34_circuit", "Motorschaltung", cue(34, ["Schauen wir uns hierzu ein Beispiel einer Schaltung zur Steuerung eines Motors an."])),
      target("fta34_event", "Unerwünschtes Ereignis", cue(34, ["Das unerwünschte Ereignis können wir einfach als „Motor läuft nicht an“ definieren."])),
      target("fta34_categories", "Ausfallpfade", cue(34, ["Nun kann der Fehlerbaum in drei Pfade"])),
    ],
  };
}

function scene37() {
  const cards = [
    ["fta37_and", "UND-GATTER", "&", "Y tritt nur ein, wenn alle Sub-Ereignisse eintreten.", C.accent, C.accentSoft],
    ["fta37_or", "ODER-GATTER", "≥1", "Y tritt ein, wenn mindestens ein Sub-Ereignis eintritt.", C.secondary, C.secondarySoft],
    ["fta37_not", "NICHT-GATTER", "¬", "Y tritt ein, wenn das Sub-Ereignis nicht eintritt.", C.success, C.successSoft],
  ];
  const body = cards.map((entry, index) => {
    const x = 92 + index * 590;
    const cx = x + 270;
    const inputs = index === 2
      ? `${line(cx, 518, cx, 582, entry[4], 2.5)}
         ${eventBox(cx - 100, 582, 200, 72, "x", { stroke: entry[4], size: 24 })}`
      : `${pathLine(`M ${cx} 518 V 552 H ${cx - 84} V 582 M ${cx} 552 H ${cx + 84} V 582`, entry[4], 2.5)}
         ${eventBox(cx - 164, 582, 160, 72, "x₁", { stroke: entry[4], size: 24 })}
         ${eventBox(cx + 4, 582, 160, 72, "x₂", { stroke: entry[4], size: 24 })}`;
    return group(entry[0], entry[1],
      `${box(x, 230, 540, 610, entry[5], entry[4], 2.5, 16)}
       ${txt(cx, 286, entry[1], 25, 850, entry[4], "middle")}
       ${eventBox(cx - 100, 350, 200, 72, "Y", { stroke: entry[4], size: 26 })}
       ${line(cx, 422, cx, 458, entry[4], 2.5)}
       ${gate(cx, 488, entry[2], entry[4])}
       ${inputs}
       ${multi(cx, 730, 444, entry[3], 22, 680, C.deep, "middle")}`);
  }).join("");
  return {
    archetype: "logic-gate-comparison",
    layout: "Drei gleichartige Logikkarten mit konsequent kleiner Gatter- und Liniengröße.",
    body,
    targets: [
      target("fta37_and", "UND-Gatter", cue(37, ["Beim UND-Gatter tritt das nachfolgende Ereignis"])),
      target("fta37_or", "ODER-Gatter", cue(37, ["Beim Oder Gatter tritt das nachfolgende Ereignis"])),
      target("fta37_not", "NICHT-Gatter", cue(37, ["beim NICHT-Gatter"])),
    ],
  };
}

function motorTreeScene(n, focus, reduced = false) {
  const tree = motorTree(focus, reduced);
  const circuit = group(`fta${n}_circuit`, "Motorschaltung", motorCircuit());
  const links = group(`fta${n}_links`, "Fehlerbaum-Beziehungen", tree.connectors);
  const nodes = group(`fta${n}_nodes`, "Fehlerbaum-Ereignisse", tree.nodes);
  const noteText = focus === "primary" ? "Fokus: technische Ausfälle des Motors"
    : focus === "secondary" ? "Fokus: Randbedingungen und fehlende Ansteuerung"
      : focus === "all" ? "Vollständige Fehlerhierarchie"
        : "Vom Top-Ereignis zu den unmittelbaren Ursachen";
  const note = group(`fta${n}_note`, "Fokus",
    `${box(590, 846, 1224, 70, C.accentSoft, C.accent, 1.5, 9)}
     ${txt(620, 890, "LESEHILFE", 18, 800, C.accent)}
     ${multi(806, 891, 950, noteText, 22, 720, C.deep)}`);
  const cueNodes = cue(n, [
    "Wir wissen ja bereits, dass das Top-Fehler-Ereignis an die Spitze des Baumes platziert wird.",
    "Im nächsten Schritt identifizieren wir die unmittelbar möglichen Ursachen des Top-Ereignisses",
    "Im Anschluss werden die Sub-Ereignisse weiter in ihre zugrunde liegenden Ursachen unterteilt",
    "Auf diese Weise wird der Fehlerbaum nach unten hin immer weiter verästelt",
  ]);
  const cueLinks = cue(n, [
    "verknüpfen wir diese mit einem Oder Gatter.",
    "Auch hier verwenden wir für die einzelnen Ausfallursachen Oder Gatter",
    "logischen Verknüpfungen zwischen den einzelnen Elementen",
  ]);
  return {
    archetype: "fault-tree-example",
    layout: "Motorschaltung als technischer Anker links, großer Fehlerbaum rechts; Verbindungen liegen hinter den Ereignissen.",
    body: links + circuit + nodes + note,
    targets: [
      target(`fta${n}_circuit`, "Motorschaltung", cue(n, ["Schauen wir uns hierzu nochmals das vorherige Beispiel an."])),
      target(`fta${n}_nodes`, "Fehlerbaum-Ereignisse", cueNodes),
      target(`fta${n}_links`, "Fehlerbaum-Beziehungen", cueLinks, "draw"),
      target(`fta${n}_note`, "Fokus", cue(n, ["Auf diese Weise wird der Fehlerbaum nach unten hin immer weiter verästelt", "Das heißt ab hier gibt es keine weiteren untergeordneten Hierarchieebenen"])),
    ],
  };
}

function specialEventScene(n, type) {
  const circuit = group(`fta${n}_circuit`, "Motorschaltung", motorCircuit());
  let symbol = "";
  let title = "";
  let explanation = "";
  if (type === "cutoff") {
    title = "Pfad bewusst beenden";
    explanation = "Ein Fehlerbaum muss nicht zwingend bis zum Basisereignis geführt werden.";
    symbol = `${eventBox(1040, 354, 360, 90, "Primärausfall Motor", { stroke: C.accent, size: 22 })}
      ${line(1220, 444, 1220, 532, C.accent, 3)}
      ${line(1166, 532, 1274, 532, C.failure, 4)}`;
  } else if (type === "basic") {
    title = "Basisereignis";
    explanation = "Der Kreis kennzeichnet eine primäre Ursache beziehungsweise einen Ausfallmechanismus.";
    symbol = `${eventBox(1040, 322, 360, 90, "Primärausfall Motor", { stroke: C.accent, size: 22 })}
      ${line(1220, 412, 1220, 502, C.accent, 2.5)}
      ${basicEvent(1220, 536, C.accent, C.accentSoft)}
      ${txt(1220, 610, "BASISEREIGNIS", 22, 820, C.accent, "middle")}`;
  } else if (type === "diamond") {
    title = "Nicht weiter untersuchtes Ereignis";
    explanation = "Die Raute dokumentiert, dass dieser Ast nicht weiter analysiert wird.";
    symbol = `${eventBox(1040, 322, 360, 90, "Primärausfall Motor", { stroke: C.secondary, size: 22 })}
      ${line(1220, 412, 1220, 492, C.secondary, 2.5)}
      <path d="M1220 492 L1270 542 L1220 592 L1170 542 Z" fill="${C.secondarySoft}" stroke="${C.secondary}" stroke-width="2.5"/>
      ${txt(1220, 650, "NICHT WEITER UNTERSUCHT", 21, 820, C.secondary, "middle")}`;
  } else {
    title = "Verweisungsgatter";
    explanation = "Die nummerierte Verweisung setzt einen langen Fehlerbaum an anderer Stelle fort.";
    symbol = `${eventBox(970, 286, 300, 82, "Primärausfall Motor", { stroke: C.success, size: 21 })}
      ${line(1120, 368, 1120, 446, C.success, 2.5)}
      <path d="M1080 446 H1160 L1184 486 L1160 526 H1080 L1056 486 Z" fill="${C.successSoft}" stroke="${C.success}" stroke-width="2.5"/>
      ${txt(1120, 494, "1.1", 21, 820, C.success, "middle")}
      ${pathLine("M 1184 486 H 1394", C.success, 2.5, true, "8 6")}
      ${eventBox(1394, 438, 286, 96, "Fortsetzung 1.1", { stroke: C.success, size: 22 })}`;
  }
  const symbolGroup = group(`fta${n}_symbol`, title, symbol);
  const explanationGroup = group(`fta${n}_explanation`, "Bedeutung",
    `${box(790, 720, 950, 144, C.surface, C.border, 1.5, 12)}
     ${txt(830, 770, title.toUpperCase(), 20, 820, type === "basic" ? C.accent : type === "diamond" ? C.secondary : C.success)}
     ${multi(830, 820, 840, explanation, 23, 650, C.deep)}`);
  const cueSymbol = cue(n, type === "basic"
    ? ["Die Basisereignisse stellen immer das Ende des Fehlerbaumes dar"]
    : type === "diamond"
      ? ["Hierzu können wir einfach ein Rauten-Symbol verwenden."]
      : type === "transfer"
        ? ["kann er mit Hilfe eines Verweisungsgatters an einer anderen Stelle fortgeführt werden."]
        : ["Der Fehlerbaum muss aber nicht immer bis zum Ende durchgeführt werden."]);
  return {
    archetype: "symbol-explainer",
    layout: "Technischer Beispielanker links, ein deutlich skaliertes Fehlerbaum-Symbol und Erläuterung rechts.",
    body: circuit + symbolGroup + explanationGroup,
    targets: type === "basic"
      ? [
        target(`fta${n}_symbol`, title, cueSymbol),
        target(`fta${n}_explanation`, "Bedeutung", cueSymbol),
        target(`fta${n}_circuit`, "Motorschaltung", cue(n, ["Der Fehlerbaum muss aber nicht immer bis zum Ende durchgeführt werden."])),
      ]
      : [
        target(`fta${n}_circuit`, "Motorschaltung", cue(n, ["Der Fehlerbaum muss aber nicht immer bis zum Ende durchgeführt werden.", "Hierzu können wir neben den Basisereignissen noch weitere Symbole im Fehlerbaum verwenden.", "Schauen wir uns hierzu nochmals das vorherige Beispiel an."])),
        target(`fta${n}_symbol`, title, cueSymbol),
        target(`fta${n}_explanation`, "Bedeutung", cueSymbol),
      ],
  };
}

function scene50() {
  const tree = motorTree("critical");
  const links = group("fta50_links", "Kritische Pfade", tree.connectors.replaceAll(C.deep, C.failure));
  const nodes = group("fta50_nodes", "Fehlerbaum", tree.nodes);
  const statement = group("fta50_statement", "Bewertung",
    `${box(92, 810, 1728, 112, C.failureSoft, C.failure, 2, 10)}
     ${txt(122, 858, "KRITISCHE PFADE", 20, 850, C.failure)}
     ${multi(352, 862, 1400, "Alle Ereignisse sind über ODER-Gatter verknüpft – jeder einzelne Ausfall kann direkt zum Motorausfall führen.", 24, 730, C.deep)}`);
  return {
    archetype: "fault-tree-highlight",
    layout: "Vollständiger Fehlerbaum mit zurückhaltend rot markierten kritischen Pfaden und Auswertung darunter.",
    body: links + nodes + statement,
    targets: [
      target("fta50_nodes", "Fehlerbaum", cue(50, ["In unserem Beispiel von vorher sind alle Ereignisse im Fehlerbaum mit einem Oder Gatter verbunden."])),
      target("fta50_statement", "Bewertung", cue(50, ["Aus diesem Grund führt jeder Ausfall direkt zum Ausfall des Motors."])),
      target("fta50_links", "Kritische Pfade", cue(50, ["Demnach ist jeder Pfad im Fehlerbaum auch ein kritischer Pfad."]), "draw"),
    ],
  };
}

function scene51() {
  const circuit = group("fta51_circuit", "Redundante Stromversorgung",
    `${motorCircuit()}
     ${box(132, 724, 72, 82, C.secondarySoft, C.secondary, 2, 8)}${txt(168, 760, "+", 22, 800, C.secondary, "middle")}${txt(168, 790, "−", 22, 800, C.secondary, "middle")}${txt(236, 770, "Stromquelle 2", 18, 720, C.secondary)}`);
  const links = group("fta51_links", "UND-Verknüpfung",
    `${line(1250, 340, 1250, 386, C.failure, 2.5)}
     ${pathLine("M 1250 446 V 480 H 1050 V 516 M 1250 480 H 1450 V 516", C.failure, 2.5)}
     ${[1050,1450].map((x) => line(x, 598, x, 642, C.deep, 2.2)).join("")}`);
  const nodes = group("fta51_nodes", "Minimaler Ausfallschnitt",
    `${eventBox(1050, 258, 400, 82, "Ausfall der Stromversorgung", { fill: C.failureSoft, stroke: C.failure, size: 23 })}
     ${gate(1250, 416, "&", C.failure, C.failureSoft)}
     ${eventBox(910, 516, 280, 82, "Ausfall Stromquelle 1", { stroke: C.accent, size: 20 })}
     ${eventBox(1310, 516, 280, 82, "Ausfall Stromquelle 2", { stroke: C.secondary, size: 20 })}
     ${basicEvent(1050, 674, C.accent, C.accentSoft)}${basicEvent(1450, 674, C.secondary, C.secondarySoft)}
     ${box(850, 748, 800, 118, C.deep, C.deep, 1.5, 10)}
     ${txt(1250, 794, "MINIMALER AUSFALLSCHNITT", 20, 850, C.accentSoft, "middle")}
     ${multi(1250, 838, 700, "Stromquelle 1 UND Stromquelle 2 fallen gemeinsam aus.", 24, 740, C.surface, "middle")}`);
  return {
    archetype: "minimal-cut-set",
    layout: "Redundante Schaltung links, fokussierter UND-Teilbaum und klare Cut-Set-Aussage rechts.",
    body: links + circuit + nodes,
    targets: [
      target("fta51_circuit", "Redundante Stromversorgung", cue(51, ["Nehmen wir mal an, wir hätten in der Schaltung zur Steuerung des Motors eine zweite Stromversorgung installiert."])),
      target("fta51_nodes", "Minimaler Ausfallschnitt", cue(51, ["Da die gesamte Stromversorgung erst ausgefallen ist"])),
      target("fta51_links", "UND-Verknüpfung", cue(51, ["Erst wenn beide Ausfall-Ereignisse eingetreten sind"]), "draw"),
    ],
  };
}

function aircraftScene(n, focus) {
  const tree = aircraftTree(focus);
  const asset = group(`fta${n}_asset`, "Flugzeug mit drei Fahrwerksgruppen",
    `${box(92, 222, 624, 566, C.surface, C.border, 1.5, 16)}
     ${image("aircraft-landing-gear.png", 120, 280, 570, 320, "Passagierflugzeug mit ausgefahrenem Bug- und Hauptfahrwerk")}
     ${pill(138, 650, 150, "B · BUGRAD", C.accent, C.accentSoft)}
     ${pill(320, 650, 170, "HL · LINKS", C.secondary, C.secondarySoft)}
     ${pill(522, 650, 170, "HR · RECHTS", C.success, C.successSoft)}
     ${multi(138, 734, 540, "Jede Fahrwerksgruppe besitzt zwei Reifen.", 22, 720, C.deep)}`);
  const links = group(`fta${n}_links`, "Fehlerbaum-Beziehungen", tree.connectors);
  const nodes = group(`fta${n}_nodes`, "Fahrwerk-Fehlerbaum", tree.nodes);
  const label = focus === "critical"
    ? group(`fta${n}_focus`, "Minimale Ausfallschnitte",
      `${box(780, 832, 1056, 88, C.failureSoft, C.failure, 1.8, 9)}
       ${txt(810, 884, "MINIMALSCHNITTE", 19, 850, C.failure)}
       ${multi(1040, 884, 740, "Je zwei Reifen einer Fahrwerksgruppe fallen gemeinsam aus.", 23, 730, C.deep)}`)
    : "";
  const cueAsset = cue(n, ["Hierzu betrachten wir das Bugradfahrwerk eines Flugzeuges", "Das Bugradfahrwerk besteht aus drei Fahrwerksgruppen."]);
  const cueNodes = focus === "nose"
    ? cue(n, ["Das Bugrad ist beispielsweise ausgefallen, wenn die beiden Reifen eins und zwei ausgefallen sind."])
    : focus === "left" || focus === "right"
      ? cue(n, ["Das gleiche Prinzip gilt für das linke und rechte Hauptfahrwerk."])
      : focus === "critical"
        ? cue(n, ["Jede Kombination von zwei ausgefallenen Reifen stellt demnach einen minimalen Ausfallschnitt dar."])
        : cue(n, ["Das Top-Ereignis kann als der Ausfall des Bugradfahrwerks definiert werden."]);
  const linkCue = focus === "critical"
    ? cue(n, ["Entlang der kritischen Pfade sehen wir dann"])
    : cue(n, ["Auch hier sind die Ausfälle der Reifen jeweils mit einem Und-Gatter verbunden."]);
  const targets = [
    target(`fta${n}_asset`, "Flugzeug mit drei Fahrwerksgruppen", cueAsset),
    target(`fta${n}_nodes`, "Fahrwerk-Fehlerbaum", cueNodes),
    ...(focus === "critical" ? [target(`fta${n}_focus`, "Minimale Ausfallschnitte", cueNodes)] : []),
    target(`fta${n}_links`, "Fehlerbaum-Beziehungen", linkCue, "draw"),
  ];
  return {
    archetype: "technical-example-fault-tree",
    layout: "Konkretes Flugzeugmotiv links, großer und vollständig lesbarer Fahrwerk-Fehlerbaum rechts.",
    body: links + asset + nodes + label,
    targets,
  };
}

function scene57() {
  const tree = group("fta57_tree", "Fahrwerksgruppen",
    `${eventBox(746, 236, 430, 82, "Common Mode: gemeinsame Ausfallart", { fill: C.failureSoft, stroke: C.failure, size: 24 })}
     ${definitionCard("unused", 92, 390, 510, 430, "PFAD 1", "Feuer greift über", "Bremse überhitzt → Reifen brennt → Feuer erfasst den zweiten Reifen.", C.failure, C.failureSoft).replace(/^<g[^>]*>|<\/g>$/g, "")}
     ${definitionCard("unused", 706, 390, 510, 430, "PFAD 2", "Trümmer beschädigen", "Ein Reifen platzt → Trümmerteile beschädigen den zweiten Reifen.", C.secondary, C.secondarySoft).replace(/^<g[^>]*>|<\/g>$/g, "")}
     ${definitionCard("unused", 1320, 390, 510, 430, "PFAD 3", "Überbeanspruchung", "Ein Reifen platzt → der zweite Reifen trägt die Mehrlast und kann ebenfalls platzen.", C.accent, C.accentSoft).replace(/^<g[^>]*>|<\/g>$/g, "")}`);
  const links = group("fta57_links", "Gemeinsame Ausfallart",
    `${pathLine("M 961 318 V 352 H 347 V 390 M 961 352 V 390 M 961 352 H 1575 V 390", C.failure, 2.5, true)}`);
  const statement = group("fta57_statement", "Folge für die Zuverlässigkeit",
    `${box(246, 858, 1428, 72, C.deep, C.deep, 1.5, 9)}
     ${txt(960, 904, "VERMEINTLICHE REDUNDANZ KANN GLEICHZEITIG AUSFALLEN", 23, 820, C.surface, "middle")}`);
  return {
    archetype: "three-path-risk",
    layout: "Drei konkrete Common-Mode-Pfade unter einer gemeinsamen Risikoklammer.",
    body: links + tree + statement,
    targets: [
      target("fta57_tree", "Fahrwerksgruppen", cue(57, ["Ein Common-Mode-Ausfall bezieht sich auf den Ausfall von mehreren Komponenten"])),
      target("fta57_links", "Gemeinsame Ausfallart", cue(57, ["Das heißt der Ausfall einer Komponente bedingt direkt den Ausfall einer anderen Komponente."]), "draw"),
      target("fta57_statement", "Folge für die Zuverlässigkeit", cue(57, ["Solche Ausfälle erhöhen die Wahrscheinlichkeit eines Systemausfalls"])),
    ],
  };
}

function scene58() {
  const asset = group("fta58_asset", "Technische Komponenten",
    `${box(92, 216, 1736, 650, C.surface, C.border, 1.5, 16)}
     ${image("hospital-power-assets.png", 156, 242, 1608, 370, "Stromgenerator, Energiepuffer, Steuergerät und Notstromaggregat")}
     ${pill(330, 626, 360, "STROMGENERATOR", C.accent, C.accentSoft)}
     ${pill(760, 626, 270, "ENERGIEPUFFER", C.success, C.successSoft)}
     ${pill(1090, 626, 270, "STEUERGERÄT", C.secondary, C.secondarySoft)}
     ${pill(1420, 626, 360, "NOTSTROMAGGREGAT", C.failure, C.failureSoft)}`);
  const flow = group("fta58_flow", "Leistungs- und Signalfluss",
    `${line(690, 688, 760, 688, C.accent, 2.6, true)}
     ${pathLine("M 510 710 V 736 H 1225 V 664", C.secondary, 2.2, true, "8 6")}
     ${line(1360, 710, 1420, 710, C.secondary, 2.2, true, "8 6")}
     ${pathLine("M 895 664 V 774", C.success, 2.8, true)}
     ${pathLine("M 1600 664 V 808 H 1220", C.failure, 2.8, true)}
     ${box(720, 774, 500, 68, C.accentSoft, C.accent, 2, 10)}
     ${box(278, 884, 1364, 62, C.deep, C.deep, 1.5, 9)}
     ${txt(725, 680, "LEISTUNG", 18, 800, C.accent, "middle")}
     ${txt(850, 728, "SIGNAL", 18, 800, C.secondary, "middle")}
     ${txt(1390, 702, "SIGNAL", 18, 800, C.secondary, "middle")}
     ${txt(1510, 800, "LEISTUNG", 18, 800, C.failure)}
     ${txt(970, 817, "OP-SAAL · KONTINUIERLICHE VERSORGUNG", 20, 820, C.deep, "middle")}
     ${txt(306, 923, "BETRIEBSLOGIK", 18, 820, C.accentSoft)}
     ${multi(530, 923, 1060, "Generator versorgt den OP; Puffer überbrückt den Start des Notstromaggregats.", 22, 730, C.surface)}`);
  return {
    archetype: "technical-system-landscape",
    layout: "Vier konkrete Geräte als technisches Systembild, darunter klare Betriebslogik.",
    body: asset + flow,
    targets: [
      target("fta58_asset", "Technische Komponenten", cue(58, ["Der Operationssaal wird über ein eigenes Stromnetzwerk betrieben"])),
      target("fta58_flow", "Leistungs- und Signalfluss", cue(58, ["Im Standardbetrieb versorgt der Stromgenerator über den Energiepuffer"])),
    ],
  };
}

function hospitalTreeScene(n, focus) {
  const tree = hospitalTree(focus);
  const asset = group(`fta${n}_asset`, "Krankenhaus-Stromversorgung",
    `${box(92, 240, 600, 516, C.surface, C.border, 1.5, 16)}
     ${image("hospital-power-assets.png", 120, 302, 544, 310, "Komponenten der Krankenhaus-Stromversorgung")}
     ${multi(392, 684, 500, "Zwei Versorgungspfade sollen den Operationssaal absichern.", 22, 720, C.deep, "middle")}`);
  const links = group(`fta${n}_links`, "Fehlerbaum-Beziehungen", tree.connectors);
  const nodes = group(`fta${n}_nodes`, "Fehlerbaum", tree.nodes);
  const warning = focus === "buffer"
    ? group(`fta${n}_warning`, "Common Mode",
      `${box(800, 808, 1040, 108, C.failureSoft, C.failure, 2, 10)}
       ${txt(830, 854, "COMMON MODE", 19, 850, C.failure)}
       ${multi(1042, 858, 740, "Energiepuffer liegt in beiden Pfaden → keine echte Redundanz.", 23, 740, C.deep)}`)
    : "";
  return {
    archetype: "technical-example-fault-tree",
    layout: "Technische Anlage links und strukturierter, großformatiger Fehlerbaum rechts.",
    body: links + asset + nodes + warning,
    targets: [
      target(`fta${n}_asset`, "Krankenhaus-Stromversorgung", cue(n, ["Der Operationssaal wird über ein eigenes Stromnetzwerk betrieben", "Auf den ersten Blick wirkt das System redundant"])),
      target(`fta${n}_nodes`, "Fehlerbaum", cue(n, ["Wir beginnen zunächst mit dem Top-Ereignis", "Wie zu erkennen ist, spielt der Energiepuffer in beiden Energieversorgungspfaden"])),
      target(`fta${n}_links`, "Fehlerbaum-Beziehungen", cue(n, ["Daher sind diese beiden Ereignisse mit einem Und-Gatter verbunden.", "Auch hier sind die Ereignisse mit einem Oder Gatter verbunden."]), "draw"),
      ...(focus === "buffer" ? [target(`fta${n}_warning`, "Common Mode", cue(n, ["Dadurch entsteht eine gemeinsame Schwachstelle im System"]))] : []),
    ],
  };
}

function fuelCauseScene(n, commonCause) {
  const connectors = group(`fta${n}_links`, "Ursachen-Beziehungen",
    `${line(960, 300, 960, 342, C.deep, 2.4)}
     ${pathLine("M 960 402 V 430 H 560 V 468 M 960 430 H 1360 V 468", C.deep, 2.4)}
     ${[560,1360].map((x) => line(x, 552, x, 590, C.deep, 2.2)).join("")}
     ${pathLine("M 560 650 V 674 H 430 V 704 M 560 674 H 690 V 704", C.deep, 2.2)}
     ${pathLine("M 1360 650 V 674 H 1230 V 704 M 1360 674 H 1490 V 704", C.deep, 2.2)}`);
  const nodes = group(`fta${n}_nodes`, "Kraftstoff-Ursachen",
    `${eventBox(770, 218, 380, 82, "Kraftstoffversorgung der Generatoren", { fill: C.accentSoft, stroke: C.accent, size: 22 })}
     ${gate(960, 372, "≥1", C.accent)}
     ${eventBox(410, 468, 300, 84, "Ausfall Stromgenerator", { stroke: C.deep, size: 21 })}
     ${eventBox(1210, 468, 300, 84, "Ausfall Notstromaggregat", { stroke: C.deep, size: 21 })}
     ${gate(560, 620, "≥1", C.secondary)}${gate(1360, 620, "≥1", C.secondary)}
     ${eventBox(330, 704, 200, 82, "Einspritzung defekt", { stroke: C.secondary, size: 18 })}
     ${eventBox(590, 704, 200, 82, "Kraftstofftank leer", { fill: commonCause ? C.failure : C.surface, stroke: commonCause ? C.failure : C.secondary, textFill: commonCause ? C.surface : C.deep, size: 18 })}
     ${eventBox(1130, 704, 200, 82, "Einspritzung defekt", { stroke: C.secondary, size: 18 })}
     ${eventBox(1390, 704, 200, 82, "Kraftstofftank leer", { fill: commonCause ? C.failure : C.surface, stroke: commonCause ? C.failure : C.secondary, textFill: commonCause ? C.surface : C.deep, size: 18 })}`);
  const common = commonCause
    ? group(`fta${n}_common`, "Common Cause",
      `${pathLine("M 690 786 V 840 H 1490 V 786", C.failure, 3, false, "10 7")}
       ${box(690, 838, 800, 96, C.failureSoft, C.failure, 2, 9)}
       ${txt(720, 890, "COMMON CAUSE", 19, 850, C.failure)}
       ${multi(944, 891, 500, "Gleicher Tank = gemeinsame Ausfallursache", 23, 740, C.deep)}`)
    : group(`fta${n}_common`, "Prüffrage",
      `${box(590, 838, 740, 86, C.secondarySoft, C.secondary, 2, 9)}
       ${txt(960, 891, "PRÜFFRAGE: SIND DIE KRAFTSTOFFTANKS UNABHÄNGIG?", 22, 820, C.deep, "middle")}`);
  return {
    archetype: "cause-tree-focus",
    layout: "Zwei symmetrische Ursachenpfade; identische Kraftstofftanks werden bei Common Cause klar markiert.",
    body: connectors + nodes + common,
    targets: [
      target(`fta${n}_nodes`, "Kraftstoff-Ursachen", cue(n, ["Betrachten wir nun die Ursachen für den Ausfall des Stromgenerators"])),
      target(`fta${n}_links`, "Ursachen-Beziehungen", cue(n, ["Beide Systeme können sowohl durch eine defekte Einspritzung oder einen leeren Kraftstofftank ausfallen."]), "draw"),
      target(`fta${n}_common`, commonCause ? "Common Cause" : "Prüffrage", cue(n, commonCause ? ["Dieses Phänomen wird Common Cause genannt"] : ["Nun ist die Frage: sind die Kraftstofftanks unabhängig?"])),
    ],
  };
}

function makeScene(n) {
  if (n === 20) return scene20();
  if (n === 21) return scene21();
  if (n === 22) return scene22();
  if (n === 23) return scene23();
  if ([24, 25, 27].includes(n)) return processScene(n, n === 24 ? 0 : 1);
  if (n === 26) return scene26();
  if ([28, 31].includes(n)) return processScene(n, 2);
  if (n === 29) return scene29();
  if (n === 30) return scene30();
  if ([32, 35].includes(n)) return processScene(n, 3);
  if (n === 33) return scene33();
  if (n === 34) return scene34();
  if ([36, 48].includes(n)) return processScene(n, 4);
  if (n === 37) return scene37();
  if (n === 38) return motorTreeScene(n, "top", true);
  if (n === 39) return motorTreeScene(n, "none", true);
  if (n === 40) return motorTreeScene(n, "none");
  if (n === 41) return motorTreeScene(n, "primary");
  if (n === 42) return motorTreeScene(n, "secondary");
  if (n === 43) return motorTreeScene(n, "all");
  if (n === 44) return specialEventScene(n, "cutoff");
  if (n === 45) return specialEventScene(n, "basic");
  if (n === 46) return specialEventScene(n, "diamond");
  if (n === 47) return specialEventScene(n, "transfer");
  if (n === 49) return processScene(n, 5);
  if (n === 50) return scene50();
  if (n === 51) return scene51();
  if (n === 52) return aircraftScene(n, "none");
  if (n === 53) return aircraftScene(n, "nose");
  if (n === 54) return aircraftScene(n, "left");
  if (n === 55) return aircraftScene(n, "right");
  if (n === 56) return aircraftScene(n, "critical");
  if (n === 57) return scene57();
  if (n === 58) return scene58();
  if (n === 59) return hospitalTreeScene(n, "none");
  if (n === 60) return hospitalTreeScene(n, "buffer");
  if (n === 61) return fuelCauseScene(n, false);
  if (n === 62) return fuelCauseScene(n, true);
  throw new Error(`No chapter-3 builder for slide ${n}`);
}

function selected() {
  const index = process.argv.indexOf("--slides");
  if (index < 0) return new Set(scenes.map((scene) => scene.output_slide_number));
  const result = new Set();
  for (const token of String(process.argv[index + 1] || "").split(",")) {
    const match = token.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!match) throw new Error(`Invalid slide selection: ${token}`);
    for (let n = Number(match[1]); n <= Number(match[2] || match[1]); n += 1) result.add(n);
  }
  return result;
}

function writeManifest(scene, content) {
  const targets = content.targets.map((entry) => ({
    targetId: entry.id,
    label: entry.label,
    status: "animated",
    visibleInEditor: true,
    render: true,
    confidence: "high",
  }));
  const steps = content.targets.map((entry, index) => ({
    stepId: `step_${String(index + 1).padStart(2, "0")}_${entry.id}`,
    targetId: entry.id,
    action: entry.action,
    sourceText: entry.sourceText,
    occurrence: 1,
    confidence: "high",
    notes: entry.action === "draw"
      ? "Beziehung wird erst nach den zugehörigen Ereignissen gezeichnet; kleine Linien- und Pfeilskalierung."
      : "Sprechertextgeführte semantische Gruppe.",
    ...(entry.action === "draw" ? { drawDurFrames: 40 } : { enterFrames: 16 }),
  }));
  const manifest = {
    schemaVersion: "svgAnimationManifest/v1",
    svgPath: `${scene.work_unit}.svg`,
    defaults: { enterFrames: 16, exitFrames: 12, highlightDurFrames: 30, drawDurFrames: 40, transformDurFrames: 30 },
    targets,
    steps,
  };
  const dir = path.join(outRoot, scene.work_unit);
  fs.writeFileSync(path.join(dir, "scene.animation.v1.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(dir, "element-animation-plan.json"), `${JSON.stringify({
    schemaVersion: "elementAnimationPlan/v1",
    sceneId: scene.scene_id,
    targets,
    steps,
  }, null, 2)}\n`, "utf8");
}

function writeBrief(scene, content) {
  const source = sceneInventory(scene.output_slide_number);
  const brief = `# Redesign-Brief — ${scene.work_unit}

- Kapitel: 3
- Lektion: ${scene.lesson}
- Quellfolie: ${scene.output_slide_number}
- Sprechertext: ${source.source_text_section_id} — ${source.source_text_title}
- Titel: ${titles[scene.output_slide_number]}
- Takeaway: ${takeaways[scene.output_slide_number] || "Quelltreuer Aufbauzustand innerhalb der FTA-Erklärfolge."}
- Archetyp: ${content.archetype}
- Layout: ${content.layout}
- Produktionsmodus: Full-Slide 1920×1080
- Mapping: 1:1, keine Zusammenfassung mit benachbarten Quellfolien
- Konnektoren: hinter Knoten und Text; Normalstärke 2,0–2,5 px
- Animation: ${animated ? "sprechertextgeführt aktiviert" : "noch nicht aktiviert; statischer Endzustand zur visuellen Prüfung"}
`;
  fs.writeFileSync(path.join(outRoot, scene.work_unit, "redesign-brief.md"), brief, "utf8");
}

function prepareMedia(scene) {
  const n = scene.output_slide_number;
  if (n < 52) return;
  const mediaDir = path.join(outRoot, scene.work_unit, "media");
  fs.mkdirSync(mediaDir, { recursive: true });
  if (n <= 57) {
    fs.copyFileSync(path.join(assetRoot, "aircraft-landing-gear.png"), path.join(mediaDir, "aircraft-landing-gear.png"));
  } else {
    fs.copyFileSync(path.join(assetRoot, "hospital-power-assets.png"), path.join(mediaDir, "hospital-power-assets.png"));
  }
}

function main() {
  const wanted = selected();
  const generated = [];
  for (const scene of scenes) {
    const n = scene.output_slide_number;
    if (!wanted.has(n)) continue;
    const dir = path.join(outRoot, scene.work_unit);
    fs.mkdirSync(dir, { recursive: true });
    prepareMedia(scene);
    const content = makeScene(n);
    fs.writeFileSync(path.join(dir, `${scene.work_unit}.svg`), `${frame(scene, content)}\n`, "utf8");
    writeBrief(scene, content);
    if (animated) writeManifest(scene, content);
    generated.push(scene.work_unit);
  }
  process.stdout.write(`Generated ${generated.length} RE2 chapter-3 scene(s)${animated ? " with animation" : " as static end states"}: ${generated.join(", ")}.\n`);
}

main();
