"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { SCENES, SOURCE_STATE_COUNT, REFERENCE_LOCK } = require("./re5-redesign-spec");

const root = path.resolve(__dirname, "..");
const mappingPath = path.join(root, "analysis", "inventories", "RE5_svg-text-map.json");
const inventoryPath = path.join(root, "analysis", "inventories", "RE5_source-svg-inventory.json");
const outputRoot = path.join(root, "analysis", "rebuild-plans");
const mapping = JSON.parse(fs.readFileSync(mappingPath, "utf8"));
const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));

const BUILDER_PLANS = Object.freeze({
  reliability_management: ["management_phases", "phase_two_tests", "phase_three_tests"],
  test_objectives: ["risk_identification", "reliability_measurement", "reliability_proof"],
  development_timeline: ["development_axis", "qualitative_window", "quantitative_window", "proof_window"],
  dual_planning: ["technical_planning", "statistical_planning", "shared_outcome"],
  strategy_dimensions: ["test_type", "censoring_type", "acceleration_type"],
  strategy_tree: ["strategy_root", "end_of_life_branch", "success_run_branch", "test_configuration"],
  proof_definition: [],
  confidence_recap: ["sample_context", "plot_fit", "plot_confidence_limits"],
  proof_acceptance: ["requirement_parameters", "plot_target_point", "plot_confidence_limits", "acceptance_result"],
  proof_alternatives: ["proof_gap", "lower_reliability", "shorter_lifetime", "lower_confidence"],
  success_run_problem: ["success_run_requirement", "zero_failures", "missing_weibull", "proof_question"],
  success_run_derivation: ["specimen_group", "group_survival_formula", "alpha_formula", "success_run_formula"],
  sample_size_example: ["requirement_block", "sample_size_formula", "substitution", "sample_size_result"],
  sample_size_table: ["lookup_table", "example_90_90", "example_95_90", "example_95_95", "example_99_95"],
  success_run_curves: ["plot_curves", "plot_target_95", "plot_target_90", "zero_failure_note"],
  duration_ratio_intro: [],
  duration_weibull_relation: ["plot_curve", "duration_markers", "survival_ratio_formula", "shape_parameter"],
  duration_adjusted_success_run: ["adjusted_formula", "longer_test", "shorter_test", "shape_warning"],
  end_of_life: ["test_to_failure", "weibull_evaluation", "proof_result", "long_lifetime_example"],
  acceleration_principle: ["field_condition", "test_condition", "damage_relation", "benefits"],
  acceleration_methods: ["time_compression", "stress_increase", "censoring"],
  degradation_paths: ["plot_degradation_paths", "plot_eol_threshold", "plot_lifetime_estimates", "lifetime_distribution"],
  acceleration_factor: ["field_distribution", "test_distribution", "acceleration_factor_formula", "transferability_guardrail"],
  load_life_models: ["plot_load_life", "model_catalog", "model_guardrail"],
  alt_questions: ["plot_test_levels", "question_level_count", "question_level_location", "question_allocation", "question_total"],
  number_of_levels: ["plot_linear_levels", "plot_third_level", "linearity_rule"],
  upper_test_level: ["plot_upper_level", "mechanism_limit", "pretest_note"],
  lower_test_level: ["plot_lower_level", "field_proximity", "runtime_proximity", "recommended_factor"],
  sample_allocation: ["plot_levels", "extrapolation_formula", "allocation_formula", "allocation_rule"],
  allocation_example: ["example_inputs", "extrapolation_example", "allocation_example", "allocation_result"],
  total_sample_size: ["plot_simulation_runs", "plot_precision_envelope", "sample_balance"],
  strategy_comparison: ["success_run_column", "end_of_life_column", "accelerated_life_column", "degradation_column"],
  strategy_guideline: ["design_gate", "wear_gate", "acceleration_gate", "strategy_outcomes", "universal_guardrail"],
});

