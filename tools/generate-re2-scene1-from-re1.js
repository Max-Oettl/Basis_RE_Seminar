"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const targetRoot = path.join(root, "rebuild-proposals", "svg", "RE2", "slide_001");
const targetPath = path.join(targetRoot, "slide_001.svg");
const manifestPath = path.join(targetRoot, "scene.animation.v1.json");
const elementPlanPath = path.join(targetRoot, "element-animation-plan.json");

const C = {
  navy: "#142452", navy60: "#727C97", navy20: "#D0D3DC", navy10: "#E8E9EE",
  green: "#00A653", greenSoft: "#F7F9FC", cyan: "#0C84B4", text: "#142452",
  muted: "#727C97", white: "#FFFFFF",
};

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function text(x, y, value, size, weight = 600, fill = C.text, anchor = "start") {
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="text" data-qc-layer="text" data-qc-padding="0" data-qc-allow-overlap="true">${esc(value)}</text>`;
}

function multiline(x, y, lines, size, weight = 600, fill = C.text, anchor = "start", lineHeight = 1.2) {
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="text" data-qc-layer="text" data-qc-padding="0" data-qc-allow-overlap="true">${lines.map((line, index) => `<tspan x="${x}" dy="${index ? Math.round(size * lineHeight) : 0}">${esc(line)}</tspan>`).join("")}</text>`;
}

function group(id, label, body) {
  return `<g id="${id}" data-anim-target="true" data-anim-label="${esc(label)}"><title>${esc(label)}</title>${body}</g>`;
}

function marker(id, color) {
  return `<marker id="${id}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1L11 6L1 11Z" fill="${color}"/></marker>`;
}

