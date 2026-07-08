# Analysis

Dieser Ordner enthaelt die neuen Rebuild-Analyseartefakte fuer das Basis-Seminar.

## Zweck

Hier entstehen keine finalen SVGs und keine neuen Sprechertexte. Dieser Ordner enthaelt strukturierte Beschreibungen, die spaeter als Grundlage fuer die Neuerzeugung im neuen Corporate Design dienen.

## Struktur

```text
analysis/
  slide-rebuild.schema.json
  inventories/
  slides/
  modules/
  reports/
```

## Dateien

- `slide-rebuild.schema.json`: JSON-Schema fuer einzelne Folienanalysen.
- `inventories/`: Modul- und Folieninventare vor der Detailanalyse.
- `slides/`: eine JSON-Datei pro Folie.
- `modules/`: optionale Sammeldateien pro Modul.
- `reports/`: QA- und Modulberichte.

## Regeln

- Jede Folienanalyse folgt `workflow/slide-rebuild-json-contract.md`.
- Sprechertext bleibt unveraendert.
- Quellenabweichungen werden in `qa.issues` dokumentiert.
- Fehlende Quellen werden sichtbar markiert.
