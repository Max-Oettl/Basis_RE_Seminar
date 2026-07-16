# Storyboard-Erstellungsrunbook

Dieses Runbook gilt, wenn ein Storyboard neu erstellt oder grundlegend ueberarbeitet wird. Es ist strikt vom Grafikproduktionsworkflow getrennt.

## Ziel

Der Storyboard-Workflow erstellt den fachlichen und didaktischen Plan fuer ein E-Learning, aber keine finalen SVGs, PNGs oder Szenenordner unter `assets/scenes/`.

Fuehrender Output ist eine Storyboard-JSON-Datei nach `workflow/storyboard-json-contract.md` und `storyboards/storyboard.schema.json`.

## Grundprinzip

Der Workflow laeuft in zwei getrennten Freigabestufen:

1. Szenenstruktur erstellen und zur Pruefung vorlegen.
2. Erst nach Nutzerfreigabe Sprechertexte und produktionsnahe Visual-Vorschlaege final in JSON ausarbeiten.

Codex darf finale Sprechertexte nicht direkt erstellen, wenn die Szenenstruktur noch nicht durch den Nutzer freigegeben wurde.

## Standardablage

```text
storyboards/
  <course_id>/
    storyboard.json
    notes.md                  # optional

source-materials/
  life-data-expert/
    project-brief.md
    glossary.md
    references/
```

Eine kursweite oder modulweite Storyboard-Datei ist der Standard. Szenen muessen darin stabile `scene_id`-Werte besitzen, damit der spaetere Grafikworkflow sie eindeutig den Ordnern `assets/scenes/scene_XXX/` zuordnen kann.

## Pflichtlektuere

Vor jeder Storyboard-Erstellung liest Codex:

1. `AGENT.md`
2. `agents/storyboard-orchestrator.md`
3. `workflow/storyboard-json-contract.md`
4. `workflow/speaker-text-language-rules.md`
5. `storyboards/storyboard.schema.json`
6. passende Quellen unter `source-materials/`
7. bei Life Data Expert zusaetzlich:
   - `source-materials/life-data-expert/project-brief.md`
   - `source-materials/life-data-expert/glossary.md`
   - `source-materials/life-data-expert/references/expert_seminar/life_data_expert_slides_konsolidiert.md`
   - `source-materials/life-data-expert/references/expert_seminar/life_data_expert_training_structure.md`

## Schritt 1: Auftrag und Quellen klaeren

Codex bestimmt:

- Kurs, Modul, Kapitel und Lektion
- beauftragten Inhaltsumfang
- verbindliche Quellen
- bereits vorhandene Storyboard-Datei
- erwartete Szenen-ID-Logik
- offene fachliche oder didaktische Fragen

Wenn Quellen widerspruechlich oder unvollstaendig sind, werden Unsicherheiten nicht stillschweigend geschlossen, sondern in `assumptions` oder `open_questions` dokumentiert.

## Schritt 2: Szenenstruktur vorschlagen

Codex erstellt noch keinen finalen Sprechertext. Der Vorschlag enthaelt pro Szene:

- stabile oder vorgeschlagene `scene_id`
- Reihenfolge
- zentrale Aussage
- relevante Quellen
- didaktische Funktion im Ablauf
- sichtbare Textanker
- grober visueller Ansatz
- moegliche Animationstrigger
- Annahmen und offene Fragen

Komplexe Folien duerfen in mehrere Szenen aufgeteilt werden, wenn sie mehrere fachliche Teilschritte, Animationen, Diagramme oder Denkwechsel enthalten.

## Schritt 3: Nutzerreview abwarten

Der Nutzer kann Szenen zusammenlegen, aufteilen, verschieben, korrigieren oder freigeben.

Ohne Freigabe bleibt der Storyboardstatus bei `draft` oder `review`. Finale Sprechertexte werden nicht geschrieben.

## Schritt 4: Storyboard-JSON ausarbeiten

Nach Freigabe schreibt Codex die Storyboard-Datei nach `storyboards/storyboard.schema.json`.

Pro Szene muessen mindestens gepflegt werden:

- `narration.text` mit Sprechertext und sinnvollen Pausenmarkern
- `slide.visible_text` mit sichtbaren Textankern
- `visual.composition` mit konkreter Layoutbeschreibung
- `visual.svg_plan` mit produktionsnahen SVG-Elementen
- `visual.generated_assets` mit optionalen PNG-Vorschlaegen
- `animation_triggers` mit sprechertextnahen Trigger-Cues
- `assumptions`, `open_questions` und `review`

Sprechertexte werden in der Du-Form formuliert und folgen `workflow/speaker-text-language-rules.md`.

## Schritt 5: Qualitaetscheck

Vor Abschluss prueft Codex:

- keine erfundenen fachlichen Fakten
- keine unmarkierten Annahmen
- Storyboard-JSON folgt dem Schema
- Pausenmarker sind gueltig
- visuelle Vorschlaege sind konkret genug fuer die SVG-Produktion
- Textanker reichen aus, damit die Szene auch ohne Ton fachlich einordenbar ist
- PNG-Assets werden nur vorgeschlagen, wenn sie didaktisch wirklich sinnvoll sind
- Animationstrigger verwenden echte gesprochene Woerter, keine Pausenmarker

## Schritt 6: Uebergabe an Grafikworkflow

Der Grafikworkflow startet erst auf neue Nutzeraufforderung.

Beim Start liest der Production Orchestrator:

- freigegebene Storyboard-JSON-Datei
- beauftragte `scene_id`-Liste
- `narration.text`
- `slide.visible_text`
- `visual.composition`
- `visual.svg_plan`
- `visual.generated_assets`
- `animation_triggers`
- `assumptions` und `open_questions`

Danach gilt wieder `workflow/scene-by-scene-production-runbook.md`.

## Nicht erlaubt

- neue Storyboard-Excel-Dateien anlegen
- finale Sprechertexte ohne Strukturfreigabe erstellen
- SVGs oder PNGs im Storyboard-Workflow produzieren
- Szenenordner unter `assets/scenes/` ohne Start des Grafikworkflows anlegen
- fachliche Luecken ohne Kennzeichnung ergaenzen
