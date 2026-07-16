# SVG Component Library

Diese Sammlung enthaelt wiederverwendbare nicht-diagrammatische Standardbausteine fuer neue SVG-Vorschlaege.

Echte technische Diagramme, Datenplots, Verteilungen und Weibull-Wahrscheinlichkeitsnetze werden nicht mehr aus SVG-Vorlagen begonnen. Dafuer gilt `workflow/31-python-plots/python-plot-workflow.md` und die Python Plot Library unter `components/python-plot-library/`. Generische Timelines, Aufbauachsen und Ausfall-Zeitstrahlen bleiben didaktische SVG-Kompositionen nach `workflow/33-timelines/timeline-workflow.md`.

## Nutzung

- Vor dem Zeichnen eigener Standardformen pruefen, ob hier bereits eine passende Vorlage existiert.
- Die Vorlagen sind Konstruktionshilfen, keine fertigen Folienlayouts. Jede Verwendung muss an Inhalt, Zielbild, Groesse, Beschriftung und Animation angepasst werden.
- Die benoetigte Datei oeffnen und die relevante `<defs>`-Sektion sowie die Hauptgruppe `<g data-component="...">` in das Ziel-SVG kopieren.
- IDs im Ziel-SVG bei Bedarf mit einem Szenenpraefix versehen, wenn mehrere gleiche Komponenten in einer Datei verwendet werden.
- Texte bleiben SVG-Text und werden im Ziel-SVG fachlich angepasst.
- Groessen werden ueber die dokumentierten `x`, `y`, `width`, `height` und Endpunkt-Koordinaten angepasst. Nicht blind skalieren, wenn Textgroessen gleich bleiben sollen.
- Achsen- und Zeitachsenpfeile bestehen aus Linien plus separater Pfeilspitze. Marker duerfen nicht auf der Pfeilspitze liegen.
- Ausfaelle, Lebensdauerpunkte und Zeitmarken werden nicht automatisch gleichmaessig verteilt. Wenn Quelle oder fachliche Aussage unregelmaessige Abstaende zeigen, werden diese bewusst uebernommen oder begruendet neu gesetzt.

## Vorlagen

- `definition-arrow.svg`: technischer Inline-Pfeil fuer Parameterdefinitionen, Formel-Erklaerungen und kompakte Callouts. Wird statt ASCII-Textpfeilen wie `->` verwendet.
- `merkbox.svg`: skalierbare Merkbox mit Akzentleiste, Titelzeile und Textbereich.

## Anpassungsregeln

- Definition-Arrow: Die `<defs>`-/`symbol`-Geometrie in das Ziel-SVG uebernehmen und per `<use>` zwischen Symbol/Parameter und erklaerendem Text platzieren. Keine Definitionen als reinen Text `i -> ...` oder `n -> ...` setzen.
- Merkbox: Rechtecke und Textanker gemeinsam verschieben; Text nach der Flaeche im SVG stehen lassen.
