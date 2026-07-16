# Module Sequence Plan

## Module

- module_id: RE3_TEST_1
- source_pptx: source-materials/basis-seminar/pptx/Modul_3_RE3_Test_1.pptx
- source_pdf: source-materials/basis-seminar/pdf/Modul_3_RE3_Test_1.pdf
- source_png_dir: source-materials/basis-seminar/png/Modul_3_RE3_Test_1_PNG
- narration_file: source-materials/basis-seminar/narration/RE3_TEST_1/Modul_3_Test_1.md
- analysis_json_dir: analysis/slides
- created_at: 2026-07-09
- restarted_at: 2026-07-09
- planning_status: review
- production_scope: Content-SVGs for PowerPoint embedding; no PowerPoint master elements inside generated SVGs.
- source_reference_map: analysis/rebuild-plans/RE3_TEST_1_source-reference-map.json

## Source Sweep

One row per old source slide. The visible PowerPoint title is a source-frame element and must not become a visible SVG title.

| source_slide | old_state_summary | standalone_or_sequence_state | new_since_previous | removed_or_changed | builds_on | prepares_later_state | animation_candidates | transition_need | key_assets | spoken_text_anchor | risks_or_questions |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Failure times are collected and shown on a time axis. | build | Initial state of the workflow. | none | none | Median-rank and probability mapping. | failure markers, time axis, step labels | draw/fade | native_svg timeline | Folie 1 / Aufbaufolge | Failure markers must be irregular, not evenly spaced. |
| 2 | Median-rank formula explains how F(t_i) is approximated. | reveal | Formula block and probability axis appear. | Time axis remains as anchor. | slide 1 | Hilfslinien and F(t_i) values. | formula asset, y-axis, explanation labels | fade/draw | formula_svg, native_svg axes | Folie 1 / Aufbaufolge | Formula must be LaTeX/SVG asset, not rough SVG text. |
| 3 | Computed F(t_i) helper lines connect probability values to failure times. | removed_after_review | Not produced as standalone Content-SVG. | Helper-line idea is absorbed into the surrounding build sequence. | slide 2 | Data points in probability plot. | none in current set | none | no current SVG output | Folie 1 / Aufbaufolge | Removed because it does not fit the new slide sequence as a separate module. |
| 4 | F(t_i) points are placed in the diagram. | reveal | Red points replace/complete helper construction. | Helper lines are reduced or become contextual. | slide 2 | Regression line. | points, point labels, optional helper fade | fade/draw | python_plot_library | Folie 1 / Aufbaufolge | Points should stay plausible and irregular. |
| 5 | A regression line is fitted through the points. | reveal | Regression line and line callout appear. | Formula panel should no longer dominate. | slide 4 | Weibull parameter readout. | regression line, label, point emphasis | draw/fade | python_plot_library | Folie 1 / Aufbaufolge | Line must geometrically match point cloud. |
| 6 | Weibull parameters are read from line slope and F = 63.2 %. | final_state | T marker, F = 63.2 % guide, b slope bracket and parameter notes appear. | Earlier construction becomes background. | slide 5 | Weibull function and example calculation. | T guide, b bracket, parameter formulas | draw/fade | formula_svg, python_plot_library | Folie 1 / Aufbaufolge | Must explain T and b without crowding. |
| 7 | Timeline and probability plot lead to Weibull function with T = 8, b = 3 and F(10) example. | standalone/detail_reveal | Formula and example result appear beside the plot. | Workflow step list is gone. | slides 1-6 | Context for using fitted Weibull distribution. | formula reveal, parameter callouts, example value | fade | formula_svg, weibull plot asset | Folie 1 / Aufbaufolge continuation | Formula layout must be high quality and readable. |
| 8 | Simplified state keeps timeline and Weibull plot, without formula block. | removed_after_review | Not produced as standalone Content-SVG. | Bridge state is skipped instead of kept as an underfilled slide. | slide 7 | Sonderfaelle and method topics. | none in current set | none | no current SVG output | Folie 1 closing transition | Removed because it does not add a fitting standalone content module. |
| 9 | Mixed failure mechanisms A and B are separated into two timelines and two trend lines. | standalone | Adds colored mechanisms and split logic. | Previous single-mechanism context changes to two mechanisms. | slide 7 | Methodological caveat: do not mix mechanisms. | split timelines, colored trend lines | reveal/split | weibull_mechanism_split_plot, native_svg timelines | Sprechertext Sonderfaelle implied after Folie 1 | Use colors consistently; avoid evenly spaced mechanism times. |
| 10 | Failure times are mapped to object numbers in an object-time diagram. | build | Object axis appears on the right. | Mechanism split no longer shown. | slide 9 | Censored observations. | object rows, failure crosses | draw/fade | native_svg object-time diagram | Sprechertext Sonderfaelle implied | Object rows must align; axis labels must stay readable. |
| 11 | Censored observations are added as blue arrows on timeline and object rows. | reveal | Blue censoring arrows appear. | Failure crosses remain. | slide 10 | Need for methods that handle censoring. | censoring arrows, label | fade/draw | native_svg object-time diagram | Sprechertext Sonderfaelle implied | Censor arrows must be distinct from failures. |
| 12 | Graphical method and calculation methods MLS/MLE are positioned as choices. | standalone | Method decision tree appears. | Object-time diagram is gone. | slides 10-11 | Analysis method selection. | method labels, arrows, icons | reveal/highlight | native_svg decision graphic or PNG icons if complex | Sprechertext Sonderfaelle implied | Tool icons should not be improvised if complex. |
| 13 | Weibull plot with 5 % and 95 % confidence limits is introduced. | standalone/detail_reveal | Confidence boundaries and limit labels appear. | Method tree is gone. | slide 12 | Uncertainty discussion. | confidence limit curves, labels | delayed reveal | weibull_confidence_plot | Sprechertext Sonderfaelle implied | Must use canonical non-parallel 5 % / 95 % confidence curves. |

