# Slide Rebuild JSON Contract

> Legacy-Vertrag fuer bestehende Mehrquellen-Analysen. Neue PowerPoint-SVG-Module verwenden `workflow/10-source-analysis/source-svg-transformation-contract.md` und `analysis/source-svg-inventory.schema.json`.

Dieser Vertrag beschreibt die JSON-Struktur fuer eine analysierte Basis-Seminar-Folie.

Das maschinenlesbare Schema liegt unter:

```text
analysis/slide-rebuild.schema.json
```

Das Starttemplate liegt unter:

```text
templates/slide-rebuild-template.json
```

## Standarddatei

Einzelfolie:

```text
analysis/slides/slide_001_rebuild.json
```

Modulsammlung:

```text
analysis/modules/re1_module_01_rebuild.json
```

Bei Sammeldateien muss jede Folie weiterhin diesem Objektvertrag folgen.

## Koordinatensystem

Alle raeumlichen Angaben werden normalisiert gespeichert:

```json
{
  "coordinate_system": "normalized_1000",
  "origin": "top_left",
  "width": 1000,
  "height": 562.5,
  "aspect_ratio": "16:9"
}
```

Bounding Boxes verwenden:

```json
{ "x": 60, "y": 40, "w": 520, "h": 48 }
```

## Root-Felder

Pflichtfelder pro Folie:

- `schema_version`
- `seminar_id`
- `module_id`
- `slide_id`
- `source_slide_number`
- `status`
- `source_files`
- `source_slide_group`
- `narration`
- `slide_summary`
- `canvas`
- `visible_text`
- `visual_elements`
- `layout_rebuild`
- `animation_plan`
- `generated_assets`
- `corporate_design_mapping`
- `extraction_evidence`
- `qa`

## `source_files`

Dokumentiert die verwendeten Quellen:

- `pptx`
- `pdf`
- `png`
- `narration_md`

Fehlende Quellen werden nicht geloescht, sondern mit leerem Pfad oder Platzhalter dokumentiert und in `qa.issues` erklaert.

## `source_slide_group`

Dieses Feld dokumentiert, ob die Folie eine einzelne Inhaltsfolie ist oder Teil einer animierten PPTX-Folienfolge.

Pflicht im Template:

- `mode`: `single_slide`, `pptx_animation_sequence`, `morph_sequence` oder `reveal_sequence`
- `group_id`
- `source_slide_numbers`
- `primary_slide_number`
- `notes`

Wenn mehrere PPTX-Folien zusammen eine Animation bilden, bleibt eine Rebuild-Folie moeglich. Die einzelnen Quellfolien werden dann ueber `source_slide_numbers` und den Animationsplan zusammengehalten.

## `narration`

Der Sprechertext wird nicht umgeschrieben.

Pflichtfelder:

- `mode`: Standard `unchanged`
- `text_ref`: Datei und Abschnitt
- `text`: Standard `null`, ausser der Auftrag verlangt explizit eingebetteten Text
- `sync_notes`
- `confidence`: `high`, `medium` oder `low`

## `slide_summary`

Beschreibt die didaktische Funktion:

- `title`
- `purpose`
- `core_message`
- `layout_type`
- `complexity`

Erlaubte `layout_type`-Werte:

- `process`
- `comparison`
- `diagram`
- `table`
- `title`
- `image_explanation`
- `mixed`

## `visible_text`

Jeder sichtbare Textanker bekommt einen eigenen Eintrag:

- `id`
- `text`
- `role`
- `bbox`
- `reading_order`
- `importance`
- `source_methods`
- `keep_exact`
- `rebuild_note`

Sichtbarer Text wird exakt gespeichert. Falls PPTX, PDF und PNG abweichen, wird die Entscheidung in `qa.issues` begruendet.

## `visual_elements`

Fachlich relevante grafische Elemente:

- `id`
- `type`
- `semantic_role`
- `bbox`
- `z_order`
- `source_methods`
- `original_style`
- `content`
- `relationships`
- `rebuild_intent`
- `svg_rebuild`
- `png_asset`

Die Beschreibung muss erklaeren, welche didaktische Funktion das Element hat.

## `layout_rebuild`

Beschreibt die neue Aufbauabsicht:

- `composition`
- `visual_hierarchy`
- `preserve`
- `modernize`
- `do_not_change`

`preserve` schuetzt fachliche Aussage, Struktur und didaktische Reihenfolge. `modernize` beschreibt nur erlaubte Designuebersetzungen.

## `animation_plan`

Animationen werden nur dokumentiert, wenn sie aus PPTX oder Sprechertextlogik ableitbar sind.

Erlaubte Quellen:

- `pptx`
- `pptx_sequence`
- `morph_sequence`
- `inferred_from_narration`
- `none`

Erlaubte Effekte:

- `appear`
- `fade`
- `highlight`
- `move`
- `draw`
- `replace`

Unsicherheit wird in `confidence` und `notes` dokumentiert.

## `generated_assets`

PNG-Assets sind optional.

Standard ist:

```json
{
  "needed": false
}
```

Wenn ein PNG noetig ist, muss der Eintrag Zweck, Prompt, Verwendung und Ausschlusskriterien enthalten. Texte werden nicht in PNGs eingebrannt.

Fuer vorhandene komplexe Bilder kann `asset_type: "png"` genutzt werden, auch wenn das Bild nicht neu generiert wird. Dann beschreibt `purpose` die Wiederverwendung und `prompt` bleibt leer oder enthaelt eine Extraktionsnotiz.

Empfohlene Pfade fuer uebernommene oder nachgereichte Bilder:

```text
source-materials/basis-seminar/extracted-assets/<module_id>/slide_012_image_01.png
```

## `corporate_design_mapping`

Das alte Design wird semantisch uebersetzt:

- alte rote Box -> Warn-/Akzentrolle
- alte blaue Standardform -> neutrale Informationskarte
- Clipart -> konsistentes SVG-Icon oder optionales PNG
- alte Tabelle -> moderne Tabelle mit klarer Typografie

Farben werden nicht als Pflichtfarbe uebernommen, sondern als Bedeutung dokumentiert.

## `extraction_evidence`

Dokumentiert, was aus PPTX, PDF und PNG belegt wurde.

Beispiele:

- Anzahl gefundener Textboxen
- Anzahl Bilder
- erkannte Tabellen
- extrahierbare Animationen
- fehlende oder widerspruechliche Inhalte
- PDF-Formelprobleme
- PNG-Crops oder Ueberlagerungen

## `qa`

QA entscheidet, ob die Folie reif fuer den spaeteren Rebuild ist.

Pflichtfelder:

- `completeness`: `pass`, `review` oder `fail`
- `narration_linked`
- `visible_text_complete`
- `visual_structure_complete`
- `animation_confidence`
- `issues`
- `open_questions`
- `assumptions`
