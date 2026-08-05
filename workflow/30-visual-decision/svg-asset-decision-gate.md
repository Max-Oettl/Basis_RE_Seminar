# SVG Asset Decision Gate

Dieses Gate ist verpflichtend vor jedem SVG-Code und vor jeder Korrektur, die ein visuelles Element betrifft.

Ziel: Codex darf nicht aus dem Bauch heraus entscheiden, ob ein Element als SVG-Liniengrafik, Library-Komponente, generiertes PNG, extrahiertes PNG oder Nutzer-Asset umgesetzt wird.

## Stop-Regel

Kein SVG-Code wird geschrieben oder geaendert, bevor fuer alle relevanten visuellen Elemente eine Asset-Entscheidung dokumentiert ist.

Bei Korrekturen gilt dieselbe Regel erneut: Wenn Nutzerfeedback ein visuelles Element betrifft, wird zuerst dessen Kategorie und Asset-Strategie neu geprueft. Danach wird umgesetzt.

## Elementklassen

### Python Plot Library

Diese Elemente werden ueber `components/python-plot-library/` geloest:

- technische Diagramme mit x/y-Achsen
- Weibull-Wahrscheinlichkeitsnetze und andere Wahrscheinlichkeitsplots
- Verteilungsfunktionen, Dichtefunktionen, Regressionslinien und Kurven
- Datenpunkte, Fits, Konfidenzbaender oder Markerlinien

Pflicht:

- Vor SVG-Code pruefen, ob ein passender Python-Generator existiert.
- Wenn ja: Strategie `python_plot_library` verwenden und Generator, Datenquelle, Achsenlabels, Einheiten und Zielpfad dokumentieren.
- Wenn nein: Strategie `new_python_plot_generator` verwenden, neuen Generator in `components/python-plot-library/` anlegen und `diagram-registry.json` aktualisieren.
- Alle Generatoren nutzen `reltest_plot_style.py`, damit Achsen, Schriften, Gridlines, Farben und Exportverhalten einheitlich bleiben.
- Python-Plotgeneratoren exportieren ausschliesslich SVG. Animierbare Plot-SVGs folgen `components/python-plot-library/svg-animation-structure.md`; oeffentliche Plotziele verwenden semantische ASCII-`snake_case`-IDs und `data-anim-target="true"`.
- Python-Plots tragen keinen sichtbaren Titel.
- Sichtbare deutsche Plotlabels verwenden echte Umlaute und `ß`; Ersatzschreibungen wie `ae`, `oe`, `ue` oder `ss` sind fuer deutsche Woerter in Plotlabels nicht zulaessig.
- Generische Timelines, Aufbauachsen, Ausfall-Zeitstrahlen und einfache Objekt-Zeitachsen sind keine Python-Plots, solange sie nur Ereignisse, Ausfaelle mit `X`/Kreuzen oder Zensierungen markieren. Sie werden als didaktische SVG-Komposition behandelt.
- Sobald Achsenskalierung, Datenpunkte, Fit-Linien, Kurven, Wahrscheinlichkeitsnetze oder Vertrauensgrenzen fachlich abgebildet werden, muss `python_plot_library` oder `new_python_plot_generator` verwendet werden.
- Der erzeugte Plot und die zugehoerige Datenspezifikation liegen im Folienordner, z.B. `rebuild-proposals/svg/<module_id>/slide_###/plots/` und `data/`.

Der erzeugte Plot wird als SVG-Asset in das Szenen-SVG eingebunden. Die Datengeometrie wird nicht manuell im Szenen-SVG nachgezeichnet.

### SVG-Nativ

Diese Elemente bleiben normalerweise SVG-nativ:

- Prozesspfeile, einfache Markierungen und Highlightflaechen
- generische Timelines, Ausfall-Zeitachsen und Objekt-Zeit-Diagramme
- Tabellen, einfache Panels und Layoutformen
- Text, Labels, Zahlen und Formeln
- sehr einfache Symbole wie Plus, Minus, Haken, Kreuz, Kreis oder Warnmarkierung

Voraussetzung: Das Element besteht aus klaren geometrischen Formen und verliert fachlich nichts, wenn es neu konstruiert wird.

Fuer Ausfall-Zeitachsen gilt trotz `native_svg`: Markerpositionen muessen geplant werden. Ohne echte gleichmaessige Zeitwerte wird `illustrative_irregular` verwendet, also natuerliche Abstaende mit Clustern und Luecken statt Rasterabstaenden. Diese Ausnahme gilt nur fuer didaktische Timelines mit Ereignis-/Ausfallmarkern, nicht fuer echte Plots.

### Library-SVG

Diese Elemente duerfen aus `components/svg-library/` abgeleitet werden:

- Merkbox oder strukturierendes Panel
- wiederkehrende Pfeil- oder Markergruppen
- hochwertige technische Zeichnungen, deren fachliche Identitaetsmerkmale kontrolliert dargestellt und wiederverwendet werden sollen

Die Library ist nur ein Startpunkt. Jede Komponente muss an Inhalt, Platzbedarf, Datenposition, Labels, Abstaende und Animation angepasst werden.

