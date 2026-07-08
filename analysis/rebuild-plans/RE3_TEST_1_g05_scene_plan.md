# RE3_TEST_1 g05 Scene Plan - Restart

## Work Unit

- Work unit: `g05_method_selection`
- Source slide: 12
- Output: one SVG with animation layers

## Alignment Note

### Source Slide Anchors

- The familiar sorted time axis and Weibull plot remain on the left.
- The right side introduces method choices.
- Source labels to retain: `Grafische Methode`, `Berechnungs-Methoden`, `MLS`, `MLE`, `Ausfallwahrscheinlichkeit`, `Lebensdauer`.
- The PowerPoint title is omitted.

### Spoken Text Points

- The available narration mentions that the fitted line can be determined visually or by regression.
- This scene makes those method families explicit for beginners.

### Must Show In SVG

- Data and Weibull-plot context.
- A transition from data/plot to method choice.
- Separate route for graphical method.
- Separate route for calculation methods with MLS and MLE.

## Creative Scene Concept

Use a method switchboard: the learner already has data and a plot; now the course shows the two routes for estimating the Weibull parameters.

## Asset Decision Gate

Decision source: `workflow/svg-asset-decision-gate.md`

| source_element | source_evidence | semantic_role | complexity | strategy | target_path | reason | blocking_question |
|---|---|---|---|---|---|---|---|
| time axis and Weibull plot context | source slide 12 PNG/PDF | remind learner of previous data/plot context | medium | native_svg |  | diagram geometry and labels should stay editable and animatable |  |
| graphical method pictogram | source slide 12 PNG/PDF, generated asset manifest | visual cue for the visual method route | complex | generated_png | assets/scenes/RE3_TEST_1/pictograms/method-graph.png | method pictogram is an illustrative icon, not improvised SVG geometry |  |
| calculator pictogram for Berechnungs-Methoden | viewer note for slide 12, generated asset manifest | visual cue for calculation methods | complex | generated_png | assets/scenes/RE3_TEST_1/pictograms/method-calculation-pictogram.png | concrete calculator pictogram; must be embedded as PNG and read as pictogram style, not as hand-built SVG |  |
| MLS and MLE submethod boxes | source slide 12 PNG/PDF | show calculation submethods | simple | native_svg |  | text and boxes should remain editable and animate as SVG groups |  |

## Design Brief

- Canvas: 1920 x 1080.
- Left: compact source-style data and plot.
- Center: arrow to methods.
- Right: two large method cards.
- MLS and MLE are sub-options under calculation methods.
- Animation layers:
  1. data and plot context
  2. transition arrow
  3. graphical method
  4. calculation methods
  5. MLS/MLE submethods

## Review Focus

- Are the method cards readable at a glance?
- Are MLS and MLE clearly submethods of calculation methods?
- Does text stay inside cards with padding?
- Is there no visible PowerPoint headline?
