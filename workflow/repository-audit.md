# Repository Audit

Stand: 2026-06-19

## Befund

Das Repo wurde vom frueheren Storyboard-/SVG-Produktionskontext auf Basis-Seminar-Rebuild-Analyse umgestellt.

Die zuvor vorhandenen alten Kursquellen, Storyboard-Exports, Szenenproduktionen, Produktionslaeufe, Metadaten, SVG-Exports und temporaeren Uebernahmereste wurden entfernt.

## Neuer Primaerworkflow

Fuehrend sind jetzt:

- `AGENT.md`
- `workflow/basis-seminar-slide-rebuild-runbook.md`
- `workflow/slide-rebuild-json-contract.md`
- `analysis/slide-rebuild.schema.json`
- `templates/slide-inventory-template.json`
- `templates/slide-rebuild-template.json`
- `templates/module-rebuild-report-template.md`
- `tools/basis-rebuild-viewer/`
- `rebuild-proposals/svg/`

Der Primaeroutput liegt unter:

```text
analysis/
```

## Quellenlage

Noch benoetigt fuer echte Folienanalyse:

- PowerPoint-Dateien `.pptx`
- PDF-Exporte `.pdf`
- PNG-Exporte pro Folie `.png`
- freigegebene Sprechertexte `.md`
- eindeutige Zuordnung von Sprechertexten zu Folien oder Szenen

Neue Quellen gehoeren unter:

```text
source-materials/basis-seminar/
```

## Naechste Sinnvolle Schritte

- PPTX/PDF/PNG-Quellen unter `source-materials/basis-seminar/` ablegen.
- Sprechertexte unter `source-materials/basis-seminar/narration/` ablegen.
- SVG-Vorschlaege unter `rebuild-proposals/svg/<module_id>/` ablegen.
- Pro Modul ein Folieninventar erstellen.
- Erstes Modul als Pilot mit Rebuild-JSON und Modulreport analysieren.