const PLOT_DETAILS = Object.freeze({
  weibull_confidence: "Kanonischer Python-Weibull-Plot mit Fit, offenen Datenpunkten und zwei nicht parallelen Vertrauensgrenzen; lokaler Daten- und Rendersnapshot.",
  weibull_probability: "Python-Weibull-Wahrscheinlichkeitsnetz mit gemeinsamem Achsenvertrag und zwei Zeitmarken.",
  success_run_curves: "Neuer registrierter Python-Plot für R(t)=(1-P_A)^(1/n) mit drei Aussagesicherheiten.",
  degradation_paths: "Neuer registrierter Python-Plot für mehrere Degradationspfade, End-of-Life-Grenze und extrapolierte Lebensdauerenden.",
  acceleration_factor: "Neuer registrierter Python-Plot mit parallelen Feld-/Versuchs-Weibullzuständen und explizitem Raffungsabstand.",
  load_life_correlation: "Neuer registrierter Python-Plot für Last-Lebensdauer-Korrelation und vier Lasthorizonte.",
  test_level_overview: "Neuer registrierter Python-Plot als konsistenter Ausgangszustand für Feld-, obere und untere Versuchsniveaus.",
  number_of_levels: "Neuer registrierter Python-Plot für linearen Zwei-Niveau-Fit und optionales drittes Niveau.",
  upper_test_level: "Neuer registrierter Python-Plot mit technisch maximaler Raffungsgrenze.",
  lower_test_level: "Neuer registrierter Python-Plot mit Prognose-/Laufzeit-Trade-off und Streuungsfenstern.",
  sample_allocation: "Neuer registrierter Python-Plot mit Feld-, oberem und unterem Niveau sowie Extrapolationsabstand.",
  monte_carlo_precision: "Neuer registrierter Python-Plot mit reproduzierbarer Simulation der Prognoseunsicherheit über n.",
});

function markdown(value) {
  return String(value ?? "").replaceAll("|", "\\|").replace(/\s+/g, " ").trim();
}

function paragraphs(text) {
  return String(text || "").split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean);
}

function sourceMapping(sectionId) {
  const found = mapping.mappings.find((entry) => entry.source_text_section_id === sectionId);
  if (!found) throw new Error(`Sprechertextabschnitt fehlt: ${sectionId}`);
  return found;
}

function narrationForScene(scene) {
  const full = sourceMapping(scene.source_text_section_id).spoken_text.trim();
  if (scene.narration.paragraphs) {
    const [start, end] = scene.narration.paragraphs;
    const selected = paragraphs(full).slice(start - 1, end);
    if (selected.length !== end - start + 1) throw new Error(`Ungültiger Absatzbereich für ${scene.work_unit}`);
    return selected.join("\n\n");
  }
  const startIndex = full.indexOf(scene.narration.start_phrase);
  const endIndex = full.indexOf(scene.narration.end_phrase, startIndex);
  if (startIndex < 0 || endIndex < 0) throw new Error(`Sprechertext-Slice nicht gefunden: ${scene.work_unit}`);
  return full.slice(startIndex, endIndex + scene.narration.end_phrase.length).trim();
}

function scenePlan(scene, index) {
  const spokenText = narrationForScene(scene);
  const targets = BUILDER_PLANS[scene.builder];
  if (!targets) throw new Error(`Builder-Plan fehlt: ${scene.builder}`);
  return {
    ...scene,
    narration: undefined,
    spoken_text: spokenText,
    spoken_text_source: `${sourceMapping(scene.source_text_section_id).extracted_markdown}#${scene.source_text_section_id}`,
    order: index + 1,
    structure_status: "mapped_from_user_chapter_and_lesson_ranges",
    canonical_source_ref: `RE5::${scene.primary_source_slide}`,
    absorbed_source_states: scene.source_slides.filter((slide) => slide !== scene.output_slide_number),
    target_svg: `rebuild-proposals/svg/RE5/${scene.work_unit}/${scene.work_unit}.svg`,
    internal_animation_manifest: `rebuild-proposals/svg/RE5/${scene.work_unit}/scene.animation.v1.json`,
    animation_plan: {
      decision: scene.animation_decision,
      rationale: scene.animation_decision === "animated"
        ? "Der Sprechertext führt fachliche Gruppen nacheinander ein; der Endzustand bleibt statisch vollständig verständlich."
        : "Die Szene ist als ruhiger Orientierungspunkt vollständig sichtbar; ein Einzel-Reveal hätte keinen zusätzlichen Lernwert.",
      public_targets: scene.animation_decision === "animated" ? targets : [],
      semantic_groups: scene.animation_decision === "animated" ? targets : [],
      steps: [],
    },
  };
}

const scenes = SCENES.map(scenePlan);
const coverage = new Map();
for (const scene of scenes) {
  for (const slide of scene.source_slides) {
    if (coverage.has(slide)) throw new Error(`Quellfolie ${slide} doppelt zugeordnet.`);
    coverage.set(slide, scene.work_unit);
  }
}
for (let slide = 1; slide <= SOURCE_STATE_COUNT; slide += 1) {
  if (!coverage.has(slide)) throw new Error(`Quellfolie ${slide} fehlt im Szenenplan.`);
}

