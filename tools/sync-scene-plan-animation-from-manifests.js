"use strict";

const fs = require("fs");
const path = require("path");

function parseArguments(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    args[token.slice(2)] = argv[index + 1];
    index += 1;
  }
  return args;
}

function parseSlideRange(value) {
  const slides = new Set();
  for (const part of String(value || "").split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const range = trimmed.match(/^(\d+)-(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      for (let slide = Math.min(start, end); slide <= Math.max(start, end); slide += 1) {
        slides.add(slide);
      }
      continue;
    }
    const slide = Number(trimmed);
    if (!Number.isInteger(slide) || slide < 1) {
      throw new Error(`Ungueltige Folienauswahl: ${trimmed}`);
    }
    slides.add(slide);
  }
  return slides;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function main() {
  const args = parseArguments(process.argv);
  const moduleId = String(args.module || "").toUpperCase();
  const selectedSlides = parseSlideRange(args.slides);
  if (!moduleId || selectedSlides.size === 0) {
    throw new Error("Verwendung: node tools/sync-scene-plan-animation-from-manifests.js --module RE1 --slides 40-49");
  }

  const root = path.resolve(__dirname, "..");
  const planPath = path.join(root, "analysis", "rebuild-plans", `${moduleId}_scene-plan.json`);
  const plan = readJson(planPath);
  let updated = 0;

  for (const scene of plan.scenes || []) {
    const slide = Number(scene.output_slide_number);
    if (!selectedSlides.has(slide)) continue;

    const manifestPath = path.resolve(root, scene.internal_manifest);
    const manifest = readJson(manifestPath);
    const targets = Array.isArray(manifest.targets) ? manifest.targets : [];
    const steps = Array.isArray(manifest.steps) ? manifest.steps : [];

    scene.remove_powerpoint_speaker = true;
    scene.animation_plan = {
      decision: steps.length > 0 ? "animated" : "static",
      rationale: steps.length > 0
        ? "Die Animation folgt dem Sprechertext und blendet fachlich zusammengehoerige Elemente als semantische Gruppen ein."
        : "Die Szene ist ohne Animation vollstaendig und didaktisch klar.",
      strategy: steps.length > 0 ? "semantic_reveal" : "static_complete",
      state_count: steps.length + 1,
      public_targets: targets.map((target) => target.targetId),
      semantic_groups: targets.map((target) => ({
        group_id: target.targetId,
        label: target.label,
        role: "redesign_semantic_group",
        members: [target.targetId],
      })),
      steps: steps.map((step, index) => ({
        order: index + 1,
        target_id: step.targetId,
        action: step.action,
        source_text: step.sourceText,
      })),
    };
    updated += 1;
  }

  const missing = [...selectedSlides].filter(
    (slide) => !(plan.scenes || []).some((scene) => Number(scene.output_slide_number) === slide),
  );
  if (missing.length > 0) {
    throw new Error(`Folien fehlen im Szenenplan: ${missing.join(", ")}`);
  }

  fs.writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
  process.stdout.write(`Animationsplanung fuer ${updated} Szenen in ${path.relative(root, planPath)} synchronisiert.\n`);
}

main();
