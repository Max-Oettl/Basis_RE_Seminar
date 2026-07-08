# RE3_TEST_1 g02 SVG Rebuild Review

## Ergebnis

- Work unit: `g02_weibull_function_formula`
- Source slides: 7-8
- Final source state: slide 7
- Output SVG: `rebuild-proposals/svg/RE3_TEST_1/g02_weibull_function_formula/g02_weibull_function_formula_007.svg`
- Animation manifest: `rebuild-proposals/svg/RE3_TEST_1/g02_weibull_function_formula/scene.animation.v1.json`
- Viewer behavior: slide 8 aliases to slide 7 and shows the same animated SVG

## Source And Narration Alignment

- Slide 8 is treated as the intermediate state: sorted failure times, tool/transfer cue, and Weibull probability plot.
- Slide 7 is treated as the full state: parameters, Weibull function, and example value are added.
- The PowerPoint title is intentionally omitted.
- Required visible source content is represented:
  - sorted failure-time axis with `t1` to `t6`
  - `Ausfallwahrscheinlichkeit`
  - `Lebensdauer`
  - `T -> 8`
  - `b -> 3`
  - `F(t) = 1 - e^{-(t/8)^3}`
  - `F(10) ≈ 85,8 %`
- The narration is not split by slide 7-8. The scene supports the spoken transition from fitted Weibull distribution to mathematical description and forecast use.

## Visual Review

- Rendered in Edge at 1920 x 1080.
- Formula panel and example value are fully inside the panel.
- Axis labels are centered near their axes.
- The transfer arrow does not cover the formula panel.
- The source's quiet left-to-right structure is preserved without copying the PowerPoint title.

## Corrections During Review

- Parameter chips initially overlapped because label and value shared the same horizontal area.
- The explanation line in the formula panel initially overflowed the panel.
- Both issues were fixed by centering the chip labels/values and shortening the explanatory sentence.
- Viewer feedback from slide 7 noted that the original pictogram shows a screwdriver and an open-end wrench.
- The interim SVG-native tool drawing was removed because complex pictograms should not be hand-built from SVG primitives.
- The blue transfer marker now embeds the generated transparent PNG asset `assets/scenes/RE3_TEST_1/pictograms/tool-transform-screwdriver-wrench.png`.

## Technical Checks

- SVG parses as XML.
- Animation manifest parses as JSON.
- All six animation target IDs exist in the SVG.
- Viewer API check:
  - slide 7: SVG available, animation available, 6 steps
  - slide 8: alias for slide 7, SVG available, animation available, 6 steps
- Automated SVG QA after the initial pictogram revision:
  - command: `node tools\svg-rebuild-qa.js RE3_TEST_1 --viewer --slides 7-8 --expect-all`
  - result: 0 errors, 0 warnings
- Automated SVG QA after replacing the interim SVG-native tool drawing with the PNG asset:
  - command: `node tools\svg-rebuild-qa.js RE3_TEST_1 --viewer --slides 7-8 --expect-all`
  - result: 0 errors, 0 warnings
- Visual render check after PNG replacement:
  - image href resolves to `../../../../assets/scenes/RE3_TEST_1/pictograms/tool-transform-screwdriver-wrench.png`
  - inline `.tool-stroke` / `.tool-fill` count: 0
  - PNG background is transparent and the tool pictogram is visible inside the blue transfer marker
- Viewer display fix after broken-image placeholder feedback:
  - cause: the viewer served SVGs through `/files/...`, so the SVG-relative PNG path did not resolve in the browser context
  - fix: `tools/basis-rebuild-viewer/server.js` now inlines local `<image>` assets in served SVGs as data URLs
  - verification: viewer-served SVG for slide 7 contains one `data:image/png;base64,...` image and no unresolved `tool-transform-screwdriver-wrench.png` href
- Automated SVG QA now checks viewer-served SVGs for unresolved local `<image>` hrefs:
  - command: `node tools\svg-rebuild-qa.js RE3_TEST_1 --viewer --slides 7-8 --expect-all`
  - result: 0 errors, 0 warnings

## Status

`ready_for_user_review`
