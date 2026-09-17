# SVG QA Report - RE2

Generated: 2026-08-27T08:30:12.936Z

## Summary

- Files checked: 161
- Animation manifests checked: 160
- Layout files checked: 19
- Layout states checked: 38
- Design files checked: 19
- Design errors: 2
- Design warnings: 0
- Handoff scenes checked: 0
- Handoff manifests checked: 0
- Handoff errors: 0
- Handoff warnings: 0
- Errors: 2
- Warnings: 1

## Issues

- WARNING (rebuild-proposals/svg/RE2/slide_003/plots/bathtub_curve.svg): ViewBox is not close to 16:9.: 1760x680
- ERROR [stroke-weight] (rebuild-proposals/svg/RE2/slide_052/slide_052.svg): Stroke width exceeds the RelTest connector/line maximum. Detail: 3 element(s) exceed 6px; maximum found: 7px. Recommendation: Use token strokes (1.5/2.5/4px). Values above 6px require data-qa-heavy-stroke="allowed" and data-qa-reason on the affected element.
- ERROR [color-count] (rebuild-proposals/svg/RE2/slide_104/slide_104.svg): Many visible colors found for the declared density. Detail: 9 colors: #142452, #031334, #EC6244, #727C97, #435075, #D0D3DC, #FFFFFF, #E8E9EE, #F7F9FC

## Layout QA

- Mode: strict
- Files checked: 19
- States checked: 38
- Browser: C:\Program Files\Google\Chrome\Application\chrome.exe

No layout issues found by rendered SVG layout QA.

## Design QA

- Mode: strict-design
- Files checked: 19
- Brand tokens: brand/company-brand-tokens.json
- Brand profile: reltest-education

- ERROR [stroke-weight] (rebuild-proposals/svg/RE2/slide_052/slide_052.svg): Stroke width exceeds the RelTest connector/line maximum. Detail: 3 element(s) exceed 6px; maximum found: 7px. Recommendation: Use token strokes (1.5/2.5/4px). Values above 6px require data-qa-heavy-stroke="allowed" and data-qa-reason on the affected element.
- ERROR [color-count] (rebuild-proposals/svg/RE2/slide_104/slide_104.svg): Many visible colors found for the declared density. Detail: 9 colors: #142452, #031334, #EC6244, #727C97, #435075, #D0D3DC, #FFFFFF, #E8E9EE, #F7F9FC

