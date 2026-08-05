# Repository Audit

Stand: 2026-07-16

## Befund

Der aktive Eingang besteht aus genau fuenf Modulordnern `RE1` bis `RE5`. Jedes Modul enthaelt aus PowerPoint exportierte Quell-SVGs unter `SVG/` und zugehoerige Word-Sprechertexte unter `Text/`. Bestehende Mehrquellen-Daten und Analysen bleiben als Legacy-Bestand lesbar.

## Aktiver Primaerworkflow

Fuehrend sind:

- `AGENT.md`
- `workflow/10-source-analysis/source-text-docx-intake-and-mapping.md`
- `analysis/svg-text-map.schema.json`
- `templates/svg-text-map-template.json`
- `workflow/10-source-analysis/source-svg-intake-workflow.md`
- `workflow/10-source-analysis/source-svg-transformation-contract.md`
- `analysis/source-svg-inventory.schema.json`
- `templates/source-svg-inventory-template.json`
- `workflow/20-scene-planning/preflight-sequence-planning.md`
- `workflow/40-svg-production/target-svg-structure-contract.md`
- `workflow/40-svg-production/svg-rebuild-production-runbook.md`
- `workflow/70-integration/storyboard-import-package-handoff.md`
- `tools/svg-rebuild-qa.js`
- `tools/basis-rebuild-viewer/`

## Aktive Quellenlage

Neue visuelle Quellen gehoeren ausschliesslich nach:

```text
source-materials/basis-seminar/powerpoint-svg/<module_id>/SVG/*.svg
```

Zugehoerige Word-Sprechertexte liegen unter:

```text
source-materials/basis-seminar/powerpoint-svg/<module_id>/Text/*.docx
```

Vor der semantischen SVG-Analyse werden sie vollstaendig extrahiert und in `analysis/inventories/<module_id>_svg-text-map.json` eindeutig den Quell-SVGs zugeordnet. Die alte Aufteilung in PowerPoint-Dateien wird nicht rekonstruiert. Fehlende oder mehrdeutige Zuordnungen blockieren die weitere Modulbearbeitung.

Die Ordner `pptx/`, `pdf/`, `png/` und separate `narration/`-Ablagen sind fuer neue Module inaktiv. Neue Module duerfen nicht davon abhaengig gemacht werden.

## Finalisierter Ziel- Und Uebergabevertrag

Die DOM- und Layerstruktur folgt `external-svg-asset-package-handoff/v1` in `workflow/40-svg-production/target-svg-structure-contract.md`. Finale Module werden als `storyboardImportPackage/v1` unter `delivery-packages/storyboard-import/<external-module-id>/` erzeugt und ueber `tools/svg-rebuild-qa.js --handoff-package ... --strict-handoff` validiert.
