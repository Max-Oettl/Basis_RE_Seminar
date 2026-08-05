# SVG QA Report - RE1

Generated: 2026-07-17T13:34:16.736Z

## Summary

- Files checked: 102
- Animation manifests checked: 77
- Layout files checked: 1
- Layout states checked: 4
- Design files checked: 1
- Design errors: 0
- Design warnings: 11
- Handoff scenes checked: 0
- Handoff manifests checked: 0
- Handoff errors: 0
- Handoff warnings: 0
- Errors: 0
- Warnings: 38

## Issues

- WARNING (rebuild-proposals/svg/RE1/slide_002/plots/recall_statistics.svg): ViewBox is not close to 16:9.: 938.219531x391.6
- WARNING (rebuild-proposals/svg/RE1/slide_007/plots/purchase_criteria.svg): ViewBox is not close to 16:9.: 1082.836875x411.877942
- WARNING (rebuild-proposals/svg/RE1/slide_010/plots/stress_strength.svg): ViewBox is not close to 16:9.: 843.001562x440.001406
- WARNING (rebuild-proposals/svg/RE1/slide_011/plots/stress_strength.svg): ViewBox is not close to 16:9.: 843.001562x440.001406
- WARNING (rebuild-proposals/svg/RE1/slide_012/plots/stress_strength.svg): ViewBox is not close to 16:9.: 843.001562x440.001406
- WARNING (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): ViewBox is not close to 16:9.: 900.730313x411.201406
- WARNING (rebuild-proposals/svg/RE1/slide_027/plots/woehler.svg): ViewBox is not close to 16:9.: 837.571875x457.12
- WARNING (rebuild-proposals/svg/RE1/slide_028/plots/histogram_density.svg): ViewBox is not close to 16:9.: 965.13158x360.808219
- WARNING (rebuild-proposals/svg/RE1/slide_029/plots/woehler_3d.svg): ViewBox is not close to 16:9.: 550.250001x454.32
- WARNING (rebuild-proposals/svg/RE1/slide_030/plots/nkw_density.svg): ViewBox is not close to 16:9.: 838.091094x456.68
- WARNING (rebuild-proposals/svg/RE1/slide_031/plots/human_density.svg): ViewBox is not close to 16:9.: 838.154062x457.001406
- WARNING (rebuild-proposals/svg/RE1/slide_032/plots/empirical_cdf.svg): ViewBox is not close to 16:9.: 940.393781x381.500625
- WARNING (rebuild-proposals/svg/RE1/slide_033/formulas/cdf-derivative.svg): ViewBox is not close to 16:9.: 194.7x60.72
- WARNING (rebuild-proposals/svg/RE1/slide_033/formulas/cdf-integral.svg): ViewBox is not close to 16:9.: 309.36x82.98
- WARNING (rebuild-proposals/svg/RE1/slide_033/plots/smooth_cdf.svg): ViewBox is not close to 16:9.: 837.700625x457.12
- WARNING (rebuild-proposals/svg/RE1/slide_034/plots/nkw_cdf.svg): ViewBox is not close to 16:9.: 837.830781x456.68
- WARNING (rebuild-proposals/svg/RE1/slide_035/plots/human_cdf.svg): ViewBox is not close to 16:9.: 837.700625x457.001406
- WARNING (rebuild-proposals/svg/RE1/slide_036/formulas/failure-area-integral.svg): ViewBox is not close to 16:9.: 292.02x75.42
- WARNING (rebuild-proposals/svg/RE1/slide_036/formulas/reliability-area-integral.svg): ViewBox is not close to 16:9.: 296.58x73.14
- WARNING (rebuild-proposals/svg/RE1/slide_036/formulas/reliability-complement.svg): ViewBox is not close to 16:9.: 272x43.609375
- WARNING (rebuild-proposals/svg/RE1/slide_036/plots/reliability_partition.svg): ViewBox is not close to 16:9.: 837.896562x413.48
- WARNING (rebuild-proposals/svg/RE1/slide_037/formulas/hazard-ratio.svg): ViewBox is not close to 16:9.: 180.8x61.2
- WARNING (rebuild-proposals/svg/RE1/slide_037/plots/bathtub_curve.svg): ViewBox is not close to 16:9.: 900.48x410.88
- WARNING (rebuild-proposals/svg/RE1/slide_038/plots/human_hazard.svg): ViewBox is not close to 16:9.: 837.960938x457.001406
- WARNING (rebuild-proposals/svg/RE1/slide_039/plots/nkw_hazard.svg): ViewBox is not close to 16:9.: 838.089687x456.68
- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): Many visible colors found for the declared density. Detail: 13 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #243B53, #FFFFFF, #CDEFE5, #C8D5DF, #627D98
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #243B53, #CDEFE5, #C8D5DF, #627D98 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.
- WARNING [unexpected_overlap] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): t=1.517s element=qc_runtime_37 related=qc_runtime_69 Important elements overlap without an explicit data-qc-allow-overlap exception. Recommendation: Move one element, add wrapping, or mark the intentional overlap with data-qc-allow-overlap="true".
- WARNING [unexpected_overlap] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): t=2.5s element=qc_runtime_37 related=qc_runtime_69 Important elements overlap without an explicit data-qc-allow-overlap exception. Recommendation: Move one element, add wrapping, or mark the intentional overlap with data-qc-allow-overlap="true".

## Layout QA

- Mode: warn-only
- Files checked: 1
- States checked: 4
- Browser: C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe

- WARNING [unexpected_overlap] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): t=1.517s element=qc_runtime_37 related=qc_runtime_69 Important elements overlap without an explicit data-qc-allow-overlap exception. Recommendation: Move one element, add wrapping, or mark the intentional overlap with data-qc-allow-overlap="true".
- WARNING [unexpected_overlap] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): t=2.5s element=qc_runtime_37 related=qc_runtime_69 Important elements overlap without an explicit data-qc-allow-overlap exception. Recommendation: Move one element, add wrapping, or mark the intentional overlap with data-qc-allow-overlap="true".

## Design QA

- Mode: warn-only
- Files checked: 1
- Brand tokens: brand/company-brand-tokens.json
- Brand profile: reltest-academy

- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): Many visible colors found for the declared density. Detail: 13 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #243B53, #FFFFFF, #CDEFE5, #C8D5DF, #627D98
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #243B53, #CDEFE5, #C8D5DF, #627D98 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_009/slide_009.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.

## Viewer Mapping

- slide 9: svg=true, animation=true, steps=3, file=slide_009.svg

