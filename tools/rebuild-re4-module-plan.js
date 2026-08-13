"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { SCENES, REMOVED_SOURCE_SLIDES, SOURCE_STATE_COUNT } = require("./re4-redesign-spec");

const root = path.resolve(__dirname, "..");
const planRoot = path.join(root, "analysis", "rebuild-plans");
const inventory = JSON.parse(fs.readFileSync(path.join(root, "analysis", "inventories", "RE4_svg-text-map.json"), "utf8"));

function assertCoverage() {
  const assigned = new Map();
  for (const scene of SCENES) {
    for (const source of scene.source_slides) {
      if (assigned.has(source)) throw new Error(`Quellfolie ${source} ist doppelt zugeordnet.`);
      assigned.set(source, scene.work_unit);
    }
  }
  for (const removed of REMOVED_SOURCE_SLIDES) {
    if (assigned.has(removed)) throw new Error(`Entfernte Quellfolie ${removed} ist zugleich einer Szene zugeordnet.`);
  }
  const missing = Array.from({ length: SOURCE_STATE_COUNT }, (_, index) => index + 1)
    .filter((source) => !assigned.has(source) && !REMOVED_SOURCE_SLIDES.includes(source));
  if (missing.length) throw new Error(`Unzugeordnete Quellfolien: ${missing.join(", ")}`);
  const mapSlides = new Set(inventory.mappings.map((entry) => entry.source_slide_number));
  for (let source = 1; source <= SOURCE_STATE_COUNT; source += 1) {
    if (!mapSlides.has(source)) throw new Error(`Text-Mapping fehlt für Quellfolie ${source}.`);
  }
}

function mapping(scene, index) {
  return {
    ...scene,
    order: index + 1,
    chapter: null,
    lesson: null,
    structure_status: "deferred_by_user",
    canonical_source_ref: `RE4::${scene.primary_source_slide}`,
    absorbed_source_states: scene.source_slides.filter((slide) => slide !== scene.output_slide_number),
  };
}

function main() {
  assertCoverage();
  fs.mkdirSync(planRoot, { recursive: true });
  const mappings = SCENES.map(mapping);
  const referenceLock = {
    named_reference: "Modul 3 – Umsetzung auf gleiche Weise",
    approved_targets: ["RE3::2", "RE3::24", "RE3::43", "RE3::70"],
    inherited_rules: [
      "full_slide 1920×1080 ohne duplizierte Masterelemente",
      "ruhige Navy-Tonalität für gleichrangige Inhalte",
      "semantische Akzente nur für Fokus, Erfolg oder Ausfall",
      "sprechertextgebundene semantische Gruppen statt Mikroanimationen",
    ],
  };
  const referenceMap = {
    schema_version: "basisReSourceReferenceMap/v1",
    module_id: "RE4",
    generated_from: [
      "analysis/inventories/RE4_svg-text-map.json",
      "analysis/inventories/RE4_source-svg-inventory.json",
      "tools/re4-redesign-spec.js",
    ],
    source_state_count: SOURCE_STATE_COUNT,
    active_scene_count: mappings.length,
    removed_source_slides: REMOVED_SOURCE_SLIDES,
    removed_reason: "PowerPoint-Produktionsnotiz mit sichtbaren gelben Redaktionshinweisen; der fachliche Inhalt ist in den Zielszenen 39, 41 und 63 vollständig enthalten.",
    structure_status: "Kapitel- und Lektionszuordnung bewusst offen bis zur späteren Nutzervorgabe.",
    reference_lock: referenceLock,
    mappings,
  };
  const scenePlan = {
    schema_version: "basisReScenePlan/v1",
    module_id: "RE4",
    source_state_count: SOURCE_STATE_COUNT,
    target_scene_count: mappings.length,
    removed_source_slides: REMOVED_SOURCE_SLIDES,
    sequence_decision: "PowerPoint-Aufbaustände werden konsolidiert; fachlich eigenständige Rechenwege, Referenzen, Anwendungen und Übungen bleiben getrennte Arbeitseinheiten.",
    structure_status: "deferred_by_user",
    reference_lock: referenceLock,
    scenes: mappings,
  };
  fs.writeFileSync(path.join(planRoot, "RE4_source-reference-map.json"), `${JSON.stringify(referenceMap, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(planRoot, "RE4_scene-plan.json"), `${JSON.stringify(scenePlan, null, 2)}\n`, "utf8");

  const lines = [
    "# RE4 sequence plan",
    "",
    `- Source states: ${SOURCE_STATE_COUNT}`,
    `- Target scenes: ${mappings.length}`,
    `- Removed production notes: ${REMOVED_SOURCE_SLIDES.join(", ")}`,
    "- Chapter/lesson structure: deferred by user",
    "- Reference lock: RE3 slide_002, slide_024, slide_043 and slide_070",
    "- Rule: one work unit at a time; build states consolidated; technical references, applications and exercises remain separate.",
    "",
    "| # | Target | Source SVGs | Text section | Animation | Archetype |",
    "|---:|---|---|---|---|---|",
    ...mappings.map((entry) => `| ${entry.order} | ${entry.work_unit} | ${entry.source_slides.join(", ")} | ${entry.source_text_section_id} | ${entry.animation_decision} | ${entry.archetype} |`),
    "",
  ];
  fs.writeFileSync(path.join(planRoot, "RE4_sequence_plan.md"), lines.join("\n"), "utf8");
  process.stdout.write(`Rebuilt RE4 plan with ${mappings.length} target scenes from ${SOURCE_STATE_COUNT} source states.\n`);
}

main();
