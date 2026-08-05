# Scene Brief – RE2 Kapitel 1 / Lebenszyklus

## Work Unit

- module_id: `RE2`
- work_unit: `slide_003`
- Scene_ID: `re2_ch1_lifecycle`
- sequence_mode: `standalone`
- source_slides: `3`
- primary_source_slide: `3`
- mapping_type: `direct`
- output_svg: `rebuild-proposals/svg/RE2/slide_003/slide_003.svg`
- animation_manifest: `rebuild-proposals/svg/RE2/slide_003/scene.animation.v1.json`
- target_structure: `external-svg-asset-package-handoff/v1`

## Inhalts- und Transformationsentscheidung

- Erhalten: drei Ausfallbereiche samt Nummern und durchgehenden Bereichsgrenzen, schematischer Kurvenverlauf, Fokus qualitative und quantitative Methoden, Systemanalyse und Zuverlässigkeitsnachweis.
- Quellnah modernisiert: Kurve, Methodenboxen und Ergebnisbänder bleiben als eine integrierte Diagrammkomposition auf derselben horizontalen Lebensdauerachse verbunden.
- Räumliche Zuordnung: qualitative Methoden und Systemanalyse spannen die Bereiche 1 und 2; quantitative Methoden und Nachweis bleiben dem Bereich 3 zugeordnet.
- Verworfen: getrennte Plotkarte mit unabhängiger Drei-Karten-Zeile, weil sie die Beziehungstopologie der Quelle auflöst.
- Entfernt: sichtbarer Folientitel, Lautsprecher, Logo und PowerPoint-Masterelemente.
- Sprechertext: unverändert `section_002`; keine freie Umschreibung.

## Asset Decision Gate

| Element | Strategie | Grund |
|---|---|---|
| Badewannenkurve mit x/y-Achse, Bereichsgrenzen, Namen und Nummern | `python_plot_library` | echter technischer Plot; quellnahe Generatorvariante `source_aligned` |
| Methodenboxen und phasenbreite Ergebnisbänder | `native_svg` | direkte räumliche Zuordnung auf derselben Lebensdauerachse |
| Pfeile zwischen den Methodenbändern | `omit_with_reason` | die Karten sind eine Zuordnung zu Lebensphasen, kein kausaler Prozess; Pfeile würden eine falsche Reihenfolge suggerieren |
| Lautsprecher und Logo | `omit_with_reason` | PowerPoint-Master-/Bedienelemente |

## Plotvertrag

- Generator: `components/python-plot-library/bathtub_curve_plot.py`
- Variante: `source_aligned`
- x-Achse: `Lebensdauer t`
- y-Achse: `# Ausfälle`
- Ziel: `rebuild-proposals/svg/RE2/slide_003/plots/bathtub_curve.svg`
- Keine Messwerte oder numerischen Ticks; schematische Darstellung.

## Design

- Canvas: `1920 × 1080`, transparent.
- Eine einzige dominante Diagrammfläche ohne umschließende Plotkarte.
- Bereichsnamen und Nummern stehen wie in der Quelle oberhalb der Kurve; die Grenzen bleiben als vertikale Linien lesbar.
- Methodenboxen liegen direkt über den zugeordneten Kurvenbereichen.
- Ergebnisbänder stehen unmittelbar unter derselben Achse und übernehmen die horizontale Spannweite ihrer Bereiche.
- Qualitative Zone in Cyan, quantitative Zone in Weiß mit Cyan-Kontur.
- Kein sichtbarer globaler Titel.
- Die Zuordnung qualitative Methoden umfasst die Bereiche 1 und 2 wie in der Quelle.

## Animation

- Entscheidung: `animated`.
- Grund: Der Sprechertext führt zuerst die drei Bereiche ein und ordnet anschließend den qualitativen Schwerpunkt sowie die Systemanalyse zu.
- Öffentliche Ziele: `bathtub_curve_overview`, `qualitative_lifecycle_focus`, `quantitative_lifecycle_focus`, `system_analysis_outcome`.
- Reihenfolge: Badewannenkurve → beide Methodenfokusse gemeinsam → qualitativer Fokus → Systemanalyse.

## QA

- Kurve, Achsen und drei Bereiche müssen ohne Animation vollständig verständlich sein.
- Text und Plot dürfen sich nicht überlagern.
- Quelle und Ziel müssen dieselbe Beziehungstopologie besitzen: gemeinsame Achse, Bereiche 1–2 versus Bereich 3 und dazu ausgerichtete Ergebnisbänder.
- Plotasset bleibt szenenlokal und wird nicht manuell nachgezeichnet.
- Vor dem ersten Trigger ist die Badewannenkurve vollständig unsichtbar; keine Folgethemen oder Verbinder werden vorweggenommen.
