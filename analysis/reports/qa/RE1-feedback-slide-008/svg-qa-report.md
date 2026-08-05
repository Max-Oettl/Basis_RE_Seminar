# SVG QA Report - slide_008

Generated: 2026-07-17T15:11:01.674Z

## Summary

- Files checked: 1
- Animation manifests checked: 1
- Layout files checked: 1
- Layout states checked: 3
- Design files checked: 1
- Design errors: 0
- Design warnings: 9
- Handoff scenes checked: 0
- Handoff manifests checked: 0
- Handoff errors: 0
- Handoff warnings: 0
- Errors: 0
- Warnings: 9

## Issues

- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Many visible colors found for the declared density. Detail: 12 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #C8D5DF, #F7EEDC, #FFFFFF, #627D98
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #C8D5DF, #F7EEDC, #627D98 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.

## Layout QA

- Mode: warn-only
- Files checked: 1
- States checked: 3
- Browser: C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe

No layout issues found by rendered SVG layout QA.

## Design QA

- Mode: warn-only
- Files checked: 1
- Brand tokens: brand/company-brand-tokens.json
- Brand profile: reltest-academy

- WARNING [content-svg-scope] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): artifactScope should be content-svg for generated content modules. Detail: artifactScope=full-slide
- WARNING [powerpoint-embedding] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): embeddingTarget should identify PowerPoint embedding. Detail: embeddingTarget=standalone-slide
- WARNING [content-svg-mode] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): contentMode is not one of the supported Content-SVG modes. Detail: full-slide
- WARNING [background-mode] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): backgroundMode must be transparent, light, or dark. Detail: brand-frame
- WARNING [design-density] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): density must be low, normal, or dense. Detail: balanced
- WARNING [color-count] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Many visible colors found for the declared density. Detail: 12 colors: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #D1495B, #2F6F55, #B7791F, #C8D5DF, #F7EEDC, #FFFFFF, #627D98
- WARNING [brand-token-color] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Colors outside brand/design tokens found. Detail: #F9FBFC, #F1F5F8, #E9F0F4, #102A43, #007EA7, #2F6F55, #B7791F, #C8D5DF, #F7EEDC, #627D98 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- WARNING [brand-token-near-duplicate] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Very similar but non-identical colors found. Detail: #F9FBFC ~ #F1F5F8, #F9FBFC ~ #FFFFFF, #F1F5F8 ~ #E9F0F4
- WARNING [brand-effects] (rebuild-proposals/svg/RE1/slide_008/slide_008.svg): Gradients or SVG filters are present; verify they are semantic and PowerPoint-safe. Detail: Brand tokens currently mark shadows as disallowed.

