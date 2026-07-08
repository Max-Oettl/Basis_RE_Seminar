# RE3_TEST_1 g02 Scene Plan - Restart

## Work Unit

- Work unit: `g02_weibull_function_formula`
- Source slides: 7-8
- Final source state: slide 7
- Output: one master SVG with animation layers
- Viewer aliases: slide 8 should show the same master SVG as slide 7

## Alignment Note

### Source Slide Anchors

- Source slide 8 is an intermediate state: sorted failure times, tool/transfer symbol, and Weibull probability plot.
- Source slide 7 is the full state: it adds T, b, the Weibull function, and the example value.
- Visible source title is omitted from the SVG because the SVG is only the graphic body.
- Required source text:
  - `T -> 8`
  - `b -> 3`
  - `F(t) = 1 - e^{-(t/8)^3}`
  - `F(10) ≈ 85,8 %`
  - axis labels `Ausfallwahrscheinlichkeit` and `Lebensdauer`

### Spoken Text Points

- The available narration is not split by slides 7-8.
- Relevant narration anchor from the existing text: once the fitted Weibull line is available, the Weibull distribution can describe failure behavior and support forecasts for future failures.
- Therefore the graphic must make the conversion from the fitted line into a usable function explicit.

### Must Show In SVG

- Sorted time axis with irregular red failure crosses.
- Weibull probability plot with readable x/y labels and a red fitted line.
- A clear transformation/tool step from diagram to formula, using the generated PNG pictogram for the tool symbol rather than rebuilding the complex icon from SVG primitives.
- Parameters T and b as inputs to the function.
- Function and example value as the result.
- Slide 8's intermediate state must be represented by animation timing, not by a separate empty SVG.

### Allowed Reinterpretation

- Keep the source's quiet composition and generous whitespace.
- Make the formula block more legible than in the source and give it stable padding.
- Add a short beginner-friendly cue that parameters become a forecast formula.
- Avoid decorative summary boxes unless they clarify the conversion.

### Explicit Omissions

- No visible PowerPoint headline.
- No long explanation paragraph; speaker text carries the explanation.
- No hand-built SVG reconstruction of the source tool pictogram; complex pictograms must be generated or extracted as PNG assets and then embedded.

## Creative Scene Concept

### Beginner Assumption

The learner may understand the fitted line from the previous scene, but may not yet see why it matters. This scene should answer: "What can I do with T and b now?"

### Concept Options

1. Source-guided conversion
   - Structure: top data axis, left Weibull plot, center tool arrow, right formula result.
   - Animation: reveal plot first, then conversion, parameters, formula, example value.
   - Strength: close to source slides 7-8 and easy to compare.
   - Risk: right side can get cramped if the formula is too large.

2. Formula-first explanation
   - Structure: large formula in the center with the plot as a reference.
   - Strength: strong mathematical focus.
   - Risk: less beginner-friendly and less close to source.

3. Forecast machine
   - Structure: inputs T/b enter a simple machine, output F(10).
   - Strength: very didactic.
   - Risk: too far from the existing slides for this validation run.

### Recommended Option

Use option 1. It preserves the source composition while improving spacing, formula readability, and animation clarity.

## Asset Decision Gate

Decision source: `workflow/svg-asset-decision-gate.md`

| source_element | source_evidence | semantic_role | complexity | strategy | target_path | reason | blocking_question |
|---|---|---|---|---|---|---|---|
| sorted failure-time axis | source slides 7-8 PNG/PDF | show ordered failure times | medium | native_svg |  | diagram/process geometry; must remain editable and animatable |  |
| Weibull probability plot | source slides 7-8 PNG/PDF, speaker text | connect fitted line to later function | complex | python_plot_library | components/python-plot-library/weibull_probability_plot.py; output asset under assets/plots/RE3_TEST_1/ | chart geometry should be calculated from Python and rendered as a plot asset |  |
| screwdriver and open-end wrench pictogram | viewer note for slide 7, source slide 8 PNG/PDF | visual cue for transforming plot into parameters | complex | generated_png | assets/scenes/RE3_TEST_1/pictograms/tool-transform-screwdriver-wrench.png | concrete tool pictogram; no hand-built SVG line/path replacement |  |
| parameter chips T and b | source slide 7 PNG/PDF | show values read from plot | simple | native_svg |  | text and panel geometry should stay editable |  |
| Weibull function and example value | source slide 7 PNG/PDF, speaker text | final usable forecast formula | medium | native_svg |  | formula text must be readable and editable |  |

## Design Brief

- Canvas: 1920 x 1080.
- No visible PowerPoint title.
- Layout:
  - upper left/middle: sorted failure-time axis
  - lower left: Weibull probability plot
  - center: compact tool/transfer step and arrow
  - right: formula panel with parameters, function, and example
- Text budget:
  - no paragraph longer than two short lines
  - formula panel has at least 28 px padding
  - formula and example must remain fully inside the panel
- Plot rules:
  - y-axis label vertically centered beside the axis
  - x-axis label centered below the axis
  - red fitted line does not touch labels or axes
  - only necessary tick labels are used
- Animation layers:
  1. sorted failure times
  2. Weibull plot
  3. transfer/tool symbol
  4. parameters T and b
  5. function
  6. example value

## Review Focus

- Does slide 7 clearly contain all formula/parameter/example content from the source?
- Does slide 8 work as an earlier animation state of the same SVG?
- Are axis labels centered and close to their axes?
- Is the right formula panel spacious enough with no text overflow?
- Is the formula visually correct and readable?
- Is there no visible PowerPoint headline?
