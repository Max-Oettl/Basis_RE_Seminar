# RE3_TEST_1 New Workflow Comparison

Purpose: compare the existing grouped SVG implementation with a freshly derived per-slide variant from the layered workflow.

## References

- Existing workflow output: `rebuild-proposals/svg/RE3_TEST_1`
- New workflow output: `rebuild-proposals/workflow-comparison/RE3_TEST_1/new-workflow`
- Plan: `analysis/rebuild-plans/RE3_TEST_1_new_workflow_comparison_plan.json`

## Method

- One SVG per source slide for direct comparison.
- Real technical diagrams are embedded from Python plot SVG assets.
- Generic timelines and object-time axes are native SVG compositions.
- Non-trivial formulas are embedded from LaTeX/Mathtext SVG assets.
- Simple formula labels remain native SVG text where that is sufficient.
- The source PowerPoint title is omitted from the SVG graphics.

## Slide Outputs

| Slide | New workflow focus | Strategies | SVG |
|---|---|---|---|
| 01 | Ausfalldaten sammeln | Timeline: SVG, kein Plot, Quelle: Folie 1 | `slide_001/slide_001.svg` |
| 02 | Median-Rang einführen | Formel: LaTeX-SVG, Timeline: SVG, Quelle: Folie 2 | `slide_002/slide_002.svg` |
| 03 | Hilfslinien vorbereiten | Formelzeichen: SVG-Text, Hilfslinien: SVG, Quelle: Folie 3 | `slide_003/slide_003.svg` |
| 04 | Punkte ins Weibull-Papier | Diagramm: Python-Plot, Plot-Asset: Weibull-Kontext, Quelle: Folie 4 | `slide_004/slide_004.svg` |
| 05 | Ausgleichsgerade bestimmen | Diagramm: Python-Plot, Fit sichtbar im Plot, Quelle: Folie 5 | `slide_005/slide_005.svg` |
| 06 | Weibull-Parameter ablesen | Diagramm: Python-Plot, Parameter-Callouts, Quelle: Folie 6 | `slide_006/slide_006.svg` |
| 07 | Von Parametern zur Funktion | Diagramm: Python-Plot, Formel: LaTeX-SVG, Quelle: Folie 7 | `slide_007/slide_007.svg` |
| 08 | Grafische Auswertung sichtbar halten | Diagramm: Python-Plot, Zwischenzustand, Quelle: Folie 8 | `slide_008/slide_008.svg` |
| 09 | Ausfallmechanismen trennen | Diagramm: Python-Plot, Timeline: SVG, Quelle: Folie 9 | `slide_009/slide_009.svg` |
| 10 | Objekt-Zeit-Diagramm aufbauen | Timeline: SVG, Objektachsen, Quelle: Folie 10 | `slide_010/slide_010.svg` |
| 11 | Zensierte Beobachtungen ergänzen | Timeline: SVG, Zensierung: SVG, Quelle: Folie 11 | `slide_011/slide_011.svg` |
| 12 | Methoden einordnen | Diagramm: Python-Plot, Piktogramme: PNG, Quelle: Folie 12 | `slide_012/slide_012.svg` |
| 13 | Vertrauensgrenzen zeigen | Diagramm: Python-Plot, Vertrauensgrenzen: Bootstrap, Quelle: Folie 13 | `slide_013/slide_013.svg` |

## Review Notes

This comparison set is intentionally separate from the accepted proposal folder, so no existing RE3_TEST_1 SVGs were overwritten.
