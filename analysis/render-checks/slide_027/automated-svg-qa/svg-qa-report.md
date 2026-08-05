# SVG QA Report - slide_027

Generated: 2026-07-16T22:25:22.306Z

## Summary

- Files checked: 1
- Animation manifests checked: 1
- Layout files checked: 1
- Layout states checked: 6
- Design files checked: 1
- Design errors: 0
- Design warnings: 29
- Handoff scenes checked: 0
- Handoff manifests checked: 0
- Handoff errors: 0
- Handoff warnings: 0
- Errors: 0
- Warnings: 29

## Issues

- WARNING [content-svg-scope] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 17px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 17px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 17px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 17px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text element has no determinable font-size. Detail: <text data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true">
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text element has no determinable font-size. Detail: <text data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true">
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 14px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [color-count] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Many visible colors found for the declared density. Detail: 21 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #FFFFFF, #C8D5DF, #E5ECF5, #4F78A8, #243B53, #E3F0EA, #F9E4E7, #E2E8F0
- WARNING [brand-token-color] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #C8D5DF, #E5ECF5, #4F78A8, #243B53, #E3F0EA Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F9FBFC ~ #F7FAFC, #F1F5F8 ~ #E9F0F4, #F1F5F8 ~ #F7FAFC, #E9F0F4 ~ #E5ECF5, #E9F0F4 ~ #E3F0EA, #E9F0F4 ~ #E2E8F0
- WARNING [decorative-noise] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Many visible shapes do not have semantic role markers. Detail: 65 unmarked simple shapes Recommendation: Mark functional elements with data-role/data-qc-role; mark intentional decoration with data-role="decorative" and data-qa-reason.
- WARNING [brand-effects] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.

## Layout QA

- Mode: warn-only
- Files checked: 1
- States checked: 6
- Browser: C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe

No layout issues found by rendered SVG layout QA.

## Design QA

- Mode: warn-only
- Files checked: 1
- Brand tokens: brand/company-brand-tokens.json
- Brand profile: reltest-academy

- WARNING [content-svg-scope] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 17px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 17px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 17px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 17px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text element has no determinable font-size. Detail: <text data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true">
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 13px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text element has no determinable font-size. Detail: <text data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true">
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 14px < 18px
- WARNING [min-font-size] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [color-count] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Many visible colors found for the declared density. Detail: 21 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #FFFFFF, #C8D5DF, #E5ECF5, #4F78A8, #243B53, #E3F0EA, #F9E4E7, #E2E8F0
- WARNING [brand-token-color] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #C8D5DF, #E5ECF5, #4F78A8, #243B53, #E3F0EA Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F9FBFC ~ #F7FAFC, #F1F5F8 ~ #E9F0F4, #F1F5F8 ~ #F7FAFC, #E9F0F4 ~ #E5ECF5, #E9F0F4 ~ #E3F0EA, #E9F0F4 ~ #E2E8F0
- WARNING [decorative-noise] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Many visible shapes do not have semantic role markers. Detail: 65 unmarked simple shapes Recommendation: Mark functional elements with data-role/data-qc-role; mark intentional decoration with data-role="decorative" and data-qa-reason.
- WARNING [brand-effects] (analysis/render-checks/RE1/chapter-03-v2-input/slide_027/slide_027.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.

