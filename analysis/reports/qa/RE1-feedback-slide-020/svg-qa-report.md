# SVG QA Report - slide_020

Generated: 2026-07-17T15:12:58.751Z

## Summary

- Files checked: 1
- Animation manifests checked: 1
- Layout files checked: 1
- Layout states checked: 5
- Design files checked: 1
- Design errors: 0
- Design warnings: 27
- Handoff scenes checked: 0
- Handoff manifests checked: 0
- Handoff errors: 0
- Handoff warnings: 0
- Errors: 0
- Warnings: 27

## Issues

- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [text-volume] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Many text nodes for a non-dense Content-SVG. Detail: 43 text nodes; set density="dense" only with a documented reason.
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 17px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Many visible colors found for the declared density. Detail: 18 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #D9F0F7, #FFFFFF, #E3F0EA, #F7EEDC, #E5EDF3, #C8D5DF, #F7FAFC, #243B53
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #D9F0F7, #E3F0EA, #F7EEDC, #E5EDF3, #C8D5DF Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F9FBFC ~ #F7FAFC, #F1F5F8 ~ #E9F0F4, #F1F5F8 ~ #F7FAFC, #E9F0F4 ~ #E3F0EA, #E9F0F4 ~ #E5EDF3, #FFFFFF ~ #F7FAFC
- WARNING [decorative-noise] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Many visible shapes do not have semantic role markers. Detail: 52 unmarked simple shapes Recommendation: Mark functional elements with data-role/data-qc-role; mark intentional decoration with data-role="decorative" and data-qa-reason.
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.

## Layout QA

- Mode: warn-only
- Files checked: 1
- States checked: 5
- Browser: C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe

No layout issues found by rendered SVG layout QA.

## Design QA

- Mode: warn-only
- Files checked: 1
- Brand tokens: brand/company-brand-tokens.json
- Brand profile: reltest-academy

- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [text-volume] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Many text nodes for a non-dense Content-SVG. Detail: 43 text nodes; set density="dense" only with a documented reason.
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 17px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 16px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [min-font-size] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Text is smaller than the Content-SVG readability minimum. Detail: 15px < 18px
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Many visible colors found for the declared density. Detail: 18 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #D9F0F7, #FFFFFF, #E3F0EA, #F7EEDC, #E5EDF3, #C8D5DF, #F7FAFC, #243B53
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #D9F0F7, #E3F0EA, #F7EEDC, #E5EDF3, #C8D5DF Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F9FBFC ~ #F7FAFC, #F1F5F8 ~ #E9F0F4, #F1F5F8 ~ #F7FAFC, #E9F0F4 ~ #E3F0EA, #E9F0F4 ~ #E5EDF3, #FFFFFF ~ #F7FAFC
- WARNING [decorative-noise] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Many visible shapes do not have semantic role markers. Detail: 52 unmarked simple shapes Recommendation: Mark functional elements with data-role/data-qc-role; mark intentional decoration with data-role="decorative" and data-qa-reason.
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_020/slide_020.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.

