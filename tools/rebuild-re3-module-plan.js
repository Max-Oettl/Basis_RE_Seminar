"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  SCENES,
  REMOVED_SOURCE_SLIDES,
  SOURCE_STATE_COUNT,
  STRUCTURE_STATUS,
  structureForSource,
} = require("./re3-redesign-spec");

const root = path.resolve(__dirname, "..");
const planRoot = path.join(root, "analysis", "rebuild-plans");
const inventory = JSON.parse(fs.readFileSync(path.join(root, "analysis", "inventories", "RE3_svg-text-map.json"), "utf8"));

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

function effectiveSpokenText(scene, textEntry) {
  if (scene.narration_mode === "none") return "";
  if (!Array.isArray(scene.narration_paragraphs)) return textEntry.spoken_text;
  const paragraphs = String(textEntry.spoken_text).split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean);
  return scene.narration_paragraphs.map((paragraphIndex) => {
    if (!paragraphs[paragraphIndex]) throw new Error(`Sprechertext-Absatz ${paragraphIndex} fehlt für ${scene.work_unit}.`);
    return paragraphs[paragraphIndex];
  }).join("\n\n");
}

function mapping(scene, index) {
  const narrationSource = scene.narration_source_slide || scene.primary_source_slide;
  const textEntry = inventory.mappings.find((entry) => entry.source_slide_number === narrationSource);
  if (!textEntry) throw new Error(`Text-Mapping fehlt für RE3::${narrationSource}.`);
  const placementSources = scene.source_slides.length ? scene.source_slides : [scene.structure_source_slide];
  const placements = placementSources.map(structureForSource);
  const placement = placements[0];
  const crossesStructureBoundary = placements.some((candidate) => (
    candidate.chapter !== placement.chapter || candidate.lesson !== placement.lesson
  ));
  if (crossesStructureBoundary) {
    throw new Error(`${scene.work_unit} verbindet Quellfolien aus unterschiedlichen Kapiteln oder Lektionen.`);
  }
  const targetSvg = `rebuild-proposals/svg/RE3/${scene.work_unit}/${scene.work_unit}.svg`;
  const internalManifest = `rebuild-proposals/svg/RE3/${scene.work_unit}/scene.animation.v1.json`;
  const manifestPath = path.join(root, internalManifest);
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : { targets: [], steps: [] };
  const targets = manifest.targets || [];
  const steps = manifest.steps || [];
  return {
    ...scene,
    order: index + 1,
    sequence_group_id: `re3_group_${String(index + 1).padStart(3, "0")}`,
    mode: scene.source_slides.length === 0 ? "new_content_scene" : (scene.source_slides.length > 1 ? "build_sequence" : "single_svg"),
    chapter: placement.chapter,
    lesson: placement.lesson,
    structure_status: STRUCTURE_STATUS,
    structure_basis: [...new Set(placements.map((candidate) => candidate.basis))],
    canonical_source_ref: scene.primary_source_slide ? `RE3::${scene.primary_source_slide}` : null,
    narration_source_ref: `RE3::${narrationSource}`,
    absorbed_source_states: scene.source_slides.filter((slide) => slide !== scene.output_slide_number),
    mapping_type: scene.source_slides.length === 0 ? "new_content_from_confirmed_source_and_narration" : (scene.source_slides.length > 1 ? "merged_sequence" : "direct_rebuild"),
    text_mapping_refs: [`${textEntry.source_docx}#${scene.source_text_section_id}`],
    spoken_text_sources: [textEntry.extracted_markdown],
    source_text_title: textEntry.source_text_title,
    content_title: scene.title,
    spoken_text: effectiveSpokenText(scene, textEntry),
    narration_mode: scene.narration_mode,
    narration_paragraphs: scene.narration_paragraphs,
    target_svg: targetSvg,
    internal_manifest: internalManifest,
    element_animation_plan: `rebuild-proposals/svg/RE3/${scene.work_unit}/element-animation-plan.json`,
    final_svg_basename: `${scene.scene_id}.svg`,
    final_manifest_basename: `${scene.scene_id}.animation.v1.json`,
    remove_powerpoint_speaker: true,
    animation_plan: {
      decision: steps.length ? "animated" : "static",
      rationale: steps.length
        ? "Die Animation folgt dem Sprechertext und blendet fachlich zusammengehörige Elemente als semantische Gruppen ein."
        : "Die Szene ist ohne Animation vollständig und didaktisch klar.",
      strategy: steps.length ? "semantic_reveal" : "static_complete",
      state_count: steps.length + 1,
      public_targets: targets.map((target) => target.targetId),
      semantic_groups: targets.map((target) => ({ group_id: target.targetId, label: target.label, role: "redesign_semantic_group", members: [target.targetId] })),
      steps: steps.map((step, stepIndex) => ({ order: stepIndex + 1, target_id: step.targetId, action: step.action, source_text: step.sourceText })),
    },
  };
}

