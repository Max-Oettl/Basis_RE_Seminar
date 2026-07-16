# SVG Scene Brief

## Work Unit

- module_id: RE3_TEST_1
- work_unit: slide_001
- sequence_plan: analysis/rebuild-plans/RE3_TEST_1_sequence_plan.md
- sequence_group_id: RE3T1_G01_life_data_workflow
- sequence_mode: build_sequence
- source_slides: 1
- final_source_state: slide 1 initial data-collection state
- previous_work_unit_or_state: none
- next_work_unit_or_state: slide_002 median-rank formula reveal
- output_svg: rebuild-proposals/svg/RE3_TEST_1/slide_001/slide_001.svg
- animation_manifest: rebuild-proposals/svg/RE3_TEST_1/slide_001/scene.animation.v1.json

## Content-SVG Metadata

```json
{
  "artifactScope": "content-svg",
  "embeddingTarget": "powerpoint-slide",
  "slideType": "build-sequence-initial-state",
  "contentTitle": "Ausfallzeiten sammeln",
  "layoutIntent": "Start the life-data workflow with collected failure times on a life-duration axis.",
  "takeaway": "Ausfalldaten werden zuerst gesammelt, sortiert und als Ausfallzeitpunkte auf der Lebensdauerachse sichtbar.",
  "audienceGoal": "Learners understand the first step before probabilities, Weibull paper and regression are added.",
  "density": "low",
  "contentMode": "transparent-content",
  "backgroundMode": "transparent",
  "brandProfile": "reltest-academy",
  "brandVariant": "technical",
  "designException": ""
}
```

## Sequence Context

- why this work unit exists: It starts the later build sequence from raw failure times to Weibull parameters.
- belongs together with: source slides 1-6 / sequence group RE3T1_G01_life_data_workflow.
- builds on: no prior SVG state.
- prepares: slide_002 adds the probability-calculation step while reusing the same timeline geometry.
- transition from previous state: none.
- transition to next state: keep the timeline stable; reveal the median-rank/probability layer later.
- animation role: initial_state.
- preview strategy: own_svg.
- content equivalence: the visible source title, footer and logo are PowerPoint frame elements and remain outside the Content-SVG; the actual step 0 content and failure timeline stay visible.
- information density target: compact_but_equivalent.
- sequence merge decision: preview state of a larger build sequence.

## Source And Spoken Text Alignment

### Source Slide Anchors

- Source PNG `Folie1.PNG` shows the visible PowerPoint title, step marker 0, step marker 1, a horizontal life-duration axis and seven red failure crosses.
- This Content-SVG omits the visible PowerPoint title, logo/footer and frame.
- Step 1 is treated as the next reveal state and is not visible in this initial preview.

### Spoken Text Points

- The narration starts with collecting life-duration data.
- The narration says the available data are failure data as different time values.
- The narration explains that these values are first sorted along the time axis.

### Must Show In SVG

- Step marker `0`.
- Text `Sammeln der Ausfalldaten`.
- Life-duration axis labelled `Lebensdauer t`.
- Seven failure markers labelled `t1` to `t7`.
- Failure markers must be irregularly spaced, with visible gaps and clusters.

### Content Equivalence

- source content preserved: step 0, failure-time axis, seven failure events and the life-duration label.
- source content repackaged: the content is centered as a reusable Content-SVG module instead of a full PowerPoint slide.
- source content omitted with reason: global title, footer/logo and slide frame are master/layout elements; step 1 is deferred to slide_002 because it belongs to the next spoken/reveal step.
- how speaker text still fits: the visible SVG supports collecting, sorting and locating different failure times before the probability calculation begins.

### Spoken-Only Or Omitted

- The detailed explanation that the values are sorted by size is carried by the visible left-to-right order and the speaker text.
- No numeric time values are invented because the source provides ordinal labels only.

## Creative Concept

### Learner Assumption

- Basis seminar learner; no reliability-engineering prior knowledge assumed.

### Scene Options

1. Near-source layout with the original two-step list and timeline.
2. Full-width timeline module with only the failure axis.
3. Compact build-sequence anchor: one active step on the left and an irregular timeline on the right.

### Selected Direction

- Option 3. It is closest to the future build sequence, keeps the first step readable and leaves enough space for later probability/formula/plot layers.

## Asset Decision Gate

