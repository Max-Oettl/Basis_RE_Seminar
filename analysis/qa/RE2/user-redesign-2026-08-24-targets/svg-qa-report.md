# SVG QA Report - RE2

Generated: 2026-08-24T15:51:21.244Z

## Summary

- Files checked: 161
- Animation manifests checked: 160
- Layout files checked: 6
- Layout states checked: 24
- Design files checked: 6
- Design errors: 2
- Design warnings: 0
- Handoff scenes checked: 0
- Handoff manifests checked: 0
- Handoff errors: 0
- Handoff warnings: 0
- Errors: 6
- Warnings: 1

## Issues

- WARNING (rebuild-proposals/svg/RE2/slide_003/plots/bathtub_curve.svg): ViewBox is not close to 16:9.: 1760x680
- ERROR [color-count] (rebuild-proposals/svg/RE2/slide_006/slide_006.svg): Many visible colors found for the declared density. Detail: 8 colors: #142452, #727C97, #435075, #D0D3DC, #F7F9FC, #FFFFFF, #E8E9EE, #00A653
- ERROR [design-density] (rebuild-proposals/svg/RE2/slide_023/slide_023.svg): density must be low, normal, or dense. Detail: balanced
- ERROR [arrow_integrity] (rebuild-proposals/svg/RE2/slide_006/slide_006.svg): t=0s element=qc_runtime_82 marker-end references a missing marker definition. Recommendation: Add the marker definition or correct the marker URL.
- ERROR [arrow_integrity] (rebuild-proposals/svg/RE2/slide_006/slide_006.svg): t=0.5s element=qc_runtime_82 marker-end references a missing marker definition. Recommendation: Add the marker definition or correct the marker URL.
- ERROR [arrow_integrity] (rebuild-proposals/svg/RE2/slide_006/slide_006.svg): t=1s element=qc_runtime_82 marker-end references a missing marker definition. Recommendation: Add the marker definition or correct the marker URL.
- ERROR [arrow_integrity] (rebuild-proposals/svg/RE2/slide_006/slide_006.svg): t=4.467s element=qc_runtime_82 marker-end references a missing marker definition. Recommendation: Add the marker definition or correct the marker URL.

## Layout QA

- Mode: strict
- Files checked: 6
- States checked: 24
- Browser: C:\Program Files\Google\Chrome\Application\chrome.exe

- ERROR [arrow_integrity] (rebuild-proposals/svg/RE2/slide_006/slide_006.svg): t=0s element=qc_runtime_82 marker-end references a missing marker definition. Recommendation: Add the marker definition or correct the marker URL.
- ERROR [arrow_integrity] (rebuild-proposals/svg/RE2/slide_006/slide_006.svg): t=0.5s element=qc_runtime_82 marker-end references a missing marker definition. Recommendation: Add the marker definition or correct the marker URL.
- ERROR [arrow_integrity] (rebuild-proposals/svg/RE2/slide_006/slide_006.svg): t=1s element=qc_runtime_82 marker-end references a missing marker definition. Recommendation: Add the marker definition or correct the marker URL.
- ERROR [arrow_integrity] (rebuild-proposals/svg/RE2/slide_006/slide_006.svg): t=4.467s element=qc_runtime_82 marker-end references a missing marker definition. Recommendation: Add the marker definition or correct the marker URL.

## Design QA

- Mode: strict-design
- Files checked: 6
- Brand tokens: brand/company-brand-tokens.json
- Brand profile: reltest-education

- ERROR [color-count] (rebuild-proposals/svg/RE2/slide_006/slide_006.svg): Many visible colors found for the declared density. Detail: 8 colors: #142452, #727C97, #435075, #D0D3DC, #F7F9FC, #FFFFFF, #E8E9EE, #00A653
- ERROR [design-density] (rebuild-proposals/svg/RE2/slide_023/slide_023.svg): density must be low, normal, or dense. Detail: balanced

## Viewer Mapping

- slide 6: svg=true, animation=true, steps=5, file=slide_006.svg
- slide 8: svg=true, animation=true, steps=6, file=slide_008.svg
- slide 13: svg=true, animation=true, steps=6, file=slide_013.svg
- slide 14: svg=true, animation=true, steps=2, file=slide_014.svg
- slide 17: svg=true, animation=true, steps=6, file=slide_017.svg
- slide 23: svg=true, animation=true, steps=4, file=slide_023.svg

