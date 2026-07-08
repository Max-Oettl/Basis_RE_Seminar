# SVG Asset Decision Gate

Dieses Gate ist verpflichtend vor jedem SVG-Code und vor jeder Korrektur, die ein visuelles Element betrifft.

Ziel: Codex darf nicht aus dem Bauch heraus entscheiden, ob ein Element als SVG-Liniengrafik, Library-Komponente, generiertes PNG, extrahiertes PNG oder Nutzer-Asset umgesetzt wird.

## Stop-Regel

Kein SVG-Code wird geschrieben oder geaendert, bevor fuer alle relevanten visuellen Elemente eine Asset-Entscheidung dokumentiert ist.

Bei Korrekturen gilt dieselbe Regel erneut: Wenn Nutzerfeedback ein visuelles Element betrifft, wird zuerst dessen Kategorie und Asset-Strategie neu geprueft. Danach wird umgesetzt.

## Elementklassen

### Python Plot Library

Diese Elemente werden zuerst ueber `components/python-plot-library/` geloest:

- technische Diagramme mit x/y-Achsen
- Weibull-Wahrscheinlichkeitsnetze und andere Wahrscheinlichkeitsplots
- Verteilungsfunktionen, Dichtefunktionen, Regressionslinien und Kurven
- Datenpunkte, Fits, Konfidenzbaender oder Markerlinien

Pflicht:

- Vor SVG-Code pruefen, ob ein passender Python-Generator existiert.
- Wenn ja: Strategie `python_plot_library` verwenden und Generator, Datenquelle, Achsenlabels, Einheiten und Zielpfad dokumentieren.
- Wenn nein: Strategie `new_python_plot_generator` verwenden, neuen Generator in `components/python-plot-library/` anlegen und `diagram-registry.json` aktualisieren.
- Alle Generatoren nutzen `reltest_plot_style.py`, damit Achsen, Schriften, Gridlines, Farben und Exportverhalten einheitlich bleiben.
- Python-Plotgeneratoren exportieren ausschliesslich SVG. Animierbare Plot-SVGs folgen vorlaeufig `components/python-plot-library/svg-animation-structure.provisional.md`.
- Python-Plots tragen keinen sichtbaren Titel.
- Sichtbare deutsche Plotlabels verwenden echte Umlaute und `ß`; Ersatzschreibungen wie `ae`, `oe`, `ue` oder `ss` sind fuer deutsche Woerter in Plotlabels nicht zulaessig.
- Generische Timelines, Aufbauachsen und Ausfall-Zeitstrahlen sind keine Python-Plots. Sie werden als didaktische SVG-Komposition behandelt.

Der erzeugte Plot wird als SVG-Asset in das Szenen-SVG eingebunden. Die Datengeometrie wird nicht manuell im Szenen-SVG nachgezeichnet.

### SVG-Nativ

Diese Elemente bleiben normalerweise SVG-nativ:

- Prozesspfeile, einfache Markierungen und Highlightflaechen
- Tabellen, einfache Panels und Layoutformen
- Text, Labels, Zahlen und Formeln
- sehr einfache Symbole wie Plus, Minus, Haken, Kreuz, Kreis oder Warnmarkierung

Voraussetzung: Das Element besteht aus klaren geometrischen Formen und verliert fachlich nichts, wenn es neu konstruiert wird.

### Library-SVG

Diese Elemente duerfen aus `components/svg-library/` abgeleitet werden:

- Merkbox oder strukturierendes Panel
- wiederkehrende Pfeil- oder Markergruppen

Die Library ist nur ein Startpunkt. Jede Komponente muss an Inhalt, Platzbedarf, Datenposition, Labels, Abstaende und Animation angepasst werden.

### PNG-Asset

Diese Elemente werden als PNG erzeugt, extrahiert oder vom Nutzer angefordert:

- komplexe Piktogramme
- Werkzeug-, Methoden-, Maschinen- oder Objekticons
- realistische Bilder, Fotos, Screenshots, Materialdarstellungen
- illustrative Einzelelemente, die mehr als einfache Geometrie sind
- source-spezifische Icons, deren Wiedererkennbarkeit wichtig ist
- alle Bildelemente, bei denen ein improvisiertes Linien-SVG sichtbar schlechter wirkt

Ein komplexes Piktogramm darf nicht als handgebautes Linien-/Pfad-SVG improvisiert werden.

