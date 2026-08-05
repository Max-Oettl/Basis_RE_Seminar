# SVG Scene Brief Template

Use this file as the compact planning artifact before creating or changing a single SVG work unit.

## Work Unit

- module_id:
- work_unit:
- Scene_ID:
- external_module_id:
- sequence_plan:
- sequence_group_id:
- sequence_mode:
- source_slides:
- source_svg_paths:
- source_svg_inventory:
- crosscheck_reference_slides:
- crosscheck_primary_source_slide:
- crosscheck_mapping_type: direct/merged/new_content
- crosscheck_mapping_rationale:
- source_reference_map: analysis/rebuild-plans/<module_id>_source-reference-map.json
- final_source_state:
- target_structure_contract: workflow/40-svg-production/target-svg-structure-contract.md
- target_structure_status_or_version:
- previous_work_unit_or_state:
- next_work_unit_or_state:
- output_svg:
- animation_manifest:
- final_package_scene_dir: delivery-packages/storyboard-import/<external-module-id>/assets/<Scene_ID>/
- final_svg_name:
- final_animation_manifest_name: <svg-name>.animation.v1.json
- slide_folder:

## Content-SVG Metadata

Use this for SVG `<metadata id="slide-quality-metadata" type="application/json">` or the matching scene manifest.

```json
{
  "artifactScope": "content-svg",
  "embeddingTarget": "powerpoint-slide",
  "slideType": "",
  "contentTitle": "",
  "layoutIntent": "",
  "takeaway": "",
  "audienceGoal": "",
  "density": "low|normal|dense",
  "contentMode": "transparent-content|contained-card|full-content-area",
  "backgroundMode": "transparent|light|dark",
  "brandProfile": "reltest-education",
  "brandVariant": "education-technical|education-management|education-light|education-dark|education-minimal",
  "designException": ""
}
```

## Sequence Context

Use the module sequence plan before filling this section.

- why this work unit exists:
- belongs together with:
- builds on:
- prepares:
- transition from previous state:
- transition to next state:
- animation role: none/initial_state/reveal_step/detail_reveal/morph/highlight/final_state
- preview strategy: own_svg/master_svg_state/manifest_only/skip_preview
- content equivalence: how all relevant source content remains present
- information density target: same_as_source/compact_but_equivalent/source_plus_clarifying_labels
- sequence merge decision: standalone/merged_with_neighbors/preview_only

## Source SVG And Spoken Text Alignment

### Source SVG Anchors

- 

### Spoken Text Points

- 

### Final Scene Spoken Text

- exact approved text:
- source passages and order:
- text approval status: draft/review/approved
- no free rewrite confirmed: yes/no

### Planned SourceText Triggers

| order | exact sourceText phrase | occurrence | target_id | action | match_status |
|---:|---|---:|---|---|---|
| 1 |  |  |  | show/hide/highlight/draw/transform | unique/ambiguous/missing |

### Must Show In SVG

- 

### Content Equivalence

- source content preserved:
- source content repackaged:
- source content omitted with reason:
- how speaker text still fits:

### Structural Transformation

- source nodes reused directly:
- source groups reorganized:
- IDs or references rewritten:
- duplicated objects consolidated:
- specialized elements replaced:
- source-only PowerPoint master elements removed:

### Spoken-Only Or Omitted

- 

## Creative Concept

### Learner Assumption

- Basis seminar learner; no reliability-engineering prior knowledge assumed.

### Scene Options

1. 
2. 
3. 

### Selected Direction

- 

## Asset Decision Gate

Complete before SVG coding. Use `workflow/30-visual-decision/svg-asset-decision-gate.md`.

| source_element | source_evidence | semantic_role | complexity | strategy | target_path | reason | blocking_question |
|---|---|---|---|---|---|---|---|
|  | source_svg/spoken_text |  | simple/medium/complex | direct_source_svg/restructure_source_svg/python_plot_library/new_python_plot_generator/native_svg/formula_svg/generated_png/extracted_image/user_asset_required/omit_with_reason |  |  |  |

Hard stop:

- Complex pictograms, tool/method symbols, source-specific icons, realistic objects, and illustrations must use `generated_png`, `extracted_png`, or `user_asset_required`.
- Real plots, technical diagrams, curves, distributions, fits, probability plots, confidence limits, and Weibull plots must use `python_plot_library` or `new_python_plot_generator`.
- Generic timelines, failure timelines, and simple object-time axes must be planned as SVG compositions, not Python plots, only when they mark events, failures with `X`/crosses, or censoring.
- SVG-native explainer sketches are allowed only when they are axisless and contain no data points, curves, fits, probability grid, confidence limits, or plot geometry.
- Python plots must not contain visible titles.
- German plot labels must use real umlauts and `ß`, not `ae`, `oe`, `ue`, or `ss` replacement spelling.
- Folienspezifisch erzeugte Plot-SVGs, Formel-SVGs, Daten-/Konfigurationsdateien und Bildassets muessen im `slide_folder` liegen, z.B. `plots/`, `data/`, `formulas/` oder `images/`.
- Failure timelines must not use equally spaced failure markers unless the source explicitly shows equal time gaps or the element is an abstract process axis.
- Do not improvise complex pictograms as SVG line/path drawings.
- If user feedback names a visual object, update this table before patching the SVG.

## Design Brief