const scenePlanJson = {
  schema_version: "basisRebuildScenePlan/v2",
  module_id: "RE5",
  source_state_count: SOURCE_STATE_COUNT,
  target_scene_count: scenes.length,
  removed_source_slides: [],
  sequence_decision: "75 PowerPoint-Aufbauzustände werden zu 33 fachlich vollständigen, narrationssynchronen Szenen konsolidiert.",
  structure_status: "Kapitel 1-3 und Lektionen gemäß Nutzervorgabe vom 21.08.2026.",
  reference_lock: {
    named_reference: "Aktuelle RelTest-Education-CI des bereits redesigneten Moduls RE4",
    approved_targets: REFERENCE_LOCK,
    inherited_artifact_scope: "full-slide",
    inherited_embedding_target: "standalone-slide",
    downstream_owned_master_elements: ["visible_title", "title_rule", "footer", "logo", "scene_id"],
    token_source: "brand/reltest-education-slide-design-tokens.json",
  },
  scenes,
};

const referenceMap = {
  schema_version: "basisReSourceReferenceMap/v1",
  module_id: "RE5",
  generated_from: [
    "analysis/inventories/RE5_svg-text-map.json",
    "analysis/inventories/RE5_source-svg-inventory.json",
    "tools/re5-redesign-spec.js",
  ],
  source_state_count: SOURCE_STATE_COUNT,
  active_scene_count: scenes.length,
  removed_source_slides: [],
  reference_lock: scenePlanJson.reference_lock,
  mappings: scenes.map((scene) => ({
    output_slide_number: scene.output_slide_number,
    work_unit: scene.work_unit,
    scene_id: scene.scene_id,
    source_slides: scene.source_slides,
    primary_source_slide: scene.primary_source_slide,
    mapping_type: scene.source_slides.length > 1 ? "merged" : "direct",
    rationale: scene.source_slides.length > 1
      ? "Aufbau-, Reveal- oder fachlich zusammengehörige Quellzustände werden in einem vollständigen Zielzustand mit semantischen Animationsebenen erhalten."
      : "Eigenständiger Quellzustand wird als eigene Zielszene transformiert.",
    chapter: scene.chapter,
    lesson: scene.lesson,
    title: scene.title,
  })),
};

