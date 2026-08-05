# Source SVG Transformation Contract

Dieser Vertrag beschreibt die Analyse- und Planungsdaten zwischen Quell-SVG-Intake, Sequenzplanung, Produktion, Viewer und Crosscheck.

## Vorgelagertes SVG-Text-Mapping

Pfad:

```text
analysis/inventories/<module_id>_svg-text-map.json
```

Schema:

```text
analysis/svg-text-map.schema.json
```

Dieses Artefakt wird vor dem Modul-Inventar erzeugt. Es verbindet jede einzelne Quell-SVG mit ihrem unveraenderten DOCX-Ursprung, der extrahierten Markdown-Datei und dem wortgetreuen Sprechertext. Ein Mapping mit offenen, fehlenden oder mehrdeutigen Zuordnungen sperrt alle nachgelagerten Schritte.

## Modul-Inventar

Pfad:

```text
analysis/inventories/<module_id>_source-svg-inventory.json
```

Schema:

```text
analysis/source-svg-inventory.schema.json
```

Pflichtfelder pro Modul:

- `schema_version: basisReSourceSvgInventory/v2` fuer neue Module; `v1` bleibt legacy-lesbar
- `module_id`
- `source_root`
- `input_kind: powerpoint_slide_svg`
- `text_root`
- `text_mapping_file`
- `text_mapping_status: mapped`
- `slides`
- `qa`

Pflichtfelder pro Quell-SVG:

- `source_slide_number`
- `source_slide_key`
- `source_svg`
- `sha256`
- `view_box`
- `technical_status`
- `visible_content_summary`
- `visible_text`
- `features`
- `references`
- `sequence_role`
- `state_delta`
- `candidate_sequence_group`
- `transformation_notes`
- `qa`

Sprechertextzuordnung wird mit `text_mapping_ref`, `spoken_text_source` und `spoken_text` pro Quell-SVG dokumentiert. Fuer neue Module darf sie nicht fehlen. Die aelteren Felder `narration_root` und `narration_status` bleiben nur fuer bestehende Inventare lesbar.

## Referenz-Mapping

Der bestehende Pfad bleibt verbindlich:

```text
analysis/rebuild-plans/<module_id>_source-reference-map.json
```

`source_slides` bezeichnet ab sofort die Nummern der Quell-SVGs. Bei einer Zusammenfuehrung enthaelt die Liste alle aufgenommenen Ursprungszustaende. `primary_source_slide` ist normalerweise die vollstaendigste Quell-SVG, nicht zwingend die letzte Datei der Gruppe.

Zulaessige Mapping-Typen:

- `direct`
- `merged`
- `new_content`
- `absorbed_source`

## Transformationsprinzip

Jede Zielarbeitseinheit muss nachvollziehbar dokumentieren:

- welche Quell-SVGs einflossen,
- welche Quellknoten direkt uebernommen oder gruppiert wurden,
- welche Elemente entfernt wurden und warum,
- welche IDs und Referenzen umgeschrieben wurden,
- welche Elemente durch Plot-, Formel-, Timeline- oder Bildassets ersetzt wurden,
- welche Quellzustaende in Animationsschritte ueberfuehrt wurden,
- welche Inhalte nur im Endzustand und welche bereits initial sichtbar sind.
- dass PowerPoint-Bedienelemente wie der Lautsprecher unten rechts entfernt wurden; sie sind kein fachlicher Inhalt und duerfen weder in Ziel-SVG noch Manifest erscheinen,
- welche stabile `Scene_ID` aus der Arbeitseinheit entsteht,
- welche Sprechertextabschnitte in welcher Reihenfolge zur Szene gehoeren,
- welche wortgetreuen Phrasen als `sourceText`-Trigger dienen,
- welcher SVG-Basename und welches namensgleiche externe Manifest in das Uebergabepaket gelangen.

Die Ziel-DOM-Struktur ist in `workflow/40-svg-production/target-svg-structure-contract.md` festgelegt. Die finale Paketstruktur folgt `workflow/70-integration/storyboard-import-package-handoff.md`.

## Verbindliche Animationsgranularitaet

Die Uebernahme eines Quell-SVGs als einziges Animationsziel ist nur fuer nachweislich atomare Motive zulaessig. Ein komplettes `main_content`, `scene_content`, `source_state_*` oder das SVG-Root als alleiniger `show`-/`hide`-Target gilt bei normalen Inhaltsfolien nicht als ausgearbeitete Animation.

Vor der finalen Transformation wird deshalb ein Elementanimationsplan gespeichert. Er beschreibt pro Szene mindestens:

- semantische Zielgruppen wie Textblock, Datenreihe, Kurve, Achsensystem, Formel, Marker, Bild oder Hervorhebung,
- die exakten Ziel-IDs,
- die vorgesehene Aktion `show`, `hide`, `draw`, `highlight` oder `transform`,
- die Reihenfolge und wortgetreue `sourceText`-Phrase,
- bei zusammengefuehrten Quell-SVGs die unveraenderten Basisinhalte sowie die hinzukommenden, entfallenden oder veraenderten Elemente.

Dabei gelten folgende Mindestregeln:

- Beschreibt der Sprechertext mehrere Inhalte nacheinander, werden diese als getrennte Targets animiert.
- Linien, Kurven, Verlaeufe und gerichtete Pfade werden nach Moeglichkeit mit `draw` aufgebaut.
- Datenpunkte, Balken, Marker, Formeln und Textbloecke werden getrennt eingeblendet, wenn sie getrennt erklaert werden.
- Fokuswechsel werden mit `highlight` sichtbar gemacht; echte Lage- oder Groessenaenderungen verwenden `transform`.
- Bei Zustandswechseln werden nur die betroffenen Elementgruppen ein- oder ausgeblendet. Der Austausch eines kompletten Quellzustands ist nur als dokumentierter technischer Fallback fuer nicht weiter zerlegbare eingebettete Bilder zulaessig.
- Der statische SVG-Endzustand bleibt vollstaendig lesbar.

## Legacy

`workflow/10-source-analysis/slide-rebuild-json-contract.md` und `analysis/slide-rebuild.schema.json` bleiben fuer bestehende Mehrquellen-Analysen lesbar. Sie sind kein Pflichtformat fuer neue Quell-SVG-Module.
