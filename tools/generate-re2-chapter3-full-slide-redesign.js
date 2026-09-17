const fs = require("fs");
const path = require("path");
const educationTheme = require("./reltest-education-theme");

const root = path.resolve(__dirname, "..");
const outRoot = path.join(root, "rebuild-proposals", "svg", "RE2");
const assetRoot = path.join(root, "components", "image-library", "re2-ch3-fta");
const corePictogramRoot = path.join(root, "components", "image-library", "generated-pictograms", "education-core");
const sceneThumbnailRoot = path.join(root, "analysis", "redesign-assets", "RE2-user-feedback-2026-08-27", "scene-thumbnails");
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

function contextGroup(id, label, body) {
  return `<g id="${id}" data-static-context="true"><title>${esc(label)}</title>${body}</g>`;
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

function bulletList(x, y, width, items, color = C.accent, size = 21, gap = 58) {
  return items.map((item, index) => {
    const yy = y + index * gap;
    return `${box(x, yy - 16, 16, 16, color, color, 1, 8)}${multi(x + 34, yy, width - 34, item, size, 620, C.text, "start", 1.16)}`;
  }).join("");
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

function pictogramImage(filename, kind, x, y, size, label) {
  const data = `data:image/png;base64,${fs.readFileSync(path.join(corePictogramRoot, filename)).toString("base64")}`;
  return `<image x="${x}" y="${y}" width="${size}" height="${size}" href="${data}" preserveAspectRatio="xMidYMid meet" aria-label="${esc(label)}" data-component="reltest-pictogram" data-pictogram-style="reltest-education-minimal-v1" data-pictogram-kind="${esc(kind)}" data-source-media="true" data-source-evidence="user_request" data-source-reference="Nutzerfeedback: freigegebenes PNG-Piktogramm für das Ziel"/>`;
}

function sceneThumbnail(filename, x, y, width, height, label) {
  const data = `data:image/png;base64,${fs.readFileSync(path.join(sceneThumbnailRoot, filename)).toString("base64")}`;
  return `<image x="${x}" y="${y}" width="${width}" height="${height}" href="${data}" preserveAspectRatio="xMidYMid slice" aria-label="${esc(label)}" data-source-media="true" data-source-evidence="user_request" data-source-reference="Nutzerfeedback: verkleinerter Screenshot einer bereits aufgebauten RE2-Szene"/>`;
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
  const title = scene.content_title_override || titles[n];
  const takeaway = content.takeaway || takeaways[n] || "Der dargestellte Zustand übernimmt Inhalt und Erklärlogik der entsprechenden Quellfolie.";
  const dense = [21, 22, 26, 30, 34, 37, 38, 39, 40, 41, 42, 43, 47, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62].includes(n);
  const metadata = {
    artifactScope: "content-svg",
    embeddingTarget: "powerpoint-slide",
    slideType: content.archetype,
    contentTitle: title,
    layoutIntent: content.layout,
    takeaway,
    density: dense ? "dense" : "normal",
    contentMode: "transparent-content",
    backgroundMode: "transparent",
    brandProfile: educationTheme.brandProfile,
    brandVariant: educationTheme.brandVariant,
    sourceSlides: scene.source_slides || [n],
    officialLogoStatus: "pending-original-asset",
  };
  const markerColors = [...new Set([C.accent, C.deep, C.failure, C.success, C.secondary, C.technical, C.soft, C.border])]
    .filter((color) => content.body.includes(color));
  const markers = markerColors.map((color) =>
    `<marker id="arrow_${color.slice(1)}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L11 6L1 11Z" fill="${color}"/></marker>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="accessible_title accessible_description" data-artifact-scope="content-svg" data-embedding-target="powerpoint-slide" data-scene-id="${scene.scene_id}" data-brand-profile="${educationTheme.brandProfile}">
<metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(metadata)}]]></metadata>
<title id="accessible_title">${esc(title)}</title><desc id="accessible_description">${esc(takeaway)}</desc>
<defs>
  ${markers}
</defs>
<style>text{font-family:${educationTheme.bodyFontFamily};letter-spacing:0}</style>
<g id="scene_content" data-qc-group="scene_content" data-qc-layer="content">${annotate(evidence(content.body, scene.source_slides?.length > 1
    ? `Quellfolien ${scene.source_slides[0]}–${scene.source_slides.at(-1)}: ${sceneInventory(n).source_text_title}`
    : `Quellfolie ${n}: ${sceneInventory(n).source_text_title}`))}</g>
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

function navText(x, y, text, size, weight, fill, anchor = "middle") {
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="annotation" data-qc-layer="text" data-qc-padding="0">${esc(text)}</text>`;
}

function navMulti(x, y, width, text, size, weight, fill, lineHeight = 1) {
  const max = Math.max(9, Math.floor(width / (size * 0.54)));
  const spans = wrap(text, max)
    .map((row, index) => `<tspan x="${x}" dy="${index ? Math.round(size * lineHeight) : 0}">${esc(row)}</tspan>`)
    .join("");
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="middle" data-qc-role="annotation" data-qc-layer="text" data-qc-padding="0">${spans}</text>`;
}

function processStrip(activeStep, y = 390, compact = false) {
  const width = compact ? 232 : 252;
  const gap = compact ? 14 : 18;
  const total = width * 5 + gap * 4;
  const x0 = (1920 - total) / 2;
  const height = compact ? 96 : 124;
  const links = processLabels.slice(0, 4).map((_, index) =>
    line(x0 + width + index * (width + gap), y + height / 2, x0 + (index + 1) * (width + gap), y + height / 2, C.soft, 1.5, true)).join("");
  const nodes = processLabels.map(([step, label], index) => {
    const active = activeStep === index + 1;
    const x = x0 + index * (width + gap);
    const fill = active ? C.educationAccent : C.surface;
    const stroke = active ? C.educationAccent : C.deep;
    const textFill = active ? C.surface : C.deep;
    return `${box(x, y, width, height, fill, stroke, 1.5, 8)}
      ${navText(x + width / 2, y + (compact ? 25 : 32), step.toUpperCase(), 18, 820, textFill)}
      ${navMulti(x + width / 2, y + (compact ? 50 : 64), width - 28, label, 18, 720, textFill, 1)}`;
  }).join("");
  return `${links}${nodes}`;
}

function processScene(n, activeStep) {
  const id = `process_${n}`;
  return {
    archetype: "process-flow",
    layout: "Kompakte fünfstufige FTA-Schrittübersicht als ruhiger Orientierungsrahmen; der aktuelle Schritt ist signalgrün hervorgehoben.",
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

function motorCircuit(options = {}) {
  const secondSource = Boolean(options.secondSource);
  const sourceTwo = secondSource
    ? `${pathLine("M 168 430 H 104 V 488", C.technical, 2.5, false)}
       ${line(70, 488, 138, 488, C.technical, 2.8, false)}${line(82, 512, 126, 512, C.technical, 2.8, false)}
       ${pathLine("M 104 512 V 620 H 168", C.technical, 2.5, false)}
       ${multi(104, 550, 122, "Stromquelle 2", 18, 720, C.technical, "middle")}`
    : "";
  return `${box(54, 292, 514, 430, C.surface, C.border, 1.5, 14)}
    ${txt(311, 334, secondSource ? "REDUNDANTE SCHALTUNG" : "SCHALTUNG", 18, 800, C.soft, "middle")}
    ${pathLine("M 168 430 H 226", C.deep, 2.5, false)}
    <circle cx="226" cy="430" r="9" fill="${C.surface}" stroke="${C.deep}" stroke-width="2.5"/>
    <circle cx="276" cy="430" r="9" fill="${C.surface}" stroke="${C.deep}" stroke-width="2.5"/>
    ${line(226, 430, 270, 412, C.deep, 2.5, false)}
    ${pathLine("M 276 430 H 316", C.deep, 2.5, false)}
    <circle cx="316" cy="430" r="9" fill="${C.surface}" stroke="${C.deep}" stroke-width="2.5"/>
    <circle cx="366" cy="430" r="9" fill="${C.surface}" stroke="${C.deep}" stroke-width="2.5"/>
    ${line(316, 430, 360, 412, C.deep, 2.5, false)}
    ${pathLine("M 366 430 H 448 V 620 H 474", C.deep, 2.5, false)}
    ${txt(251, 386, "Schalter 1", 18, 700, C.deep, "middle")}${txt(341, 386, "Schalter 2", 18, 700, C.deep, "middle")}
    ${pathLine("M 168 430 V 488", C.deep, 2.5, false)}
    ${line(134, 488, 202, 488, C.deep, 2.8, false)}${line(146, 512, 190, 512, C.deep, 2.8, false)}
    ${pathLine("M 168 512 V 620 H 244", C.deep, 2.5, false)}
    ${txt(214, 548, secondSource ? "Stromquelle 1" : "Stromquelle", 18, 700, C.deep)}
    <circle cx="286" cy="620" r="42" fill="${C.accentSoft}" stroke="${C.accent}" stroke-width="2.5"/>${txt(286, 629, "M", 28, 820, C.accent, "middle")}${txt(286, 690, "Motor", 18, 700, C.deep, "middle")}
    ${line(328, 620, 402, 620, C.deep, 2.5, false)}
    ${box(402, 575, 72, 90, C.surface, C.accent, 2, 5)}${txt(438, 629, "SG", 24, 820, C.accent, "middle")}${txt(438, 690, "Steuergerät", 18, 700, C.deep, "middle")}
    ${sourceTwo}`;
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
  const active = (key) => focus === key;
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
    ${xs.flatMap((x) => [x - 83, x + 83]).map((x) => basicEvent(x, 770, C.deep, C.surface)).join("")}`;
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

function hospitalPowerSchematic({ x = 92, y = 250, scale = 1 } = {}) {
  const sx = (value) => x + value * scale;
  const sy = (value) => y + value * scale;
  const sw = (value) => value * scale;
  const node = (nx, ny, width, height, label, fill = C.surface, stroke = C.deep) =>
    `${box(sx(nx), sy(ny), sw(width), sw(height), fill, stroke, 1.8, 8)}
     ${multi(sx(nx + width / 2), sy(ny + height / 2 + 8), sw(width - 24), label, Math.max(16, 20 * scale), 760, C.deep, "middle", 1.04)}`;
  return `${node(210, 0, 360, 92, "OP-SAAL · ENERGIEVERSORGUNG", C.accentSoft, C.accent)}
    ${node(430, 176, 280, 92, "ENERGIEPUFFER", C.successSoft, C.success)}
    ${node(70, 176, 280, 92, "NOTSTROMAGGREGAT")}
    ${node(430, 352, 280, 92, "STROMGENERATOR")}
    ${node(70, 352, 280, 92, "STEUERGERÄT")}
    ${pathLine(`M ${sx(570)} ${sy(352)} V ${sy(268)}`, C.deep, Math.max(2, 3 * scale), true)}
    ${pathLine(`M ${sx(570)} ${sy(176)} V ${sy(130)} H ${sx(470)} V ${sy(92)}`, C.deep, Math.max(2, 3 * scale), true)}
    ${pathLine(`M ${sx(210)} ${sy(176)} V ${sy(130)} H ${sx(310)} V ${sy(92)}`, C.deep, Math.max(2, 3 * scale), true)}
    ${pathLine(`M ${sx(210)} ${sy(352)} V ${sy(268)}`, C.deep, Math.max(2, 3 * scale), true)}
    ${pathLine(`M ${sx(430)} ${sy(398)} H ${sx(350)}`, C.secondary, Math.max(2, 2.6 * scale), true, "9 7")}`;
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
  const context = group("fta22_context", "Top-down-Methode",
    `${txt(98, 278, "FTA", 104, 900, C.deep)}
     ${txt(104, 326, "FAULT TREE ANALYSIS", 18, 820, C.accent)}
     ${multi(104, 374, 350, "Fehlerbaum- oder Fehlzustandsbaumanalyse", 22, 680, C.text)}
     ${line(104, 476, 456, 476, C.border, 2, false)}
     ${txt(104, 532, "TOP-DOWN", 20, 850, C.accent)}
     ${multi(104, 574, 350, "Vom unerwünschten Ereignis Ebene für Ebene bis zur Schadensursache.", 22, 650, C.text)}`);
  const levelTop = group("fta22_level_top", "Top-Ereignis auf Systemebene",
    `${txt(538, 238, "01", 18, 850, C.failure)}${eventBox(610, 204, 430, 68, "TOP-EREIGNIS · SYSTEMAUSFALL", { fill: C.failureSoft, stroke: C.failure, size: 19 })}`);
  const levelSubsystem = group("fta22_level_subsystem", "Teilsystemebene",
    `${line(825, 272, 825, 306, C.accent, 2.2, true)}${txt(558, 350, "02", 18, 850, C.accent)}${eventBox(640, 306, 370, 68, "AUSFALL EINES TEILSYSTEMS", { fill: C.accentSoft, stroke: C.accent, size: 18 })}`);
  const levelAssembly = group("fta22_level_assembly", "Baugruppenebene",
    `${line(825, 374, 825, 408, C.accent, 2.2, true)}${txt(578, 452, "03", 18, 850, C.accent)}${eventBox(670, 408, 310, 68, "AUSFALL EINER BAUGRUPPE", { stroke: C.accent, size: 18 })}`);
  const levelComponent = group("fta22_level_component", "Bauteilebene",
    `${line(825, 476, 825, 510, C.accent, 2.2, true)}${txt(598, 554, "04", 18, 850, C.accent)}${eventBox(700, 510, 250, 68, "AUSFALL EINES BAUTEILS", { stroke: C.accent, size: 18 })}`);
  const levelFailure = group("fta22_level_failure", "Ausfallart",
    `${line(825, 578, 825, 612, C.accent, 2.2, true)}${txt(618, 656, "05", 18, 850, C.accent)}${eventBox(720, 612, 210, 68, "AUSFALLART", { fill: C.accentSoft, stroke: C.accent, size: 18 })}`);
  const levelBasic = group("fta22_level_basic", "Basisereignis und Ausfallmechanismus",
    `${line(825, 680, 825, 714, C.accent, 2.2, true)}${txt(638, 758, "06", 18, 850, C.accent)}${eventBox(735, 714, 180, 68, "BASISEREIGNIS", { stroke: C.accent, size: 17 })}
     ${multi(825, 824, 370, "Schadensursache / Ausfallmechanismus", 19, 700, C.deep, "middle")}`);
  const links = group("fta22_links", "Logische Beziehungen",
    `${line(1502, 298, 1502, 330, C.deep, 2.2, false)}
     ${pathLine("M 1502 390 V 414 H 1328 V 444 M 1502 414 H 1676 V 444", C.deep, 2.2, false)}
     ${line(1328, 512, 1328, 548, C.deep, 2.2, false)}${line(1676, 512, 1676, 548, C.deep, 2.2, false)}
     ${pathLine("M 1328 608 V 632 H 1248 V 662 M 1328 632 H 1408 V 662", C.deep, 2.2, false)}
     ${pathLine("M 1676 608 V 632 H 1596 V 662 M 1676 632 H 1756 V 662", C.deep, 2.2, false)}`);
  const tree = group("fta22_tree", "Beispiel-Fehlerbaum",
    `${txt(1502, 198, "BEISPIEL-FEHLERBAUM", 18, 820, C.accent, "middle")}
     ${eventBox(1332, 230, 340, 68, "Systemausfall", { fill: C.failureSoft, stroke: C.failure, size: 20 })}
     ${gate(1502, 360, "≥1", C.accent)}
     ${eventBox(1208, 444, 240, 68, "Ausfall Teilsystem A", { stroke: C.accent, size: 17 })}
     ${eventBox(1556, 444, 240, 68, "Ausfall Teilsystem B", { stroke: C.accent, size: 17 })}
     ${gate(1328, 578, "≥1", C.accent)}${gate(1676, 578, "≥1", C.accent)}
     ${eventBox(1172, 662, 152, 66, "Ausfall A1", { stroke: C.accent, size: 17 })}
     ${eventBox(1332, 662, 152, 66, "Ausfall A2", { stroke: C.accent, size: 17 })}
     ${eventBox(1520, 662, 152, 66, "Ausfall B1", { stroke: C.accent, size: 17 })}
     ${eventBox(1680, 662, 152, 66, "Ausfall B2", { stroke: C.accent, size: 17 })}`);
  const value = group("fta22_value", "Nutzen des Fehlerbaums",
    `${line(102, 884, 1818, 884, C.border, 2, false)}
     ${txt(104, 932, "FEHLERPFADE", 19, 850, C.deep)}
     ${line(286, 924, 430, 924, C.accent, 2.5, true)}
     ${txt(466, 932, "SCHWACHSTELLEN VERSTEHEN", 19, 850, C.deep)}
     ${line(808, 924, 952, 924, C.accent, 2.5, true)}
     ${txt(988, 932, "KRITISCHE KOMBINATIONEN ERKENNEN", 19, 850, C.deep)}
     ${line(1408, 924, 1552, 924, C.accent, 2.5, true)}
     ${txt(1588, 932, "RISIKEN MINIMIEREN", 19, 850, C.deep)}`);
  return {
    archetype: "top-down-evidence-map",
    layout: "FTA-Begriff links, schrittweise aufgebaute Top-down-Hierarchie in der Mitte und konkreter Fehlerbaum rechts; Nutzen als offene Wirkungskette.",
    body: context + levelTop + levelSubsystem + levelAssembly + levelComponent + levelFailure + levelBasic + tree + links + value,
    targets: [
      target("fta22_context", "Top-down-Methode", cue(22, ["Die Fehlerbaumanalyse ist eine strukturierte Top-Down-Methode."])),
      target("fta22_level_top", "Top-Ereignis auf Systemebene", cue(22, ["Das heißt, zuerst wird auf der obersten Ebene ein unerwünschtes Ereignis"])),
      target("fta22_level_subsystem", "Teilsystemebene", cue(22, ["Anschließend werden systematisch alle Ausfälle"])),
      target("fta22_level_assembly", "Baugruppenebene", cue(22, ["im Anschluss dann die Baugruppen"])),
      target("fta22_level_component", "Bauteilebene", cue(22, ["schließlich gelangen wir zu den einzelnen Bauteilen"])),
      target("fta22_level_failure", "Ausfallart", cue(22, ["und ihren spezifischen Ausfallarten"])),
      target("fta22_level_basic", "Basisereignis und Ausfallmechanismus", cue(22, ["Auf der untersten Ebene befindet sich immer das Basisereignis"])),
      target("fta22_tree", "Beispiel-Fehlerbaum", cue(22, ["Dieses Diagramm wird Fehlerbaum genannt"])),
      target("fta22_links", "Logische Beziehungen", cue(22, ["zeigt die logischen Verknüpfungen von Ausfällen"] ), "draw"),
      target("fta22_value", "Nutzen des Fehlerbaums", cue(22, ["Damit können wir also die Fehlerpfade innerhalb eines Systems visualisieren"])),
    ],
  };
}

function scene23() {
  const parent = group("fta23_parent", "Fehlerbaumanalyse als Oberbegriff",
    `${txt(960, 226, "FEHLERBAUMANALYSE", 34, 860, C.deep, "middle")}
     ${txt(960, 264, "zwei komplementäre Ausprägungen", 20, 650, C.text, "middle")}
     ${line(758, 286, 1162, 286, C.accent, 5)}`);
  const links = group("fta23_links", "Aufteilung der FTA",
    `${pathLine("M 960 286 V 326 H 492 V 360", C.deep, 2.5, true)}
     ${pathLine("M 960 326 H 1428 V 360", C.deep, 2.5, true)}`);
  const qualitative = group("fta23_qualitative", "Qualitative FTA",
    `${txt(106, 400, "01", 60, 900, C.accentSoft)}
     ${txt(206, 394, "QUALITATIVE FTA", 27, 850, C.deep)}
     ${txt(206, 426, "Schwachstellen verstehen", 20, 700, C.accent)}
     ${line(106, 466, 858, 466, C.border, 2)}
     ${txt(106, 516, "ZIEL", 18, 850, C.accent)}${multi(270, 516, 572, "Sämtliche Ausfälle, Ausfallkombinationen, Ursachen und logische Abhängigkeiten identifizieren.", 21, 650, C.text)}
     ${line(106, 612, 858, 612, C.border, 1.4)}
     ${txt(106, 660, "ERGEBNIS", 18, 850, C.accent)}${multi(270, 660, 572, "Kritische Ereignisse oder Ereigniskombinationen.", 21, 650, C.text)}
     ${line(106, 730, 858, 730, C.border, 1.4)}
     ${txt(106, 778, "VERWENDUNG", 18, 850, C.accent)}${multi(270, 778, 572, "Schwachstellenanalyse; keine Quantifizierung von Wahrscheinlichkeiten.", 21, 650, C.text)}`);
  const quantitative = group("fta23_quantitative", "Quantitative FTA",
    `${txt(1042, 400, "02", 60, 900, C.secondarySoft)}
     ${txt(1142, 394, "QUANTITATIVE FTA", 27, 850, C.deep)}
     ${txt(1142, 426, "Wahrscheinlichkeiten berechnen", 20, 700, C.secondary)}
     ${line(1042, 466, 1794, 466, C.border, 2)}
     ${txt(1042, 516, "ZIEL", 18, 850, C.secondary)}${multi(1206, 516, 572, "Ausfallwahrscheinlichkeit des Systems berechnen.", 21, 650, C.text)}
     ${line(1042, 612, 1794, 612, C.border, 1.4)}
     ${txt(1042, 660, "ERGEBNIS", 18, 850, C.secondary)}${multi(1206, 660, 572, "Numerische Wahrscheinlichkeiten für Systemausfälle.", 21, 650, C.text)}
     ${line(1042, 730, 1794, 730, C.border, 1.4)}
     ${txt(1042, 778, "VERWENDUNG", 18, 850, C.secondary)}${multi(1206, 778, 572, "Risikobewertung, Maßnahmenentscheidung und Zuverlässigkeitsnachweis.", 21, 650, C.text)}`);
  const scope = group("fta23_scope", "Fokus des Moduls",
    `${line(106, 882, 858, 882, C.educationAccent, 5)}
     ${txt(106, 928, "FOKUS DIESES MODULS", 18, 850, C.educationAccent)}
     ${txt(352, 928, "QUALITATIVE FEHLERBAUMANALYSE", 22, 850, C.deep)}`);
  return {
    archetype: "open-branching-comparison",
    layout: "Sichtbarer Oberbegriff verzweigt in zwei gleichrangige, offen ausgerichtete Vergleichsspalten mit identischen Zeilen.",
    body: parent + qualitative + quantitative + links + scope,
    targets: [
      target("fta23_parent", "Fehlerbaumanalyse als Oberbegriff", cue(23, ["Nachdem wir die Grundlagen der Fehlerbaumanalyse besprochen haben"])),
      target("fta23_qualitative", "Qualitative FTA", cue(23, ["Zum einen gibt es die qualitative"])),
      target("fta23_quantitative", "Quantitative FTA", cue(23, ["und zum anderen die quantitative Fehlerbaumanalyse"])),
      target("fta23_links", "Aufteilung der FTA", cue(23, ["Beide Ansätze ergänzen sich"]), "draw"),
      target("fta23_scope", "Fokus des Moduls", cue(23, ["In diesem Modul befassen wir uns allerdings nur mit der qualitativen Fehlerbaumanalyse."])),
    ],
  };
}

function scene26() {
  const strip = group("fta26_process", "Schritt 1 im Ablauf", processStrip(1, 150, true));
  const stages = [
    ["fta26_boundary", 1, 318, "SYSTEMGRENZE", "System eindeutig abgrenzen", ["Untersuchungsraum festlegen", "Schnittstellen sichtbar machen"], "slide_004.png", "Vorschau der Systemgrenzen-Szene"],
    ["fta26_influences", 2, 458, "EINFLUSSGRÖSSEN", "Wirkende Größen ermitteln", ["P-Diagramm", "Ishikawa-Diagramm"], "slide_008.png", "Vorschau der P-Diagramm-Szene"],
    ["fta26_blocks", 3, 598, "KOMPONENTEN", "Wechselwirkungen untersuchen", ["Bauteilblockschaltbild", "interne Beziehungen"], "slide_013.png", "Vorschau des Wechselrichter-Blockdiagramms"],
    ["fta26_functions", 4, 738, "FUNKTIONEN", "Anforderungen verstehen", ["Systemfunktionen", "Komponentenfunktionen"], "slide_016.png", "Vorschau der Funktionsstruktur-Szene"],
  ];
  const stageMarkup = stages.map(([id, stepNumber, y, kicker, headline, bullets, thumbnail, thumbnailLabel]) => group(id, `Vorgehensschritt ${stepNumber}: ${headline}`,
    `${line(104, y + 118, 1816, y + 118, C.border, 1.4, false)}
     ${txt(126, y + 56, `${stepNumber}.`, 32, 900, C.deep, "middle")}
     ${txt(170, y + 22, kicker, 18, 840, C.accent)}
     ${txt(170, y + 58, headline, 25, 800, C.deep)}
     ${txt(760, y + 34, "•", 22, 850, C.accent)}${txt(792, y + 34, bullets[0], 20, 650, C.text)}
     ${txt(760, y + 76, "•", 22, 850, C.accent)}${txt(792, y + 76, bullets[1], 20, 650, C.text)}
     ${box(1370, y - 2, 420, 112, C.surface, C.border, 1.4, 8)}
     ${sceneThumbnail(thumbnail, 1378, y + 6, 404, 96, thumbnailLabel)}`)).join("");
  const goal = group("fta26_goal", "Ziel der Systemanalyse",
    `${box(104, 890, 1712, 74, C.accentSoft, C.accent, 2, 8)}
     ${pictogramImage("target.png", "target", 126, 894, 66, "Zielscheibe")}
     ${txt(220, 934, "ZIEL", 18, 840, C.accent)}
     ${multi(340, 934, 1410, "Tiefgreifendes Verständnis über das System und seine Wirkungsweise entwickeln.", 23, 760, C.deep)}`);
  return {
    archetype: "open-analysis-route",
    layout: "Kompakter FTA-Kontext oben; darunter die vier nummerierten Vorgehensschritte 1 bis 4 mit kleinen Vorschaubildern bereits aufgebauter RE2-Szenen und gemeinsamem Ziel.",
    body: strip + stageMarkup + goal,
    targets: [
      target("fta26_process", "Schritt 1 im Ablauf", cue(26, ["Der erste Schritt ist die System-Analyse."])),
      target("fta26_boundary", "Vorgehensschritt 1: Systemgrenze", cue(26, ["Im ersten Schritt definieren wir unsere Systemgrenze"])),
      target("fta26_influences", "Vorgehensschritt 2: Einflussgrößen", cue(26, ["Im Anschluss können wir dann die Einflussgrößen"])),
      target("fta26_blocks", "Vorgehensschritt 3: Bauteilblockschaltbild", cue(26, ["Zusätzlich können wir auch Bauteilblockschaltbilder erstellen"])),
      target("fta26_functions", "Vorgehensschritt 4: Funktionen und Anforderungen", cue(26, ["Eine Funktionsanalyse hilft uns sämtliche Funktionen"])),
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
  const process = group("fta30_process", "Aktueller Schritt 2", processStrip(2, 132, true));
  const alternative = group("fta30_alternative", "Zwei alternative Ansätze",
    `${line(960, 286, 960, 912, C.border, 2)}
     ${box(908, 302, 104, 48, C.deep, C.deep, 1.5, 24)}
     ${txt(960, 334, "ODER", 18, 850, C.surface, "middle")}`);
  const bullet = (x, y, text, width) => `${txt(x, y, "•", 30, 900, C.deep)}${multi(x + 30, y, width - 30, text, 22, 680, C.deep)}`;
  const preventive = group("fta30_preventive", "Präventiver Ansatz",
    `${txt(112, 338, "VOR DEM AUFTRETEN", 18, 850, C.accent)}
     ${txt(112, 390, "PRÄVENTIVER ANSATZ", 34, 900, C.deep)}
     ${line(112, 418, 812, 418, C.accent, 5)}
     ${bullet(112, 500, "Fehlerquellen und Risiken frühzeitig identifizieren", 650)}
     ${bullet(112, 626, "Systemzuverlässigkeit und -sicherheit durch Beseitigung potenzieller Risiken verbessern", 650)}
     ${bullet(112, 778, "Spätere Korrekturmaßnahmen und Reparaturen reduzieren", 650)}
     ${txt(112, 906, "PROAKTIV · DESIGN & ENTWICKLUNG", 19, 850, C.accent)}`);
  const corrective = group("fta30_corrective", "Korrektiver Ansatz",
    `${txt(1108, 338, "NACH DEM AUFTRETEN", 18, 850, C.accent)}
     ${txt(1108, 390, "KORREKTIVER ANSATZ", 34, 900, C.deep)}
     ${line(1108, 418, 1808, 418, C.accent, 5)}
     ${bullet(1108, 500, "Aufgetretene Fehler und Ursachen nach Vorfall oder Systemausfall analysieren", 650)}
     ${bullet(1108, 652, "Wartung und Reparatur durch gezielte Korrekturmaßnahmen verbessern", 650)}
     ${bullet(1108, 778, "Ähnliche Probleme künftig vermeiden", 650)}
     ${txt(1108, 906, "REAKTIV · BETRIEB & INSTANDHALTUNG", 19, 850, C.accent)}`);
  return {
    archetype: "alternative-approaches",
    layout: "Schritt 2 bleibt sichtbar; zwei klar getrennte, gleichwertige Ansätze werden ohne Flussrichtung gegenübergestellt.",
    body: process + alternative + preventive + corrective,
    targets: [
      target("fta30_process", "Aktueller Schritt 2", cue(30, ["Im zweiten Schritt legen wir das unerwünschte Ereignis fest"])),
      target("fta30_alternative", "Zwei alternative Ansätze", cue(30, ["kann durch zwei verschiedene Ansätze erfolgen"])),
      target("fta30_preventive", "Präventiver Ansatz", cue(30, ["Beim präventiven Ansatz erfolgt die frühzeitige Identifizierung"])),
      target("fta30_corrective", "Korrektiver Ansatz", cue(30, ["Beim korrektiven Ansatz dagegen werden die aufgetretenen Fehler"])),
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
  const process = group("fta34_process", "Aktueller Schritt 3", processStrip(3, 116, true));
  const circuit = group("fta34_circuit", "Korrekte Motorschaltung", motorCircuit());
  const event = group("fta34_event", "Unerwünschtes Ereignis",
    `${txt(1240, 260, "TOP-EREIGNIS", 18, 850, C.failure, "middle")}
     ${eventBox(1060, 280, 360, 70, "Motor läuft nicht an", { fill: C.failureSoft, stroke: C.failure, size: 22 })}`);
  const categories = group("fta34_categories", "Ausfallpfade",
    `${eventBox(650, 420, 300, 76, "Primärausfall Motor", { stroke: C.deep, size: 20 })}
     ${eventBox(1070, 420, 300, 76, "Sekundärausfall Motor", { stroke: C.deep, size: 20 })}
     ${eventBox(1490, 420, 300, 76, "Kommandierter Ausfall Motor", { stroke: C.deep, size: 19 })}`);
  const causes = group("fta34_causes", "Konkrete Ausfallursachen",
    `${eventBox(620, 592, 170, 100, "Durchgebrannte Wicklung", { stroke: C.deep, size: 17 })}
     ${eventBox(810, 592, 160, 100, "Lagerschaden", { stroke: C.deep, size: 18 })}
     ${eventBox(1020, 592, 190, 100, "Blockieren durch Verschmutzung", { stroke: C.deep, size: 17 })}
     ${eventBox(1230, 592, 190, 100, "Motorgehäusebruch: Temperatur oder Vibration", { stroke: C.deep, size: 16 })}
     ${eventBox(1460, 592, 126, 100, "Stromquelle ausgefallen", { stroke: C.deep, size: 16 })}
     ${eventBox(1600, 592, 126, 100, "Ein Schalter ausgefallen", { stroke: C.deep, size: 16 })}
     ${eventBox(1740, 592, 126, 100, "Steuergerät ausgefallen", { stroke: C.deep, size: 16 })}`);
  const links = group("fta34_links", "Hierarchie des Fehlerbaums",
    `${pathLine("M 1240 350 V 382 H 800 V 420 M 1240 382 V 420 M 1240 382 H 1640 V 420", C.deep, 2.3)}
     ${pathLine("M 800 496 V 544 H 705 V 592 M 800 544 H 890 V 592", C.deep, 2.1)}
     ${pathLine("M 1220 496 V 544 H 1115 V 592 M 1220 544 H 1325 V 592", C.deep, 2.1)}
     ${pathLine("M 1640 496 V 544 H 1523 V 592 M 1640 544 H 1663 V 592 M 1640 544 H 1803 V 592", C.deep, 2.1)}`);
  const note = group("fta34_note", "Einordnung",
    `${line(620, 790, 1866, 790, C.border, 2)}
     ${multi(1243, 832, 1200, "Die drei Ausfallarten strukturieren mögliche Fehlerquellen.", 21, 720, C.deep, "middle")}
     ${multi(1243, 862, 1200, "Die Trennung in separate Pfade ist hilfreich, aber nicht zwingend.", 21, 720, C.deep, "middle")}`);
  return {
    archetype: "technical-fault-tree",
    layout: "Schritt 3, technisch korrekte Motorschaltung und ein von oben nach unten lesbarer Fehlerbaum ohne nummerierte Zwischenkästen.",
    body: process + circuit + event + categories + causes + links + note,
    targets: [
      target("fta34_process", "Aktueller Schritt 3", cue(34, ["Kommen wir nun zum dritten Schritt in der Fehlerbaumanalyse."])),
      target("fta34_circuit", "Motorschaltung", cue(34, ["Schauen wir uns hierzu ein Beispiel einer Schaltung zur Steuerung eines Motors an."])),
      target("fta34_event", "Unerwünschtes Ereignis", cue(34, ["Das unerwünschte Ereignis können wir einfach als „Motor läuft nicht an“ definieren."])),
      target("fta34_categories", "Ausfallpfade", cue(34, ["Nun kann der Fehlerbaum in drei Pfade"])),
      target("fta34_causes", "Konkrete Ausfallursachen", cue(34, ["Der Primärausfall des Motors kann beispielsweise"])),
      target("fta34_links", "Hierarchie des Fehlerbaums", cue(34, ["Die drei verschiedenen Ausfallarten lassen sich im Normalfall"]), "draw"),
      target("fta34_note", "Einordnung", cue(34, ["Es ist jedoch wichtig zu betonen"])),
    ],
  };
}

function scene37() {
  const process = group("fta37_process", "Aktueller Schritt 4", processStrip(4, 116, true));
  const cards = [
    ["fta37_and", "UND-GATTER", "&", "Y tritt nur ein, wenn alle Sub-Ereignisse eintreten."],
    ["fta37_or", "ODER-GATTER", "≥1", "Y tritt ein, wenn mindestens ein Sub-Ereignis eintritt."],
    ["fta37_not", "NICHT-GATTER", "1", "Y tritt ein, wenn das Sub-Ereignis nicht eintritt."],
  ];
  const body = cards.map((entry, index) => {
    const x = 92 + index * 590;
    const cx = x + 270;
    const logic = index === 2
      ? `${eventBox(cx - 90, 350, 180, 66, "Y", { stroke: C.deep, size: 24 })}
         ${line(cx, 416, cx, 448, C.deep, 2.4)}
         <circle cx="${cx}" cy="458" r="9" fill="${C.surface}" stroke="${C.deep}" stroke-width="2.4"/>
         ${box(cx - 42, 467, 84, 58, C.surface, C.deep, 2.2, 3)}
         ${txt(cx, 505, entry[2], 22, 820, C.deep, "middle")}
         ${line(cx, 525, cx, 582, C.deep, 2.4)}
         ${eventBox(cx - 90, 582, 180, 66, "x", { stroke: C.deep, size: 24 })}`
      : `${eventBox(cx - 90, 350, 180, 66, "Y", { stroke: C.deep, size: 24 })}
         ${line(cx, 416, cx, 467, C.deep, 2.4)}
         ${box(cx - 42, 467, 84, 58, C.surface, C.deep, 2.2, 3)}
         ${txt(cx, 505, entry[2], 22, 820, C.deep, "middle")}
         ${pathLine(`M ${cx} 525 V 552 H ${cx - 84} V 582 M ${cx} 552 H ${cx + 84} V 582`, C.deep, 2.4)}
         ${eventBox(cx - 164, 582, 160, 66, "x₁", { stroke: C.deep, size: 24 })}
         ${eventBox(cx + 4, 582, 160, 66, "x₂", { stroke: C.deep, size: 24 })}`;
    return group(entry[0], entry[1],
      `${box(x, 280, 540, 610, C.surface, C.deep, 2, 10)}
       ${txt(cx, 326, entry[1], 24, 850, C.deep, "middle")}
       ${logic}
       ${line(x + 42, 702, x + 498, 702, C.border, 1.5)}
       ${multi(cx, 764, 444, entry[3], 22, 680, C.deep, "middle")}`);
  }).join("");
  return {
    archetype: "logic-gate-comparison",
    layout: "Schritt 4 bleibt sichtbar; drei gleich gestaltete Logikkarten zeigen UND, ODER und die korrekte Invertierung am Ausgang des NICHT-Gatters.",
    body: process + body,
    targets: [
      target("fta37_process", "Aktueller Schritt 4", cue(37, ["Kommen wir nun zum vierten Schritt"])),
      target("fta37_and", "UND-Gatter", cue(37, ["Beim UND-Gatter tritt das nachfolgende Ereignis"])),
      target("fta37_or", "ODER-Gatter", cue(37, ["Beim Oder Gatter tritt das nachfolgende Ereignis"])),
      target("fta37_not", "NICHT-Gatter", cue(37, ["Und beim NICHT-Gatter"])),
    ],
  };
}

function motorTreeScene(n, focus, reduced = false) {
  const tree = motorTree(focus, reduced);
  const showProcess = n === 43;
  const contentOffsetY = showProcess ? 92 : 0;
  const shifted = (markup) => contentOffsetY
    ? `<g transform="translate(0 ${contentOffsetY})">${markup}</g>`
    : markup;
  const process = showProcess
    ? contextGroup(`fta${n}_process`, "FTA-Schrittübersicht mit aktivem Schritt 4", processStrip(4, 116, true))
    : "";
  const circuit = group(`fta${n}_circuit`, "Motorschaltung", shifted(motorCircuit()));
  const links = group(`fta${n}_links`, "Fehlerbaum-Beziehungen", shifted(tree.connectors));
  const nodes = group(`fta${n}_nodes`, "Fehlerbaum-Ereignisse", shifted(tree.nodes));
  const includeNote = n !== 43;
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
    layout: showProcess
      ? "Kompakte FTA-Schrittübersicht oben mit aktivem Schritt 4; Motorschaltung als technischer Anker links und vollständiger Fehlerbaum rechts, kontrolliert darunter angeordnet."
      : "Motorschaltung als technischer Anker links, großer Fehlerbaum rechts; Verbindungen liegen hinter den Ereignissen.",
    body: process + links + circuit + nodes + (includeNote ? note : ""),
    targets: [
      target(`fta${n}_circuit`, "Motorschaltung", cue(n, ["Schauen wir uns hierzu nochmals das vorherige Beispiel an."])),
      target(`fta${n}_nodes`, "Fehlerbaum-Ereignisse", cueNodes),
      target(`fta${n}_links`, "Fehlerbaum-Beziehungen", cueLinks, "draw"),
      ...(includeNote ? [target(`fta${n}_note`, "Fokus", cue(n, ["Auf diese Weise wird der Fehlerbaum nach unten hin immer weiter verästelt", "Das heißt ab hier gibt es keine weiteren untergeordneten Hierarchieebenen"]))] : []),
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

function eventSymbolsOverview(n) {
  const process = contextGroup(`fta${n}_process`, "FTA-Schrittübersicht mit aktivem Schritt 4", processStrip(4, 116, true));
  const basic = group(`fta${n}_basic`, "Basisereignis",
    `${txt(390, 300, "01", 18, 840, C.accent, "middle")}
     ${txt(390, 344, "BASISEREIGNIS", 24, 860, C.deep, "middle")}
     ${line(390, 390, 390, 474, C.accent, 2.5)}
     ${basicEvent(390, 520, C.accent, C.accentSoft)}
     ${multi(390, 632, 400, "Primäre Ursache oder Ausfallmechanismus – Ende eines vollständig analysierten Pfades.", 21, 650, C.deep, "middle")}`);
  const diamond = group(`fta${n}_diamond`, "Nicht weiter untersuchtes Ereignis",
    `${txt(960, 300, "02", 18, 840, C.secondary, "middle")}
     ${txt(960, 344, "NICHT WEITER UNTERSUCHT", 24, 860, C.deep, "middle")}
     ${line(960, 390, 960, 462, C.secondary, 2.5)}
     <path d="M960 462 L1018 520 L960 578 L902 520 Z" fill="${C.secondarySoft}" stroke="${C.secondary}" stroke-width="2.5"/>
     ${multi(960, 632, 400, "Bewusster Analyseabbruch. Der Grund wird nachvollziehbar im Kommentarfeld dokumentiert.", 21, 650, C.deep, "middle")}`);
  const transfer = group(`fta${n}_transfer`, "Verweisungsgatter",
    `${txt(1530, 300, "03", 18, 840, C.success, "middle")}
     ${txt(1530, 344, "VERWEISUNGSGATTER", 24, 860, C.deep, "middle")}
     ${line(1530, 390, 1530, 466, C.success, 2.5)}
     <path d="M1480 466 H1580 L1606 520 L1580 574 H1480 L1454 520 Z" fill="${C.successSoft}" stroke="${C.success}" stroke-width="2.5"/>
     ${txt(1530, 528, "1.1", 22, 840, C.success, "middle")}
     ${multi(1530, 632, 400, "Fortsetzung an anderer Stelle. Nummerierte Verweise halten lange Bäume lesbar.", 21, 650, C.deep, "middle")}`);
  const dividers = group(`fta${n}_dividers`, "Vergleichsstruktur",
    `${line(675, 270, 675, 744, C.border, 1.5)}${line(1245, 270, 1245, 744, C.border, 1.5)}`);
  const rule = group(`fta${n}_rule`, "Entscheidungsregel",
    `${line(188, 806, 1732, 806, C.deep, 2)}
     ${txt(188, 856, "ENTSCHEIDUNGSREGEL", 19, 840, C.accent)}
     ${multi(500, 856, 1198, "Pfad vollständig analysiert → Kreis · bewusst beendet → Raute · räumlich fortgesetzt → Verweisung.", 23, 720, C.deep)}`);
  return {
    archetype: "symbol-comparison",
    layout: "Kompakte FTA-Schrittübersicht oben mit aktivem Schritt 4; darunter drei gleichrangige Ereignissymbole auf offener Fläche und eine gemeinsame Abschlussregel.",
    takeaway: "Kreis, Raute und Verweisung kennzeichnen drei unterschiedliche Arten, einen Fehlerbaumpfad zu beenden oder fortzuführen.",
    body: process + dividers + basic + diamond + transfer + rule,
    targets: [
      target(`fta${n}_basic`, "Basisereignis", cue(n, ["Die Basisereignisse stellen immer das Ende des Fehlerbaumes dar"])),
      target(`fta${n}_diamond`, "Nicht weiter untersuchtes Ereignis", cue(n, ["Hierzu können wir einfach ein Rauten-Symbol verwenden."])),
      target(`fta${n}_transfer`, "Verweisungsgatter", cue(n, ["kann er mit Hilfe eines Verweisungsgatters an einer anderen Stelle fortgeführt werden."])),
      target(`fta${n}_rule`, "Entscheidungsregel", cue(n, ["Durch das schrittweise Unterteilen der Ereignisse im Fehlerbaum"])),
    ],
  };
}

function scene50() {
  const tree = motorTree("critical");
  const process = group("fta50_process", "Aktueller Schritt 5", processStrip(5, 116, true));
  const links = group("fta50_links", "Fehlerbaum-Beziehungen", `<g transform="translate(0 76)">${tree.connectors}</g>`);
  const nodes = group("fta50_nodes", "Fehlerbaum", `<g transform="translate(0 76)">${tree.nodes}</g>`);
  const criticalPaths = group("fta50_critical_paths", "Kritische Pfade",
    `<g transform="translate(0 76)">${tree.connectors.replaceAll(C.deep, C.technical)}</g>
     ${pill(1458, 278, 300, "ALLE PFADE KRITISCH", C.technical, C.surface)}`);
  const statement = group("fta50_statement", "Bewertung",
    `${box(92, 916, 1728, 66, C.surface, C.deep, 2, 8)}
     ${txt(122, 956, "BEWERTUNG", 18, 850, C.technical)}
     ${multi(316, 958, 1440, "Bei ausschließlichen ODER-Verknüpfungen kann jeder einzelne Ausfall direkt zum Motorausfall führen.", 22, 730, C.deep)}`);
  return {
    archetype: "fault-tree-highlight",
    layout: "Schritt 5 bleibt sichtbar; der vollständige Fehlerbaum wird zunächst aufgebaut und seine kritischen Pfade anschließend in Stahlcyan nachgezeichnet.",
    body: process + links + nodes + criticalPaths + statement,
    targets: [
      target("fta50_process", "Aktueller Schritt 5", cue(50, ["Kommen wir nun zum fünften und damit auch letzten Schritt"])),
      target("fta50_nodes", "Fehlerbaum", cue(50, ["In unserem Beispiel von vorher sind alle Ereignisse im Fehlerbaum mit einem Oder Gatter verbunden."])),
      target("fta50_links", "Fehlerbaum-Beziehungen", cue(50, ["Aus diesem Grund führt jeder Ausfall direkt zum Ausfall des Motors."]), "draw"),
      target("fta50_critical_paths", "Kritische Pfade", cue(50, ["Demnach ist jeder Pfad im Fehlerbaum auch ein kritischer Pfad."]), "draw"),
      target("fta50_statement", "Bewertung", cue(50, ["Demnach ist jeder Pfad im Fehlerbaum auch ein kritischer Pfad."])),
    ],
  };
}

function scene51() {
  const circuit = group("fta51_circuit", "Redundante Stromversorgung", motorCircuit({ secondSource: true }));
  const nodes = group("fta51_nodes", "Vollständiger Fehlerbaum",
    `${eventBox(1030, 238, 440, 76, "Kommandierter Ausfall Motor", { fill: C.failureSoft, stroke: C.failure, size: 22 })}
     ${gate(1250, 372, "≥1", C.deep, C.surface)}
     ${eventBox(710, 454, 280, 78, "Ausfall Stromversorgung", { stroke: C.deep, size: 19 })}
     ${eventBox(1110, 454, 280, 78, "Ausfall eines Schalters", { stroke: C.deep, size: 19 })}
     ${eventBox(1510, 454, 280, 78, "Ausfall Steuergerät", { stroke: C.deep, size: 19 })}
     ${gate(850, 610, "&", C.deep, C.surface)}
     ${eventBox(650, 682, 190, 84, "Ausfall Stromquelle 1", { stroke: C.deep, size: 17 })}
     ${eventBox(860, 682, 190, 84, "Ausfall Stromquelle 2", { stroke: C.deep, size: 17 })}
     ${basicEvent(745, 820, C.deep, C.surface)}${basicEvent(955, 820, C.deep, C.surface)}
     ${basicEvent(1250, 582, C.deep, C.surface)}${basicEvent(1650, 582, C.deep, C.surface)}`);
  const links = group("fta51_links", "Logische Verknüpfungen",
    `${line(1250, 314, 1250, 342, C.deep, 2.4)}
     ${pathLine("M 1250 402 V 426 H 850 V 454 M 1250 426 V 454 M 1250 426 H 1650 V 454", C.deep, 2.4)}
     ${line(850, 532, 850, 580, C.deep, 2.4)}
     ${pathLine("M 850 640 V 660 H 745 V 682 M 850 660 H 955 V 682", C.deep, 2.4)}
     ${line(745, 766, 745, 800, C.deep, 2.2)}${line(955, 766, 955, 800, C.deep, 2.2)}
     ${line(1250, 532, 1250, 562, C.deep, 2.2)}${line(1650, 532, 1650, 562, C.deep, 2.2)}`);
  const cutSet = group("fta51_cutset", "Minimaler Ausfallschnitt",
    `<rect x="632" y="666" width="436" height="174" rx="10" fill="none" stroke="${C.technical}" stroke-width="4"/>
     ${pathLine("M 745 854 V 874 H 955 V 854", C.technical, 4)}
     ${box(632, 884, 436, 84, C.deep, C.deep, 1.5, 8)}
     ${txt(850, 918, "MINIMALER AUSFALLSCHNITT M₁", 18, 850, C.surface, "middle")}
     ${txt(850, 950, "M₁ = {Stromquelle 1, Stromquelle 2}", 19, 720, C.surface, "middle")}`);
  return {
    archetype: "minimal-cut-set",
    layout: "Korrekt parallel angebundene zweite Stromquelle links; vollständiger Fehlerbaum rechts mit ODER-Hauptebene, UND-Unterbaum und explizitem Minimalschnitt.",
    body: circuit + links + nodes + cutSet,
    targets: [
      target("fta51_circuit", "Redundante Stromversorgung", cue(51, ["Die beiden Ausfall-Ereignisse können wir als minimale Ausfallschnitte verstehen."])),
      target("fta51_nodes", "Vollständiger Fehlerbaum", cue(51, ["Die beiden Ausfall-Ereignisse können wir als minimale Ausfallschnitte verstehen."])),
      target("fta51_links", "Logische Verknüpfungen", cue(51, ["Die beiden Ausfall-Ereignisse können wir als minimale Ausfallschnitte verstehen."]), "draw"),
      target("fta51_cutset", "Minimaler Ausfallschnitt", cue(51, ["Die beiden Ausfall-Ereignisse können wir als minimale Ausfallschnitte verstehen."])),
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
  const criticalPaths = focus === "critical"
    ? group(`fta${n}_critical_paths`, "Drei kritische Pfade zum Top-Ereignis",
      evidence(
        `${[970, 1280, 1590].map((x) => pathLine(`M ${x - 83} 746 V 724 M ${x + 83} 746 V 724 M ${x - 83} 642 V 618 H ${x} V 596 M ${x + 83} 642 V 618 H ${x} M ${x} 536 V 508 M ${x} 430 V 406 H 1280 V 386 M 1280 326 V 286`, C.educationAccent, 6)).join("")}
         ${pill(1440, 304, 350, "3 KRITISCHE PFADE", C.educationAccent, C.surface)}`,
        "Quellfolie 56: drei kritische Pfade bis zum Top-Ereignis",
      ))
    : "";
  const minimalCuts = focus === "critical"
    ? group(`fta${n}_minimal_cuts`, "Drei minimale Ausfallschnitte",
      evidence(
        `${[970, 1280, 1590].map((x) => `${pathLine(`M ${x - 118} 756 L ${x - 48} 812 M ${x + 48} 756 L ${x + 118} 812`, C.failure, 6)}${pathLine(`M ${x - 118} 812 L ${x - 48} 756 M ${x + 48} 812 L ${x + 118} 756`, C.failure, 3)}`).join("")}
         ${[970, 1280, 1590].map((x, index) => txt(x, 840, `SCHNITT M${index + 1}`, 17, 860, C.failure, "middle")).join("")}
         ${box(780, 858, 1056, 70, C.surfaceSoft, C.failure, 1.8, 9)}
         ${txt(810, 901, "MINIMALE AUSFALLSCHNITTE", 18, 850, C.failure)}
         ${txt(1160, 901, "M1 = {HL1, HL2}  ·  M2 = {B1, B2}  ·  M3 = {HR1, HR2}", 18, 730, C.deep)}`,
        "Quellfolie 56 und Sprechertext: jede Reifenkombination einer Fahrwerksgruppe ist ein minimaler Ausfallschnitt",
      ))
    : "";
  const cueAsset = cue(n, ["Hierzu betrachten wir das Bugradfahrwerk eines Flugzeuges", "Das Bugradfahrwerk besteht aus drei Fahrwerksgruppen."]);
  const cueNodes = focus === "nose"
    ? cue(n, ["Das Bugrad ist beispielsweise ausgefallen, wenn die beiden Reifen eins und zwei ausgefallen sind."])
    : focus === "left" || focus === "right"
      ? cue(n, ["Das gleiche Prinzip gilt für das linke und rechte Hauptfahrwerk."])
      : cue(n, ["Fangen wir nun an den Fehlerbaum gemeinsam zu erstellen.", "Das Top-Ereignis kann als der Ausfall des Bugradfahrwerks definiert werden."]);
  const linkCue = cue(n, ["Daher verbinden wir die Ausfälle der Reifen innerhalb jeder Fahrwerksgruppe mit einem Und-Gatter.", "Auch hier sind die Ausfälle der Reifen jeweils mit einem Und-Gatter verbunden."]);
  const targets = [
    target(`fta${n}_asset`, "Flugzeug mit drei Fahrwerksgruppen", cueAsset),
    target(`fta${n}_nodes`, "Fahrwerk-Fehlerbaum", cueNodes),
    target(`fta${n}_links`, "Fehlerbaum-Beziehungen", linkCue, "draw"),
    ...(focus === "critical" ? [
      target(`fta${n}_critical_paths`, "Drei kritische Pfade zum Top-Ereignis", cue(n, ["Nun können wir die kritischen Pfade identifizieren"]), "draw"),
      target(`fta${n}_minimal_cuts`, "Drei minimale Ausfallschnitte", cue(n, ["Jede Kombination von zwei ausgefallenen Reifen stellt demnach einen minimalen Ausfallschnitt dar."]), "draw"),
    ] : []),
  ];
  return {
    archetype: "technical-example-fault-tree",
    layout: focus === "critical"
      ? "Konkretes Flugzeugmotiv links; vollständiger Fehlerbaum rechts mit drei stahlcyan markierten kritischen Pfaden und drei direkt zugeordneten minimalen Ausfallschnitten."
      : "Konkretes Flugzeugmotiv links, großer und vollständig lesbarer Fahrwerk-Fehlerbaum rechts.",
    body: links + asset + nodes + criticalPaths + minimalCuts,
    targets,
  };
}

function scene57() {
  const fullTree = aircraftTree("none");
  const context = group("fta57_context", "Common-Mode-Ursachen",
    `${txt(104, 250, "COMMON MODE", 22, 860, C.failure)}
     ${multi(104, 300, 560, "Eine gemeinsame Ausfallart kann beide Reifen einer Fahrwerksgruppe treffen.", 25, 740, C.deep)}
     ${bulletList(104, 454, 560, [
       "Feuer greift auf den zweiten Reifen über",
       "Trümmer eines geplatzten Reifens beschädigen den zweiten",
       "Mehrlast überbeansprucht den verbliebenen Reifen",
     ], C.failure, 21, 116)}`);
  const links = group("fta57_links", "Vollständige Fehlerbaum-Beziehungen", fullTree.connectors);
  const tree = group("fta57_tree", "Vollständiger Fahrwerk-Fehlerbaum", fullTree.nodes);
  const commonMode = group("fta57_common_mode", "Gemeinsame Ausfallart an einer Reifengruppe",
    `${pathLine("M 1192 688 H 1368", C.failure, 5, false, "10 7")}
     ${pathLine("M 1216 618 V 602 H 1344 V 618", C.failure, 4)}
     ${pill(1110, 820, 340, "GEMEINSAME AUSFALLART", C.failure, C.surface)}`);
  const statement = group("fta57_statement", "Folge für die Zuverlässigkeit",
    `${line(104, 912, 1816, 912, C.border, 2)}
     ${txt(104, 956, "FOLGE", 18, 850, C.failure)}
     ${multi(230, 956, 1480, "Vermeintliche Redundanz kann gleichzeitig ausfallen → höheres Systemrisiko und geringere Gesamtzuverlässigkeit.", 22, 780, C.deep)}`);
  return {
    archetype: "common-mode-causal-chains",
    layout: "Eine gemeinsame Ausfallart verzweigt in drei offene Ursache-Wirkungs-Ketten; die Zuverlässigkeitsfolge schließt die Blickroute ab.",
    body: context + links + tree + commonMode + statement,
    targets: [
      target("fta57_context", "Common-Mode-Ursachen", cue(57, ["Ein Common-Mode-Ausfall bezieht sich auf den Ausfall von mehreren Komponenten"])),
      target("fta57_tree", "Vollständiger Fahrwerk-Fehlerbaum", cue(57, ["Ein Beispiel hierfür wäre"])),
      target("fta57_links", "Vollständige Fehlerbaum-Beziehungen", cue(57, ["Das heißt der Ausfall einer Komponente bedingt direkt den Ausfall einer anderen Komponente."]), "draw"),
      target("fta57_common_mode", "Gemeinsame Ausfallart", cue(57, ["Damit sind dann beide Reifen aufgrund der gleichen Ausfallart"]), "draw"),
      target("fta57_statement", "Folge für die Zuverlässigkeit", cue(57, ["Solche Ausfälle erhöhen die Wahrscheinlichkeit eines Systemausfalls"])),
    ],
  };
}

function scene58() {
  const asset = group("fta58_asset", "Stromnetzwerk des Operationssaals",
    hospitalPowerSchematic({ x: 112, y: 256, scale: 1.05 }));
  const legend = group("fta58_legend", "Legende",
    `${line(126, 830, 246, 830, C.deep, 3, true)}${txt(274, 838, "LEISTUNG", 18, 820, C.deep)}
     ${line(126, 882, 246, 882, C.secondary, 3, true, "9 7")}${txt(274, 890, "SIGNAL", 18, 820, C.secondary)}`);
  const flow = group("fta58_flow", "Betriebslogik",
    `${txt(1030, 308, "STANDARD­BETRIEB", 20, 850, C.accent)}
     ${multi(1030, 354, 690, "Stromgenerator → Energiepuffer → Operationssaal", 27, 780, C.deep)}
     ${line(1030, 440, 1740, 440, C.border, 2)}
     ${txt(1030, 506, "BEI GENERATORAUSFALL", 20, 850, C.secondary)}
     ${bulletList(1030, 570, 710, [
       "Steuergerät erkennt den Ausfall",
       "Notstromaggregat wird aktiviert",
       "Energiepuffer überbrückt die Startzeit",
       "Versorgung des OP-Saals bleibt unterbrechungsfrei",
     ], C.secondary, 22, 76)}`);
  return {
    archetype: "technical-system-landscape",
    layout: "Quellengetreue Systemtopologie links und die zwei Betriebszustände rechts; Leistungs- und Signalwege sind eindeutig unterschieden.",
    body: asset + legend + flow,
    targets: [
      target("fta58_asset", "Technische Komponenten", cue(58, ["Der Operationssaal wird über ein eigenes Stromnetzwerk betrieben"])),
      target("fta58_flow", "Leistungs- und Signalfluss", cue(58, ["Im Standardbetrieb versorgt der Stromgenerator über den Energiepuffer"])),
    ],
  };
}

function hospitalTreeScene(n, focus) {
  const tree = hospitalTree(focus);
  const asset = group(`fta${n}_asset`, "Krankenhaus-Stromversorgung",
    `${box(92, 244, 610, 538, C.surface, C.border, 1.5, 16)}
     ${hospitalPowerSchematic({ x: 112, y: 286, scale: .72 })}
     ${line(132, 690, 232, 690, C.deep, 2.6, true)}${txt(254, 698, "LEISTUNG", 16, 820, C.deep)}
     ${line(400, 690, 500, 690, C.secondary, 2.6, true, "8 6")}${txt(522, 698, "SIGNAL", 16, 820, C.secondary)}
     ${multi(397, 752, 530, "Zwei Versorgungspfade sollen den Operationssaal absichern.", 20, 720, C.deep, "middle")}`);
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
      target(`fta${n}_asset`, "Krankenhaus-Stromversorgung", cue(n, focus === "buffer" ? ["Auf den ersten Blick wirkt das System redundant"] : ["Der Operationssaal wird über ein eigenes Stromnetzwerk betrieben"])),
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

function makeScene(n, variant = "") {
  if (variant === "event_symbols_overview") return eventSymbolsOverview(n);
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
  const sourceLabel = scene.source_slides?.length > 1
    ? `${scene.source_slides[0]}–${scene.source_slides.at(-1)} (Primärzustand ${scene.output_slide_number})`
    : `${scene.output_slide_number}`;
  const mappingLabel = scene.source_slides?.length > 1
    ? `zusammengeführte Aufbaufolge aus ${scene.source_slides.length} Quellfolien`
    : "1:1";
  const brief = `# Redesign-Brief — ${scene.work_unit}

- Kapitel: 3
- Lektion: ${scene.lesson}
- Quellfolie(n): ${sourceLabel}
- Sprechertext: ${source.source_text_section_id} — ${source.source_text_title}
- Titel: ${scene.content_title_override || titles[scene.output_slide_number]}
- Takeaway: ${content.takeaway || takeaways[scene.output_slide_number] || "Quelltreuer Aufbauzustand innerhalb der FTA-Erklärfolge."}
- Archetyp: ${content.archetype}
- Layout: ${content.layout}
- Produktionsmodus: Content-SVG 1920×1080, transparent für das Education-Master
- Mapping: ${mappingLabel}
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
    const renderN = scene.render_source_slide || scene.primary_source_slide || n;
    const renderScene = { ...scene, output_slide_number: renderN };
    const dir = path.join(outRoot, scene.work_unit);
    fs.mkdirSync(dir, { recursive: true });
    prepareMedia(renderScene);
    const content = makeScene(renderN, scene.render_variant);
    fs.writeFileSync(path.join(dir, `${scene.work_unit}.svg`), `${frame(renderScene, content)}\n`, "utf8");
    writeBrief(renderScene, content);
    if (animated) writeManifest(renderScene, content);
    generated.push(scene.work_unit);
  }
  process.stdout.write(`Generated ${generated.length} RE2 chapter-3 scene(s)${animated ? " with animation" : " as static end states"}: ${generated.join(", ")}.\n`);
}

main();
