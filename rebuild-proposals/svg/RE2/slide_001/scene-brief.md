# Scene Brief – RE2 Kapitel 1 / Methoden

## Work Unit

- module_id: `RE2`
- work_unit: `slide_001`
- Scene_ID: `re2_ch1_methods`
- sequence_mode: `build_sequence`
- source_slides: `1, 2`
- primary_source_slide: `2`
- mapping_type: `merged`
- output_svg: `rebuild-proposals/svg/RE2/slide_001/slide_001.svg`
- animation_manifest: `rebuild-proposals/svg/RE2/slide_001/scene.animation.v1.json`
- target_structure: `external-svg-asset-package-handoff/v1`

## Inhalts- und Transformationsentscheidung

- Erhalten: qualitative und quantitative Methoden, alle vier Aufgaben, FTA und FMEA.
- Zusammengeführt: Folie 1 ist der Grundzustand; Folie 2 ergänzt FTA und FMEA.
- Entfernt: sichtbarer Folientitel, Lautsprecher, Logo und PowerPoint-Masterelemente.
- Sprechertext: unverändert `section_001`; keine freie Umschreibung.
- Zielidee: zwei Methodenpfade mit klarer Aufgabenteilung; der qualitative Pfad ist der Modulschwerpunkt.

## Asset Decision Gate

| Element | Strategie | Grund |
|---|---|---|
| Methoden- und Ergebniskarten | `native_svg` | einfache, semantische Geometrie |
| Verbindungen und Fokusmarkierung | `native_svg` | Verbinder werden atomar mit der zugehörigen Zielgruppe eingeblendet; kein Pfeil ist vor seinen Boxen sichtbar |
| Werkzeugkoffer-Icons | `omit_with_reason` | dekorativ; keine fachliche Information |
| FTA- und FMEA-Bezeichnungen | `native_svg` | zentrale, textbasierte Methodenlabels |

## Design

- Canvas: `1920 × 1080`, transparent.
- Komposition: zwei horizontale Pfade; qualitative Methode oben als Schwerpunkt, quantitative Methode unten als ruhiger Kontext.
- Farben: Navy, Academy Blue, Light Blue, Soft Gray; Amber nur als Fokusakzent.
- Kein sichtbarer globaler Titel.
- Mindestschriftgröße: 24 px.

## Animation

- Entscheidung: `animated`.
- Grund: Die Quelle besitzt einen belegten Aufbauzustand und der Sprechertext führt Kategorien, Fokus, Aufgaben und Methoden nacheinander ein.
- Öffentliche Ziele: `method_categories`, `quantitative_outcomes`, `qualitative_focus`, `qualitative_outcomes`, `improvement_path`, `fta_method`, `fmea_method`.
- Reihenfolge: Kategorien → qualitativer Fokus → Aufgaben → Abstellmaßnahmen → FTA → FMEA.

## QA

- Alle Inhalte aus Folien 1 und 2 müssen im Endzustand sichtbar sein.
- FTA und FMEA dürfen nicht als eigene neue Folie erscheinen.
- Pfeile und Spaltenlabels dürfen nie vor der Box erscheinen, die sie erklären.
- Vor dem ersten Trigger ist kein fachlicher Inhalt sichtbar.
- Keine PowerPoint-Bedienelemente oder Masterelemente.
- Semantische Gruppen müssen im statischen Endzustand vollständig lesbar sein.
