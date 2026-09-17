# SVG QA Report - RE4

Generated: 2026-09-17T09:25:34.156Z

## Summary

- Files checked: 30
- Animation manifests checked: 23
- Layout files checked: 0
- Layout states checked: 0
- Design files checked: 3
- Design errors: 2
- Design warnings: 0
- Handoff scenes checked: 0
- Handoff manifests checked: 0
- Handoff errors: 0
- Handoff warnings: 0
- Errors: 3
- Warnings: 2

## Issues

- WARNING (rebuild-proposals/svg/RE4/slide_005/plots/population-confidence.svg): ViewBox is not close to 16:9.: 489.6x396
- WARNING (rebuild-proposals/svg/RE4/slide_005/plots/sample-fit.svg): ViewBox is not close to 16:9.: 489.6x396
- ERROR [text-volume] (rebuild-proposals/svg/RE4/slide_005/slide_005.svg): Many text nodes for a non-dense Content-SVG. Detail: 37 text nodes; set density="dense" only with a documented reason.
- ERROR [design-density] (rebuild-proposals/svg/RE4/slide_005/slide_005.svg): High SVG element count for declared density. Detail: 446 elements with density=normal
- ERROR [layout_browser_unavailable]: Browser-based layout QA could not start. Recommendation: Install Edge/Chrome or set SVG_QA_BROWSER to a Chromium executable.

## Layout QA

- Mode: strict
- Files checked: 0
- States checked: 0
- Browser: not available

- ERROR [layout_browser_unavailable]: Browser-based layout QA could not start. Recommendation: Install Edge/Chrome or set SVG_QA_BROWSER to a Chromium executable.

## Design QA

- Mode: strict-design
- Files checked: 3
- Brand tokens: brand/company-brand-tokens.json
- Brand profile: reltest-education

- ERROR [text-volume] (rebuild-proposals/svg/RE4/slide_005/slide_005.svg): Many text nodes for a non-dense Content-SVG. Detail: 37 text nodes; set density="dense" only with a documented reason.
- ERROR [design-density] (rebuild-proposals/svg/RE4/slide_005/slide_005.svg): High SVG element count for declared density. Detail: 446 elements with density=normal

## Viewer Mapping

- slide 5: svg=true, animation=true, steps=17, file=slide_005.svg

