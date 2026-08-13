"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { stripDownstreamOwnedSlideChrome } = require("./svg-downstream-chrome");

const root = path.resolve(__dirname, "..");
const planPath = path.join(root, "analysis", "rebuild-plans", "RE2_scene-plan.json");
const outputRoot = path.join(root, "Output", "RE2-video-handoff-2026-08-07-v4");

const ROOT_FIELDS = ["schemaVersion", "svgPath", "defaults", "targets", "steps"];
const DEFAULT_FIELDS = ["enterFrames", "exitFrames", "highlightDurFrames", "drawDurFrames", "transformDurFrames"];
const TARGET_FIELDS = ["targetId", "label", "status", "visibleInEditor", "render", "confidence", "ignoreReason"];
const STEP_FIELDS = [
  "stepId", "targetId", "action", "sourceText", "occurrence", "confidence", "notes",
  "enterFrames", "exitFrames", "durFrames", "fromY", "toY", "fill", "stroke", "strokeWidth",
  "drawStyle", "direction", "fromTranslateX", "fromTranslateY", "fromScale", "translateX",
  "translateY", "scale", "transformOrigin",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function pick(object, fields) {
  return Object.fromEntries(fields.filter((field) => object?.[field] !== undefined).map((field) => [field, object[field]]));
}

function prepareSvg(svgText, sourceSvg) {
  const portableSvg = svgText.replace(/\b(href|xlink:href)\s*=\s*["']([^"']+)["']/gi, (markup, attribute, reference) => {
    if (/^(?:data:|#|https?:|\/)/i.test(reference)) return markup;
    const source = path.resolve(path.dirname(sourceSvg), reference);
    if (!source.startsWith(path.dirname(sourceSvg))) throw new Error(`Unsichere relative SVG-Referenz: ${reference}`);
    if (!fs.existsSync(source)) throw new Error(`Referenziertes SVG-Asset fehlt: ${source}`);
    const extension = path.extname(source).toLowerCase();
    const mime = extension === ".svg" ? "image/svg+xml" : extension === ".png" ? "image/png" : "application/octet-stream";
    return `${attribute}="data:${mime};base64,${fs.readFileSync(source).toString("base64")}"`;
  });
  return stripDownstreamOwnedSlideChrome(portableSvg).replace(/<image\b([^>]*)>/gi, (markup, attributes) => {
    const href = attributes.match(/\b(?:href|xlink:href)\s*=\s*["']([^"']+)["']/i)?.[1] || "";
    if (!href.startsWith("data:") || /\bdata-qa-embedded-image\s*=/i.test(attributes)) return markup;
    return `<image data-qa-embedded-image="allowed" data-qa-reason="Portable, locally embedded source asset"${attributes}>`;
  });
}

function copyRelativeAssets(svgText, sourceSvg, sceneRoot) {
  const references = [...svgText.matchAll(/\b(?:href|xlink:href)\s*=\s*["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((reference) => !/^(?:data:|#|https?:|\/)/i.test(reference));
  for (const reference of new Set(references)) {
    const source = path.resolve(path.dirname(sourceSvg), reference);
    const destination = path.resolve(sceneRoot, reference);
    if (!source.startsWith(path.dirname(sourceSvg)) || !destination.startsWith(sceneRoot)) {
      throw new Error(`Unsichere relative SVG-Referenz: ${reference}`);
    }
    if (!fs.existsSync(source)) throw new Error(`Referenziertes SVG-Asset fehlt: ${source}`);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }
}

function externalManifest(internal, svgName) {
  const result = pick(internal, ROOT_FIELDS);
  result.schemaVersion = "svgAnimationManifest/v1";
  result.svgPath = svgName;
  result.defaults = pick(internal.defaults || {}, DEFAULT_FIELDS);
  result.targets = (internal.targets || []).map((target) => pick(target, TARGET_FIELDS));
  result.steps = (internal.steps || []).map((step) => pick(step, STEP_FIELDS));
  return result;
}

function main() {
  if (fs.existsSync(outputRoot) && fs.readdirSync(outputRoot).length) {
    throw new Error(`Das versionierte Ziel ist nicht leer und wird nicht ueberschrieben: ${outputRoot}`);
  }

  const plan = readJson(planPath);
  const assetsRoot = path.join(outputRoot, "assets");
  fs.mkdirSync(assetsRoot, { recursive: true });
  const rows = [];

  for (const scene of [...plan.scenes].sort((a, b) => a.output_slide_number - b.output_slide_number)) {
    const sourceSvg = path.join(root, ...scene.target_svg.split("/"));
    const sourceManifest = path.join(root, ...scene.internal_manifest.split("/"));
    const sceneRoot = path.join(assetsRoot, scene.scene_id);
    fs.mkdirSync(sceneRoot, { recursive: true });

    const svgText = fs.readFileSync(sourceSvg, "utf8");
    fs.writeFileSync(
      path.join(sceneRoot, scene.final_svg_basename),
      prepareSvg(svgText, sourceSvg),
      "utf8",
    );
    fs.writeFileSync(
      path.join(sceneRoot, scene.final_manifest_basename),
      `${JSON.stringify(externalManifest(readJson(sourceManifest), scene.final_svg_basename), null, 2)}\n`,
      "utf8",
    );

    rows.push({
      Scene_ID: scene.scene_id,
      Modul: "RE2",
      Kapitel: `Kapitel ${scene.chapter}`,
      Lektion: scene.content_title,
      Reihenfolge: scene.output_slide_number,
      Status: "review",
      Titel: scene.content_title,
      Hauptinhalt: scene.content_title,
      "Gesprochener Text": scene.spoken_text,
      "Grafikelemente (Auflistung)": scene.mode === "build_sequence"
        ? `Konsolidierte Aufbauzustaende aus Folien ${scene.source_slides.join(", ")}`
        : `Neu gestaltetes Fachvisual aus Folie ${scene.primary_source_slide}`,
      "Links auf Grafikelemente": `assets/${scene.scene_id}/${scene.final_svg_basename}`,
      Notizen: `Quellfolien: ${scene.source_slides.join(", ")}; Animation: ${scene.animation_plan.decision}; Vollflaechiges Education-Redesign.`,
    });
  }

  fs.writeFileSync(path.join(outputRoot, "import.package.v1.json"), `${JSON.stringify({
    schemaVersion: "storyboardImportPackage/v1",
    rows: "storyboard.rows.json",
    moduleId: "re2",
    moduleTitle: "Basis-Seminar Reliability Engineering – Modul 2: Qualitative Methoden",
    assetMode: "bySceneId",
    assetsDir: "assets",
  }, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(outputRoot, "storyboard.rows.json"), `${JSON.stringify({ rows }, null, 2)}\n`, "utf8");
  process.stdout.write(`Packaged ${rows.length} RE2 scenes to ${outputRoot}.\n`);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
