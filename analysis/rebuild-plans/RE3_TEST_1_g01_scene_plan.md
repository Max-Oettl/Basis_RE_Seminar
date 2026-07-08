# RE3_TEST_1 g01 Scene Plan - Restart

## Work Unit

- Work unit: `g01_basic_weibull_workflow`
- Source slides: 1-6
- Final source state: slide 6
- Output: one master SVG with animation layers
- Viewer aliases: slides 1-6 should show this master SVG

## Alignment Note

### Source Slide Anchors

- Existing slide structure: left-side numbered process list, right-side probability plot.
- Build sequence:
  - slide 1: sort failure times along a time axis
  - slide 2: introduce median-rank approximation
  - slide 3: map F(t_i) values into the diagram
  - slide 4: show point pairs in the plot
  - slide 5: add fitted/regression line
  - slide 6: read Weibull parameters T and b
- Final slide 6 anchors:
  - four-step process on the left
  - red failure points in the plot
  - blue fitted line
  - T read from the vertical line at F = 63.2 %
  - b shown as slope triangle/step on the fitted line

### Spoken Text Points

- We only have failure data as different lifetime values.
- The values are sorted by size and can be visualized along a time axis.
- For each time point, a failure probability is assigned.
- Because only time values are available, the probability is estimated with the median-rank approximation.
- Formula: F(t_i) = (i - 0.3) / (n + 0.4).
- This creates paired values from t_i and F(t_i).
- The paired values are plotted in Weibull probability paper with double-logarithmic representation.
- A fitted line is placed through the points, visually or by regression.
- Characteristic life T is read at F = 63.2 %.
- Shape parameter b is determined from the slope of the line.
- The result is a Weibull distribution that describes failure behavior and enables later forecasts.

### Must Show In SVG

- Sorted time axis with irregular failure marks.
- Median-rank formula as the bridge from time values to probabilities.
- Point-pair idea: each t_i receives one F(t_i).
- Weibull-style plot with red scattered points.
- Blue fitted line that is visibly an approximation, not a perfect connection of all points.
- T marker at the 63.2 % guide.
- b as slope indicator aligned to the blue line.
- Step list close to the source slide, but without the large PowerPoint title.

### Allowed Reinterpretation

- Keep the source composition, but reduce clutter and improve spacing.
- Make the process list more beginner-friendly with short labels and compact support text.
- Avoid percentage tick labels inside the plot except the necessary 63.2 % guide.
- Use cleaner axis labels and more generous margins than the original.

### Explicit Omissions

- Visible PowerPoint title is omitted because this repo creates the SVG graphic only.
- Long explanatory text about future forecasts is not placed as a box; the speaker text carries it.
- No generic summary box is added.

## Creative Scene Concept

### Beginner Assumption

The learner may not know Weibull probability paper, median rank, T, or b. The graphic must first show the path from raw times to usable point pairs before parameters appear.

### Concept Options

1. Source-guided process plus plot
   - Structure: close to final source slide, left process list and right diagram.
   - Animation: reveal time data, formula, point pairs, plot points, fitted line, T, b.
   - Strength: easy to compare with source and speaker text; keeps all spoken steps visible.
   - Risk: can become too dense if formula and process text are too large.

2. Data journey
   - Structure: a single row from time axis to formula to plot to parameters.
   - Animation: each failure time travels into the plot.
   - Strength: very beginner-friendly.
   - Risk: less close to existing slides and may omit the source list structure.

3. Plot-first explanation
   - Structure: large plot with small callouts for formula, T, and b.
   - Strength: strong visual focus.
   - Risk: median-rank method is less visible than in speaker text.

### Recommended Option

Use option 1. It best satisfies the new alignment rule: the result remains recognizable from the existing slides while becoming cleaner and more suitable for beginners.

## Design Brief

- Canvas: 1920 x 1080.
- No visible PowerPoint title.
- Layout:
  - left column: compact four-step process, aligned with source slide
  - top of right area: small sorted time axis
  - center/right: main Weibull plot
  - bottom/right: compact parameter readout for T and b
- Text budget:
  - process step title: max 2 lines, no paragraphs
  - formula card: one formula plus one short label
  - no text-heavy summary boxes
- Plot rules:
  - y-axis label centered and vertical
  - no general percentage tick labels in the plot
  - 63.2 % appears only as a guide label for T
  - red points scatter around the fitted line
  - b guide sits exactly on the blue line
  - T vertical guide hits the blue line at the 63.2 % guide
- Animation layers:
  1. sorted failure times
  2. median-rank formula
  3. point pairs and probability mapping
  4. Weibull plot frame
  5. failure points
  6. fitted line
  7. T readout
  8. b slope readout
  9. result state

## Review Focus

- Does the SVG still look derived from source slide 6?
- Does every spoken-text step have a visible support element?
- Are all box texts inside their boxes with visible padding?
- Is the y-axis label centered?
- Are the red points not perfectly collinear?
- Are T and b guides mathematically/geometrically attached to the blue line?
- Is there no visible PowerPoint title?
