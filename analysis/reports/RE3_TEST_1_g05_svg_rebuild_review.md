# RE3_TEST_1 g05 SVG Rebuild Review

## Ergebnis

- Work unit: `g05_method_selection`
- Source slide: 12
- Output SVG: `rebuild-proposals/svg/RE3_TEST_1/g05_method_selection/g05_method_selection_012.svg`
- Animation manifest: `rebuild-proposals/svg/RE3_TEST_1/g05_method_selection/scene.animation.v1.json`

## Source And Narration Alignment

- The familiar time axis and Weibull plot remain as source context.
- `Grafische Methode`, `Berechnungs-Methoden`, `MLS`, and `MLE` are retained.
- The PowerPoint title is omitted.
- The scene supports the narration point that a line can be determined visually or by a calculation/regression method.

## Visual Review

- Rendered in Edge at 1920 x 1080.
- The graphical and calculation methods are visually separated.
- MLS and MLE are clearly placed as submethods inside the calculation-method card.
- Text stays inside cards with visible padding.
- All visible groups stay inside the canvas.

## Corrections During Review

- The first version had a too-long sentence inside the calculation-method card.
- The MLS/MLE boxes originally extended below the calculation-method card.
- The calculation card was enlarged and the sentence shortened.
- Viewer feedback for slide 12 requested a generated image for the calculator at `Berechnungs-Methoden`.
- The hand-built SVG calculator icon was removed and replaced with `assets/scenes/RE3_TEST_1/pictograms/method-calculation.png`.
- For visual consistency, the graphical-method card now also uses the generated PNG asset `assets/scenes/RE3_TEST_1/pictograms/method-graph.png` instead of the small SVG-native plot icon.
- The PNG icons were scaled after visual review so their visible content reads clearly without colliding with card text.
- Follow-up feedback noted that the first calculator PNG still looked too SVG-like.
- The calculation-method card now uses the new pictogram-style PNG `assets/scenes/RE3_TEST_1/pictograms/method-calculation-pictogram.png`.
- The pictogram source with chroma-key background is retained as `assets/scenes/RE3_TEST_1/pictograms/method-calculation-pictogram-source.png`.
- The transparent pixels were normalized after chroma-key removal so no green background appears in simple previews.

## Technical Checks

- SVG parses as XML.
- Animation manifest parses as JSON.
- All five animation targets exist in the SVG.
- PNG assets are embedded through local `<image>` references and are inlined by the Basis Rebuild Viewer server when served.
- Automated SVG QA after slide 12 viewer-note implementation:
  - command: `node tools\svg-rebuild-qa.js RE3_TEST_1 --viewer --slides 12 --expect-all`
  - result: 0 errors, 0 warnings
- Automated SVG QA after switching to the final pictogram-style calculator PNG:
  - command: `node tools\svg-rebuild-qa.js RE3_TEST_1 --viewer --slides 12 --expect-all`
  - result: 0 errors, 0 warnings

## Status

`ready_for_user_review`
