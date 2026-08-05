# Module Sequence Plan

Use this file after the source SVG inventory and before creating the first target SVG for a module.

Target path:

```text
analysis/rebuild-plans/<module_id>_sequence_plan.md
```

## Module

- module_id:
- external_module_id: lowercase-digits-hyphens
- final_handoff_package: delivery-packages/storyboard-import/<external-module-id>/
- source_module_dir: source-materials/basis-seminar/powerpoint-svg/<module_id>/
- source_svg_dir: source-materials/basis-seminar/powerpoint-svg/<module_id>/SVG/
- source_text_dir: source-materials/basis-seminar/powerpoint-svg/<module_id>/Text/
- svg_text_map: analysis/inventories/<module_id>_svg-text-map.json
- source_svg_inventory: analysis/inventories/<module_id>_source-svg-inventory.json
- extracted_text_dir: analysis/source-text/<module_id>/extracted/
- created_at:
- planning_status: draft/review/approved
- source_reference_map: analysis/rebuild-plans/<module_id>_source-reference-map.json

The reference map uses schema `basisRebuildSourceReferenceMap/v1` and records `work_unit`, `output_slide_number`, all `source_slides`, `primary_source_slide`, `mapping_type` and `rationale` for every planned SVG work unit.

## Design Reference Lock

- user_named_reference_module:
- reference_target_svgs:
- inherited_artifact_scope:
- inherited_embedding_target:
- inherited_brand_frame:
- inherited_title_footer_logo:
- inherited_typography:
- inherited_cards_strokes_connectors:
- inherited_asset_language:
- token_source:
- approved_deviations:

Rule: use the actual approved target SVGs of the named reference module. A chapter
with the same number, a source SVG, or a generic palette is not a substitute.

## Source Sweep

One row per source SVG. Do not merge states before this table is filled.

| source_slide | source_svg | text_mapping_ref | source_state_summary | sequence_role | new_since_previous | removed_or_changed | reusable_source_nodes | id_or_reference_risks | builds_on | prepares_later_state | animation_candidates | transition_need | key_assets | spoken_text_anchor | risks_or_questions |
|---:|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | slide_001.svg | analysis/inventories/<module_id>_svg-text-map.json#slide_001 |  | standalone/sequence_start/sequence_state/sequence_final/duplicate_state/absorbed_source |  |  |  |  |  |  |  | none/fade/draw/move/highlight/replace/cut | diagram/timeline/formula/table/icon/image/text |  |  |

## Content Equivalence

Document how the transformation keeps the source SVG content intact while changing structure, layer organization and design.

| source_slide_or_group | must_preserve_content | can_repackage_or_redesign | information_density_target | spoken_text_fit_risk |
|---|---|---|---|---|
|  |  |  | same_as_source/compact_but_equivalent/source_plus_clarifying_labels | low/medium/high |

## Target Additions

Every visible target element without a direct source element needs evidence.

| work_unit | target_addition | evidence_type | evidence_reference | introduces_new_factual_claim | disposition |
|---|---|---|---|---|---|
|  |  | spoken_text/user_request/brand_frame/orientation |  | yes/no | keep/remove/needs_review |

## Sequence Groups

| group_id | Scene_ID | mode | source_slides | primary_source_svg | shared_semantic_objects | state_specific_objects | id_rewrite_strategy | output_strategy | initial_visible_elements | animated_elements | transitions_to_preserve | dependencies | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | scene_001 | standalone/build_sequence/morph_sequence/detail_reveal/duplicate_state/skip_preview |  |  |  |  |  | master_svg/single_svg/no_svg_manifest_only |  |  |  |  |  |

## Planned SVG Work Units

Plan every later SVG before implementation. This section is mandatory and must stay on planning level; do not start SVG code while this table is incomplete.

| work_unit | Scene_ID | source_slides | primary_source_slide | mapping_type | sequence_group_id | planned_output_svg | internal_animation_manifest | final_svg_basename | final_animation_manifest | output_kind | content_scope | source_node_strategy | target_structure_version | visual_build_plan | omitted_master_elements | continuity_requirements | animation_decision | qa_focus |
|---|---|---|---:|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| slide_001 | scene_001 |  |  | direct/merged/new_content |  | rebuild-proposals/svg/<module_id>/slide_001/slide_001.svg | rebuild-proposals/svg/<module_id>/slide_001/scene.animation.v1.json | slide_001.svg | slide_001.animation.v1.json | single_svg/master_svg_state/preview_svg/no_svg_manifest_only | content-svg | direct_reuse/regroup/rewrite_ids/replace_specialized_elements | external-svg-asset-package-handoff/v1 |  | title/footer/logo/frame/slide_number/navigation omitted |  | animated/static_with_reason |  |

## Scene Spoken Text And Trigger Plan

Use exact approved wording. Merged scenes concatenate the assigned source passages in the intended teaching order; do not rewrite them freely.

| Scene_ID | source_slides | text_mapping_refs | spoken_text_sources | final_scene_spoken_text | planned_sourceText_phrases | ambiguity_or_occurrence | approval_status |
|---|---|---|---|---|---|---|---|
| scene_001 |  |  |  |  |  | unique/occurrence_required | draft/review/approved |

## Visual Asset And Plot Plan

List the visual strategy before production starts. This does not replace the later per-scene asset decision gate, but it prevents hidden assumptions during analysis.