## Asset-Strategien

Jedes relevante Element bekommt genau eine Strategie:

- `native_svg`: als neue SVG-Geometrie bauen
- `python_plot_library`: vorhandenen Python-Plot-Generator verwenden
- `new_python_plot_generator`: neuen Python-Plot-Generator erstellen und danach verwenden
- `library_svg_adapted`: Library-Komponente anpassen
- `generated_png`: neues transparentes PNG erzeugen
- `extracted_png`: Bild aus Quelle croppen oder aus PPTX/PDF/PNG extrahieren
- `user_asset_required`: Nutzer muss Originalbild bereitstellen
- `omit_with_reason`: bewusst weglassen, weil Sprechertext oder Zielbild es nicht braucht

## Entscheidungstabelle

Die Entscheidung wird im Szenenbrief oder Rebuild-Plan dokumentiert:

| source_element | source_evidence | semantic_role | complexity | strategy | target_path | reason | blocking_question |
|---|---|---|---|---|---|---|---|
|  | PNG/PDF/PPTX/Sprechertext |  | simple/medium/complex |  |  |  |  |

Pflichtfelder:

- `source_element`: was ist in der Quelle sichtbar?
- `source_evidence`: welche Quelle beweist das Element?
- `semantic_role`: wozu dient es didaktisch?
- `complexity`: simple, medium oder complex
- `strategy`: eine der Strategien oben
- `target_path`: bei Plotstrategien Generatorpfad plus erzeugter Plotasset-Pfad oder Verweis auf die Plot-Spezifikation
- `reason`: warum genau diese Strategie?

Wenn `blocking_question` gefuellt ist, darf die Arbeitseinheit nicht als fertig gemeldet werden.

## Piktogramm-Erkennung

Ein Element wird als Piktogramm behandelt, sobald mindestens eines davon zutrifft:

- es stellt ein Werkzeug, Objekt, Bauteil, Maschine, Person, Hand, Material oder realistische Situation dar
- es ist in der Quelle als kleines Bild/Icon statt als reines Diagramm erkennbar
- die Form ist fuer die Bedeutung entscheidend, zum Beispiel Schraubendreher, Maulschluessel, Rechner, Lupe, Messgeraet
- es waere mit wenigen SVG-Grundformen nur ungefaehr oder kindlich darstellbar
- der Nutzer weist darauf hin, dass die konkrete Form erkennbar sein muss

Dann gilt: `generated_png`, `extracted_png` oder `user_asset_required`. Nicht `native_svg`.

## Korrekturmodus

Bei Nutzerfeedback wird nicht direkt gepatcht. Zuerst wird geklaert:

1. Betrifft das Feedback Inhalt, Layout, Asset-Typ, Animation oder Text?
2. Wird durch die Korrektur ein Element neu klassifiziert?
3. Muss ein SVG-Element durch PNG ersetzt oder ein PNG durch besseres Asset ersetzt werden?
4. Muss die Entscheidungstabelle aktualisiert werden?
5. Muss danach ein Render- und QA-Check wiederholt werden?

Wenn ein Nutzer ein Objekt benennt, zum Beispiel "Schraubendreher und Maulschluessel", wird diese Benennung als Semantik des Elements uebernommen. Die Umsetzung muss diese Semantik sichtbar tragen.

## Review-Gates

Eine Arbeitseinheit ist nicht fertig, wenn:

- ein technisches Diagramm handgezeichnet wurde, obwohl ein Python-Generator vorhanden ist oder haette angelegt werden muessen
- ein neuer Diagrammtyp ohne neuen Eintrag in `components/python-plot-library/diagram-registry.json` improvisiert wurde
- ein komplexes Piktogramm als improvisiertes SVG-Linienbild umgesetzt wurde
- ein `<image>` auf eine nicht vorhandene lokale Datei zeigt
- ein PNG-Asset nicht im Asset-Manifest dokumentiert ist
- ein Quellbild gebraucht wird, aber weder extrahiert noch als Nutzerbedarf markiert wurde
- die gerenderte Vorschau zeigt, dass ein Icon nicht erkennbar ist
- die Asset-Entscheidung nicht zum Sprechertext oder zur Quelle passt

Der automatische SVG-QA-Lauf prueft nur technische Teile. Die semantische Asset-Entscheidung muss im visuellen Cross-Check aktiv geprueft werden.