function main() {
  assertCoverage();
  fs.mkdirSync(planRoot, { recursive: true });
  const mappings = SCENES.map(mapping);
  const referenceMap = {
    schema_version: "basisReSourceReferenceMap/v1",
    module_id: "RE3",
    generated_from: [
      "analysis/inventories/RE3_svg-text-map.json",
      "analysis/inventories/RE3_source-svg-inventory.json",
      "tools/re3-redesign-spec.js",
    ],
    source_state_count: SOURCE_STATE_COUNT,
    active_scene_count: mappings.length,
    removed_source_slides: REMOVED_SOURCE_SLIDES,
    removed_reason: REMOVED_SOURCE_SLIDES.length ? "Die Quellzustände liegen außerhalb der vom Nutzer bestätigten Inhalte von Kapitel 5, Lektion 1 und 2. Sie bleiben unverändert im Quellenarchiv und werden nur aus der aktiven Lernsequenz ausgeschlossen." : "Keine Quellfolie entfernt; Produktionsnotizen werden nur innerhalb der rekonstruierten Fachfolie ausgeblendet.",
    structure_status: STRUCTURE_STATUS,
    structure_source: "Nutzervorgabe zu den alten RE3-SVG-Folienbereichen vom 27.08.2026; für Kapitel 5 zusätzlich durch die bestätigten Inhalte 58–59 (Lektion 1) und 67 (Lektion 2) präzisiert.",
    mappings,
  };
  const scenePlan = {
    schema_version: "basisReScenePlan/v1",
    module_id: "RE3",
    external_module_id: "re3",
    source_inventory: "analysis/inventories/RE3_source-svg-inventory.json",
    text_mapping: "analysis/inventories/RE3_svg-text-map.json",
    target_structure_version: "external-svg-asset-package-handoff/v1",
    updated_at: "2026-08-27",
    target_mode: "content_svg",
    output_numbering: "stable-scene-ids-with-user-validated-additional-scene",
    canvas: { width: 1920, height: 1080 },
    scene_count: mappings.length,
    source_state_count: SOURCE_STATE_COUNT,
    target_scene_count: mappings.length,
    removed_source_slides: REMOVED_SOURCE_SLIDES,
    sequence_decision: "Kapitel 5, Lektion 1 wird wegen der Informationsdichte in drei aufeinander abgestimmte Szenen geteilt; Lektion 2 bleibt eine animierte Szene mit Wechsel vom gemeinsamen zum getrennten Fit.",
    structure_status: STRUCTURE_STATUS,
    structure_source: "user_supplied_legacy_source_svg_ranges",
    qa: { issues: [], warnings: [], open_questions: [] },
    scenes: mappings,
  };
  fs.writeFileSync(path.join(planRoot, "RE3_source-reference-map.json"), `${JSON.stringify(referenceMap, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(planRoot, "RE3_scene-plan.json"), `${JSON.stringify(scenePlan, null, 2)}\n`, "utf8");

  const lines = [
    "# RE3 sequence plan",
    "",
    `- Source states: ${SOURCE_STATE_COUNT}`,
    `- Target scenes: ${mappings.length}`,
    `- Removed source slides: ${REMOVED_SOURCE_SLIDES.length ? REMOVED_SOURCE_SLIDES.join(", ") : "none"}`,
    "- Chapter/lesson structure: mapped from the user-supplied legacy source-SVG ranges",
    "- Transfer rule: Chapter 5 uses only the user-confirmed source content 58–59 and 67; archived source states outside that scope remain inactive.",
    "- Rule: lesson 1 is split for readability; lesson 2 transforms the joint fit into separate mechanism fits within one animated scene.",
    "",
    "| # | Target | Source SVGs | Chapter/Lesson | Text section | Animation | Archetype |",
    "|---:|---|---|---|---|---|---|",
    ...mappings.map((entry) => `| ${entry.order} | ${entry.work_unit} | ${entry.source_slides.length ? entry.source_slides.join(", ") : `new from ${entry.narration_source_ref}`} | ${entry.chapter}/${entry.lesson} | ${entry.source_text_section_id} | ${entry.animation_decision} | ${entry.archetype} |`),
    "",
  ];
  fs.writeFileSync(path.join(planRoot, "RE3_sequence_plan.md"), lines.join("\n"), "utf8");
  process.stdout.write(`Rebuilt RE3 plan with ${mappings.length} target scenes from ${SOURCE_STATE_COUNT} source states.\n`);
}

main();
