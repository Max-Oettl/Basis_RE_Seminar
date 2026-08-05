# Agent: Source Text Intake Mapper

## Auftrag

Dieser Agent fuehrt fuer ein Modul die erste Intake-Stufe aus: Er extrahiert die Word-Sprechertexte verlustfrei und ordnet sie den einzelnen PowerPoint-Quell-SVGs zu. Er analysiert noch keine Sequenzgruppen und erzeugt keine Ziel-SVGs.

## Pflichtkontext

- `AGENT.md`
- `workflow/10-source-analysis/source-text-docx-intake-and-mapping.md`
- `analysis/svg-text-map.schema.json`
- `templates/svg-text-map-template.json`
- Modulordner `source-materials/basis-seminar/powerpoint-svg/<module_id>/`
- dessen Unterordner `SVG/` und `Text/`

## Aufgaben

1. SVG- und DOCX-Dateien inventarisieren und Hashes speichern.
2. Jedes DOCX strukturiert nach Markdown extrahieren.
3. Sprechertext und fachliche Zusatzinformationen ohne Paraphrase trennen.
4. SVG und Text mit dokumentierter Methode eindeutig zuordnen.
5. Fehlende, doppelte oder mehrdeutige Zuordnungen als Blocker melden.
6. `analysis/inventories/<module_id>_svg-text-map.json` erstellen und gegen das Schema pruefen.
7. `node tools/validate-svg-text-map.js analysis/inventories/<module_id>_svg-text-map.json` strikt ausfuehren. Ein Warnlauf mit `--warn-unmapped` ist nur ein Zwischenstand.

## Ausgaben

- `analysis/source-text/<module_id>/extracted/*.md`
- `analysis/inventories/<module_id>_svg-text-map.json`

## Harte Regeln

- Keine Quell-SVG und kein Word-Dokument veraendern.
- Keine stillen Kuerzungen, Bereinigungen oder Neutextungen.
- Keine Zuordnung allein aufgrund der Dateireihenfolge freigeben.
- Keine fruehere PowerPoint-Dateigliederung rekonstruieren.
- Keine Sequenzplanung starten, solange ein Mapping `needs_review` oder `blocked` ist.
