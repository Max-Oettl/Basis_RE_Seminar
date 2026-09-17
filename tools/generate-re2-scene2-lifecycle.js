"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sceneDir = path.join(root, "rebuild-proposals", "svg", "RE2", "slide_003");
const target = path.join(sceneDir, "slide_003.svg");

const C = {
  navy: "#142452",
  navy60: "#727C97",
  border: "#D0D3DC",
  green: "#00A653",
  cyan: "#0C84B4",
  white: "#FFFFFF",
};

function txt(x, y, value, size, weight = 700, fill = C.navy, anchor = "start") {
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="text" data-qc-layer="text" data-qc-padding="0" data-qc-allow-overlap="true">${value}</text>`;
}

function main() {
  const metadata = {
    artifactScope: "content-svg",
    embeddingTarget: "powerpoint-slide",
    slideType: "lifecycle-evidence-map",
    contentTitle: "Methodenfokus entlang der Badewannenkurve",
    layoutIntent: "dominant-bathtub-curve-with-open-method-brackets-and-system-analysis-transition",
    takeaway: "Qualitative Systemanalyse reduziert Risiken vor allem in den Bereichen eins und zwei der Badewannenkurve.",
    audienceGoal: "Methoden und Wirkungen direkt den drei Lebensphasen des Produkts zuordnen.",
    density: "normal",
    contentMode: "transparent-content",
    backgroundMode: "transparent",
    brandProfile: "reltest-education",
    brandVariant: "education-production",
    sourceSlides: [3],
    targetStructureVersion: "external-svg-asset-package-handoff/v1",
    plotAsset: "plots/bathtub_curve.svg",
    sourceFidelity: "shared-axis-and-phase-alignment-preserved",
  };
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="accessible_title accessible_description" data-artifact-scope="content-svg" data-embedding-target="powerpoint-slide" data-scene-id="re2_ch1_lifecycle" data-brand-profile="reltest-education">
<metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(metadata)}]]></metadata>
<title id="accessible_title">Methodenfokus entlang der Badewannenkurve</title>
<desc id="accessible_description">Die Badewannenkurve gliedert sich in Früh-, Zufalls- und Ermüdungsausfälle. Qualitative Methoden wirken vor allem in den Bereichen eins und zwei durch Systemanalyse und Risikoreduktion.</desc>
<defs><marker id="arrow_green" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L11 6L1 11Z" fill="${C.green}"/></marker></defs>
<style>text{font-family:Archivo,Arial,Helvetica,sans-serif;letter-spacing:0}</style>
<g id="scene_content" data-qc-group="scene_content" data-qc-layer="content" data-source-evidence="source_slide" data-source-reference="Quellfolie 3">
  <g id="bathtub_curve_overview" data-anim-target="true" data-anim-label="Badewannenkurve mit drei Ausfallbereichen" data-qc-group="bathtub_curve_overview" data-qc-layer="plot">
    <image href="plots/bathtub_curve.svg" x="80" y="48" width="1760" height="680" preserveAspectRatio="xMidYMid meet" data-qc-allow-overlap="true"/>
  </g>
  <g id="qualitative_lifecycle_focus" data-anim-target="true" data-anim-label="Qualitative Methoden in den Bereichen eins und zwei" data-qc-group="qualitative_lifecycle_focus" data-qc-layer="content">
    <path d="M190 776H1300" fill="none" stroke="${C.green}" stroke-width="6"/>
    <circle cx="226" cy="822" r="25" fill="${C.green}"/>${txt(226, 831, "1+2", 18, 850, C.white, "middle")}
    ${txt(274, 810, "QUALITATIVE METHODEN", 22, 850, C.green)}
    ${txt(274, 850, "Risikoreduktion durch Systemanalyse", 30, 820, C.navy)}
    <path d="M642 772C600 720 556 662 530 594" fill="none" stroke="${C.green}" stroke-width="3" stroke-dasharray="9 7" marker-end="url(#arrow_green)" data-role="connector"/>
    <path d="M1018 772C1038 716 1058 662 1080 594" fill="none" stroke="${C.green}" stroke-width="3" stroke-dasharray="9 7" marker-end="url(#arrow_green)" data-role="connector"/>
  </g>
  <g id="quantitative_lifecycle_focus" data-anim-target="true" data-anim-label="Quantitative Methoden im Ermüdungsbereich" data-qc-group="quantitative_lifecycle_focus" data-qc-layer="content">
    <path d="M1340 776H1788" fill="none" stroke="${C.navy60}" stroke-width="6"/>
    <circle cx="1376" cy="822" r="25" fill="${C.navy60}"/>${txt(1376, 831, "3", 18, 850, C.white, "middle")}
    ${txt(1424, 810, "QUANTITATIVE METHODEN", 22, 850, C.navy60)}
    ${txt(1424, 850, "Nachweis Zuverlässigkeit", 27, 800, C.navy)}
  </g>
  <g id="system_analysis_outcome" data-anim-target="true" data-anim-label="Risikoreduktion durch Systemanalyse" data-qc-group="system_analysis_outcome" data-qc-layer="content">
    <path d="M190 938H1640" fill="none" stroke="${C.border}" stroke-width="2"/>
    ${txt(190, 984, "NÄCHSTER SCHRITT", 19, 850, C.cyan)}
    ${txt(430, 986, "Systemanalyse als Grundlage der qualitativen Zuverlässigkeitsanalyse", 25, 780, C.navy)}
    <path d="M1650 980H1770" fill="none" stroke="${C.green}" stroke-width="4" marker-end="url(#arrow_green)" data-role="connector"/>
  </g>
</g>
</svg>`;
  fs.writeFileSync(target, `${svg}\n`, "utf8");
  process.stdout.write(`Generated creative RE2 lifecycle scene: ${target}\n`);
}

try { main(); } catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