| source_element | source_evidence | semantic_role | complexity | strategy | target_path | reason | blocking_question |
|---|---|---|---|---|---|---|---|
| Step marker 0 | PNG / analysis JSON | Active first workflow step | simple | native_svg | slide_001.svg#step_label_group | Circle, number and label are simple editable SVG elements. | |
| `Sammeln der Ausfalldaten` | PNG / narration | Names the current workflow action | simple | native_svg | slide_001.svg#step_text | Text remains editable and readable. | |
| `Lebensdauer t` axis | PNG / timeline workflow | Shows ordering direction of failure times | simple | native_svg | slide_001.svg#axis | Generic didactic failure timeline, not a calculated plot. | |
| Failure markers and `t_i` labels | PNG / timeline workflow | Shows seven observed failure times | medium | native_svg | slide_001.svg#failure_markers | Simple X markers with ordinal labels; no statistical plot geometry. | |
| Source title | PNG | PowerPoint-level title | simple | omit_with_reason | not rendered | Content-SVG must not contain the global slide title. | |
| Step marker 1 teaser | PNG | Next workflow step | simple | omit_with_reason | not rendered in slide_001 | Next reveal belongs to slide_002 and remains compatible with the same geometry. | |
| Footer/logo/frame | PNG | PowerPoint master decoration | simple | omit_with_reason | not rendered | Master elements stay outside Content-SVGs. | |

## Design Brief

- canvas: `0 0 1920 1080`.
- content-svg mode: transparent-content.
- background mode: transparent.
- visual structure: left step label, right timeline, both vertically centered with generous outer air.
- brand tokens used: `brand/company-brand-tokens.json`.
- color roles: text/axis `#062D46`, accent `#139CCB`, failure red `#D1495B`, muted guide `#CBD5E1`.
- typography roles: `Inter`, `Segoe UI`, `Arial`, sans-serif; all visible text above minimum readability.
- spacing logic: no text boxes; labels keep clear distance from axis and arrowhead.
- reused/adapted components: none.
- plot generators and plot assets: none.
- generated or extracted assets: none.
- complex pictogram handling: none needed.
- animation layers: `step_label_group`, `axis`, `axis_label_group`, `failure_markers`, `failure_time_labels`.
- visible title decision: no visible global title, no slide/module kicker, no workflow note, no focus line.
- information density vs PowerPoint source: compact but equivalent for the first reveal state; non-content frame elements are removed.

## Timeline Positioning

| element_id | kind | position_mode | source_values_or_offsets | spacing_rationale |
|---|---|---|---|---|
| axis | failure_timeline | illustrative_irregular | x-axis from x=710 to x=1604 at y=620, arrowhead to x=1650 | No exact numeric source values are available; no ticks or numbers are invented. |
| failure_markers | failure_timeline | illustrative_irregular | marker centers x=800, 930, 1010, 1195, 1255, 1438, 1554 | Two mild clusters (`t2/t3`, `t4/t5`) plus larger gaps; last marker stays safely before arrowhead. |

## Text Budget

| element_id | planned_text | max_lines | min_padding_px | overflow_risk |
|---|---|---:|---:|---|
| step_marker | 0 | 1 | 16 | low |
| step_text | Sammeln der Ausfalldaten | 1 | 24 | low |
| axis_label_group | Lebensdauer t | 1 | 16 | low |
| failure_time_labels | t1 to t7 | 1 each | 12 | low |

## QA Risks

- asset classification: timeline is intentionally SVG-native.
- png/image asset paths: none.
- pictogram recognizability: none.
- axis labels: axis label must not touch arrowhead.
- plot labels/data source: no numeric values; ordinal `t_i` labels only.
- formula layout: none.
- text boxes: none.
- arrows and markers: line must stop before arrowhead; markers must not sit on arrowhead.
- overlap risks: clustered `t_i` labels must remain readable.
- animation target risks: every manifest target must exist in the SVG.

## Animation Coverage

| target_or_layer | source_or_spoken_trigger | initial_state | intended_action | reason |
|---|---|---|---|---|
| step_label_group | collecting failure data | visible | show | Names the first workflow action. |
| axis | visualize along the time axis | visible | draw | Supports sorting along the time axis. |
| axis_label_group | life-duration axis | visible | show | Names the axis once it is drawn. |
| failure_markers | failure data as time values | visible | show | Shows observed failures. |
| failure_time_labels | ordered failure times | visible | show | Makes the ordered time positions explicit. |

## Required Checks Before Release

- [x] SVG rendered through browser-based layout QA and inspected via deterministic geometry checks.
- [x] Content-SVG metadata is present in SVG metadata.
- [x] No PowerPoint master elements are embedded: slide number, footer, logo bar, presentation frame, deck header, or navigation.
- [x] Colors, typography, spacing, and semantic status colors follow `brand/company-brand-tokens.json`.
- [x] Asset decision table is complete for all relevant visual elements.
- [x] No visible global title, slide/module kicker, workflow note, or focus line.
- [x] The SVG is content-equivalent to the source slide state and sequence plan.
- [x] Information density is intentionally aligned with the PowerPoint source.
- [x] Failure timeline uses illustrative irregular spacing.
- [x] Animation manifest targets exist.
- [x] `node tools\svg-rebuild-qa.js RE3_TEST_1 --viewer --slides 1 --expect-all --strict-design` completed with 0 errors and 0 warnings.
- [x] `node tools\svg-rebuild-qa.js RE3_TEST_1 --viewer --slides 1 --expect-all --strict-design --layout --layout-strict` completed with 0 errors and 0 warnings outside the sandbox, because the sandboxed browser launch was unavailable.
