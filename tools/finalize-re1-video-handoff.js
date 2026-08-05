"use strict";

const fs = require("node:fs");
const path = require("node:path");
const SvgAnimationDomain = require("./basis-rebuild-viewer/svg-animation-domain");
const NarrationPauseDomain = require("./basis-rebuild-viewer/narration-pause-domain");
const { stripDownstreamOwnedSlideChrome } = require("./svg-downstream-chrome");

const repoRoot = path.resolve(__dirname, "..");
const packageRoot = path.join(repoRoot, "output", "RE1-video-handoff");
const scenePlanPath = path.join(repoRoot, "analysis", "rebuild-plans", "RE1_scene-plan.json");

const ROOT_FIELDS = ["schemaVersion", "svgPath", "defaults", "targets", "steps"];
const DEFAULT_FIELDS = ["enterFrames", "exitFrames", "highlightDurFrames", "drawDurFrames", "transformDurFrames"];
const TARGET_FIELDS = ["targetId", "label", "status", "visibleInEditor", "render", "confidence", "ignoreReason"];
const STEP_BASE_FIELDS = ["stepId", "targetId", "action", "sourceText", "occurrence", "confidence", "notes"];
const ACTION_FIELDS = {
  show: ["enterFrames", "fromY"],
  hide: ["exitFrames", "toY"],
  highlight: ["durFrames", "fill", "stroke", "strokeWidth"],
  draw: ["durFrames", "drawStyle", "direction"],
  transform: [
    "durFrames",
    "fromTranslateX",
    "fromTranslateY",
    "fromScale",
    "translateX",
    "translateY",
    "scale",
    "transformOrigin",
  ],
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function pick(object, fields) {
  return Object.fromEntries(fields.filter((field) => object[field] !== undefined).map((field) => [field, object[field]]));
}

function words(value) {
  return SvgAnimationDomain.wordTokens(value).map((token) => token.raw);
}

function spokenWordTokens(value) {
  return SvgAnimationDomain.wordTokens(value).map((token) => token.raw);
}

function assertValidNarrationPauseMarkers(text, context) {
  const validation = NarrationPauseDomain.validateNarration(text);
  if (validation.valid) return;
  const markers = validation.errors.map((error) => error.raw).join(", ");
  throw new Error(`Ungueltige Pausenmarker in ${context}: ${markers}`);
}

function chooseExternalTrigger(spokenText, original) {
  const tokens = words(original);
  if (tokens.length >= 3 && tokens.length <= 8 && !/\{\{pause:/i.test(original)) return original.trim();

  if (tokens.length < 3) {
    const sourceMatch = SvgAnimationDomain.matchSourceText(spokenText, original);
    if (sourceMatch.matched) {
      const spokenTokens = spokenWordTokens(spokenText);
      const matchedStart = sourceMatch.selected.wordIndex;
      for (const length of [6, 5, 4, 3, 7, 8]) {
        for (const start of [matchedStart, Math.max(0, matchedStart - (3 - tokens.length)), Math.max(0, matchedStart + tokens.length - length)]) {
          if (start + length > spokenTokens.length) continue;
          const candidate = spokenTokens.slice(start, start + length).join(" ");
          const match = SvgAnimationDomain.matchSourceText(spokenText, candidate);
          if (match.matched && !match.ambiguous) return candidate;
        }
      }
    }
  }

  const preferredLengths = [8, 7, 6, 5, 4, 3];
  for (const start of [...tokens.keys()]) {
    for (const length of preferredLengths) {
      if (start + length > tokens.length) continue;
      const candidate = tokens.slice(start, start + length).join(" ");
      const match = SvgAnimationDomain.matchSourceText(spokenText, candidate);
      if (match.matched && !match.ambiguous) return candidate;
    }
  }

  const fallback = tokens.slice(0, Math.min(8, tokens.length)).join(" ");
  if (words(fallback).length >= 3 && SvgAnimationDomain.matchSourceText(spokenText, fallback).matched) return fallback;
  throw new Error(`Kein robuster externer Trigger ableitbar: ${original}`);
}

function normalizeDirection(value) {
  const directions = {
    "left-to-right": "leftToRight",
    left_to_right: "leftToRight",
    "right-to-left": "rightToLeft",
    right_to_left: "rightToLeft",
    "top-to-bottom": "topToBottom",
    top_to_bottom: "topToBottom",
    "bottom-to-top": "bottomToTop",
    bottom_to_top: "bottomToTop",
  };
  return directions[value] || value;
}

function externalStep(step, defaults, spokenText) {
  const action = step.action;
  const result = pick(step, [...STEP_BASE_FIELDS, ...(ACTION_FIELDS[action] || [])]);
  result.sourceText = chooseExternalTrigger(spokenText, step.sourceText);

  if (action === "draw") {
    result.durFrames = step.durFrames || step.drawDurFrames || defaults.drawDurFrames || 42;
    if (result.direction) result.direction = normalizeDirection(result.direction);
  } else if (action === "highlight") {
    result.durFrames = step.durFrames || step.highlightDurFrames || defaults.highlightDurFrames || 30;
  } else if (action === "transform") {
    result.durFrames = step.durFrames || step.transformDurFrames || defaults.transformDurFrames || 30;
  } else if (action === "show" && step.enterFrames != null) {
    result.enterFrames = step.enterFrames;
  } else if (action === "hide" && step.exitFrames != null) {
    result.exitFrames = step.exitFrames;
  }

  const match = SvgAnimationDomain.matchSourceText(spokenText, result.sourceText);
  if (!match.matched) throw new Error(`Externer Trigger fehlt im Sprechertext: ${result.sourceText}`);
  if (match.ambiguous) {
    result.occurrence = Number.isInteger(step.occurrence) && step.occurrence > 0 ? step.occurrence : 1;
  } else {
    delete result.occurrence;
  }
  return result;
}

function annotateEmbeddedImages(svgText) {
  return svgText.replace(/<image\b([^>]*\b(?:href|xlink:href)\s*=\s*["']data:[^>]+)>/gi, (markup) => {
    if (/data-qa-embedded-image\s*=\s*["']allowed["']/i.test(markup)) return markup;
    return markup.replace(
      /<image\b/i,
      '<image data-qa-embedded-image="allowed" data-qa-reason="Quelltreues lokal eingebettetes Medienasset ohne externe Abhaengigkeit"',
    );
  });
}

function applyPackageLayoutFixes(sceneId, svgText) {
  if (sceneId === "re1_src_009") {
    return svgText.replace(
      '<text x="910" y="276"',
      '<text x="910" y="284"',
    );
  }
  if (sceneId === "re1_src_012") {
    return svgText.replace(
      '<rect data-qc-allow-overlap="true" x="1245" y="710" width="565" height="68"',
      '<rect data-qc-allow-overlap="true" x="1230" y="710" width="595" height="68"',
    );
  }
  return svgText;
}

function validatePackageShape(scenePlan) {
  const allowedRootFiles = new Set(["import.package.v1.json", "storyboard.rows.json", "assets"]);
  const rootEntries = fs.readdirSync(packageRoot);
  const unexpected = rootEntries.filter((entry) => !allowedRootFiles.has(entry));
  if (unexpected.length) throw new Error(`Unerwartete Dateien im Paket: ${unexpected.join(", ")}`);

  const sceneDirectories = fs.readdirSync(path.join(packageRoot, "assets"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  if (sceneDirectories.length !== scenePlan.scenes.length) {
    throw new Error(`Szenenanzahl stimmt nicht: ${sceneDirectories.length} statt ${scenePlan.scenes.length}`);
  }
}

function main() {
  const plan = readJson(scenePlanPath);
  const rowsPath = path.join(packageRoot, "storyboard.rows.json");
  const rows = readJson(rowsPath).rows;
  const rowByScene = new Map(rows.map((row) => [row.Scene_ID, row]));

  for (const row of rows) {
    assertValidNarrationPauseMarkers(row["Gesprochener Text"] || "", row.Scene_ID || "Szene");
  }

  for (const scene of plan.scenes) {
    const row = rowByScene.get(scene.scene_id);
    if (!row) throw new Error(`Storyboard-Zeile fehlt: ${scene.scene_id}`);
    const sceneDirectory = path.join(packageRoot, "assets", scene.scene_id);
    const svgPath = path.join(sceneDirectory, scene.final_svg_basename);
    const manifestPath = path.join(sceneDirectory, scene.final_manifest_basename);

    const originalSvg = fs.readFileSync(svgPath, "utf8");
    const portableSvg = stripDownstreamOwnedSlideChrome(
      applyPackageLayoutFixes(scene.scene_id, annotateEmbeddedImages(originalSvg)),
    );
    fs.writeFileSync(svgPath, portableSvg, "utf8");

    const internal = readJson(manifestPath);
    const defaults = pick(internal.defaults || {}, DEFAULT_FIELDS);
    const external = {
      schemaVersion: "svgAnimationManifest/v1",
      svgPath: scene.final_svg_basename,
      defaults,
      targets: (internal.targets || []).map((target) => {
        const result = pick(target, TARGET_FIELDS);
        if (result.status === "ignored") result.status = "notAnimated";
        return result;
      }),
      steps: (internal.steps || []).map((step) => externalStep(step, defaults, row["Gesprochener Text"] || "")),
    };
    fs.writeFileSync(manifestPath, `${JSON.stringify(pick(external, ROOT_FIELDS), null, 2)}\n`, "utf8");
  }

  validatePackageShape(plan);
  console.log(`Finalized ${plan.scenes.length} copied RE1 scene folders for strict external handoff.`);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
