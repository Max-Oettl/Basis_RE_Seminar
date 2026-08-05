# SVG QA Report - chapter-06

Generated: 2026-07-31T16:30:38.914Z

## Summary

- Files checked: 7
- Animation manifests checked: 7
- Layout files checked: 0
- Layout states checked: 0
- Design files checked: 7
- Design errors: 7
- Design warnings: 0
- Handoff scenes checked: 0
- Handoff manifests checked: 0
- Handoff errors: 0
- Handoff warnings: 0
- Errors: 18
- Warnings: 0

## Issues

- ERROR (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_075/scene.animation.v1.json): Animation target ID does not exist in SVG.: bathtub_early_span
- ERROR (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_075/scene.animation.v1.json): Animation target ID does not exist in SVG.: bathtub_early_divider
- ERROR (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_075/scene.animation.v1.json): Animation target ID does not exist in SVG.: bathtub_early_number
- ERROR (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_075/scene.animation.v1.json): Animation target ID does not exist in SVG.: bathtub_early_label
- ERROR (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_075/scene.animation.v1.json): Animation target ID does not exist in SVG.: bathtub_random_span
- ERROR (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_075/scene.animation.v1.json): Animation target ID does not exist in SVG.: bathtub_random_divider
- ERROR (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_075/scene.animation.v1.json): Animation target ID does not exist in SVG.: bathtub_random_number
- ERROR (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_075/scene.animation.v1.json): Animation target ID does not exist in SVG.: bathtub_random_label
- ERROR (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_075/scene.animation.v1.json): Animation target ID does not exist in SVG.: bathtub_wear_span
- ERROR (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_075/scene.animation.v1.json): Animation target ID does not exist in SVG.: bathtub_wear_number
- ERROR (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_075/scene.animation.v1.json): Animation target ID does not exist in SVG.: bathtub_wear_label
- ERROR [text-volume] (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_074/slide_074.svg): Many text nodes for a non-dense Content-SVG. Detail: 38 text nodes; set density="dense" only with a documented reason.
- ERROR [brand-token-color] (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_074/slide_074.svg): Colors outside brand/design tokens found. Detail: #4F78A8 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- ERROR [design-density] (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_074/slide_074.svg): High SVG element count for declared density. Detail: 322 elements with density=balanced
- ERROR [brand-token-color] (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_075/slide_075.svg): Colors outside brand/design tokens found. Detail: #9F3443, #00698A, #8A5A17 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- ERROR [text-volume] (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_077/slide_077.svg): Many text nodes for a non-dense Content-SVG. Detail: 35 text nodes; set density="dense" only with a documented reason.
- ERROR [design-density] (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_077/slide_077.svg): High SVG element count for declared density. Detail: 438 elements with density=balanced
- ERROR [design-density] (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_077/slide_077.svg): Many path elements in a non-dense Content-SVG. Detail: 96 paths

## Design QA

- Mode: strict-design
- Files checked: 7
- Brand tokens: brand/reltest-education-slide-design-tokens.json
- Brand profile: reltest-education

- ERROR [text-volume] (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_074/slide_074.svg): Many text nodes for a non-dense Content-SVG. Detail: 38 text nodes; set density="dense" only with a documented reason.
- ERROR [brand-token-color] (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_074/slide_074.svg): Colors outside brand/design tokens found. Detail: #4F78A8 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- ERROR [design-density] (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_074/slide_074.svg): High SVG element count for declared density. Detail: 322 elements with density=balanced
- ERROR [brand-token-color] (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_075/slide_075.svg): Colors outside brand/design tokens found. Detail: #9F3443, #00698A, #8A5A17 Recommendation: Use brand/company-brand-tokens.json or add data-qa-brand-exception with data-qa-reason for temporary imported colors.
- ERROR [text-volume] (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_077/slide_077.svg): Many text nodes for a non-dense Content-SVG. Detail: 35 text nodes; set density="dense" only with a documented reason.
- ERROR [design-density] (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_077/slide_077.svg): High SVG element count for declared density. Detail: 438 elements with density=balanced
- ERROR [design-density] (analysis/qa-inputs/RE1/full-sweep-2026-07-31/chapter-06/slide_077/slide_077.svg): Many path elements in a non-dense Content-SVG. Detail: 96 paths