function main() {
  fs.mkdirSync(targetRoot, { recursive: true });

  const taxonomy = group("methods_split", "Qualitative und quantitative Zuverlässigkeitsmethoden", `
    ${text(960, 120, "ZUVERLÄSSIGKEITSMETHODEN", 32, 850, C.navy, "middle")}
    <path d="M960 154V198H520V238" fill="none" stroke="${C.navy}" stroke-width="3" marker-end="url(#arrow_navy)" data-role="connector"/>
    <path d="M960 198H1400V238" fill="none" stroke="${C.navy60}" stroke-width="3" marker-end="url(#arrow_muted)" data-role="connector"/>
    ${text(520, 292, "QUALITATIVE METHODEN", 38, 850, C.navy, "middle")}
    ${text(1400, 292, "QUANTITATIVE METHODEN", 38, 850, C.navy60, "middle")}
    <path d="M178 324H862" fill="none" stroke="${C.green}" stroke-width="6"/>
    <path d="M1058 324H1742" fill="none" stroke="${C.navy20}" stroke-width="4"/>
  `);

  const focus = group("qualitative_focus", "Fokus dieses Moduls", `
    <rect x="328" y="342" width="384" height="46" rx="23" fill="${C.greenSoft}" stroke="${C.green}" stroke-width="1.5"/>
    ${text(520, 373, "FOKUS DIESES MODULS", 18, 820, C.green, "middle")}
  `);

  const point1 = group("qualitative_point_1", "Kritische Ausfallmechanismen identifizieren", `
    <circle cx="250" cy="472" r="38" fill="${C.navy}"/>
    ${text(250, 482, "1", 27, 850, C.white, "middle")}
    ${multiline(322, 462, ["Kritische Ausfallmechanismen eines", "Produktes identifizieren."], 26, 760, C.navy, "start", 1.18)}
  `);

  const point2 = group("qualitative_point_2", "Geeignete Abstellmaßnahmen festlegen", `
    <circle cx="250" cy="610" r="38" fill="${C.navy}"/>
    ${text(250, 620, "2", 27, 850, C.white, "middle")}
    ${multiline(322, 602, ["Geeignete Abstellmaßnahmen", "festlegen."], 26, 760, C.navy, "start", 1.18)}
  `);

  const point3 = group("qualitative_point_3", "Ausfallrisiko reduzieren und Zuverlässigkeit verbessern", `
    <circle cx="250" cy="748" r="38" fill="${C.navy}"/>
    ${text(250, 758, "3", 27, 850, C.white, "middle")}
    ${multiline(322, 740, ["Ausfallrisiko reduzieren und", "Zuverlässigkeit verbessern."], 26, 760, C.navy, "start", 1.18)}
  `);

  const tools = group("qualitative_tools", "FTA und FMEA", `
    ${text(178, 864, "TYPISCHE WERKZEUGE", 19, 820, C.muted)}
    <rect x="178" y="890" width="302" height="92" fill="${C.navy}"/>
    <rect x="496" y="890" width="366" height="92" fill="${C.navy}"/>
    ${text(329, 948, "FTA", 40, 880, C.white, "middle")}
    ${text(679, 948, "FMEA", 40, 880, C.white, "middle")}
    <path d="M480 936H496" fill="none" stroke="${C.green}" stroke-width="6"/>
  `);

  const quantitative = group("quantitative_context", "Quantitative Methoden als Einordnung", `
    ${text(1090, 420, "AUFGABE", 18, 820, C.navy60)}
    ${multiline(1090, 466, ["Lebensdauermodelle bestimmen", "und Zuverlässigkeit quantitativ nachweisen"], 27, 720, C.navy60)}
    <path d="M1090 566H1710" fill="none" stroke="${C.navy20}" stroke-width="2"/>
    ${text(1090, 624, "TYPISCHE WERKZEUGE", 18, 820, C.navy60)}
    <circle cx="1110" cy="684" r="7" fill="${C.navy60}"/>${text(1140, 692, "End-of-Life-Test", 23, 650, C.navy60)}
    <circle cx="1110" cy="748" r="7" fill="${C.navy60}"/>${text(1140, 756, "Accelerated Life Test (ALT)", 23, 650, C.navy60)}
    <circle cx="1110" cy="812" r="7" fill="${C.navy60}"/>${text(1140, 820, "Degradation Test", 23, 650, C.navy60)}
    <circle cx="1110" cy="876" r="7" fill="${C.navy60}"/>${text(1140, 884, "Success Run Test", 23, 650, C.navy60)}
  `);

  const metadata = {
    artifactScope: "content-svg", embeddingTarget: "powerpoint-slide", slideType: "open-method-bifurcation",
    contentTitle: "Einteilung der Zuverlässigkeitsmethoden",
    layoutIntent: "shared-parent-with-active-qualitative-workflow-and-muted-quantitative-context",
    takeaway: "Modul 2 konzentriert sich auf qualitative Methoden sowie FTA und FMEA.", density: "normal",
    contentMode: "transparent-content", backgroundMode: "transparent", brandProfile: "reltest-education",
    brandVariant: "education-production", sourceSlides: [1, 2], officialLogoStatus: "downstream-owned",
  };

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="accessible_title accessible_description" data-artifact-scope="content-svg" data-embedding-target="powerpoint-slide" data-scene-id="re2_ch1_methods" data-brand-profile="reltest-education">
<metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(metadata)}]]></metadata>
<title id="accessible_title">Einteilung der Zuverlässigkeitsmethoden</title>
<desc id="accessible_description">Zuverlässigkeitsmethoden teilen sich in qualitative und quantitative Methoden. Das Modul fokussiert die qualitative Arbeitsfolge und die Werkzeuge FTA und FMEA.</desc>
<defs>${marker("arrow_navy", C.navy)}${marker("arrow_muted", C.navy60)}</defs>
<style>text{font-family:Archivo,Arial,Helvetica,sans-serif;letter-spacing:0}</style>
<g id="scene_content" data-qc-group="scene_content" data-qc-layer="content" data-source-evidence="source_slide" data-source-reference="Quellfolien 1–2">${taxonomy}${focus}${point1}${point2}${point3}${tools}${quantitative}</g>
</svg>`;
  fs.writeFileSync(targetPath, `${svg}\n`, "utf8");

  const defaults = { enterFrames: 16, exitFrames: 12, highlightDurFrames: 30, drawDurFrames: 42, transformDurFrames: 30 };
  const targetDefs = [
    ["methods_split", "Qualitative und quantitative Zuverlässigkeitsmethoden"],
    ["qualitative_focus", "Fokus dieses Moduls"],
    ["qualitative_point_1", "Kritische Ausfallmechanismen identifizieren"],
    ["qualitative_point_2", "Geeignete Abstellmaßnahmen festlegen"],
    ["qualitative_point_3", "Ausfallrisiko reduzieren und Zuverlässigkeit verbessern"],
    ["qualitative_tools", "FTA und FMEA"],
    ["quantitative_context", "Quantitative Methoden als Einordnung"],
  ];
  const targets = targetDefs.map(([targetId, label]) => ({ targetId, label, status: "animated", visibleInEditor: true, render: true, confidence: "high" }));
  const steps = [
    { stepId: "step_01_methods_split", targetId: "methods_split", action: "show", sourceText: "Nämlich in die qualitativen und in die quantitativen Zuverlässigkeitsmethoden", occurrence: 1, confidence: "high", notes: "Gemeinsamer Oberbegriff und beide Äste erscheinen als eine Taxonomie.", enterFrames: 16 },
    { stepId: "step_02_quantitative_context", targetId: "quantitative_context", action: "show", sourceText: "Nämlich in die qualitativen und in die quantitativen Zuverlässigkeitsmethoden", occurrence: 1, confidence: "high", notes: "Der quantitative Ast bleibt als zurückgenommene Einordnung sichtbar.", enterFrames: 16 },
    { stepId: "step_03_qualitative_focus", targetId: "qualitative_focus", action: "show", sourceText: "In diesem Modul werden wir ausschließlich die qualitativen Methoden betrachten", occurrence: 1, confidence: "high", notes: "Der Modulfokus wird semantisch grün markiert.", enterFrames: 16 },
    { stepId: "step_04_qualitative_point_1", targetId: "qualitative_point_1", action: "show", sourceText: "Mit Hilfe dieser werden vor allem die kritischen Ausfallmechanismen eines Produktes identifiziert", occurrence: 1, confidence: "high", notes: "Der erste Punkt erscheint mit dem zugehörigen Satz.", enterFrames: 16 },
    { stepId: "step_05_qualitative_point_2", targetId: "qualitative_point_2", action: "show", sourceText: "Im Anschluss werden geeignete Abstellmaßnahmen festgelegt", occurrence: 1, confidence: "high", notes: "Der zweite Punkt erscheint mit dem zugehörigen Satz.", enterFrames: 16 },
    { stepId: "step_06_qualitative_point_3", targetId: "qualitative_point_3", action: "show", sourceText: "um das Ausfallrisiko zu reduzieren und die Zuverlässigkeit zu verbessern", occurrence: 1, confidence: "high", notes: "Der dritte Punkt erscheint erst mit der Zielaussage.", enterFrames: 16 },
    { stepId: "step_07_qualitative_tools", targetId: "qualitative_tools", action: "show", sourceText: "Dazu schauen wir uns hauptsächlich die Fehlerbaumanalyse an", occurrence: 1, confidence: "high", notes: "FTA und FMEA erscheinen als gleichrangige Werkzeuge.", enterFrames: 16 },
  ];
  const manifest = { schemaVersion: "svgAnimationManifest/v1", svgPath: "slide_001.svg", defaults, targets, steps };
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(elementPlanPath, `${JSON.stringify({ schemaVersion: "elementAnimationPlan/v1", sceneId: "re2_ch1_methods", decision: "animated", defaults, targets, steps }, null, 2)}\n`, "utf8");
  process.stdout.write(`Generated creative RE2 scene 001: ${targetPath}\n`);
}

try { main(); } catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
