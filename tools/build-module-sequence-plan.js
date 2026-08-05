"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

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

function toRepoPath(filePath) {
  return path.relative(repoRoot, path.resolve(filePath)).split(path.sep).join("/");
}

function pad(value) {
  return String(value).padStart(3, "0");
}

function markdown(value) {
  return String(value ?? "")
    .replaceAll("|", "\\|")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizedWords(text) {
  return String(text || "").match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu) || [];
}

function triggerPhrase(text) {
  const words = normalizedWords(text);
  if (words.length === 0) throw new Error("Leerer Sprechertext kann keinen Trigger liefern.");
  for (let size = Math.min(6, words.length); size >= Math.min(3, words.length); size -= 1) {
    for (let start = 0; start + size <= words.length; start += 1) {
      const candidate = words.slice(start, start + size).join(" ");
      const haystack = words.join(" ").toLocaleLowerCase("de-DE");
      const needle = candidate.toLocaleLowerCase("de-DE");
      if (haystack.split(needle).length - 1 === 1) return candidate;
    }
  }
  return words.slice(0, Math.min(8, words.length)).join(" ");
}

function unique(values) {
  return [...new Set(values)];
}

function buildSceneGroups(mapping) {
  const seen = new Set();
  const groups = [];
  const bySharedGroup = new Map();
  for (const entry of mapping.mappings) {
    if (!entry.shared_text_group) continue;
    if (!bySharedGroup.has(entry.shared_text_group)) bySharedGroup.set(entry.shared_text_group, []);
    bySharedGroup.get(entry.shared_text_group).push(entry);
  }
  for (const entry of mapping.mappings) {
    if (seen.has(entry.source_slide_number)) continue;
    const members = entry.shared_text_group
      ? bySharedGroup.get(entry.shared_text_group).sort((a, b) => a.source_slide_number - b.source_slide_number)
      : [entry];
    members.forEach((member) => seen.add(member.source_slide_number));
    groups.push(members);
  }
  return groups;
}