## Sequence Groups

| group_id | mode | source_slides | final_source_state | output_strategy | initial_visible_elements | animated_elements | transitions_to_preserve | dependencies | notes |
|---|---|---|---|---|---|---|---|---|---|
| RE3T1_G01_life_data_workflow | build_sequence | 1-6 | slide 6 | Per-slide Content-SVGs for this rebuild; keep geometry consistent enough to become one master later. | failure timeline / axes | formula, helper lines, points, regression line, T guide, b bracket | draw and reveal sequence from data to Weibull parameters | none | This is the main setup. Rebuild starts from source PNG/PDF/PPTX context, not from old SVG proposals. |
| RE3T1_G02_weibull_function | detail_reveal | 7 | slide 7 | single_svg | timeline and probability plot | parameter labels, Weibull function, F(10) result | formula reveal | RE3T1_G01_life_data_workflow | Use formula SVG assets, no hand-written formula text. |
| RE3T1_G03_context_reset | removed_after_review | 8 | none | no current SVG output | none | none | skipped | RE3T1_G02_weibull_function | Removed as an underfilled bridge state. |
| RE3T1_G04_mechanism_split | standalone | 9 | slide 9 | single_svg | mixed timeline and Weibull plot | split into A/B timelines and two trend lines | split/reveal | RE3T1_G02_weibull_function | Prefer existing mechanism split Python plot asset for true plot. |
| RE3T1_G05_censoring | build_sequence | 10-11 | slide 11 | per-slide SVG previews, shared geometry | object-time rows and failures | censoring arrows and label | reveal censored observations | RE3T1_G04_mechanism_split | Timelines are SVG-native, not Python plots. |
| RE3T1_G06_method_choice | standalone | 12 | slide 12 | single_svg | method categories | MLS/MLE branches | reveal/highlight | RE3T1_G05_censoring | Pictogram complexity must be checked before SVG line icons. |
| RE3T1_G07_confidence_limits | detail_reveal | 13 | slide 13 | single_svg with animatable confidence-limit layers | Weibull plot with fit | 5 % and 95 % confidence limits | delayed confidence-limit reveal | RE3T1_G06_method_choice | Use canonical confidence plot generator/style. |

## Content Equivalence

