# RE1 Source Intake Report

## Status

`blocked_before_semantic_svg_analysis`

Die DOCX-Extraktion und das SVG-Mapping wurden technisch erfolgreich ausgefuehrt. Die nachgelagerte semantische Quell-SVG- und Sequenzanalyse bleibt gesperrt, bis die drei ungemappten Word-Dokumente geklaert sind.

## Eingang

- Modulordner: `source-materials/basis-seminar/powerpoint-svg/RE1/`
- Quell-SVGs: 96
- Word-Dokumente: 17
- extrahierte Sprechertextabschnitte: 101
- Extraktionsfehler: 0
- Extraktionswarnungen: 0

## SVG-Text-Mapping

- eindeutig gemappte Quell-SVGs: 96 von 96
- verwendete Sprechertextabschnitte: 77
- geteilte Sprechertextgruppen fuer direkt aufeinanderfolgende Aufbau-SVGs: 11
- ungemappte Quell-SVGs: 0
- ungemappte Word-Dokumente: 3
- ungemappte Sprechertextabschnitte: 24

Das Mapping basiert auf Abschnittstiteln, fachlichem Inhalt und lueckenloser SVG-Sequenz. Geteilte Abschnitte wurden nur fuer direkt benachbarte Aufbauzustaende verwendet.

## Blockierende Befunde

1. `01_Modul_Einfuehrung_ZUV - Aufbau.docx` deklariert intern Modul 1. Seine drei Abschnitte `Einfuehrung in die Zuverlaessigkeit`, `Agenda` und `Motivation der Zuverlaessigkeit` besitzen im gelieferten SVG-Satz keine Quell-SVGs.
2. `02_Modul_Qualitative Methoden - Einführung in qualitative Methoden.docx` deklariert intern Modul 2 und gehoert nicht in den Ordner `RE1`.
3. `02_Modul_Qualitative Methoden - Fehlerbaumanalyse.docx` deklariert intern Modul 2 und gehoert nicht in den Ordner `RE1`.

Die beiden Modul-2-Dateien enthalten zusammen 21 Sprechertextabschnitte. Das Modul-1-Dokument `Aufbau` enthaelt 3 nicht gemappte Abschnitte.

## Technischer SVG-Preflight

- XML-parsebar: 96 von 96
- doppelte IDs: 0 Dateien
- externe Referenzen: 0
- `<script>`: 0 Dateien
- `<foreignObject>`: 0 Dateien
- Dimensionen: alle 96 SVGs sind `1280 x 720`
- fehlende `viewBox`: 96 Dateien

Die fehlende `viewBox` ist fuer diese Quellen ein dokumentierter Warnbefund. Fuer Analyse und spaetere Transformation kann deterministisch `0 0 1280 720` abgeleitet werden. Die unveraenderlichen Quell-SVGs werden dafuer nicht gepatcht; jedes Ziel-SVG muss eine echte `viewBox` besitzen.

## Artefakte

- Extraktionsindex: `analysis/source-text/RE1/extraction-index.json`
- wortgetreue Extraktionen: `analysis/source-text/RE1/extracted/`
- Alignment-Plan: `analysis/source-text/RE1/svg-text-alignment-plan.json`
- SVG-Text-Mapping: `analysis/inventories/RE1_svg-text-map.json`

## Offene Entscheidungen

- Die beiden intern als Modul 2 gekennzeichneten Dokumente nach `RE2/Text/` uebernehmen oder aus dem aktuellen Eingang entfernen.
- Die drei fehlenden RE1-Quell-SVGs fuer den Abschnitt `Aufbau` nachliefern oder den Abschnitt ausdruecklich vom RE1-Produktionsumfang ausschliessen.
