# Modulreport: RE3_TEST_1

## Status

```text
module_id: RE3_TEST_1
status: rejected_prototype
slides_total: 13
slides_rebuilt_as_svg: 13
master_sequences: 3
```

> Dieser Report beschreibt die verworfene Prototyp-Runde. Die SVGs duerfen nicht als Produktionsbasis verwendet werden. Siehe `analysis/reports/re3_test_1_rejected_prototype_review.md` und den neuen Plan `analysis/rebuild-plans/RE3_TEST_1_svg_rebuild_plan.json`.

## Neue Rebuild-Runde

Die hier dokumentierten SVG-Vorschlaege wurden als unzureichend verworfen. Hauptgruende: zu wortwoertlicher PowerPoint-Nachbau, nicht ausreichend angepasste Library-Komponenten, gleichfoermige Ausfallmarken und fehlender harter Render-Cross-Check vor Rueckmeldung.

## Sequenzen

- `sequence_intro_build.svg`: Folien 1-6
- `sequence_distribution_formula.svg`: Folien 7-8
- `sequence_censored_build.svg`: Folien 10-11

## PNG-Assets

- `assets/scenes/RE3_TEST_1/pictograms/tool-transform-arrow.png`
- `assets/scenes/RE3_TEST_1/pictograms/method-graph.png`
- `assets/scenes/RE3_TEST_1/pictograms/method-calculation.png`

## Folienstatus

| Folie | Slide-ID | Status | Sprechertext | Modus | SVG-Vorschlag | Hinweise |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `RE3_TEST_1_001` | `review` | `medium` | `reveal_sequence` | `rebuild-proposals/svg/RE3_TEST_1/slide_001.svg` | Komponenten + PNG-Assets |
| 2 | `RE3_TEST_1_002` | `review` | `medium` | `reveal_sequence` | `rebuild-proposals/svg/RE3_TEST_1/slide_002.svg` | Komponenten + PNG-Assets |
| 3 | `RE3_TEST_1_003` | `review` | `medium` | `reveal_sequence` | `rebuild-proposals/svg/RE3_TEST_1/slide_003.svg` | Komponenten + PNG-Assets |
| 4 | `RE3_TEST_1_004` | `review` | `medium` | `reveal_sequence` | `rebuild-proposals/svg/RE3_TEST_1/slide_004.svg` | Komponenten + PNG-Assets |
| 5 | `RE3_TEST_1_005` | `review` | `medium` | `reveal_sequence` | `rebuild-proposals/svg/RE3_TEST_1/slide_005.svg` | Komponenten + PNG-Assets |
| 6 | `RE3_TEST_1_006` | `review` | `medium` | `reveal_sequence` | `rebuild-proposals/svg/RE3_TEST_1/slide_006.svg` | Komponenten + PNG-Assets |
| 7 | `RE3_TEST_1_007` | `review` | `low` | `pptx_animation_sequence` | `rebuild-proposals/svg/RE3_TEST_1/slide_007.svg` | Komponenten + PNG-Assets |
| 8 | `RE3_TEST_1_008` | `review` | `low` | `pptx_animation_sequence` | `rebuild-proposals/svg/RE3_TEST_1/slide_008.svg` | Komponenten + PNG-Assets |
| 9 | `RE3_TEST_1_009` | `review` | `low` | `single_slide` | `rebuild-proposals/svg/RE3_TEST_1/slide_009.svg` | Komponenten + PNG-Assets |
| 10 | `RE3_TEST_1_010` | `review` | `low` | `reveal_sequence` | `rebuild-proposals/svg/RE3_TEST_1/slide_010.svg` | Komponenten + PNG-Assets |
| 11 | `RE3_TEST_1_011` | `review` | `low` | `reveal_sequence` | `rebuild-proposals/svg/RE3_TEST_1/slide_011.svg` | Komponenten + PNG-Assets |
| 12 | `RE3_TEST_1_012` | `review` | `low` | `single_slide` | `rebuild-proposals/svg/RE3_TEST_1/slide_012.svg` | Komponenten + PNG-Assets |
| 13 | `RE3_TEST_1_013` | `review` | `low` | `single_slide` | `rebuild-proposals/svg/RE3_TEST_1/slide_013.svg` | Komponenten + PNG-Assets |

## Review-Hinweise

- Folien 1-6, 7-8 und 10-11 sind als animierbare Sequenzen gedacht.
- Weibull-Diagramme nutzen berechnete Log-/Weibull-Koordinaten, keine gleichmaessige y-Skalierung.
- PNGs werden nur fuer Piktogramme/Icons verwendet; Achsen, Text, Formeln und Diagramme bleiben SVG-nativ.
