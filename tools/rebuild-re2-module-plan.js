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

function entry(output, start, end, render, options = {}) {
  return { output, start, end, render, ...options };
}

// A work unit is a complete learning scene. Reveal-only source states stay merged.
// Independent rules, methods, examples and evaluations receive their own scene.
const specs = [
  entry(1, 1, 2, 2), entry(3, 3, 3, 3),
  entry(4, 4, 5, 4), entry(6, 6, 7, 6), entry(8, 8, 8, 8), entry(9, 9, 9, 9), entry(10, 10, 10, 10),
  entry(11, 11, 12, 11), entry(13, 13, 13, 13),
  entry(14, 14, 15, 14, {
    content_title: "Funktionsstruktur: Prinzip",
    narration_group: "function_structure",
    narration_end: "Im Falle des Wechselrichters",
  }),
  entry(16, 16, 16, 16, {
    scene_id: "re2_ch2_function_structure_inverter", chapter: 2, lesson: 5,
    content_title: "Funktionsstruktur: Wechselrichter",
    narration_group: "function_structure",
    narration_start: "Im Falle des Wechselrichters",
  }),
  entry(17, 17, 18, 18, {
    content_title: "ABC-Analyse: Bewertungskriterien",
    narration_group: "abc_analysis",
    narration_end: "Auf diese Weise erhält man",
  }),
  entry(19, 19, 19, 19, {
    scene_id: "re2_ch2_abc_application", chapter: 2, lesson: 6,
    content_title: "ABC-Analyse: Ergebnisübersicht",
    narration_group: "abc_analysis",
    narration_start: "Auf diese Weise erhält man",
  }),
  entry(20, 20, 22, 22), entry(23, 23, 23, 23), entry(24, 24, 27, 26), entry(28, 28, 31, 30),
  entry(32, 32, 35, 34),
  entry(36, 36, 37, 37, {
    content_title: "Fehlerbaum erstellen: Logische Gatter",
    narration_group: "fta_tree_build",
    narration_end: "Schauen wir uns hierzu nochmals das vorherige Beispiel an.",
  }),
  entry(38, 38, 43, 43, {
    scene_id: "re2_ch3_fta_tree_build", chapter: 3, lesson: 3,
    content_title: "Fehlerbaum erstellen: Ereignisse verknüpfen",
    narration_group: "fta_tree_build",
    narration_start: "Schauen wir uns hierzu nochmals das vorherige Beispiel an.",
    narration_end: "Gehen wir die Fehlerhierarchie von oben nach unten",
  }),
  entry(44, 44, 48, 47, {
    scene_id: "re2_ch3_fta_event_symbols", chapter: 3, lesson: 3,
    content_title: "Fehlerbaum erstellen: Ereignissymbole",
    render_variant: "event_symbols_overview",
    narration_group: "fta_tree_build",
    narration_start: "Gehen wir die Fehlerhierarchie von oben nach unten",
  }),
  entry(49, 49, 50, 50, {
    content_title: "Qualitative Bewertung: Kritische Pfade",
    narration_group: "fta_qualitative",
    narration_end: "Die beiden Ausfall-Ereignisse können wir als minimale Ausfallschnitte verstehen.",
  }),
  entry(51, 51, 51, 51, {
    scene_id: "re2_ch3_fta_minimal_cut_sets", chapter: 3, lesson: 3,
    content_title: "Qualitative Bewertung: Minimale Ausfallschnitte",
    narration_group: "fta_qualitative",
    narration_start: "Die beiden Ausfall-Ereignisse können wir als minimale Ausfallschnitte verstehen.",
  }),
  entry(52, 52, 56, 56), entry(57, 57, 57, 57),
  entry(58, 58, 58, 58, {
    content_title: "Beispiel Krankenhaus: Versorgungssystem",
    narration_group: "hospital_power",
    narration_end: "Schauen wir hierfür mal den Fehlerbaum an.",
  }),
  entry(60, 59, 60, 60, {
    scene_id: "re2_ch3_fta_hospital_common_mode", chapter: 3, lesson: 4,
    content_title: "Beispiel Krankenhaus: Common Mode",
    narration_group: "hospital_power",
    narration_start: "Schauen wir hierfür mal den Fehlerbaum an.",
    narration_end: "Zusätzlich können wir den Fehlerbaum unseres Stromnetzwerks",
  }),
  entry(61, 61, 62, 62, {
    scene_id: "re2_ch3_fta_hospital_common_cause", chapter: 3, lesson: 4,
    content_title: "Beispiel Krankenhaus: Common Cause",
    narration_group: "hospital_power",
    narration_start: "Zusätzlich können wir den Fehlerbaum unseres Stromnetzwerks",
  }),
  entry(63, 63, 65, 65), entry(66, 66, 66, 66), entry(67, 67, 67, 67), entry(68, 68, 70, 70),
  entry(71, 71, 71, 71),
  entry(72, 72, 73, 73, {
    content_title: "1. Schritt: Planung und Vorbereitung",
    narration_group: "fmea_planning",
    narration_end: "In dieser Phase legen wir die Grundlagen",
  }),
  entry(74, 74, 74, 74, {
    scene_id: "re2_ch4_step1_scope_documents", chapter: 4, lesson: 2,
    content_title: "Planung und Vorbereitung: Analyseumfang",
    render_variant: "planning_scope_documents",
    narration_group: "fmea_planning",
    narration_start: "In dieser Phase legen wir die Grundlagen",
    narration_end: "Werfen wir einen genaueren Blick auf die Teamzusammensetzung.",
  }),
  entry(75, 75, 77, 75, {
    scene_id: "re2_ch4_step1_team", chapter: 4, lesson: 2,
    content_title: "Planung und Vorbereitung: Team",
    narration_group: "fmea_planning",
    narration_start: "Werfen wir einen genaueren Blick auf die Teamzusammensetzung.",
    narration_end: "Damit haben wir den ersten Schritt der FME-A abgeschlossen.",
  }),
  entry(78, 78, 78, 78, {
    content_title: "2. Schritt: Strukturanalyse",
    narration_group: "fmea_planning",
    narration_start: "Damit haben wir den ersten Schritt der FME-A abgeschlossen.",
  }),
  entry(79, 79, 82, 81), entry(83, 83, 85, 85),
  entry(86, 86, 87, 87, {
    content_title: "Anpassungsgetriebe: Zeichnung und Stückliste",
    render_variant: "gearbox_source_basis",
    narration_group: "gearbox_structure",
    narration_end: "Diese Aufteilung hilft uns jetzt",
  }),
  entry(88, 88, 89, 89, {
    scene_id: "re2_ch4_gearbox_hierarchy", chapter: 4, lesson: 3,
    content_title: "Anpassungsgetriebe: Systemstruktur",
    render_variant: "gearbox_hierarchy_combined",
    narration_group: "gearbox_structure",
    narration_start: "Diese Aufteilung hilft uns jetzt",
  }),
  entry(90, 90, 90, 90),
  entry(91, 91, 94, 92, {
    content_title: "Funktionsanalyse: Zwei Methoden",
    render_variant: "function_methods",
    narration_group: "function_analysis",
    narration_end: "Schauen wir uns das Ganze anhand unseres Beispiels",
  }),
  entry(95, 95, 95, 95, {
    scene_id: "re2_ch4_function_analysis_example", chapter: 4, lesson: 4,
    content_title: "Funktionsanalyse: Beispiel Anpassungsgetriebe",
    narration_group: "function_analysis",
    narration_start: "Schauen wir uns das Ganze anhand unseres Beispiels",
  }),
  entry(96, 96, 96, 96),
  entry(97, 97, 100, 99, {
    content_title: "Fehleranalyse: Funktion negieren",
    narration_group: "failure_analysis",
    narration_end: "Werfen wir dazu einen Blick auf unsere Systemstruktur.",
  }),
  entry(101, 101, 103, 103, {
    scene_id: "re2_ch4_failure_structure", chapter: 4, lesson: 5,
    content_title: "Fehleranalyse: Fehlerstruktur",
    narration_group: "failure_analysis",
    narration_start: "Werfen wir dazu einen Blick auf unsere Systemstruktur.",
  }),
  entry(104, 104, 105, 105, {
    content_title: "Fehlerzusammenhänge: Reifenbeispiel",
    narration_group: "failure_links",
    narration_end: "Werfen wir nun einen Blick darauf, wie Fehler",
  }),
  entry(106, 106, 108, 108, {
    scene_id: "re2_ch4_failure_links_levels", chapter: 4, lesson: 5,
    content_title: "Fehlerzusammenhänge: Systemebenen",
    narration_group: "failure_links",
    narration_start: "Werfen wir nun einen Blick darauf, wie Fehler",
    narration_end: "Die Fehlfunktion eines Bauteils ist oft einfach die physikalische Ausfallart.",
  }),
  entry(109, 109, 109, 109, {
    scene_id: "re2_ch4_failure_mode_catalog", chapter: 4, lesson: 5,
    content_title: "Fehlerzusammenhänge: Ausfallarten und Ursachen",
    narration_group: "failure_links",
    narration_start: "Die Fehlfunktion eines Bauteils ist oft einfach die physikalische Ausfallart.",
  }),
  entry(110, 110, 110, 110), entry(111, 111, 111, 111),
  entry(112, 112, 117, 117, {
    content_title: "Risikoanalyse: Bedeutung, Auftreten, Entdeckung",
    narration_group: "risk_analysis",
    narration_end: "Für die systematische Bewertung dieser drei Größen",
  }),
  entry(118, 118, 118, 118, {
    scene_id: "re2_ch4_risk_rating_criteria", chapter: 4, lesson: 6,
    content_title: "Risikoanalyse: Bewertungskriterien",
    narration_group: "risk_analysis",
    narration_start: "Für die systematische Bewertung dieser drei Größen",
  }),
  entry(119, 119, 121, 121, {
    content_title: "Risikobewertung: RPZ",
    narration_group: "risk_priority",
    narration_end: "Die Aufgabenpriorität kategorisiert Risiken",
  }),
  entry(122, 122, 126, 122, {
    scene_id: "re2_ch4_action_priority", chapter: 4, lesson: 6,
    content_title: "Risikobewertung: Aufgabenpriorität",
    render_variant: "priority_actions_combined",
    narration_group: "risk_priority",
    narration_start: "Die Aufgabenpriorität kategorisiert Risiken",
  }),
  entry(127, 127, 127, 127), entry(128, 128, 130, 129), entry(131, 131, 131, 131),
  entry(132, 132, 136, 136, {
    content_title: "Ergebnisdokumentation: FMEA-Formblatt",
    narration_group: "documentation",
    narration_end: "Die Ergebnisdokumentation fasst somit alle Erkenntnisse",
  }),
  entry(137, 137, 138, 137, {
    scene_id: "re2_ch4_documentation_goals", chapter: 4, lesson: 8,
    content_title: "Ergebnisdokumentation: Ziele und Nutzen",
    narration_group: "documentation",
    narration_start: "Die Ergebnisdokumentation fasst somit alle Erkenntnisse",
  }),
  entry(139, 139, 142, 142),
  entry(143, 143, 146, 146, { render_variant: "comparison_structure_pair" }),
  entry(147, 147, 152, 150, { render_variant: "comparison_function_pair" }),
  entry(153, 153, 154, 154, {
    content_title: "Design- und Prozess-FMEA: Fehlerstrukturen",
    render_variant: "comparison_error_pair",
    narration_group: "fmea_error_comparison",
    narration_end: "Die Design-FME-A fokussiert sich auf mögliche Fehler im Produktdesign",
  }),
  entry(155, 155, 155, 155, {
    scene_id: "re2_ch4_design_process_error_comparison", chapter: 4, lesson: 9,
    content_title: "Design- und Prozess-FMEA: Fehleranalyse im Vergleich",
    narration_group: "fmea_error_comparison",
    narration_start: "Die Design-FME-A fokussiert sich auf mögliche Fehler im Produktdesign",
  }),
  entry(156, 156, 159, 159), entry(160, 160, 162, 162), entry(163, 163, 165, 165),
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

function speakerSegment(text, startMarker, endMarker, label) {
  let start = 0;
  let end = text.length;
  if (startMarker) {
    start = text.indexOf(startMarker);
    if (start < 0) throw new Error(`Missing narration start marker in ${label}: ${startMarker}`);
  }
  if (endMarker) {
    end = text.indexOf(endMarker, start);
    if (end < 0) throw new Error(`Missing narration end marker in ${label}: ${endMarker}`);
  }
  if (end <= start) throw new Error(`Invalid narration range in ${label}.`);
  return text.slice(start, end).trim();
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

const mappings = specs.map((spec) => {
  const previous = oldBySlide.get(spec.output);
  if (!previous && (!spec.scene_id || !spec.chapter || !spec.lesson)) {
    throw new Error(`Missing identity metadata for new work unit slide_${String(spec.output).padStart(3, "0")}.`);
  }
  const sources = range(spec.start, spec.end);
  return {
    work_unit: `slide_${String(spec.output).padStart(3, "0")}`,
    scene_id: spec.scene_id || previous.scene_id,
    chapter: spec.chapter || previous.chapter,
    lesson: spec.lesson || previous.lesson,
    output_slide_number: spec.output,
    source_slides: sources,
    primary_source_slide: spec.render,
    render_source_slide: spec.render,
    ...(spec.render_variant ? { render_variant: spec.render_variant } : {}),
    ...(spec.content_title ? { content_title_override: spec.content_title } : {}),
    mapping_type: sources.length === 1 ? "direct" : "merged_sequence",
    rationale: sources.length === 1
      ? "Eigenständige didaktische Szene."
      : `Quellfolien ${spec.start}–${spec.end} bilden den vollständigen Aufbauzustand einer didaktischen Szene.`,
  };
});

const assignedSources = mappings.flatMap((mapping) => mapping.source_slides);
const expectedSources = range(1, inventory.mappings.length);
if (assignedSources.length !== expectedSources.length || assignedSources.some((slide, index) => slide !== expectedSources[index])) {
  throw new Error("RE2 source assignment must cover slides 1–165 exactly once and in sequence.");
}

const spokenByOutput = new Map();
for (const spec of specs) {
  const fullText = uniqueSpokenText(range(spec.start, spec.end));
  spokenByOutput.set(spec.output, speakerSegment(fullText, spec.narration_start, spec.narration_end, `slide_${spec.output}`));
}

for (const groupName of unique(specs.map((spec) => spec.narration_group))) {
  const groupSpecs = specs.filter((spec) => spec.narration_group === groupName);
  const original = uniqueSpokenText(range(groupSpecs[0].start, groupSpecs.at(-1).end));
  const rebuilt = groupSpecs.map((spec) => spokenByOutput.get(spec.output)).join(" ");
  const normalize = (value) => value.replace(/\s+/g, "");
  if (normalize(rebuilt) !== normalize(original)) {
    throw new Error(`Narration split is not lossless for ${groupName}.`);
  }
}

const sourceReferenceMap = {
  schema_version: "basisRebuildSourceReferenceMap/v1",
  module_id: "RE2",
  sequence_plan: "analysis/rebuild-plans/RE2_sequence_plan.md",
  updated_at: "2026-08-27",
  planning_status: "technical_completeness_repair_69_scenes",
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
  updated_at: "2026-08-27",
  target_mode: "full_slide",
  canvas: { width: 1920, height: 1080 },
  scene_count: mappings.length,
  source_state_count: inventory.mappings.length,
  qa: { issues: [], warnings: [], open_questions: [] },
  scenes: mappings.map((mapping, index) => {
    const primary = sourceBySlide.get(mapping.primary_source_slide);
    const spokenText = spokenByOutput.get(mapping.output_slide_number);
    return {
      scene_id: mapping.scene_id,
      work_unit: mapping.work_unit,
      output_slide_number: index + 1,
      sequence_group_id: `re2_group_${String(index + 1).padStart(3, "0")}`,
      mode: mapping.source_slides.length === 1 ? "standalone" : "build_sequence",
      chapter: mapping.chapter,
      lesson: mapping.lesson,
      source_slides: mapping.source_slides,
      primary_source_slide: mapping.primary_source_slide,
      mapping_type: mapping.mapping_type,
      text_mapping_refs: sourceTextRefs(mapping.source_slides),
      spoken_text_sources: spokenTextSources(mapping.source_slides),
      source_text_title: primary?.source_text_title || "",
      content_title: mapping.content_title_override || primary?.source_text_title || "",
      spoken_text: spokenText,
      source_text_trigger: firstWords(spokenText),
      target_svg: `rebuild-proposals/svg/RE2/${mapping.work_unit}/${mapping.work_unit}.svg`,
      internal_manifest: `rebuild-proposals/svg/RE2/${mapping.work_unit}/scene.animation.v1.json`,
      element_animation_plan: `rebuild-proposals/svg/RE2/${mapping.work_unit}/element-animation-plan.json`,
      animation_dramaturgy_plan: `rebuild-proposals/svg/RE2/${mapping.work_unit}/animation-dramaturgy-plan.json`,
      final_svg_basename: `${mapping.scene_id}.svg`,
      final_manifest_basename: `${mapping.scene_id}.animation.v1.json`,
      remove_powerpoint_speaker: true,
      animation_plan: {
        decision: "needs_review",
        rationale: "Wird nach der SVG-Produktion aus dem geprüften internen Manifest abgeleitet.",
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