| scope | source_content_to_preserve | allowed_repackaging | not_allowed |
|---|---|---|---|
| slides 1-6 | Data collection, median-rank formula, F(t_i) mapping, points, regression line, T and b readout. | Merge as one build sequence with consistent geometry and animation layers; individual slide SVGs can be preview states. | Dropping formula support, removing parameter readout, or replacing the probability plot with a vague decorative sketch. |
| slide 7 | Weibull function context, T = 8, b = 3, F(10) example. | Use large formula SVGs and a Python-generated context plot. | Using ASCII-style formulas or keeping an underfilled bridge slide as standalone output. |
| slide 9 | Mixed mechanisms A/B, separate timelines, two trend lines. | Native SVG timelines plus Python plot for mechanism trends. | Evenly spacing failures or drawing trend lines as arbitrary SVG lines when they represent a plot. |
| slides 10-11 | Object-time mapping, failure crosses, censored observations. | Native SVG object-time diagram with separate failure and censoring layers. | Confusing censoring arrows with failures or moving object rows between states. |
| slide 12 | Graphical method vs calculation methods, MLS and MLE. | Native SVG decision graphic with simple symbols or approved image assets. | Improvised complex tool icons that distract from the method choice. |
| slide 13 | Weibull fit plus 5 % and 95 % confidence limits. | Canonical Python confidence plot with animatable confidence-limit curves. | Parallel placeholder confidence lines or filled bands when limits are requested. |

## Planned SVG Work Units

This is the binding planning layer before SVG production. It records how each later Content-SVG should be built; it is not the implementation itself.

| work_unit | source_slides | sequence_group_id | planned_output_svg | planned_manifest | output_kind | content_scope | visual_build_plan | layout_and_representation | omitted_master_elements | continuity_requirements | qa_focus |
|---|---|---|---|---|---|---|---|---|---|---|---|
| slide_001 | 1 | RE3T1_G01_life_data_workflow | rebuild-proposals/svg/RE3_TEST_1/slide_001/slide_001.svg | rebuild-proposals/svg/RE3_TEST_1/slide_001/scene.animation.v1.json | single_svg | content-svg | Step 0 label plus irregular failure timeline. | Native SVG timeline, transparent background, large readable labels. | source title, footer, logo, frame, slide number, step 1 teaser if it distracts. | establishes marker positions and axis style for slides 2-6. | irregular spacing, no global title, animation targets. |
| slide_002 | 2 | RE3T1_G01_life_data_workflow | rebuild-proposals/svg/RE3_TEST_1/slide_002/slide_002.svg | rebuild-proposals/svg/RE3_TEST_1/slide_002/scene.animation.v1.json | single_svg | content-svg | Keep failure timeline, add step 1 and Median-Rank formula/probability axis. | Native SVG composition plus embedded formula SVG asset. | source title, footer, logo, frame, slide number. | reuse slide 001 timeline geometry. | formula readability, image href, text fit. |
| slide_004 | 4 | RE3T1_G01_life_data_workflow | rebuild-proposals/svg/RE3_TEST_1/slide_004/slide_004.svg | rebuild-proposals/svg/RE3_TEST_1/slide_004/scene.animation.v1.json | single_svg | content-svg | Convert construction into visible red F(t_i) points. | Python-generated probability construction plot; scene SVG adds callouts/layering. | source title, footer, logo, frame, slide number. | same shared data/axis contract as slide 002 and later Weibull plots. | points on correct intersections, labels readable. |
| slide_005 | 5 | RE3T1_G01_life_data_workflow | rebuild-proposals/svg/RE3_TEST_1/slide_005/slide_005.svg | rebuild-proposals/svg/RE3_TEST_1/slide_005/scene.animation.v1.json | single_svg | content-svg | Add regression line through the same F(t_i) point cloud. | Python-generated Weibull/probability plot with fit line; scene SVG adds didactic callouts. | source title, footer, logo, frame, slide number. | point cloud must not change from slide 004. | line fit, no geometry drift. |
| slide_006 | 6 | RE3T1_G01_life_data_workflow | rebuild-proposals/svg/RE3_TEST_1/slide_006/slide_006.svg | rebuild-proposals/svg/RE3_TEST_1/slide_006/scene.animation.v1.json | single_svg | content-svg | Add T readout at F=63.2% and b/slope interpretation. | Python-generated parameter plot plus formula SVG assets for parameter definitions. | source title, footer, logo, frame, slide number. | regression line and point cloud stable from slide 005. | T guide alignment, b bracket, formula legibility. |
| slide_007 | 7 | RE3T1_G02_weibull_function | rebuild-proposals/svg/RE3_TEST_1/slide_007/slide_007.svg | rebuild-proposals/svg/RE3_TEST_1/slide_007/scene.animation.v1.json | single_svg | content-svg | Show timeline-to-distribution transformation, T=8, b=3, Weibull function and F(10) example. | Python-generated Weibull context plot plus embedded formula SVGs; tool pictogram only if asset-based and useful. | source title, footer, logo, frame, slide number. | builds from parameters derived in slide 006. | high-quality formula SVGs, no ASCII math. |
| slide_009 | 9 | RE3T1_G04_mechanism_split | rebuild-proposals/svg/RE3_TEST_1/slide_009/slide_009.svg | rebuild-proposals/svg/RE3_TEST_1/slide_009/scene.animation.v1.json | single_svg | content-svg | Split mixed failures into mechanism A and B timelines and separated Weibull trends. | Native SVG timelines plus Python-generated mechanism split plot for trend lines. | source title, footer, logo, frame, slide number. | starts directly after slide 007; no separate bridge slide 008. | red/blue mapping, irregular failure positions, plot legibility. |
| slide_010 | 10 | RE3T1_G05_censoring | rebuild-proposals/svg/RE3_TEST_1/slide_010/slide_010.svg | rebuild-proposals/svg/RE3_TEST_1/slide_010/scene.animation.v1.json | single_svg | content-svg | Map failure times to object-number rows. | Native SVG object-time diagram, no Python plot. | source title, footer, logo, frame, slide number. | resets from mechanism split to censoring context. | row alignment, failure crosses, axis labels. |
| slide_011 | 11 | RE3T1_G05_censoring | rebuild-proposals/svg/RE3_TEST_1/slide_011/slide_011.svg | rebuild-proposals/svg/RE3_TEST_1/slide_011/scene.animation.v1.json | single_svg | content-svg | Add censored observations as blue arrows on the same object-time rows. | Native SVG object-time diagram with separate censoring layer. | source title, footer, logo, frame, slide number. | exact row geometry from slide 010. | censoring arrows distinct from failures, labels readable. |
| slide_012 | 12 | RE3T1_G06_method_choice | rebuild-proposals/svg/RE3_TEST_1/slide_012/slide_012.svg | rebuild-proposals/svg/RE3_TEST_1/slide_012/scene.animation.v1.json | single_svg | content-svg | Present method choice: graphical method, calculation methods, MLS and MLE. | Native SVG decision graphic; complex method/tool pictograms only as PNG assets. | source title, footer, logo, frame, slide number. | follows censoring as motivation for method selection. | branch clarity, no improvised complex icon. |
| slide_013 | 13 | RE3T1_G07_confidence_limits | rebuild-proposals/svg/RE3_TEST_1/slide_013/slide_013.svg | rebuild-proposals/svg/RE3_TEST_1/slide_013/scene.animation.v1.json | single_svg | content-svg | Show Weibull plot with 5% and 95% confidence limits. | Python confidence plot generator with canonical non-parallel limit curves; labels/callouts in scene SVG if needed. | source title, footer, logo, frame, slide number. | uncertainty topic follows method choice. | confidence curves not parallel, labels large, optional delayed reveal. |