const sourceByNumber = new Map(inventory.slides.map((slide) => [slide.source_slide_number, slide]));
const lines = [];
lines.push("# RE5 Sequenz- und Redesignplan", "");
lines.push("## Modul", "");
lines.push("- module_id: RE5");
lines.push("- external_module_id: re5-lebensdauertestplanung-und-zuverlaessigkeitsnachweis");
lines.push("- source_svg_dir: source-materials/basis-seminar/powerpoint-svg/RE5/SVG/");
lines.push("- svg_text_map: analysis/inventories/RE5_svg-text-map.json");
lines.push("- source_svg_inventory: analysis/inventories/RE5_source-svg-inventory.json");
lines.push("- source_reference_map: analysis/rebuild-plans/RE5_source-reference-map.json");
lines.push(`- source_states: ${SOURCE_STATE_COUNT}`);
lines.push(`- target_scenes: ${scenes.length}`);
lines.push("- planning_status: approved_for_scene_by_scene_production");
lines.push("");
lines.push("## Design Reference Lock", "");
lines.push("- Benanntes Referenzsystem: aktuelle RelTest-Education-CI aus RE4.");
lines.push(`- Konkrete Ziel-SVGs: ${REFERENCE_LOCK.map((value) => `\`${value}\``).join(", ")}.`);
lines.push("- Artefaktmodus: `full-slide`, 1920×1080, Brandhintergrund im SVG; sichtbarer Titel, Titelregel, Footer, Logo und Szenenkennung bleiben downstream-owned.");
lines.push("- Übernahme: Archivo/Oxanium-Hierarchie, Navy-Grundordnung, Signalgrün nur als Fokus, 2,5-px-Normstrich, 4-px-Betonung, ruhige Kartenradien und großzügiger Weißraum.");
lines.push("- Bewusste Abweichung: Formelassets werden als lokale pfadbasierte SVGs eingebettet; die in RE4::39 beobachtete defekte Direktdatei-Einbettung wird nicht reproduziert.");
lines.push("");
lines.push("## Source Sweep", "");
lines.push("| source_slide | source_svg | text_mapping_ref | source_state_summary | sequence_role | new_since_previous | removed_or_changed | reusable_source_nodes | id_or_reference_risks | builds_on | prepares_later_state | animation_candidates | transition_need | key_assets | spoken_text_anchor | risks_or_questions |");
lines.push("|---:|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
for (const slide of inventory.slides) {
  const owner = coverage.get(slide.source_slide_number);
  const mapped = mapping.mappings.find((entry) => entry.source_slide_number === slide.source_slide_number);
  const targetScene = scenes.find((scene) => scene.work_unit === owner);
  const features = slide.features || {};
  const assets = [
    features.image_count ? `${features.image_count} Bildknoten` : "",
    features.path_count ? `${features.path_count} Pfade` : "",
    slide.visible_text?.some((value) => /R\s*\(|ln|Weibull|𝑅|𝑃|𝜉|Formparameter/i.test(value)) ? "Formel/Plot" : "",
  ].filter(Boolean).join(", ") || "Text/Native SVG";
  lines.push(`| ${slide.source_slide_number} | ${markdown(slide.source_svg)} | ${markdown(mapped.source_text_section_id)} | ${markdown(slide.visible_content_summary)} | ${slide.sequence_role} → ${owner} | ${markdown(slide.state_delta.added.slice(0, 5).join("; ")) || "–"} | ${markdown(slide.state_delta.removed.slice(0, 4).join("; ")) || "–"} | Text, Geometrie und Zustandsbeziehungen als Inhaltsanker | PowerPoint-IDs werden nicht übernommen; lokale Referenzen werden neu erzeugt | ${slide.source_slide_number > targetScene.source_slides[0] ? targetScene.source_slides[0] : "–"} | ${slide.source_slide_number < targetScene.source_slides.at(-1) ? targetScene.source_slides.at(-1) : "–"} | ${targetScene.animation_decision === "animated" ? markdown(BUILDER_PLANS[targetScene.builder].join(", ")) : "keine"} | ${targetScene.source_slides.length > 1 ? "show/draw/highlight" : "cut"} | ${markdown(assets)} | ${markdown(mapped.source_text_title)} | ${features.has_external_references ? "externe Referenz portabel ersetzen" : "keine Blockade"} |`);
}

lines.push("", "## Content Equivalence", "");
lines.push("| source_slide_or_group | must_preserve_content | can_repackage_or_redesign | information_density_target | spoken_text_fit_risk |");
lines.push("|---|---|---|---|---|");
for (const scene of scenes) {
  lines.push(`| ${scene.source_slides.join(", ")} → ${scene.work_unit} | Begriffe, Zahlen, Formeln, Plotbeziehungen, Richtungen, Kategorien und fachliche Zustände aller Quellen | PowerPoint-Titel, Lautsprecher, Exportstil und dekorative Mini-Icons; Text darf als gleichwertige Grafik getragen werden | same_as_source_or_compact_but_equivalent | ${scene.spoken_text.length > 1200 ? "high" : scene.spoken_text.length > 650 ? "medium" : "low"} |`);
}

lines.push("", "## Planned SVG Work Units", "");
lines.push("| order | work_unit | Scene_ID | source_slides | primary | chapter/lesson | archetype | visual_build_plan | asset_or_plot_strategy | semantic_layer_ids | animation_decision | qa_focus |");
lines.push("|---:|---|---|---|---:|---|---|---|---|---|---|---|");
for (const scene of scenes) {
  const plot = scene.plot_strategy === "none" ? "native_svg" : `${scene.plot_strategy}: ${PLOT_DETAILS[scene.plot_strategy]}`;
  const formulas = scene.formula_strategy.length ? `; formula_svg: ${scene.formula_strategy.join(", ")}` : "";
  lines.push(`| ${scene.order} | ${scene.work_unit} | ${scene.scene_id} | ${scene.source_slides.join(", ")} | ${scene.primary_source_slide} | ${scene.chapter}/${scene.lesson} | ${scene.archetype} | Full-slide-Komposition innerhalb x=92–1828, y=190–930; fachliche Gruppen aus Quelle und Sprechertext; keine sichtbaren Masterelemente | ${markdown(plot + formulas)} | ${scene.animation_plan.public_targets.join(", ") || "–"} | ${scene.animation_decision} | Inhalt in beide Richtungen, 1920×1080 und 960×540, Kontrast, Textfit, Plot-/Formelgeometrie, Initial-/Endzustand |`);
}

lines.push("", "## Scene Spoken Text And Trigger Plan", "");
lines.push("Jede Szene verwendet einen wortgetreuen, zusammenhängenden Ausschnitt des gelieferten DOCX-Sprechertexts. Die endgültigen `sourceText`-Phrasen werden erst beim szenenweisen Animationsbrief aus diesen Texten gewählt.", "");
lines.push("| Scene_ID | source_slides | source_text_section | characters | animation_decision | approval_status |");
lines.push("|---|---|---|---:|---|---|");
for (const scene of scenes) lines.push(`| ${scene.scene_id} | ${scene.source_slides.join(", ")} | ${scene.source_text_section_id} | ${scene.spoken_text.length} | ${scene.animation_decision} | approved_source_slice |`);

lines.push("", "## Visual Asset And Plot Plan", "");
lines.push("| work_unit | visual_element | semantic_role | planned_strategy | generator_or_source | planned_target_path | animation_need | open_question |");
lines.push("|---|---|---|---|---|---|---|---|");
for (const scene of scenes) {
  if (scene.plot_strategy !== "none") {
    const existing = ["weibull_confidence", "weibull_probability"].includes(scene.plot_strategy);
    lines.push(`| ${scene.work_unit} | ${scene.plot_strategy} | technischer Geometrieanker | ${existing ? "python_plot_library" : "new_python_plot_generator"} | ${existing ? `components/python-plot-library/${scene.plot_strategy}_plot.py` : "components/python-plot-library/re5_test_planning_plots.py"} | rebuild-proposals/svg/RE5/${scene.work_unit}/plots/${scene.plot_strategy}.svg und data/${scene.plot_strategy}.json | ${scene.animation_decision === "animated" ? "fachliche Plotgruppen" : "none"} | – |`);
  }
  for (const formula of scene.formula_strategy) {
    lines.push(`| ${scene.work_unit} | ${formula} | mathematischer Beleg oder Rechenschritt | formula_svg | components/formula-library/render_formula_svg.py | rebuild-proposals/svg/RE5/${scene.work_unit}/formulas/${formula}.svg | ${scene.animation_decision === "animated" ? "show als atomare Formelgruppe" : "none"} | – |`);
  }
  if (scene.plot_strategy === "none" && scene.formula_strategy.length === 0) {
    lines.push(`| ${scene.work_unit} | ${scene.archetype} | fachliche Struktur | native_svg | Quelle ${scene.source_slides.join(", ")} und Sprechertext | rebuild-proposals/svg/RE5/${scene.work_unit}/${scene.work_unit}.svg | ${scene.animation_decision === "animated" ? "semantische Gruppen" : "none"} | – |`);
  }
}
lines.push("| slide_041 | Wechselrichterfoto aus Quelle 43 | konkretes Beispiel langlebiges Produkt | omit_with_reason | Identität bleibt als Text ‚Wechselrichter für Solaranlagen · >20 Jahre‘ vollständig erhalten; kein zusätzliches Bild nötig | – | none | – |");
lines.push("| slide_002 / slide_044 | kleine Quellpiktogramme/Fahrzeuge | dekorative Orientierung | omit_with_reason | Semantik wird durch klare Text- und Beziehungsgeometrie getragen; keine neuen Piktogramme nötig | – | none | – |");

lines.push("", "## Production Order", "");
lines.push("| order | work_unit | source_slides | archetype | archetype_pilot | expected_output | static_render_gate | qa_focus |");
lines.push("|---:|---|---|---|---|---|---|---|");
const seenArchetypes = new Set();
for (const scene of scenes) {
  const pilot = !seenArchetypes.has(scene.archetype);
  seenArchetypes.add(scene.archetype);
  lines.push(`| ${scene.order} | ${scene.work_unit} | ${scene.source_slides.join(", ")} | ${scene.archetype} | ${pilot ? "yes" : "no"} | SVG + Redesign-Brief + Animationsmanifest${scene.plot_strategy !== "none" ? " + lokaler Python-Plot" : ""}${scene.formula_strategy.length ? " + Formelassets" : ""} | open bis Zielrender und Inhaltscrosscheck | ${scene.plot_strategy !== "none" ? "Plotlesbarkeit, Daten-/Achsenlogik" : "Textfit, Blickführung, Beziehungen"} |`);
}

lines.push("", "## Checks Before SVG Production", "");
lines.push("- [x] SVG-Text-Mapping 75/75 ist vollständig und hashgesichert.");
lines.push("- [x] Source-SVG-Inventar 75/75 liegt vor; alle Quellen sind parsebar.");
lines.push("- [x] Jede Quell-SVG besitzt genau eine Source-Sweep-Zeile und genau eine Zielzuordnung.");
lines.push("- [x] Referenz-Lock nennt vier konkret gerenderte freigegebene Ziel-SVGs.");
lines.push("- [x] Kapitel-/Lektionsstruktur entspricht der Nutzervorgabe.");
lines.push("- [x] Jede Zielszene besitzt stabilen Scene_ID, Quellreferenzen und wortgetreuen Sprechertextausschnitt.");
lines.push("- [x] Plot-, Formel-, native SVG- und Auslassungsstrategien sind vor der Produktion entschieden.");
lines.push("- [x] Sichtbare Titel, Footer, Logo, Titelregel und Szenenkennung sind als downstream-owned ausgeschlossen.");
lines.push("- [x] Produktion erfolgt szenenweise; erster Pilot ist slide_001.");
lines.push("- [ ] Pro Szene: statischer Zielrender 1920×1080 und 960×540, Quell-/Referenzvergleich, Inhaltscrosscheck und Re-QA.");
lines.push("- [ ] Erst nach statischer Freigabe: Animationsmanifest und Zustandsrender.");

const redesignBrief = `# RE5 Modul-Redesign-Brief\n\n` +
  `## Identität\n\n- Modul: RE5 · Lebensdauertestplanung und Zuverlässigkeitsnachweis\n- Umfang: module\n- Ausgabemodus: module_redesign mit full-slide Zielszenen\n- Zielsystem: Basis-RE-Seminar-Viewer und downstream PowerPoint/Storyboard\n- Zielauflösung: 1920×1080\n\n` +
  `## Lernbotschaft\n\nDie Lernenden wählen eine geeignete Lebensdauerteststrategie, planen Success Run und End-of-Life/ALT statistisch, verstehen den Zuverlässigkeitsnachweis im Weibulldiagramm und leiten Stichproben- sowie Versuchsniveaus nachvollziehbar ab.\n\n` +
  `## Referenz-Lock\n\n- Referenzen: ${REFERENCE_LOCK.join(", ")}\n- Übernommen: Navy-Grundordnung, weiße Fachflächen, 2,5-px-Strichsprache, sparsame grüne Fokussierung, 1920×1080 Brandframe.\n- Downstream-owned und daher nicht sichtbar im SVG: Folientitel, Titelakzent/-regel, Footer, Logo, Szenenkennung.\n- Keine neue Piktogrammproduktion: identitätstragender Inhalt lässt sich mit Diagrammen, Formeln, Text und Quellbeziehungen vollständig tragen.\n\n` +
  `## Statische Freigabe Vor Animation\n\nJede der ${scenes.length} Szenen wird einzeln erzeugt, gerendert und gegen Quelle sowie Referenz-Lock geprüft. Der erste Pilot ist slide_001. Animation folgt ausschließlich nach bestandenem statischen Gate.\n\n` +
  `## Qualitätsfokus\n\n- vollständige Inhaltsübernahme in beide Richtungen\n- plot-first für jedes echte Achsdiagramm\n- pfadbasierte Formel-SVGs für nicht triviale Mathematik\n- lesbar bei 960×540\n- keine unbelegten Kategorien oder Prozessbeziehungen\n- keine sichtbaren Masterelemente oder PowerPoint-Exportartefakte\n`;

fs.mkdirSync(outputRoot, { recursive: true });
fs.writeFileSync(path.join(outputRoot, "RE5_scene-plan.json"), `${JSON.stringify(scenePlanJson, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(outputRoot, "RE5_svg_rebuild_plan.json"), `${JSON.stringify(scenePlanJson, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(outputRoot, "RE5_source-reference-map.json"), `${JSON.stringify(referenceMap, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(outputRoot, "RE5_sequence_plan.md"), `${lines.join("\n")}\n`, "utf8");
fs.writeFileSync(path.join(outputRoot, "RE5_redesign_plan.md"), redesignBrief, "utf8");

process.stdout.write(`RE5 plan rebuilt: ${SOURCE_STATE_COUNT} source states -> ${scenes.length} scenes.\n`);
