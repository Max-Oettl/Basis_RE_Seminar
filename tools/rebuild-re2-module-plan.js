"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const planRoot = path.join(root, "analysis", "rebuild-plans");
const inventoryPath = path.join(root, "analysis", "inventories", "RE2_svg-text-map.json");
const oldMapPath = path.join(planRoot, "RE2_source-reference-map.json");

const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
const oldMap = JSON.parse(fs.readFileSync(oldMapPath, "utf8"));
const oldBySlide = new Map(oldMap.mappings.map((entry) => [entry.output_slide_number, entry]));
const sourceBySlide = new Map(inventory.mappings.map((entry) => [entry.source_slide_number, entry]));

// One entry equals one didactic scene. The source ranges deliberately absorb
// former PowerPoint build/reveal states. render_source_slide selects the most
// complete existing redesigned state that becomes the static end state.
const specs = [
  [1, 1, 2, 2], [3, 3, 3, 3],
  [4, 4, 5, 4], [6, 6, 7, 6], [8, 8, 8, 8], [9, 9, 9, 9], [10, 10, 10, 10],
  [11, 11, 12, 11], [13, 13, 13, 13], [14, 14, 16, 16], [17, 17, 19, 19],
  [20, 20, 22, 22], [23, 23, 23, 23], [24, 24, 27, 26], [28, 28, 31, 30],
  [32, 32, 35, 34], [36, 36, 48, 43], [49, 49, 51, 51], [52, 52, 56, 56],
  [57, 57, 57, 57], [58, 58, 62, 62],
  [63, 63, 65, 65], [66, 66, 66, 66], [67, 67, 67, 67], [68, 68, 70, 70],
  [71, 71, 71, 71], [72, 72, 77, 75], [78, 78, 78, 78], [79, 79, 82, 81],
  [83, 83, 85, 85], [86, 86, 89, 89], [90, 90, 90, 90], [91, 91, 95, 95],
  [96, 96, 96, 96], [97, 97, 103, 103], [104, 104, 109, 108], [110, 110, 110, 110],
  [111, 111, 111, 111], [112, 112, 118, 118], [119, 119, 126, 122], [127, 127, 127, 127],
  [128, 128, 130, 129], [131, 131, 131, 131], [132, 132, 138, 136],
  [139, 139, 142, 142], [143, 143, 146, 146], [147, 147, 152, 150],
  [153, 153, 155, 155], [156, 156, 159, 159], [160, 160, 162, 162], [163, 163, 165, 165],
];

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function uniqueSpokenText(slides) {
  const seen = new Set();
  const blocks = [];
  for (const slide of slides) {
    const item = sourceBySlide.get(slide);
    if (!item || seen.has(item.spoken_text_sha256)) continue;
    seen.add(item.spoken_text_sha256);
    blocks.push(item.spoken_text);
  }
  return blocks.join("\n\n");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function sourceTextRefs(slides) {
  return unique(slides.map((slide) => {
    const item = sourceBySlide.get(slide);
    return item ? `${item.source_docx}#${item.source_text_section_id}` : "";
  }));
}

function spokenTextSources(slides) {
  return unique(slides.map((slide) => sourceBySlide.get(slide)?.extracted_markdown || ""));
}

function firstWords(text, count = 6) {
  return (String(text).match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu) || []).slice(0, count).join(" ");
}

const mappings = specs.map(([output, start, end, render]) => {
  const previous = oldBySlide.get(output);
  if (!previous) throw new Error(`Missing previous mapping for slide ${output}.`);
  const sources = range(start, end);
  return {
    work_unit: `slide_${String(output).padStart(3, "0")}`,
    scene_id: previous.scene_id,
    chapter: previous.chapter,
    lesson: previous.lesson,
    output_slide_number: output,
    source_slides: sources,
    primary_source_slide: render,
    render_source_slide: render,
    mapping_type: sources.length === 1 ? "direct" : "merged_sequence",
    rationale: sources.length === 1
      ? "Eigenständige didaktische Szene."
      : `Quellfolien ${start}–${end} sind Aufbau-, Reveal- oder Vertiefungszustände einer gemeinsamen didaktischen Szene.`,
  };
});

const sourceReferenceMap = {
  schema_version: "basisRebuildSourceReferenceMap/v1",
  module_id: "RE2",
  sequence_plan: "analysis/rebuild-plans/RE2_sequence_plan.md",
  updated_at: "2026-08-07",
  planning_status: "full_module_replanned_51_scenes",
  target_mode: "full_slide",
  mappings,
};

const scenePlan = {
  schema_version: "basisReScenePlan/v1",
  module_id: "RE2",
  external_module_id: "re2",
  source_inventory: "analysis/inventories/RE2_source-svg-inventory.json",
  text_mapping: "analysis/inventories/RE2_svg-text-map.json",
  target_structure_version: "external-svg-asset-package-handoff/v1",
  updated_at: "2026-08-07",
  target_mode: "full_slide",
  canvas: { width: 1920, height: 1080 },
  scene_count: mappings.length,
  source_state_count: inventory.mappings.length,
  qa: { issues: [], warnings: [], open_questions: [] },
  scenes: mappings.map((entry, index) => {
    const primary = sourceBySlide.get(entry.primary_source_slide);
    const spokenText = uniqueSpokenText(entry.source_slides);
    return {
      scene_id: entry.scene_id,
      work_unit: entry.work_unit,
      output_slide_number: index + 1,
      sequence_group_id: `re2_group_${String(index + 1).padStart(3, "0")}`,
      mode: entry.source_slides.length === 1 ? "standalone" : "build_sequence",
      chapter: entry.chapter,
      lesson: entry.lesson,
      source_slides: entry.source_slides,
      primary_source_slide: entry.primary_source_slide,
      mapping_type: entry.mapping_type,
      text_mapping_refs: sourceTextRefs(entry.source_slides),
      spoken_text_sources: spokenTextSources(entry.source_slides),
      source_text_title: primary?.source_text_title || "",
      content_title: primary?.source_text_title || "",
      spoken_text: spokenText,
      source_text_trigger: firstWords(spokenText),
      target_svg: `rebuild-proposals/svg/RE2/${entry.work_unit}/${entry.work_unit}.svg`,
      internal_manifest: `rebuild-proposals/svg/RE2/${entry.work_unit}/scene.animation.v1.json`,
      element_animation_plan: `rebuild-proposals/svg/RE2/${entry.work_unit}/element-animation-plan.json`,
      animation_dramaturgy_plan: `rebuild-proposals/svg/RE2/${entry.work_unit}/animation-dramaturgy-plan.json`,
      final_svg_basename: `${entry.scene_id}.svg`,
      final_manifest_basename: `${entry.scene_id}.animation.v1.json`,
      remove_powerpoint_speaker: true,
      animation_plan: {
        decision: "needs_review",
        rationale: "Wird nach der SVG-Produktion aus dem geprueften internen Manifest abgeleitet.",
        strategy: "semantic_reveal",
        state_count: 1,
        public_targets: [],
        semantic_groups: [],
        steps: [],
      },
      qa: { issues: [], warnings: [], open_questions: [] },
      production_status: "planned_for_rebuild",
    };
  }),
};

fs.writeFileSync(oldMapPath, `${JSON.stringify(sourceReferenceMap, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(planRoot, "RE2_scene-plan.json"), `${JSON.stringify(scenePlan, null, 2)}\n`, "utf8");

process.stdout.write(`Rebuilt RE2 module plan: ${mappings.length} scenes from ${inventory.mappings.length} source states.\n`);