## Visual Asset And Plot Plan

| work_unit_or_group | visual_element | semantic_role | planned_strategy | generator_or_source | planned_target_path | animation_need | open_question |
|---|---|---|---|---|---|---|---|
| slide_001-006 | failure timeline and t_i labels | stable observed failure order | native_svg | timeline workflow | inside each slide SVG | draw/reveal | exact source times unknown; use illustrative irregular spacing consistently. |
| slide_002 | Median-Rank formula | calculation of failure probabilities | formula_svg | assets/formulas/RE3_TEST_1/median_rank.svg or regenerate via formula library | assets/formulas/RE3_TEST_1/median_rank.svg | reveal | verify formula crop and relative path when embedded. |
| slide_004-006 | F(t_i) points and Weibull progression | mapping probabilities to lifetime axis | python_plot_library or new_python_plot_generator | components/python-plot-library/weibull_probability_plot.py or a new probability-construction generator | assets/plots/RE3_TEST_1/ | draw/reveal | keep t_i coordinates consistent across all plot stages. |
| slide_005-006 | regression line and parameter guides | derive Weibull parameters | python_plot_library | components/python-plot-library/weibull_probability_plot.py and/or weibull_parameter_plot.py | assets/plots/RE3_TEST_1/ | draw/reveal | no SVG-native plot geometry for fitted line or parameter readout. |
| slide_006-007 | T and b formulas | parameter meaning | formula_svg | assets/formulas/RE3_TEST_1/weibull_parameter_t.svg and weibull_parameter_b.svg | assets/formulas/RE3_TEST_1/ | reveal | check German labels around assets. |
| slide_007 | Weibull function and example | translate parameters into F(t) | formula_svg | assets/formulas/RE3_TEST_1/weibull_function.svg and weibull_example_value.svg | assets/formulas/RE3_TEST_1/ | reveal | formula must remain large when scaled in PowerPoint. |
| slide_007 | Weibull context plot | show distribution relation | python_plot_library | components/python-plot-library/weibull_probability_plot.py or dedicated context generator | assets/plots/RE3_TEST_1/ | reveal | no visible plot title. |
| slide_009 | mechanism A/B timelines | separate mixed mechanisms | native_svg | timeline workflow | inside slide SVG | split/reveal | choose colors from brand/status tokens. |
| slide_009 | mechanism split plot | show two different trend lines | python_plot_library | components/python-plot-library/weibull_mechanism_split_plot.py | assets/plots/RE3_TEST_1/ | reveal | keep A/B colors consistent with timelines. |
| slide_010-011 | object-time diagram | show failures and censoring by object | native_svg | timeline workflow | inside slide SVG | draw/reveal | none. |
| slide_012 | method decision graphic | classify graphical vs calculation methods | native_svg | source PNG and asset decision gate | inside slide SVG | reveal/highlight | simple symbols only; complex icons require PNG assets. |
| slide_013 | Weibull confidence plot | show uncertainty bounds | python_plot_library | components/python-plot-library/weibull_confidence_plot.py | assets/plots/RE3_TEST_1/ | delayed reveal for confidence curves | canonical 5% / 95% non-parallel curves are mandatory. |

