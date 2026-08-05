# SVG QA Report - RE2

Generated: 2026-07-31T07:43:58.860Z

## Summary

- Files checked: 161
- Animation manifests checked: 160
- Layout files checked: 161
- Layout states checked: 466
- Design files checked: 161
- Design errors: 0
- Design warnings: 3
- Handoff scenes checked: 0
- Handoff manifests checked: 0
- Handoff errors: 0
- Handoff warnings: 0
- Errors: 0
- Warnings: 4

## Issues

- WARNING (rebuild-proposals/svg/RE2/slide_003/plots/bathtub_curve.svg): ViewBox is not close to 16:9.: 1760x680
- WARNING [text-fill-cascade] (rebuild-proposals/svg/RE2/slide_001/slide_001.svg): A global text fill overrides different presentation-attribute text colors. Detail: 3 text node(s) declare #FFFFFF, #6A7A86 while global text fill is #062D46. Recommendation: Remove the global text fill or assign text colors through explicit classes/inline styles, then verify computed contrast in the renderer.
- WARNING [stroke-weight] (rebuild-proposals/svg/RE2/slide_001/slide_001.svg): Stroke width exceeds the RelTest connector/line maximum. Detail: 6 element(s) exceed 6px; maximum found: 10px. Recommendation: Use token strokes (1.5/2.5/4px). Values above 6px require data-qa-heavy-stroke="allowed" and data-qa-reason on the affected element.
- WARNING [stroke-weight] (rebuild-proposals/svg/RE2/slide_003/plots/bathtub_curve.svg): element=bathtub_curve_path Stroke width exceeds the RelTest connector/line maximum. Detail: 1 element(s) exceed 6px; maximum found: 7px. Recommendation: Use token strokes (1.5/2.5/4px). Values above 6px require data-qa-heavy-stroke="allowed" and data-qa-reason on the affected element.

## Layout QA

- Mode: strict
- Files checked: 161
- States checked: 466
- Browser: C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe

No layout issues found by rendered SVG layout QA.

## Design QA

- Mode: warn-only
- Files checked: 161
- Brand tokens: brand/company-brand-tokens.json
- Brand profile: reltest-academy

- WARNING [text-fill-cascade] (rebuild-proposals/svg/RE2/slide_001/slide_001.svg): A global text fill overrides different presentation-attribute text colors. Detail: 3 text node(s) declare #FFFFFF, #6A7A86 while global text fill is #062D46. Recommendation: Remove the global text fill or assign text colors through explicit classes/inline styles, then verify computed contrast in the renderer.
- WARNING [stroke-weight] (rebuild-proposals/svg/RE2/slide_001/slide_001.svg): Stroke width exceeds the RelTest connector/line maximum. Detail: 6 element(s) exceed 6px; maximum found: 10px. Recommendation: Use token strokes (1.5/2.5/4px). Values above 6px require data-qa-heavy-stroke="allowed" and data-qa-reason on the affected element.
- WARNING [stroke-weight] (rebuild-proposals/svg/RE2/slide_003/plots/bathtub_curve.svg): element=bathtub_curve_path Stroke width exceeds the RelTest connector/line maximum. Detail: 1 element(s) exceed 6px; maximum found: 7px. Recommendation: Use token strokes (1.5/2.5/4px). Values above 6px require data-qa-heavy-stroke="allowed" and data-qa-reason on the affected element.

