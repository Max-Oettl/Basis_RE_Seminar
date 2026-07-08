# SVG Scene Brief Template

Use this file as the compact planning artifact before creating or changing a single SVG work unit.

## Work Unit

- module_id:
- work_unit:
- source_slides:
- final_source_state:
- output_svg:
- animation_manifest:

## Source And Spoken Text Alignment

### Source Slide Anchors

- 

### Spoken Text Points

- 

### Must Show In SVG

- 

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

Complete before SVG coding. Use `workflow/svg-asset-decision-gate.md`.

| source_element | source_evidence | semantic_role | complexity | strategy | target_path | reason | blocking_question |
|---|---|---|---|---|---|---|---|
|  | PNG/PDF/PPTX/spoken text |  | simple/medium/complex | python_plot_library/new_python_plot_generator/native_svg/library_svg_adapted/generated_png/extracted_png/user_asset_required/omit_with_reason |  |  |  |

Hard stop:

- Complex pictograms, tool/method symbols, source-specific icons, realistic objects, and illustrations must use `generated_png`, `extracted_png`, or `user_asset_required`.
- Real technical diagrams, curves, distributions, and Weibull plots must use `python_plot_library` or `new_python_plot_generator` unless a documented sketch exception applies.
- Generic timelines and failure timelines must be planned as SVG compositions, not Python plots.
- Python plots must not contain visible titles.
- German plot labels must use real umlauts and `ß`, not `ae`, `oe`, `ue`, or `ss` replacement spelling.
- Do not improvise complex pictograms as SVG line/path drawings.
- If user feedback names a visual object, update this table before patching the SVG.

## Design Brief

- canvas:
- visual structure:
- reused/adapted components:
- plot generators and plot assets:
- generated or extracted assets:
- complex pictogram handling:
- animation layers:
- no visible PowerPoint title:

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

## Required Checks Before Release

- [ ] SVG rendered and visually inspected.
- [ ] Asset decision table is complete for all relevant visual elements.
- [ ] Every text box has visible padding.
- [ ] Complex pictograms are embedded as PNG/image assets or explicitly marked as missing, not improvised as line/path SVG.
- [ ] Local PNG/image paths exist and are documented in the asset manifest, scene brief, or rebuild plan.
- [ ] No visible PowerPoint title.
- [ ] Animation manifest targets exist.
- [ ] `node tools/svg-rebuild-qa.js <module_id> --viewer --slides <range>` completed.
- [ ] Issues and fixes documented in `analysis/reports/`.
