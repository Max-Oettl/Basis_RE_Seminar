"use strict";

const fs = require("fs");
const path = require("path");

const planArgument = process.argv.slice(2).find((argument) => !argument.startsWith("--"));
if (!planArgument) {
  console.error("Usage: node tools/validate-module-scene-plan.js <scene-plan.json>");
  process.exit(1);
}

function main() {
  const data = JSON.parse(fs.readFileSync(path.resolve(planArgument), "utf8").replace(/^\uFEFF/, ""));
  const errors = [];
  const warnings = [];
  const sceneIds = new Set();
  const workUnits = new Set();
  const sourceSlides = new Set();
  if (data.schema_version !== "basisReScenePlan/v1") errors.push("schema_version ist ungueltig.");
  if (data.target_structure_version !== "external-svg-asset-package-handoff/v1") errors.push("target_structure_version ist ungueltig.");
  let previousOutputNumber = 0;
  for (const [index, scene] of (data.scenes || []).entries()) {
    if (data.output_numbering === "source-aligned" || String(data.output_numbering || "").startsWith("stable-")) {
      if (scene.output_slide_number <= previousOutputNumber) errors.push(`Ausgabenummern sind nicht streng aufsteigend bei ${scene.work_unit}.`);
      const expectedWorkUnit = `slide_${String(scene.output_slide_number).padStart(3, "0")}`;
      if (scene.work_unit !== expectedWorkUnit) errors.push(`work_unit passt nicht zur source-aligned Ausgabenummer: ${scene.work_unit}.`);
      previousOutputNumber = scene.output_slide_number;
    } else if (scene.output_slide_number !== index + 1) errors.push(`Nicht lueckenlose Ausgabe bei ${scene.work_unit}.`);
    if (sceneIds.has(scene.scene_id)) errors.push(`Doppelte Scene_ID: ${scene.scene_id}`);
    if (workUnits.has(scene.work_unit)) errors.push(`Doppelte work_unit: ${scene.work_unit}`);
    sceneIds.add(scene.scene_id);
    workUnits.add(scene.work_unit);
    if (scene.source_slides.length && !scene.source_slides.includes(scene.primary_source_slide)) {
      errors.push(`Primary source fehlt in ${scene.work_unit}.`);
    }
    if (!scene.source_slides.length && !String(scene.mapping_type || "").startsWith("new_content")) {
      errors.push(`Quellenlose Szene ist nicht als new_content gekennzeichnet: ${scene.work_unit}.`);
    }
    if (!scene.source_slides.length && !scene.narration_source_ref) {
      errors.push(`Quellenlose Szene benötigt eine Sprechertext-Provenienz: ${scene.work_unit}.`);
    }
    for (const sourceSlide of scene.source_slides) {
      if (sourceSlides.has(sourceSlide)) errors.push(`Quellfolie ${sourceSlide} ist mehrfach verplant.`);
      sourceSlides.add(sourceSlide);
    }
    const normalize = (value) => (String(value).match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu) || []).join(" ").toLocaleLowerCase("de-DE");
    const animationPlan = scene.animation_plan || {};
    const decision = animationPlan.decision;
    if (!["static", "animated", "needs_review"].includes(decision)) {
      errors.push(`Animationsentscheidung fehlt oder ist ungueltig: ${scene.scene_id}`);
      continue;
    }
    const targets = Array.isArray(animationPlan.public_targets) ? animationPlan.public_targets : [];
    const groups = Array.isArray(animationPlan.semantic_groups) ? animationPlan.semantic_groups : [];
    const steps = Array.isArray(animationPlan.steps) ? animationPlan.steps : [];
    if (decision === "animated") {
      if (!targets.length) errors.push(`Animierte Szene hat keine Targets: ${scene.scene_id}`);
      if (!groups.length) errors.push(`Animierte Szene hat keine semantischen Gruppen: ${scene.scene_id}`);
      if (!steps.length) errors.push(`Animierte Szene hat keine Schritte: ${scene.scene_id}`);
      const groupIds = new Set(groups.map((group) => group.group_id));
      for (const step of steps) {
        if (!targets.includes(step.target_id) || !groupIds.has(step.target_id)) {
          errors.push(`Animationsschritt verweist nicht auf eine geplante semantische Gruppe: ${scene.scene_id}/${step.target_id}`);
        }
        if (!normalize(scene.spoken_text).includes(normalize(step.source_text))) {
          errors.push(`sourceText-Trigger fehlt im Sprechertext: ${scene.scene_id}/${step.target_id}`);
        }
      }
    } else {
      if (targets.length || groups.length || steps.length) {
        errors.push(`${decision}-Szene darf keine Animationsziele oder Schritte besitzen: ${scene.scene_id}`);
      }
      if (decision === "needs_review") warnings.push(`Animationsentscheidung offen: ${scene.scene_id}`);
    }
  }
  const removedSources = new Set(data.removed_source_slides || []);
  const expectedSourceCount = Number(data.source_state_count || 0);
  for (let source = 1; source <= expectedSourceCount; source += 1) {
    if (!removedSources.has(source) && !sourceSlides.has(source)) errors.push(`Quellfolienabdeckung fehlt bei ${source}.`);
    if (removedSources.has(source) && sourceSlides.has(source)) errors.push(`Entfernte Quellfolie ${source} ist dennoch verplant.`);
  }
  console.log(`Scenes: ${data.scenes?.length || 0}`);
  console.log(`Source slides covered: ${sourceSlides.size}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  for (const error of errors) console.log(`ERROR: ${error}`);
  for (const warning of warnings) console.log(`WARNING: ${warning}`);
  if (errors.length) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