Technische Zeichnungen duerfen neu als zentrales Library-SVG angelegt werden, wenn ein Foto nicht gewuenscht ist oder eine schematische Darstellung didaktisch besser passt. Das zugehoerige Asset-Manifest nennt mindestens Gegenstand, Darstellungsart, Herkunft beziehungsweise Lizenz und die fachlich zwingenden Merkmale. Vor Einsatz wird visuell geprueft, dass diese Merkmale im gerenderten Zielmassstab erkennbar sind.

### PNG-Asset

Diese Elemente werden als PNG erzeugt, extrahiert oder vom Nutzer angefordert:

- komplexe Piktogramme
- Werkzeug-, Methoden-, Maschinen- oder Objekticons
- realistische Bilder, Fotos, Screenshots, Materialdarstellungen
- illustrative Einzelelemente, die mehr als einfache Geometrie sind
- source-spezifische Icons, deren Wiedererkennbarkeit wichtig ist
- alle Bildelemente, bei denen ein improvisiertes Linien-SVG sichtbar schlechter wirkt
- konkrete technische oder alltaegliche Motive wie Strommast, Batterie,
  Wechselrichter, Stromzaehler, Lampe, Fernseher oder Waschmaschine, wenn ihre
  Wiedererkennbarkeit die Systemdarstellung traegt

Ein Piktogramm darf nicht als handgebautes Linien-/Pfad-SVG oder als Library-SVG umgesetzt werden. Fuer neue oder veraenderte Szenen ist ein generiertes transparentes PNG Pflicht. Technische Diagramme, Kurven, Tabellen, Formeln und Verbinder sind keine Piktogramme und duerfen weiterhin SVG-nativ umgesetzt werden.

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
- `target_path`: bei Plotstrategien Generatorpfad plus erzeugter Plotasset-Pfad im Folienordner und gegebenenfalls lokale Daten-/Konfigurationsdatei
- `reason`: warum genau diese Strategie?

Wenn `blocking_question` gefuellt ist, darf die Arbeitseinheit nicht als fertig gemeldet werden.

## Piktogramm-Erkennung

Ein Element wird als Piktogramm behandelt, sobald mindestens eines davon zutrifft:

- es stellt ein Werkzeug, Objekt, Bauteil, Maschine, Person, Hand, Material oder realistische Situation dar
- es ist in der Quelle als kleines Bild/Icon statt als reines Diagramm erkennbar
- die Form ist fuer die Bedeutung entscheidend, zum Beispiel Schraubendreher, Maulschluessel, Rechner, Lupe, Messgeraet
- es waere mit wenigen SVG-Grundformen nur ungefaehr oder kindlich darstellbar
- der Nutzer weist darauf hin, dass die konkrete Form erkennbar sein muss

Alle Piktogramme, auch universelle Motive wie Suche, Zeit, Ziel oder
Datenhaltung, verwenden `generated_png`. Das PNG wird mit transparentem
Hintergrund nach dem Education-Piktogrammworkflow erzeugt, in der Rasterregistry
dokumentiert und im Kleinmassstab sowie im realen Szenenkontext geprueft.
`native_svg` und `library_svg_adapted` sind fuer Piktogramme nicht zulaessig.
`extracted_png` bleibt nur fuer bereits vorhandene Quellenbilder oder
Illustrationen zulaessig, nicht als Ersatz fuer ein neu zu erstellendes
Piktogramm.

Mehrere benannte Motive duerfen nicht pauschal als ein einziges
`native_svg`-Systemdiagramm klassifiziert werden. Jedes semantisch eigenstaendige
Motiv erhaelt eine eigene Tabellenzeile und eine eigene Erkennbarkeitspruefung.

Nach der Klassifikation ist fuer jedes Piktogramm zusaetzlich
`workflow/30-visual-decision/pictogram-creation-workflow.md` verbindlich. Die
Strategie entscheidet das Dateiformat; sie hebt die gemeinsame minimalistische
Education-Formensprache, den 48-px-/960x540-Test, die Farbsemantik und den
Kontrastcheck nicht auf.

Ein konkretes Motiv wie Strommast, Batterie, Lampe, Fernseher oder Waschmaschine
darf nicht durch eine beschriftete generische Box ersetzt werden, wenn die
Objekterkennung die fachliche Systemdarstellung traegt.

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
- ein Piktogramm das vierfache Gate fuer Semantik, Education-Stil,
  E-Learning-Kleinmassstab und Zugaenglichkeit nicht bestanden hat
- ein generiertes Piktogramm 3D-, Isometrie-, Verlaufs-, Schatten-, Glow- oder
  Texturoptik zeigt
- im Szenenordner und Ziel-SVG kein geplanter Bild-/Library-Assetnachweis vorhanden
  ist, obwohl die Quelle konkrete, identitaetstragende Motive zeigt
- die Asset-Entscheidung nicht zum Sprechertext oder zur Quelle passt
- eine technische Zeichnung ein generisches Objekt zeigt oder ein identitaetsbestimmendes Merkmal wie Bauart, Fahrzeugklasse oder Gangzahl nicht eindeutig traegt

Der automatische SVG-QA-Lauf prueft nur technische Teile. Die semantische Asset-Entscheidung muss im visuellen Cross-Check aktiv geprueft werden.
