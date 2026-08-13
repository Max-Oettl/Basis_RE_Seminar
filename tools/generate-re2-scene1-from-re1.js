"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "rebuild-proposals", "svg", "RE1", "slide_015", "slide_015.svg");
const targetRoot = path.join(root, "rebuild-proposals", "svg", "RE2", "slide_001");
const targetPath = path.join(targetRoot, "slide_001.svg");
const manifestPath = path.join(targetRoot, "scene.animation.v1.json");
const elementPlanPath = path.join(targetRoot, "element-animation-plan.json");

function removeBullet(group, y, text) {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<circle[^>]*cy="${y}"[^>]*/><text[^>]*>[\\s\\S]*?${escaped}[\\s\\S]*?</text>`);
  const next = group.replace(pattern, "");
  if (next === group) throw new Error(`Qualitative bullet not found: ${text}`);
  return next;
}

function main() {
  let svg = fs.readFileSync(sourcePath, "utf8");
  const metadata = {
    artifactScope: "content-svg",
    embeddingTarget: "powerpoint-slide",
    slideType: "toolbox-comparison-module-focus",
    contentTitle: "Einteilung der Zuverlässigkeitsmethoden",
    layoutIntent: "reused-re1-toolbox-with-qualitative-module-focus",
    takeaway: "Modul 2 konzentriert sich auf qualitative Methoden sowie FTA und FMEA.",
    density: "balanced",
    contentMode: "transparent-content",
    backgroundMode: "transparent",
    brandProfile: "reltest-education",
    brandVariant: "education-production",
    sourceSlides: [1, 2],
    referenceArtifact: "rebuild-proposals/svg/RE1/slide_015/slide_015.svg",
    officialLogoStatus: "downstream-owned",
  };

  svg = svg
    .replace('data-artifact-scope="full-slide"', 'data-artifact-scope="content-svg"')
    .replace('data-embedding-target="standalone-slide"', 'data-embedding-target="powerpoint-slide"')
    .replace(/\s*<g\b[^>]*\bid="brand_background"[^>]*>[\s\S]*?<\/g>/, "")
    .replace(/\s*<linearGradient\b[^>]*\bid="backgroundGradient"[^>]*>[\s\S]*?<\/linearGradient>/, "")
    .replace(/\s*<pattern\b[^>]*\bid="technicalGrid"[^>]*>[\s\S]*?<\/pattern>/, "")
    .replace('data-scene-id="re1_src_015"', 'data-scene-id="re2_ch1_methods" data-reuse-source="RE1::15"')
    .replace(/<metadata id="slide_quality_metadata" type="application\/json"><!\[CDATA\[[\s\S]*?\]\]><\/metadata>/,
      `<metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(metadata)}]]></metadata>`)
    .replace(/<title id="accessible_title">[\s\S]*?<\/title>/,
      '<title id="accessible_title">Einteilung der Zuverlässigkeitsmethoden</title>')
    .replace(/<desc id="accessible_description">[\s\S]*?<\/desc>/,
      '<desc id="accessible_description">Der qualitative Werkzeugkasten mit FTA und FMEA steht im Fokus; quantitative Methoden sind zurückgenommen.</desc>')
    .replace("FMEA und FTA", "FTA und FMEA");

  const qualitativeStart = svg.indexOf('<g id="qualitative_toolbox"');
  const quantitativeStart = svg.indexOf('<g id="quantitative_toolbox"');
  const sceneClose = svg.lastIndexOf("</g></g>");
  if (qualitativeStart < 0 || quantitativeStart < 0 || sceneClose < quantitativeStart) {
    throw new Error("RE1 toolbox component boundaries could not be identified.");
  }

  let qualitative = svg.slice(qualitativeStart, quantitativeStart);
  qualitative = removeBullet(qualitative, 661, "HALT, HASS und HASA");
  qualitative = removeBullet(qualitative, 709, "ESS und Burn-In-Test");
  qualitative = removeBullet(qualitative, 757, "Degradation Screening");

  const toolsStart = qualitative.indexOf('<line data-role="functional" x1="134" y1="522"');
  const qualitativeClose = qualitative.lastIndexOf("</g>");
  if (toolsStart < 0 || qualitativeClose < toolsStart) throw new Error("Qualitative tools block not found.");
  const tools = qualitative.slice(toolsStart, qualitativeClose);
  const focusBadge = '<g id="qualitative_focus_badge" data-anim-target="true" data-anim-label="Fokus dieses Moduls"><rect x="590" y="260" width="284" height="44" rx="8" fill="#FFFFFF"/><text x="732" y="289" font-size="18" font-weight="820" fill="#00A653" text-anchor="middle" letter-spacing="0.4">FOKUS DIESES MODULS</text></g>';
  qualitative = `${qualitative.slice(0, toolsStart)}<g id="qualitative_tools" data-anim-target="true" data-anim-label="FTA und FMEA">${tools}</g>${focusBadge}</g>`;

  let quantitative = svg.slice(quantitativeStart, sceneClose + 4);
  quantitative = quantitative
    .replace(/fill="#FFF5CC"/g, 'fill="#F7F9FC"')
    .replace(/stroke="#E9B400"/g, 'stroke="#CDD0D6"')
    .replace(/fill="#E9B400"/g, 'fill="#687185"')
    .replace(/fill="#031334"/g, 'fill="#687185"')
    .replace('<g aria-label="timedReliabilityProof"', '<g opacity="0.42" style="filter:grayscale(1)" aria-label="timedReliabilityProof"');

  svg = `${svg.slice(0, qualitativeStart)}${qualitative}${quantitative}${svg.slice(sceneClose + 4)}`;
  fs.writeFileSync(targetPath, svg, "utf8");

  const defaults = {
    enterFrames: 16,
    exitFrames: 12,
    highlightDurFrames: 30,
    drawDurFrames: 42,
    transformDurFrames: 30,
  };
  const targets = [
    { targetId: "qualitative_toolbox", label: "Qualitative Methoden", status: "animated", visibleInEditor: true, render: true, confidence: "high" },
    { targetId: "quantitative_toolbox", label: "Quantitative Methoden – zurückgenommen", status: "animated", visibleInEditor: true, render: true, confidence: "high" },
    { targetId: "qualitative_focus_badge", label: "Fokus dieses Moduls", status: "animated", visibleInEditor: true, render: true, confidence: "high" },
    { targetId: "qualitative_tools", label: "FTA und FMEA", status: "animated", visibleInEditor: true, render: true, confidence: "high" },
  ];
  const steps = [
    { stepId: "step_01_qualitative_toolbox", targetId: "qualitative_toolbox", action: "show", sourceText: "Nämlich in die qualitativen und in die quantitativen Zuverlässigkeitsmethoden", occurrence: 1, confidence: "high", notes: "Beide Methodenkategorien erscheinen gemeinsam.", enterFrames: 16 },
    { stepId: "step_02_quantitative_toolbox", targetId: "quantitative_toolbox", action: "show", sourceText: "Nämlich in die qualitativen und in die quantitativen Zuverlässigkeitsmethoden", occurrence: 1, confidence: "high", notes: "Der quantitative Werkzeugkasten bleibt neutral-grau.", enterFrames: 16 },
    { stepId: "step_03_qualitative_focus_badge", targetId: "qualitative_focus_badge", action: "show", sourceText: "In diesem Modul werden wir ausschließlich die qualitativen Methoden betrachten", occurrence: 1, confidence: "high", notes: "Der Modulfokus wird erst mit der expliziten Einschränkung sichtbar.", enterFrames: 16 },
    { stepId: "step_04_qualitative_tools", targetId: "qualitative_tools", action: "show", sourceText: "Dazu schauen wir uns hauptsächlich die Fehlerbaumanalyse an", occurrence: 1, confidence: "high", notes: "FTA und FMEA werden als atomare Werkzeuggruppe eingeführt.", enterFrames: 16 },
  ];
  const manifest = { schemaVersion: "svgAnimationManifest/v1", svgPath: "slide_001.svg", defaults, targets, steps };
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(elementPlanPath, `${JSON.stringify({ schemaVersion: "elementAnimationPlan/v1", sceneId: "re2_ch1_methods", decision: "animated", defaults, targets, steps }, null, 2)}\n`, "utf8");
  process.stdout.write(`Generated RE2 scene 001 from RE1 scene 015: ${targetPath}\n`);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