## Dependency Map

| later_unit | depends_on | dependency_type | reason | consequence_for_svg_or_manifest |
|---|---|---|---|---|
| slides 2-6 | slide 1 | visual_continuity/animation | Same workflow graphic is built step by step. | Reuse positions, colors, marker style and axis logic. |
| slide 5 | slide 4 | visual_continuity/data | Regression line must fit the points already shown. | Do not re-randomize the point cloud. |
| slide 6 | slide 5 | formula/data/animation | T and b are read from the fitted line. | T guide and b bracket must align to the regression line. |
| slide 7 | slide 6 | formula/data | Weibull function uses derived T and b. | Parameter labels and formula assets must match T = 8 and b = 3. |
| slide 9 | slide 7 | source_context | Sonderfall: mixed mechanisms follows directly after the Weibull function slide. | Do not insert separate bridge slide 8. |
| slide 11 | slide 10 | animation | Censoring is an added layer. | Same object rows and failure points; add blue censoring layer. |
| slide 13 | slide 12 | source_context | Method/uncertainty topic follows method selection. | Confidence boundaries should appear as uncertainty layer, not as filled band. |

## Animation And Transition Plan

| group_id | trigger_order | trigger_type | element_or_layer | intended_effect | timing_note | manifest_target_needed |
|---|---:|---|---|---|---|---|
| RE3T1_G01_life_data_workflow | 1 | time/user | failure timeline | draw/reveal | start of sequence | yes |
| RE3T1_G01_life_data_workflow | 2 | time/user | median-rank formula | fade_in | after data sorting | yes |
| RE3T1_G01_life_data_workflow | 3 | time/user | F(t_i) helper lines | draw | after formula explanation | yes |
| RE3T1_G01_life_data_workflow | 4 | time/user | F(t_i) points | fade_in | after helper lines | yes |
| RE3T1_G01_life_data_workflow | 5 | time/user | regression line | draw | after points are visible | yes |
| RE3T1_G01_life_data_workflow | 6 | time/user | T and b readouts | draw/fade_in | final workflow step | yes |
| RE3T1_G02_weibull_function | 1 | time/user | Weibull formula and example | fade_in | after plot context | yes |
| RE3T1_G03_context_reset | 1 | cut/manual | formula area | fade_out/cut | transition to Sonderfaelle | yes if produced |
| RE3T1_G04_mechanism_split | 1 | time/user | split A/B timelines | reveal/split | after mixed timeline | yes |
| RE3T1_G05_censoring | 1 | time/user | censored arrows | fade_in/draw | after failures mapped to objects | yes |
| RE3T1_G06_method_choice | 1 | time/user | MLS/MLE branches | reveal | after methods headline | yes |
| RE3T1_G07_confidence_limits | 1 | time/user | 5 % / 95 % confidence limit curves | fade_in | often delayed, e.g. after 3 s | yes |

