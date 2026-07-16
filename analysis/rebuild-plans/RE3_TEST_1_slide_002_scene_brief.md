# SVG Scene Brief

## Work Unit

- module_id: RE3_TEST_1
- work_unit: slide_002
- sequence_plan: analysis/rebuild-plans/RE3_TEST_1_sequence_plan.md
- sequence_group_id: RE3T1_G01_life_data_workflow
- sequence_mode: build_sequence / reveal_step
- source_slides: 2
- final_source_state: Median-Rank formula and vertical construction axis are added to the collected failure timeline.
- previous_work_unit_or_state: slide_001 initial data-collection timeline
- next_work_unit_or_state: slide_003 helper lines from F(t_i) values to failure times
- output_svg: rebuild-proposals/svg/RE3_TEST_1/slide_002/slide_002.svg
- animation_manifest: rebuild-proposals/svg/RE3_TEST_1/slide_002/scene.animation.v1.json

## Content-SVG Metadata

```json
{
  "artifactScope": "content-svg",
  "embeddingTarget": "powerpoint-slide",
  "slideType": "build-sequence-reveal",
  "contentTitle": "Ausfallwahrscheinlichkeiten berechnen",
  "layoutIntent": "Continue the initial life-duration timeline and reveal the Median-Rank calculation plus the vertical construction axis.",
  "takeaway": "Nach dem Sammeln der Ausfallzeiten wird jedem geordneten Ausfall über die Median-Rank-Formel eine Ausfallwahrscheinlichkeit zugeordnet.",
  "audienceGoal": "Learners see that failure probabilities are calculated from rank number i and sample size n before points are plotted.",
  "density": "normal",
  "contentMode": "transparent-content",
  "backgroundMode": "transparent",
  "brandProfile": "reltest-academy",
  "brandVariant": "technical",
  "designException": ""
}
```

## Source And Spoken Text Alignment

### Source Slide Anchors

- Step marker `0` with `Sammeln der Ausfalldaten` remains visible.
- Step marker `1` with `Berechnen von Ausfallwahrscheinlichkeiten` is the new active step.
- The source adds the Median-Rank formula `F(t_i) = (i - 0,3)/(n + 0,4), i = 1,2,...,n`.
- The source adds the definitions `i -> Rangnummer des Ausfalls` and `n -> Stichprobengröße`.
- The source adds a vertical construction axis labeled `Summe der ausgefallenen Teile`.

### Must Show In SVG

- A Python-generated construction diagram because the visual now uses a y-axis and a technical x/y relationship.
- Irregular failure-marker positions remain visible through the Python plot.
- Median-Rank formula as a proper formula SVG asset, not hand-written ASCII math.
- German umlauts written as umlauts.
- No visible global PowerPoint title, footer, logo, slide number, frame, or navigation element.

## Asset Decision Gate

| source_element | semantic_role | strategy | target_path | reason |
|---|---|---|---|---|
| Step markers 0 and 1 | Process state | native_svg | slide_002.svg#workflow_steps | Simple editable circles/text. |
| Failure timeline plus construction y-axis | Technical construction diagram | python_plot | assets/plots/RE3_TEST_1/failure_probability_construction_slide_002.svg | A y-axis relationship makes this more than a pure one-axis timeline. |
| Median-Rank formula | Calculation rule | inline_formula_svg_from_asset | slide_002.svg#median_rank_formula_asset | The formula is embedded inline so the Content-SVG remains self-contained when inserted into PowerPoint. |
| Formula definitions | Beginner support labels | native_svg | slide_002.svg#formula_definitions | Short text, no math layout problem. |
| Source title/footer/logo | PowerPoint master/frame elements | omit_with_reason | not rendered | Content-SVG only. |

## Design Brief

- canvas: 1920 x 1080 viewBox, transparent content SVG.
- layout: source-oriented composition with steps and formula on the left, Python construction diagram on the right.
- continuity: failure times stay irregular and are rendered through the Python plot asset.
- typography: large seminar-readable labels, no small helper text.
- color roles: axis/text `#062D46`, muted text `#6A7A86`, accent `#139CCB`, failure red `#D1495B`, panel stroke `#CBD5E1`.
- formula handling: the Median-Rank formula is embedded inline as SVG text and fraction geometry; the formula asset remains the source reference, but no external formula image href is required.
- animation layers: `step_0`, `step_1`, `formula_panel`, `construction_plot`.

## QA Focus

- No broken external formula image reference is present.
- The formula is legible without a decorative outer box.
- The timeline markers are intentionally irregular and unchanged from slide_001.
- Axis labels do not collide with arrowheads.
- The construction diagram is generated from the Python plot library.
- Manifest target IDs exist in the SVG.
- No visible global slide title or PowerPoint master element is included.