| work_unit_or_group | visual_element | semantic_role | planned_strategy | generator_or_source | planned_target_path | animation_need | open_question |
|---|---|---|---|---|---|---|---|
|  |  |  | native_svg/python_plot_library/new_python_plot_generator/formula_svg/generated_png/extracted_png/user_asset_required/omit_with_reason |  |  | none/reveal/draw/fade/move/highlight |  |

Rule: choose `python_plot_library` or `new_python_plot_generator` for every real plot or technical diagram. Use `native_svg` for simple timelines/object-time axes only when they mark events, failures with `X`/crosses, or censoring without technical plot geometry.

Rule: planned targets for folienspezifisch erzeugte Plot-SVGs, Daten-/Konfigurationsdateien, Formel-SVGs and image assets must live under the work unit folder, e.g. `rebuild-proposals/svg/<module_id>/slide_###/plots/`, `data/`, `formulas/` or `images/`. Generator code and reusable libraries stay central, rendered slide artifacts stay local to the slide.

## Dependency Map

List what depends on what before production starts.

| later_unit | depends_on | dependency_type | reason | consequence_for_svg_or_manifest |
|---|---|---|---|---|
|  |  | visual_continuity/data/formula/animation/source_context |  |  |

## Animation Decisions And Transition Plan

This is a planning artifact. Decide `static`, `animated`, or `needs_review` before proposing targets. Target IDs may be proposed only for `animated` scenes and are not implemented until SVG and manifest exist.

| work_unit_or_group | decision | rationale | narrative_beat | semantic_group_and_members | trigger_order | intended_effect | sourceText_exact_phrase | occurrence | source_slide_or_spoken_anchor |
|---|---|---|---|---|---:|---|---|---:|---|
|  | static/animated/needs_review |  |  | box+text+icon / axes+labels / data / fit / confidence_limits |  | show/hide/draw/transform/highlight |  |  |  |

## Preflight Asset Outlook

This does not replace the per-scene asset decision table. It only identifies likely assets early.

| asset_need | appears_in_slides | type | likely_strategy | library_or_source | open_question |
|---|---|---|---|---|---|
|  |  | python_plot/formula_svg/native_svg/generated_png/extracted_png/user_asset_required |  |  |  |

## Production Order

| order | work_unit | source_slides | archetype | archetype_pilot | reason_for_order | expected_output | static_render_gate | qa_focus |
|---:|---|---|---|---|---|---|---|---|
| 1 |  |  |  | yes/no |  |  | open/passed/blocked |  |

## Checks Before SVG Production

- [ ] The source SVG inventory exists and matches the current input hashes.
- [ ] The SVG-text map exists, matches all SVG/DOCX/extraction hashes, and has no unmapped or review-required entries.
- [ ] Every source SVG has exactly one `text_mapping_ref` and every mapped spoken-text segment is used exactly once at source level.
- [ ] Every source SVG has one `Source Sweep` row.
- [ ] The Design Reference Lock names concrete approved target SVGs and their actual artifact scope.
- [ ] Content equivalence is documented for every source SVG or sequence group.
- [ ] Every visible target addition is listed with evidence; unsupported factual additions are removed or blocked.
- [ ] Build, reveal, morph, duplicate, and standalone states are classified.
- [ ] Every sequence group has a final source state.
- [ ] Shared and state-specific SVG objects are separated for every merged group.
- [ ] ID collisions, `defs` and local references have an explicit merge strategy.
- [ ] The active target SVG structure contract version is recorded.
- [ ] Every target scene has a stable `Scene_ID`; merged sources share one scene ID and later reordering will not renumber it.
- [ ] Every animated scene has approved spoken text and exact, unambiguous `sourceText` phrases.
- [ ] Every planned SVG work unit has an output path, output kind, content scope, continuity note, and QA focus.
- [ ] Every planned SVG work unit has an explicit entry in `<module_id>_source-reference-map.json`; merged and new-content mappings are intentional and explained.
- [ ] Every planned SVG work unit has an explicit animation decision; `static` is a normal result and `needs_review` blocks step generation.
- [ ] Every relevant diagram, formula, timeline, pictogram, image, process shape, and omitted master element appears in `Visual Asset And Plot Plan`.
- [ ] Animation candidates are listed only after the didactic decision and as complete semantic groups before SVG coding.
- [ ] Transitions that matter for learning are listed.
- [ ] For `animated` scenes, narrative beats, grouped elements, trigger order and intended effect are listed before SVG coding; no timing or trigger is invented for `static` scenes.
- [ ] Dependencies between groups are documented.
- [ ] Likely Python plots, formula assets, timelines, and complex image assets are identified.
- [ ] Folienspezifisch erzeugte Plot-, Daten-, Formel- und Bildassets have target paths inside the matching slide folder.
- [ ] Production order is explicit.
- [ ] The first work unit of every new archetype is marked as pilot and blocks reuse until its static render gate passes.
- [ ] Every scene has planned source, target and reference previews at 1920x1080 and reduced viewer size.
- [ ] Animation work is scheduled only after the corresponding static render gate passes.
- [ ] Open questions are documented or accepted as assumptions.
- [ ] Final package paths, SVG basenames and matching `<svg-name>.animation.v1.json` names are planned.
- [ ] No final seconds, word indices, TTS timings or production frames are invented in this repository.
