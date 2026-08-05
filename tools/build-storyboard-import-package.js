"use strict";

const fs = require("fs");
const path = require("path");
const SvgAnimationDomain = require("./basis-rebuild-viewer/svg-animation-domain");
const NarrationPauseDomain = require("./basis-rebuild-viewer/narration-pause-domain");
const { stripDownstreamOwnedSlideChrome } = require("./svg-downstream-chrome");

const repoRoot = path.resolve(__dirname, "..");
const MANIFEST_ROOT_FIELDS = ["schemaVersion", "svgPath", "defaults", "targets", "steps"];
const DEFAULT_FIELDS = ["enterFrames", "exitFrames", "highlightDurFrames", "drawDurFrames", "transformDurFrames"];
const TARGET_FIELDS = ["targetId", "label", "status", "visibleInEditor", "render", "confidence", "ignoreReason"];
const STEP_BASE_FIELDS = ["stepId", "targetId", "action", "sourceText", "occurrence", "confidence", "notes"];
const STEP_ACTION_FIELDS = {
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

function parseArguments(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (!argv[index].startsWith("--")) continue;
    result[argv[index].slice(2)] = argv[index + 1];
    index += 1;
  }
  return result;
}

function required(args, key) {
  if (!args[key]) throw new Error(`Fehlendes Argument --${key}`);
  return args[key];
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function repoPath(value) {
  return path.resolve(repoRoot, String(value || "").replaceAll("/", path.sep));
}

function pickFields(value, fields) {
  const result = {};
  for (const field of fields) {
    if (value?.[field] !== undefined) result[field] = value[field];
  }
  return result;
}

function wordTokens(text) {
  return SvgAnimationDomain.wordTokens(text).map(({ raw, start, end }) => ({ raw, start, end }));
}

function assertValidNarrationPauseMarkers(text, context) {
  const validation = NarrationPauseDomain.validateNarration(text);
  if (validation.valid) return;
  const markers = validation.errors.map((error) => error.raw).join(", ");
  throw new Error(`Ungueltige Pausenmarker in ${context}: ${markers}`);
}

function compactSourceText(spokenText, sourceText, occurrence) {
  const sourceWords = wordTokens(sourceText);
  const visibleWordCount = sourceWords.length;
  if (visibleWordCount >= 3 && visibleWordCount <= 8 && !/\{\{pause:/i.test(sourceText)) {
    return { sourceText, occurrence };
  }

  const originalMatch = SvgAnimationDomain.matchSourceText(spokenText, sourceText, occurrence);
  if (!originalMatch.matched) return { sourceText, occurrence };

  const spokenWords = wordTokens(spokenText);
  const originalStart = originalMatch.selected.wordIndex;
  const uniqueCandidates = [];
  const repeatedCandidates = [];
  const lengths = [6, 7, 8, 5, 4, 3].filter((length) => length <= sourceWords.length);

  for (const length of lengths) {
    for (let offset = 0; offset <= sourceWords.length - length; offset += 1) {
      const first = spokenWords[originalStart + offset];
      const last = spokenWords[originalStart + offset + length - 1];
      if (!first || !last) continue;
      const candidate = spokenWords.slice(originalStart + offset, originalStart + offset + length)
        .map((word) => word.raw).join(" ");
      const candidateWordCount = wordTokens(candidate).length;
      if (candidateWordCount < 3 || candidateWordCount > 8) continue;
      const candidateMatch = SvgAnimationDomain.matchSourceText(spokenText, candidate);
      const selectedOccurrence = candidateMatch.matches.findIndex(
        (match) => match.wordIndex === originalStart + offset,
      ) + 1;
      if (!selectedOccurrence) continue;
      const result = {
        sourceText: candidate,
        occurrence: candidateMatch.matches.length > 1 ? selectedOccurrence : undefined,
      };
      if (candidateMatch.matches.length === 1) uniqueCandidates.push(result);
      else repeatedCandidates.push(result);
    }
    if (uniqueCandidates.length) return uniqueCandidates[0];
  }

  const originalEnd = originalStart + sourceWords.length - 1;
  for (let start = Math.max(0, originalStart - 4); start <= originalStart; start += 1) {
    for (
      let end = originalEnd;
      end <= Math.min(spokenWords.length - 1, originalEnd + 4);
      end += 1
    ) {
      const candidate = spokenWords.slice(start, end + 1).map((word) => word.raw).join(" ");
      const candidateWordCount = wordTokens(candidate).length;
      if (candidateWordCount < 3 || candidateWordCount > 8) continue;
      const candidateMatch = SvgAnimationDomain.matchSourceText(spokenText, candidate);
      const selectedOccurrence = candidateMatch.matches.findIndex((match) => match.wordIndex === start) + 1;
      if (!selectedOccurrence) continue;
      const result = {
        sourceText: candidate,
        occurrence: candidateMatch.matches.length > 1 ? selectedOccurrence : undefined,
      };
      if (candidateMatch.matches.length === 1) uniqueCandidates.push(result);
      else repeatedCandidates.push(result);
    }
  }
  if (uniqueCandidates.length) {
    uniqueCandidates.sort((left, right) =>
      wordTokens(left.sourceText).length - wordTokens(right.sourceText).length);
    return uniqueCandidates[0];
  }

  return repeatedCandidates[0] || { sourceText, occurrence };
}

function externalizeManifest(internalManifest, finalSvgBasename, spokenText) {
  const manifest = pickFields(internalManifest, MANIFEST_ROOT_FIELDS);
  manifest.schemaVersion = "svgAnimationManifest/v1";
  manifest.svgPath = finalSvgBasename;
  manifest.defaults = pickFields(internalManifest.defaults || {}, DEFAULT_FIELDS);
  manifest.targets = (internalManifest.targets || []).map((target) => pickFields(target, TARGET_FIELDS));
  manifest.steps = (internalManifest.steps || []).map((step) => {
    const allowed = [...STEP_BASE_FIELDS, ...(STEP_ACTION_FIELDS[step.action] || [])];
    const externalStep = pickFields(step, allowed);
    if (step.action === "draw" && externalStep.durFrames == null && step.drawDurFrames != null) {
      externalStep.durFrames = step.drawDurFrames;
    }
    const trigger = compactSourceText(spokenText, String(step.sourceText || ""), step.occurrence);
    externalStep.sourceText = trigger.sourceText;
    if (/\{\{\s*pause\b/i.test(externalStep.sourceText)) {
      throw new Error(`Pausenmarker darf nicht als sourceText exportiert werden: ${externalStep.sourceText}`);
    }
    if (trigger.occurrence == null) delete externalStep.occurrence;
    else externalStep.occurrence = trigger.occurrence;
    return externalStep;
  });
  return manifest;
}

function prepareSvgForHandoff(svgText) {
  return stripDownstreamOwnedSlideChrome(svgText).replace(/<image\b([^>]*)>/gi, (markup, attributes) => {
    const href = attributes.match(/\b(?:href|xlink:href)\s*=\s*["']([^"']+)["']/i)?.[1] || "";
    if (!href.startsWith("data:") || /\bdata-qa-embedded-image\s*=/i.test(attributes)) return markup;
    return `<image data-qa-embedded-image="allowed" data-qa-reason="Portable RE1 source asset embedded by the approved slide generator"${attributes}>`;
  });
}

function assertEmptyOrMissing(directory) {
  if (!fs.existsSync(directory)) return;
  if (fs.readdirSync(directory).length > 0) {
    throw new Error(`Zielpaket ist nicht leer und wird nicht automatisch ueberschrieben: ${directory}`);
  }
}

function assertUpdatablePackage(directory, moduleId) {
  const manifestPath = path.join(directory, "import.package.v1.json");
  if (!fs.existsSync(manifestPath)) throw new Error(`Bestehendes Ziel ist kein freigegebenes Importpaket: ${directory}`);
  const manifest = readJson(manifestPath);
  if (manifest.schemaVersion !== "storyboardImportPackage/v1" || manifest.moduleId !== moduleId) {
    throw new Error(`Bestehendes Zielpaket hat eine andere Identitaet: ${directory}`);
  }
}

function chapterFromReference(reference) {
  const fileName = path.basename(String(reference || "").split("#")[0]);
  return fileName.replace(/\.docx$/i, "").replace(/^\d+_Modul_[^-]+-?\s*/i, "").replaceAll("_", " ").trim() || "RE Grundlagen";
}

function main() {
  const args = parseArguments(process.argv.slice(2));
  const scenePlanPath = path.resolve(required(args, "scene-plan"));
  const outputRoot = path.resolve(required(args, "output"));
  const plan = readJson(scenePlanPath);
  if (args.update === "true") assertUpdatablePackage(outputRoot, plan.external_module_id);
  else assertEmptyOrMissing(outputRoot);
  for (const scene of plan.scenes || []) {
    assertValidNarrationPauseMarkers(scene.spoken_text, scene.scene_id || scene.work_unit || "Szene");
  }
  const assetsRoot = path.join(outputRoot, "assets");
  fs.mkdirSync(assetsRoot, { recursive: true });
  const rows = [];

  for (const scene of [...plan.scenes].sort((a, b) => a.output_slide_number - b.output_slide_number)) {
    const workDirectory = path.dirname(repoPath(scene.target_svg));
    const transformationReportPath = path.join(workDirectory, "transformation-report.json");
    const transformationReport = readJson(transformationReportPath);
    if (transformationReport.qa?.status !== "passed") {
      throw new Error(`Arbeitseinheit ist nicht lokal freigegeben: ${scene.work_unit}`);
    }
    const crosscheck = readJson(repoPath(transformationReport.qa.content_crosscheck));
    const svgQa = readJson(repoPath(transformationReport.qa.svg_qa_report));
    if (crosscheck.status !== "passed" || crosscheck.qa?.issues?.length) {
      throw new Error(`Content-Crosscheck ist nicht freigegeben: ${scene.work_unit}`);
    }
    if (svgQa.summary?.errors || svgQa.summary?.warnings) {
      throw new Error(`Lokale SVG-QA ist nicht 0/0: ${scene.work_unit}`);
    }

    const sourceSvgPath = repoPath(scene.target_svg);
    const sourceManifestPath = repoPath(scene.internal_manifest);
    const sceneDirectory = path.join(assetsRoot, scene.scene_id);
    fs.mkdirSync(sceneDirectory, { recursive: true });
    const targetSvgPath = path.join(sceneDirectory, scene.final_svg_basename);
    const targetManifestPath = path.join(sceneDirectory, scene.final_manifest_basename);
    const sourceSvg = fs.readFileSync(sourceSvgPath, "utf8");
    fs.writeFileSync(targetSvgPath, prepareSvgForHandoff(sourceSvg), "utf8");

    const manifest = externalizeManifest(readJson(sourceManifestPath), scene.final_svg_basename, scene.spoken_text);
    fs.writeFileSync(targetManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

    rows.push({
      Scene_ID: scene.scene_id,
      Modul: plan.module_id,
      Kapitel: chapterFromReference(scene.text_mapping_refs[0]),
      Lektion: scene.content_title,
      Reihenfolge: scene.output_slide_number,
      Status: "review",
      Titel: scene.content_title,
      Hauptinhalt: scene.content_title,
      "Gesprochener Text": scene.spoken_text,
      "Grafikelemente (Auflistung)": scene.mode === "build_sequence"
        ? `Animierte Quellzustaende aus Folien ${scene.source_slides.join(", ")}`
        : `Transformiertes Fachvisual aus Folie ${scene.primary_source_slide}`,
      "Links auf Grafikelemente": `assets/${scene.scene_id}/${scene.final_svg_basename}`,
      Notizen: `Quell-SVGs: ${scene.source_slides.join(", ")}; Mapping: ${scene.mapping_type}; Zielstruktur: ${plan.target_structure_version}`,
    });
  }

  const packageManifest = {
    schemaVersion: "storyboardImportPackage/v1",
    rows: "storyboard.rows.json",
    moduleId: plan.external_module_id,
    moduleTitle: "Basis Seminar Reliability Engineering 1",
    assetMode: "bySceneId",
    assetsDir: "assets",
  };
  fs.writeFileSync(path.join(outputRoot, "import.package.v1.json"), `${JSON.stringify(packageManifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(outputRoot, "storyboard.rows.json"), `${JSON.stringify({ rows }, null, 2)}\n`, "utf8");
  console.log(`Package scenes: ${rows.length}`);
  console.log(`Package: ${outputRoot}`);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
