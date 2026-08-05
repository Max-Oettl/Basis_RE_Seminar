# Analysis

Dieser Ordner enthaelt die Analyse-, Inventar-, Sequenz- und QA-Artefakte fuer die Transformation von PowerPoint-Quell-SVGs.

## Aktive Struktur

```text
analysis/
  svg-text-map.schema.json
  source-svg-inventory.schema.json
  source-text/
  inventories/
  rebuild-plans/
  animations/
  viewer-notes/
  render-checks/
  reports/
```

- `svg-text-map.schema.json`: Vertrag fuer die vorgelagerte DOCX-Extraktion und SVG-Text-Zuordnung.
- `source-svg-inventory.schema.json`: aktives Schema fuer Modul-Inventare.
- `source-text/`: wortgetreue, aus den DOCX-Quellen erzeugte Markdown-Extraktionen pro Modul.
- `inventories/`: eine technische und semantische Bestandsaufnahme pro Modul.
- `rebuild-plans/`: Sequenzplan, Source-Reference-Map und Szenenbriefe.
- `animations/`: modulweite oder historische Animationsplanung.
- `viewer-notes/`: Reviews, Versionen und Crosscheck-Berichte.
- `render-checks/`: technische und gerenderte QA-Ergebnisse.
- `reports/`: Modul- und Freigabeberichte.

## Legacy

`slide-rebuild.schema.json`, `slides/` und `modules/` bleiben fuer bestehende PPTX/PDF/PNG-Mehrquellenanalysen erhalten. Neue Module muessen keine Rebuild-JSON pro Ursprungsfolie mehr erzeugen.

## Regeln

- Quell-SVGs bleiben unveraendert.
- Word-Dokumente bleiben unveraendert; Extraktionen sind abgeleitete Analyseartefakte.
- Vor dem Quell-SVG-Inventar muss `<module_id>_svg-text-map.json` vollstaendig und widerspruchsfrei sein.
- Jede Quell-SVG wird vor der Gruppierung einzeln inventarisiert.
- Zusammengezogene Ziel-SVGs behalten alle Quellfoliennummern im Referenz-Mapping.
- Sprechertext bleibt unveraendert.
- Unsicherheiten und fehlende Referenzen werden sichtbar dokumentiert.
