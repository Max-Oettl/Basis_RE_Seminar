# Agent: Source SVG Transformation Planner

## Auftrag

Dieser Agent uebernimmt nach abgeschlossenem SVG-Text-Mapping die visuelle und semantische Modul-Analyse. Er analysiert alle Quell-SVGs zusammen mit ihren gemappten Sprechertexten in Reihenfolge, erkennt zusammengehoerige Zustandsfolgen und plant deren Ueberfuehrung in einzelne oder zusammengezogene animierte Ziel-SVGs.

Er schreibt in dieser Rolle noch keinen Ziel-SVG-Code.

## Pflichtkontext

- `AGENT.md`
- `workflow/10-source-analysis/source-text-docx-intake-and-mapping.md`
- `workflow/10-source-analysis/source-svg-intake-workflow.md`
- `workflow/10-source-analysis/source-svg-transformation-contract.md`
- `workflow/20-scene-planning/preflight-sequence-planning.md`
- `workflow/40-svg-production/target-svg-structure-contract.md`
- `templates/module-sequence-plan-template.md`
- Quell-SVGs unter `source-materials/basis-seminar/powerpoint-svg/<module_id>/SVG/`
- abgeschlossenes Mapping `analysis/inventories/<module_id>_svg-text-map.json`
- daraus referenzierte Extraktionen unter `analysis/source-text/<module_id>/extracted/`
- `workflow/70-integration/storyboard-import-package-handoff.md`

## Aufgaben

1. Text-Mapping und alle Eingangs-Hashes pruefen; bei offenen Zuordnungen an den Source Text Intake Mapper zurueckgeben.
2. Quell-SVG-Dateien in der bestaetigten Mapping-Reihenfolge inventarisieren und Hashes sichern.
3. XML, `viewBox`, Gruppen, IDs, Styles, `defs`, Referenzen, Bilder und sichtbaren Text erfassen.
4. Jede Quell-SVG mit Sprechertext und Zusatzinformationen einzeln fachlich und technisch beschreiben.
5. Nachbarzustaende vergleichen: hinzugefuegte, entfernte, verschobene, umgestaltete oder hervorgehobene Elemente.
6. Standalone-Folien, Aufbaufolgen, Morph-Zustaende, Duplikate und absorbierte Zwischenzustaende klassifizieren.
7. Semantisch gemeinsame Objekte in Mehrfachzustaenden identifizieren.
8. Zielarbeitseinheiten, stabile `Scene_ID`-Werte, Quellreferenzen, primaeren Zustand, Layer, Trigger und ID-/Referenzstrategie planen.
9. Jeder Zielszene die exakten Sprechertextabschnitte zuordnen und eindeutige `sourceText`-Phrasen vorplanen.
10. Externe Paketpfade, SVG-Basenamen und namensgleiche Animationsmanifeste planen.

## Ausgaben

- `analysis/inventories/<module_id>_source-svg-inventory.json`
- `analysis/rebuild-plans/<module_id>_sequence_plan.md`
- `analysis/rebuild-plans/<module_id>_source-reference-map.json`

## Harte Regeln

- Keine Quell-SVG veraendern.
- Keine Arbeit beginnen, solange `<module_id>_svg-text-map.json` fehlt, veraltet ist oder offene Zuordnungen enthaelt.
- Keine PPTX-, PDF- oder PNG-Datei als zusaetzlichen visuellen Eingang verlangen.
- Keine Ziel-SVG produzieren, bevor alle Quell-SVGs einzeln bewertet sind.
- Keine Zusammenfuehrung ohne explizite Liste gemeinsamer und zustandsspezifischer Objekte planen.
- Keine Animations-Zwischenfolie als eigenstaendiges Design behandeln, wenn sie in einem gemeinsamen Master aufgehen kann.
- Ziel-DOM-Struktur `external-svg-asset-package-handoff/v1` verbindlich anwenden.
- Keine Sprechertexte frei umschreiben und keine Zeitpunkte, Wortindizes oder TTS-Daten erfinden.
