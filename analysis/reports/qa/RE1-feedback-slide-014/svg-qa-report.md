# SVG QA Report - slide_014

Generated: 2026-07-17T15:18:20.119Z

## Summary

- Files checked: 2
- Animation manifests checked: 1
- Layout files checked: 2
- Layout states checked: 7
- Design files checked: 2
- Design errors: 0
- Design warnings: 29
- Handoff scenes checked: 0
- Handoff manifests checked: 0
- Handoff errors: 0
- Handoff warnings: 0
- Errors: 0
- Warnings: 31

## Issues

- WARNING (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): ViewBox is not close to 16:9.: 1131.020625x339.420625
- WARNING [design-metadata] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Missing Content-SVG quality metadata. Detail: Add slide-quality metadata in SVG metadata or scene manifest.
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text element has no determinable font-size. Detail: <text>
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text element has no determinable font-size. Detail: <text>
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Many visible colors found for the declared density. Detail: 10 colors: #D1495B, #007EA7, #B7791F, #062D46, #6A7A86, #139CCB, #FFFFFF, #9F3443, #00698A, #8A5A17
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Colors outside brand/design tokens found. Detail: #007EA7, #B7791F, #9F3443, #00698A, #8A5A17 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text element has no determinable font-size. Detail: <text data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true">
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text element has no determinable font-size. Detail: <text data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true">
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Many visible colors found for the declared density. Detail: 19 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #062D46, #6A7A86, #139CCB, #FFFFFF, #9F3443, #00698A, #8A5A17, #D9F0F7
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #9F3443, #00698A, #8A5A17, #D9F0F7, #F7EEDC Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4, #102A43 ~ #062D46
- WARNING [decorative-noise] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Many visible shapes do not have semantic role markers. Detail: 48 unmarked simple shapes Recommendation: Mark functional elements with data-role/data-qc-role; mark intentional decoration with data-role="decorative" and data-qa-reason.
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.
- WARNING [group_integrity] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): t=0s No data-qc-* attributes found; layout QA is using heuristics only. Recommendation: Add data-qc-role, data-qc-box, data-qc-group, and data-qc-layer to newly generated SVGs.

## Layout QA

- Mode: warn-only
- Files checked: 2
- States checked: 7
- Browser: C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe

- WARNING [group_integrity] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): t=0s No data-qc-* attributes found; layout QA is using heuristics only. Recommendation: Add data-qc-role, data-qc-box, data-qc-group, and data-qc-layer to newly generated SVGs.

## Design QA

- Mode: warn-only
- Files checked: 2
- Brand tokens: brand/company-brand-tokens.json
- Brand profile: reltest-academy

- WARNING [design-metadata] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Missing Content-SVG quality metadata. Detail: Add slide-quality metadata in SVG metadata or scene manifest.
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text element has no determinable font-size. Detail: <text>
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text element has no determinable font-size. Detail: <text>
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Many visible colors found for the declared density. Detail: 10 colors: #D1495B, #007EA7, #B7791F, #062D46, #6A7A86, #139CCB, #FFFFFF, #9F3443, #00698A, #8A5A17
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_014/plots/bathtub_curve.svg): Colors outside brand/design tokens found. Detail: #007EA7, #B7791F, #9F3443, #00698A, #8A5A17 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text element has no determinable font-size. Detail: <text data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true">
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text element has no determinable font-size. Detail: <text data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true">
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Many visible colors found for the declared density. Detail: 19 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #062D46, #6A7A86, #139CCB, #FFFFFF, #9F3443, #00698A, #8A5A17, #D9F0F7
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #9F3443, #00698A, #8A5A17, #D9F0F7, #F7EEDC Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4, #102A43 ~ #062D46
- WARNING [decorative-noise] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Many visible shapes do not have semantic role markers. Detail: 48 unmarked simple shapes Recommendation: Mark functional elements with data-role/data-qc-role; mark intentional decoration with data-role="decorative" and data-qa-reason.
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_014/slide_014.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.

