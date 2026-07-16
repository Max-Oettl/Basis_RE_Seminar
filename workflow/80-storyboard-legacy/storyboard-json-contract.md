# Storyboard-JSON-Vertrag

Neue Storyboards werden als JSON gepflegt. Excel-Dateien sind nur noch Legacy-Quellen fuer bestehende Produktionen.

Das verbindliche Schema liegt unter:

```text
storyboards/storyboard.schema.json
```

## Standarddatei

Empfohlen:

```text
storyboards/<course_id>/storyboard.json
```

Die Datei enthaelt mehrere Szenen in `scenes[]`. Jede Szene ist die verbindliche Informationsquelle fuer Sprechertext, sichtbare Textanker, Visualplanung und Animationstrigger.

## Mindestfelder pro Storyboard

- `schema_version`: aktuell `1.0`
- `course_id`: stabile Kurs-ID, z. B. `life_data_expert`
- `language`: fuer deutsche Storyboards `de`
- `source_references`: Liste der genutzten Quellen
- `feedback_log`: optionaler Verlauf wichtiger Review-Hinweise
- `scenes`: Szenenliste

## Mindestfelder pro Szene

- `order`: numerische Reihenfolge
- `topic_id`: Themen- oder Modulbezug
- `scene_id`: stabile Szenen-ID
- `status`: `draft`, `review`, `approved`, `final` oder `archived`
- `module`, `chapter`, `lesson`: Navigationsstruktur
- `title`: Szenentitel
- `source_refs`: konkrete Quellenhinweise
- `core_content`: zentrale Aussage
- `build_sequence`: didaktische und visuelle Schrittfolge
- `narration.text`: gesprochener Text inklusive Pausenmarker
- `slide.visible_text`: sichtbare Textanker
- `visual.elements`: benoetigte Grafikelemente
- `visual.composition`: Layout- und Kompositionsbeschreibung
- `visual.svg_plan`: konkrete SVG-Produktionshinweise
- `visual.generated_assets`: optionale PNG-Assetvorschlaege
- `visual.quality_requirements`: konkrete Qualitaetsregeln fuer die Umsetzung
- `visual.asset_links`: vorhandene oder geplante Assetpfade
- `animation_triggers`: sprechertextnahe Trigger-Cues
- `interactions`: Quiz, Aufgaben oder sonstige Interaktionen
- `design_notes`: Gestaltungs- und Umsetzungsnotizen
- `assumptions`: Annahmen
- `open_questions`: offene Fragen
- `review`: Reviewstatus und Hinweise

## Scene-ID-Konvention

Neue Storyboards duerfen fachliche IDs wie `S004` enthalten. Fuer die Grafikproduktion wird daraus ein Repo-Ordner abgeleitet:

```text
S004 -> assets/scenes/scene_004/
scene_004 -> assets/scenes/scene_004/
```

Der SVG-Browser liest Storyboardtexte anhand der numerischen Szenennummer. Varianten wie `scene_009_v2` verwenden deshalb den Eintrag mit Nummer `9`.

## Sprechertext und Pausenmarker

Der gesprochene Text steht ausschliesslich unter:

```text
scene.narration.text
```

Pausenmarker bleiben sichtbar im Text:

```text
{{pause:short}}
{{pause:medium}}
{{pause:long}}
{{pause:1.2s}}
{{pause:1200ms}}
```

Pausenmarker sind keine gesprochenen Woerter und duerfen nicht als `sourceText` oder `narration_cue` fuer Animationstrigger verwendet werden.

## Visual-Schnittstelle

`visual.composition` beschreibt die Szene so konkret, dass ein Scene-Worker daraus ein Layout ableiten kann.

`visual.svg_plan[]` ist die wichtigste Schnittstelle zur SVG-Komposition. Jeder Eintrag beschreibt:

- stabile Elementidee oder Ziel-ID
- Layer
- Elementtyp
- Zweck
- Inhalt
- Position
- visuelle Hinweise

SVG ist Standard fuer Diagramme, Tabellen, Prozesslogik, Zeitachsen, Formeln, Kennzahlen und technische Textanker.

`visual.generated_assets[]` beschreibt PNG/JPG/WebP nur dann, wenn ein rasterbasiertes Motiv didaktisch klar besser ist. PNGs enthalten keinen Text und keine komplette Szene.

## Trigger-Schnittstelle

`animation_triggers[]` liefert Storyboard-nahe Trigger-Vorschlaege. Die Grafikproduktion uebersetzt sie spaeter in:

```text
assets/scenes/<scene_id>/composed/scene.animation.v1.json
```

Mapping:

- `animation_triggers[].narration_cue` -> moegliches `steps[].sourceText`
- `animation_triggers[].target_element_ids[]` -> moegliche SVG-Gruppen oder Targets
- `animation_triggers[].label` -> Review-Label fuer den Trigger

Die finale Animation bleibt im Grafikworkflow. Storyboard-Trigger sind Vorschlaege, keine technische Freigabe.

## Legacy-Mapping aus Excel

Bestehende Excel-Exporte bleiben lesbar, werden aber fuer neue Storyboards nicht fortgefuehrt.

| Alte Spalte | Neues JSON-Feld |
| --- | --- |
| `Reihenfolge` | `scene.order` |
| `Themen_ID` | `scene.topic_id` |
| `Scene_ID` | `scene.scene_id` |
| `Status` | `scene.status` und `scene.review.status` |
| `Modul` | `scene.module` |
| `Kapitel` | `scene.chapter` |
| `Lektion` | `scene.lesson` |
| `Titel` | `scene.title` |
| `Hauptinhalt` | `scene.core_content` |
| `Aufbau` | `scene.build_sequence` |
| `Gesprochener Text` | `scene.narration.text` |
| `Grafikelemente (Auflistung)` | `scene.visual.elements` |
| `Links auf Grafikelemente` | `scene.visual.asset_links` |
| `Interaktionen (z.B. Quiz)` | `scene.interactions` |
| `Platz fuer Bilder/ Ideen/ Notizen` | `scene.design_notes` |
