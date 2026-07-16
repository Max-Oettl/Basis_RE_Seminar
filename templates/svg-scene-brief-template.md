# SVG Scene Brief Template

Use this file as the compact planning artifact before creating or changing a single SVG work unit.

## Work Unit

- module_id:
- work_unit:
- sequence_plan:
- sequence_group_id:
- sequence_mode:
- source_slides:
- crosscheck_reference_slides:
- crosscheck_primary_source_slide:
- crosscheck_mapping_type: direct/merged/new_content
- crosscheck_mapping_rationale:
- source_reference_map: analysis/rebuild-plans/<module_id>_source-reference-map.json
- final_source_state:
- previous_work_unit_or_state:
- next_work_unit_or_state:
- output_svg:
- animation_manifest:
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
  "brandProfile": "reltest-academy",
  "brandVariant": "technical|management|light|dark|minimal",
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

## Source And Spoken Text Alignment

### Source Slide Anchors

- 

### Spoken Text Points

- 

### Must Show In SVG

- 

### Content Equivalence

- source content preserved:
- source content repackaged:
- source content omitted with reason:
- how speaker text still fits:

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
|  | PNG/PDF/PPTX/spoken text |  | simple/medium/complex | python_plot_library/new_python_plot_generator/native_svg/library_svg_adapted/generated_png/extracted_png/user_asset_required/omit_with_reason |  |  |  |

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
- spacing logic:
- reused/adapted components:
- plot generators and plot assets:
- folienspezifische Artefaktablage: all generated plot/formula/data/image files live under `slide_folder`
- generated or extracted assets:
- complex pictogram handling:
- animation layers:
- visible title decision: no visible global title, no slide/module kicker, no workflow note, no focus line:
- information density vs PowerPoint source:

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

## Animation Coverage

Every new Content-SVG should have meaningful animation targets unless a static exception is documented.

| target_or_layer | source_or_spoken_trigger | initial_state | intended_action | reason |
|---|---|---|---|---|
|  |  | visible/hidden | show/hide/draw/highlight/move_note/static |  |

## Required Checks Before Release

- [ ] SVG rendered and visually inspected.
- [ ] Content-SVG metadata is present in SVG metadata or scene manifest.
- [ ] No PowerPoint master elements are embedded: slide number, footer, logo bar, presentation frame, deck header, or navigation.
- [ ] Colors, typography, spacing, and semantic status colors follow `brand/company-brand-tokens.json`, or exceptions are documented with `data-qa-reason`.
- [ ] Asset decision table is complete for all relevant visual elements.
- [ ] No visible global title, slide/module kicker, workflow note, or focus line.
- [ ] The SVG is content-equivalent to the source slide or sequence group; it is not a reduced summary.
- [ ] Crosscheck references match the machine-readable source-reference map; merged source slides and new-content exceptions are explicit.
- [ ] Information density is intentionally aligned with the PowerPoint source.
- [ ] Failure timelines use source-based or illustrative irregular spacing, not default equal spacing.
- [ ] Every text box has visible padding.
- [ ] Complex pictograms are embedded as PNG/image assets or explicitly marked as missing, not improvised as line/path SVG.
- [ ] Local PNG/image paths exist and are documented in the asset manifest, scene brief, or rebuild plan.
- [ ] Folienspezifisch erzeugte Python-Plots, Datenspezifikationen, Formel-SVGs und Bildassets liegen im Ordner dieser Folie, nicht nur in globalen Asset-Ordnern.
- [ ] Animation manifest targets exist.
- [ ] Animation coverage exists for all elements described sequentially by the speaker text, or a static exception is documented.
- [ ] `node tools/svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all --strict-design` completed.
- [ ] If browser layout QA is available, `node tools/svg-rebuild-qa.js <module_id> --viewer --slides <range> --expect-all --strict-design --layout --layout-strict` completed; otherwise the limitation is documented.
- [ ] Issues and fixes documented in `analysis/reports/`.
