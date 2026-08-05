# SVG QA Report - RE1

Generated: 2026-07-17T13:07:20.522Z

## Summary

- Files checked: 102
- Animation manifests checked: 77
- Layout files checked: 5
- Layout states checked: 17
- Design files checked: 5
- Design errors: 0
- Design warnings: 48
- Handoff scenes checked: 0
- Handoff manifests checked: 0
- Handoff errors: 0
- Handoff warnings: 0
- Errors: 0
- Warnings: 75

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
- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): Many visible colors found for the declared density. Detail: 16 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #C8D5DF, #FFFFFF, #1F2933, #D9F0F7, #243B53, #F9E4E7, #F7EEDC, #627D98
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #C8D5DF, #1F2933, #D9F0F7, #243B53, #F9E4E7 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.
- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): Many visible colors found for the declared density. Detail: 16 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #C8D5DF, #FFFFFF, #1F2933, #D9F0F7, #243B53, #F9E4E7, #F7EEDC, #627D98
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #C8D5DF, #1F2933, #D9F0F7, #243B53, #F9E4E7 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.
- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): Many visible colors found for the declared density. Detail: 16 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #C8D5DF, #FFFFFF, #1F2933, #D9F0F7, #243B53, #F9E4E7, #F7EEDC, #627D98
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #C8D5DF, #1F2933, #D9F0F7, #243B53, #F9E4E7 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.
- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): Many visible colors found for the declared density. Detail: 10 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #FFFFFF, #627D98
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #627D98 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.
- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Many visible colors found for the declared density. Detail: 12 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #C8D5DF, #F7EEDC, #FFFFFF, #627D98
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #C8D5DF, #F7EEDC, #627D98 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.
- WARNING [text_inside_box] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): t=1.517s element=qc_runtime_55 related=qc_runtime_46 Text does not fit inside its background box (right). Recommendation: Box enlarge, text wrap, or move text so visible padding remains on every side.
- WARNING [text_inside_box] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): t=1.517s element=qc_runtime_56 related=qc_runtime_46 Text does not fit inside its background box (right). Recommendation: Box enlarge, text wrap, or move text so visible padding remains on every side.

## Layout QA

- Mode: warn-only
- Files checked: 5
- States checked: 17
- Browser: C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe

- WARNING [text_inside_box] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): t=1.517s element=qc_runtime_55 related=qc_runtime_46 Text does not fit inside its background box (right). Recommendation: Box enlarge, text wrap, or move text so visible padding remains on every side.
- WARNING [text_inside_box] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): t=1.517s element=qc_runtime_56 related=qc_runtime_46 Text does not fit inside its background box (right). Recommendation: Box enlarge, text wrap, or move text so visible padding remains on every side.

## Design QA

- Mode: warn-only
- Files checked: 5
- Brand tokens: brand/company-brand-tokens.json
- Brand profile: reltest-academy

- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): Many visible colors found for the declared density. Detail: 16 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #C8D5DF, #FFFFFF, #1F2933, #D9F0F7, #243B53, #F9E4E7, #F7EEDC, #627D98
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #C8D5DF, #1F2933, #D9F0F7, #243B53, #F9E4E7 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_001/slide_001.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.
- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): Many visible colors found for the declared density. Detail: 16 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #C8D5DF, #FFFFFF, #1F2933, #D9F0F7, #243B53, #F9E4E7, #F7EEDC, #627D98
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #C8D5DF, #1F2933, #D9F0F7, #243B53, #F9E4E7 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_003/slide_003.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.
- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): Many visible colors found for the declared density. Detail: 16 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #C8D5DF, #FFFFFF, #1F2933, #D9F0F7, #243B53, #F9E4E7, #F7EEDC, #627D98
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #C8D5DF, #1F2933, #D9F0F7, #243B53, #F9E4E7 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_004/slide_004.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.
- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): Many visible colors found for the declared density. Detail: 10 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #FFFFFF, #627D98
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #627D98 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_006/slide_006.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.
- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Many visible colors found for the declared density. Detail: 12 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #C8D5DF, #F7EEDC, #FFFFFF, #627D98
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #C8D5DF, #F7EEDC, #627D98 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.

## Viewer Mapping

- slide 1: svg=true, animation=true, steps=2, file=slide_001.svg
- slide 3: svg=true, animation=true, steps=2, file=slide_003.svg
- slide 4: svg=true, animation=true, steps=2, file=slide_004.svg
- slide 6: svg=true, animation=true, steps=4, file=slide_006.svg
- slide 8: svg=true, animation=true, steps=2, file=slide_008.svg

