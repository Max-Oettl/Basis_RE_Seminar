# RE3_TEST_1 g01 SVG Rebuild Review - Restart

## Work Unit

- Work unit: `g01_basic_weibull_workflow`
- Source slides: 1-6
- Final source state: slide 6
- SVG: `rebuild-proposals/svg/RE3_TEST_1/g01_basic_weibull_workflow.svg`
- Animation manifest: `rebuild-proposals/svg/RE3_TEST_1/scene.animation.v1.json`
- Viewer URL: `http://127.0.0.1:4174/#RE3_TEST_1%3A%3A1`

## Reset

The previous SVG proposals in `rebuild-proposals/svg/RE3_TEST_1/` were deleted before this restart.

This review covers only the newly rebuilt g01 work unit. Slides 2-6 should use the same master SVG as animation aliases.

## Alignment Check

- Existing slide structure preserved as anchor: process steps on the left, plot on the right.
- Visible PowerPoint title omitted because the SVG is only the graphic body.
- Speaker text coverage checked:
  - failure times are sorted on a time axis
  - median-rank approximation is shown
  - each `t_i` receives an `F(t_i)`
  - values are plotted in Weibull probability paper
  - red points are not perfectly collinear
  - blue fitted line is shown
  - T is read at `F = 63,2 %`
  - b is derived from slope

## Creative Concept

The selected concept is source-guided rather than fully reinterpreted:

- stay close to source slide 6 for easier comparison
- make the sequence beginner-friendly by separating the spoken steps
- keep text short and avoid a generic summary box
- use animation layers to represent the original PowerPoint build sequence

## Visual Review

Issues found and fixed during render review:

- The first mapping arrow was too dominant and cut through the left label area.
- The plot title was too close to the y-axis arrowhead.
- The extra value-pair label was too close to the next process step and was removed.

Final visual state:

- No visible PowerPoint title.
- Formula text remains inside its light panel with visible padding.
- Left process labels do not overflow.
- Y-axis label is centered and vertical.
- Plot has no general percentage tick labels; only the required `F = 63,2 %` guide remains.
- Red points scatter around the blue fitted line.
- T and b guides are attached to the blue fitted line.

## Technical Check

- SVG XML valid: yes
- Animation JSON valid: yes
- Animation targets found in SVG: 9/9
- Animation steps: 9
- Rendered visually with Edge/Playwright: yes
- Render PNG save to `analysis/render-checks` failed because the renderer process had no write permission; visual inspection was still performed from the emitted render.

## Status

Ready for user review as the first restarted workflow candidate.