## Preflight Asset Outlook

| asset_need | appears_in_slides | type | likely_strategy | library_or_source | open_question |
|---|---|---|---|---|---|
| Median-rank formula | 2 | formula_svg | existing formula asset or regenerate via formula workflow | assets/formulas/RE3_TEST_1/median_rank.svg | Need verify relative href in slide SVG. |
| Weibull parameter formulas | 6-7 | formula_svg | existing/regenerate via formula workflow | assets/formulas/RE3_TEST_1 | Must use readable math SVG, not inline ASCII formula. |
| Weibull probability plot / regression | 4-7 | python_plot | Python plot for points, regression and context plot. SVG-native elements may add callouts only. | components/python-plot-library/weibull_probability_plot.py or new probability-construction generator | Keep labels large, animation targets stable and shared data/axis contract consistent. |
| Weibull parameter readout | 6 | python_plot/formula_svg | use parameter plot generator plus formula SVG assets | components/python-plot-library/weibull_parameter_plot.py | Keep labels large. |
| Mechanism split plot | 9 | python_plot | use existing generator/asset | components/python-plot-library/weibull_mechanism_split_plot.py | Ensure red/blue mapping matches timelines. |
| Censoring object-time diagram | 10-11 | native_svg | SVG-native timeline/object rows | workflow/33-timelines/timeline-workflow.md | Irregular times; censoring arrows distinct. |
| Method icons | 12 | native_svg/generated_png | simple symbols SVG-native; complex tools as PNG | svg asset decision gate | Do not improvise complex pictograms. |
| Confidence limits | 13 | python_plot | canonical confidence generator | components/python-plot-library/weibull_confidence_plot.py | Must be non-parallel 5 % / 95 % boundary curves. |

## Production Order

| order | work_unit | source_slides | reason_for_order | expected_output | qa_focus |
|---:|---|---|---|---|---|
| 1 | slide_001 | 1 | Initial state of main workflow. | slide_001.svg + manifest | Irregular failure markers, no global title. |
| 2 | slide_002 | 2 | Formula depends on data axis. | slide_002.svg + manifest | Formula SVG readability and href. |
| 3 | slide_004 | 4 | Points follow directly after Median-Rank calculation; slide_003 removed after review. | slide_004.svg + manifest | Point geometry and text fit. |
| 4 | slide_005 | 5 | Regression depends on same point cloud. | slide_005.svg + manifest | Line fit, no new point randomization. |
| 5 | slide_006 | 6 | Parameter readout depends on line. | slide_006.svg + manifest | T/b alignment, formula assets. |
| 6 | slide_007 | 7 | Function result uses T and b. | slide_007.svg + manifest | LaTeX/formula layout. |
| 7 | slide_009 | 9 | Mechanism special case follows directly after slide_007; slide_008 removed after review. | slide_009.svg + manifest | Python plot, color mapping. |
| 8 | slide_010 | 10 | Start censoring sequence. | slide_010.svg + manifest | Object-row alignment. |
| 9 | slide_011 | 11 | Adds censoring layer. | slide_011.svg + manifest | Censoring arrows vs failures. |
| 10 | slide_012 | 12 | Method selection. | slide_012.svg + manifest | Icon/branch clarity. |
| 11 | slide_013 | 13 | Confidence-limit special case. | slide_013.svg + manifest | Canonical confidence curves, labels readable. |

## Checks Before SVG Production

- [x] Every old source slide has one `Source Sweep` row.
- [x] Build, reveal, morph, duplicate, and standalone states are classified.
- [x] Every sequence group has a final source state.
- [x] Every planned SVG work unit has an output path, output kind, content scope, continuity note, and QA focus.
- [x] Content equivalence and information density are documented before production.
- [x] Every relevant diagram, formula, timeline, pictogram, image, process shape, and omitted master element appears in `Visual Asset And Plot Plan`.
- [x] Animation candidates are listed before SVG coding.
- [x] Transitions that matter for learning are listed.
- [x] Planned animation layers, trigger order, trigger type, intended effect, and timing notes are listed before SVG coding.
- [x] Every new Content-SVG has planned animation coverage or a documented exception.
- [x] Dependencies between groups are documented.
- [x] Likely Python plots, formula assets, timelines, and complex image assets are identified.
- [x] Production order is explicit.
- [x] Open questions are documented or accepted as assumptions.
