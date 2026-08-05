# Slide Redesign Brief – RE2 Szene 3

## Identitaet

- Modul: `RE2`
- Zielszene / Scene_ID: `slide_003` / `re2_ch1_lifecycle`
- Quellfolien: `source-materials/basis-seminar/powerpoint-svg/RE2/SVG/Folie3.SVG`
- Sprechertextquellen: `02_Modul_Qualitative Methoden - Einführung in qualitative Methoden.docx#section_002`
- Umfang: `single_slide`
- Ausgabemodus: `content_svg`
- Zielsystem: Basis-Rebuild-Viewer und spätere PowerPoint-Einbettung
- Zielauflösung: `1920 × 1080`

## Inhaltsinventar

| Quellelement | Klassifikation | Zielbehandlung | Sprechertextbezug |
| --- | --- | --- | --- |
| Badewannenkurve mit x-/y-Achse | `must_preserve` | als dominantes Python-Plotasset quellnah integrieren | Einteilung und Verlauf der drei Ausfallbereiche |
| Drei Bereichsgrenzen, Bezeichnungen und Nummern | `must_preserve` | oberhalb derselben Achse mit durchgehenden vertikalen Grenzen erhalten | Frühausfälle, Zufallsausfälle, Ermüdungsausfälle |
| Fokus qualitative ZUV-Methoden | `reframe` | als cyanfarbene Box direkt über den Bereichen 1 und 2 platzieren | Einsatz zu Beginn der Lebensdauer |
| Fokus quantitative ZUV-Methoden | `reframe` | als weiße Cyan-Konturbox direkt über Bereich 3 platzieren | unterschiedliche Methoden je Lebensphase |
| Risikoreduktion durch Systemanalyse | `must_preserve` | breites Ergebnisband exakt unter den Bereichen 1 und 2 | Systemanalyse in Bereich 1 und 2 |
| Nachweis Zuverlässigkeit | `must_preserve` | Ergebnisband exakt unter Bereich 3 | quantitative Zuordnung |
| Folientitel, Lautsprecher und Logo | `decorative_remove` | nicht in das Content-SVG übernehmen | kein Sprechertextbezug |

## Lernbotschaft

- Dominante Aussage: Qualitative Methoden und Systemanalyse wirken vor allem in den Bereichen 1 und 2 der Badewannenkurve; der Zuverlässigkeitsnachweis ist dem dritten Bereich zugeordnet.
- Gewünschte Erkenntnis nach 3–5 Sekunden: Die Methodenfokusse lassen sich räumlich direkt den Lebensphasen der Kurve zuordnen.
- Erforderliche fachliche Details: Kurvenverlauf, drei Bereichsnamen und -nummern, zwei Methodenfokusse sowie beide Ergebnisbänder.

## Review-Learnings

- Geladener Modul-Audit: `analysis/reports/RE2_chapter_01_implementation.md`
- Vergleichbare frühere Szenen oder Archetypen: Quellfolie 3 als integriertes SVG-Diagramm.
- Anzuwendende bestätigte Regeln: funktionierende Darstellungslogik der Quelle modernisieren; Beziehungen und Bereichszuordnungen erhalten; dominanten Plot nicht in konkurrierende Kartenebenen zerlegen.
- Bekannte Fehlerklassen für diese Szene: Verlust der gemeinsamen Achsengeometrie durch Trennung in Plotkarte und separate Kartenzeile; zu freie Text- und Layoutinterpretation.
- Bewusst lokale Ausnahmen und Begründung: Die PowerPoint-Dekoration entfällt, die fachliche Komposition bleibt dagegen quellnah.
- Daraus abgeleitete QA-Schwerpunkte: gemeinsame Achse, exakte Bereichsreihenfolge, räumliche Spannweite der Methoden- und Ergebnisbänder, Animation ohne vorweggenommene Inhalte.

## Archetyp

- Primärer Archetyp: `SVG-Diagramm`
- Begründung: Die räumliche Zuordnung entlang einer gemeinsamen Kurve trägt die Lernbotschaft.
- Verworfenes Alternativmuster: dominanter Plot plus getrennte Kartenzeile
- Grund für Verwerfung: Es löst die Methoden und Wirkungen von ihren Bereichen und schwächt die Quelllogik.

## Komposition

- Blickführung: Bereichslabels → Kurve → Methodenfokus über den jeweiligen Bereichen → phasenbreite Ergebnisbänder.
- Layoutstruktur / Grid: eine integrierte Diagrammfläche; Achse und Bereichsgrenzen definieren alle horizontalen Zuordnungen.
- Titel- und Footerbehandlung: außerhalb des Content-SVGs.
- Karten und Oberflächen: nur die zwei Methodenboxen und zwei Ergebnisbänder aus der Quelle; keine zusätzliche Plotkarte.
- Medien-/Diagrammfläche: nahezu gesamte sichere Inhaltszone.
- Typografische Hierarchie: Bereichsnamen 30 px, Methodenboxen 34 px, Ergebnisbänder 36 px.
- Semantische Farben: Cyan für qualitative Methoden/Systemanalyse, Weiß mit Cyan-Kontur für quantitative Methoden/Nachweis, Deep Navy für Achsen und Kurve.

## Assets Und Spezialpfade

- Bestehende Assets: `components/python-plot-library/bathtub_curve_plot.py`
- Neu zu erzeugende Assets: quellnahe Variante `source_aligned` unter `slide_003/plots/bathtub_curve.svg`
- Python-Plot: ja; transparente Kurve mit Achsen, Bereichsgrenzen, Namen und Nummern
- Formelworkflow: nicht erforderlich
- Timelineworkflow: nicht erforderlich
- Logo-/Fontstatus: keine Logoausgabe; Inter/Segoe UI-Fallback für Content-SVG

## Animation

- Entscheidung: `animated`
- Begründung: Der Sprechertext führt zuerst die drei Bereiche, dann die Methodenfokusse und anschließend die Systemanalyse ein.
- Narrative Beats: Kurvenüberblick → beide Methodenfokusse → qualitative Betonung → Systemanalyseband.
- Semantische Gruppen: `bathtub_curve_overview`, `qualitative_lifecycle_focus`, `quantitative_lifecycle_focus`, `system_analysis_outcome`
- Triggerphrasen: unverändert aus `section_002`; keine neu formulierten Trigger.

## QA

- Content-Transfer-Schwerpunkte: alle drei Phasen, Nummern, Kurvenverlauf, direkte Zuordnung Bereiche 1–2 versus Bereich 3, beide Quellformulierungen.
- Safe-Area-Risiken: obere Bereichsnamen und untere Ergebnisbänder.
- Text-/Kontrastrisiken: weiße Schrift auf Cyan sowie lange Methodenbezeichnungen.
- Geometrie-/Layer-Risiken: Kurve muss hinter den Methodenboxen bleiben; Bereichsgrenzen müssen visuell auf Ergebnisbänder ausgerichtet sein.
- Brand-Risiken: keine neue Karten- oder Farblogik neben der Quelle einführen.
- Offene Fragen: keine.