- canvas:
- content-svg mode:
- background mode:
- visual structure:
- brand tokens used: `brand/company-brand-tokens.json`
- color roles:
- typography roles:
- Education identity confirmed: Signalgruen `#00A754` is the primary accent; Stahlcyan `#0C84B4` is diagram-only:
- font roles confirmed: Oxanium for display headings; Archivo for body, labels, tables and captions:
- spacing logic:
- reused/adapted components:
- plot generators and plot assets:
- folienspezifische Artefaktablage: all generated plot/formula/data/image files live under `slide_folder`
- generated or extracted assets:
- complex pictogram handling:
- animation layers:
- visible title decision: no visible global title, no slide/module kicker, no workflow note, no focus line:
- source SVG node and reference strategy:
- target SVG structure contract status:
- information density vs source SVG:

## Timeline Positioning

List every timeline, failure axis, object-time axis, and event sequence before SVG coding.

| element_id | kind | position_mode | source_values_or_offsets | spacing_rationale |
|---|---|---|---|---|
|  | failure_timeline/object_time/process_axis | source_timed/calculated/illustrative_irregular/abstract_process |  |  |

Hard stop:

- `illustrative_irregular` must use visibly natural spacing with clusters and gaps.
- Equally spaced failures are forbidden unless `position_mode` is `abstract_process` or source evidence proves equal gaps.
- If exact values are unknown, do not invent numeric tick labels.

## Text Budget

List every card, box, panel, legend, and formula area before SVG coding.

| element_id | planned_text | max_lines | min_padding_px | overflow_risk |
|---|---|---:|---:|---|
|  |  |  | 24 |  |

## QA Risks

- asset classification:
- png/image asset paths:
- pictogram recognizability:
- axis labels:
- plot labels/data source:
- formula layout:
- text boxes:
- arrows and markers:
- overlap risks:
- animation target risks:
- ID and reference rewrite risks:
- target structure risks:

## Animation Decision

- decision: static / animated / needs_review
- rationale:
- why animation improves learning, or why the complete static view is clearer:

Only complete this table for `animated`. One row is one semantic visual unit, not one raw SVG element.

| narrative_beat | semantic_group_id | grouped_elements | sourceText_exact_phrase | initial_state | intended_action | reason |
|---|---|---|---|---|---|---|
|  |  | box + text + icon / axes + labels / data series / fit / confidence limits |  | visible/hidden | show/hide/draw/highlight/transform |  |

## Required Checks Before Release

- [ ] SVG rendered and visually inspected.
- [ ] Content-SVG metadata is present in SVG metadata or scene manifest.
- [ ] No PowerPoint master elements are embedded: slide number, footer, logo bar, presentation frame, deck header, or navigation.
- [ ] Colors, typography, spacing, and semantic status colors follow `brand/company-brand-tokens.json`, or exceptions are documented with `data-qa-reason`.
- [ ] `brandProfile` is `reltest-education`; `RelTest Academy` does not appear in visible text or new metadata.
- [ ] Archivo is the leading content font and Oxanium is used only for display headings; fallback fonts do not lead the stack.
- [ ] Signalgruen is the primary Education accent; Stahlcyan is used only for its defined diagram role.
- [ ] Asset decision table is complete for all relevant visual elements.
- [ ] No visible global title, slide/module kicker, workflow note, or focus line.
- [ ] The SVG is content-equivalent to the source SVG or sequence group; it is not a reduced summary.
- [ ] Crosscheck references match the machine-readable source-reference map; merged source slides and new-content exceptions are explicit.
- [ ] Information density is intentionally aligned with the source SVGs.
- [ ] Reused, regrouped, removed and replaced source SVG elements are documented.
- [ ] All rewritten IDs and local references resolve without collisions.
- [ ] The active target SVG structure contract is applied; a provisional contract prevents final release.
- [ ] Failure timelines use source-based or illustrative irregular spacing, not default equal spacing.
- [ ] Every text box has visible padding.
- [ ] Complex pictograms are embedded as PNG/image assets or explicitly marked as missing, not improvised as line/path SVG.
- [ ] Local PNG/image paths exist and are documented in the asset manifest, scene brief, or rebuild plan.
- [ ] Folienspezifisch erzeugte Python-Plots, Datenspezifikationen, Formel-SVGs und Bildassets liegen im Ordner dieser Folie, nicht nur in globalen Asset-Ordnern.
- [ ] Animation decision is explicitly `static`, `animated`, or `needs_review` and follows the canonical animation decision workflow.
- [ ] Animated scenes use complete semantic groups; boxes include their text, diagram frames include axes and labels, and confidence limits remain one group.
- [ ] Static scenes contain no invented whole-slide reveal; animated scenes use stable semantic ASCII `snake_case` IDs and `data-anim-target="true"`.
- [ ] Every final animation step uses an exact complete-word `sourceText` phrase from the approved scene spoken text; repeated phrases use `occurrence`.
- [ ] Final SVG and animation manifest have the same basename in `assets/<Scene_ID>/`.
- [ ] The external manifest contains no internal extension fields, seconds, word indices, TTS timings or final production timing data.
- [ ] `node tools/svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all --strict-design` completed.
- [ ] If browser layout QA is available, `node tools/svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all --strict-design --layout --layout-strict` completed; otherwise the limitation is documented.
- [ ] Issues and fixes documented in `analysis/reports/`.