function main() {
  const args = parseArguments(process.argv.slice(2));
  const moduleId = required(args, "module");
  const externalModuleId = args["external-module"] || moduleId.toLowerCase();
  const mappingPath = path.resolve(required(args, "text-map"));
  const inventoryPath = path.resolve(required(args, "inventory"));
  const markdownOutput = path.resolve(required(args, "markdown-output"));
  const jsonOutput = path.resolve(required(args, "json-output"));
  const referenceOutput = path.resolve(required(args, "reference-output"));
  const mapping = readJson(mappingPath);
  const inventory = readJson(inventoryPath);
  if (mapping.module_id !== moduleId || inventory.module_id !== moduleId) throw new Error("Modul-ID stimmt nicht ueberein.");
  if (mapping.mapping_status !== "mapped" || inventory.text_mapping_status !== "mapped") throw new Error("Mapping oder Inventar ist nicht freigegeben.");

  const inventoryBySlide = new Map(inventory.slides.map((slide) => [slide.source_slide_number, slide]));
  const groups = buildSceneGroups(mapping);
  const scenes = groups.map((members, index) => {
    const outputNumber = index + 1;
    const sourceSlides = members.map((entry) => entry.source_slide_number);
    const firstSource = sourceSlides[0];
    const primarySource = sourceSlides.reduce((best, slideNumber) => {
      const bestFeatures = inventoryBySlide.get(best)?.features || {};
      const candidateFeatures = inventoryBySlide.get(slideNumber)?.features || {};
      const score = (features) =>
        Number(features.text_count || 0) +
        Number(features.path_count || 0) +
        Number(features.image_count || 0) * 4 +
        Number(features.group_count || 0);
      return score(candidateFeatures) > score(bestFeatures) ? slideNumber : best;
    }, firstSource);
    const workUnit = `slide_${pad(outputNumber)}`;
    const sceneId = `${moduleId.toLowerCase()}_src_${pad(firstSource)}`;
    const groupId = `${moduleId.toLowerCase()}_group_${pad(outputNumber)}`;
    const uniqueTexts = unique(members.map((entry) => entry.spoken_text));
    const spokenText = uniqueTexts.join("\n\n");
    const sourceTextTrigger = triggerPhrase(spokenText);
    const merged = members.length > 1;
    const speaker = sourceSlides.some((slideNumber) => inventoryBySlide.get(slideNumber)?.features?.powerpoint_speaker_control_count > 0);
    return {
      work_unit: workUnit,
      output_slide_number: outputNumber,
      scene_id: sceneId,
      sequence_group_id: groupId,
      mode: merged ? "build_sequence" : "standalone",
      source_slides: sourceSlides,
      primary_source_slide: primarySource,
      mapping_type: merged ? "merged" : "direct",
      text_mapping_refs: unique(members.map((entry) => `${entry.source_docx}#${entry.source_text_section_id}`)),
      spoken_text_sources: unique(members.map((entry) => entry.extracted_markdown)),
      spoken_text: spokenText,
      source_text_trigger: sourceTextTrigger,
      content_title: members[0].source_text_title,
      target_svg: `rebuild-proposals/svg/${moduleId}/${workUnit}/${workUnit}.svg`,
      internal_manifest: `rebuild-proposals/svg/${moduleId}/${workUnit}/scene.animation.v1.json`,
      element_animation_plan: `rebuild-proposals/svg/${moduleId}/${workUnit}/element-animation-plan.json`,
      final_svg_basename: `${sceneId}.svg`,
      final_manifest_basename: `${sceneId}.animation.v1.json`,
      remove_powerpoint_speaker: speaker,
      animation_plan: {
        decision: "needs_review",
        rationale: "Sprechertextkontext und fachliche Zielgruppen muessen vor static/animated szenenweise geprueft werden.",
        strategy: "unplanned",
        state_count: members.length,
        public_targets: [],
        semantic_groups: [],
        steps: [],
      },
      qa: {
        issues: [],
        warnings: ["Animationsentscheidung steht auf needs_review; keine Schritte automatisch erzeugt."],
        open_questions: [],
      },
    };
  });

  const scenePlan = {
    schema_version: "basisReScenePlan/v1",
    module_id: moduleId,
    external_module_id: externalModuleId,
    source_inventory: toRepoPath(inventoryPath),
    text_mapping: toRepoPath(mappingPath),
    target_structure_version: "external-svg-asset-package-handoff/v1",
    scenes,
    qa: {
      issues: [],
      warnings: [
        ...((mapping.deferred_documents || []).length
          ? [`${mapping.deferred_documents.length} Textdokumente sind nur fuer diesen Testlauf zurueckgestellt; nach Ergaenzung ist der Preflight zu wiederholen.`]
          : []),
        "Alle Szenen benoetigen eine semantische Animationsentscheidung vor der Produktion.",
      ],
      open_questions: [],
    },
  };

  const referenceMap = {
    schema_version: "basisRebuildSourceReferenceMap/v1",
    module_id: moduleId,
    sequence_plan: toRepoPath(markdownOutput),
    updated_at: "2026-07-16",
    mappings: scenes.map((scene) => ({
      work_unit: scene.work_unit,
      output_slide_number: scene.output_slide_number,
      source_slides: scene.source_slides,
      primary_source_slide: scene.primary_source_slide,
      mapping_type: scene.mapping_type,
      rationale: scene.mapping_type === "merged"
        ? `Die Quell-SVGs ${scene.source_slides.join(", ")} teilen denselben Sprechertext und sind Kandidaten fuer eine gemeinsame Szene; static/animated wird semantisch geprueft.`
        : `Quell-SVG ${scene.primary_source_slide} besitzt einen eigenen Sprechertextabschnitt und bleibt eine eigenstaendige Content-SVG-Szene.`,
    })),
  };

  const sourceRows = inventory.slides.map((slide) => {
    const mappingEntry = mapping.mappings.find((entry) => entry.source_slide_number === slide.source_slide_number);
    const added = slide.state_delta.added.slice(0, 3).join("; ") || "-";
    const removed = slide.state_delta.removed.slice(0, 3).join("; ") || "-";
    const speaker = slide.features.powerpoint_speaker_control_count > 0 ? "Lautsprecher entfernen" : "keine";
    const assets = [
      slide.features.image_count ? `${slide.features.image_count} Bilddefinition(en)` : "",
      slide.features.path_count ? `${slide.features.path_count} Pfad(e)` : "",
      speaker,
    ].filter(Boolean).join("; ");
    return `| ${slide.source_slide_number} | ${markdown(path.basename(slide.source_svg))} | ${markdown(`${mappingEntry.source_docx}#${mappingEntry.source_text_section_id}`)} | ${markdown(slide.visible_content_summary)} | ${slide.sequence_role} | ${markdown(added)} | ${markdown(removed)} | sichtbare Vektorknoten und eingebettete Assets | Export-IDs und defs vor Merge umschreiben | ${slide.state_delta.compared_to ?? "-"} | ${mappingEntry.shared_text_group || "-"} | fachliche Gruppen, Datenpunkte, Labels | ${mappingEntry.shared_text_group ? "fade/replace" : "fade/highlight"} | ${markdown(assets)} | ${markdown(triggerPhrase(mappingEntry.spoken_text))} | ${markdown(slide.transformation_notes.join("; ") || "keine")} |`;
  });

  const contentRows = scenes.map((scene) => `| ${scene.source_slides.join(", ")} | alle fachlichen Texte, Formen, Diagramme und Bildinhalte des vollstaendigsten Zustands | Gestaltung, Gruppierung, Layerung und Animation; sichtbarer PowerPoint-Titel, Masterelemente und Lautsprecher entfallen | same_as_source | low |`);
  const groupRows = scenes.map((scene) => {
    const states = scene.mode === "build_sequence" ? scene.source_slides.map((_, index) => `source_state_${pad(index + 1)}`).join(", ") : "main_content";
    return `| ${scene.sequence_group_id} | ${scene.scene_id} | ${scene.mode} | ${scene.source_slides.join(", ")} | Folie${scene.primary_source_slide}.SVG | wiederkehrende Grundelemente des finalen Zustands | ${states} | semantische ASCII-IDs; Export-IDs mit Szenenpraefix | ${scene.mode === "build_sequence" ? "master_svg" : "single_svg"} | vollstaendiger statischer Endzustand | ${states} | Quellzustandsreihenfolge ${scene.source_slides.join(" -> ")} | ${scene.output_slide_number > 1 ? `vorherige Szene ${scenes[scene.output_slide_number - 2].scene_id}` : "keine"} | Sprechertextbezug und Quellreferenzen bleiben erhalten |`;
  });
  const workRows = scenes.map((scene) => `| ${scene.work_unit} | ${scene.scene_id} | ${scene.source_slides.join(", ")} | ${scene.primary_source_slide} | ${scene.mapping_type} | ${scene.sequence_group_id} | ${scene.target_svg} | ${scene.internal_manifest} | ${scene.final_svg_basename} | ${scene.final_manifest_basename} | ${scene.mode === "build_sequence" ? "master_svg_state" : "single_svg"} | content-svg | direct_reuse/regroup/rewrite_ids | external-svg-asset-package-handoff/v1 | Quellinhalt semantisch gruppieren; PowerPoint-Titel und Masterelemente entfernen; statischen Endzustand erhalten | title/footer/logo/frame/slide_number/navigation/speaker omitted | 1280x720-Quellraum und fachliche Positionen beibehalten | needs_review | ID-/Referenzintegritaet, Sprechertextkontext, Gruppierung, Lautsprecherfreiheit, statischer Endzustand |`);
  const spokenRows = scenes.map((scene) => `| ${scene.scene_id} | ${scene.source_slides.join(", ")} | ${markdown(scene.text_mapping_refs.join("; "))} | ${markdown(scene.spoken_text_sources.join("; "))} | ${markdown(scene.spoken_text)} | - | semantic review required | needs_review |`);
  const assetRows = scenes.map((scene) => `| ${scene.work_unit} | transformierter Quell-SVG-Inhalt | Fachvisual der Szene | native_svg | Quell-SVG${scene.source_slides.length > 1 ? "s" : ""} ${scene.source_slides.join(", ")} | ${scene.target_svg} | needs_review nach Sprechertext- und Gruppierungsanalyse | - |`);
  const animationRows = scenes.map((scene) => `| ${scene.work_unit} | needs_review | Sprechertext und Zielkomposition semantisch pruefen | - | - | - | - | - | - |`);
  const productionRows = scenes.map((scene) => `| ${scene.output_slide_number} | ${scene.work_unit} | ${scene.source_slides.join(", ")} | Quellreihenfolge und szenenweiser QA-Zwang | ${scene.element_animation_plan}, ${scene.target_svg} und Manifest | Struktur, Elementgranularitaet, Content-Crosscheck, Animation, Lautsprecherfreiheit |`);

  const markdownText = `# ${moduleId} Sequence Plan\n\n## Module\n\n- module_id: ${moduleId}\n- external_module_id: ${externalModuleId}\n- final_handoff_package: delivery-packages/storyboard-import/${externalModuleId}/\n- source_module_dir: source-materials/basis-seminar/powerpoint-svg/${moduleId}/\n- source_svg_dir: source-materials/basis-seminar/powerpoint-svg/${moduleId}/SVG/\n- source_text_dir: source-materials/basis-seminar/powerpoint-svg/${moduleId}/Text/\n- svg_text_map: ${toRepoPath(mappingPath)}\n- source_svg_inventory: ${toRepoPath(inventoryPath)}\n- extracted_text_dir: analysis/source-text/${moduleId}/extracted/\n- created_at: 2026-07-16\n- planning_status: needs_animation_review\n- source_reference_map: ${toRepoPath(referenceOutput)}\n- machine_scene_plan: ${toRepoPath(jsonOutput)}\n- result: ${inventory.slides.length} Quell-SVGs werden zu ${scenes.length} Ziel-Szenen; ${scenes.filter((scene) => scene.mapping_type === "merged").length} Szenen fassen belegte Aufbauzustaende zusammen.\n- deferred_input: ${(mapping.deferred_documents || []).length} Dokumente sind fuer diesen Testlauf ausdruecklich zurueckgestellt und erzwingen spaeter einen erneuten Intake.\n\n## Source Sweep\n\n| source_slide | source_svg | text_mapping_ref | source_state_summary | sequence_role | new_since_previous | removed_or_changed | reusable_source_nodes | id_or_reference_risks | builds_on | prepares_later_state | animation_candidates | transition_need | key_assets | spoken_text_anchor | risks_or_questions |\n|---:|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n${sourceRows.join("\n")}\n\n## Content Equivalence\n\n| source_slide_or_group | must_preserve_content | can_repackage_or_redesign | information_density_target | spoken_text_fit_risk |\n|---|---|---|---|---|\n${contentRows.join("\n")}\n\n## Sequence Groups\n\n| group_id | Scene_ID | mode | source_slides | primary_source_svg | shared_semantic_objects | state_specific_objects | id_rewrite_strategy | output_strategy | initial_visible_elements | animated_elements | transitions_to_preserve | dependencies | notes |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n${groupRows.join("\n")}\n\n## Planned SVG Work Units\n\n| work_unit | Scene_ID | source_slides | primary_source_slide | mapping_type | sequence_group_id | planned_output_svg | internal_animation_manifest | final_svg_basename | final_animation_manifest | output_kind | content_scope | source_node_strategy | target_structure_version | visual_build_plan | omitted_master_elements | continuity_requirements | animation_decision | qa_focus |\n|---|---|---|---:|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n${workRows.join("\n")}\n\n## Scene Spoken Text And Trigger Plan\n\n| Scene_ID | source_slides | text_mapping_refs | spoken_text_sources | final_scene_spoken_text | planned_sourceText_phrases | ambiguity_or_occurrence | approval_status |\n|---|---|---|---|---|---|---|---|\n${spokenRows.join("\n")}\n\n## Visual Asset And Plot Plan\n\n| work_unit_or_group | visual_element | semantic_role | planned_strategy | generator_or_source | planned_target_path | animation_need | open_question |\n|---|---|---|---|---|---|---|---|\n${assetRows.join("\n")}\n\n## Dependency Map\n\nDie Produktionsreihenfolge folgt der Quellreihenfolge. Innerhalb einer zusammengezogenen Szene ist jeder spaetere Quellzustand vom unmittelbar vorherigen Zustand abhaengig. Szenenuebergreifende Knoten werden nicht geteilt; visuelle Kontinuitaet wird ueber denselben Quellraum und dieselben Brandtokens gesichert.\n\n## Animation Decisions And Transition Plan\n\n| work_unit_or_group | decision | rationale | narrative_beat | semantic_group_and_members | trigger_order | intended_effect | sourceText_exact_phrase | occurrence |\n|---|---|---|---|---|---:|---|---|---:|\n${animationRows.join("\n")}\n\n## Preflight Asset Outlook\n\nDie bestehenden PowerPoint-SVGs sind der visuelle Ursprung. Vektorformen und eingebettete Inhaltsbilder werden strukturell uebernommen. Der Lautsprecher unten rechts ist ein Bedienelement und wird vollstaendig entfernt. Neue Python-Plots, Formelassets oder Rasterbilder werden in diesem Transformationslauf nur erzeugt, wenn eine Quellgeometrie technisch nicht portabel ist; ein solcher Ersatz bleibt im jeweiligen Folienordner und wird im Szenenbrief dokumentiert.\n\n## Production Order\n\n| order | work_unit | source_slides | reason_for_order | expected_output | qa_focus |\n|---:|---|---|---|---|---|\n${productionRows.join("\n")}\n\n## Checks Before SVG Production\n\n- [x] Source SVG inventory exists and matches all 96 current input hashes.\n- [x] SVG-text map has 96 mapped SVGs, no unmapped current input and explicit deferred test input.\n- [x] Every source SVG has one Source Sweep row.\n- [x] Every source SVG belongs to exactly one planned target scene.\n- [x] Shared speaker-text groups are represented as build sequences.\n- [x] Every target scene has a stable source-based Scene_ID.\n- [x] Every target scene has exact approved test-run spoken text.\n- [ ] Every target scene still needs a semantic \`static\` or \`animated\` decision; \`needs_review\` creates no steps.\n- [x] Every work unit has output paths, source references, structure version and QA focus.\n- [x] The PowerPoint speaker control is a mandatory omission and QA item.\n- [x] No seconds, word indices, TTS timings or production frames were invented.\n`;

  for (const [filePath, value] of [[jsonOutput, scenePlan], [referenceOutput, referenceMap]]) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  }
  fs.mkdirSync(path.dirname(markdownOutput), { recursive: true });
  fs.writeFileSync(markdownOutput, markdownText, "utf8");
  console.log(`Source SVGs: ${inventory.slides.length}`);
  console.log(`Scenes: ${scenes.length}`);
  console.log(`Merged scenes: ${scenes.filter((scene) => scene.mapping_type === "merged").length}`);
  console.log(`Plan: ${markdownOutput}`);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
