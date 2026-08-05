# Piktogramm-Briefs RE1 – Szenen 10 und 12

## Gemeinsame Designentscheidung

- Stilprofil: `reltest-education-minimal-v1`
- Strategie: `generated_png`
- Begruendung: Piktogramme werden projektweit ausschliesslich als eigenstaendig generierte PNG-Bildassets produziert. Das Szenen-SVG darf sie nur platzieren und animieren, nicht aus Pfaden oder Grundformen nachbauen.
- Darstellung: flach, frontal beziehungsweise orthografisch, transparente quadratische Rasterdatei, klare Silhouette, Education Navy als Grundfarbe und hoechstens die fuer die Bedeutung erforderlichen Akzentfarben; keine Verlaeufe, Schatten, Texturen oder 3D-Perspektive.
- Barrierefreiheit: Die Piktogramme stehen jeweils direkt bei einem sichtbaren Textlabel und sind deshalb redundant mit `aria-hidden=true` markiert.

## Szene 10 – Kosten

- `pictogram_id`: `re1_costs`
- `semantic_role`: `concept-anchor`
- `primary_meaning`: Kosten beziehungsweise finanzieller Mehraufwand als Ausfallfolge
- `source_evidence`: Sprechertext Szene 10 – „Diese Ausfälle wiederum führen … zu Kosten für die Hersteller“
- `misreadings_to_avoid`: Prozentwert, Rabatt oder allgemeiner Produktpreis
- `must_preserve_features`: Geldschein plus Münze; keine Währung und kein Zahlenwert
- `strategy`: `generated_png`
- `target_asset`: `components/image-library/generated-pictograms/education-v2/re1-costs.png`
- `source_size_px`: 96
- `viewer_50_percent_size_px`: 48
- `atomic_group_with`: Karte und sichtbares Label „Kosten“ im Target `failure_consequences`

## Szene 10 – Produkthaftung

- `pictogram_id`: `re1_product_liability`
- `semantic_role`: `concept-anchor`
- `primary_meaning`: Produkthaftung beziehungsweise rechtliche Verantwortung
- `source_evidence`: Sprechertext Szene 10 – „bis hin auch zur Produkthaftung“
- `misreadings_to_avoid`: allgemeines Werkzeug, Hammer oder bereits gesprochenes Gerichtsurteil
- `must_preserve_features`: klarer Richterhammer mit Schlagfläche; sichtbares Label bleibt notwendig
- `strategy`: `generated_png`
- `target_asset`: `components/image-library/generated-pictograms/education-v2/re1-product-liability.png`
- `source_size_px`: 96
- `viewer_50_percent_size_px`: 48
- `atomic_group_with`: Karte und sichtbares Label „Produkthaftung“ im Target `failure_consequences`

## Szene 10 – Kundenunzufriedenheit

- `pictogram_id`: `re1_customer_dissatisfaction`
- `semantic_role`: `concept-anchor`
- `primary_meaning`: unzufriedener Kunde als negative Ausfallfolge
- `source_evidence`: Sprechertext Szene 10 – „Diese Ausfälle wiederum führen zu Kundenunzufriedenheit“
- `misreadings_to_avoid`: neutrale Person, Mitarbeiterrolle oder positive Kundenzufriedenheit
- `must_preserve_features`: Personensilhouette und eindeutig nach unten gebogener Mund
- `strategy`: `generated_png`
- `target_asset`: `components/image-library/generated-pictograms/education-v2/re1-customer-dissatisfaction.png`
- `source_size_px`: 96
- `viewer_50_percent_size_px`: 48
- `atomic_group_with`: Karte und sichtbares Label „Kundenunzufriedenheit“ im Target `failure_consequences`

## Szene 12 – Zielkonflikt

- `pictogram_id`: `re1_reliability_cost_balance`
- `semantic_role`: `comparison-marker`
- `primary_meaning`: Abwägung zwischen Ausfallreduktion und Mehrkosten
- `source_evidence`: Sprechertext Szene 12 – weniger Ausfälle durch höhere Belastbarkeit, zugleich Mehrkosten und Vermeidung teurer Überdimensionierung
- `misreadings_to_avoid`: Waage als Messgerät oder exakter Gleichstand der beiden Größen
- `must_preserve_features`: zwei Waagschalen, zentraler Balken, Standfuß; keine Gewichte oder Zahlen
- `strategy`: `generated_png`
- `target_asset`: `components/image-library/generated-pictograms/education-v2/re1-reliability-cost-balance.png`
- `source_size_px`: 240 als fokales Lernmotiv
- `viewer_50_percent_size_px`: 120
- `atomic_group_with`: Kennzahlenkarten und Zielaussage im Target `quality_cost_tradeoff`

## QA-Nachweis

- [x] PNG-Assetbrief, Alphakanal und Rasterregistry technisch geprüft
- [x] 32-px- und 48-px-Darstellung geprüft
- [x] 50-Prozent-Viewer geprüft
- [x] echter Folienkontext Szene 10 geprüft
- [x] echter Folienkontext Szene 12 geprüft
- [x] Semantik in etwa einer Sekunde erfassbar
- [x] ausschliesslich generierte PNG-Piktogramme in den beiden Ziel-SVGs eingebettet
- [x] keine als SVG-Geometrie konstruierten Piktogramme in den Ziel-SVGs
