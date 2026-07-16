# Module Sequence Plan

Use this file before creating the first SVG for a module.

Target path:

```text
analysis/rebuild-plans/<module_id>_sequence_plan.md
```

## Module

- module_id:
- source_pptx:
- source_pdf:
- source_png_dir:
- narration_file:
- analysis_json_dir:
- created_at:
- planning_status: draft/review/approved
- source_reference_map: analysis/rebuild-plans/<module_id>_source-reference-map.json

The reference map uses schema `basisRebuildSourceReferenceMap/v1` and records `work_unit`, `output_slide_number`, all `source_slides`, `primary_source_slide`, `mapping_type` and `rationale` for every planned SVG work unit.

## Source Sweep

One row per old source slide. Do not merge slides before this table is filled.

| source_slide | old_state_summary | standalone_or_sequence_state | new_since_previous | removed_or_changed | builds_on | prepares_later_state | animation_candidates | transition_need | key_assets | spoken_text_anchor | risks_or_questions |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 1 |  | standalone/build/reveal/morph/duplicate |  |  |  |  |  | none/fade/draw/move/highlight/cut | diagram/timeline/formula/table/icon/image/text |  |  |

## Content Equivalence

Document how the rebuild keeps the PowerPoint content intact while changing layout and design.

| source_slide_or_group | must_preserve_content | can_repackage_or_redesign | information_density_target | spoken_text_fit_risk |
|---|---|---|---|---|
|  |  |  | same_as_source/compact_but_equivalent/source_plus_clarifying_labels | low/medium/high |

## Sequence Groups

| group_id | mode | source_slides | final_source_state | output_strategy | initial_visible_elements | animated_elements | transitions_to_preserve | dependencies | notes |
|---|---|---|---|---|---|---|---|---|---|
|  | standalone/build_sequence/morph_sequence/detail_reveal/duplicate_state/skip_preview |  |  | master_svg/single_svg/no_svg_manifest_only |  |  |  |  |  |

## Planned SVG Work Units

Plan every later SVG before implementation. This section is mandatory and must stay on planning level; do not start SVG code while this table is incomplete.

| work_unit | source_slides | primary_source_slide | mapping_type | sequence_group_id | planned_output_svg | planned_animation_manifest | output_kind | content_scope | visual_build_plan | layout_and_representation | omitted_master_elements | continuity_requirements | animation_coverage | qa_focus |
|---|---|---:|---|---|---|---|---|---|---|---|---|---|---|---|
| slide_001 |  |  | direct/merged/new_content |  | rebuild-proposals/svg/<module_id>/slide_001/slide_001.svg | rebuild-proposals/svg/<module_id>/slide_001/scene.animation.v1.json | single_svg/master_svg_state/preview_svg/no_svg_manifest_only | content-svg |  |  | title/footer/logo/frame/slide_number/navigation omitted |  | animated/static_with_reason |  |

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

## Animation And Transition Plan

This is a planning artifact. Target IDs may be proposed here, but they are not considered implemented until the per-scene SVG and manifest exist.

| work_unit_or_group | trigger_order | trigger_type | planned_target_layer_or_id | intended_effect | timing_note | source_slide_or_spoken_anchor | manifest_target_needed |
|---|---:|---|---|---|---|---|---|
|  | 1 | time/user/narration/manual |  | fade_in/draw/reveal/move/highlight/fade_out |  |  | yes/no |

## Preflight Asset Outlook

This does not replace the per-scene asset decision table. It only identifies likely assets early.

| asset_need | appears_in_slides | type | likely_strategy | library_or_source | open_question |
|---|---|---|---|---|---|
|  |  | python_plot/formula_svg/native_svg/generated_png/extracted_png/user_asset_required |  |  |  |

## Production Order

| order | work_unit | source_slides | reason_for_order | expected_output | qa_focus |
|---:|---|---|---|---|---|
| 1 |  |  |  |  |  |

## Checks Before SVG Production

- [ ] Every old source slide has one `Source Sweep` row.
- [ ] Content equivalence is documented for every source slide or sequence group.
- [ ] Build, reveal, morph, duplicate, and standalone states are classified.
- [ ] Every sequence group has a final source state.
- [ ] Every planned SVG work unit has an output path, output kind, content scope, continuity note, and QA focus.
- [ ] Every planned SVG work unit has an explicit entry in `<module_id>_source-reference-map.json`; merged and new-content mappings are intentional and explained.
- [ ] Every planned SVG work unit has animation coverage or a written static exception.
- [ ] Every relevant diagram, formula, timeline, pictogram, image, process shape, and omitted master element appears in `Visual Asset And Plot Plan`.
- [ ] Animation candidates are listed before SVG coding.
- [ ] Transitions that matter for learning are listed.
- [ ] Planned animation layers, trigger order, trigger type, intended effect, and timing notes are listed before SVG coding.
- [ ] Dependencies between groups are documented.
- [ ] Likely Python plots, formula assets, timelines, and complex image assets are identified.
- [ ] Folienspezifisch erzeugte Plot-, Daten-, Formel- und Bildassets have target paths inside the matching slide folder.
- [ ] Production order is explicit.
- [ ] Open questions are documented or accepted as assumptions.
